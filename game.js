const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');

let score = 0;
let lives = 3;
let gameRunning = false;
let gameOver = false;

const player = { x: 180, y: 420, width: 40, height: 40, speed: 5 };
let bullets = [];
let enemies = [];
let stars = [];

const keys = {};

// Create stars background
for (let i = 0; i < 50; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 0.5
    });
}

function drawPlayer() {
    // Paw ship
    ctx.fillStyle = '#ff6b6b';
    // Main body
    ctx.beginPath();
    ctx.ellipse(player.x + 20, player.y + 25, 18, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ears
    ctx.beginPath();
    ctx.moveTo(player.x + 8, player.y + 15);
    ctx.lineTo(player.x + 5, player.y);
    ctx.lineTo(player.x + 15, player.y + 12);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(player.x + 32, player.y + 15);
    ctx.lineTo(player.x + 35, player.y);
    ctx.lineTo(player.x + 25, player.y + 12);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(player.x + 12, player.y + 20, 5, 0, Math.PI * 2);
    ctx.arc(player.x + 28, player.y + 20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(player.x + 12, player.y + 20, 2, 0, Math.PI * 2);
    ctx.arc(player.x + 28, player.y + 20, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawBullet(b) {
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.arc(b.x, b.y, 8, 0, Math.PI * 2);
    ctx.fill();
}

function drawEnemy(e) {
    // Alien body
    ctx.fillStyle = '#7fff00';
    ctx.beginPath();
    ctx.arc(e.x + 15, e.y + 15, 20, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(e.x + 8, e.y + 12, 5, 0, Math.PI * 2);
    ctx.arc(e.x + 22, e.y + 12, 5, 0, Math.PI * 2);
    ctx.fill();
    // Antenna
    ctx.strokeStyle = '#7fff00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(e.x + 15, e.y - 5);
    ctx.lineTo(e.x + 15, e.y - 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(e.x + 15, e.y - 18, 4, 0, Math.PI * 2);
    ctx.fill();
}

function drawStars() {
    ctx.fillStyle = '#fff';
    stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function update() {
    if (!gameRunning || gameOver) return;

    // Move stars
    stars.forEach(s => {
        s.y += s.speed;
        if (s.y > canvas.height) s.y = 0;
    });

    // Player movement
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;
    if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) player.y += player.speed;

    // Move bullets up
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= 10;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }

    // Spawn enemies
    if (Math.random() < 0.03) {
        enemies.push({
            x: Math.random() * (canvas.width - 40),
            y: -30,
            speed: Math.random() * 2 + 1
        });
    }

    // Move enemies and check collisions
    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        e.y += e.speed;
        
        // Check bullet collisions
        for (let j = bullets.length - 1; j >= 0; j--) {
            let b = bullets[j];
            // Simple distance-based collision
            let dx = b.x - (e.x + 15);
            let dy = b.y - (e.y + 15);
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 25) {
                // Hit!
                score += 100;
                scoreEl.textContent = 'Score: ' + score;
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                break;
            }
        }
        
        // Check if enemy passed bottom
        if (e.y > canvas.height + 30) {
            enemies.splice(i, 1);
            continue;
        }
        
        // Check player collision
        if (e.y + 15 > player.y && e.x + 15 > player.x && e.x < player.x + player.width) {
            lives--;
            livesEl.textContent = '❤️'.repeat(lives);
            enemies.splice(i, 1);
            if (lives <= 0) {
                gameOver = true;
                document.getElementById('instructions').textContent = 'Game Over! Score: ' + score + '. Press Space to restart.';
            }
        }
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawStars();
    drawPlayer();
    bullets.forEach(drawBullet);
    enemies.forEach(drawEnemy);

    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff0000';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    }
}

document.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (e.key === ' ' && !gameRunning) {
        gameRunning = true;
        gameOver = false;
        score = 0;
        lives = 3;
        bullets = [];
        enemies = [];
        player.x = 180;
        player.y = 420;
        scoreEl.textContent = 'Score: 0';
        livesEl.textContent = '❤️❤️❤️';
        document.getElementById('instructions').textContent = 'Arrow keys to move, Space to shoot!';
        update();
    }
    if (e.key === ' ' && gameRunning && !gameOver) {
        // Shoot from center of player
        bullets.push({ x: player.x + 20, y: player.y });
    }
    if (e.key === ' ' && gameOver) {
        gameRunning = true;
        gameOver = false;
        score = 0;
        lives = 3;
        bullets = [];
        enemies = [];
        player.x = 180;
        player.y = 420;
        scoreEl.textContent = 'Score: 0';
        livesEl.textContent = '❤️❤️❤️';
        document.getElementById('instructions').textContent = 'Arrow keys to move, Space to shoot!';
        update();
    }
});

document.addEventListener('keyup', e => {
    keys[e.key] = false;
});

draw();
