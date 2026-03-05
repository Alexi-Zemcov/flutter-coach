import { ALL_QUESTIONS } from "../../questions.js";
import { BLITZ_SIZE, BLITZ_TIME, TICKETS, TOPICS, shuffle, shuffleOptions } from "../data.js";
import { getDom } from "../dom.js";
import { showHome, showScreen, showErrorsScreen, showFavoritesScreen } from "../navigation.js";
import { state } from "../state.js";
import {
  clearSession,
  getErrorQuestions,
  getFavorites,
  getQuizStats,
  loadSession,
  questionKey,
  saveQuizStats,
  saveSession,
  toggleFavorite,
} from "../storage.js";
import { renderQuestion, renderQuestionStrip, updateFavoriteToggle } from "../ui/quiz.js";
import { startTimer, stopTimer } from "./timer.js";

function getTicketAnsweredCount(ticketId) {
  const ticket = TICKETS.find((t) => t.id === ticketId);
  const stats = getQuizStats();
  return ticket.questions.filter((q) => {
    const s = stats[questionKey(q)];
    return s && s.total > 0;
  }).length;
}

function clearTicketStats(ticketId) {
  const ticket = TICKETS.find((t) => t.id === ticketId);
  const stats = getQuizStats();
  ticket.questions.forEach((q) => {
    delete stats[questionKey(q)];
  });
  saveQuizStats(stats);
}

export function startTicketQuiz(ticketId) {
  const ticket = TICKETS.find((t) => t.id === ticketId);
  const answeredCount = getTicketAnsweredCount(ticketId);

  if (answeredCount > 0) {
    state.pendingResumeSession = { session: loadSession(ticketId), ticketId };
    const { modals } = getDom();
    modals.resumeModalText.textContent = `Отвечено ${answeredCount} из ${ticket.questions.length} вопросов`;
    modals.resumeModal.classList.remove("hidden");
  } else {
    beginFreshTicket(ticketId);
  }
}

function beginFreshTicket(ticketId) {
  const ticket = TICKETS.find((t) => t.id === ticketId);
  state.currentMode = "ticket";
  state.currentModeContext = { ticketId };
  state.currentQuestions = shuffleOptions([...ticket.questions]);
  beginQuiz();
}

export function confirmResume() {
  const { modals } = getDom();
  modals.resumeModal.classList.add("hidden");
  const { session, ticketId } = state.pendingResumeSession;
  state.pendingResumeSession = null;

  if (session) {
    state.currentMode = session.mode;
    state.currentModeContext = session.context;
    state.currentQuestions = session.currentQuestions;
    state.answers = session.answers;
    const firstUnanswered = state.answers.findIndex((a) => a === null);
    state.currentIndex = firstUnanswered !== -1 ? firstUnanswered : state.answers.length - 1;
    showScreen("quizScreen");
    history.pushState({ screen: "quiz" }, "", location.href);
    renderQuestionStrip();
    renderQuestion();
  } else {
    beginFreshTicket(ticketId);
  }
}

export function confirmRestart() {
  const { modals } = getDom();
  modals.resumeModal.classList.add("hidden");
  const { ticketId } = state.pendingResumeSession;
  state.pendingResumeSession = null;
  clearSession();
  clearTicketStats(ticketId);
  beginFreshTicket(ticketId);
}

export function startBlitz() {
  state.currentMode = "blitz";
  state.currentModeContext = {};
  state.currentQuestions = shuffleOptions(shuffle(ALL_QUESTIONS).slice(0, BLITZ_SIZE));
  state.timerSeconds = BLITZ_TIME;
  beginQuiz();
  startTimer(() => autoSubmitBlitz());
}

export function startTopicQuiz(topicName) {
  const topic = TOPICS.find((t) => t.name === topicName);
  state.currentMode = "topic";
  state.currentModeContext = { topicName };
  state.currentQuestions = shuffleOptions([...topic.questions]);
  beginQuiz();
}

export function startMarathon() {
  state.currentMode = "marathon";
  state.currentModeContext = {};
  state.currentQuestions = shuffleOptions([...ALL_QUESTIONS]);
  beginQuiz();
}

export function startErrorsQuiz() {
  state.currentMode = "errors";
  state.currentModeContext = {};
  state.currentQuestions = shuffleOptions(getErrorQuestions());
  if (state.currentQuestions.length === 0) {
    showErrorsScreen();
    return;
  }
  beginQuiz();
}

