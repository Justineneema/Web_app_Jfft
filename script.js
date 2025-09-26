// --- AUTH ---
function registerUser() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  if (!u || !p) { alert("Fill all fields"); return; }

  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (users[u]) { alert("User exists"); return; }

  users[u] = { password:p };
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registered! Please login.");
}

function loginUser() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (!users[u] || users[u].password !== p) { alert("Invalid credentials"); return; }

  localStorage.setItem("currentUser", u);
  window.location.href = "dashboard.html";
}

function logoutUser() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// --- TYPING TEST ---
const wordsElement = document.getElementById("words");
const inputBox = document.getElementById("inputBox");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");

let words = ["light","quick","tell","kind","move","large","eye","young","fast","code"];
let currentWordIndex = 0, timeLeft = 60, timer = null;
let typedChars = 0, errors = 0, started = false;

if (wordsElement) loadWords();

function loadWords() {
  wordsElement.innerHTML = "";
  words.forEach((word, i) => {
    let span = document.createElement("span");
    span.innerText = word+" ";
    span.classList.add("word");
    if (i===0) span.classList.add("current");
    wordsElement.appendChild(span);
  });
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft<=0) finishTest();
  }, 1000);
}

if (inputBox) {
  inputBox.addEventListener("input", (e) => {
    if (!started) { started = true; startTimer(); }
    let currentWordSpan = document.querySelectorAll(".word")[currentWordIndex];
    let currentWord = words[currentWordIndex];
    if (e.target.value.endsWith(" ")) {
      let typed = e.target.value.trim();
      if (typed===currentWord) currentWordSpan.classList.add("correct");
      else { currentWordSpan.classList.add("incorrect"); errors++; }
      currentWordSpan.classList.remove("current");
      currentWordIndex++;
      if (currentWordIndex<words.length) {
        document.querySelectorAll(".word")[currentWordIndex].classList.add("current");
      }
      e.target.value = "";
    }
    typedChars++;
    updateStats();
  });
}

function updateStats() {
  const minutes = (60-timeLeft)/60;
  const wordsTyped = currentWordIndex;
  const wpm = minutes>0 ? Math.round(wordsTyped/minutes) : 0;
  const acc = typedChars>0 ? Math.round(((typedChars-errors)/typedChars)*100) : 100;
  wpmElement.textContent = wpm;
  accuracyElement.textContent = acc;
}

function finishTest() {
  clearInterval(timer);
  inputBox.disabled = true;
  alert("Time up! Your WPM: "+wpmElement.textContent+" | Accuracy: "+accuracyElement.textContent+"%");
}
