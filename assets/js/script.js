let pauseGame = false;

const speler = document.getElementById('playerBase');
const speelveld = document.getElementById('playing-field');
const pauseScreen = document.getElementById('pause-container');
const weapon = document.getElementById('player');
const bullet = document.getElementById('bullet');

let positionX = speelveld.clientWidth / 2 - 25; 
let positionY = speelveld.clientHeight / 2 - 25;

let lastPositionX = 0;
let lastPositionY = 0;

let bulletCenterX = speelveld.clientWidth / 2 - 2.5; 
let bulletCenterY = speelveld.clientHeight / 2 - 2.5;

let lastMouseXPosition = 0;
let lastMouseYPosition = 0;

let walkingspeed = 3; 
let bulletSpeed = 7;
let keys = {};

let bulletCounter = 0;
let bullets = [];

let enemys = [];
let totalEnemys = 0;

let currentWave = 1;
let enemyToSpawn = 10;
let enemysAlive = enemyToSpawn;

let playerHealt = 100;
let playerLvl = 1;
let playerXp = 0;
let playerXpToNextLvl = 100;
let coins = 0;

var lastTime = 0;

class enemy {
  constructor(positionX, positionY, speed, healtPoint, type) {
      this.positionX = positionX;
      this.positionY = positionY;
      this.speed = speed;
      this.healtPoint = healtPoint;
      this.type = type;
  }

}

