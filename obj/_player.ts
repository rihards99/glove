module GameModule {
	export enum Direction {UP, DOWN, LEFT, RIGHT};
	export enum Weapon {SWORD, ARROW, TRAP}
	export abstract class Player extends Phaser.Sprite {
		game: GameModule.Game;
		
		walkSpeed: number = 100;
		slowDownSpeed: number = 10; // Needs to be a fraction of the walk speed.
		canDoAction: boolean = true;
		moveTimeout: number = 200;
		trapTimer: Phaser.Timer;
		
		direction: Direction = Direction.UP;
		weapon: Weapon = Weapon.SWORD;
		
		bar: Phaser.Sprite;
		health: number = 100;
		maxHealth: number = 100;
		barHeight: number = 5;
		barWidth: number = 40;

		constructor(game: GameModule.Game, x: number, y: number, sprite: string) {
			super(game, x, y, sprite, 0);
			this.trapTimer = this.game.time.create(false);
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
				switch(this.weapon){
					case Weapon.SWORD:
						this.swordAttack();
						break;
					case Weapon.ARROW:
						this.arrowAttack();
						break;
					case Weapon.TRAP:
						this.checkTrap();
						break;
				}
			}
		}
		
		swordAttack() {
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
		
		arrowAttack() {
			this.setMoveTimeout(this.moveTimeout);
			var state: any = this.game.state.getCurrentState();
			if (state instanceof HostState) state.shoot(this);
		}
		
		checkTrap() {
			this.setMoveTimeout(this.moveTimeout);
			var state: any = this.game.state.getCurrentState();
			// TODO: need to check if there's a better way to do this
			if (state instanceof HostState) state.placeTrap(this);
			
			// if (this.isKeyDown('E') && this.canDoAction) {
			// 	this.setMoveTimeout(this.moveTimeout);
			// 	var state: any = this.game.state.getCurrentState();
			// 	// TODO: need to check if there's a better way to do this
			// 	if (state instanceof HostState) state.placeTrap(this);
			// }
		}
		
		update() {
			this.controls();
			this.checkAttack();
			//this.checkTrap();
			
			this.bar.x = this.x - (this.barWidth * 0.5);
			this.bar.y = this.y - 30;
			this.bar.loadTexture(this.getHealthBar());
		}
		
		setMoveTimeout(time: number) {
			this.animations.stop();
			this.canDoAction = false;
			this.game.time.events.add(time, function(){
				this.canDoAction = true;
			}, this);
		}
		
		setTrapTimer(time: number) {
			this.animations.stop();
			this.canDoAction = false;
			this.trapTimer.add(time, function(){
				this.canDoAction = true;
			}, this);
			this.trapTimer.start();
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