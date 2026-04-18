let flashcards = [];
let current = 0;

// load từ sai
let wrongCards = JSON.parse(localStorage.getItem("wrongCards") || "[]");

// 🚀 Load data
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

    showCard();
    updateStats();
  });

// 📌 Hiển thị
function showCard() {
  if (flashcards.length === 0) return;

  document.getElementById("front").innerText = flashcards[current].jp;
  document.getElementById("back").innerText = flashcards[current].vi;

  document.getElementById("card").classList.remove("flipped");

  // progress
  document.getElementById("progress").innerText =
    `Từ ${current + 1} / ${flashcards.length}`;
}

// 🔄 flip
function flipCard() {
  document.getElementById("card").classList.toggle("flipped");
}

// ➡️ next (ưu tiên từ sai)
function nextCard() {
  if (Math.random() < 0.3 && wrongCards.length > 0) {
    // 30% gặp lại từ sai
    const randomWrong = wrongCards[Math.floor(Math.random() * wrongCards.length)];
    current = flashcards.findIndex(c => c.jp === randomWrong.jp);
  } else {
    current = (current + 1) % flashcards.length;
  }

  showCard();
}

// ⬅️ prev
function prevCard() {
  current = (current - 1 + flashcards.length) % flashcards.length;
  showCard();
}

// 🎲 random
function randomCard() {
  current = Math.floor(Math.random() * flashcards.length);
  showCard();
}

// ✅ biết
function markKnown() {
  nextCard();
}

// ❌ chưa biết
function markWrong() {
  const card = flashcards[current];

  if (!wrongCards.some(c => c.jp === card.jp)) {
    wrongCards.push(card);
    localStorage.setItem("wrongCards", JSON.stringify(wrongCards));
  }

  updateStats();
  nextCard();
}

// 📚 học lại
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

// 🗑 reset
function resetWrong() {
  localStorage.removeItem("wrongCards");
  wrongCards = [];
  updateStats();
  alert("Đã reset!");
}

// 📊 thống kê
function updateStats() {
  document.getElementById("wrongCount").innerText =
    `Từ sai: ${wrongCards.length}`;
}

// ⌨️ phím tắt
document.addEventListener("keydown", function(e) {
  if (e.code === "Space") flipCard();
  if (e.code === "ArrowRight") nextCard();
  if (e.code === "ArrowLeft") prevCard();
});
