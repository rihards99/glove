module GameModule {
	export class HostState extends State {
		player: HostPlayer;
		server: Server;
		bar: any;
		barProgress: number = 128;

		create() {
			this.server = new Server(this);
			this.server.start();
			super.create();
		}

		initState() { // run after server.start()
			var coords = this.server.randomCoords();
			this.player = new HostPlayer(this.game, coords.x, coords.y);
			this.keyboardState[this.server.peer.id] = this.getDefaultKeyboardObj();
			this.activeUpdates = true;
		}

		getPlayers(): Object {
			var temp = {};
			temp[this.server.peer.id] = {
				x: this.player.x,
				y: this.player.y,
				dx: this.player.body.velocity.x,
				dy: this.player.body.velocity.y,
				health: this.player.health,
				canDoAction: this.player.canDoAction
			};
			for (var key in this.players) {
				temp[key] = {
					x: this.players[key].x, 
					y: this.players[key].y,
					dx: this.players[key].body.velocity.x,
					dy: this.players[key].body.velocity.y,
					health: this.players[key].health,
					canDoAction: this.players[key].canDoAction
				};
			}
			return temp;
		}
		
		getTraps(): Object {
			var temp = {};
			for (var i = 0; i < this.trapGroup.total; i++) {
				temp[i] = {
					x: this.trapGroup.getAt(i).x,
					y: this.trapGroup.getAt(i).y
				}
			}
			return temp;
		}
		
		setKeyCallbacks(keyName: string) {
			var key = this.game.input.keyboard.addKey(Phaser.Keyboard[keyName]);
			var that = this;
			key.onDown.add(function() {
				that.keyboardState[that.server.peer.id][keyName] = true;
			}, this);
			key.onUp.add(function() {
				that.keyboardState[that.server.peer.id][keyName] = false;
			}, this);
		}
		
		attack(sword: Phaser.Sprite) {
			this.checkHit(sword, this.player);
			for (var key in this.players) {
				this.checkHit(sword, this.players[key]);
			}
			
			this.swordTimeout(sword);
		}
		
		checkHit(sword: Phaser.Sprite, player: Phaser.Sprite) {
			if (this.game.physics.arcade.overlap(sword, player)) {
				player.health -= 10;
			}
		}
		
		placeTrap(player: Player) {
			var trap = this.game.add.sprite(0, 0, 'trap');
			trap.anchor.setTo(0.5, 0.5);
			trap.x = player.x;
			trap.y = player.y;
			if (player.direction == Direction.UP) {
				trap.y -= player.height;
			}
			else if (player.direction == Direction.DOWN) {
				trap.y += player.height;
			}
			else if (player.direction == Direction.LEFT) {
				trap.x -= player.width;
			}
			else if (player.direction == Direction.RIGHT) {
				trap.x += player.width;
			}
			this.game.add.tween(trap).to( { alpha: 0 }, 2000, "Linear", true);
			this.server.placeTrap({x: trap.x, y: trap.y});
			this.game.physics.enable(trap);
			this.trapGroup.add(trap);
		}
		
		triggerTrap(player: GameModule.Player, trap: Phaser.Sprite) {
			this.server.triggerTrap(player.key, this.trapGroup.getIndex(trap));
			this.trapGroup.remove(trap, true);
			player.health -= 5;
			player.setMoveTimeout(this.trapTimeout);
		}

		update() {
			if (this.activeUpdates) {
				super.update();
				this.game.physics.arcade.overlap(this.peerGroup, this.trapGroup, 
					this.triggerTrap, null, this);
				this.game.physics.arcade.overlap(this.player, this.trapGroup, 
					this.triggerTrap, null, this);
				// Broadcast the current state
				this.server.syncState(this.getPlayers());
			}
		}
	}
}