module GameModule {
	export class Network {
		peer: any;
		conn: any;
		state: GameModule.Level1;
		
		connectTo(hostKey) {
			this.peer = new Peer({ key: 'q4mb7wppdhg2e29' });
			this.conn = this.peer.connect(hostKey);
			var that = this;
			this.conn.on('open', function() {
				console.log("Connected to host");
				console.log("Sending...");
			});
			
			this.conn.on('data', function(data) {
				that[data.method](data.params);
			});
		}
		
		// RECIEVE
		private initState(params) {
			this.state.initState(params.player, params.peers);
			console.log("spawn peers: ", params.peers);
			console.log("spawn you: ", params.player.x, params.player.y);
		}
		
		private spawnPeer(params) {
			this.state.spawnPeer(params);
			console.log("spawn peer at ", params.x, params.y);
		}
		
		private movePeer(params) {
			this.state.movePeer(params.id, params.x, params.y);
		}
		
		// SEND
		movePlayer(x, y) {
			this.conn.send({ method: "movePlayer",
				params: {
					id: this.conn.id,
					x: x,
					y: y
				}
			});
		}
	}
}