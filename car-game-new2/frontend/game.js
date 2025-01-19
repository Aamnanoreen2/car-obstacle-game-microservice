// Get the canvas and score elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverContainer = document.getElementById("gameOverContainer");
const restartButton = document.getElementById("restartButton");
const gameOverMessage = document.getElementById("gameOverMessage");

canvas.width = 500;
canvas.height = 500;

let car = {
  x: 225,
  y: 400,
  width: 50,
  height: 80,  // Reduced height of the car
  color: "red",
  speed: 5
};

let obstacles = [];
let score = 0;

// Control the car with arrow keys
let rightPressed = false;
let leftPressed = false;

let gameOver = false;  // New game over state

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  }
  if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  }
  if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

// Generate obstacles at random intervals
function generateObstacles() {
  if (Math.random() < 0.05) {
    let width = Math.random() * 30 + 30;  // Adjust width range here to make obstacles smaller
    let x = Math.random() * (canvas.width - width);
    let obstacle = {
      x: x,
      y: -50,
      width: width,
      height: 20,
      color: "green"
    };
    obstacles.push(obstacle);
  }
}

// Move the obstacles and check for collision with the car
function moveObstacles() {
  if (gameOver) return;  // Stop moving obstacles if game is over

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].y += 2;
    if (obstacles[i].y > canvas.height) {
      obstacles.splice(i, 1);
      score++;
    }

    // Check for collision
    if (car.x < obstacles[i].x + obstacles[i].width &&
      car.x + car.width > obstacles[i].x &&
      car.y < obstacles[i].y + obstacles[i].height &&
      car.y + car.height > obstacles[i].y) {
        resetGame();
    }
  }
}

// Draw the car and obstacles
function drawCar() {
  ctx.beginPath();
  ctx.rect(car.x, car.y, car.width, car.height);
  ctx.fillStyle = car.color;
  ctx.fill();
  ctx.closePath();
}

function drawObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    ctx.beginPath();
    ctx.rect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    ctx.fillStyle = obstacles[i].color;
    ctx.fill();
    ctx.closePath();
  }
}

// Update the score display
function updateScore() {
  scoreElement.innerHTML = `Score: ${score}`;
}

// Reset the game if a collision occurs
function resetGame() {
  gameOver = true;  // Set game over state to true
  gameOverMessage.innerHTML = `Game Over! Your final score is: ${score}`;
  gameOverContainer.style.display = "block";  // Show the game over screen
  sendScoreToBackend(score);  // Send score to backend
  score = 0;
  obstacles = [];
  car.x = 225;
  car.y = 400;
}

// Move the car based on user input
function moveCar() {
  if (gameOver) return;  // Stop moving the car if game is over

  if (rightPressed && car.x < canvas.width - car.width) {
    car.x += car.speed;
  } else if (leftPressed && car.x > 0) {
    car.x -= car.speed;
  }
}

// Restart the game
restartButton.addEventListener("click", function() {
  gameOver = false;  // Reset game over state
  gameOverContainer.style.display = "none";  // Hide the game over screen
  score = 0;
  obstacles = [];
  draw();  // Restart the game loop
});

// Main game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  generateObstacles();
  moveObstacles();
  moveCar();
  drawCar();
  drawObstacles();
  updateScore();

  if (!gameOver) {
    requestAnimationFrame(draw);  // Repeat the game loop only if game is not over
  }
}

// Send the player's score to the backend after game over
function sendScoreToBackend(finalScore) {
    fetch('http://localhost:5000/save_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            score: finalScore  // Send only the score
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Score successfully saved:", data);
    })
    .catch(error => {
        console.error("Error saving score:", error);
    });
}

draw();
