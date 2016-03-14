module GameModule {
	export class Trap extends Phaser.Sprite {
	    player: GameModule.Player;
	    
		constructor(game: GameModule.Game, player: GameModule.Player, x?: number, y?: number) {
			super(game, 0, 0, 'trap');
			this.player = player;
			game.add.existing(this);
			this.anchor.setTo(0.5, 0.5);
			
			// Called using only player object (from Host State).
			if (x == null || y == null) {
    			this.x = player.x;
    			this.y = player.y;
    			if (player.direction == Direction.UP) {
    				this.y -= player.height;
    			}
    			else if (player.direction == Direction.DOWN) {
    				this.y += player.height;
    			}
    			else if (player.direction == Direction.LEFT) {
    				this.x -= player.width;
    			}
    			else if (player.direction == Direction.RIGHT) {
    				this.x += player.width;
    			}
			}
			// Called using recalculated coords (from Client State).
			else {
			    this.x = x;
			    this.y = y;
			}
			game.physics.enable(this, Phaser.Physics.ARCADE);
		}
	}
}