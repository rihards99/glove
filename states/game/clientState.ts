module GameModule {
	export class ClientState extends State {
		player: ClientPlayer;
		client: Client;

		create() {
			super.create();
			this.client = new Client(this);
			this.client.start();
		}

		initState(player, traps, peers) {
			this.player = new ClientPlayer(this.game, player.x, player.y);

			for (var key in peers) {
				this.addPeer(key, peers[key])
			}
			
			for (var key in traps) {
				this.placeTrap({
					x: traps[key].x, 
					y: traps[key].y
				});
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
			this.player.canDoAction = players[this.client.conn.id].canDoAction;

			for(var key in players) {
				if (key === this.client.conn.id) continue;
				if (this.needsSync(this.players[key], players[key])) {
					this.players[key].x = players[key].x;
					this.players[key].y = players[key].y;
				}
				this.players[key].body.velocity.x = players[key].dx;
				this.players[key].body.velocity.y = players[key].dy;
				this.players[key].health = players[key].health;
				this.players[key].canDoAction = players[key].canDoAction;
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
		
		attack(sword: Phaser.Sprite) {
			this.swordTimeout(sword);
		}
		
		shoot(player: Player) {
			
		}
		
		placeTrap(coords) {
			var trap = this.game.add.sprite(0, 0, 'trap');
			trap.anchor.setTo(0.5, 0.5);
			trap.x = coords.x;
			trap.y = coords.y;
			if (!this.activeUpdates) {
				trap.alpha = 0
			}
			else {
				this.game.add.tween(trap).to( { alpha: 0 }, 2000, "Linear", true);
			}
			this.game.physics.enable(trap);
			this.trapGroup.add(trap);
		}
		
		triggerTrap(playerKey, trapIndex) {
			var trap = this.trapGroup.getAt(trapIndex);
			this.trapGroup.remove(trap, true);
			if (playerKey == this.client.conn.id) {
				this.player.setMoveTimeout(this.trapTimeout);
			}
			else {
				this.players[playerKey].setMoveTimeout(this.trapTimeout);
			}
		}
	}
}