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
			this.initMap();
			this.player = new ClientPlayer(this.game, player.x, player.y);
			this.game.camera.follow(this.player);
			
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

		syncState(players: Object, projectiles: Object) {
			if (this.needsSync(this.player, players[this.client.conn.id])) {
				this.player.x = players[this.client.conn.id].x;
				this.player.y = players[this.client.conn.id].y;
			}
			this.player.body.velocity.x = players[this.client.conn.id].dx;
			this.player.body.velocity.y = players[this.client.conn.id].dy;
			this.player.health = players[this.client.conn.id].health;
			this.player.canDoAction = players[this.client.conn.id].canDoAction;
			
			// sync peer players
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
			
			// sync projectiles
			for (var i = 0; i < Object.keys(projectiles).length; i++) {
				if (this.needsSync(this.arrowGroup.getAt(i), projectiles[i])) {
					this.arrowGroup.getAt(i).x = projectiles[i].x;
					this.arrowGroup.getAt(i).y = projectiles[i].y;
				}
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
		
		shoot(x: number, y: number, direction: string) {
			var arrow = this.game.add.sprite(x, y, 'arrow');
			this.game.physics.enable(arrow);
			if (direction == "up") {
				arrow.x -= (arrow.width / 2);
				arrow.y -= arrow.height * 1.5;
				arrow.body.velocity.y = -this.arrowSpeed;
			}
			else if (direction == "down") {
				arrow.angle += 180;
				arrow.x += (arrow.width / 2);
				arrow.y += arrow.height * 1.5;
				arrow.body.setSize(arrow.width, arrow.height, -arrow.width, -arrow.height);
				arrow.body.velocity.y = this.arrowSpeed;
			}
			else if (direction == "left") {
				arrow.angle += 270;
				arrow.x -= arrow.height * 1.5;
				arrow.y += (arrow.width / 2);
				arrow.body.setSize(arrow.height, arrow.width, 0, -arrow.width);
				arrow.body.velocity.x = -this.arrowSpeed;
			}
			else if (direction == "right") {
				arrow.angle += 90;
				arrow.x += arrow.height * 1.5;
				arrow.y -= (arrow.width / 2);
				arrow.body.setSize(arrow.height, arrow.width, -arrow.height, 0);
				arrow.body.velocity.x = this.arrowSpeed;
			}
			this.arrowGroup.add(arrow);
		}
		
		arrowDestroy(index: number) {
			var arrow = this.arrowGroup.getAt(index);
			this.arrowGroup.remove(arrow);
			arrow.destory;
		}
		
		placeTrap(coords) {
			var trap = new Trap(this.game, null, coords.x, coords.y)
			if (!this.activeUpdates) {
				trap.alpha = 0;
			}
			else {
				this.game.add.tween(trap).to( { alpha: 0 }, 2000, "Linear", true);
			}
			this.trapGroup.add(trap);
		}
		
		triggerTrap(playerKey, trapIndex) {
			var trap = this.trapGroup.getAt(trapIndex);
			this.trapGroup.remove(trap, true);
			if (playerKey == this.client.conn.id) {
				this.player.setTrapTimer(this.trapTimeout);
			}
			else {
				this.players[playerKey].setTrapTimer(this.trapTimeout);
			}
		}
		
		weaponSelect(weapon: string) {
			this.client.weaponSelect(weapon);
		}
	}
}