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
			
			window.onunload = function(){
				that.conn.close();
				that.peer.destroy();
			};
		}
		
		// RECIEVE
		private initState(params) {
			this.state.initState(params.player, params.peers);
		}

		private syncState(params) {
			this.state.keyboardState = params.keyboard;
			this.state.syncState(params.state);
		}
		
		private addPeer(params) {
			this.state.addPeer(params.id, params.coords)
		}
		
		private removePeer(params) {
			this.state.removePeer(params.id)
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