const icons = [
    "🐶", "🐱", "🐭", "🐹",
    "🐰", "🦊", "🐻", "🐼"
];
let cards = [];
let flippedCards = [];
let lockBoard = false;
let attempts = 0;
let matchedPairs = 0;
let score = 0;

const scoreEl = document.getElementById("score");
const pairsEl = document.getElementById("pairsMatched");
const attemptsEl = document.getElementById("attempts");
const messageEl = document.getElementById("message");
const gridEl = document.getElementById("cardGrid");

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function initGame() {
    let deck = [...icons, ...icons];
    deck = shuffleArray(deck);
    cards = deck.map((icon, idx) => ({
        id: idx,
        icon: icon,
        flipped: false,
        matched: false
    }));
    flippedCards = [];
    lockBoard = false;
    attempts = 0;
    matchedPairs = 0;
    updateScoreUI();
    updateStatsUI();
    messageEl.innerHTML = "✨ یه کارت رو برگردون ✨";
    renderBoard();
}

function updateScoreUI() {
    let calculatedScore = (matchedPairs * 10) - (attempts - matchedPairs);
    if (calculatedScore < 0) calculatedScore = 0;
    score = calculatedScore;
    scoreEl.innerText = score;
}

function updateStatsUI() {
    attemptsEl.innerText = attempts;
    pairsEl.innerText = `${matchedPairs} / 8`;
}

function renderBoard() {
    gridEl.innerHTML = "";
    cards.forEach(card => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        if (card.flipped || card.matched) {
            cardDiv.classList.add("flipped");
            cardDiv.innerText = card.icon;
        } else {
            cardDiv.innerText = "?";
        }
        if (card.matched) {
            cardDiv.classList.add("matched");
        }
        cardDiv.addEventListener("click", () => onCardClick(card.id));
        gridEl.appendChild(cardDiv);
    });
}

function onCardClick(id) {
    if (lockBoard) return;
    const card = cards[id];
    if (card.matched) return;
    if (card.flipped) return;
    if (flippedCards.length === 2) return;

    card.flipped = true;
    flippedCards.push(card);
    renderBoard();

    if (flippedCards.length === 2) {
        attempts++;
        updateStatsUI();
        checkMatch();
    }
}

function checkMatch() {
    const [cardA, cardB] = flippedCards;
    if (cardA.icon === cardB.icon) {
        cardA.matched = true;
        cardB.matched = true;
        matchedPairs++;
        updateStatsUI();
        updateScoreUI();

        flippedCards = [];
        renderBoard();

        if (matchedPairs === 8) {
            messageEl.innerHTML = "🎉🎉 برنده شدی! عالی بود 🎉🎉";
            lockBoard = true;
        } else {
            messageEl.innerHTML = "✅ درست! جفت پیدا شد ✅";
        }
    } else {
        messageEl.innerHTML = "❌ اشتباه، دقت کن ❌";
        lockBoard = true;
        setTimeout(() => {
            cardA.flipped = false;
            cardB.flipped = false;
            flippedCards = [];
            lockBoard = false;
            renderBoard();
            messageEl.innerHTML = "✨ ادامه بده، می‌تونی ✨";
            updateScoreUI();
        }, 800);
    }
}

function resetGame() {
    initGame();
}

document.getElementById("resetGameBtn").addEventListener("click", resetGame);
initGame();
