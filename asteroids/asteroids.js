import zim from "https://zimjs.org/cdn/016/zim"

let frame = new Frame(FIT, 1000, 1000, dark, light, start,
	["background.jpg", "starship.png", "asteroid2.png", "shipboom.png"]);

function start() {
	let background = new Pic("background.jpg");
	background.centerReg();

	let spacecraft = new Sprite("starship.png");
	spacecraft.centerReg();
	spacecraft.mov(0, 350);

	let asteroids = [];
	function createAsteroid() {
		let asteroid = new Sprite("asteroid2.png");
		asteroid.speed = Math.random() * 9 + 1;
		asteroid.centerReg();
		asteroid.loc(Math.random() * 1000, -200);
		asteroids.push(asteroid);
	}
	setInterval(createAsteroid, 3000);

	function moveAsteroid(asteroid) {
		asteroid.y = asteroid.y + asteroid.speed;
	}
	function moveAllAsteroids() {
		let i = 0;
		while (i < asteroids.length) {
			moveAsteroid(asteroids[i]);
			i = i + 1;
		}
	}
	Ticker.add(moveAllAsteroids);

	function moveSpaceCraft(event) {
		spacecraft.loc(event.stageX, spacecraft.y);
		frame.update();

	}
	frame.stage.addEventListener("stagemousemove", moveSpaceCraft);

	function spaceCraftHitBy(asteroid) {
		return spacecraft.hitTestCircle(asteroid);
	}

	function spaceCraftHit() {
		let i = 0;
		while (i < asteroids.length) {
			if (spaceCraftHitBy(asteroids[i])) {
				spacecraft.dispose();
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
					time: 1
				});
			}
			i = i + 1;
		}
	}

	Ticker.add(spaceCraftHit);
}