// wordt uit gevoerd of een toets wordt in gedrukt of wordt los gelaten
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if	(e.key == 'Escape' && pauseGame == false) {
    pauseGame = true;
    pauseScreen.style.display = 'flex';
  } else if (e.key == 'Escape' && pauseGame == true) {
    pauseGame = false;
    pauseScreen.style.display = 'none';
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// laat het wapen de muis volgen
window.addEventListener('mousemove', (e) => {
  if (pauseGame	== false) { 
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    lastMouseXPosition = e.clientX;
    lastMouseYPosition = e.clientY;

    // het middenpunt van het wapen
    let weaponCenterX = positionX + 25; 
    let weaponCenterY = positionY + 25;

    // berekent de hoek van de muis ten opzichte van het wapen
    let weaponAngle = Math.atan2(mouseY - weaponCenterY, mouseX - weaponCenterX);

    // zorgt ervoor dat het wapen de muis volgt
    weapon.style.transform = `rotate(${weaponAngle}rad)`;
  }
});

// als er wordt geklikt wordt er een kogel geschoten
window.addEventListener('click', (e) => {
  if (pauseGame == false) { 
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    shootBullet(mouseX, mouseY);
  }

});

function pausedGame(buttonName) {
  if (buttonName == 'resume') {
    pauseGame = false;
    pauseScreen.style.display = 'none';
  }
}

// functie om de positie van de speler te updaten
function updatePosition() {
  if (keys['w']) positionY -= walkingspeed, bulletCenterY -= walkingspeed;
  if (keys['s']) positionY += walkingspeed, bulletCenterY += walkingspeed;
  if (keys['a']) positionX -= walkingspeed, bulletCenterX -= walkingspeed;
  if (keys['d']) positionX += walkingspeed, bulletCenterX += walkingspeed;

  // zorgt ervoor dat de speler/shietpunt niet buiten het beeldscherm kan komen
  positionX = Math.max(0, Math.min(speelveld.clientWidth - 50, positionX));
  positionY = Math.max(0, Math.min(speelveld.clientHeight - 50, positionY));

  bulletCenterX = Math.max(25, Math.min(speelveld.clientWidth - 25, bulletCenterX));
  bulletCenterY = Math.max(25, Math.min(speelveld.clientHeight - 25, bulletCenterY));

  lastPositionX = positionX;
  lastPositionY = positionY;

  speler.style.transform = `translate(${positionX}px, ${positionY}px)`;
}

// functie om de positie van de kogels te updaten
function updateBullets() {
  bullets = bullets.filter(bulletData => {

    bulletData.x += Math.cos(bulletData.angle) * bulletSpeed;
    bulletData.y += Math.sin(bulletData.angle) * bulletSpeed;

    // update de positie van de kogel
    bulletData.element.style.transform = `translate(${bulletData.x}px, ${bulletData.y}px)`;

    // haalt de kogel weg als deze buiten het speelveld komt
    const bulletOutsideField = bulletData.x <= 0 && bulletData.x >= speelveld.clientWidth - 10 &&
           bulletData.y <= 0 && bulletData.y >= speelveld.clientHeight - 10;
      
    let bulletHitEnemy = false;

    enemys.forEach(enemyData => {
      
      if(bulletData.x >= enemyData.x && bulletData.x <= enemyData.x + 30 && bulletData.y >= enemyData.y && bulletData.y <= enemyData.y + 30) {
        enemyData.healtPoint -= 10;
        const bulletToRemove = document.getElementById(bulletData.idName);
        if (bulletToRemove) bulletToRemove.remove();
        
        bulletHitEnemy = true;
        if(enemyData.healtPoint <= 0) {
          removeEnemy(enemys.indexOf(enemyData), enemyData.idName);
        }
      }
    });

    if (bulletOutsideField || bulletHitEnemy) { 
      const bulletToRemove = document.getElementById(bulletData.idName);
      if (bulletToRemove) bulletToRemove.remove();
      return false;
    }

    return true;

  });
}

function updateEnemyPosition() {
  enemys = enemys.filter(enemyData => {
  
    enemyAngleCheck = Math.atan2(lastPositionY - enemyData.y, lastPositionX - enemyData.x);

    if(enemyData.angle == enemyAngleCheck) { 
      enemyData.x += Math.cos(enemyData.angle) * enemyData.speed;
      enemyData.y += Math.sin(enemyData.angle) * enemyData.speed;
    } else {
      enemyData.x += Math.cos(enemyAngleCheck) * enemyData.speed;
      enemyData.y += Math.sin(enemyAngleCheck) * enemyData.speed;
    }

    // update de positie van de vijand
    enemyData.element.style.transform = `translate(${enemyData.x}px, ${enemyData.y}px)`;

    return true;
  });
}

function followMouseUpdate() {

  if(lastMouseXPosition != 0 && lastMouseYPosition != 0) {
  // het middenpunt van het wapen
  let weaponCenterX = positionX + 25; 
  let weaponCenterY = positionY + 25;

  // berekent de hoek van de muis ten opzichte van het wapen
  let weaponAngle = Math.atan2(lastMouseYPosition - weaponCenterY, lastMouseXPosition - weaponCenterX);

  // zorgt ervoor dat het wapen de muis volgt
  weapon.style.transform = `rotate(${weaponAngle}rad)`;

  }

}

// =kogels schieten
function shootBullet(targetX, targetY) {
  if(pauseGame == false) {
    // zorgt er voor dat de kogel met de goede angle weg schieten
    const angle = Math.atan2(targetY - bulletCenterY, targetX - bulletCenterX);

    // maakt een nieuwe kogel element aan
    const newBullet = document.createElement('div');
    newBullet.id = `bullet${bulletCounter}`;
    newBullet.className = 'bullet';
    newBullet.style.position = 'absolute';
    newBullet.style.width = '5px';
    newBullet.style.height = '5px';
    newBullet.style.backgroundColor = 'red';
    newBullet.style.borderRadius = '50%';
    newBullet.style.transform = `translate(${bulletCenterX}px, ${bulletCenterY}px)`;
    speelveld.appendChild(newBullet);

    // zet de kogel in de bullets array
    bullets.push({
      element: newBullet,
      idName: newBullet.id,
      x: bulletCenterX,
      y: bulletCenterY,
      angle: angle
    });

    bulletCounter += 1;
  }
}

// functie om vijanden te spawnen
function enemySpawn() {

  spawnPositionX = Math.random() * speelveld.clientWidth;
  spawnPositionY = Math.random() * speelveld.clientHeight;
 if (spawnPositionX >= positionX- 30 && spawnPositionX <= positionX + 80) {
    spawnPositionX += 150;
 }
 if(spawnPositionY >= positionY - 30 && spawnPositionY <= positionY + 80) {
    spawnPositionY += 150;
 }

  const newEnemy = new enemy(spawnPositionX, spawnPositionY, 0.5, 100, "normal");
  enemyAngle = Math.atan2(lastPositionY - newEnemy.positionY, lastPositionX- newEnemy.positionX);

  const newEnemySpawn = document.createElement('div');
  newEnemySpawn.id = `enemy${totalEnemys}`;
  newEnemySpawn.className = 'enemy';
  newEnemySpawn.style.position = 'absolute';
  newEnemySpawn.style.width = '30px';
  newEnemySpawn.style.height = '30px';
  newEnemySpawn.style.backgroundColor = 'green';
  newEnemySpawn.style.pointerEvents = 'none';
  newEnemySpawn.style.transform = `translate(${newEnemy.positionX}px, ${newEnemy.positionX}px)`;
  speelveld.appendChild(newEnemySpawn);

  enemys.push({
    element: newEnemySpawn,
    idName: newEnemySpawn.id,
    x: newEnemy.positionX,
    y: newEnemy.positionY,
    speed: newEnemy.speed,
    healtPoint: newEnemy.healtPoint,
    angle: enemyAngle
  });

  totalEnemys += 1;	
  enemyToSpawn -= 1;	

}

function removeEnemy(enemyNumber, enemyId) {

  const enemyToRemove = document.getElementById(enemyId);
  const xpbar = document.getElementById('xp-progression');

  if (enemyToRemove) enemyToRemove.remove();
  enemys.splice(enemyNumber, 1);
  enemysAlive -= 1;

  playerXp += 10;
  coins += 2;
  currentXp = playerXp / playerXpToNextLvl * 100;

  if (currentXp >= 100) {
    currentXp = 0;
    playerXp = 0;
    playerXpToNextLvl = playerXpToNextLvl * 1.4;
    xpbar.style.width = `${currentXp}%`;
    const lvlUp = document.getElementById('playerLvl');
    lvlUp.textContent = `LVL: ${playerLvl += 1}`;
  } else {
    xpbar.style.width = `${currentXp}%`;
  }
  
  if (enemysAlive == 0) {
    waveOver();
  }
}

function waveOver() {
  const wave = document.getElementById('wave-container');
  const shop = document.getElementById('shop-container');

  currentWave += 1;

  wave.textContent = `Wave: ${currentWave}`;
  shop.style.display = 'flex';
  
    // enemyToSpawn = totalEnemys * 1.5;
    // enemysAlive = enemyToSpawn;
    // totalEnemys = 0;
    // pauseGame = true;
    // pauseScreen.style.display = 'flex';
}

// loop voor de animaties
function animationLoop(now) {
  if (pauseGame == false && enemysAlive > 0) {
    updatePosition();
    updateBullets();
    updateEnemyPosition();
    followMouseUpdate();

    if (!now && enemyToSpawn != 0|| now - lastTime >= 2*1000 && enemyToSpawn != 0) {
      lastTime = now;
      enemySpawn();
    }
  }
  requestAnimationFrame(animationLoop);
}


// start de loop van de animaties
animationLoop(0);

