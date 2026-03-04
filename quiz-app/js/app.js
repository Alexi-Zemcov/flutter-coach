import { ALL_QUESTIONS } from "./questions.js";

// ===== STATE =====

let currentQuestions = [];
let currentIndex = 0;
let answers = [];
let currentMode = null;     // 'ticket' | 'blitz' | 'topic' | 'marathon' | 'errors' | 'favorites'
let currentModeContext = {};
let timerInterval = null;
let timerSeconds = 0;

const STORAGE_KEY = 'flutterQuizStats';
const FAVORITES_KEY = 'flutterQuizFavorites';
const SESSION_KEY = 'flutterQuizSession';

let pendingResumeSession = null;

// ===== DERIVED DATA =====

const TICKETS_SIZE = 20;
const BLITZ_SIZE = 20;
const BLITZ_TIME = 20 * 60; // 20 minutes in seconds

const TICKETS = generateTickets(ALL_QUESTIONS);
const TOPICS = generateTopics(ALL_QUESTIONS);

function generateTickets(questions) {
  const tickets = [];
  for (let i = 0; i < questions.length; i += TICKETS_SIZE) {
    tickets.push({
      id: tickets.length + 1,
      questions: questions.slice(i, i + TICKETS_SIZE),
    });
  }
  return tickets;
}

function generateTopics(questions) {
  const map = new Map();
  questions.forEach(q => {
    if (!map.has(q.category)) map.set(q.category, []);
    map.get(q.category).push(q);
  });
  return [...map.entries()].map(([name, qs], i) => ({
    id: i + 1,
    name,
    questions: qs,
  }));
}

// ===== STORAGE =====

function getQuizStats() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function saveQuizStats(stats) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)); } catch {}
}

function questionKey(q) {
  return q.category + '|' + q.question;
}

function getFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'));
  } catch { return new Set(); }
}

function saveFavorites(favSet) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favSet]));
}

function toggleFavorite(qKey) {
  const favs = getFavorites();
  if (favs.has(qKey)) favs.delete(qKey);
  else favs.add(qKey);
  saveFavorites(favs);
  return favs.has(qKey);
}

function saveSession() {
  if (currentMode !== 'ticket') return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      mode: currentMode,
      context: currentModeContext,
      currentQuestions: currentQuestions,
      answers: answers,
      currentIndex: currentIndex,
    }));
  } catch {}
}

function loadSession(ticketId) {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (!s || s.mode !== 'ticket' || s.context.ticketId !== ticketId) return null;
    const answered = s.answers.filter(a => a !== null).length;
    if (answered === 0 || answered >= s.currentQuestions.length) return null;
    return s;
  } catch { return null; }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function getErrorQuestions() {
  const stats = getQuizStats();
  return ALL_QUESTIONS.filter(q => {
    const s = stats[questionKey(q)];
    return s && s.total > s.correct;
  });
}

// ===== UTILS =====

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleOptions(questions) {
  return questions.map(q => {
    const correctText = q.options[q.correct];
    const shuffled = shuffle(q.options);
    return { ...q, options: shuffled, correct: shuffled.indexOf(correctText) };
  });
}

// ===== NAVIGATION =====

const ALL_SCREENS = [
  'homeScreen', 'ticketsScreen', 'topicsScreen', 'marathonScreen',
  'errorsScreen', 'favoritesScreen', 'quizScreen', 'resultsScreen',
];

function showScreen(screenId) {
  ALL_SCREENS.forEach(id => {
    document.getElementById(id).classList.toggle('hidden', id !== screenId);
  });
  window.scrollTo(0, 0);
}

function showHome() {
  stopTimer();
  showScreen('homeScreen');
  updateHomeCounters();
}

function showTicketsScreen() {
  showScreen('ticketsScreen');
  renderTicketList();
}

function showTopicsScreen() {
  showScreen('topicsScreen');
  renderTopicList();
}

function showMarathonScreen() {
  showScreen('marathonScreen');
  document.getElementById('marathonTotal').textContent = ALL_QUESTIONS.length;
}

function showErrorsScreen() {
  showScreen('errorsScreen');
  renderErrorsContent();
}

function showFavoritesScreen() {
  showScreen('favoritesScreen');
  renderFavoritesContent();
}

// ===== HOME COUNTERS =====

