const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const turboEl = document.getElementById('turbo');
const gameOverEl = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;


const backgroundImg = new Image();
backgroundImg.src = 'https://img.craftpix.net/2023/05/Free-RPG-Battleground-Asset-Pack4-720x480.webp';
let backgroundX = 0;
let backgroundSpeed = 2;

function drawBackground() {
  backgroundX -= backgroundSpeed;
  if (backgroundX <= -WIDTH) backgroundX = 0;
  ctx.drawImage(backgroundImg, backgroundX, 0, WIDTH, HEIGHT);
  ctx.drawImage(backgroundImg, backgroundX + WIDTH, 0, WIDTH, HEIGHT);
}


const playerImg = new Image();
playerImg.src = 'capivara.png';

const player = {
  x: 50,
  y: HEIGHT - 60,
  width: 40,
  height: 40,
  dy: 0,
  gravity: 0.8,
  jumpForce: -15,
  isJumping: false
};

let obstacles = [];
let obstacleSpeed = 6;
let obstacleFrequency = 90;
let frameCount = 0;

let score = 0;
let gameRunning = true;


window.addEventListener('keydown', e => {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && !player.isJumping && gameRunning) {
    player.dy = player.jumpForce;
    player.isJumping = true;
  }
});

restartBtn.addEventListener('click', () => {
  resetGame();
});

function resetGame() {
  obstacles = [];
  obstacleSpeed = 6;
  obstacleFrequency = 90;
  backgroundSpeed = 2;
  frameCount = 0;
  score = 0;
  gameRunning = true;
  player.y = HEIGHT - 60;
  player.dy = 0;
  player.isJumping = false;
  scoreEl.textContent = 'Pontuação: 0';
  gameOverEl.style.display = 'none';
  turboEl.style.display = 'none';
  loop();
}

function createObstacle() {
  const height = 30 + Math.random() * 40;
  const obstacle = {
    x: WIDTH,
    y: HEIGHT - height - 20,
    width: 20 + Math.random() * 20,
    height: height,
    color: '#f00'
  };
  obstacles.push(obstacle);
}

function updatePlayer() {
  player.dy += player.gravity;
  player.y += player.dy;

  if (player.y + player.height >= HEIGHT - 20) {
    player.y = HEIGHT - 20 - player.height;
    player.dy = 0;
    player.isJumping = false;
  }
}

function updateObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= obstacleSpeed;
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      score++;
      scoreEl.textContent = `Pontuação: ${score}`;

      if (score % 5 === 0 && score < 50) {
        obstacleSpeed += 0.5;
        if (obstacleFrequency > 40) obstacleFrequency -= 2;
      }

      // Ativa modo turbo a partir de 50 pontos
      if (score >= 50) {
        obstacleSpeed = 10;
        backgroundSpeed = 4;
        turboEl.style.display = 'block';
      }
    }
  }
}

function detectCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

function checkCollisions() {
  for (const obs of obstacles) {
    if (detectCollision(player, obs)) {
      gameRunning = false;
      gameOverEl.style.display = 'block';
      finalScoreEl.textContent = `Sua pontuação: ${score}`;
    }
  }
}

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  obstacles.forEach(obs => {
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
}

function drawGround() {
  ctx.fillStyle = '#444';
  ctx.fillRect(0, HEIGHT - 20, WIDTH, 20);
}

function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function loop() {
  if (!gameRunning) return;

  clear();
  drawBackground();
  updatePlayer();
  updateObstacles();
  checkCollisions();
  drawGround();
  drawPlayer();
  drawObstacles();

  frameCount++;
  if (frameCount % obstacleFrequency === 0) {
    createObstacle();
  }

  requestAnimationFrame(loop);
}


let assetsLoaded = 0;
function checkAssetsLoaded() {
  assetsLoaded++;
  if (assetsLoaded === 2) {
    resetGame();
  }
}

playerImg.onload = checkAssetsLoaded;
backgroundImg.onload = checkAssetsLoaded;
