module GameModule {
	export class Ui {
		game: GameModule.Game;
		elements: any[] = [];
		
		constructor(game, width, height){
			this.game = game;
			$("#ui").css({
				position: "absolute",
				width: width,
				height: height
			});
		}
		
		drawMainMenu() {
			$("#ui").append('<button id="hostBtn">Host Game</button>');
			var hostBtn = $("#hostBtn");
			this.elements.push(hostBtn);
			hostBtn.addClass('host-btn btn btn-primary');
			var that = this;
			hostBtn.click(function(){
				that.game.hostGame();
			});
			
			$("#ui").append('<button id="joinBtn">Join Game</button>');
			var joinBtn = $("#joinBtn");
			this.elements.push(joinBtn);
			joinBtn.addClass('join-btn btn btn-primary');
			var that = this;
			joinBtn.click(function(){
				that.game.joinGame($("#joinKey").val());
			});
			
			$("#ui").append('<input type="text" id="joinKey" placeholder="Host\'s Key">');
			var joinKey = $("#joinKey");
			this.elements.push(joinKey);
			joinKey.addClass('join-key form-control');
		}
		
		displayHostKey(key) {
			console.log('asd');
			$("#ui").append('<div id="hostKey">'+ key + '</div>');
			var hostKey = $("#hostKey");
			this.elements.push(hostKey);
			hostKey.addClass('host-key well well-sm');
		}
		
		clear() {
			for (var element of this.elements) {
				$(element).remove();
			}
		}
	}
}