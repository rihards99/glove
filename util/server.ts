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
					that.addPeer(this);
				});
				this.conn.on('close', function(data) {
					console.log("Client disconnected");
					that.removePeer(this);
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

		syncState(state, projectiles) {
			this.broadcast({
				method: "syncState",
				params: {
					state: state,
					keyboard: this.state.keyboardState,
					projectiles: projectiles
				}
			});
		}
		
		placeTrap(coords) {
			this.broadcast({
				method: "placeTrap",
				params: {
					coords: coords
				}
			});
		}
		
		triggerTrap(playerKey, trapIndex) {
			this.broadcast({
				method: "triggerTrap",
				params: {
					playerKey: playerKey,
					trapIndex: trapIndex
				}
			});
		}
		
		shoot(x: number, y: number, direction: string) {
			this.broadcast({
				method: "shoot",
				params: {
					x: x,
					y: y,
					direction: direction
				}
			});
		}
		
		arrowDestroy(index: number) {
			this.broadcast({
				method: "arrowDestroy",
				params: {
					index: index
				}
			});
		}

		// Run when a connection is established
		private addPeer(conn) {
			var coords = this.randomCoords();

			conn.send({
				method: "initState",
				params: {
					player: coords,
					traps: this.state.getTraps(),
					peers: this.state.getPlayers()
				}
			});
			
			this.state.addPeer(conn.id, coords); // for host game
			this.broadcast({
				method: "addPeer",
				params: {
					id: conn.id,
					coords: coords
				}
			});
			this.connections[conn.id] = conn;
		}
		
		private removePeer(conn) {
			this.state.removePeer(conn.id); // for host game
			this.broadcast({
				method: "removePeer",
				params: {
					id: conn.id
				}
			});
		}
		
		private weaponSelect(params) {
			console.log("switch to " + params.weapon);
			switch(params.weapon) {
				case "sword":
					this.state.players[params.id].weapon = Weapon.SWORD;
					break;
				case "arrow":
					this.state.players[params.id].weapon = Weapon.ARROW;
					break;
				case "trap":
					this.state.players[params.id].weapon = Weapon.TRAP;
					break;
			}
			
		}
		
		private broadcast(params: Object) {
			for (var key in this.connections) {
				this.connections[key].send(params);
			}
		}
	}
}