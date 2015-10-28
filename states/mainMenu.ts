module GameModule {

	export class MainMenu extends Phaser.State {
		public game: GameModule.Game;
		
		create() {
			this.game.ui.drawMainMenu();
		}
	}
}