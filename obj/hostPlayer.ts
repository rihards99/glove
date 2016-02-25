module GameModule {
	enum Direction {UP, DOWN, LEFT, RIGHT};
	export class HostPlayer extends Player {

		constructor(game: GameModule.Game, x: number, y: number) {
			super(game, x, y, 'knight');
		}
		
		// Check state of key locally
		isKeyDown(key: string): boolean {
			return this.game.input.keyboard.isDown(Phaser.Keyboard[key]);
		}
		
		// TODO: testing
		sword(){
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.canAttack) {
				this.canAttack = false;
				var sword = null;
				if (this.direction == Direction.UP) {
					sword = this.game.add.sprite(this.x, this.y, 'sword');
					sword.x -= (sword.width / 2);
					sword.y -= sword.height * 1.5;
				}
				else if (this.direction == Direction.DOWN) {
					sword = this.game.add.sprite(this.x, this.y, 'sword');
					sword.angle += 180;
					sword.x += (sword.width / 2);
					sword.y += sword.height * 1.5;
				}
				else if (this.direction == Direction.LEFT) {
					sword = this.game.add.sprite(this.x, this.y, 'sword');
					sword.angle += 270;
					sword.x -= sword.height * 1.5;
					sword.y += (sword.width / 2);
				}
				else if (this.direction == Direction.RIGHT) {
					sword = this.game.add.sprite(this.x, this.y, 'sword');
					sword.angle += 90;
					sword.x += sword.height * 1.5;
					sword.y -= (sword.width / 2);
				}
				console.log(sword.width);
				this.game.time.events.add(200, function(){
					sword.destroy();
				}, this);
			}
			else if (!this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.canAttack) {
				this.canAttack = true;
			}
		}

		update() {
			this.controls();
			this.sword();
			super.update();
		}
	}
}