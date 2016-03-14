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
			this.state.initState(params.player, params.traps, params.peers);
		}

		private syncState(params) {
			this.state.keyboardState = params.keyboard;
			this.state.syncState(params.state, params.projectiles);
		}
		
		private addPeer(params) {
			this.state.addPeer(params.id, params.coords)
		}
		
		private removePeer(params) {
			this.state.removePeer(params.id)
		}
		
		private placeTrap(params) {
			this.state.placeTrap(params.coords)
		}
		
		private triggerTrap(params) {
			this.state.triggerTrap(params.playerKey, params.trapIndex)
		}
		
		private shoot(params) {
			this.state.shoot(params.x, params.y, params.direction);
		}
		
		private arrowDestroy(params) {
			this.state.arrowDestroy(params.index);
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
		
		weaponSelect(weapon: string) {
			console.log("send weapon " + weapon);
			this.conn.send({
				method: "weaponSelect",
				params: {
					id: this.conn.id,
					weapon: weapon
				}
			});
		}
	}
}