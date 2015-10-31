module GameModule {
	export class HostPlayer extends Player {

		constructor(game: GameModule.Game, x: number, y: number) {
			super(game, x, y, 'knight');
		}

		update() {
			this.controls();
		}
	}
}