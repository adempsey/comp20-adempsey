var fps = 30;
var inMotion = false;
var frogState = "forward";
var game;
var go; //allows animation and movement when true, prevents when false
var givenExtra = false;

function start_game() {
	canvas = document.getElementById('game');
	game = canvas.getContext('2d');
	init(game);
	sprites.onload = function(){draw();}
	go = true;
	delay = 5; //prevents queued keypresses when frog is dead
	loop = setInterval(loop, fps);
}

/* initializes game data */
function init(game) {

	/* initializes high score in localStorage if first time playing */
	if (localStorage["froggerHighScore"] == null) {
		localStorage["froggerHighScore"] = 0;
	}

	sprites = new Image();
	sprites.src = 'assets/frogger_sprites.png';
	deadFrog = new Image();
	deadFrog.src = 'assets/dead_frog.png';
	
	soundJump = new Audio("assets/jump.mp3");
	soundDie = new Audio("assets/dead.mp3");
	soundWin = new Audio("assets/win.mp3");
	
	game.frog_x = 190;
	game.frog_y = 490;
	game.lives = 5;
	game.frogs_home = 0;
	game.homes = [false, false, false, false, false];
	game.over = false;
	game.level = 1;
	game.time = 0;
	game.score = 0;
	game.highscore = localStorage["froggerHighScore"];
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
	game.loc_diff = 0;
	
	/* key controls */
	document.addEventListener("keydown", function(event) {
		switch(event.keyCode) {
			/* up */
			case 38:
				event.preventDefault();
				if (!inMotion && go && (delay==5) && game.frog_y > 110) {
					inMotion = true;
					frogState = "forward";
					soundJump.play();
					motion = setInterval(function() {
						game.frog_y--;
						moveFrog();
					}, 1);
					game.score += 10;
				}
				break;
				
			/* down */
			case 40:
				event.preventDefault();
				if (!inMotion && go && (delay==5) && game.frog_y < 490) {
					inMotion = true;
					frogState = "backward";
					motion = setInterval(function() {
						game.frog_y++;
						moveFrog();
					}, 1);
				}
				break;
				
			/* left */
			case 37:
				event.preventDefault();
				if (!inMotion && go && (delay==5) && game.frog_x > 5) {
					inMotion = true;
					frogState = "left";
					motion = setInterval(function() {
						game.frog_x--;
						moveFrog();
					}, 1);
				}
				break;
				
			/* right */
			case 39:
				event.preventDefault();
				if (!inMotion && go && (delay==5) && game.frog_x < 370) {
					inMotion = true;
					frogState = "right";
					motion = setInterval(function() {
						game.frog_x++;
						moveFrog();
					}, 1);
				}
				break;
		}
	});
}

/* runs game */
function loop() {
	if (game.lives <= 0) gameOver();
	extraLife();
	if (go) draw();
	if ((didCollideWithCar()) || !didCollideWithLogs() || !gotHome()) killFrog();
	else incrementLocs();
}

/* stops frog movement after 30 pixels of movement */
function moveFrog() {
	game.loc_diff++;
	if ((game.loc_diff > 30) || !go) {
		clearInterval(motion);
		game.loc_diff = 0;
		inMotion = false;
	}
}

/* reset frog location and subtracts lives */
function killFrog() {
	go = false;
	delay = 0;
	frogState = "dead";
	game.lives--;
	soundDie.play();
	draw();	
	frogState = "forward";
	game.frog_x = 190;
	game.frog_y = 490;
	wait = setTimeout(function() {go = true}, 1000);
	delayInc = setInterval(function() { 
		delay++; 
		if (delay == 5) clearInterval(delayInc); 
	}, 300);
}

/* gives frog extra life at every 10000 points */
function extraLife() {
	if ((givenExtra == false) && ((game.score % 10000) == 0) && (game.lives < 5)) {
		givenExtra = true;
		game.lives++;
		soundWin.play();
	} else if ((game.score % 10000) != 0) {
		givenExtra = false;
	}
}

/* stop animation and motion and set high score if necessary */
function gameOver() {
	clearInterval(loop);
	game.fillStyle = "#EE0000";
	game.fillRect(30,200,340,150);
	game.fillStyle = "#000000";
	game.fillRect(35,205,330,140);
	game.fillStyle = "#EE0000";
	game.font = "36pt Helvetica";
	game.fillText("Game Over", 79, 290);
	
	if (game.score > localStorage["froggerHighScore"]) {
		localStorage["froggerHighScore"] = game.score;
		game.fillStyle = "#00CC66";
		game.font = "14pt Helvetica";
		game.fillText("New High Score!",  130, 325);
	}
}

