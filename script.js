const TOTAL = 25;
let currentLesson = 1;

// ===== STORAGE =====
const get = key => JSON.parse(localStorage.getItem(key)) || {};
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// ===== INIT =====
function init() {
  const tabs = document.getElementById("tabs");
  const select = document.getElementById("lessonSelect");

  for (let i = 1; i <= TOTAL; i++) {
    let btn = document.createElement("button");
    btn.innerText = "Buổi " + i;
    btn.onclick = () => change(i);
    tabs.appendChild(btn);

    let op = document.createElement("option");
    op.value = i;
    op.text = "Buổi " + i;
    select.appendChild(op);
  }

  change(1);
}

// ===== CHANGE =====
function change(l) {
  currentLesson = l;
  lessonSelect.value = l;

  document.querySelectorAll(".tabs button").forEach((b, i) => {
    b.classList.toggle("active", i + 1 === l);
  });

  render();
  updateStats();
}

// ===== RENDER =====
function render() {
  let data = get("data");
  let list = data[currentLesson] || [];

  let html = `<h3>Buổi ${currentLesson} (${list.length} từ)</h3>`;

  list.forEach((w, i) => {
    html += `
      <div class="word">
        ${w.jp} - ${w.vi}
        <button onclick="del(${i})">❌</button>
      </div>`;
  });

  listDiv.innerHTML = html;
}

// ===== ADD =====
function addWord() {
  if (!jp.value || !vi.value) return;

  let data = get("data");
  if (!data[currentLesson]) data[currentLesson] = [];

  data[currentLesson].push({ jp: jp.value, vi: vi.value });

  set("data", data);
  jp.value = vi.value = "";

  render();
  updateStats();
}

// ===== DELETE =====
function del(i) {
  if (!confirm("Xóa?")) return;

  let data = get("data");
  data[currentLesson].splice(i, 1);
  set("data", data);

  render();
  updateStats();
}

// ===== IMPORT =====
function importTxt() {
  let file = fileInput.files[0];
  if (!file) return;

  let reader = new FileReader();

  reader.onload = e => {
    let lines = e.target.result.split("\n");
    let data = get("data");

    if (!data[currentLesson]) data[currentLesson] = [];

    lines.forEach(l => {
      let p = l.split(";");
      if (p.length >= 2) {
        data[currentLesson].push({ jp: p[0], vi: p[1] });
      }
    });

    set("data", data);
    render();
    updateStats();
  };

  reader.readAsText(file);
}

// ===== FLASH =====
let list = [], i = 0, flipState = false;

function startFlash() {
  list = get("data")[currentLesson] || [];
  start();
}

function startWrong() {
  list = get("wrong")[currentLesson] || [];
  start();
}

function start() {
  if (!list.length) return alert("Không có từ!");
  i = 0;
  flipState = false;
  flash.classList.remove("hidden");
  show();
}

function show() {
  let c = list[i];
  card.innerText = flipState ? c.vi : c.jp;
}

// 🔊 SPEAK
function speak() {
  let c = list[i];
  let u = new SpeechSynthesisUtterance(c.jp);
  u.lang = "ja-JP";
  speechSynthesis.speak(u);
}

function flip() {
  flipState = !flipState;
  show();
}

function markWrong() {
  let w = get("wrong");
  if (!w[currentLesson]) w[currentLesson] = [];
  w[currentLesson].push(list[i]);
  set("wrong", w);

  markLearned();
  next();
}

function markRight() {
  markLearned();
  next();
}

function markLearned() {
  let learned = get("learned");
  if (!learned[currentLesson]) learned[currentLesson] = [];

  learned[currentLesson].push(list[i]);
  set("learned", learned);
}

// ===== NEXT =====
function next() {
  i = (i + 1) % list.length;
  flipState = false;
  show();
}

function closeFlash() {
  flash.classList.add("hidden");
}

// ===== STATS =====
function updateStats() {
  let data = get("data");
  let wrong = get("wrong");
  let learned = get("learned");

  let total = 0, wCount = 0, lCount = 0;

  for (let i = 1; i <= TOTAL; i++) {
    total += (data[i] || []).length;
    wCount += (wrong[i] || []).length;
    lCount += (learned[i] || []).length;
  }

  stats.innerHTML = `
    <h3>📊 Thống kê</h3>
    Tổng từ: ${total} |
    Đã học: ${lCount} |
    Sai: ${wCount}
  `;
}

// ===== START =====
init();
