module GameModule {
	export class Player extends Phaser.Sprite {
		walkSpeed: number = 150;
		slowDownSpeed: number = 15; // Needs to be a fraction of the walk speed.
		
		bar: any;
		health: number = 100;
		maxHealth: number = 100;
		barHeight: number = 5;
		barWidth: number = 40;

		constructor(game: GameModule.Game, x: number, y: number, sprite: string) {
			super(game, x, y, sprite, 0);
			this.anchor.setTo(0.5, 0.5);
			game.add.existing(this);
			game.physics.enable(this, Phaser.Physics.ARCADE);
			this.body.width = 25;
			// the creation position of the bar isn't important, since it gets updated every cycle
        	this.bar = game.add.sprite(0, 0, this.getHealthBar());
		}

		controls() {
			// UP/DOWN controls
			this.slowDown('y');
			this.frame = 1;
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
				this.body.velocity.y = -this.walkSpeed;
				this.frame = 0;
			}
			else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
				this.body.velocity.y = this.walkSpeed;
			}
			
			// LEFT/RIGHT controls
			this.slowDown('x');
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
				this.body.velocity.x = -this.walkSpeed;
				this.frame = 2;
			}
			else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
				this.body.velocity.x = this.walkSpeed;
				this.frame = 3;
			}
			
			// TODO: TESTING
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.E)) {
				this.health -= 1;
			}
			
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
				this.health += 1;
			}
			
			this.bar.x = this.x - (this.barWidth * 0.5);
			this.bar.y = this.y - 30;
			this.bar.loadTexture(this.getHealthBar());
		}
		
		getHealthBar(): Phaser.BitmapData {
			var bmd = this.game.make.bitmapData(this.barWidth, this.barHeight);
			bmd.context.fillStyle = '#000';
			bmd.context.fillRect(0, 0, this.barWidth, this.barHeight);
			var percent = this.health / this.maxHealth
			if (percent < 0.3)
	        	bmd.context.fillStyle = '#f00'; // red
	        else if (percent < 0.6)
	        	bmd.context.fillStyle = '#ff0'; // yellow
	        else 
	        	bmd.context.fillStyle = '#0f0'; // green
	        
			bmd.context.fillRect(0, 0, percent * this.barWidth, this.barHeight);
			return bmd
		}

		protected slowDown(coord) {
			if (this.body.velocity[coord] > 0) {
				this.body.velocity[coord] -= this.slowDownSpeed;
			}
			else if (this.body.velocity[coord] < 0) {
				this.body.velocity[coord] += this.slowDownSpeed;
			}
		}
	}
}