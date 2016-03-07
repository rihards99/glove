module GameModule {
	//enum Direction {UP, DOWN, LEFT, RIGHT};
	export class HostPlayer extends Player {

		constructor(game: GameModule.Game, x: number, y: number) {
			super(game, x, y, 'knight');
		}
		
		// Check state of key locally
		isKeyDown(key: string): boolean {
			return this.game.input.keyboard.isDown(Phaser.Keyboard[key]);
		}
		
		update() {
			super.update();
		}
	}
}