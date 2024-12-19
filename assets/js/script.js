const speler = document.getElementById('playerBase');
const speelveld = document.getElementById('playing-field');
const weapon = document.getElementById('player');
const bullet = document.getElementById('bullet');

let positionX = speelveld.clientWidth / 2 - 25; 
let positionY = speelveld.clientHeight / 2 - 25;

let bulletCenterX = speelveld.clientWidth / 2 - 2.5; 
let bulletCenterY = speelveld.clientHeight / 2 - 2.5;

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

  // zorgt ervoor dat de speler niet buiten het beeldscherm kan komen
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

    // Update bullet DOM position
    bulletData.element.style.transform = `translate(${bulletData.x}px, ${bulletData.y}px)`;

    // Remove bullets that are out of bounds
    const bulletOutsideField = bulletData.x >= 0 && bulletData.x <= speelveld.clientWidth - 10 &&
           bulletData.y >= 0 && bulletData.y <= speelveld.clientHeight - 10;
    
    if (!bulletOutsideField) { 
      const bulletToRemove = document.getElementById(bulletData.idName);
      bulletToRemove.remove();
    }

    return bulletOutsideField;

  });
}

// Main animation loop
function animationLoop() {
  updatePosition();
  updateBullets();
  requestAnimationFrame(animationLoop);
}

// Shoot a bullet
function shootBullet(targetX, targetY) {
  // Calculate angle to target
  const angle = Math.atan2(targetY - bulletCenterY, targetX - bulletCenterX);

  // Create a new bullet element
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

  // Add the bullet to the array
  bullets.push({
    element: newBullet,
    idName: newBullet.id,
    x: bulletCenterX,
    y: bulletCenterY,
    angle: angle
  });

  bulletCounter += 1;
}

// Start the animation loop
animationLoop();

// Listen for key presses
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Track the mouse and rotate the weapon
window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Calculate the center of the player
    let weaponCenterX = positionX + 25; 
    let weaponCenterY = positionY + 25;

    // Calculate the angle to the mouse
    let weaponAngle = Math.atan2(mouseY - weaponCenterY, mouseX - weaponCenterX);

    // Rotate the weapon
    weapon.style.transform = `rotate(${weaponAngle}rad)`;
});

// Fire a bullet on mouse click
window.addEventListener('click', (e) => {

  const mouseX = e.clientX;
  const mouseY = e.clientY;

  shootBullet(mouseX, mouseY);
});