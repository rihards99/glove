module GameModule {
	export class HostPlayer extends Player {

		constructor(game: GameModule.Game, x: number, y: number) {
			super(game, x, y, 'knight');
		}
		
		isKeyDown(key: string): boolean {
			return this.game.input.keyboard.isDown(Phaser.Keyboard[key]);
		}

		update() {
			this.controls();
			super.update();
		}
	}
}