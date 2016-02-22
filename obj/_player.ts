module GameModule {
	export class Player extends Phaser.Sprite {
		walkSpeed: number = 150;
		slowDownSpeed: number = 15; // Needs to be a fraction of the walk speed.

		constructor(game: GameModule.Game, x: number, y: number, sprite: string) {
			super(game, x, y, sprite, 0);
			this.anchor.setTo(0.5, 0.5);
			game.add.existing(this);
			game.physics.enable(this, Phaser.Physics.ARCADE);
			this.body.width = 25;
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