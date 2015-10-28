module GameModule {

	export class Player extends Phaser.Sprite {
		walkSpeed: number = 150;
		game: Game;

		constructor(game: GameModule.Game, x: number, y: number) {
			super(game, x, y, 'knight', 0);
			this.anchor.setTo(0.5, 0.5);
			// this.animations.add('walk', [5, 6, 7, 8], 10, true);
			game.add.existing(this);
			game.physics.enable(this, Phaser.Physics.ARCADE);
			// this.body.gravity.y = 2000;
			this.body.width = 25;
		}

		update() {
			// UP/DOWN controls
			this.body.velocity.y = 0;
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
				this.body.velocity.y = -this.walkSpeed;
				// this.animations.play('walk');

				// if (this.scale.y == 1) {
				// 	this.scale.y = -1;
				// }
			}
			else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
				this.body.velocity.y = this.walkSpeed;
				// this.animations.play('walk');

				// if (this.scale.y == -1) {
				// 	this.scale.y = 1;
				// }
			}
			else {
				
				this.animations.frame = 4;
			}
			
			// LEFT/RIGHT controls
			this.body.velocity.x = 0;
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
				this.body.velocity.x = -this.walkSpeed;
				// this.animations.play('walk');

				if (this.scale.x == 1) {
					this.scale.x = -1;
				}
			}
			else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
				this.body.velocity.x = this.walkSpeed;
				// this.animations.play('walk');

				if (this.scale.x == -1) {
					this.scale.x = 1;
				}
			}
			else {
				this.animations.frame = 4;
			}
			
			if (this.body.velocity.x || this.body.velocity.y) {
				this.game.network.movePlayer(this.x, this.y);
			}

			// if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.body.touching.down) {
			// 	this.body.velocity.y = -400;
			// }
		}
	}
}