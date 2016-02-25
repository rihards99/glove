module GameModule {
	export class ClientState extends State {
		player: ClientPlayer;
		client: Client;

		create() {
			super.create();
			this.client = new Client(this);
			this.client.start();
		}

		initState(player, peers) {
			this.player = new ClientPlayer(this.game, player.x, player.y);

			for (var key in peers) {
				this.addPeer(key, peers[key])
			}
			this.activeUpdates = true;
		}

		syncState(players: Object) {
			if (this.needsSync(this.player, players[this.client.conn.id])) {
				this.player.x = players[this.client.conn.id].x;
				this.player.y = players[this.client.conn.id].y;
			}
			this.player.body.velocity.x = players[this.client.conn.id].dx;
			this.player.body.velocity.y = players[this.client.conn.id].dy;
			this.player.health = players[this.client.conn.id].health;

			for(var key in players) {
				if (key === this.client.conn.id) continue;
				if (this.needsSync(this.players[key], players[key])) {
					this.players[key].x = players[key].x;
					this.players[key].y = players[key].y;
				}
				this.players[key].body.velocity.x = players[key].dx;
				this.players[key].body.velocity.y = players[key].dy;
				this.players[key].health = players[key].health;
			}
		}
		
		private needsSync(local: Phaser.Sprite, remote:Phaser.Sprite): boolean {
			var width = local.width;
			var height = local.height;
			var dX = local.x - remote.x;
			var dY = local.y - remote.y;
			
			if (dX > width || dX < (width*(-1))) return true;
			if (dY > height || dY < (height*(-1))) return true;
			return false
		}

		update() {
			if (this.activeUpdates) {
				super.update();
			}
		}

		setKeyCallbacks(keyName: string) {
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