function draw() {
	game.fillStyle = "#000000"; //road
	game.fillRect(0,0,399,565);
	game.fillStyle = "#191970"; //water
	game.fillRect(0,0,399,300);
	
	game.drawImage(sprites,0,0  ,399,110,0,0  ,399,110); //title and grass
	game.drawImage(sprites,0,117,399,37 ,0,293,399,37 ); //top of road
	game.drawImage(sprites,0,117,399,37 ,0,480,399,37 ); //bottom of road
	
	/* frogs at home */
	for (i in game.homes) 
		if (game.homes[i]) game.drawImage(sprites,10,370,25,20,15+(84.5*i),87,25,20);
	
	/* medium log */
	game.drawImage(sprites,0,197,121,22,game.med_log_loc-50 ,115,121,22);
	game.drawImage(sprites,0,197,121,22,game.med_log_loc-292,115,121,22);
	game.drawImage(sprites,0,197,121,22,game.med_log_loc-534,115,121,22);	
	
	/* short log reverse */
	game.drawImage(sprites,0,229,90,22,game.short_log_rev_loc    ,145,82,22);
	game.drawImage(sprites,0,229,90,22,game.short_log_rev_loc-200,145,82,22);
	game.drawImage(sprites,0,229,90,22,game.short_log_rev_loc-400,145,82,22);
	
	/* long log */
	game.drawImage(sprites,0,165,182,22,game.long_log_loc    ,176,189,22);
	game.drawImage(sprites,0,165,182,22,game.long_log_loc-242,176,189,22);
	game.drawImage(sprites,0,165,182,22,game.long_log_loc-484,176,189,22);
	
	/* short log */
	game.drawImage(sprites,0,229,90,22,game.short_log_loc    ,208,82,22);
	game.drawImage(sprites,0,229,90,22,game.short_log_loc-200,208,82,22);
	game.drawImage(sprites,0,229,90,22,game.short_log_loc-400,208,82,22);
	
	/* medium log 2 */
	game.drawImage(sprites,0,197,121,22,game.med_log_loc    ,238,121,22);
	game.drawImage(sprites,0,197,121,22,game.med_log_loc-242,238,121,22);
	game.drawImage(sprites,0,197,121,22,game.med_log_loc-484,238,121,22);
	
	/* short log 2 */	
	game.drawImage(sprites,0,229,90,22,game.short_log_rev_loc    ,270,82,22);
	game.drawImage(sprites,0,229,90,22,game.short_log_rev_loc-200,270,82,22);
	game.drawImage(sprites,0,229,90,22,game.short_log_rev_loc-400,270,82,22);
	
	/* truck */
	game.drawImage(sprites,106,300,46,20,game.truck_loc    ,330,46,20);
	game.drawImage(sprites,106,300,46,20,game.truck_loc+150,330,46,20);
	game.drawImage(sprites,106,300,46,20,game.truck_loc+400,330,46,20);
	game.drawImage(sprites,106,300,46,20,game.truck_loc+550,330,46,20);
	
	/* upper yellow car */
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+120,363,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+220,363,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+320,363,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+620,363,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+720,363,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+820,363,28,21);
	
	/* pink car */
	game.drawImage(sprites,10,268,28,21,game.pink_car_loc    ,395,28,21);
	game.drawImage(sprites,10,268,28,21,game.pink_car_loc+100,395,28,21);
	game.drawImage(sprites,10,268,28,21,game.pink_car_loc+200,395,28,21);
	game.drawImage(sprites,10,268,28,21,game.pink_car_loc+500,395,28,21);
	game.drawImage(sprites,10,268,28,21,game.pink_car_loc+600,395,28,21);
	
	/* race car */
	game.drawImage(sprites,47,266,27,25,game.race_car_loc    ,424,27,25);
	game.drawImage(sprites,47,266,27,25,game.race_car_loc-100,424,27,25);
	game.drawImage(sprites,47,266,27,25,game.race_car_loc-200,424,27,25);
	game.drawImage(sprites,47,266,27,25,game.race_car_loc-500,424,27,25);
	game.drawImage(sprites,47,266,27,25,game.race_car_loc-600,424,27,25);
	
	/* yellow car */
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc    ,456,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+100,456,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+200,456,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+500,456,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+600,456,28,21);
	game.drawImage(sprites,81,265,28,25,game.yellow_car_loc+700,456,28,21);
	
	/* frog */
	switch (frogState) {
		case "forward":
			if (inMotion) game.drawImage(sprites,45,366,22,25,game.frog_x,game.frog_y,22,25);
			else game.drawImage(sprites,10,370,25,20,game.frog_x,game.frog_y,25,20);
			break;
		case "backward":
			if (inMotion) game.drawImage(sprites,113,366,22,25,game.frog_x,game.frog_y,22,25);
			else game.drawImage(sprites,79,370,25,20,game.frog_x,game.frog_y,25,20);
			break;
		case "left":
			if (inMotion) game.drawImage(sprites,112,338,22,24,game.frog_x,game.frog_y,24,24);
			else game.drawImage(sprites,79,336,25,24,game.frog_x,game.frog_y,25,24);
			break;
		case "right":
			if (inMotion) game.drawImage(sprites,43,336,24,26,game.frog_x,game.frog_y,24,26);
			else game.drawImage(sprites,14,335,17,22,game.frog_x,game.frog_y,17,22);
			break;
		case "dead":
			game.drawImage(deadFrog,0,0,30,30,game.frog_x,game.frog_y-5,30,30);
			break;
	}
	
	/* lives */
	for (i=0; i<game.lives; i++) game.drawImage(sprites,10,335,25,20,0+(i*25),520,25,20);
	
	/* bottom text */
	game.font = "14pt Helvetica";
	game.fillStyle = "#00CC00";
	game.fillText("Level", (game.lives*25)+5, 537); //level
	game.fillText(game.level, (game.lives*25)+58, 537);
	game.fillText("Score:", 2, 559);  //score
	game.fillText(game.score, 63, 559);
	game.fillText("High Score:", 150, 559);  //high score
	game.fillText(game.highscore, 255, 559);
}

