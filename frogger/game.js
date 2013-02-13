function start_game() {
	canvas = document.getElementById('game');
	game = canvas.getContext('2d');
	sprites = new Image();
	sprites.src = 'assets/frogger_sprites.png';
	init(game);
	sprites.onload = function() {
		draw(game, sprites);
	}
}

function init(game) {
	game.frog_x = 185;
	game.frog_y = 490;
	game.lives = 3;
	game.over = false;
	game.level = 1;
	game.time = 0;
	game.score = 0;
	game.highscore = 0;
	game.vehicles = 0;
	game.logs = 0;
	game.vehi_speed = 10;
	game.log_speed = 10;
}

function draw(game, sprites) {
	game.fillStyle = "#000000"; //road
	game.fillRect(0,0,399,565);
	game.fillStyle = "#191970"; //water
	game.fillRect(0,0,399,300);
	
	game.drawImage(sprites,0,0,399,110,0,0,399,110); //title and grass
	game.drawImage(sprites,0,117,399,37,0,270,399,37); //top road
	game.drawImage(sprites,0,117,399,37,0,480,399,37); //bottom road
	
	game.drawImage(sprites,0,165,182,22,200,120,182,22); //log
	game.drawImage(sprites,10,268,28,21,100,400,28,21); //car 1
	game.drawImage(sprites,106,302,46,17,250,450,46,17); //car 2
	game.drawImage(sprites,10,370,25,20,game.frog_x,game.frog_y,25,20); //frog
	
	/* lives */
	for (i=0; i<game.lives; i++) {
		game.drawImage(sprites,10,335,25,20,0+(i*25),520,25,20);
	}
	
	game.font = "14pt Helvetica";
	game.fillStyle = "#00CC00";
	game.fillText("Level", (game.lives*25)+5, 537); //level
	game.fillText(game.level, (game.lives*25)+58, 537); //level
	game.fillText("Score:", 2, 559);  //score
	game.fillText(game.score, 63, 559);
	game.fillText("High Score:", 150, 559);  //high score
	game.fillText(game.highscore, 255, 559);
}
