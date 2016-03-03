module GameModule {
	export class ClientPlayer extends Player {

		constructor(game: GameModule.Game, x: number, y: number) {
			super(game, x, y, 'knight');
		}
		
		// Check state of key locally
		isKeyDown(key: string): boolean {
			return this.game.input.keyboard.isDown(Phaser.Keyboard[key]);
		}
		
		// Overrides to turn off placing trap on clientside
		checkTrap() {}

		update() {
			super.update();
		}
	}
}