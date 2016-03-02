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
				health: this.player.health
			};
			for (var key in this.players) {
				temp[key] = {
					x: this.players[key].x, 
					y: this.players[key].y,
					dx: this.players[key].body.velocity.x,
					dy: this.players[key].body.velocity.y,
					health: this.players[key].health
				};
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
			// console.log({
			// 	x: sword.body.x,
			// 	y: sword.body.y,
			// 	width: sword.body.width,
			// 	height: sword.body.height
			// });
			for (var key in this.players) {
				this.checkHit(sword, this.players[key]);
			}
			
			this.swordTimeout(sword);
		}
		
		checkHit(sword: Phaser.Sprite, player: Phaser.Sprite) {
			if (this.game.physics.arcade.overlap(sword, player)) {
				console.log("hit " + player.key);
				player.health -= 10;
			}
		}

		update() {
			if (this.activeUpdates) {
				super.update();
				// Broadcast the current state
				this.server.syncState(this.getPlayers());
			}
		}
	}
}