function updateHomeCounters() {
  const stats = getQuizStats();
  const totalQ = ALL_QUESTIONS.length;
  const totalT = TICKETS.length;
  const totalTopics = TOPICS.length;

  // Questions answered correctly at least once
  const doneQ = ALL_QUESTIONS.filter(q => {
    const s = stats[questionKey(q)];
    return s && s.correct > 0;
  }).length;

  // Tickets fully completed (all questions correct at least once)
  const doneT = TICKETS.filter(t =>
    t.questions.every(q => {
      const s = stats[questionKey(q)];
      return s && s.correct > 0;
    })
  ).length;

  // Topics fully completed
  const doneTopics = TOPICS.filter(t =>
    t.questions.every(q => {
      const s = stats[questionKey(q)];
      return s && s.correct > 0;
    })
  ).length;

  document.getElementById('counterQuestions').textContent = doneQ;
  document.getElementById('counterQuestionsTotal').textContent = totalQ;
  document.getElementById('barQuestions').style.width = `${(doneQ / totalQ) * 100}%`;

  document.getElementById('counterTickets').textContent = doneT;
  document.getElementById('counterTicketsTotal').textContent = totalT;
  document.getElementById('barTickets').style.width = `${(doneT / totalT) * 100}%`;

  document.getElementById('counterTopics').textContent = doneTopics;
  document.getElementById('counterTopicsTotal').textContent = totalTopics;
  document.getElementById('barTopics').style.width = `${(doneTopics / totalTopics) * 100}%`;
}

// ===== TICKET LIST =====

