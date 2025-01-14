let pauseGame = true;

const speler = document.getElementById('playerBase');
const speelveld = document.getElementById('playing-field');
const tileset = document.getElementById('tileset');
const pauseScreen = document.getElementById('pause-container');
const weapon = document.getElementById('player');
const bullet = document.getElementById('bullet');
const audio = document.getElementById('background-music');
const startScreen = document.getElementById('head-menu');
const settingsScreen = document.getElementById('settings');
const loginScreen = document.getElementById('login');
const menuScreen = document.getElementById('menu');

const originalPositions = {
  playerPositionX: speelveld.clientWidth / 2 - 25,
  playerPositionY: speelveld.clientHeight / 2 - 25,
  lastPlayerPositionX: 0,
  lastPlayerPositionY: 0,
  bulletCenterX: speelveld.clientWidth / 2 - 2.5,
  bulletCenterY: speelveld.clientHeight / 2 - 2.5,
}
let currentPositions = {...originalPositions};

const tilesetPositions = {
  x: 0 - (speelveld.clientWidth),
  y: 0 - (speelveld.clientHeight),
  speed: 2
}
let lastMouseXPosition = 0;
let lastMouseYPosition = 0;

let keys = {};

let bullets = [];
let bulletCounter = 0;
let bulletSpeed = 7;

let enemys = [];

const originalWaveStats = {
  currentWave: 1,
  enemyToSpawn: 10,
  enemysAlive: 10,
  totalEnemys: 0
}
let currentWaveStats = {...originalWaveStats};

const originalPlayerStats = {
  playerHealt: 10,
  walkingspeed: 3,
  weaponDamage: 10,
  playerLvl: 1,
  playerXp: 0,
  playerXpToNextLvl: 100,
  coins: 0
}
let currentPlayerStats = {...originalPlayerStats};

let lastTime = 0;
let spawnSpeed = 2000;

class enemy {
  constructor(positionX, positionY, speed, healtPoint, type) {
      this.positionX = positionX;
      this.positionY = positionY;
      this.speed = speed;
      this.healtPoint = healtPoint;
      this.type = type;
  }
}
window.addEventListener('load', () => {
  audio.volume = 0.1;
});
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
    let weaponCenterX = currentPositions.playerPositionX + 25; 
    let weaponCenterY = currentPositions.playerPositionY + 25;

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


// functie om het spel te pauzeren en te hervatten of te stoppen
function pausedGame(buttonName) {
  if (buttonName == 'resume') {
    pauseGame = false;
    pauseScreen.style.display = 'none';
  } else if (buttonName == 'restart') {

  } else if (buttonName == 'quit') {
    location.reload();
  }
}

function gameMenu(buttonName) {
  if (buttonName == 'start') {
    pauseGame = false;
    startScreen.style.display = 'none';
    audio.volume = 0.1;
    audio.play();

  } else if (buttonName == 'settings') {
    settingsScreen.style.display = 'flex';
    menuScreen.style.display = 'none';
    audio.volume = 0.1;
    audio.play();

  } else if (buttonName == 'login') {
    console.log('test');
    audio.volume = 0.1;
    audio.play();
    // menuScreen.style.display = 'none';
    // loginScreen.style.display = 'flex';

  } else if (buttonName == 'back') {
    settingsScreen.style.display = 'none';
    // loginScreen.style.display = 'none';
    menuScreen.style.display = 'flex';

  }
}

