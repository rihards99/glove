module GameModule {
	export class Server {
		state: HostState;
		peer: any;
		connections: Object = {};
		keyboardState: Object = {};

		constructor(state) {
			this.state = state;
		}
		
		start() {
			this.peer = new Peer({ key: 'q4mb7wppdhg2e29' });
			var that = this;
			this.peer.on('open', function(id) {
				console.log("Server started with id " + id);
				that.state.game.ui.setHostKey(id);
				that.state.initState();
			});

			this.peer.on('connection', function(conn) {
				this.conn = conn;
				this.conn.on('open', function() {
					console.log("Client connected");
					that.addPlayer(this);
				});
				this.conn.on('close', function(data) {
					console.log("Client disconnected");
					that.removePlayer(this);
				});
				this.conn.on('data', function(data) {
					that[data.method](data.params);
				});
				
				window.onunload = function() {
					that.peer.destroy();
				};
			});
		}

		randomCoords() {
			return {
				x: Math.floor((Math.random() * Game.screenWidth - 50) + 50),
				y: Math.floor((Math.random() * Game.screenHeight - 50) + 50)
			}
		}

		input(params) {
			this.state.keyboardState[params.id][params.key] = params.state;
		}

		syncState(state) {
			this.broadcast({
				method: "syncState",
				params: {
					state: state
				}
			});
		}

		private addPlayer(conn) {
			var coords = this.randomCoords();
			
			conn.send({
				method: "initState",
				params: {
					peers: this.state.getPlayers(),
					player: coords
				}
			});
			
			this.state.addPeer(conn.id, coords); // for host game
			this.connections[conn.id] = conn;
		}
		
		// TODO: review this function
		private removePlayer(conn) {
			this.state.removePeer(conn.id); // for host game
			conn.send({
				method: "removePlayer",
				params: {
					id: conn.id,
				}
			});
		}
		
		private broadcast(params: Object) {
			for (var key in this.connections) {
				this.connections[key].send(params);
			}
		}
	}
}