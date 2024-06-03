import zim from "https://zimjs.org/cdn/016/zim"

let frame = new Frame(FIT, 1000, 1000, dark, light, start,
	["background.jpg", "starship.png", "thrust.png", "asteroid1.png", "asteroid2.png", "shipboom.png", "shoot.png", "boom.png"]);

async function start() {

	const url = 'https://jfkdwsauephidoqkieqf.supabase.co/rest/v1/scores';
	const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impma2R3c2F1ZXBoaWRvcWtpZXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4MDYxNTIsImV4cCI6MjAzMjM4MjE1Mn0.E714fIwl6KjHLr9DQFk3aYqkD9GyA3RcMvUffVMaXtA';
	let response = await fetch(url + '?apikey=' + apikey);
	let data = await response.json();
	console.log(data);
	let maxScore = data.map(item => item.score).reduce((accu, item) => Math.max(accu, item));
	console.log(maxScore);

	// Types of requests: GET / POST
	// Asynchronous functions

	function incrementScore(inc) {
		score = score + inc;
		scoreLabel.text = score;
		if (score > maxScore) {
			scoreLabel.color = red;
		}
	}

	function createAsteroid() {
		if (Math.random() > 0.2) {
			let asteroid = new Sprite(
				(Math.random() > 0.5) ? "asteroid2.png" : "asteroid1.png");
			asteroid.speedX = Math.random() * 4 - 2;
			asteroid.speedY = Math.random() * 20 + 5;
			asteroid.centerReg();
			asteroid.loc(Math.random() * 1000, -asteroid.height - 5);
			asteroid.animate({
				props: { rotation: Math.floor(Math.random() * 6 - 3) * 360 },
				loop: true,
				time: Math.random() * 5 + 1,
				ease: "linear"
			})
			asteroids.push(asteroid);
		}
	}

	function moveAsteroid(asteroid) {
		asteroid.x = asteroid.x + asteroid.speedX;
		asteroid.y = asteroid.y + asteroid.speedY;
	}
	function moveAllAsteroids() {
		let i = 0;
		while (i < asteroids.length) {
			moveAsteroid(asteroids[i]);
			if (asteroids[i].y > frame.stage.height + asteroids[i].height + 50) {
				asteroids[i].dispose();
				asteroids.splice(i, 1);
			}
			i = i + 1;
		}
	}

	function moveSpaceCraft(event) {
		spacecraft.loc(event.stageX, spacecraft.y);
		thrust.loc(spacecraft.x, spacecraft.y + 100);
		frame.update();

	}

	function checkAsteroidCollisions() {
		let i = 0;
		while (i < asteroids.length) {
			let j = i + 1;
			while (j < asteroids.length) {
				if (asteroids[i].hitTestCircle(asteroids[j])) {
					let v1x = asteroids[i].speedX;
					let v1y = asteroids[i].speedY;
					let v2x = asteroids[j].speedX;
					let v2y = asteroids[j].speedY;
					let jx = asteroids[i].x - asteroids[j].x;
					let jy = asteroids[i].y - asteroids[j].y;
					let k = -2 * ((v2x - v1x) * jx + (v2y - v1y) * jy) / (2 * (jx * jx + jy * jy));
					asteroids[i].speedX += - k * jx;
					asteroids[i].speedY += - k * jy;
					asteroids[j].speedX += k * jx;
					asteroids[j].speedY += k * jy;
					asteroids[i].x += asteroids[i].speedX / 2;
					asteroids[i].y += asteroids[i].speedY / 2;
					asteroids[j].x += asteroids[j].speedX / 2;
					asteroids[j].y += asteroids[j].speedY / 2;
				}
				j = j + 1;
			}
			i = i + 1;
		}
	}

	function spaceCraftHitBy(asteroid) {
		// return false;
		return spacecraft.hitTestCircle(asteroid);
	}

	function spaceCraftHit() {
		let i = 0;
		while (i < asteroids.length) {
			if (spaceCraftHitBy(asteroids[i])) {
				lives = lives - 1;
				livesIcons[lives].dispose();
				livesIcons.splice(lives, 1);
				if (lives == 0) {
					endGame();
				}
				spacecraft.dispose();
				thrust.loc(thrust.x, frame.stage.height + 500);
				asteroids[i].dispose();
				asteroids[i] = null;
				asteroids.splice(i, 1);
				let spaceCraftExplosion = new Sprite({
					image: "shipboom.png",
					rows: 3,
					cols: 8
				});
				spaceCraftExplosion.centerReg();
				spaceCraftExplosion.loc(spacecraft.x, spacecraft.y);
				spaceCraftExplosion.run({
					time: 1,
					call: () => { spaceCraftExplosion.dispose(); }
				});
			}
			i = i + 1;
		}
	}

	function addProjectile() {
		let projectile = new Sprite("shoot.png");
		projectilesStockpile.push(projectile);
		projectileFillProgressBar.percent = 100 * projectilesStockpile.length / projectileCapacity;
		frame.update();
	}

	function fillProjectileStockpile() {
		if (projectilesStockpile.length < projectileCapacity) {
			addProjectile();
			console.log(`Stock: ${projectilesStockpile.length}`);
		}
	}

	function shoot() {
		if (projectilesStockpile.length > 0) {
			frame.update();
			let projectile = projectilesStockpile.at(0);
			projectile.centerReg();
			projectile.loc(spacecraft.x, spacecraft.y);
			projectile.bot();
			projectile.ord(1);
			projectile.speed = 10;
			shootedProjectiles.push(projectile);
			projectilesStockpile.splice(0, 1);
			console.log(`Stock: ${projectilesStockpile.length}`);
			console.log(`Shooted: ${shootedProjectiles.length}`);
		}
		projectileFillProgressBar.percent = 100 * projectilesStockpile.length / projectileCapacity;
	}

	function moveProjectile(projectile) {
		projectile.y = projectile.y - projectile.speed;
	}

	function moveProjectiles() {
		let i = 0;
		while (i < shootedProjectiles.length) {
			moveProjectile(shootedProjectiles[i]);
			if (shootedProjectiles[i].y < 0 - shootedProjectiles[i].height - 50) {
				shootedProjectiles[i].dispose();
				shootedProjectiles[i] = null;
				shootedProjectiles.splice(i, 1);
			}
			i = i + 1;
		}
	}

	function projectileHitsAsteroid(projectile) {
		let i = 0;
		while (i < asteroids.length) {
			if (asteroids[i].hitTestCircle(projectile)) {
				asteroids[i].dispose();
				let explosion = new Sprite({
					image: "boom.png",
					rows: 3,
					cols: 8
				});
				explosion.centerReg();
				explosion.loc(projectile.x, projectile.y);
				explosion.run({
					time: 1,
					call: () => { explosion.dispose(); }
				});
				asteroids.splice(i, 1);
				incrementScore(5);
				score = score + 5;
				scoreLabel.text = score;
				return true;
			}
			i = i + 1;
		}
		return false;
	}

	function checkAllProjectiles() {
		let i = 0;
		while (i < shootedProjectiles.length) {
			if (projectileHitsAsteroid(shootedProjectiles[i])) {
				shootedProjectiles[i].dispose();
				shootedProjectiles[i] = null;
				shootedProjectiles.splice(i, 1);
				// break;
			}
			i = i + 1;
		}
	}


	let background = new Pic("background.jpg");
	background.centerReg();

	let lives = 3;
	let livesIcons = [];
	function fillLives() {
		let i = 0;
		while (i < lives) {
			livesIcons.push(new Sprite("starship.png"));
			livesIcons[i].centerReg();
			livesIcons[i].sca(0.4);
			livesIcons[i].loc(frame.stage.width - (i + 1) * livesIcons[i].width - 10, 80);
			i = i + 1;
		}
	}
	fillLives();
	let score = 0;
	let scoreLabel = new Label({
		text: score,
		size: 100,
		color: green
	});
	scoreLabel.loc(10, 10);

	let spacecraft = new Sprite("starship.png");
	spacecraft.centerReg();
	spacecraft.mov(0, 350);

	let thrust = new Sprite({
		image: "thrust.png",
		rows: 4,
		cols: 5
	});
	thrust.centerReg();
	thrust.mov(0, 450);
	thrust.run({
		time: 1,
		loop: true
	});

	let asteroids = [];
	let projectilesStockpile = [];
	let projectileCapacity = 20;
	let refillProjectileDelay = 1000;
	let projectileFillProgressBar = new ProgressBar({ barType: "rectangle", autoHide: false });
	projectileFillProgressBar.show();
	projectileFillProgressBar.loc(frame.stage.width - projectileFillProgressBar.width - 10, 20);
	fillProjectileStockpile();

	let shootedProjectiles = [];

	let endGameLabel = new Label({
		text: "GAME OVER",
		size: 150,
		bold: true,
		color: orange,
		align: "center"
	});
	endGameLabel.centerReg();
	endGameLabel.removeFrom(frame.stage);

	let newRecordLabel = new Label({
		text: `CONGRATULATIONS!\nYou set a new record score!`,
		size: 50,
		bold: true,
		color: red,
		align: 'center'
	});
	newRecordLabel.centerReg();
	newRecordLabel.mov(0, -200);
	newRecordLabel.removeFrom(frame.stage);

	let createAsteroidInterval = null;
	let updateScoreInterval = null;
	let refillProjectileStockpileInterval = null;
	function playGame() {
		createAsteroidInterval = setInterval(createAsteroid, 200);
		frame.stage.addEventListener("stagemousemove", moveSpaceCraft);
		frame.stage.addEventListener("click", shoot);
		Ticker.add(moveAllAsteroids);
		Ticker.add(checkAsteroidCollisions);
		Ticker.add(spaceCraftHit);
		Ticker.add(checkAllProjectiles);
		Ticker.add(moveProjectiles);
		updateScoreInterval = setInterval(() => { incrementScore(1); }, 2000)
		refillProjectileStockpileInterval = setInterval(fillProjectileStockpile, refillProjectileDelay);
	}

	async function restart() {
		response = await fetch(url + '?apikey=' + apikey);
		data = await response.json();
		console.log(data);
		maxScore = data.map(item => item.score).reduce((accu, item) => Math.max(accu, item));
		console.log(maxScore);

		spacecraft.addTo(frame.stage);
		frame.stage.addEventListener("stagemousemove", moveSpaceCraft);
		frame.stage.addEventListener("click", shoot);
		endGameLabel.removeFrom(frame.stage);
		newRecordLabel.removeFrom(frame.stage);
		frame.stage.removeEventListener("keydown", restart);
		score = 0;
		scoreLabel.text = score;
		scoreLabel.color = green;
		lives = 3;
		fillLives();
		projectilesStockpile = [];
		fillProjectileStockpile();
		shootedProjectiles = [];
		projectileFillProgressBar.percent = 100 * projectilesStockpile.length / projectileCapacity;
		createAsteroidInterval = setInterval(createAsteroid, 200);
		updateScoreInterval = setInterval(() => { incrementScore(1); }, 2000);
		refillProjectileStockpileInterval = setInterval(fillProjectileStockpile, refillProjectileDelay);
		document.removeEventListener("keydown", restart);
	}

	async function endGame() {
		frame.stage.removeEventListener("stagemousemove", moveSpaceCraft);
		frame.stage.removeEventListener("click", shoot);
		endGameLabel.addTo(frame.stage);
		if (score > maxScore) {
			newRecordLabel.addTo(frame.stage);
		}
		document.addEventListener("keydown", restart);
		clearInterval(createAsteroidInterval);
		createAsteroidInterval = null;
		clearInterval(updateScoreInterval);
		updateScoreInterval = null;
		clearInterval(refillProjectileStockpileInterval);
		refillProjectileStockpileInterval = null;
		let currentDate = new Date();
		let currentTimestamptz = currentDate.toISOString();
		let response = await fetch(url + "?apikey=" + apikey, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({ created_at: currentTimestamptz, score: score })
		});
		let data = await response.text();
		console.log(data);
	}

	playGame();
}