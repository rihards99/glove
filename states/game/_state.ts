module GameModule {
	export abstract class State extends Phaser.State {
		game: Game;
		player: Player;
		players: Object = {};
		keyboardState: Object = {};
		peerGroup: Phaser.Group;
		wallGroup: Phaser.Group;
		activeUpdates: boolean = false;
		keys: any = ["W", "A", "S", "D", "E", "Q", "SPACEBAR"];

		create() {
			this.game.world.setBounds(0, 0, 600, 800);
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.game.stage.backgroundColor = '#526F35'; // grass color
			this.game.stage.disableVisibilityChange = true;
			
			this.peerGroup = this.game.add.group();
			this.peerGroup.enableBody = true;
			
			this.setupControls();
		}
		
		abstract setKeyCallbacks(keyName: string);
		abstract attack(sword: Phaser.Sprite);

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
		
		setupControls() {
			for(var key of this.keys) {
				this.setKeyCallbacks(key);
			}
		}
		
		swordTimeout(sword: Phaser.Sprite) {
			this.game.time.events.add(200, function(){
				sword.destroy();
			}, this);
		}

		update() {
			// Player colission with the blocks
			this.game.physics.arcade.collide(this.peerGroup, this.peerGroup);
			this.game.physics.arcade.collide(this.player, this.peerGroup);
		}

		render() {}
	}
}