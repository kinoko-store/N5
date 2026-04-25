// ===== LOCAL STORAGE =====
function getData() {
  return JSON.parse(localStorage.getItem("data")) || {};
}

function saveData(data) {
  localStorage.setItem("data", JSON.stringify(data));
}

// ===== LOAD LESSON =====
function loadLesson(lesson) {
  const data = getData();
  const words = data[lesson] || [];

  let html = "";

  words.forEach((w, index) => {
    html += `
      <div class="word">
        ${w.jp} - ${w.vi}
        <button onclick="deleteWord('${lesson}', ${index})">❌</button>
      </div>
    `;
  });

  document.getElementById("app").innerHTML = html;
}

// ===== ADD WORD =====
function addWord() {
  const lesson = document.getElementById("lesson").value;
  const jp = document.getElementById("jp").value;
  const vi = document.getElementById("vi").value;

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

// ===== LOAD MẶC ĐỊNH =====
loadLesson('1');
