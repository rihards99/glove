module GameModule {
	enum Direction {UP, DOWN, LEFT, RIGHT};
	export abstract class Player extends Phaser.Sprite {
		walkSpeed: number = 100;
		slowDownSpeed: number = 10; // Needs to be a fraction of the walk speed.
		canDoAction: boolean = true;
		moveTimeout: number = 200;
		direction: Direction = Direction.UP;
		
		bar: Phaser.Sprite;
		health: number = 100;
		maxHealth: number = 100;
		barHeight: number = 5;
		barWidth: number = 40;

		constructor(game: GameModule.Game, x: number, y: number, sprite: string) {
			super(game, x, y, sprite, 0);
			this.anchor.setTo(0.5, 0.5);
			game.add.existing(this);
			game.physics.enable(this, Phaser.Physics.ARCADE);
			this.body.width = 25;
			this.body.height = 25;
			
			this.animations.add('down', [0, 1, 2], 10, true);
			this.animations.add('left', [3, 4, 5], 10, true);
			this.animations.add('right', [6, 7, 8], 10, true);
			this.animations.add('up', [9, 10, 11], 10, true);
			// the creation position of the bar isn't important, 
			// since it gets updated every cycle
        	this.bar = game.add.sprite(0, 0, this.getHealthBar());
		}
		
		abstract isKeyDown(key: string): boolean;
		
		controls() {
			this.body.velocity.x = 0;
			this.body.velocity.y = 0;
			
			if (!this.canDoAction) return;
			
			// UP/DOWN controls
			if (this.isKeyDown('W')){
				this.body.velocity.y = -this.walkSpeed;
				this.animations.play('up');
				this.direction = Direction.UP;
			}
			else if (this.isKeyDown('S')){
				this.body.velocity.y = this.walkSpeed;
				this.animations.play('down');
				this.direction = Direction.DOWN;
			}
			// LEFT/RIGHT controls
			else if (this.isKeyDown('A')){
				this.body.velocity.x = -this.walkSpeed;
				this.animations.play('left');
				this.direction = Direction.LEFT;
			}
			else if (this.isKeyDown('D')){
				this.body.velocity.x = this.walkSpeed;
				this.animations.play('right');
				this.direction = Direction.RIGHT;
			}
			else {
				this.animations.stop();
			}
		}

		checkAttack() {
			if (this.isKeyDown('SPACEBAR') && this.canDoAction) {
				this.setMoveTimeout(this.moveTimeout);
				var sword = this.game.add.sprite(this.x, this.y, 'sword');
				this.game.physics.enable(sword);
				
				if (this.direction == Direction.UP) {
					sword.x -= (sword.width / 2);
					sword.y -= sword.height * 1.5;
					sword.body.x = sword.x;
					sword.body.y = sword.y;
				}
				else if (this.direction == Direction.DOWN) {
					sword.angle += 180;
					sword.x += (sword.width / 2);
					sword.y += sword.height * 1.5;
					sword.body.x = sword.x - sword.width;
					sword.body.y = sword.y - sword.height;
				}
				else if (this.direction == Direction.LEFT) {
					sword.angle += 270;
					sword.x -= sword.height * 1.5;
					sword.y += (sword.width / 2);
					sword.body.width = sword.height;
					sword.body.height = sword.width;
					sword.body.x = sword.x;
					sword.body.y = sword.y - sword.width;
				}
				else if (this.direction == Direction.RIGHT) {
					sword.angle += 90;
					sword.x += sword.height * 1.5;
					sword.y -= (sword.width / 2);
					sword.body.width = sword.height;
					sword.body.height = sword.width;
					sword.body.x = sword.x - sword.height;
					sword.body.y = sword.y;
				}
				var state: any = this.game.state.getCurrentState();
				state.attack(sword);
			}
		}
		
		checkTrap() {
			if (this.isKeyDown('E') && this.canDoAction) {
				this.setMoveTimeout(this.moveTimeout);
				var trap = this.game.add.sprite(0, 0, 'trap');
				trap.anchor.setTo(0.5, 0.5);
				trap.x = this.x;
				trap.y = this.y;
				if (this.direction == Direction.UP) {
					trap.y -= this.height;
				}
				else if (this.direction == Direction.DOWN) {
					trap.y += this.height;
				}
				else if (this.direction == Direction.LEFT) {
					trap.x -= this.width;
				}
				else if (this.direction == Direction.RIGHT) {
					trap.x += this.width;
				}
				this.game.physics.enable(trap);
				var state: any = this.game.state.getCurrentState();
				state.placeTrap(trap);
			}
		}
		
		update() {
			this.controls();
			this.checkAttack();
			this.checkTrap();
			
			this.bar.x = this.x - (this.barWidth * 0.5);
			this.bar.y = this.y - 30;
			this.bar.loadTexture(this.getHealthBar());
		}
		
		// Also used in trap triggers
		setMoveTimeout(time: number) {
			this.animations.stop();
			this.canDoAction = false;
			this.game.time.events.add(time, function(){
				this.canDoAction = true;
			}, this);
		}
		
		private getHealthBar(): Phaser.BitmapData {
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
	}
}