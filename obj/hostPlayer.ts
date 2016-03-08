module GameModule {
	export class HostPlayer extends Player {

		constructor(game: GameModule.Game, x: number, y: number) {
			super(game, x, y, 'knight');
			this.setSelectKeys();
		}
		
		// Check state of key locally
		isKeyDown(key: string): boolean {
			return this.game.input.keyboard.isDown(Phaser.Keyboard[key]);
		}
		
		setSelectKeys() {
			var swordKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
			var arrowKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
			var that = this;
			swordKey.onDown.add(function() {
				that.game.ui.select("sword");
				this.weapon = Weapon.SWORD;
			}, this);
			arrowKey.onDown.add(function() {
				that.game.ui.select("arrow");
				this.weapon = Weapon.ARROW;
			}, this);
		}
		
		update() {
			super.update();
		}
	}
}