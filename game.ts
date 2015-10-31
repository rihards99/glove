module GameModule {
	export class Game extends Phaser.Game {
		static screenWidth: number = 800;
		static screenHeight: number = 600;
		public ui: Ui;
		public key: string;

		constructor() {
			super(Game.screenWidth, Game.screenHeight, Phaser.AUTO, 'content', null);
			this.ui = new Ui(this, Game.screenWidth, Game.screenHeight);

			this.state.add('Boot', Boot, false);
			this.state.add('Preloader', Preloader, false);
			this.state.add('MainMenu', MainMenu, false);
			this.state.add('HostState', HostState, false);
			this.state.add('ClientState', ClientState, false);

			this.state.start('Boot');
		}

		hostGame() {
			this.ui.clear();
			this.state.start('HostState', true, false);
			this.ui.drawGameUi();
		}

		joinGame(key) {
			this.key = key;
			this.ui.clear();
			this.state.start('ClientState', true, false);
			this.ui.drawGameUi();
		}
	}
} 