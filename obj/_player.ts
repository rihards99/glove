module GameModule {
	export abstract class Player extends Phaser.Sprite {
		walkSpeed: number = 100;
		slowDownSpeed: number = 10; // Needs to be a fraction of the walk speed.
		
		bar: Phaser.Sprite;
		health: number = 100;
		maxHealth: number = 100;
		barHeight: number = 5;
		barWidth: number = 40;
		canAttack: boolean = true;

		constructor(game: GameModule.Game, x: number, y: number, sprite: string) {
			super(game, x, y, sprite, 0);
			this.anchor.setTo(0.5, 0.5);
			game.add.existing(this);
			game.physics.enable(this, Phaser.Physics.ARCADE);
			this.body.width = 25;
			
			this.animations.add('down', [0, 1, 2], 10, true);
			this.animations.add('left', [3, 4, 5], 10, true);
			this.animations.add('right', [6, 7, 8], 10, true);
			this.animations.add('up', [9, 10, 11], 10, true);
			// the creation position of the bar isn't important, since it gets updated every cycle
        	this.bar = game.add.sprite(0, 0, this.getHealthBar());
		}
		
		abstract isKeyDown(key: string): boolean;
		
		// Implemented by clientPlayer and hostPlayer
		controls() {
			//this.animations.stop();
			// UP/DOWN controls
			this.slowDown('y');
			if (this.isKeyDown('W')){
			//if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
				this.moveUp();
			}
			else if (this.isKeyDown('S')){
			//else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
				this.moveDown();
			}
			
			// LEFT/RIGHT controls
			this.slowDown('x');
			if (this.isKeyDown('A')){
			//if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
				this.moveLeft();
			}
			else if (this.isKeyDown('D')){
			//else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
				this.moveRight();
			}
			/*
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.canAttack) {
				this.canAttack = false;
				var sword = this.game.add.sprite(this.x, this.y, 'sword');
				this.game.time.events.add(200, function(){
					//sword.destroy();
				}, this);
			}
			else if (!this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.canAttack) {
				this.canAttack = true;
			}
			
			// TODO: TESTING
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.E)) {
				this.health -= 1;
			}
			
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
				this.health += 1;
			}
			*/
		}
		// Used by both host/client player and peer player
		private moveUp() {
			this.body.velocity.y = -this.walkSpeed;
			//this.frame = 0;
			this.animations.play('up');
		}
		
		private moveDown() {
			this.body.velocity.y = this.walkSpeed;
			//this.frame = 1;
			this.animations.play('down');
		}
		
		private moveLeft() {
			this.body.velocity.x = -this.walkSpeed;
			//this.frame = 2;
			this.animations.play('left');
		}
		
		private moveRight() {
			this.body.velocity.x = this.walkSpeed;
			//this.frame = 3;
			this.animations.play('right');
		}
		
		update() {
			this.bar.x = this.x - (this.barWidth * 0.5);
			this.bar.y = this.y - 30;
			this.bar.loadTexture(this.getHealthBar());
		}
		
		getHealthBar(): Phaser.BitmapData {
			var bmd = this.game.make.bitmapData(this.barWidth, this.barHeight);
			bmd.context.fillStyle = '#000';
			bmd.context.fillRect(0, 0, this.barWidth, this.barHeight);
			var percent = this.health / this.maxHealth;
			if (percent < 0.3)
	        	bmd.context.fillStyle = '#f00'; // red
	        else if (percent < 0.6)
	        	bmd.context.fillStyle = '#ff0'; // yellow
	        else 
	        	bmd.context.fillStyle = '#0f0'; // green
	        
			bmd.context.fillRect(0, 0, percent * this.barWidth, this.barHeight);
			return bmd
		}

		protected slowDown(coord) {
			if (this.body.velocity[coord] > 0) {
				this.body.velocity[coord] -= this.slowDownSpeed;
			}
			else if (this.body.velocity[coord] < 0) {
				this.body.velocity[coord] += this.slowDownSpeed;
			}
		}
	}
}