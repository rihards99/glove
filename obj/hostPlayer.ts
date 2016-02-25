module GameModule {
	export class HostPlayer extends Player {

		constructor(game: GameModule.Game, x: number, y: number) {
			super(game, x, y, 'knight');
		}
		
		isKeyDown(key: string): boolean {
			return this.game.input.keyboard.isDown(Phaser.Keyboard[key]);
		}
		
		// TODO: testing
		sword(){
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.canAttack) {
				this.canAttack = false;
				var sword = this.game.add.sprite(this.x, this.y, 'sword');
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