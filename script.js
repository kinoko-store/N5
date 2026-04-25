const TOTAL_LESSONS = 25;

// ===== STORAGE =====
function getData() {
  return JSON.parse(localStorage.getItem("data")) || {};
}

function saveData(data) {
  localStorage.setItem("data", JSON.stringify(data));
}

// ===== UI =====
function initUI() {
  const tabs = document.getElementById("tabs");
  const select = document.getElementById("lesson");

  for (let i = 1; i <= TOTAL_LESSONS; i++) {
    let btn = document.createElement("button");
    btn.innerText = "Buổi " + i;
    btn.onclick = () => loadLesson(i);
    tabs.appendChild(btn);

    let opt = document.createElement("option");
    opt.value = i;
    opt.innerText = "Buổi " + i;
    select.appendChild(opt);
  }
}

// ===== LOAD =====
function loadLesson(lesson) {
  const data = getData();
  const words = data[lesson] || [];

  let html = `<h3>📘 Buổi ${lesson}</h3>`;

  words.forEach((w, index) => {
    html += `
      <div class="word">
        ${w.jp} - ${w.vi}
        <button onclick="deleteWord(${lesson}, ${index})">❌</button>
      </div>
    `;
  });

  document.getElementById("app").innerHTML = html;
}

// ===== ADD =====
function addWord() {
  const lesson = document.getElementById("lesson").value;
  const jp = document.getElementById("jp").value.trim();
  const vi = document.getElementById("vi").value.trim();

  if (!jp || !vi) {
    alert("Nhập đầy đủ!");
    return;
  }

  let data = getData();

  if (!data[lesson]) data[lesson] = [];

  data[lesson].push({ jp, vi });

  saveData(data);

  document.getElementById("jp").value = "";
  document.getElementById("vi").value = "";

  loadLesson(lesson);
}

// ===== DELETE =====
function deleteWord(lesson, index) {
  let data = getData();

  data[lesson].splice(index, 1);

  saveData(data);

  loadLesson(lesson);
}

// ===== IMPORT TXT =====
function importFile() {
  const file = document.getElementById("fileInput").files[0];

  if (!file) {
    alert("Chọn file trước!");
    return;
  }

  const lesson = document.getElementById("lesson").value;

  const reader = new FileReader();

  reader.onload = function(e) {
    const text = e.target.result;

    const lines = text.split('\n');

    let data = getData();

    if (!data[lesson]) data[lesson] = [];

    lines.forEach(line => {
      if (!line.trim()) return;

      const parts = line.split(';');

      if (parts.length >= 2) {
        const jp = parts[0].trim();
        const vi = parts[1].trim();

        // tránh trùng
        if (!data[lesson].some(w => w.jp === jp)) {
          data[lesson].push({ jp, vi });
        }
      }
    });

    saveData(data);

    alert("✅ Import thành công!");

    loadLesson(lesson);
  };

  reader.readAsText(file);
}

// ===== INIT =====
initUI();
loadLesson(1);
