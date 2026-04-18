let flashcards = [];
let current = 0;
let flipped = false;

// đọc file CSV
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

function showCard() {
  flipped = false;
  document.getElementById("front").innerText = flashcards[current].jp;
  document.getElementById("back").innerText = flashcards[current].vi;
  document.getElementById("back").classList.add("hidden");
}

function flipCard() {
  document.getElementById("card").classList.toggle("flipped");
}
  flipped = !flipped;
  document.getElementById("back").classList.toggle("hidden");
}

function nextCard() {
  current = (current + 1) % flashcards.length;
  showCard();
}
function randomCard() {
  if (flashcards.length === 0) return;

  current = Math.floor(Math.random() * flashcards.length);
  showCard();
}
