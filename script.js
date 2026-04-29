// Get parameters from URL
const params = new URLSearchParams(window.location.search);

let min = 1;
let max = Number(params.get("max")) || 100;
let difficulty = params.get("difficulty") || "neutral";

// Game state
let secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;
let attempts = 0;
let gameOver = false;

// Select elements
const input = document.getElementById("guessInput");
const button = document.getElementById("guessBtn");
const message = document.getElementById("message");
const attemptsText = document.getElementById("attempts");
const playAgainBtn = document.getElementById("playAgainBtn");
const returnBtn = document.getElementById("returnBtn");
const rangeText = document.getElementById("rangeText");
const difficultyText = document.getElementById("difficultyText");

// Display range & difficulty
rangeText.textContent = `Range: ${min} - ${max}`;
let displayDifficulty = {
    neutral: "Neutral",
    easy: "Easy",
    veasy: "Guided"
};

difficultyText.textContent = `Difficulty: ${displayDifficulty[difficulty]}`;

// Guess button logic
button.addEventListener("click", () => {
    if (gameOver) return;

    if (input.value === "") {
        message.textContent = "Enter a number!";
        return;
    }

    let guess = Number(input.value);
    attempts++;

    let diff = Math.abs(guess - secretNumber);

    // 🎯 Difficulty handling
    if (guess < secretNumber) {

        if (difficulty === "easy") {

    let direction = guess < secretNumber ? "Higher" : "Lower";

    if (diff > max * 0.2) {
        message.textContent = guess < secretNumber ? "Too low!" : "Too high!";
    } 
    else if (diff > max * 0.05) {
        message.textContent = guess < secretNumber ? "Low" : "High";
    } 
    else {
        message.textContent = `Right around (${direction})`;
    }

} else {
            message.textContent = "Too low!";
        }

    } else if (guess > secretNumber) {

        if (difficulty === "easy") {

    let direction = guess < secretNumber ? "Higher" : "Lower";

    if (diff > max * 0.2) {
        message.textContent = guess < secretNumber ? "Too low!" : "Too high!";
    } 
    else if (diff > max * 0.05) {
        message.textContent = guess < secretNumber ? "Low" : "High";
    } 
    else {
        message.textContent = `Right around (${direction})`;
    }

} else {
            message.textContent = "Too high!";
        }

    } else {
        message.textContent = "Correct! 🎉";
        gameOver = true;

        playAgainBtn.style.display = "inline-block";
        returnBtn.style.display = "inline-block";
    }

    // 🧠 Guided mode hint
    if (difficulty === "veasy" && !gameOver) {
        message.textContent += " | Hint: " + getHint(secretNumber);
    }

    attemptsText.textContent = `Attempts: ${attempts}`;
    input.value = "";
});

// Play again
playAgainBtn.addEventListener("click", () => {
    secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    attempts = 0;
    gameOver = false;

    message.textContent = "New game started!";
    attemptsText.textContent = "";
    input.value = "";

    playAgainBtn.style.display = "none";
    returnBtn.style.display = "none";
});

// 🧠 Guided hints system
function getHint(number) {
    let hints = [];

    if (number % 2 === 0) {
        hints.push("It is an even number");
    } else {
        hints.push("It is an odd number");
    }

    if (isPrime(number)) {
        hints.push("It is a prime number");
    }

    if (number < 10) {
        hints.push("It is a small number");
    }

    if (number > max * 0.7) {
        hints.push("It is quite large");
    }

    if (number % 5 === 0) {
        hints.push("It is divisible by 5");
    }

    return hints[Math.floor(Math.random() * hints.length)];
}

// Prime checker
function isPrime(n) {
    if (n < 2) return false;

    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }

    return true;
}