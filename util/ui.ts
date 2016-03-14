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
			// Switch to the .load() method
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
			$("#ui").load("util/views/game.html");
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
		
		stunBar(value: number, max: number) {
			if (value == 0) return;
			
			var percent = (value / max) * 100;
			if (percent >= 3) 
				$("#stunProgress").show()
			else 
				$("#stunProgress").hide();
			document.getElementById("stunBar").style.width = percent + '%';
			document.getElementById("stunBarLabel").innerHTML = (value / 1000).toFixed(2) + "s";
		}
	}
}