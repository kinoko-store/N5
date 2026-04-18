let flashcards = [];
let current = 0;

// 🚀 Load CSV (xử lý dữ liệu mạnh hơn)
fetch('data.csv')
  .then(res => res.text())
  .then(text => {
    flashcards = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== "" && line.includes(';')) // bỏ dòng lỗi
      .map(line => {
        const parts = line.split(';');

        return {
          jp: parts[0]?.trim(),
          vi: parts.slice(1).join(';').trim() // giữ nguyên nếu có ; trong nghĩa
        };
      });

    console.log("DATA:", flashcards); // debug
    showCard();
  })
  .catch(err => console.error("Lỗi load data:", err));

// 📌 Hiển thị
function showCard() {
  if (flashcards.length === 0) return;

  document.getElementById("front").innerText = flashcards[current].jp;
  document.getElementById("back").innerText = flashcards[current].vi;

  document.getElementById("card").classList.remove("flipped");
}

// 🔄 Lật thẻ
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

// 🎲 Random (không lặp lại ngay)
function randomCard() {
  if (flashcards.length <= 1) return;

  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * flashcards.length);
  } while (newIndex === current);

  current = newIndex;
  showCard();
}

// ⌨️ phím tắt
document.addEventListener("keydown", function(e) {
  if (e.code === "Space") flipCard();
  if (e.code === "ArrowRight") nextCard();
  if (e.code === "ArrowLeft") prevCard();
});
