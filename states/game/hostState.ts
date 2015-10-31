module GameModule {
	export class HostState extends State {
		player: HostPlayer;
		server: Server;

		create() {
			this.server = new Server(this);
			this.server.start();
			super.create();
		}

		initState() { // run after server.start()
			var coords = this.server.randomCoords();
			this.player = new HostPlayer(this.game, coords.x, coords.y);
			this.activeUpdates = true;
		}

		getPlayers() {
			var temp = {};
			temp[this.server.peer.id] = {
				x: this.player.x,
				y: this.player.y,
				dx: this.player.body.velocity.x,
				dy: this.player.body.velocity.y
			};
			for (var key in this.players) {
				temp[key] = {
					x: this.players[key].x, 
					y: this.players[key].y,
					dx: this.players[key].body.velocity.x,
					dy: this.players[key].body.velocity.y
				};
			}
			return temp;
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