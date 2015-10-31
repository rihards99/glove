module GameModule {
	export class ClientPlayer extends Player {

		constructor(game: GameModule.Game, x: number, y: number) {
			super(game, x, y, 'knight');
		}

		update() {
			this.controls();
		}

		setupControls() {
 	
			// MOVE LEFT
			this.setKeyCallbacks(function(key) {
				this.body.velocity.x = -this.walkSpeed;
				console.log(key);
				this.scale.x = -1;
			}, function(key) { this.body.velocity.x = 0; }, "A");

			// MOVE RIGHT
			this.setKeyCallbacks(function(key) {
				this.body.velocity.x = this.walkSpeed;
				this.scale.x = 1;
			}, function(key) { this.body.velocity.x = 0; }, "D");

			// MOVE UP
			this.setKeyCallbacks(function(key) {
				this.body.velocity.y = -this.walkSpeed;
			}, function(key) { this.body.velocity.y = 0; }, "W");

			// MOVE DOWN
			this.setKeyCallbacks(function(key) {
				this.body.velocity.y = this.walkSpeed;
			}, function(key) { this.body.velocity.y = 0; }, "S");
		}

		setKeyCallbacks(onDown, onUp, keyName) {
			var key = this.game.input.keyboard.addKey(Phaser.Keyboard[keyName]);
			key.onDown.add(onDown, this);
			key.onUp.add(onUp, this);
		}
	}
}