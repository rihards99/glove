module GameModule {
	export class Player extends Phaser.Sprite {
		walkSpeed: number = 150;

		constructor(game: GameModule.Game, x: number, y: number, sprite: string) {
			super(game, x, y, sprite, 0);
			this.anchor.setTo(0.5, 0.5);
			game.add.existing(this);
			game.physics.enable(this, Phaser.Physics.ARCADE);
			this.body.width = 25;
		}

		controls() {
			// UP/DOWN controls
			this.body.velocity.y = 0;
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
				this.body.velocity.y = -this.walkSpeed;
			}
			else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
				this.body.velocity.y = this.walkSpeed;
			}
			
			// LEFT/RIGHT controls
			this.body.velocity.x = 0;
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
				this.body.velocity.x = -this.walkSpeed;

				if (this.scale.x == 1) {
					this.scale.x = -1;
				}
			}
			else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
				this.body.velocity.x = this.walkSpeed;

				if (this.scale.x == -1) {
					this.scale.x = 1;
				}
			}
		}
	}
}