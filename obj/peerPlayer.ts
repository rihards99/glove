module GameModule {

	export class PeerPlayer extends Phaser.Sprite {
		walkSpeed: number = 150;

		constructor(game: GameModule.Game, x: number, y: number) {
			super(game, x, y, 'knight2', 0);
			this.anchor.setTo(0.5, 0.5);
			// this.animations.add('walk', [5, 6, 7, 8], 10, true);
			game.add.existing(this);
			game.physics.enable(this, Phaser.Physics.ARCADE);
			this.body.immovable = true;
			this.body.width = 25;
		}

		update() {
		}
	}
}