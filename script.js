let flashcards = [];
let current = 0;

// 🚀 Load trực tiếp file TXT
fetch('input.txt')
  .then(res => {
    if (!res.ok) throw new Error("Không load được file input.txt");
    return res.text();
  })
  .then(text => {
    flashcards = text
      .replace(/\r/g, '') // fix lỗi xuống dòng Windows
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

    console.log("DATA:", flashcards);
    showCard();
  })
  .catch(err => console.error(err));

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

// ⌨️ Phím tắt
document.addEventListener("keydown", function(e) {
  if (e.code === "Space") flipCard();
  if (e.code === "ArrowRight") nextCard();
  if (e.code === "ArrowLeft") prevCard();
});
