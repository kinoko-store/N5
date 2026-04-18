let flashcards = [];
let current = 0;

let wrongCards = JSON.parse(localStorage.getItem("wrongCards") || "[]");

// 🔄 MODE
let mode = localStorage.getItem("mode") || "jp-vi";

// LOAD DATA
fetch('input.txt')
  .then(res => res.text())
  .then(text => {
    flashcards = text
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

    updateModeText();
    showCard();
    updateStats();
  });

// HIỂN THỊ (QUAN TRỌNG NHẤT)
function showCard() {
  if (flashcards.length === 0) return;

  let front = "";
  let back = "";

  if (mode === "jp-vi") {
    front = flashcards[current].jp;
    back = flashcards[current].vi;
  } else {
    front = flashcards[current].vi;
    back = flashcards[current].jp;
  }

  document.getElementById("front").innerText = front;
  document.getElementById("back").innerText = back;

  // reset flip khi đổi mode
  document.getElementById("card").classList.remove("flipped");

  document.getElementById("progress").innerText =
    `Từ ${current + 1} / ${flashcards.length}`;
}

// 🔄 ĐỔI CHIỀU (FIX CHUẨN)
function toggleMode() {
  mode = mode === "jp-vi" ? "vi-jp" : "jp-vi";
  localStorage.setItem("mode", mode);

  updateModeText();

  // 🔥 reset về card hiện tại + refresh UI
  showCard();
}

// UI MODE
function updateModeText() {
  document.getElementById("mode").innerText =
    mode === "jp-vi" ? "Nhật → Việt" : "Việt → Nhật";
}

// FLIP
function flipCard() {
  document.getElementById("card").classList.toggle("flipped");
}

// NEXT
function nextCard() {
  current = (current + 1) % flashcards.length;
  showCard();
}

// PREV
function prevCard() {
  current = (current - 1 + flashcards.length) % flashcards.length;
  showCard();
}

// RANDOM
function randomCard() {
  current = Math.floor(Math.random() * flashcards.length);
  showCard();
}

// MARK
function markKnown() {
  nextCard();
}

function markWrong() {
  const card = flashcards[current];

  if (!wrongCards.some(c => c.jp === card.jp)) {
    wrongCards.push(card);
    localStorage.setItem("wrongCards", JSON.stringify(wrongCards));
  }

  updateStats();
  nextCard();
}

// STUDY WRONG
function studyWrong() {
  const saved = JSON.parse(localStorage.getItem("wrongCards") || "[]");

  if (saved.length === 0) {
    alert("Không có từ sai 😎");
    return;
  }

  flashcards = saved;
  current = 0;
  showCard();
}

// RESET
function resetWrong() {
  localStorage.removeItem("wrongCards");
  wrongCards = [];
  updateStats();
  alert("Đã reset!");
}

// STATS
function updateStats() {
  document.getElementById("wrongCount").innerText =
    `Từ sai: ${wrongCards.length}`;
}
