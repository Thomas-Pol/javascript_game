const speler = document.getElementById('playerBase');
const speelveld = document.getElementById('playing-field');
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

const walkingspeed = 3; 
const bulletSpeed = 7;
const keys = {};

let bulletCounter = 0;

var bullets = [];

var enemys = [];
let totalEnemys = 0;

class enemy {
  constructor(positionX, positionY, speed, healtPoint, type) {
      this.positionX = positionX;
      this.positionY = positionY;
      this.speed = speed;
      this.healtPoint = healtPoint;
      this.type = type;
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
        console.log(enemyData.healtPoint);

        const bulletToRemove = document.getElementById(bulletData.idName);
        if (bulletToRemove) bulletToRemove.remove();

        bulletHitEnemy = true;

        if(enemyData.healtPoint <= 0) {
          const enemyToRemove = document.getElementById(enemyData.idName);
          if (enemyToRemove) enemyToRemove.remove();
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

// wordt uit gevoerd of een toets wordt in gedrukt of wordt los gelaten
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// laat het wapen de muis volgen
window.addEventListener('mousemove', (e) => {

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
});

// als er wordt geklikt wordt er een kogel geschoten
window.addEventListener('click', (e) => {

  const mouseX = e.clientX;
  const mouseY = e.clientY;

  shootBullet(mouseX, mouseY);
});

// functie om vijanden te spawnen
function enemySpawn(lastPositionX, lastPositionY) {

  const newEnemy = new enemy(150, 150, 1, 100, "normal");
  enemyAngle = Math.atan2(lastPositionY - newEnemy.positionY, lastPositionX- newEnemy.positionX);
  console.log(newEnemy);

  const newEnemySpawn = document.createElement('div');
  newEnemySpawn.id = `enemy${totalEnemys}`;
  newEnemySpawn.className = 'enemy';
  newEnemySpawn.style.position = 'absolute';
  newEnemySpawn.style.width = '30px';
  newEnemySpawn.style.height = '30px';
  newEnemySpawn.style.backgroundColor = 'green';
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

  const newEnemys = new enemy(210, 210, 1, 100, "normal");
  console.log(newEnemys);

  const newEnemySpawns = document.createElement('div');
  newEnemySpawns.id = `enemy${totalEnemys}`;
  newEnemySpawns.className = 'enemy';
  newEnemySpawns.style.position = 'absolute';
  newEnemySpawns.style.width = '30px';
  newEnemySpawns.style.height = '30px';
  newEnemySpawns.style.backgroundColor = 'green';
  newEnemySpawns.style.transform = `translate(${newEnemys.positionX}px, ${newEnemys.positionX}px)`;
  speelveld.appendChild(newEnemySpawns);

  enemys.push({
    element: newEnemySpawns,
    idName: newEnemySpawns.id,
    x: newEnemys.positionX,
    y: newEnemys.positionY,
    speed: newEnemys.speed,
    healtPoint: newEnemys.healtPoint,
    angle: enemyAngle
  });
  
}

// loop voor de animaties
function animationLoop() {
  updatePosition();
  updateBullets();
  updateEnemyPosition();
  followMouseUpdate();
  requestAnimationFrame(animationLoop);
}

// start de loop van de animaties
animationLoop();
enemySpawn(lastPositionX, lastPositionY);
