module GameModule {
	export class PeerPlayer extends Player {
		state: any; // could be either HostState or ClientState
		key: string;

		constructor(game: GameModule.Game, x: number, y: number, key:string) {
			super(game, x, y, 'knight2');
			this.key = key;
			this.state = game.state.getCurrentState();
		}
		
		isKeyDown(key: string): boolean {
			return this.state.keyboardState[this.key][key];
		}

		update() {
			this.controls();
			/*
			// TODO: refactor using the move* functions to keep it DRY
			// UP/DOWN controls
			this.slowDown('y');
			if (this.state.keyboardState[this.key].W) {
				this.body.velocity.y = -this.walkSpeed;
			}
			else if (this.state.keyboardState[this.key].S) {
				this.body.velocity.y = this.walkSpeed;
			}
			
			// LEFT/RIGHT controls
			this.slowDown('x');
			if (this.state.keyboardState[this.key].A) {
				this.body.velocity.x = -this.walkSpeed;

				if (this.scale.x == 1) {
					this.scale.x = -1;
				}
			}
			else if (this.state.keyboardState[this.key].D) {
				this.body.velocity.x = this.walkSpeed;

				if (this.scale.x == -1) {
					this.scale.x = 1;
				}
			}
			
			// TODO: TESTING
			if (this.state.keyboardState[this.key].E) {
				this.health -= 1;
			}
			
			if (this.state.keyboardState[this.key].Q) {
				this.health += 1;
			}
			*/
			super.update();
			
		}
	}
}