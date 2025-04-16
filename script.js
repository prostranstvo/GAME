const questionBox = document.getElementById("questionBox");
const choicesBox = document.getElementById("choices");
const feedbackBox = document.getElementById("feedback");
const scoreBox = document.getElementById("scoreBox");
const animation = document.getElementById("animation");
const startBtn = document.getElementById("startBtn");
const levelSelector = document.getElementById("level");

let index = 0;
let score = 0;
let problems = [];

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateProblem = (difficulty) => {
  const type = randomBetween(1, difficulty === "hard" ? 5 : difficulty === "medium" ? 4 : 2);
  let question = "";
  let answer = 0;

  switch (type) {
    case 1: {
      const x = randomBetween(1, 10);
      const eq = 5 * x + 7;
      question = `5x + 7 = ${eq}. Find x.`;
      answer = x;
      break;
    }
    case 2: {
      const a = randomBetween(10, 30);
      const b = randomBetween(1, a - 1);
      const sum = a + b;
      question = `a + b = ${sum}, b = ${b}. Find a.`;
      answer = a;
      break;
    }
    case 3: {
      const x = randomBetween(10, 40);
      const sum = x + (x + 1);
      question = `x + (x + 1) = ${sum}. Find x.`;
      answer = x;
      break;
    }
    case 4: {
      const x = randomBetween(10, 40);
      const y = x + 28;
      const total = x + y;
      question = `x + y = ${total}, y = x + 28. Find x.`;
      answer = x;
      break;
    }
    case 5: {
      const x = randomBetween(10, 40);
      const y = randomBetween(1, 20);
      const sum = x + y;
      const diff = x - y;
      question = `x + y = ${sum}, x - y = ${diff}. Find x.`;
      answer = x;
      break;
    }
  }

  return { question, answer };
};

const generateChoices = (correct) => {
  const set = new Set([correct]);
  while (set.size < 3) {
    const offset = randomBetween(1, 5);
    const alt = Math.random() > 0.5 ? correct + offset : correct - offset;
    if (alt >= 0 && !set.has(alt)) set.add(alt);
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
};

const render = () => {
  if (index >= problems.length) {
    document.body.innerHTML = `<h1>Game Over</h1><p>You scored ${score} out of ${problems.length}.</p>`;
    return;
  }

  const { question, answer } = problems[index];
  const choices = generateChoices(answer);

  questionBox.textContent = `Solve: ${question}`;
  choicesBox.innerHTML = "";
  feedbackBox.textContent = "";
  animation.innerHTML = "";

  choices.forEach((val, i) => {
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.textContent = `${val}`;
    btn.onclick = () => handleChoice(val === answer);
    choicesBox.appendChild(btn);
  });
};

const handleChoice = (correct) => {
  if (correct) {
    score++;
    feedbackBox.textContent = "✅ Correct!";
    animation.innerHTML = "🐱";
  } else {
    score = Math.max(0, score - 1);
    feedbackBox.textContent = "❌ Incorrect!";
    animation.innerHTML = "💥";
  }

  animation.style.display = "block";
  scoreBox.textContent = `Score: ${score}`;

  setTimeout(() => {
    animation.style.display = "none";
    index++;
    render();
  }, 2000);
};

document.addEventListener("keydown", (e) => {
  const keys = ["1", "2", "3"];
  if (keys.includes(e.key)) {
    const btns = choicesBox.querySelectorAll(".choice");
    if (btns[e.key - 1]) btns[e.key - 1].click();
  }
});

const difficultyScreen = document.getElementById("difficultyScreen");
const title = document.getElementById("title");

document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.onclick = () => {
    const difficulty = btn.dataset.level;
    score = 0;
    index = 0;
    problems = Array.from({ length: 20 }, () => generateProblem(difficulty));
    scoreBox.textContent = `Score: ${score}`;
    difficultyScreen.style.display = "none";
    title.style.display = "none";
    questionBox.style.display = "block";
    choicesBox.style.display = "grid";
    feedbackBox.style.display = "block";
    scoreBox.style.display = "block";
    render();
  };
});

