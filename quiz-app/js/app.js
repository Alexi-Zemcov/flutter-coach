import { ALL_QUESTIONS } from "./questions.js";

let currentQuestions = [];
let currentIndex = 0;
let answers = [];
const categories = [...new Set(ALL_QUESTIONS.map(q => q.category))];

const STORAGE_KEY = 'flutterQuizStats';

function getQuizStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

function saveQuizStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (_) {}
}

function questionKey(q) {
  return q.category + '|' + q.question;
}

// Populate category select
const select = document.getElementById('categoryFilter');
select.options[0].textContent = `Все категории (${ALL_QUESTIONS.length} вопросов)`;
categories.forEach(cat => {
  const count = ALL_QUESTIONS.filter(q => q.category === cat).length;
  const opt = document.createElement('option');
  opt.value = cat;
  opt.textContent = `${cat} (${count})`;
  select.appendChild(opt);
});

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showStart() {
  document.getElementById('startScreen').classList.remove('hidden');
  document.getElementById('quizScreen').classList.add('hidden');
  document.getElementById('resultsScreen').classList.add('hidden');
  document.getElementById('statsScreen').classList.add('hidden');
}

function startQuiz() {
  const filter = document.getElementById('categoryFilter').value;
  currentQuestions = filter === 'all'
    ? shuffle(ALL_QUESTIONS)
    : shuffle(ALL_QUESTIONS.filter(q => q.category === filter));

  // Shuffle options for each question
  currentQuestions = currentQuestions.map(q => {
    const correctText = q.options[q.correct];
    const shuffled = shuffle(q.options);
    return {
      ...q,
      options: shuffled,
      correct: shuffled.indexOf(correctText)
    };
  });

  currentIndex = 0;
  answers = [];

  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('quizScreen').classList.remove('hidden');
  document.getElementById('resultsScreen').classList.add('hidden');
  document.getElementById('statsScreen').classList.add('hidden');

  renderQuestion();
}

