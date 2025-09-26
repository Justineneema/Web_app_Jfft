function login() {
  const username = document.getElementById("username").value;
  if (username.trim() === "") {
    alert("Please enter your name");
    return;
  }
  localStorage.setItem("username", username);
  window.location.href = "practice.html"; // go to practice page
}

let startTime;

document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  if (document.getElementById("welcome")) {
    document.getElementById("welcome").textContent = `Welcome, ${username}!`;
    document.getElementById("input").addEventListener("focus", () => {
      if (!startTime) startTime = new Date();
    });
  }
});

function finishTyping() {
  const sample = document.getElementById("sample").textContent;
  const input = document.getElementById("input").value;

  if (!startTime) {
    alert("You must start typing first!");
    return;
  }

  const endTime = new Date();
  const timeTaken = (endTime - startTime) / 60000; // minutes
  const words = input.trim().split(" ").length;
  const speed = Math.round(words / timeTaken);

  let errors = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== sample[i]) errors++;
  }
  const accuracy = Math.round(((input.length - errors) / input.length) * 100);

  const resultText = `
    <p>Speed: ${speed} WPM</p>
    <p>Accuracy: ${accuracy}%</p>
    <p>Errors: ${errors}</p>
  `;
  document.getElementById("results").innerHTML = resultText;

  // save results
  let results = JSON.parse(localStorage.getItem("results")) || [];
  results.push({ speed, accuracy, errors });
  localStorage.setItem("results", JSON.stringify(results));
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("resultsTable")) {
    let results = JSON.parse(localStorage.getItem("results")) || [];
    let table = "";
    results.forEach((r, i) => {
      table += `
        <tr>
          <td>${i + 1}</td>
          <td>${r.speed}</td>
          <td>${r.accuracy}%</td>
          <td>${r.errors}</td>
        </tr>
      `;
    });
    document.getElementById("resultsTable").innerHTML = table;
  }
});
