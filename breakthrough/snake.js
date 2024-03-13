import zim from "https://zimjs.org/cdn/016/zim";

let frame = new Frame(FIT, 1000, 800, light, dark, start, []);

function start() {

	let player = new Rectangle(100, 20, blue);
	player.centerReg();
	player.mov(0, 350);

	let ball = new Circle(10, red);
	ball.center();
	ball.speedX = 5;
	ball.speedY = -5;
	ball.bouncingOff = false;

	let bricks = [];
	let row = 0;
	while (row < 3) {
		let col = 0;
		while (col < 5) {
			let brick = new Rectangle(176, 75, orange);
			brick.centerReg();
			brick.loc(20 + 88 + (176 + 20) * col, 57.5 + row * (75 + 20));
			bricks.push(brick);
			brick.bouncingOff = false;
			col = col + 1;
		}
		row = row + 1;
	}

	function ballBounceOffBorder() {
		if (!ball.bouncingOff && (ball.x < ball.radius || ball.x > 1000 - ball.radius)) {
			ball.speedX = -ball.speedX;
			ball.bouncingOff = true;
		}
		else if (!ball.bouncingOff && (ball.y < ball.radius || ball.y > 800 - ball.radius)) {
			ball.speedY = -ball.speedY;
			ball.bouncingOff = true;
		}
		else {
			ball.bouncingOff = false;
		}
	}

	function ballBounceOffRectangle(rectangle) {
		let distanceX = Math.abs(ball.x - rectangle.x);
		let distanceY = Math.abs(ball.y - rectangle.y);
		if (!rectangle.bouncingOff && distanceX <= rectangle.width / 2 + ball.radius && distanceY <= rectangle.height / 2 + ball.radius) {
			if (distanceX < rectangle.width / 2) {
				ball.speedY = -ball.speedY;
				rectangle.bouncingOff = true;
				return true;
			}
			else if (distanceY < rectangle.height / 2) {
				ball.speedX = -ball.speedX;
				rectangle.bouncingOff = true;
				return true;
			}
			else {
				let distanceToCorner = (distanceX - rectangle.width / 2) ** 2 + (distanceY - rectangle.height / 2) ** 2;
				if (distanceToCorner <= ball.radius ** 2) {
					ball.speedX = -ball.speedX;
					ball.speedY = -ball.speedY;
					rectangle.bouncingOff = true;
					return true;
				}
			}
		}
		else if (rectangle.bouncingOff) {
			rectangle.bouncingOff = false;
		}
		return false;
	}

	function ballBounceOffPlayer() {
		ballBounceOffRectangle(player);
	}

	function ballBounceOffBricks() {
		let i = 0;
		while (i < bricks.length) {
			if (ballBounceOffRectangle(bricks[i])) {
				bricks[i].dispose();
				bricks.splice(i, 1);
			}
			i = i + 1;
		}
	}

	function moveBall() {
		ball.x = ball.x + ball.speedX;
		ball.y = ball.y + ball.speedY;
		ballBounceOffBorder();
		ballBounceOffPlayer();
		ballBounceOffBricks();
	}
	Ticker.add(moveBall);

	function movePlayer(event) {
		if (event.code == "ArrowLeft") {
			player.x = player.x - 10;
			frame.update();
		}
		else if (event.code == "ArrowRight") {
			player.x = player.x + 10;
			frame.update();
		}
	}
	document.addEventListener("keydown", movePlayer);

}