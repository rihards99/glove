module GameModule {
	export class HostState extends State {
		player: HostPlayer;
		server: Server;
		bar: any;
		barProgress: number = 128;

		create() {
        	// this.bar = this.add.bitmapData(128, 8);
        	// this.game.add.sprite(this.game.world.centerX - (this.bar.width * 0.5), this.game.world.centerY, this.bar);
        	// this.game.add.tween(this).to({barProgress: 0}, 2000, null, true, 0, Infinity);
			
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
				
				
				// this.bar.context.clearRect(0, 0, this.bar.width, this.bar.height);
        		// some simple colour changing to make it look like a health bar
		        // this.bar.context.fillStyle = '#f00';
		        // draw the bar
		        // this.bar.context.fillRect(0, 0, this.barProgress, 8);
		        // important - without this line, the context will never be updated on the GPU when using webGL
		        // this.bar.dirty = true;
			}
		}
	}
}