// functie om de positie van de speler te updaten
function updatePosition() {

  if (keys['w']) {
    if(tilesetPositions.y <= 0 && currentPositions.playerPositionY <= 75) {
      tilesetPositions.y += tilesetPositions.speed;
      enemys.forEach(enemyData => {
        enemyData.y += 2;
      });
    } else {
      currentPositions.playerPositionY -= currentPlayerStats.walkingspeed, 
      currentPositions.bulletCenterY -= currentPlayerStats.walkingspeed;
    }
  }
  if (keys['s']) {
    if(tilesetPositions.y >= 0 - (speelveld.clientHeight * 1.5) && currentPositions.playerPositionY >= speelveld.clientHeight - 125) {
      tilesetPositions.y -= tilesetPositions.speed;
      enemys.forEach(enemyData => {
        enemyData.y -= 2;
      });
    } else {
      currentPositions.playerPositionY += currentPlayerStats.walkingspeed,
      currentPositions.bulletCenterY += currentPlayerStats.walkingspeed; 
    }
  }
  if (keys['a']) {
    if(tilesetPositions.x <= 0 && currentPositions.playerPositionX <= 100) {
      tilesetPositions.x += tilesetPositions.speed;
      enemys.forEach(enemyData => {
        enemyData.x += 2;
      });
    } else {
      currentPositions.playerPositionX -= currentPlayerStats.walkingspeed, 
      currentPositions.bulletCenterX -= currentPlayerStats.walkingspeed;
    }
    
  }
  if (keys['d']) {
    if(tilesetPositions.x >= 0 - (speelveld.clientWidth * 1.5) && currentPositions.playerPositionX >= speelveld.clientWidth - 150) {
      tilesetPositions.x -= tilesetPositions.speed;
      enemys.forEach(enemyData => {
        enemyData.x -= 2;
      });
    } else {
      currentPositions.playerPositionX += currentPlayerStats.walkingspeed, 
      currentPositions.bulletCenterX += currentPlayerStats.walkingspeed;
    }
  }

  tileset.style.transform = `translate(${tilesetPositions.x}px, ${tilesetPositions.y}px)`;

  // zorgt ervoor dat de speler/shietpunt niet buiten het beeldscherm kan komen
  currentPositions.playerPositionX = Math.max(0, Math.min(speelveld.clientWidth - 50, currentPositions.playerPositionX));
  currentPositions.playerPositionY = Math.max(0, Math.min(speelveld.clientHeight - 50, currentPositions.playerPositionY));

  currentPositions.bulletCenterX = Math.max(25, Math.min(speelveld.clientWidth - 25, currentPositions.bulletCenterX));
  currentPositions.bulletCenterY = Math.max(25, Math.min(speelveld.clientHeight - 25, currentPositions.bulletCenterY));

  currentPositions.lastPlayerPositionX = currentPositions.playerPositionX;
  currentPositions.lastPlayerPositionY = currentPositions.playerPositionY;

  speler.style.transform = `translate(${currentPositions.playerPositionX}px, ${currentPositions.playerPositionY}px)`;
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
        const enemyHpBar = document.getElementById(`${enemyData.hpId}`);

        enemyHpBar.style.width = `${Math.floor(enemyData.healtPoint / enemyData.startHp * 100)}%`;

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
  
    enemyAngleCheck = Math.atan2(currentPositions.lastPlayerPositionY - enemyData.y, currentPositions.lastPlayerPositionX - enemyData.x);
    console.log(enemyAngleCheck);
    enemyData.animation += 1;
    const enemyAnimationSprite = document.getElementById(`${enemyData.idName}`);

    if(enemyData.angle == enemyAngleCheck) { 
      enemyData.x += Math.cos(enemyData.angle) * enemyData.speed;
      enemyData.y += Math.sin(enemyData.angle) * enemyData.speed;
    } else {
      enemyData.x += Math.cos(enemyAngleCheck) * enemyData.speed;
      enemyData.y += Math.sin(enemyAngleCheck) * enemyData.speed;
    }

    
    if(enemyData.animation <= 60) {
      enemyAnimationSprite.style.backgroundPositionX = '0px';

    } else if(enemyData.animation > 60 && enemyData.animation <= 120) {
      enemyAnimationSprite.style.backgroundPositionX = '225px';
    } else if(enemyData.animation > 120 && enemyData.animation <= 180) {
      enemyAnimationSprite.style.backgroundPositionX = '150px';
    } else if(enemyData.animation > 180 && enemyData.animation <= 240) {
      enemyAnimationSprite.style.backgroundPositionX = '75px';
      enemyData.animation = 0;
    }

    // update de positie van de vijand
    enemyData.element.style.transform = `translate(${enemyData.x}px, ${enemyData.y}px)`;

    return true;
  });
}

