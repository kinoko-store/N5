document.addEventListener("DOMContentLoaded", () => {

let originalCards = [];
let flashcards = [];
let current = 0;
let wrongCards = JSON.parse(localStorage.getItem("wrongCards") || "[]");

let mode = "jp-vi";
let appMode = "flashcard";

// LOAD
fetch('input.txt')
.then(r=>r.text())
.then(text=>{
  originalCards = text.split('\n')
  .filter(l=>l.includes(';'))
  .map(l=>{
    let [jp,...rest]=l.split(';');
    return {jp:jp.trim(),vi:rest.join(';').trim()}
  });

  flashcards=[...originalCards];
  showCard();
  updateStats();
});

// FLASHCARD
function showCard(){
  let f = mode==="jp-vi"?flashcards[current].jp:flashcards[current].vi;
  let b = mode==="jp-vi"?flashcards[current].vi:flashcards[current].jp;

  front.innerText=f;
  back.innerText=b;
  card.classList.remove("flipped");

  progress.innerText=`${current+1}/${flashcards.length}`;
}

// NAV
window.nextCard=()=>{current=(current+1)%flashcards.length; render();}
window.prevCard=()=>{current=(current-1+flashcards.length)%flashcards.length; render();}
window.randomCard=()=>{current=Math.floor(Math.random()*flashcards.length); render();}

function render(){
  if(appMode==="flashcard") showCard();
  if(appMode==="quiz") loadQuiz();
  if(appMode==="typing") loadTyping();
}

// MODE
window.toggleMode=()=>{
  mode=mode==="jp-vi"?"vi-jp":"jp-vi";
  document.getElementById("mode").innerText=mode==="jp-vi"?"Nhật → Việt":"Việt → Nhật";
  render();
}

// SWITCH APP MODE
window.setMode=(m)=>{
  appMode=m;
  cardBox.style.display=m==="flashcard"?"block":"none";
  quizBox.style.display=m==="quiz"?"block":"none";
  typingBox.style.display=m==="typing"?"block":"none";
  render();
}

// FLIP
window.flipCard=()=>card.classList.toggle("flipped");

// SPEAK
window.speak=()=>{
  let text=flashcards[current].jp;
  let u=new SpeechSynthesisUtterance(text);
  u.lang="ja-JP";
  speechSynthesis.speak(u);
}

// MARK
window.markWrong=()=>{
  let c=flashcards[current];
  if(!wrongCards.some(x=>x.jp===c.jp)){
    wrongCards.push(c);
    localStorage.setItem("wrongCards",JSON.stringify(wrongCards));
  }
  updateStats();
  nextCard();
}

window.markKnown=()=>{
  let c=flashcards[current];
  wrongCards=wrongCards.filter(x=>x.jp!==c.jp);
  localStorage.setItem("wrongCards",JSON.stringify(wrongCards));
  updateStats();
  nextCard();
}

// WRONG MODE
window.studyWrong=()=>{
  if(wrongCards.length===0) return alert("Không có từ sai");
  flashcards=[...wrongCards];
  current=0;
  render();
}

window.backToAll=()=>{
  flashcards=[...originalCards];
  current=0;
  render();
}

// QUIZ
function loadQuiz(){
  let q = flashcards[current];
  question.innerText = q.jp;

  let options=[q.vi];
  while(options.length<4){
    let rand=originalCards[Math.floor(Math.random()*originalCards.length)].vi;
    if(!options.includes(rand)) options.push(rand);
  }

  options.sort(()=>Math.random()-0.5);

  answers.innerHTML="";
  options.forEach(opt=>{
    let btn=document.createElement("button");
    btn.innerText=opt;
    btn.onclick=()=>{
      if(opt===q.vi){
        alert("Đúng 🎉");
        markKnown();
      } else {
        alert("Sai ❌");
        markWrong();
      }
    }
    answers.appendChild(btn);
  });
}

// TYPING
function loadTyping(){
  let q=flashcards[current];
  typingQuestion.innerText=q.jp;
}

window.checkTyping=()=>{
  let ans=typingInput.value.trim();
  let correct=flashcards[current].vi;

  if(ans===correct){
    alert("Đúng 🎉");
    markKnown();
  } else {
    alert("Sai ❌");
    markWrong();
  }
  typingInput.value="";
}

// STATS
function updateStats(){
  wrongCount.innerText=`Sai: ${wrongCards.length}`;
}

});
