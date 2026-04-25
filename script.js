const TOTAL = 25;
let currentLesson = 1;

// ===== STORAGE =====
function getData() {
  return JSON.parse(localStorage.getItem("data")) || {};
}
function saveData(d) {
  localStorage.setItem("data", JSON.stringify(d));
}

function getWrong() {
  return JSON.parse(localStorage.getItem("wrong")) || {};
}
function saveWrong(d) {
  localStorage.setItem("wrong", JSON.stringify(d));
}

// ===== INIT =====
function init() {
  const tabs = document.getElementById("tabs");
  const select = document.getElementById("lessonSelect");

  for (let i = 1; i <= TOTAL; i++) {
    let b = document.createElement("button");
    b.innerText = "Buổi " + i;
    b.onclick = () => changeLesson(i);
    tabs.appendChild(b);

    let o = document.createElement("option");
    o.value = i;
    o.text = "Buổi " + i;
    select.appendChild(o);
  }

  changeLesson(1);
}

// ===== CHANGE =====
function changeLesson(l) {
  currentLesson = l;
  lessonSelect.value = l;

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

  listDiv.innerHTML = html;
}

// ===== ADD =====
function addWord() {
  if (!jp.value || !vi.value) return alert("Nhập đủ!");

  let data = getData();
  if (!data[currentLesson]) data[currentLesson] = [];

  data[currentLesson].push({ jp: jp.value, vi: vi.value });

  saveData(data);

  jp.value = "";
  vi.value = "";

  render();
}

// ===== DELETE (ANTI MISTAKE) =====
function del(i) {
  if (!confirm("Xóa từ này?")) return;

  let data = getData();
  data[currentLesson].splice(i, 1);

  saveData(data);
  render();
}

// ===== IMPORT =====
function importTxt() {
  const file = fileInput.files[0];
  if (!file) return alert("Chọn file!");

  const reader = new FileReader();

  reader.onload = e => {
    let lines = e.target.result.split("\n");

    let data = getData();
    if (!data[currentLesson]) data[currentLesson] = [];

    lines.forEach(line => {
      let parts = line.split(";");
      if (parts.length >= 2) {
        data[currentLesson].push({
          jp: parts[0].trim(),
          vi: parts[1].trim()
        });
      }
    });

    saveData(data);
    alert("Import xong!");
    render();
  };

  reader.readAsText(file);
}

// ===== FLASH =====
let flashList = [];
let idx = 0;
let flipped = false;

function startFlash() {
  flashList = getData()[currentLesson] || [];
  if (!flashList.length) return alert("Không có từ!");

  idx = 0;
  flipped = false;

  flash.classList.remove("hidden");
  show();
}

function startWrong() {
  flashList = getWrong()[currentLesson] || [];
  if (!flashList.length) return alert("Không có từ sai!");

  idx = 0;
  flipped = false;

  flash.classList.remove("hidden");
  show();
}

function show() {
  let c = flashList[idx];
  card.innerText = flipped ? c.vi : c.jp;
}

function flip() {
  flipped = !flipped;
  show();
}

function markWrong() {
  let wrong = getWrong();
  if (!wrong[currentLesson]) wrong[currentLesson] = [];

  wrong[currentLesson].push(flashList[idx]);
  saveWrong(wrong);

  next();
}

function markRight() {
  next();
}

function next() {
  idx++;
  if (idx >= flashList.length) idx = 0;
  flipped = false;
  show();
}

function closeFlash() {
  flash.classList.add("hidden");
}

// ===== START =====
init();
