var fps = 30;

function start_game() {
	canvas = document.getElementById('game');
	game = canvas.getContext('2d');
	sprites = new Image();
	sprites.src = 'assets/frogger_sprites.png';
	init(game);
	sprites.onload = function(){draw();}
	setInterval(draw, fps);
}

function init(game) {
	game.frog_x = 185;
	game.frog_y = 490;
	game.lives = 5;
	game.over = false;
	game.level = 1;
	game.time = 0;
	game.score = 0;
	game.highscore = 0;
	game.long_log_loc = 150;
	game.long_log_speed = 1.4;
	game.med_log_loc = 175;
	game.med_log_speed = 2.2;
	game.short_log_loc = 200;
	game.short_log_speed = 2.8;
	game.short_log_rev_loc = 500;
	game.short_log_rev_speed = 2;
	game.pink_car_speed = 1.7;
	game.pink_car_loc = 200;
	game.yellow_car_speed = 4.0;
	game.yellow_car_loc = 150;
	game.truck_speed = 1.9;
	game.truck_loc = 200;
	game.race_car_loc = 100;
	game.race_car_speed = 2.3;

}

function draw() {
	game.fillStyle = "#000000"; //road
	game.fillRect(0,0,399,565);
	game.fillStyle = "#191970"; //water
	game.fillRect(0,0,399,300);
	
	game.drawImage(sprites,0,0  ,399,110,0,0,399,110); //title and grass
	game.drawImage(sprites,0,117,399,37,0,270,399,37); //top road
	game.drawImage(sprites,0,117,399,37,0,480,399,37); //bottom road
	
	/* medium log */
	game.drawImage(sprites,0,197,121,22,game.med_log_loc      ,115,121,22);
	game.drawImage(sprites,0,197,121,22,game.med_log_loc - 242,115,121,22);
	game.drawImage(sprites,0,197,121,22,game.med_log_loc - 484,115,121,22);	
	
	/* short log reverse */
	game.drawImage(sprites,0,229,90,22,game.short_log_rev_loc    ,145,82,22);
	game.drawImage(sprites,0,229,90,22,game.short_log_rev_loc-200,145,82,22);
	game.drawImage(sprites,0,229,90,22,game.short_log_rev_loc-400,145,82,22);
	
	/* long log */
	game.drawImage(sprites,0,165,182,22,game.long_log_loc      ,175,189,22);
	game.drawImage(sprites,0,165,182,22,game.long_log_loc-242,175,189,22);
	game.drawImage(sprites,0,165,182,22,game.long_log_loc-484,175,189,22);
	
	/* short log */
	game.drawImage(sprites,0,229,90,22,game.short_log_loc    ,210,82,22);
	game.drawImage(sprites,0,229,90,22,game.short_log_loc-200,210,82,22);
	game.drawImage(sprites,0,229,90,22,game.short_log_loc-400,210,82,22);
	
	/* medium reverse log */
	game.drawImage(sprites,0,197,121,22,game.med_log_loc      ,240,121,22);
	game.drawImage(sprites,0,197,121,22,game.med_log_loc - 242,240,121,22);
	game.drawImage(sprites,0,197,121,22,game.med_log_loc - 484,240,121,22);	
	
	/* pink car */
	game.drawImage(sprites,10,268,28,21,game.pink_car_loc    ,385,28,21);
	game.drawImage(sprites,10,268,28,21,game.pink_car_loc+100,385,28,21);
	game.drawImage(sprites,10,268,28,21,game.pink_car_loc+200,385,28,21);
	game.drawImage(sprites,10,268,28,21,game.pink_car_loc+500,385,28,21);
	game.drawImage(sprites,10,268,28,21,game.pink_car_loc+600,385,28,21);
	
	/* yellow car */
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc    ,460,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+100,460,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+200,460,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+500,460,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+600,460,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+700,460,28,21);
	
	/* truck */
	game.drawImage(sprites,106,300,46,20,game.truck_loc    ,305,46,20);
	game.drawImage(sprites,106,300,46,20,game.truck_loc+150,305,46,20);
	game.drawImage(sprites,106,300,46,20,game.truck_loc+400,305,46,20);
	game.drawImage(sprites,106,300,46,20,game.truck_loc+550,305,46,20);
	
	/* race car */
	game.drawImage(sprites,47,266,27,25,game.race_car_loc    ,420,27,25);
	game.drawImage(sprites,47,266,27,25,game.race_car_loc-100,420,27,25);
	game.drawImage(sprites,47,266,27,25,game.race_car_loc-200,420,27,25);
	game.drawImage(sprites,47,266,27,25,game.race_car_loc-500,420,27,25);
	game.drawImage(sprites,47,266,27,25,game.race_car_loc-600,420,27,25);
	
	/* upper yellow car */
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+120,345,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+220,345,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+320,345,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+620,345,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+720,345,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+820,345,28,21);
	
	/* frog */
	game.drawImage(sprites,10,370,25,20,game.frog_x,game.frog_y,25,20);
	
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
	increment();
}

function increment() {
	/* long logs */
	if  (game.long_log_loc < 393) game.long_log_loc += game.long_log_speed; 
	else game.long_log_loc = 150;
	
	/* medium logs */
	if  (game.med_log_loc < 440) game.med_log_loc += game.med_log_speed; 
	else game.med_log_loc = 200;
	
	/* short logs */
	if  (game.short_log_loc < 400) game.short_log_loc += game.short_log_speed;
	else game.short_log_loc = 200;
	
	/* reversed short logs */
	if  (game.short_log_rev_loc > 300) game.short_log_rev_loc -= game.short_log_rev_speed;
	else game.short_log_rev_loc = 500;
	
	/* pink cars */
	if  (game.pink_car_loc > -300) game.pink_car_loc -= game.pink_car_speed;
	else game.pink_car_loc =  200;

	/* yellow cars */
	if  (game.yellow_car_loc > -350) game.yellow_car_loc -= game.yellow_car_speed;
	else game.yellow_car_loc =  150;
	
	/* trucks */
	if  (game.truck_loc > -200) game.truck_loc -= game.truck_speed;
	else game.truck_loc =  200;
	
	/* race cars */
	if  (game.race_car_loc < 600) game.race_car_loc += game.race_car_speed;
	else game.race_car_loc = 100;
}