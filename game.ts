module GameModule {
	export class Game extends Phaser.Game {
		static screenWidth: number = 800;
		static screenHeight: number = 600;
		public ui: Ui;
		public server: Server;
		public network: Network;

		constructor() {
			super(Game.screenWidth, Game.screenHeight, Phaser.AUTO, 'content', null);
			this.ui = new Ui(this, Game.screenWidth, Game.screenHeight);

			this.state.add('Boot', Boot, false);
			this.state.add('Preloader', Preloader, false);
			this.state.add('MainMenu', MainMenu, false);
			this.state.add('Level1', Level1, false);

			this.state.start('Boot');
		}

		hostGame() {
			this.server = new Server(this);
			this.server.start();
		}

		joinGame(key) {
			this.network = new Network();
			this.network.connectTo(key);
			this.startGame();
			this.ui.displayHostKey(key);
		}

		startGame() {
			this.ui.clear();
			this.state.start('Level1', true, false);
		}
	}
} 