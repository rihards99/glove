module GameModule {
	export class Ui {
		game: Game;
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
			joinBtn.click(function(){
				that.game.joinGame($("#joinKey").val());
			});
			
			$("#ui").append('<input type="text" id="joinKey" placeholder="Host\'s Key">');
			var joinKey = $("#joinKey");
			this.elements.push(joinKey);
			joinKey.addClass('join-key form-control');
		}
		
		drawGameUi() {
			$("#ui").append('<div id="hostKey"></div>');
			var hostKey = $("#hostKey");
			this.elements.push(hostKey);
			hostKey.addClass('host-key well well-sm');
			
			$("#ui").append('<div id="swordIcon"><span>1</span><img src="img/sword.png"></div>');
			var swordIcon = $("#swordIcon");
			this.elements.push(swordIcon);
			swordIcon.addClass('sword-icon selected-icon well well-sm');
			
			$("#ui").append('<div id="arrowIcon"><span>2</span><img src="img/arrow.png"></div>');
			var arrowIcon = $("#arrowIcon");
			this.elements.push(arrowIcon);
			arrowIcon.addClass('arrow-icon well well-sm');
		}
		
		select(weapon: string) {
			$(".well").removeClass("selected-icon");
			$("#" + weapon + "Icon").addClass("selected-icon");
		}

		setHostKey(key: string) {
			$("#hostKey").html(key);
		}
		
		clear() {
			for (var element of this.elements) {
				$(element).remove();
			}
		}
	}
}