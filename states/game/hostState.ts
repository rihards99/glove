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
			this.initMap();
			var coords = this.server.randomCoords();
			this.player = new HostPlayer(this.game, coords.x, coords.y);
			this.game.camera.follow(this.player);
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
		
		getProjectiles(): Object {
			var temp = {};
			for (var i = 0; i < this.arrowGroup.total; i++) {
				temp[i] = {
					x: this.arrowGroup.getAt(i).x,
					y: this.arrowGroup.getAt(i).y
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
		
		arrowHit(player: GameModule.Player, arrow: Phaser.Sprite) {
			this.arrowDestroy(arrow);
			player.health -= 10;
		}
		
		arrowDestroy(arrow) {
			this.server.arrowDestroy(this.arrowGroup.getIndex(arrow));
			// For some reason calling destroy() doesn't work but calling the
			// function like a parameter works.
			this.arrowGroup.remove(arrow);
			arrow.destory;
		}
		
		shoot(player: Player) {
			var arrow = this.game.add.sprite(player.x, player.y, 'arrow');
			this.game.physics.enable(arrow);
			if (player.direction == Direction.UP) {
				arrow.x -= (arrow.width / 2);
				arrow.y -= arrow.height * 1.5;
				arrow.body.velocity.y = -this.arrowSpeed;
			}
			else if (player.direction == Direction.DOWN) {
				arrow.angle += 180;
				arrow.x += (arrow.width / 2);
				arrow.y += arrow.height * 1.5;
				arrow.body.setSize(arrow.width, arrow.height, -arrow.width, -arrow.height);
				arrow.body.velocity.y = this.arrowSpeed;
			}
			else if (player.direction == Direction.LEFT) {
				arrow.angle += 270;
				arrow.x -= arrow.height * 1.5;
				arrow.y += (arrow.width / 2);
				arrow.body.setSize(arrow.height, arrow.width, 0, -arrow.width);
				arrow.body.velocity.x = -this.arrowSpeed;
			}
			else if (player.direction == Direction.RIGHT) {
				arrow.angle += 90;
				arrow.x += arrow.height * 1.5;
				arrow.y -= (arrow.width / 2);
				arrow.body.setSize(arrow.height, arrow.width, -arrow.height, 0);
				arrow.body.velocity.x = this.arrowSpeed;
			}
			
			this.arrowGroup.add(arrow);
			var dirString = null;
			if (player.direction == Direction.UP) dirString = "up"
			else if (player.direction == Direction.DOWN) dirString = "down"
			else if (player.direction == Direction.LEFT) dirString = "left"
			else if (player.direction == Direction.RIGHT) dirString = "right";
			this.server.shoot(arrow.x, arrow.y, dirString);
		}
		
		placeTrap(player: Player) {
			var trap = new Trap(this.game, player);
			this.game.add.tween(trap).to( { alpha: 0 }, 2000, "Linear", true);
			this.server.placeTrap({x: trap.x, y: trap.y});
			this.trapGroup.add(trap);
		}
		
		triggerTrap(player: GameModule.Player, trap: Phaser.Sprite) {
			this.server.triggerTrap(player.key, this.trapGroup.getIndex(trap));
			this.trapGroup.remove(trap, true);
			player.health -= 5;
			player.setTrapTimer(this.trapTimeout);
		}

		update() {
			if (this.activeUpdates) {
				this.game.physics.arcade.overlap(this.peerGroup, this.trapGroup, 
					this.triggerTrap, null, this);
				this.game.physics.arcade.overlap(this.player, this.trapGroup, 
					this.triggerTrap, null, this);
					
				this.game.physics.arcade.overlap(this.arrowGroup, this.wallGroup, 
					this.arrowDestroy, null, this);
				this.game.physics.arcade.collide(this.peerGroup, this.arrowGroup, 
					this.arrowHit, null, this);
				this.game.physics.arcade.collide(this.player, this.arrowGroup, 
					this.arrowHit, null, this);
				super.update();
				// Broadcast the current state
				this.server.syncState(this.getPlayers(), this.getProjectiles());
			}
		}
	}
}