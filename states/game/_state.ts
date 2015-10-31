module GameModule {
	export class State extends Phaser.State {
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

			this.peerGroup = this.game.add.group();
			this.peerGroup.enableBody = true;
			this.peerGroup.setAll('body.customSeparateX', true);
			this.peerGroup.setAll('body.customSeparateY', true);
		}

		addPeer(id, coords) {
			this.keyboardState[id] = { W: false, A: false, S: false, D: false };
			var peer = new PeerPlayer(this.game, coords.x, coords.y, id);
			this.players[id] = peer;
			this.peerGroup.add(peer);
		}

		update() {
			// Player colission with the blocks
			this.game.physics.arcade.collide(this.peerGroup, this.peerGroup);
			this.game.physics.arcade.collide(this.player, this.peerGroup);
		}

		render() {}
	}
}