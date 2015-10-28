module GameModule {
	export class Server {
		public game: Game;
		public peer: any;
		public connections: Object = {};

		constructor(game) {
			this.game = game;
		}
		
		start() {
			this.peer = new Peer({ key: 'q4mb7wppdhg2e29' });
			var that = this;
			this.peer.on('open', function(id) {
				console.log("Server started with id " + id);
				that.game.joinGame(id);
			});

			this.peer.on('connection', function(conn) {
				this.conn = conn;
				this.conn.on('open', function() {
					console.log("Client connected");
					that.addNewPlayer(this);
				});
				this.conn.on('data', function(data) {
					that[data.method](data.params);
				});
			});
		}

		addNewPlayer(conn) {
			var xLoc = Math.floor((Math.random() * Game.screenWidth - 50) + 50);
			var yLoc = Math.floor((Math.random() * Game.screenHeight - 50) + 50);
			
			this.broadcast({ method: "spawnPeer",
				params: {
					id: conn.id,
					x: xLoc,
					y: yLoc
				}
			});
			
			conn.send({ method: "initState",
				params: {
					peers: this.getState(),
					player: {x: xLoc, y: yLoc}
				}
			});
			
			this.connections[conn.id] = {
				conn: conn,
				x: xLoc,
				y: yLoc
			}			
		}
		
		getState() {
			var players = [];
			for (var key in this.connections) {
				players.push({
					id: key,
					x: this.connections[key].x,
					y: this.connections[key].y
				});
			}
			return players;
		}
		
		private movePlayer(params: any) {
			this.connections[params.id].x = params.x;
			this.connections[params.id].y = params.y;
			this.broadcast({ method: "movePeer",
				params: params
			});
		}
		
		private broadcast(params: Object) {
			for (var key in this.connections) {
				this.connections[key].conn.send(params);
			}
		}
	}
}