export function startFavoritesQuiz() {
  state.currentMode = "favorites";
  state.currentModeContext = {};
  const favs = getFavorites();
  state.currentQuestions = shuffleOptions(ALL_QUESTIONS.filter((q) => favs.has(questionKey(q))));
  if (state.currentQuestions.length === 0) {
    showFavoritesScreen();
    return;
  }
  beginQuiz();
}

function beginQuiz() {
  state.currentIndex = 0;
  state.answers = new Array(state.currentQuestions.length).fill(null);
  showScreen("quizScreen");
  history.pushState({ screen: "quiz" }, "", location.href);
  renderQuestionStrip();
  renderQuestion();
}

export function selectAnswer(selected) {
  if (state.answers[state.currentIndex] !== null) {
    return;
  }

  const q = state.currentQuestions[state.currentIndex];
  const isCorrect = selected === q.correct;

  state.answers[state.currentIndex] = {
    questionKey: questionKey(q),
    category: q.category,
    correct: isCorrect,
    selectedIndex: selected,
  };

  const stats = getQuizStats();
  const key = questionKey(q);
  if (!stats[key]) {
    stats[key] = { correct: 0, total: 0 };
  }
  stats[key].total++;
  if (isCorrect) {
    stats[key].correct++;
  }
  saveQuizStats(stats);

  renderQuestionStrip();
  renderQuestion();
  saveSession();
}

export function nextQuestion() {
  let next = -1;
  for (let i = state.currentIndex + 1; i < state.currentQuestions.length; i++) {
    if (state.answers[i] === null) {
      next = i;
      break;
    }
  }
  if (next === -1) {
    for (let i = 0; i < state.currentIndex; i++) {
      if (state.answers[i] === null) {
        next = i;
        break;
      }
    }
  }

  if (next === -1) {
    showResults();
  } else {
    state.currentIndex = next;
    renderQuestionStrip();
    renderQuestion();
  }
}

function autoSubmitBlitz() {
  state.answers.forEach((a, i) => {
    if (a === null) {
      const q = state.currentQuestions[i];
      state.answers[i] = {
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

export function toggleCurrentFavorite() {
  const q = state.currentQuestions[state.currentIndex];
  if (!q) {
    return;
  }
  toggleFavorite(questionKey(q));
  updateFavoriteToggle();
}

export function openExitModal() {
  const { modals } = getDom();
  modals.exitModal.classList.remove("hidden");
}

export function closeExitModal() {
  const { modals } = getDom();
  modals.exitModal.classList.add("hidden");
}

export function confirmExit() {
  closeExitModal();
  stopTimer();
  state.exitingQuiz = true;
  showHome();
  history.back();
}

export function showResults() {
  stopTimer();
  clearSession();
  showScreen("resultsScreen");
  history.pushState({ screen: "results" }, "", location.href);

  const total = state.answers.length;
  const correct = state.answers.filter((a) => a && a.correct).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const { results } = getDom();
  results.scoreCircle.className = `score-circle ${pct >= 80 ? "good" : pct >= 50 ? "ok" : "bad"}`;
  results.scoreNumber.textContent = `${pct}%`;
  results.scoreLabel.textContent = `${correct} из ${total}`;

  const catMap = {};
  state.answers.forEach((a) => {
    if (!a) {
      return;
    }
    if (!catMap[a.category]) {
      catMap[a.category] = { correct: 0, total: 0 };
    }
    catMap[a.category].total++;
    if (a.correct) {
      catMap[a.category].correct++;
    }
  });

  results.categoryResults.innerHTML = "";
  Object.entries(catMap).forEach(([cat, data]) => {
    const p = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    const cls = p >= 80 ? "good" : p >= 50 ? "ok" : "bad";
    const div = document.createElement("div");
    div.className = "cat-result";
    div.innerHTML = `
      <span class="cat-result-name">${cat}</span>
      <span class="cat-result-score ${cls}">${data.correct}/${data.total}</span>
    `;
    results.categoryResults.appendChild(div);
  });
}

export function retryCurrentMode() {
  switch (state.currentMode) {
    case "ticket":
      beginFreshTicket(state.currentModeContext.ticketId);
      break;
    case "blitz":
      startBlitz();
      break;
    case "topic":
      startTopicQuiz(state.currentModeContext.topicName);
      break;
    case "marathon":
      startMarathon();
      break;
    case "errors":
      startErrorsQuiz();
      break;
    case "favorites":
      startFavoritesQuiz();
      break;
    default:
      showHome();
  }
}