/* returns true if frog collides with car */
function didCollideWithCar() {
	if (go) {
		if (game.frog_y < 480 && game.frog_y >= 437) { //yellow car
			if    (Math.abs(game.frog_x -  game.yellow_car_loc) <= 20
				|| Math.abs(game.frog_x - (game.yellow_car_loc+100)) <= 20 
				|| Math.abs(game.frog_x - (game.yellow_car_loc+200)) <= 20
				|| Math.abs(game.frog_x - (game.yellow_car_loc+500)) <= 20 
				|| Math.abs(game.frog_x - (game.yellow_car_loc+600)) <= 20
				|| Math.abs(game.frog_x - (game.yellow_car_loc+700)) <= 20) return true;
		} else if (game.frog_y < 437 && game.frog_y >= 400) { //race car
			if    (Math.abs(game.frog_x -  game.race_car_loc) <= 20 
				|| Math.abs(game.frog_x - (game.race_car_loc-100)) <= 20 
				|| Math.abs(game.frog_x - (game.race_car_loc-200)) <= 20
				|| Math.abs(game.frog_x - (game.race_car_loc-500)) <= 20
				|| Math.abs(game.frog_x - (game.race_car_loc-600)) <= 20) return true;
		} else if (game.frog_y < 400 && game.frog_y >= 377) { //pink car
			if    (Math.abs(game.frog_x -  game.pink_car_loc) <= 20
				|| Math.abs(game.frog_x - (game.pink_car_loc+100)) <= 20 
				|| Math.abs(game.frog_x - (game.pink_car_loc+200)) <= 20
				|| Math.abs(game.frog_x - (game.pink_car_loc+500)) <= 20
				|| Math.abs(game.frog_x - (game.pink_car_loc+600)) <= 20) return true;	
		} else if (game.frog_y < 377 && game.frog_y >= 356) { //upper yellow car
			if    (Math.abs(game.frog_x - (game.yellow_car_loc+120)) <= 20 
				|| Math.abs(game.frog_x - (game.yellow_car_loc+220)) <= 20 
				|| Math.abs(game.frog_x - (game.yellow_car_loc+320)) <= 20
				|| Math.abs(game.frog_x - (game.yellow_car_loc+620)) <= 20
				|| Math.abs(game.frog_x - (game.yellow_car_loc+720)) <= 20
				|| Math.abs(game.frog_x - (game.yellow_car_loc+820)) <= 20) return true;	
		} else if (game.frog_y < 346 && game.frog_y >= 315) { //truck
			if    (Math.abs(game.frog_x -  game.truck_loc) <=25 
				|| Math.abs(game.frog_x - (game.truck_loc+150)) <= 25 
				|| Math.abs(game.frog_x - (game.truck_loc+400)) <= 25
				|| Math.abs(game.frog_x - (game.truck_loc+550)) <= 25) return true;	
		}
	}
	return false;
}