function renderQuestion() {
  const q = currentQuestions[currentIndex];
  const total = currentQuestions.length;

  document.getElementById('progressFill').style.width = `${((currentIndex) / total) * 100}%`;
  document.getElementById('qCategory').textContent = q.category;
  document.getElementById('qCounter').textContent = `${currentIndex + 1} / ${total}`;
  document.getElementById('qText').textContent = q.question;
  document.getElementById('qExplanation').textContent = q.explanation;
  document.getElementById('qExplanation').classList.remove('visible');
  document.getElementById('nextWrap').classList.remove('visible');

  const optionsEl = document.getElementById('qOptions');
  optionsEl.innerHTML = '';

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i);
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(selected) {
  const q = currentQuestions[currentIndex];
  const btns = document.querySelectorAll('.option-btn');
  const isCorrect = selected === q.correct;

  answers.push({ category: q.category, correct: isCorrect });

  // Сохраняем в долгосрочную память (localStorage)
  const stats = getQuizStats();
  const key = questionKey(q);
  if (!stats[key]) stats[key] = { correct: 0, total: 0 };
  stats[key].total++;
  if (isCorrect) stats[key].correct++;
  saveQuizStats(stats);

  btns.forEach((btn, i) => {
    btn.classList.add('disabled');
    btn.onclick = null;
    if (i === q.correct) btn.classList.add('correct');
    if (i === selected && !isCorrect) btn.classList.add('wrong');
  });

  document.getElementById('qExplanation').classList.add('visible');
  document.getElementById('nextWrap').classList.add('visible');
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= currentQuestions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

function showResults() {
  document.getElementById('quizScreen').classList.add('hidden');
  document.getElementById('resultsScreen').classList.remove('hidden');

  const total = answers.length;
  const correct = answers.filter(a => a.correct).length;
  const pct = Math.round((correct / total) * 100);

  const circle = document.getElementById('scoreCircle');
  circle.className = 'score-circle ' + (pct >= 80 ? 'good' : pct >= 50 ? 'ok' : 'bad');
  document.getElementById('scoreNumber').textContent = `${pct}%`;
  document.getElementById('scoreLabel').textContent = `${correct} из ${total}`;

  // Статистика за всё время из localStorage
  const allStats = getQuizStats();
  let allCorrect = 0, allTotal = 0;
  Object.values(allStats).forEach(s => {
    allCorrect += s.correct;
    allTotal += s.total;
  });
  const totalStatsEl = document.getElementById('totalStats');
  totalStatsEl.textContent = allTotal > 0
    ? `Всего за всё время: ${allCorrect} правильных из ${allTotal} ответов`
    : '';

  // Category breakdown
  const catMap = {};
  answers.forEach(a => {
    if (!catMap[a.category]) catMap[a.category] = { correct: 0, total: 0 };
    catMap[a.category].total++;
    if (a.correct) catMap[a.category].correct++;
  });

  const resultsEl = document.getElementById('categoryResults');
  resultsEl.innerHTML = '';

  Object.entries(catMap).forEach(([cat, data]) => {
    const p = Math.round((data.correct / data.total) * 100);
    const cls = p >= 80 ? 'good' : p >= 50 ? 'ok' : 'bad';
    const div = document.createElement('div');
    div.className = 'cat-result';
    div.innerHTML = `
      <span class="cat-result-name">${cat}</span>
      <span class="cat-result-score ${cls}">${data.correct}/${data.total}</span>
    `;
    resultsEl.appendChild(div);
  });
}

// --- Stats screen ---

function aggregateStatsByCategory() {
  const stats = getQuizStats();
  const catStats = {};

  categories.forEach(cat => {
    catStats[cat] = { correct: 0, total: 0, questions: 0 };
  });

  Object.entries(stats).forEach(([key, data]) => {
    const cat = key.split('|')[0];
    if (catStats[cat]) {
      catStats[cat].correct += data.correct;
      catStats[cat].total += data.total;
      catStats[cat].questions++;
    }
  });

  return catStats;
}

function showStats() {
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('quizScreen').classList.add('hidden');
  document.getElementById('resultsScreen').classList.add('hidden');
  document.getElementById('statsScreen').classList.remove('hidden');

  renderStats();
}

function renderStats() {
  const catStats = aggregateStatsByCategory();

  let totalCorrect = 0, totalAnswers = 0, totalQuestions = 0;
  Object.values(catStats).forEach(s => {
    totalCorrect += s.correct;
    totalAnswers += s.total;
    totalQuestions += s.questions;
  });

  const overallPct = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  document.getElementById('statsTotal').textContent = totalAnswers;
  document.getElementById('statsCorrect').textContent = overallPct + '%';
  document.getElementById('statsCoverage').textContent = totalQuestions + '/' + ALL_QUESTIONS.length;

  const barsEl = document.getElementById('statsBars');
  barsEl.innerHTML = '';

  const sorted = Object.entries(catStats).sort((a, b) => {
    const pctA = a[1].total > 0 ? a[1].correct / a[1].total : -1;
    const pctB = b[1].total > 0 ? b[1].correct / b[1].total : -1;
    return pctB - pctA;
  });

  sorted.forEach(([cat, data]) => {
    const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    const cls = data.total === 0 ? 'none' : (pct >= 80 ? 'good' : pct >= 50 ? 'ok' : 'bad');
    const totalInCat = ALL_QUESTIONS.filter(q => q.category === cat).length;

    const row = document.createElement('div');
    row.className = 'stats-bar-row';
    row.innerHTML = `
      <div class="stats-bar-header">
        <span class="stats-bar-name">${cat}</span>
        <span class="stats-bar-value">${data.correct}/${data.total} (${data.questions}/${totalInCat} вопросов)</span>
      </div>
      <div class="stats-bar-track">
        <div class="stats-bar-fill ${cls}" style="width: ${data.total > 0 ? pct : 0}%"></div>
        ${data.total > 0 ? `<span class="stats-bar-pct">${pct}%</span>` : ''}
      </div>
    `;
    barsEl.appendChild(row);
  });
}

function clearStats() {
  if (confirm('Сбросить всю статистику? Это действие нельзя отменить.')) {
    localStorage.removeItem(STORAGE_KEY);
    renderStats();
  }
}

// Expose for HTML onclick handlers (module scope is not global)
window.startQuiz = startQuiz;
window.showStats = showStats;
window.showStart = showStart;
window.nextQuestion = nextQuestion;
window.clearStats = clearStats;
