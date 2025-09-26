// -------- USER AUTH ----------
function registerUser() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  if (!u || !p) return alert("Enter username and password!");
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (users[u]) return alert("User already exists!");
  users[u] = { password: p, results: [] };
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registered successfully! Please login.");
}
function loginUser() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (!users[u] || users[u].password !== p) return alert("Invalid credentials");
  localStorage.setItem("currentUser", u);
  window.location.href = "test.html";
}
function logoutUser() {
  localStorage.removeItem("currentUser");
}

// -------- TYPING TEST ----------
let words = ["quick","brown","fox","jumps","over","lazy","dog","keyboard","speed","accuracy"];
let currentWordIndex = 0, timeLeft = 60, timer=null, typedChars=0, errors=0, started=false;

function loadWords() {
  const wordsEl = document.getElementById("words");
  if (!wordsEl) return;
  wordsEl.innerHTML = "";
  words.forEach((w,i) => {
    const span=document.createElement("span");
    span.textContent=w;
    span.classList.add("word");
    if(i===0) span.classList.add("current");
    wordsEl.appendChild(span);
  });
}
function startTimer() {
  timer=setInterval(()=> {
    timeLeft--;
    document.getElementById("timer").textContent=timeLeft;
    if(timeLeft<=0) finishTest();
  },1000);
}
function handleTyping(e) {
  if(!started){started=true;startTimer();}
  const inputBox=document.getElementById("inputBox");
  const wordEls=document.querySelectorAll(".word");
  const currentWord=words[currentWordIndex];
  const currentWordEl=wordEls[currentWordIndex];
  if(e.target.value.endsWith(" ")){
    const typed=e.target.value.trim();
    if(typed===currentWord){currentWordEl.classList.add("correct");}
    else {currentWordEl.classList.add("incorrect"); errors++;}
    currentWordEl.classList.remove("current");
    currentWordIndex++;
    if(currentWordIndex<words.length){wordEls[currentWordIndex].classList.add("current");}
    inputBox.value="";
  }
  typedChars++;
  updateStats();
}
function updateStats(){
  const minutes=(60-timeLeft)/60;
  const wpm=minutes>0?Math.round(currentWordIndex/minutes):0;
  const acc=typedChars>0?Math.round(((typedChars-errors)/typedChars)*100):100;
  document.getElementById("wpm").textContent=wpm;
  document.getElementById("accuracy").textContent=acc;
}
function finishTest(){
  clearInterval(timer);
  document.getElementById("inputBox").disabled=true;
  document.getElementById("results").classList.remove("hidden");
  document.getElementById("finalWPM").textContent=document.getElementById("wpm").textContent;
  document.getElementById("finalAccuracy").textContent=document.getElementById("accuracy").textContent;
  document.getElementById("finalErrors").textContent=errors;
}
function restartTest(){ location.reload(); }
function saveResult(){
  const u=localStorage.getItem("currentUser");
  if(!u) return;
  const users=JSON.parse(localStorage.getItem("users")||"{}");
  const res={
    date:new Date().toLocaleString(),
    wpm:document.getElementById("finalWPM").textContent,
    accuracy:document.getElementById("finalAccuracy").textContent,
    errors:document.getElementById("finalErrors").textContent
  };
  users[u].results.unshift(res);
  localStorage.setItem("users",JSON.stringify(users));
  alert("Result saved! Check Dashboard.");
}

// -------- DASHBOARD ----------
function loadDashboard(){
  const u=localStorage.getItem("currentUser");
  if(!u) return;
  const users=JSON.parse(localStorage.getItem("users")||"{}");
  const results=users[u]?.results||[];
  const tbody=document.querySelector("#resultsTable tbody");
  if(!tbody) return;
  tbody.innerHTML="";
  results.forEach(r=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${r.date}</td><td>${r.wpm}</td><td>${r.accuracy}%</td><td>${r.errors}</td>`;
    tbody.appendChild(tr);
  });
}

// -------- LEADERBOARD ----------
function loadLeaderboard(){
  const users=JSON.parse(localStorage.getItem("users")||"{}");
  const tbody=document.querySelector("#leaderboardTable tbody");
  if(!tbody) return;
  let rows=[];
  for(let u in users){
    const best=users[u].results.reduce((max,r)=>r.wpm>max?wpm=r.wpm&&r:r,null);
    if(best) rows.push({user:u,wpm:best.wpm,accuracy:best.accuracy});
  }
  rows.sort((a,b)=>b.wpm-a.wpm);
  tbody.innerHTML="";
  rows.forEach(r=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${r.user}</td><td>${r.wpm}</td><td>${r.accuracy}%</td>`;
    tbody.appendChild(tr);
  });
}

// -------- AUTO INIT ----------
document.addEventListener("DOMContentLoaded",()=>{
  if(document.getElementById("words")){
    loadWords();
    document.getElementById("inputBox").addEventListener("input",handleTyping);
    document.getElementById("currentUser").textContent=localStorage.getItem("currentUser")||"Guest";
  }
  if(document.getElementById("resultsTable")) loadDashboard();
  if(document.getElementById("leaderboardTable")) loadLeaderboard();
});
