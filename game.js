const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameActive = false;
let difficulty = "NORMAL";
let gameSpeed = 100;
let snakeColor = "#00ff00";
let highScore = 0;
let isPaused = false;
let isDarkTheme = true;

const menuElement = document.getElementById("menu");
const gameContainer = document.getElementById("gameContainer");
const startButton = document.getElementById("startButton");
const menuButton = document.getElementById("menuButton");
const difficultyButton = document.getElementById("difficultyButton");
const colorButton = document.getElementById("colorButton");
const highScoreElement = document.getElementById("highScore");
const pauseButton = document.getElementById("pauseButton");
const themeButton = document.getElementById("themeButton");
const gameOverModal = document.getElementById("gameOverModal");
const finalScore = document.getElementById("finalScore");
const finalHighScore = document.getElementById("finalHighScore");
const restartButton = document.getElementById("restartButton");
const backToMenuButton = document.getElementById("backToMenuButton");
const colorPreview = document.getElementById("colorPreview");

startButton.addEventListener("click", startGame);
menuButton.addEventListener("click", showMenu);
difficultyButton.addEventListener("click", changeDifficulty);
colorButton.addEventListener("click", changeSnakeColor);
pauseButton.addEventListener("click", togglePause);
themeButton.addEventListener("click", toggleTheme);
restartButton.addEventListener("click", startGame);
backToMenuButton.addEventListener("click", showMenu);

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const SPACE_KEY = 32;
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if (
    [UP_KEY, DOWN_KEY, LEFT_KEY, RIGHT_KEY, SPACE_KEY].includes(event.keyCode)
  ) {
    event.preventDefault();
  }

  if (event.keyCode === SPACE_KEY) {
    togglePause();
    return;
  }

  if (isPaused) return;

  const keyPressed = event.keyCode;
  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingRight = dx === 1;
  const goingLeft = dx === -1;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -1;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -1;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 1;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 1;
  }
}

function startGame() {
  gameActive = true;
  menuElement.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  gameOverModal.classList.add("hidden");
  gameOverModal.style.display = "none";
  resetGame();
  drawGame();
  colorPreview.style.backgroundColor = snakeColor;
  colorPreview.style.color = snakeColor;
}

function showMenu() {
  gameActive = false;
  menuElement.classList.remove("hidden");
  gameContainer.classList.add("hidden");
  gameOverModal.classList.add("hidden");
  gameOverModal.style.display = "none";
}

function changeDifficulty() {
  switch (difficulty) {
    case "NORMAL":
      difficulty = "HARD";
      gameSpeed = 70;
      break;
    case "HARD":
      difficulty = "EASY";
      gameSpeed = 130;
      break;
    default:
      difficulty = "NORMAL";
      gameSpeed = 100;
  }
  difficultyButton.textContent = `DIFFICULTY: ${difficulty}`;
}

function changeSnakeColor() {
  const colors = ["#00ff00", "#0ff", "#ff00ff", "#ff0000", "#ffff00"];
  const currentIndex = colors.indexOf(snakeColor);
  snakeColor = colors[(currentIndex + 1) % colors.length];
  colorPreview.style.backgroundColor = snakeColor;
  colorPreview.style.color = snakeColor;
}

function drawGame() {
  if (!gameActive || isPaused) return;
  clearCanvas();
  moveSnake();
  drawSnake();
  drawFood();
  checkCollision();
  setTimeout(drawGame, gameSpeed);
}

function clearCanvas() {
  ctx.fillStyle = isDarkTheme ? "black" : "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    createEatingEffect(food.x, food.y);
    generateFood();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = isDarkTheme ? "#fff" : "#000";
  snake.forEach((segment) => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
    ctx.strokeRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  });
}

function drawFood() {
  ctx.fillStyle = "#ff00ff";
  ctx.shadowColor = "#ff00ff";
  ctx.shadowBlur = 10 + Math.sin(Date.now() / 200) * 5;
  ctx.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize - 2,
    gridSize - 2
  );
  ctx.shadowBlur = 0;
}

function generateFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
    }
  }
}

function resetGame() {
  if (score > highScore) {
    highScore = score;
    highScoreElement.textContent = highScore;
  }
  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 15 };
  dx = 0;
  dy = 0;
  score = 0;
  scoreElement.textContent = score;
  isPaused = false;
  pauseButton.textContent = "PAUSE";
  pauseButton.classList.remove("paused");
}

function gameOver() {
  gameActive = false;
  finalScore.textContent = score;
  finalHighScore.textContent = highScore;
  gameOverModal.classList.remove("hidden");
  gameOverModal.style.display = "flex";
}

function togglePause() {
  isPaused = !isPaused;
  if (isPaused) {
    pauseButton.textContent = "RESUME";
    pauseButton.classList.add("paused");
  } else {
    pauseButton.textContent = "PAUSE";
    pauseButton.classList.remove("paused");
    drawGame();
  }
}

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  document.body.classList.toggle("light-theme");
  themeButton.textContent = `THEME: ${isDarkTheme ? "DARK" : "LIGHT"}`;
}

class Particle {
  constructor(x, y) {
    this.x = x * gridSize + gridSize / 2;
    this.y = y * gridSize + gridSize / 2;
    this.size = Math.random() * 3 + 2;
    this.speedX = (Math.random() - 0.5) * 8;
    this.speedY = (Math.random() - 0.5) * 8;
    this.gravity = 0.2;
    this.life = 1;
    this.colors = ["#0ff", "#ff00ff", "#00ff00", "#ff0"];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.life -= 0.02;
  }

  draw() {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.globalAlpha = this.life;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.restore();
  }
}

function createEatingEffect(x, y) {
  const particles = [];
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(x, y));
  }

  const animateParticles = () => {
    ctx.save();
    particles.forEach((particle, index) => {
      particle.update();
      particle.draw();

      if (particle.life <= 0) {
        particles.splice(index, 1);
      }
    });
    ctx.restore();

    if (particles.length > 0) {
      requestAnimationFrame(animateParticles);
    }
  };

  animateParticles();
}

drawGame();
