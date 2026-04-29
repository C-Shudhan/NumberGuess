let stats = {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    bestScore: null
};

const gamesPlayedEl = document.getElementById("gamesPlayed");
const winsEl = document.getElementById("wins");
const lossesEl = document.getElementById("losses");
const bestScoreEl = document.getElementById("bestScore");

function updateStatsUI() {
    gamesPlayedEl.textContent = stats.gamesPlayed;
    winsEl.textContent = stats.wins;
    lossesEl.textContent = stats.losses;
    bestScoreEl.textContent = stats.bestScore ?? "-";
}



const params = new URLSearchParams(window.location.search);

let min = 1;
let max = Number(params.get("max")) || 100;
let difficulty = params.get("difficulty") || "neutral";
let mode = params.get("mode") || "classic";

// Game state
let secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;
let attempts = 0;
let gameOver = false;
let maxAttempts = null;

// Challenge mode setup
if (mode === "challenge") {
    if (max <= 100) maxAttempts = 7;
    else if (max <= 500) maxAttempts = 10;
    else maxAttempts = 12;

    if (difficulty === "easy") maxAttempts += 2;
    if (difficulty === "veasy") maxAttempts += 4;
}

// Select elements
const input = document.getElementById("guessInput");
const button = document.getElementById("guessBtn");
const message = document.getElementById("message");
const attemptsText = document.getElementById("attempts");
const playAgainBtn = document.getElementById("playAgainBtn");
const returnBtn = document.getElementById("returnBtn");
const rangeText = document.getElementById("rangeText");
const difficultyText = document.getElementById("difficultyText");
const modeText = document.getElementById("modeText");

// Display info
rangeText.textContent = `Range: ${min} - ${max}`;

let displayDifficulty = {
    neutral: "Neutral",
    easy: "Easy",
    veasy: "Guided"
};

difficultyText.textContent = `Difficulty: ${displayDifficulty[difficulty]}`;

let displayMode = {
    classic: "Classic",
    challenge: "Challenge"
};

modeText.textContent = `Mode: ${displayMode[mode]}`;

// Guess logic
button.addEventListener("click", () => {
    if (gameOver) return;

    if (input.value === "") {
        message.textContent = "Enter a number!";
        return;
    }

    let guess = Number(input.value);
    attempts++;

    let diff = Math.abs(guess - secretNumber);

    // 🎯 Difficulty behavior
    if (guess < secretNumber) {

        if (difficulty === "easy") {
            let direction = "Higher";

            if (diff > max * 0.2) {
                message.textContent = "Too low!";
            } else if (diff > max * 0.05) {
                message.textContent = "Low";
            } else {
                message.textContent = `Right around (${direction})`;
            }

        } else {
            message.textContent = "Too low!";
        }

    } else if (guess > secretNumber) {

        if (difficulty === "easy") {
            let direction = "Lower";

            if (diff > max * 0.2) {
                message.textContent = "Too high!";
            } else if (diff > max * 0.05) {
                message.textContent = "High";
            } else {
                message.textContent = `Right around (${direction})`;
            }

        } else {
            message.textContent = "Too high!";
        }

    } else {
        // 🎉 WIN

stats.gamesPlayed++;
stats.wins++;
        
        
        let resultText = `You guessed it in ${attempts}`;

        if (mode === "challenge") {
    let score = maxAttempts - attempts + 1;
    resultText += `/${maxAttempts} attempts | Score: ${score}`;

    if (stats.bestScore === null || score > stats.bestScore) {
        stats.bestScore = score;
    }
}

        message.textContent = resultText;
        updateStatsUI();
        gameOver = true;

        playAgainBtn.style.display = "inline-block";
        returnBtn.style.display = "inline-block";
    }

    // 🧠 Guided hint
    if (difficulty === "veasy" && !gameOver) {
        message.textContent += " | Hint: " + getHint(secretNumber);
    }

    // ⚡ Challenge mid-hint
    if (
        mode === "challenge" &&
        attempts === Math.floor(maxAttempts / 2) &&
        !gameOver
    ) {
        message.textContent += " | Hint: " + getHint(secretNumber);
    }

    // ❌ Lose condition
    if (mode === "challenge" && attempts >= maxAttempts && !gameOver) {
        message.textContent = `You lost! The number was ${secretNumber}`;
        gameOver = true;
        stats.gamesPlayed++;
stats.losses++;

updateStatsUI();

        playAgainBtn.style.display = "inline-block";
        returnBtn.style.display = "inline-block";
    }

    // Attempts display
    if (mode === "challenge") {
        attemptsText.textContent = `Attempts: ${attempts} / ${maxAttempts}`;
    } else {
        attemptsText.textContent = `Attempts: ${attempts}`;
    }

    input.value = "";
});

// Restart
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

// Hint system
function getHint(number) {
    let hints = [];

    if (number % 2 === 0) hints.push("It is even");
    else hints.push("It is odd");

    if (isPrime(number)) hints.push("It is prime");

    if (number < 10) hints.push("It is small");
    if (number > max * 0.7) hints.push("It is large");

    if (number % 5 === 0) hints.push("Divisible by 5");

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


updateStatsUI();
