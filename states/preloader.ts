module GameModule {

	export class Preloader extends Phaser.State {

		preloadBar: Phaser.Sprite;

		preload() {
			//  Set-up our preloader sprite
			this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
			this.load.setPreloadSprite(this.preloadBar);

			//  Load our actual games assets
			// this.load.audio('music', 'img/title.mp3', true);
			this.load.spritesheet('knight', 'img/new_knight.png', 32, 32, 12);
			this.load.spritesheet('knight2', 'img/new_knight2.png', 32, 32, 12);
			
			this.load.image('sword', 'img/sword.png');
		}

		create() {
			var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
			tween.onComplete.add(this.startMainMenu, this);
		}

		startMainMenu() {
			this.game.state.start('MainMenu', true, false);
		}
		
		startGame() {
			this.game.state.start('Level1', true, false);
		}
	}
}