function followMouseUpdate() {

  if(lastMouseXPosition != 0 && lastMouseYPosition != 0) {
  // het middenpunt van het wapen
  let weaponCenterX = currentPositions.playerPositionX + 25; 
  let weaponCenterY = currentPositions.playerPositionY + 25;

  // berekent de hoek van de muis ten opzichte van het wapen
  let weaponAngle = Math.atan2(lastMouseYPosition - weaponCenterY, lastMouseXPosition - weaponCenterX);

  // zorgt ervoor dat het wapen de muis volgt
  weapon.style.transform = `rotate(${weaponAngle}rad)`;

  }

}

// kogels schieten
function shootBullet(targetX, targetY) {
  if(pauseGame == false) {
    // zorgt er voor dat de kogel met de goede angle weg schieten
    const angle = Math.atan2(targetY - currentPositions.bulletCenterY, targetX - currentPositions.bulletCenterX);
    let shootBulletX = currentPositions.bulletCenterX + Math.cos(angle) * 50;
    let shootBulletY = currentPositions.bulletCenterY + Math.sin(angle) * 50;

    // maakt een nieuwe kogel element aan
    const newBullet = document.createElement('div');
    newBullet.id = `bullet${bulletCounter}`;
    newBullet.className = 'bullet';
    newBullet.style.position = 'absolute';
    newBullet.style.width = '5px';
    newBullet.style.height = '5px';
    newBullet.style.backgroundColor = 'red';
    newBullet.style.borderRadius = '50%';
    newBullet.style.transform = `translate(${shootBulletX}px, ${shootBulletY}px)`;
    speelveld.appendChild(newBullet);

    // zet de kogel in de bullets array
    bullets.push({
      element: newBullet,
      idName: newBullet.id,
      x: shootBulletX,
      y: shootBulletY,
      angle: angle
    });

    bulletCounter += 1;
  }
}

// functie om vijanden te spawnen
function enemySpawn() {

  spawnPositionX = Math.random() * speelveld.clientWidth;
  spawnPositionY = Math.random() * speelveld.clientHeight;
 if (spawnPositionX >= currentPositions.playerPositionX- 30 && spawnPositionX <= currentPositions.playerPositionX + 80) {
    spawnPositionX += 150;
 }
 if(spawnPositionY >= currentPositions.playerPositionY - 30 && spawnPositionY <= currentPositions.PositionY + 80) {
    spawnPositionY += 150;
 }

  const newEnemy = new enemy(spawnPositionX, spawnPositionY, 0.5, 100, "normal");
  enemyAngle = Math.atan2(currentPositions.lastPlayerPositionY - newEnemy.positionY, currentPositions.lastPlayerPositionX- newEnemy.positionX);

  const newEnemySpawn = document.createElement('div');
  newEnemySpawn.id = `enemy${currentWaveStats.totalEnemys}`;
  newEnemySpawn.className = 'enemy';
  // newEnemySpawn.style.position = 'absolute';
  newEnemySpawn.style.width = '75px';
  newEnemySpawn.style.height = '85px';
  newEnemySpawn.style.backgroundColor = 'green';
  newEnemySpawn.style.backgroundImage = 'url(assets/img/snowmanSpriteSheetTest.png)';
  newEnemySpawn.style.backgroundSize = '300px 170px';
  newEnemySpawn.style.backgroundPositionX = '0px';
  newEnemySpawn.style.backgroundPositionY = '0px';
  newEnemySpawn.style.position = 'absolute';
  newEnemySpawn.style.pointerEvents = 'none';
  newEnemySpawn.style.transform = `translate(${newEnemy.positionX}px, ${newEnemy.positionY}px)`;
  speelveld.appendChild(newEnemySpawn);

  const newestEnemy = document.getElementById(`enemy${currentWaveStats.totalEnemys}`);

  const enemyHpBar = document.createElement('div');
  enemyHpBar.id = `enemyHpBar${currentWaveStats.totalEnemys}`;
  enemyHpBar.className = 'enemyHpBar';
  enemyHpBar.style.width = '100%';
  enemyHpBar.style.height = '3px';
  enemyHpBar.style.backgroundColor = 'red';
  enemyHpBar.style.position = 'absolute';
  enemyHpBar.style.top = '90px';
 
  newestEnemy.appendChild(enemyHpBar);

  enemys.push({
    element: newEnemySpawn,
    idName: newEnemySpawn.id,
    hpId: enemyHpBar.id,
    x: newEnemy.positionX,
    y: newEnemy.positionY,
    speed: newEnemy.speed,
    healtPoint: newEnemy.healtPoint,
    startHp: newEnemy.healtPoint,
    angle: enemyAngle,
    animation: 0
  });

  currentWaveStats.totalEnemys += 1;	
  currentWaveStats.enemyToSpawn -= 1;	

}

