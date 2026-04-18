let flashcards = [];
let current = 0;

// lưu từ sai
let wrongCards = JSON.parse(localStorage.getItem("wrongCards") || "[]");

// mode
let mode = localStorage.getItem("mode") || "jp-vi";
let isMix = false;

// load data
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

// hiển thị
function showCard() {
  if (flashcards.length === 0) return;

  let front, back;

  // 🧠 mode trộn
  let currentMode = mode;
  if (isMix) {
    currentMode = Math.random() > 0.5 ? "jp-vi" : "vi-jp";
  }

  if (currentMode === "jp-vi") {
    front = flashcards[current].jp;
    back = flashcards[current].vi;
  } else {
    front = flashcards[current].vi;
    back = flashcards[current].jp;
  }

  document.getElementById("front").innerText = front;
  document.getElementById("back").innerText = back;

  document.getElementById("card").classList.remove("flipped");

  document.getElementById("progress").innerText =
    `Từ ${current + 1} / ${flashcards.length}`;
}

// flip
function flipCard() {
  document.getElementById("card").classList.toggle("flipped");
}

// next (ưu tiên từ sai)
function nextCard() {
  if (Math.random() < 0.3 && wrongCards.length > 0) {
    const w = wrongCards[Math.floor(Math.random() * wrongCards.length)];
    current = flashcards.findIndex(c => c.jp === w.jp);
  } else {
    current = (current + 1) % flashcards.length;
  }
  showCard();
}

// prev
function prevCard() {
  current = (current - 1 + flashcards.length) % flashcards.length;
  showCard();
}

// random
function randomCard() {
  current = Math.floor(Math.random() * flashcards.length);
  showCard();
}

// đánh dấu
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

// học lại
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

// reset
function resetWrong() {
  localStorage.removeItem("wrongCards");
  wrongCards = [];
  updateStats();
  alert("Đã reset!");
}

// mode
function toggleMode() {
  mode = mode === "jp-vi" ? "vi-jp" : "jp-vi";
  localStorage.setItem("mode", mode);
  updateModeText();
  showCard();
}

function toggleMix() {
  isMix = !isMix;
  alert(isMix ? "Đang trộn 2 chiều 🧠" : "Tắt trộn");
}

// UI
function updateModeText() {
  document.getElementById("mode").innerText =
    mode === "jp-vi" ? "Nhật → Việt" : "Việt → Nhật";
}

function updateStats() {
  document.getElementById("wrongCount").innerText =
    `Từ sai: ${wrongCards.length}`;
}

// phím tắt
document.addEventListener("keydown", function(e) {
  if (e.code === "Space") flipCard();
  if (e.code === "ArrowRight") nextCard();
  if (e.code === "ArrowLeft") prevCard();
});
