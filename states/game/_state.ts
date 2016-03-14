module GameModule {
	export abstract class State extends Phaser.State {
		game: Game;
		// TODO: variable map size depending on the map layout
		worldWidth: number = Game.screenWidth;
		worldHeight: number = Game.screenHeight;
		
		player: Player;
		players: Object = {};
		keyboardState: Object = {};
		peerGroup: Phaser.Group;
		wallGroup: Phaser.Group;
		waterGroup: Phaser.Group;
		trapGroup: Phaser.Group;
		arrowGroup: Phaser.Group;
		activeUpdates: boolean = false;
		keys: any = ["W", "A", "S", "D", "E", "Q", "SPACEBAR"];
		attackTimeout: number = 200;
		trapTimeout: number = 2000;
		arrowSpeed: number = 200;

		create() {
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.game.stage.backgroundColor = '#000000';
			this.game.stage.disableVisibilityChange = true;
			
			this.peerGroup = this.game.add.group();
			this.peerGroup.enableBody = true;
			this.wallGroup = this.game.add.group();
			this.wallGroup.enableBody = true;
			this.waterGroup = this.game.add.group();
			this.waterGroup.enableBody = true;
			
			this.arrowGroup = this.game.add.group();
			this.arrowGroup.enableBody = true;
			this.trapGroup = this.game.add.group();
			this.trapGroup.enableBody = true;
			
			this.setupControls();
		}
		
		abstract setKeyCallbacks(keyName: string);
		abstract attack(sword: Phaser.Sprite);
		abstract triggerTrap(player: GameModule.Player, trap: Phaser.Sprite);

		addPeer(id, coords) {
			this.keyboardState[id] = this.getDefaultKeyboardObj();
			var peer = new PeerPlayer(this.game, coords.x, coords.y, id);
			this.players[id] = peer;
			this.peerGroup.add(peer);
		}
		
		// Also used in hostState
		getDefaultKeyboardObj(): Object {
			var keyboardObj = {};
			// current state of the player's controls. False => not pressed
			for(var key of this.keys) {
				keyboardObj[key] = false;
			}
			return keyboardObj;
		}
		
		removePeer(id) {
			this.players[id].bar.destroy();
			this.peerGroup.remove(this.players[id]);
			delete this.players[id];
		}
		
		initMap() {
			var map = [
				"XXXXXXXXXXXXXXXXXXXXXXXXX",
				"X.,,......,X,....,,,,,..X",
				"X.........,X,....,XXX,..X",
				"X..,X.....,X,....,,,X,..X",
				"X..,X.....,,,......,X,..X",
				"X..,X......,.......,X,..X",
				"X..,X,,,..,X,,,,,,,,,,..X",
				"X...XXX...,XXXX,,XXXX...X",
				"XWWWWWWW..,X,,,..WWWWW..X",
				"X......WW......WWW......X",
				"X..,,,,.WWW.,.WW..,,,...X",
				"X..,XXXXXXX,,XXXXXXX,...X",
				"X..,,,,X,,,,,,,,,,,,,...X",
				"X.....,X,...,X,.........X",
				"X...,,,,,...,X,.,,,.....X",
				"X...,X,,,,..,,,.,X,,,,..X",
				"X...,XXXX,......,XXXX,..X",
				"X...,,,,,,......,,,,,,..X",
				"XXXXXXXXXXXXXXXXXXXXXXXXX"
			];
			var x, y;
			for (y = 0; y < map.length; y++) {
				var line = map[y];
				for (x = 0; x < line.length; x++) {
					switch(line[x]) {
						case "X":
							var wall = this.wallGroup.add(
								new Phaser.Sprite(this.game, x*32, y*32, 'map', 82));
							wall.body.immovable = true;
							break;
						case "W":
							var wall = this.waterGroup.add(
								new Phaser.Sprite(this.game, x*32, y*32, 'map', 31));
							wall.body.immovable = true;
							break;
						case ".":
							this.game.add.sprite(x*32, y*32, 'map', 44);
							break;
						case ",":
							this.game.add.sprite(x*32, y*32, 'map', 26);
							break;
					}
				}
			}
			
			this.game.world.setBounds(0, 0, x*32, y*32);
			
			var world: any = this.game.world;
			world.bringToTop(this.arrowGroup);
			world.bringToTop(this.trapGroup);
			world.bringToTop(this.peerGroup);
		}
		
		setupControls() {
			for(var key of this.keys) {
				this.setKeyCallbacks(key);
			}
		}
		
		swordTimeout(sword: Phaser.Sprite) {
			this.game.time.events.add(this.attackTimeout, function(){
				sword.destroy();
			}, this);
		}

		update() {
			this.game.physics.arcade.collide(this.peerGroup, this.peerGroup);
			this.game.physics.arcade.collide(this.player, this.peerGroup);
			
			// Player colission with the walls and water
			this.game.physics.arcade.collide(this.peerGroup, this.wallGroup);
			this.game.physics.arcade.collide(this.player, this.wallGroup);
			this.game.physics.arcade.collide(this.peerGroup, this.waterGroup);
			this.game.physics.arcade.collide(this.player, this.waterGroup);
			
			this.game.ui.stunBar(this.player.trapTimer.duration, this.trapTimeout);
		}

		render() {}
	}
}