/* returns true if frog collides with log */
function didCollideWithLogs() {
	if (go) {
		if (game.frog_y == 118) { //top medium log
			if  (game.frog_x >= game.med_log_loc - 50 && game.frog_x <= (game.med_log_loc + 71)
			  || game.frog_x >= game.med_log_loc - 292 && game.frog_x <= (game.med_log_loc - 171) 
			  || game.frog_x >= game.med_log_loc - 534 && game.frog_x <= (game.med_log_loc - 413)) { //50, 292, 534
				game.frog_x += game.med_log_speed;
				return true;
			} else {
				return false;
			}
		} else if (game.frog_y == 149 || game.frog_y == 273) { //top short reverse log
			if  (game.frog_x >= game.short_log_rev_loc && game.frog_x <= (game.short_log_rev_loc + 70)
			  || game.frog_x >= game.short_log_rev_loc - 200 && game.frog_x <= (game.short_log_rev_loc - 130)
			  || game.frog_x >= game.short_log_rev_loc - 400 && game.frog_x <= (game.short_log_rev_loc - 330)) {
				game.frog_x -= game.short_log_rev_speed;
				return true;
			} else {
				return false;
			}
		} else if (game.frog_y == 180) { //long log
			if  (game.frog_x >= game.long_log_loc && game.frog_x <= (game.long_log_loc + 182)
			  || game.frog_x >= game.long_log_loc - 242 && game.frog_x <= (game.long_log_loc - 60)
			  || game.frog_x >= game.long_log_loc - 484 && game.frog_x <= (game.long_log_loc - 302)) {
				game.frog_x += game.long_log_speed;
				return true;
			} else {
				return false;
			}
		} else if (game.frog_y == 211) { //short log
			if  (game.frog_x >= game.short_log_loc && game.frog_x <= (game.short_log_loc + 90)
			  || game.frog_x >= game.short_log_loc - 200 && game.frog_x <= (game.short_log_loc - 110)
			  || game.frog_x >= game.short_log_loc - 400 && game.frog_x <= (game.short_log_loc - 310)) {
				game.frog_x += game.short_log_speed;
				return true;
			} else {
				return false;
			}
		} else if (game.frog_y == 242) { //medium log
			if  (game.frog_x >= game.med_log_loc && game.frog_x <= (game.med_log_loc + 121)
			  || game.frog_x >= game.med_log_loc - 242 && game.frog_x <= (game.med_log_loc - 121)
			  || game.frog_x >= game.med_log_loc - 484 && game.frog_x <= (game.med_log_loc - 363)) {
				game.frog_x += game.med_log_speed;
				return true;
			} else {
				return false;
			}
		}
	} 
	return true;
}

/* returns true and calls returnFrogHome if frog reached home inlet successfully */
function gotHome() {
	if (go && game.frog_y == 87) {
			if (game.frog_x >= 5   && game.frog_x <= 40) {
				if (!game.homes[0]) {
					returnFrogHome(0);
					return true;
				} else {
					return false;
				}
			} else if (game.frog_x >= 90  && game.frog_x <= 125) {
				if (!game.homes[1]) {
					returnFrogHome(1);
					return true;
				} else {
					return false;
				}
			} else if (game.frog_x >= 175 && game.frog_x <= 210) {
				if (!game.homes[2]) {
					returnFrogHome(2);
					return true;
				} else {
					return false;
				}
			} else if (game.frog_x >= 258 && game.frog_x <= 280) {
				if (!game.homes[3]) {
			 		returnFrogHome(3);
					return true;
				} else {
					return false;
				}
			} else if (game.frog_x >= 344 && game.frog_x <= 360) {
				if (!game.homes[4]) {
					returnFrogHome(4);
			 		return true;
				} else {
					return false;
				}
			 }
			return false;
		}
	return true;
}

/* resets frog location and increases level if necessary */
function returnFrogHome(k) {
	game.frogs_home++;
	game.frog_x = 190;
	game.frog_y = 490;
	game.score += 50;
	game.homes[k] = true;
	soundWin.play();
	if (game.frogs_home == 5) increaseLevel();
}

/* upgrades level difficulty */
function increaseLevel() {
	game.score += 1000;
	game.level++;
	game.truck_speed += (.3 * (game.level-1))
	game.yellow_car_speed += (.3 * (game.level-1))
	game.pink_car_speed += (.3 * (game.level-1))
	game.race_car_speed += (.3 * (game.level-1));
	game.long_log_speed += (.3 * (game.level-1));
	game.med_log_speed += (.3 * (game.level-1));
	game.short_log_speed += (.3 * (game.level-1));
	game.short_log_rev_speed += (.3 * (game.level-1));
	game.frogs_home = 0;
	for (i in game.homes) game.homes[i] = false;
}

/* change location of passive game elements (logs, cars, etc.) */
function incrementLocs() {
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