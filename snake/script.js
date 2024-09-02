const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = 20;
canvas.width = canvas.height = gridSize * tileCount;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let apple = { x: 15, y: 15 };
let score = 0;

let highScore = localStorage.getItem('highScore') || 0;
document.getElementById('highScore').innerText = highScore;
document.getElementById('resetHighScore').addEventListener('click', () => {
  
    highScore = 0;
    localStorage.setItem('highScore', highScore);
    document.getElementById('highScore').innerText = highScore;

    score = 0;
    document.getElementById('score').innerText = score;

    alert('High Score telah direset!');
});

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 1000 / 10); 
}

function update() {
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || isCollision(head)) {
        resetGame();
        return;
    }

    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
        score += 10;
        document.getElementById('score').innerText = score;
        placeApple();
    } else {
        snake.pop();
    }

    // Update high score jika score lebih tinggi dari high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').innerText = highScore;
    }
}

function draw() {
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize));

    ctx.fillStyle = "red";
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function isCollision(position) {
    return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

function placeApple() {
    apple = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    velocity = { x: 0, y: 0 };
    score = 0;
    document.getElementById('score').innerText = score;
    placeApple();
}

window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":
            if (velocity.y === 0) velocity = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (velocity.y === 0) velocity = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (velocity.x === 0) velocity = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (velocity.x === 0) velocity = { x: 1, y: 0 };
            break;
    }
});

gameLoop();