function renderTicketList() {
  const stats = getQuizStats();
  const container = document.getElementById('ticketList');
  container.innerHTML = '';

  TICKETS.forEach(ticket => {
    const correctCount = ticket.questions.filter(q => {
      const s = stats[questionKey(q)];
      return s && s.correct > 0;
    }).length;

    const total = ticket.questions.length;
    const allDone = correctCount === total;
    const pct = (correctCount / total) * 100;

    const card = document.createElement('div');
    card.className = 'ticket-card' + (allDone ? ' completed' : '');
    card.innerHTML = `
      <div class="ticket-number">${ticket.id}</div>
      <div class="ticket-info">
        <div class="ticket-status">${correctCount} / ${total}</div>
        <div class="ticket-progress">
          <div class="ticket-progress-fill" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
    card.onclick = () => startTicketQuiz(ticket.id);
    container.appendChild(card);
  });
}

// ===== TOPIC LIST =====

function renderTopicList() {
  const stats = getQuizStats();
  const container = document.getElementById('topicList');
  container.innerHTML = '';

  TOPICS.forEach(topic => {
    const allCorrect = topic.questions.every(q => {
      const s = stats[questionKey(q)];
      return s && s.correct > 0;
    });

    const card = document.createElement('div');
    card.className = 'topic-card' + (allCorrect ? ' completed' : '');
    card.innerHTML = `
      <div class="topic-name">${topic.id}. ${topic.name}</div>
      <div class="topic-count">${topic.questions.length} вопросов</div>
    `;
    card.onclick = () => startTopicQuiz(topic.name);
    container.appendChild(card);
  });
}

// ===== ERRORS & FAVORITES SCREENS =====

function renderErrorsContent() {
  const container = document.getElementById('errorsContent');
  const errorQs = getErrorQuestions();

  if (errorQs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Ошибок пока нет!<br>Начни тренировку</p>
        <button class="btn btn-primary" onclick="showHome()">На главную</button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <p class="error-count">${errorQs.length} вопросов с ошибками</p>
      <div style="text-align:center">
        <button class="btn btn-primary" onclick="startErrorsQuiz()">Работа над ошибками</button>
      </div>
    `;
  }
}

function renderFavoritesContent() {
  const container = document.getElementById('favoritesContent');
  const favs = getFavorites();
  const favQs = ALL_QUESTIONS.filter(q => favs.has(questionKey(q)));

  if (favQs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Здесь появятся вопросы, которые ты отметишь как избранные &#11088;</p>
      </div>
    `;
  } else {
    container.innerHTML = `
      <p class="fav-count">${favQs.length} избранных вопросов</p>
      <div style="text-align:center">
        <button class="btn btn-primary" onclick="startFavoritesQuiz()">Начать</button>
      </div>
    `;
  }
}

// ===== QUIZ START FUNCTIONS =====

function getTicketAnsweredCount(ticketId) {
  const ticket = TICKETS.find(t => t.id === ticketId);
  const stats = getQuizStats();
  return ticket.questions.filter(q => {
    const s = stats[questionKey(q)];
    return s && s.total > 0;
  }).length;
}

function clearTicketStats(ticketId) {
  const ticket = TICKETS.find(t => t.id === ticketId);
  const stats = getQuizStats();
  ticket.questions.forEach(q => delete stats[questionKey(q)]);
  saveQuizStats(stats);
}

function startTicketQuiz(ticketId) {
  const ticket = TICKETS.find(t => t.id === ticketId);
  const answeredCount = getTicketAnsweredCount(ticketId);
  // Show resume modal if there are any answered questions (partial or full)
  if (answeredCount > 0) {
    pendingResumeSession = { session: loadSession(ticketId), ticketId };
    document.getElementById('resumeModalText').textContent =
      `Отвечено ${answeredCount} из ${ticket.questions.length} вопросов`;
    document.getElementById('resumeModal').classList.remove('hidden');
  } else {
    beginFreshTicket(ticketId);
  }
}

function beginFreshTicket(ticketId) {
  const ticket = TICKETS.find(t => t.id === ticketId);
  currentMode = 'ticket';
  currentModeContext = { ticketId };
  currentQuestions = shuffleOptions([...ticket.questions]);
  beginQuiz();
}

function confirmResume() {
  document.getElementById('resumeModal').classList.add('hidden');
  const { session, ticketId } = pendingResumeSession;
  pendingResumeSession = null;
  if (session) {
    // Full session restore — exact question order and answers preserved
    currentMode = session.mode;
    currentModeContext = session.context;
    currentQuestions = session.currentQuestions;
    answers = session.answers;
    const firstUnanswered = answers.findIndex(a => a === null);
    currentIndex = firstUnanswered !== -1 ? firstUnanswered : answers.length - 1;
    showScreen('quizScreen');
    setupQuizBackButton();
    renderQuestionStrip();
    renderQuestion();
  } else {
    // No session (e.g. browser was closed), start fresh keeping stats
    beginFreshTicket(ticketId);
  }
}

function confirmRestart() {
  document.getElementById('resumeModal').classList.add('hidden');
  const { ticketId } = pendingResumeSession;
  pendingResumeSession = null;
  clearSession();
  clearTicketStats(ticketId);
  beginFreshTicket(ticketId);
}

function startBlitz() {
  currentMode = 'blitz';
  currentModeContext = {};
  currentQuestions = shuffleOptions(shuffle(ALL_QUESTIONS).slice(0, BLITZ_SIZE));
  timerSeconds = BLITZ_TIME;
  beginQuiz();
  startTimer();
}

function startTopicQuiz(topicName) {
  const topic = TOPICS.find(t => t.name === topicName);
  currentMode = 'topic';
  currentModeContext = { topicName };
  currentQuestions = shuffleOptions([...topic.questions]);
  beginQuiz();
}

function startMarathon() {
  currentMode = 'marathon';
  currentModeContext = {};
  currentQuestions = shuffleOptions([...ALL_QUESTIONS]);
  beginQuiz();
}

function startErrorsQuiz() {
  currentMode = 'errors';
  currentModeContext = {};
  currentQuestions = shuffleOptions(getErrorQuestions());
  if (currentQuestions.length === 0) {
    showErrorsScreen();
    return;
  }
  beginQuiz();
}

function startFavoritesQuiz() {
  currentMode = 'favorites';
  currentModeContext = {};
  const favs = getFavorites();
  currentQuestions = shuffleOptions(ALL_QUESTIONS.filter(q => favs.has(questionKey(q))));
  if (currentQuestions.length === 0) {
    showFavoritesScreen();
    return;
  }
  beginQuiz();
}

function beginQuiz() {
  currentIndex = 0;
  answers = new Array(currentQuestions.length).fill(null);
  showScreen('quizScreen');
  setupQuizBackButton();
  renderQuestionStrip();
  renderQuestion();
}

// ===== QUIZ HEADER =====

function updateQuizHeader() {
  const el = document.getElementById('quizHeaderTitle');
  const num = currentIndex + 1;

  switch (currentMode) {
    case 'ticket':
      el.textContent = `Билет ${currentModeContext.ticketId}, вопрос ${num}`;
      break;
    case 'blitz':
      el.textContent = `Блиц, вопрос ${num}`;
      break;
    case 'topic':
      el.textContent = `${currentModeContext.topicName}, вопрос ${num}`;
      break;
    case 'marathon':
      el.textContent = `Марафон, вопрос ${num}`;
      break;
    case 'errors':
      el.textContent = `Ошибки, вопрос ${num}`;
      break;
    case 'favorites':
      el.textContent = `Избранное, вопрос ${num}`;
      break;
  }
}

// ===== QUESTION STRIP =====

function renderQuestionStrip() {
  const strip = document.getElementById('questionStrip');
  strip.innerHTML = '';

  currentQuestions.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'q-dot';

    if (i === currentIndex) dot.classList.add('current');
    else if (answers[i] !== null) {
      dot.classList.add(answers[i].correct ? 'correct' : 'wrong');
    }

    dot.textContent = i + 1;
    dot.onclick = () => goToQuestion(i);
    strip.appendChild(dot);
  });

  // Auto-scroll to current
  const cur = strip.children[currentIndex];
  if (cur) cur.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function goToQuestion(i) {
  if (answers[i] !== null || i === currentIndex) {
    currentIndex = i;
    renderQuestionStrip();
    renderQuestion();
  }
}

// ===== RENDER QUESTION =====

function renderQuestion() {
  const q = currentQuestions[currentIndex];
  const alreadyAnswered = answers[currentIndex] !== null;

  updateQuizHeader();
  updateFavoriteToggle();

  document.getElementById('qText').textContent = q.question;

  // Explanation
  const explEl = document.getElementById('qExplanation');
  document.getElementById('explanationCorrect').textContent = `Правильный ответ: ${q.correct + 1}`;
  document.getElementById('explanationText').textContent = q.explanation;

  // Options
  const optionsEl = document.getElementById('qOptions');
  optionsEl.innerHTML = '';

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = `${i + 1}.  ${opt}`;

    if (alreadyAnswered) {
      btn.classList.add('disabled');
      if (i === q.correct) btn.classList.add('correct');
      if (i === answers[currentIndex].selectedIndex && !answers[currentIndex].correct) {
        btn.classList.add('wrong');
      }
    } else {
      btn.onclick = () => selectAnswer(i);
    }

    optionsEl.appendChild(btn);
  });

  // Show explanation only after wrong answer
  explEl.classList.toggle('visible', alreadyAnswered && !answers[currentIndex]?.correct);

  // Show next button after any answer
  const nextWrap = document.getElementById('nextWrap');
  nextWrap.classList.toggle('visible', alreadyAnswered);

  // Update next button text for last question
  const nextBtn = nextWrap.querySelector('.btn');
  const isLast = currentIndex >= currentQuestions.length - 1;
  if (isLast && alreadyAnswered) {
    // Check if there are unanswered questions
    const firstUnanswered = answers.findIndex(a => a === null);
    if (firstUnanswered === -1) {
      nextBtn.textContent = 'РЕЗУЛЬТАТЫ';
    } else {
      nextBtn.textContent = 'СЛЕДУЮЩИЙ ВОПРОС';
    }
  } else {
    nextBtn.textContent = 'СЛЕДУЮЩИЙ ВОПРОС';
  }
}

// ===== SELECT ANSWER =====

function selectAnswer(selected) {
  const q = currentQuestions[currentIndex];
  const isCorrect = selected === q.correct;

  answers[currentIndex] = {
    questionKey: questionKey(q),
    category: q.category,
    correct: isCorrect,
    selectedIndex: selected,
  };

  // Persist to stats
  const stats = getQuizStats();
  const key = questionKey(q);
  if (!stats[key]) stats[key] = { correct: 0, total: 0 };
  stats[key].total++;
  if (isCorrect) stats[key].correct++;
  saveQuizStats(stats);

  renderQuestionStrip();
  renderQuestion();
  saveSession();
}

// ===== NEXT QUESTION =====

function nextQuestion() {
  // Find next unanswered question
  let next = -1;
  for (let i = currentIndex + 1; i < currentQuestions.length; i++) {
    if (answers[i] === null) { next = i; break; }
  }
  // Wrap around
  if (next === -1) {
    for (let i = 0; i < currentIndex; i++) {
      if (answers[i] === null) { next = i; break; }
    }
  }

  if (next === -1) {
    // All answered
    showResults();
  } else {
    currentIndex = next;
    renderQuestionStrip();
    renderQuestion();
  }
}

// ===== TIMER (Blitz) =====

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    if (timerSeconds <= 0) {
      stopTimer();
      autoSubmitBlitz();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  document.getElementById('quizTimer').textContent = '';
}

function updateTimerDisplay() {
  const min = Math.floor(timerSeconds / 60);
  const sec = timerSeconds % 60;
  const el = document.getElementById('quizTimer');
  el.textContent = `\u23F1 ${min}:${sec.toString().padStart(2, '0')}`;

  // Red color when less than 1 minute
  if (timerSeconds < 60) {
    el.style.color = '#f44336';
  } else {
    el.style.color = '#ccc';
  }
}

function autoSubmitBlitz() {
  // Mark unanswered as wrong
  answers.forEach((a, i) => {
    if (a === null) {
      const q = currentQuestions[i];
      answers[i] = {
        questionKey: questionKey(q),
        category: q.category,
        correct: false,
        selectedIndex: -1,
        timedOut: true,
      };
    }
  });
  showResults();
}

// ===== FAVORITE TOGGLE =====

function updateFavoriteToggle() {
  const q = currentQuestions[currentIndex];
  const key = questionKey(q);
  const isFav = getFavorites().has(key);
  const toggle = document.getElementById('favoriteToggle');

  toggle.className = 'favorite-toggle' + (isFav ? ' active' : '');
  toggle.querySelector('.fav-icon').innerHTML = isFav ? '&#11088;' : '&#9734;';
  toggle.querySelector('.fav-text').textContent = isFav ? 'УБРАТЬ ИЗ ИЗБРАННОГО' : 'ДОБАВИТЬ В ИЗБРАННОЕ';

  toggle.onclick = () => {
    toggleFavorite(key);
    updateFavoriteToggle();
  };
}

// ===== EXIT MODAL =====

function setupQuizBackButton() {
  document.getElementById('quizBackBtn').onclick = () => {
    document.getElementById('exitModal').classList.remove('hidden');
  };
}

function closeExitModal() {
  document.getElementById('exitModal').classList.add('hidden');
}

function confirmExit() {
  closeExitModal();
  stopTimer();
  showHome();
}

// ===== RESULTS =====

function showResults() {
  stopTimer();
  clearSession();
  showScreen('resultsScreen');

  const total = answers.length;
  const correct = answers.filter(a => a && a.correct).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const circle = document.getElementById('scoreCircle');
  circle.className = 'score-circle ' + (pct >= 80 ? 'good' : pct >= 50 ? 'ok' : 'bad');
  document.getElementById('scoreNumber').textContent = `${pct}%`;
  document.getElementById('scoreLabel').textContent = `${correct} из ${total}`;

  // Category breakdown
  const catMap = {};
  answers.forEach(a => {
    if (!a) return;
    if (!catMap[a.category]) catMap[a.category] = { correct: 0, total: 0 };
    catMap[a.category].total++;
    if (a.correct) catMap[a.category].correct++;
  });

  const resultsEl = document.getElementById('categoryResults');
  resultsEl.innerHTML = '';

  Object.entries(catMap).forEach(([cat, data]) => {
    const p = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
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

function retryCurrentMode() {
  switch (currentMode) {
    case 'ticket': beginFreshTicket(currentModeContext.ticketId); break;
    case 'blitz': startBlitz(); break;
    case 'topic': startTopicQuiz(currentModeContext.topicName); break;
    case 'marathon': startMarathon(); break;
    case 'errors': startErrorsQuiz(); break;
    case 'favorites': startFavoritesQuiz(); break;
    default: showHome();
  }
}

// ===== INIT =====

updateHomeCounters();

// Expose for HTML onclick handlers
window.showHome = showHome;
window.showTicketsScreen = showTicketsScreen;
window.showTopicsScreen = showTopicsScreen;
window.showMarathonScreen = showMarathonScreen;
window.showErrorsScreen = showErrorsScreen;
window.showFavoritesScreen = showFavoritesScreen;
window.startBlitz = startBlitz;
window.startMarathon = startMarathon;
window.startErrorsQuiz = startErrorsQuiz;
window.startFavoritesQuiz = startFavoritesQuiz;
window.nextQuestion = nextQuestion;
window.retryCurrentMode = retryCurrentMode;
window.closeExitModal = closeExitModal;
window.confirmExit = confirmExit;
window.confirmResume = confirmResume;
window.confirmRestart = confirmRestart;
