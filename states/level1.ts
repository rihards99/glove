module GameModule {

	export class Level1 extends Phaser.State {
		background: Phaser.Sprite;
		music: Phaser.Sound;
		player: Player;
		game: Game;
		peers: Object = {};
		peerGroup: Phaser.Group;

		create() {
			this.game.network.state = this;
			this.game.world.setBounds(0, 0, 600, 800);
			this.game.stage.backgroundColor = '#7ec0ee';
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.peerGroup = this.game.add.group();
			this.peerGroup.enableBody = true;
		}

		update() {
			var d = new Date();
			console.log(d.getMilliseconds());
			// Player colission with the blocks
			this.game.physics.arcade.collide(this.player, this.peerGroup);
		}

		render() {}
		
		initState(player, peers: Array<Object>){
			this.player = new Player(this.game, player.x, player.y);
			for (var peer of peers) {
				this.spawnPeer(peer);
			}
		}
		
		spawnPeer(peer){
			this.peers[peer.id] = new PeerPlayer(this.game, peer.x, peer.y);
			this.peerGroup.add(this.peers[peer.id]);
		}
		
		movePeer(id, x, y) {
			if (this.peers[id]){
				console.log(x,y);
				this.peers[id].x = x;
				this.peers[id].y = y;
			}
		}
	}
}