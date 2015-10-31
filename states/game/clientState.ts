module GameModule {
	export class ClientState extends State {
		player: ClientPlayer;
		client: Client;

		create() {
			super.create();
			this.client = new Client(this);
			this.client.start();
			this.setupControls();
		}

		initState(player, peers) {
			this.player = new ClientPlayer(this.game, player.x, player.y);

			for (var key in peers) {
				this.addPeer(key, peers[key])
			}
			this.activeUpdates = true;
		}

		syncState(players) {
			this.player.x = players[this.client.conn.id].x;
			this.player.y = players[this.client.conn.id].y;
			this.player.body.velocity.x = players[this.client.conn.id].dx;
			this.player.body.velocity.y = players[this.client.conn.id].dy;

			for(var key in players) {
				if (key === this.client.conn.id) continue;
				this.players[key].x = players[key].x;
				this.players[key].y = players[key].y;
				this.players[key].body.velocity.x = players[key].dx;
				this.players[key].body.velocity.y = players[key].dy;
			}
		}

		update() {
			if (this.activeUpdates) {
				super.update();
			}
		}

		setupControls() {
			var keys = ["W", "A", "S", "D"];
			for(var key of keys) {
				this.setKeyCallbacks(key);
			}
		}

		setKeyCallbacks(keyName) {
			var key = this.game.input.keyboard.addKey(Phaser.Keyboard[keyName]);
			var that = this;
			key.onDown.add(function() {
				that.client.input(keyName, true);
			}, this);
			key.onUp.add(function() {
				that.client.input(keyName, false);
			}, this);
		}
	}
}