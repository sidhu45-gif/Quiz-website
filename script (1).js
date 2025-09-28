// script.js

const formSection = document.getElementById('form-section');
const quizSection = document.getElementById('quiz-section');
const scorecardSection = document.getElementById('scorecard-section');
const leaderboardSection = document.getElementById('leaderboard-section');
const startQuizBtn = document.getElementById('start-quiz-btn');
const questionArea = document.getElementById('question-area');
const optionsArea = document.getElementById('options-area');
const timerCount = document.getElementById('timer-count');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const playerNameInput = document.getElementById('player-name');
const difficultyLevel = document.getElementById('difficulty-level');
const scoreList = document.getElementById('score-list');
const leaderboardList = document.getElementById('leaderboard-list');
const suggestionBtn = document.getElementById('suggestion-btn');
const resetBtn = document.getElementById('reset-btn');
const homeBtn = document.getElementById('home-btn');
const chatbox = document.getElementById('chatbox');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

let quizData = [];
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswers = {};
let timer = null;
let score = 0;
let leaderboard = [];

const easyTime = 30, mediumTime = 35, hardTime = 40;

// To use Open Trivia DB dynamically (uncomment if needed)
// async function fetchQuiz(category, difficulty, subject) {
//   const url = `https://opentdb.com/api.php?amount=5&type=multiple&difficulty=${difficulty}`;
//   let response = await fetch(url);
//   let data = await response.json();
//   return data.results.map(q => ({
//     question: q.question,
//     options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
//     answer: q.correct_answer
//   }));
// }

function resetQuiz() {
  quizData = [];
  shuffledQuestions = [];
  selectedAnswers = {};
  currentQuestionIndex = 0;
  score = 0;
  timer && clearInterval(timer);
  quizSection.style.display = 'none';
  scorecardSection.style.display = 'none';
  leaderboardSection.style.display = 'none';
  formSection.style.display = 'flex';
}

function showSection(sec) {
  [formSection, quizSection, scorecardSection, leaderboardSection].forEach(s => s.style.display = 'none');
  sec.style.display = 'flex';
}

function generateQuestions(subject, difficulty) {
  // Replace with Open Trivia DB fetching if needed
  let questions = [
    { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Lisbon"], answer: "Paris" },
    { question: "Which language is used for web development?", options: ["Python", "HTML", "Java", "C++"], answer: "HTML" },
    { question: "Who wrote 'Hamlet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], answer: "William Shakespeare" },
    { question: "What is the largest planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Jupiter" },
    { question: "Land of the Rising Sun?", options: ["China", "Japan", "South Korea", "India"], answer: "Japan" }
  ];
  // Shuffle questions
  return questions.sort(() => Math.random() - 0.5);
}

startQuizBtn.onclick = () => {
  if (!playerNameInput.value) return alert('Enter name');
  quizData = generateQuestions(document.getElementById('subject-category').value, difficultyLevel.value);
  shuffledQuestions = quizData.slice();
  showSection(quizSection);
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestionIndex < 0) currentQuestionIndex = 0;
  if (currentQuestionIndex >= shuffledQuestions.length) return showScorecard();
  let q = shuffledQuestions[currentQuestionIndex];
  questionArea.innerHTML = q.question;
  optionsArea.innerHTML = '';
  q.options.forEach(opt => {
    let btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = selectedAnswers[currentQuestionIndex] === opt ? "selected" : "";
    btn.onclick = () => {
      selectedAnswers[currentQuestionIndex] = opt;
      loadQuestion();
    };
    optionsArea.appendChild(btn);
  });

  // Difficulty-based timer
  let tMs = easyTime;
  if (difficultyLevel.value === 'medium') tMs = mediumTime;
  if (difficultyLevel.value === 'hard') tMs = hardTime;
  let time = tMs;
  timerCount.textContent = time;
  timer && clearInterval(timer);
  timer = setInterval(() => {
    time--;
    timerCount.textContent = time;
    if (time === 0) {
      clearInterval(timer);
      nextBtn.click();
    }
  }, 1000);

  backBtn.disabled = currentQuestionIndex === 0;
}

nextBtn.onclick = () => {
  currentQuestionIndex++;
  loadQuestion();
}

backBtn.onclick = () => {
  currentQuestionIndex--;
  loadQuestion();
}

function showScorecard() {
  quizSection.style.display = 'none';
  scorecardSection.style.display = 'flex';
  scoreList.innerHTML = '';
  score = 0;
  shuffledQuestions.forEach((q, i) => {
    let isRight = selectedAnswers[i] === q.answer;
    let li = document.createElement('li');
    li.innerHTML = `
      Q${i + 1}: ${q.question} <br>
      Chosen: ${selectedAnswers[i] || 'N/A'} 
      ${isRight ? '<span class="right-sign">&#10003;</span>' : '<span class="wrong-sign">&#10007;</span>'}
      <br>Correct: ${q.answer}
    `;
    scoreList.appendChild(li);
    if (isRight) score++;
  });
  updateLeaderboard();
}

resetBtn.onclick = resetQuiz;
homeBtn.onclick = resetQuiz; // goes to home
suggestionBtn.onclick = () => alert('Try a harder level!');

function updateLeaderboard() {
  leaderboard.push({ name: playerNameInput.value, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboardSection.style.display = 'flex';
  leaderboardList.innerHTML = '';
  leaderboard.forEach((l, i) => {
    let li = document.createElement('li');
    li.textContent = `${i + 1}. ${l.name} - ${l.score}`;
    leaderboardList.appendChild(li);
  });
}

// Simple chatbox demo
chatSend.onclick = () => {
  let msg = chatInput.value.trim();
  if (msg.length > 0) {
    let answer = "Our subjects: General, Science, Math, History, Sports. For help, pick a category!";
    chatMessages.innerHTML += `<div><b>Me:</b> ${msg}</div><div><b>Bot:</b> ${answer}</div>`;
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
};

resetQuiz();