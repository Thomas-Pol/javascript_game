const speler = document.getElementById('playerBase');
const speelveld = document.getElementById('playing-field');
const weapon = document.getElementById('player');
const bullet = document.getElementById('bullet');

let positionX = speelveld.clientWidth / 2 - 25; 
let positionY = speelveld.clientHeight / 2 - 25;

let bulletCenterX = speelveld.clientWidth / 2 - 2.5; 
let bulletCenterY = speelveld.clientHeight / 2 - 2.5;

let lastMouseXPosition = 0;
let lastMouseYPosition = 0;

const walkingspeed = 3; 
const bulletSpeed = 5;
const keys = {};

let bulletCounter = 0;

// array om de kogels te bewaren
var bullets = [];

// functie om de positie van de speler te updaten
function updatePosition() {
  if (keys['w']) positionY -= walkingspeed, bulletCenterY -= walkingspeed;
  if (keys['s']) positionY += walkingspeed, bulletCenterY += walkingspeed;
  if (keys['a']) positionX -= walkingspeed, bulletCenterX -= walkingspeed;
  if (keys['d']) positionX += walkingspeed, bulletCenterX += walkingspeed;

  // zorgt ervoor dat de speler/shietpunt niet buiten het beeldscherm kan komen
  positionX = Math.max(0, Math.min(speelveld.clientWidth - 50, positionX));
  positionY = Math.max(0, Math.min(speelveld.clientHeight - 50, positionY));

  bulletCenterX = Math.max(25, Math.min(speelveld.clientWidth - 50, bulletCenterX));
  bulletCenterY = Math.max(25, Math.min(speelveld.clientHeight - 50, bulletCenterY));

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
    const bulletOutsideField = bulletData.x >= 0 && bulletData.x <= speelveld.clientWidth - 10 &&
           bulletData.y >= 0 && bulletData.y <= speelveld.clientHeight - 10;
    
    if (!bulletOutsideField) { 
      const bulletToRemove = document.getElementById(bulletData.idName);
      bulletToRemove.remove();
    }

    return bulletOutsideField;

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

// loop voor de animaties
function animationLoop() {
  updatePosition();
  updateBullets();
  followMouseUpdate();
  requestAnimationFrame(animationLoop);
}

// start de loop van de animaties
animationLoop();