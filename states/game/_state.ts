module GameModule {
	export abstract class State extends Phaser.State {
		game: Game;
		player: Player;
		players: Object = {};
		keyboardState: Object = {};
		peerGroup: Phaser.Group;
		activeUpdates: boolean = false;

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

		addPeer(id, coords) {
			var keys = ["W", "A", "S", "D", "E", "Q"];
			this.keyboardState[id] = this.getDefaultKeyboardObj();
			var peer = new PeerPlayer(this.game, coords.x, coords.y, id);
			this.players[id] = peer;
			this.peerGroup.add(peer);
		}
		
		// Also used in hostState
		protected getDefaultKeyboardObj(): Object {
			var keys = ["W", "A", "S", "D", "E", "Q"];
			var keyboardObj = {};
			// current state of the player's controls. False => not pressed
			for(var key of keys) {
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
			var keys = ["W", "A", "S", "D", "E", "Q"];
			for(var key of keys) {
				this.setKeyCallbacks(key);
			}
		}

		update() {
			// Player colission with the blocks
			this.game.physics.arcade.collide(this.peerGroup, this.peerGroup);
			this.game.physics.arcade.collide(this.player, this.peerGroup);
		}

		render() {}
	}
}