let originalCards = [];
let flashcards = [];
let current = 0;

let wrongCards = JSON.parse(localStorage.getItem("wrongCards") || "[]");

let mode = "jp-vi";

// LOAD LESSON (FIX CHẮC CHẮN CHẠY)
function loadLesson(file) {
  fetch(file)
    .then(res => {
      if (!res.ok) {
        alert("❌ Không tìm thấy file: " + file);
        return "";
      }
      return res.text();
    })
    .then(text => {
      if (!text) return;

      originalCards = text
        .replace(/\r/g, '')
        .split('\n')
        .filter(line => line.trim() && line.includes(';'))
        .map(line => {
          let [jp, ...rest] = line.split(';');
          return {
            jp: jp.trim(),
            vi: rest.join(';').trim()
          };
        });

      flashcards = [...originalCards];
      current = 0;

      showCard();
      updateStats();
    });
}

// LOAD MẶC ĐỊNH
loadLesson('input.txt');

// HIỂN THỊ
function showCard() {
  if (flashcards.length === 0) return;

  let front = mode === "jp-vi"
    ? flashcards[current].jp
    : flashcards[current].vi;

  let back = mode === "jp-vi"
    ? flashcards[current].vi
    : flashcards[current].jp;

  document.getElementById("front").innerText = front;
  document.getElementById("back").innerText = back;

  document.getElementById("card").classList.remove("flipped");

  document.getElementById("progress").innerText =
    `${current + 1} / ${flashcards.length}`;
}

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
  document.getElementById("card").classList.toggle("flipped");
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
  let card = flashcards[current];

  if (!wrongCards.some(c => c.jp === card.jp)) {
    wrongCards.push(card);
    localStorage.setItem("wrongCards", JSON.stringify(wrongCards));
  }

  updateStats();
  nextCard();
}

function markKnown() {
  let card = flashcards[current];

  wrongCards = wrongCards.filter(c => c.jp !== card.jp);
  localStorage.setItem("wrongCards", JSON.stringify(wrongCards));

  updateStats();
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
  if (wrongCards.length === 0) {
    alert("Không có từ sai 😎");
    return;
  }

  flashcards = [...wrongCards];
  current = 0;
  showCard();
}

function backToAll() {
  flashcards = [...originalCards];
  current = 0;
  showCard();
}

// STATS
function updateStats() {
  document.getElementById("wrongCount").innerText =
    `Từ sai: ${wrongCards.length}`;
}
