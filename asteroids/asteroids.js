import zim from "https://zimjs.org/cdn/016/zim"

let frame = new Frame(FIT, 1000, 1000, dark, light, start,
	["background.jpg", "starship.png", "thrust.png", "asteroid1.png", "asteroid2.png", "shipboom.png", "shoot.png", "boom.png"]);

function start() {
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
			setTimeout(fillProjectileStockpile, 2000);
			console.log(projectilesStockpile.length);
		}
	}

	function shoot() {
		if (projectilesStockpile.length > 0) {
			projectileFillProgressBar.percent = 100 * projectilesStockpile.length / projectileCapacity;
			frame.update();
			let projectile = projectilesStockpile.at(0);
			projectile.centerReg();
			projectile.loc(spacecraft.x, spacecraft.y);
			projectile.bot();
			projectile.ord(1);
			projectile.speed = 10;
			shootedProjectiles.push(projectile);
			projectilesStockpile.splice(0, 1);
			console.log(projectilesStockpile.length);
			if (projectilesStockpile.length == 0) {
				setTimeout(fillProjectileStockpile, 3000);
			}
		}
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
				score = score + 1;
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
				shootedProjectiles.splice(i, 1);
				break;
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
	let projectileCapacity = 5;
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

	let createAsteroidInterval = null;
	function playGame() {
		createAsteroidInterval = setInterval(createAsteroid, 200);
		frame.stage.addEventListener("stagemousemove", moveSpaceCraft);
		frame.stage.addEventListener("click", shoot);
		Ticker.add(moveAllAsteroids);
		Ticker.add(checkAsteroidCollisions);
		Ticker.add(spaceCraftHit);
		Ticker.add(checkAllProjectiles);
		Ticker.add(moveProjectiles);
	}

	function restart() {
		spacecraft.addTo(frame.stage);
		frame.stage.addEventListener("stagemousemove", moveSpaceCraft);
		frame.stage.addEventListener("click", shoot);
		endGameLabel.removeFrom(frame.stage);
		frame.stage.removeEventListener("keydown", restart);
		score = 0;
		scoreLabel.text = score;
		lives = 3;
		fillLives();
		projectilesStockpile = [];
		fillProjectileStockpile();
		shootedProjectiles = [];
		projectileFillProgressBar.percent = 100 * projectilesStockpile.length / projectileCapacity;
		createAsteroidInterval = setInterval(createAsteroid, 200);
	}

	function endGame() {
		frame.stage.removeEventListener("stagemousemove", moveSpaceCraft);
		frame.stage.removeEventListener("click", shoot);
		endGameLabel.addTo(frame.stage);
		document.addEventListener("keydown", restart);
		clearInterval(createAsteroidInterval);
	}

	playGame();
}