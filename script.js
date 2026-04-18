let flashcards = [];
let current = 0;

// lưu từ sai
let wrongCards = JSON.parse(localStorage.getItem("wrongCards")) || [];

// 🚀 Load từ input.txt
fetch('input.txt')
  .then(res => {
    if (!res.ok) throw new Error("Không load được file");
    return res.text();
  })
  .then(text => {
    flashcards = text
      .replace(/\r/g, '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== "" && line.includes(';'))
      .map(line => {
        const [jp, ...rest] = line.split(';');
        return {
          jp: jp.trim(),
          vi: rest.join(';').trim()
        };
      });

    showCard();
  });

// 📌 Hiển thị
function showCard() {
  if (flashcards.length === 0) return;

  document.getElementById("front").innerText = flashcards[current].jp;
  document.getElementById("back").innerText = flashcards[current].vi;

  document.getElementById("card").classList.remove("flipped");
}

// 🔄 Lật
function flipCard() {
  document.getElementById("card").classList.toggle("flipped");
}

// ➡️ Next
function nextCard() {
  current = (current + 1) % flashcards.length;
  showCard();
}

// ⬅️ Prev
function prevCard() {
  current = (current - 1 + flashcards.length) % flashcards.length;
  showCard();
}

// 🎲 Random
function randomCard() {
  if (flashcards.length <= 1) return;

  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * flashcards.length);
  } while (newIndex === current);

  current = newIndex;
  showCard();
}

// ✅ Biết
function markKnown() {
  nextCard();
}

// ❌ Chưa biết
function markWrong() {
  const card = flashcards[current];

  if (!wrongCards.find(c => c.jp === card.jp)) {
    wrongCards.push(card);
    localStorage.setItem("wrongCards", JSON.stringify(wrongCards));
  }

  nextCard();
}

// 📚 Học từ sai
function studyWrong() {
  if (wrongCards.length === 0) {
    alert("Chưa có từ sai 😎");
    return;
  }

  flashcards = [...wrongCards];
  current = 0;
  showCard();
}

// 🗑 Reset
function resetWrong() {
  localStorage.removeItem("wrongCards");
  wrongCards = [];
  alert("Đã reset!");
}

// ⌨️ phím tắt
document.addEventListener("keydown", function(e) {
  if (e.code === "Space") flipCard();
  if (e.code === "ArrowRight") nextCard();
  if (e.code === "ArrowLeft") prevCard();
});
