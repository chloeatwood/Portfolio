// JavaScript for smooth scrolling navigation and project description updates

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// Hero slide functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-text');

function changeSlide(direction) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Random background colors for project cards
const colors = ["#5C5C99", "#669988", "#BC8CA6"];
const cards = document.querySelectorAll(".project-card, .attribute-card, .contact-card");

cards.forEach((card) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    card.style.backgroundColor = randomColor;
});

//Switch through images for work experience
function changeCardSlide(btn, direction) {
    const slider = btn.parentElement;
    const slides = slider.querySelectorAll('.card-slide');
    let current = [...slides].findIndex(s => s.classList.contains('active'));
    
    slides[current].classList.remove('active');
    current = (current + direction + slides.length) % slides.length;
    slides[current].classList.add('active');
}

/* =========================================================
BUBBLE POPPING EASTER EGG GAME
========================================================= */

const boredButton = document.getElementById("bored-button");
const bubbleGame = document.getElementById("bubble-game");
const closeBubbleGame = document.getElementById("close-bubble-game");
const startBubbleGame = document.getElementById("start-bubble-game");
const restartBubbleGame = document.getElementById("restart-bubble-game");

const bubbleGameArea = document.getElementById("bubble-game-area");
const bubbleScoreDisplay = document.getElementById("bubble-score");
const bubbleTimerDisplay = document.getElementById("bubble-timer");
const bubbleStartMessage = document.getElementById("bubble-start-message");

let bubbleScore = 0;
let bubbleTime = 30;

let bubbleGameRunning = false;

let bubbleSpawnInterval = null;
let bubbleTimerInterval = null;

/* ---------------------------------------------------------
Open the game
--------------------------------------------------------- */

boredButton.addEventListener("click", () => {

    bubbleGame.classList.add("active");
    resetBubbleGame();

});

/* ---------------------------------------------------------
Close the game
--------------------------------------------------------- */

closeBubbleGame.addEventListener("click", () => {

    bubbleGame.classList.remove("active");
    stopBubbleGame();
});

/* ---------------------------------------------------------
Start the game
--------------------------------------------------------- */

startBubbleGame.addEventListener("click", () => {
    startGame();
});

/* ---------------------------------------------------------
Restart the game
--------------------------------------------------------- */

restartBubbleGame.addEventListener("click", () => {
    startGame();
});

/* ---------------------------------------------------------
Start game function
--------------------------------------------------------- */

function startGame() {

    stopBubbleGame();

    bubbleScore = 0;
    bubbleTime = 30;
    bubbleScoreDisplay.textContent = bubbleScore;
    bubbleTimerDisplay.textContent = `Time: ${bubbleTime}`;
    bubbleStartMessage.style.display = "none";
    bubbleGameRunning = true;

    // Create bubbles periodically
    bubbleSpawnInterval = setInterval(() => {
        createBubble();
    }, 500);

    // Countdown timer
    bubbleTimerInterval = setInterval(() => {
        bubbleTime--;
        bubbleTimerDisplay.textContent = `Time: ${bubbleTime}`;
        if (bubbleTime <= 0) {
            endBubbleGame();
        }
    }, 1000);
}

/* ---------------------------------------------------------
Stop game
--------------------------------------------------------- */

function stopBubbleGame() {

    bubbleGameRunning = false;

    clearInterval(bubbleSpawnInterval);
    clearInterval(bubbleTimerInterval);
    bubbleSpawnInterval = null;
    bubbleTimerInterval = null;


    // Remove all existing bubbles
    const bubbles = bubbleGameArea.querySelectorAll(".game-bubble");
    bubbles.forEach((bubble) => {
        bubble.remove();
    });


    // Remove any score animations
    const points = bubbleGameArea.querySelectorAll(".bubble-points");
    points.forEach((point) => {
        point.remove();
    });


    // Remove game-over message
    const gameOver = bubbleGameArea.querySelector(".bubble-game-over");
    if (gameOver) {
        gameOver.remove();
    }
}

/* ---------------------------------------------------------
Reset game before starting
--------------------------------------------------------- */

function resetBubbleGame() {

    stopBubbleGame();
    bubbleScore = 0;
    bubbleTime = 30;
    bubbleScoreDisplay.textContent = bubbleScore;
    bubbleTimerDisplay.textContent = `Time: ${bubbleTime}`;
    bubbleStartMessage.style.display = "block";

}

/* ---------------------------------------------------------
Create a bubble
--------------------------------------------------------- */

function createBubble() {

    if (!bubbleGameRunning) {
        return;
    }

    const bubble = document.createElement("div");
    bubble.classList.add("game-bubble");


    // Random size
    const size = Math.floor(Math.random() * 55) + 35;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;


    // Random horizontal position
    const maxLeft = bubbleGameArea.clientWidth - size;
    const leftPosition = Math.random() * maxLeft;
    bubble.style.left = `${leftPosition}px`;

    // Random speed
    const duration = Math.random() * 4 + 4;
    bubble.style.animationDuration = `${duration}s`;

    // Add click event
    bubble.addEventListener("click", () => {
        popBubble(bubble);
    });

    // Add bubble to game
    bubbleGameArea.appendChild(bubble);

    // Remove bubble after animation finishes
    setTimeout(() => {
        if (bubble.parentElement) {
            bubble.remove();
        }
    }, duration * 1000 + 200);
}

/* ---------------------------------------------------------
Pop a bubble
--------------------------------------------------------- */

function popBubble(bubble) {
    if (!bubbleGameRunning) {
        return;
    }

    // Prevent double-clicking the same bubble
    if (bubble.classList.contains("popping")) {
        return;
    }

    bubble.classList.add("popping");

    // Increase score
    bubbleScore++;
    bubbleScoreDisplay.textContent = bubbleScore;

    // Show +1 animation
    showPoints(bubble);

    // Remove bubble after pop animation
    setTimeout(() => {
        bubble.remove();
    }, 200);


}

/* ---------------------------------------------------------
Show +1 points
--------------------------------------------------------- */

function showPoints(bubble) {

    const points = document.createElement("div");

    points.classList.add("bubble-points");

    points.textContent = "+1";


    const bubbleLeft = parseFloat(bubble.style.left);

    const bubbleTop = bubble.offsetTop;


    points.style.left = `${bubbleLeft + bubble.offsetWidth / 2}px`;

    points.style.top = `${bubbleTop}px`;


    bubbleGameArea.appendChild(points);


    setTimeout(() => {

        points.remove();

    }, 700);

}

/* ---------------------------------------------------------
End game
--------------------------------------------------------- */

function endBubbleGame() {

if (!bubbleGameRunning) {
    return;
}


    stopBubbleGame();
    const gameOverMessage = document.createElement("div");
    gameOverMessage.classList.add("bubble-game-over");

    gameOverMessage.innerHTML = `
        <h3>Time's Up! 🎉</h3>
        <p>You popped <strong>${bubbleScore}</strong> bubbles!</p>
        <button class="bubble-start-button" id="play-again-bubbles">
            Play Again
        </button>
    `;
    bubbleGameArea.appendChild(gameOverMessage);

    document
        .getElementById("play-again-bubbles")
        .addEventListener("click", () => {
            gameOverMessage.remove();
            startGame();
        });
}

/* ---------------------------------------------------------
Close game with Escape key
--------------------------------------------------------- */

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        bubbleGame.classList.contains("active")
    ) {
        bubbleGame.classList.remove("active");
        stopBubbleGame();
    }

});

