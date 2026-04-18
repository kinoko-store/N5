let flashcards = [];
let current = 0;
let flipped = false;

// đọc file CSV
fetch('data.csv')
  .then(res => res.text())
  .then(text => {
    const lines = text.split('\n');
    flashcards = lines.map(line => {
      const [jp, vi] = line.split(';');
      return { jp, vi };
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
  flipped = !flipped;
  document.getElementById("back").classList.toggle("hidden");
}

function nextCard() {
  current = (current + 1) % flashcards.length;
  showCard();
}