function removeEnemy(enemyNumber, enemyId) {

  const enemyToRemove = document.getElementById(enemyId);
  const xpbar = document.getElementById('xp-progression');
  const playerCoins = document.getElementById('coins');

  if (enemyToRemove) enemyToRemove.remove();
  enemys.splice(enemyNumber, 1);
  currentWaveStats.enemysAlive -= 1;

  currentPlayerStats.playerXp += 10;
  currentPlayerStats.coins += 2;
  playerCoins.textContent = `Coins: ${currentPlayerStats.coins}`;

  currentXp = currentPlayerStats.playerXp / currentPlayerStats.playerXpToNextLvl * 100;
  
  if (currentXp >= 100) {
    currentXp = 0;
    currentPlayerStats.playerXp = 0;
    currentPlayerStats.playerXpToNextLvl = currentPlayerStats.playerXpToNextLvl * 1.4;
    xpbar.style.width = `${currentXp}%`;
    const playerHp = document.getElementById('playerHealt');
    const lvlUp = document.getElementById('playerLvl');
    
    playerHp.textContent = `HP: ${currentPlayerStats.playerHealt + 2}`;
    lvlUp.textContent = `LVL: ${currentPlayerStats.playerLvl += 1}`;
  } else {
    xpbar.style.width = `${currentXp}%`;
  }
  
  if (currentWaveStats.enemysAlive == 0) {
    waveOver();
  }
}

function waveOver() {
  const wave = document.getElementById('wave-container');
  const shop = document.getElementById('shop-container');

  pauseGame = true;
  currentWaveStats.currentWave += 1;
  spawnSpeed = spawnSpeed * 0.98;
  wave.textContent = `Wave: ${currentWaveStats.currentWave}`;
  
  shop.style.display = 'flex';
  currentWaveStats.enemyToSpawn = currentWaveStats.totalEnemys * 1.5;
  currentWaveStats.enemysAlive = currentWaveStats.enemyToSpawn;
  currentWaveStats.totalEnemys = 0;
}

// loop voor de animaties
function animationLoop(now) {
  if (pauseGame == false && currentWaveStats.enemysAlive > 0) {
    updatePosition();
    updateBullets();
    updateEnemyPosition();
    followMouseUpdate();

    if (!now && currentWaveStats.enemyToSpawn != 0 || now - lastTime >= spawnSpeed && currentWaveStats.enemyToSpawn != 0) {
      lastTime = now;
      enemySpawn();
    }
  }
  requestAnimationFrame(animationLoop);
}


// start de loop van de animaties
animationLoop(0);

