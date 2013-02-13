function start_game() {
	canvas = document.getElementById('game');
	game = canvas.getContext('2d');
	draw(game);
}

function draw(game) {
	sprites = new Image();
	sprites.src = 'pacman10-hp-sprite.png';
	game.drawImage(sprites,321,0,465,139,0,0,466,139);
	game.drawImage(sprites,2,81,17,17,5,5,17,17);
}
