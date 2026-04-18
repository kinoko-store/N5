let originalCards = [];
let flashcards = [];
let current = 0;

let wrongCards = JSON.parse(localStorage.getItem("wrongCards") || "[]");

let mode = "jp-vi";

// LOAD LESSON
function loadLesson(file) {
  fetch(file)
    .then(res => res.text())
    .then(text => {
      originalCards = text
        .split('\n')
        .filter(l => l.includes(';'))
        .map(l => {
          let [jp, ...rest] = l.split(';');
          return {
            jp: jp.trim(),
            vi: rest.join(';').trim()
          };
        });

      flashcards = [...originalCards];
      current = 0;
      showCard();
    });
}

// DEFAULT LOAD
loadLesson('lesson2.txt');

// SHOW
function showCard() {
  if (flashcards.length === 0) return;

  let front = mode === "jp-vi"
    ? flashcards[current].jp
    : flashcards[current].vi;

  let back = mode === "jp-vi"
    ? flashcards[current].vi
    : flashcards[current].jp;

  frontEl.innerText = front;
  backEl.innerText = back;

  card.classList.remove("flipped");

  progress.innerText = `${current+1}/${flashcards.length}`;
}

// DOM
const frontEl = document.getElementById("front");
const backEl = document.getElementById("back");
const card = document.getElementById("card");

// CONTROL
function nextCard() {
  current = (current + 1) % flashcards.length;
  showCard();
}

function prevCard() {
  current = (current - 1 + flashcards.length) % flashcards.length;
  showCard();
}

function randomCard() {
  current = Math.floor(Math.random() * flashcards.length);
  showCard();
}

function flipCard() {
  card.classList.toggle("flipped");
}

// MODE
function toggleMode() {
  mode = mode === "jp-vi" ? "vi-jp" : "jp-vi";
  document.getElementById("mode").innerText =
    mode === "jp-vi" ? "Nhật → Việt" : "Việt → Nhật";
  showCard();
}

// MARK
function markWrong() {
  let c = flashcards[current];
  if (!wrongCards.some(x => x.jp === c.jp)) {
    wrongCards.push(c);
    localStorage.setItem("wrongCards", JSON.stringify(wrongCards));
  }
  nextCard();
}

function markKnown() {
  let c = flashcards[current];
  wrongCards = wrongCards.filter(x => x.jp !== c.jp);
  localStorage.setItem("wrongCards", JSON.stringify(wrongCards));
  nextCard();
}

// SPEAK
function speak() {
  let u = new SpeechSynthesisUtterance(flashcards[current].jp);
  u.lang = "ja-JP";
  speechSynthesis.speak(u);
}

// STUDY
function studyWrong() {
  flashcards = [...wrongCards];
  current = 0;
  showCard();
}

function backToAll() {
  flashcards = [...originalCards];
  current = 0;
  showCard();
}
