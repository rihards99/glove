module GameModule {
	export class PeerPlayer extends Player {
		state: any; // could be either HostState or ClientState
		key: string;

		constructor(game: GameModule.Game, x: number, y: number, key:string) {
			super(game, x, y, 'knight2');
			this.key = key;
			this.state = game.state.getCurrentState();
		}
		
		// Check the keyboard state delivered by the server
		isKeyDown(key: string): boolean {
			return this.state.keyboardState[this.key][key];
		}

		update() {
			super.update();
		}
	}
}