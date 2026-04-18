document.addEventListener("DOMContentLoaded", function () {

let originalCards = [];
let flashcards = [];
let current = 0;

let wrongCards = JSON.parse(localStorage.getItem("wrongCards") || "[]");

let mode = localStorage.getItem("mode") || "jp-vi";

// LOAD DATA
fetch('input.txt')
  .then(res => res.text())
  .then(text => {
    originalCards = text
      .replace(/\r/g, '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.includes(';'))
      .map(line => {
        const [jp, ...rest] = line.split(';');
        return {
          jp: jp.trim(),
          vi: rest.join(';').trim()
        };
      });

    flashcards = [...originalCards];

    updateModeText();
    showCard();
    updateStats();
  });

// HIỂN THỊ
function showCard() {
  if (flashcards.length === 0) return;

  let front = mode === "jp-vi"
    ? flashcards[current].jp
    : flashcards[current].vi;

  let back = mode === "jp-vi"
    ? flashcards[current].vi
    : flashcards[current].jp;

  document.getElementById("front").innerText = front;
  document.getElementById("back").innerText = back;

  document.getElementById("card").classList.remove("flipped");

  document.getElementById("progress").innerText =
    `Từ ${current + 1} / ${flashcards.length}`;
}

// FLIP
window.flipCard = function () {
  document.getElementById("card").classList.toggle("flipped");
};

// NEXT
window.nextCard = function () {
  if (flashcards.length === 0) return;
  current = (current + 1) % flashcards.length;
  showCard();
};

// PREV
window.prevCard = function () {
  if (flashcards.length === 0) return;
  current = (current - 1 + flashcards.length) % flashcards.length;
  showCard();
};

// RANDOM
window.randomCard = function () {
  if (flashcards.length === 0) return;
  current = Math.floor(Math.random() * flashcards.length);
  showCard();
};

// MODE
window.toggleMode = function () {
  mode = mode === "jp-vi" ? "vi-jp" : "jp-vi";
  localStorage.setItem("mode", mode);
  updateModeText();
  showCard();
};

function updateModeText() {
  document.getElementById("mode").innerText =
    mode === "jp-vi" ? "Nhật → Việt" : "Việt → Nhật";
}

// MARK
window.markKnown = function () {
  nextCard();
};

window.markWrong = function () {
  if (flashcards.length === 0) return;

  const card = flashcards[current];

  if (!wrongCards.some(c => c.jp === card.jp)) {
    wrongCards.push(card);
    localStorage.setItem("wrongCards", JSON.stringify(wrongCards));
  }

  updateStats();
  nextCard();
};

// STUDY WRONG
window.studyWrong = function () {
  const saved = JSON.parse(localStorage.getItem("wrongCards") || "[]");

  if (saved.length === 0) {
    alert("Không có từ sai 😎");
    return;
  }

  flashcards = [...saved];
  current = 0;
  showCard();
};

// BACK
window.backToAll = function () {
  flashcards = [...originalCards];
  current = 0;
  showCard();
};

// RESET
window.resetWrong = function () {
  localStorage.removeItem("wrongCards");
  wrongCards = [];
  updateStats();
  alert("Đã reset!");
};

// STATS
function updateStats() {
  document.getElementById("wrongCount").innerText =
    `Từ sai: ${wrongCards.length}`;
}

});
