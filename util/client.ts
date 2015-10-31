module GameModule {
	export class Client {
		state: ClientState;
		peer: any;
		conn: any;
		
		constructor(state) {
			this.state = state;
		}

		start() {
			this.peer = new Peer({ key: 'q4mb7wppdhg2e29' });
			this.conn = this.peer.connect(this.state.game.key);
			var that = this;
			this.conn.on('open', function() {
				console.log("Connected to host");
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

		private syncState(params) {
			this.state.syncState(params.state);
		}

		// SEND
		input(key, isDown) {
			this.conn.send({
				method: "input",
				params: {
					id: this.conn.id,
					key: key,
					state: isDown
				}
			});
		}
	}
}