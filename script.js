const TOTAL = 25;
let currentLesson = 1;

// ===== STORAGE =====
function getData() {
  return JSON.parse(localStorage.getItem("data")) || {};
}
function saveData(d) {
  localStorage.setItem("data", JSON.stringify(d));
}

// ===== INIT =====
function init() {
  const tabs = document.getElementById("tabs");
  const select = document.getElementById("lessonSelect");

  for (let i = 1; i <= TOTAL; i++) {
    // tabs
    let b = document.createElement("button");
    b.innerText = "Buổi " + i;
    b.onclick = () => changeLesson(i);
    tabs.appendChild(b);

    // select
    let o = document.createElement("option");
    o.value = i;
    o.text = "Buổi " + i;
    select.appendChild(o);
  }

  changeLesson(1);
}

function changeLesson(l) {
  currentLesson = l;
  document.getElementById("lessonSelect").value = l;

  // highlight tab
  document.querySelectorAll(".tabs button").forEach((b, i) => {
    b.classList.toggle("active", i + 1 === l);
  });

  render();
}

// ===== RENDER =====
function render() {
  const data = getData();
  const list = data[currentLesson] || [];

  let html = `<h3>Buổi ${currentLesson}</h3>`;

  list.forEach((w, i) => {
    html += `
      <div class="word">
        ${w.jp} - ${w.vi}
        <button onclick="del(${i})">❌</button>
      </div>`;
  });

  document.getElementById("list").innerHTML = html;
}

// ===== ADD =====
function addWord() {
  const jp = jpInput.value.trim();
  const vi = viInput.value.trim();
  const lesson = lessonSelect.value;

  if (!jp || !vi) return alert("Nhập đủ!");

  let data = getData();
  if (!data[lesson]) data[lesson] = [];

  data[lesson].push({ jp, vi });

  saveData(data);
  jpInput.value = "";
  viInput.value = "";

  changeLesson(lesson);
}

// ===== DELETE =====
function del(i) {
  let data = getData();
  data[currentLesson].splice(i, 1);
  saveData(data);
  render();
}

// ===== IMPORT =====
function importTxt() {
  const file = fileInput.files[0];
  if (!file) return alert("Chọn file!");

  const lesson = lessonSelect.value;

  const reader = new FileReader();

  reader.onload = e => {
    let lines = e.target.result.split("\n");

    let data = getData();
    if (!data[lesson]) data[lesson] = [];

    let count = 0;

    lines.forEach(line => {
      line = line.trim();
      if (!line) return;

      let parts = line.split(";");

      if (parts.length >= 2) {
        let jp = parts[0].trim();
        let vi = parts[1].trim();

        if (!data[lesson].some(w => w.jp === jp)) {
          data[lesson].push({ jp, vi });
          count++;
        }
      }
    });

    saveData(data);
    alert("Import: " + count + " từ");
    changeLesson(lesson);
  };

  reader.readAsText(file);
}

// ===== FLASHCARD =====
let flashList = [];
let idx = 0;
let flipState = false;

function startFlash() {
  let data = getData();
  flashList = data[currentLesson] || [];

  if (flashList.length === 0) return alert("Không có từ!");

  idx = 0;
  flipState = false;

  flash.classList.remove("hidden");
  showCard();
}

function showCard() {
  let c = flashList[idx];
  card.innerText = flipState ? c.vi : c.jp;
}

function flip() {
  flipState = !flipState;
  showCard();
}

function next() {
  idx = (idx + 1) % flashList.length;
  flipState = false;
  showCard();
}

function closeFlash() {
  flash.classList.add("hidden");
}

// ===== START =====
init();
