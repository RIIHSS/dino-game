const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const scoreText = document.getElementById("scoreValue");
const finalScoreText = document.getElementById("finalScore");
const gameOverScreen = document.getElementById("gameOver");

let isGameOver = false;
let score = 0;
let scoreInterval;
let checkDeadInterval;

// Initialize Game
startGame();

function startGame() {
    // 1. Reset Variables
    isGameOver = false;
    score = 0;
    scoreText.innerText = score;
    
    // 2. Reset UI
    gameOverScreen.classList.add("hidden");
    
    // 3. Reset Animations
    // We must remove the class, force a "reflow" so the browser realizes 
    // the change, and then re-add the class to restart the animation from the right.
    cactus.classList.remove("animate-cactus");
    void cactus.offsetWidth; // Trigger reflow (Magic line to reset animation)
    cactus.classList.add("animate-cactus");

    // 4. Start Logic
    startScore();
    startCollisionCheck();
}

function startScore() {
    clearInterval(scoreInterval);
    scoreInterval = setInterval(() => {
        if (!isGameOver) {
            score++;
            scoreText.innerText = score;
        }
    }, 100);
}

function startCollisionCheck() {
    clearInterval(checkDeadInterval);
    checkDeadInterval = setInterval(() => {
        if (isGameOver) return;

        // 1. Get Dino's vertical position (Bottom)
        // We use 'bottom' because that is what the CSS animates
        let dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));

        // 2. Get Cactus's horizontal position (Left)
        let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

        // 3. Collision Logic
        // - Cactus is within the Dino's horizontal area (between 50px and 90px)
        // - Dino is close to the ground (bottom < 50px)
        // (The cactus height is roughly 50px, so if dino is lower than that, they collide)
        if (cactusLeft > 50 && cactusLeft < 90 && dinoBottom < 50) {
            endGame();
        }
    }, 10);
}

function jump() {
    if (isGameOver) return;

    // Only jump if the class isn't already there
    if (!dino.classList.contains("animate-dino")) {
        dino.classList.add("animate-dino");
        setTimeout(() => {
            dino.classList.remove("animate-dino");
        }, 500);
    }
}

function endGame() {
    isGameOver = true;
    
    // Stop timers
    clearInterval(scoreInterval);
    clearInterval(checkDeadInterval);
    
    // Update final score
    finalScoreText.innerText = score;
    
    // Stop the cactus visually
    cactus.classList.remove("animate-cactus");
    
    // Show Game Over Menu
    gameOverScreen.classList.remove("hidden");
}

// Input Listeners
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        jump();
    }
});

// Global function for the HTML button
window.restartGame = function() {
    startGame();
};