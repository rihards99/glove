module GameModule {
	export class Wall extends Phaser.Sprite {
		constructor(game: GameModule.Game, x: number, y: number) {
			super(game, x, y, 'wall');
			game.add.existing(this);
			game.physics.enable(this, Phaser.Physics.ARCADE);
			this.body.immovable = true;
		}
	}
}