let flashcards = [];
let current = 0;

// 🚀 Load data từ CSV
fetch('data.csv')
  .then(res => res.text())
  .then(text => {
    const lines = text.split('\n');

    flashcards = lines
      .filter(line => line.trim() !== "")
      .map(line => {
        const [jp, vi] = line.split(';');
        return {
          jp: jp?.trim(),
          vi: vi?.trim()
        };
      });

    showCard();
  });

// 📌 Hiển thị card
function showCard() {
  if (flashcards.length === 0) return;

  document.getElementById("front").innerText = flashcards[current].jp;
  document.getElementById("back").innerText = flashcards[current].vi;

  // reset trạng thái lật
  document.getElementById("card").classList.remove("flipped");
}

// 🔄 Lật card (animation)
function flipCard() {
  document.getElementById("card").classList.toggle("flipped");
}

// 👉 Next card
function nextCard() {
  current = (current + 1) % flashcards.length;
  showCard();
}

// 🎲 Random card (không lặp lại ngay)
function randomCard() {
  if (flashcards.length <= 1) return;

  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * flashcards.length);
  } while (newIndex === current);

  current = newIndex;
  showCard();
}

// ⬅️ Previous card
function prevCard() {
  current = (current - 1 + flashcards.length) % flashcards.length;
  showCard();
}

// ⌨️ Điều khiển bằng phím
document.addEventListener("keydown", function(e) {
  if (e.code === "Space") flipCard();
  if (e.code === "ArrowRight") nextCard();
  if (e.code === "ArrowLeft") prevCard();
});
