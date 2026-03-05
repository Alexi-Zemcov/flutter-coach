import { getDom } from "../dom.js";
import { state } from "../state.js";
import { getFavorites, questionKey } from "../storage.js";

export function updateQuizHeader() {
  const { quiz } = getDom();
  const num = state.currentIndex + 1;

  switch (state.currentMode) {
    case "ticket":
      quiz.headerTitle.textContent = `Билет ${state.currentModeContext.ticketId}, вопрос ${num}`;
      break;
    case "blitz":
      quiz.headerTitle.textContent = `Блиц, вопрос ${num}`;
      break;
    case "topic":
      quiz.headerTitle.textContent = `${state.currentModeContext.topicName}, вопрос ${num}`;
      break;
    case "marathon":
      quiz.headerTitle.textContent = `Марафон, вопрос ${num}`;
      break;
    case "errors":
      quiz.headerTitle.textContent = `Ошибки, вопрос ${num}`;
      break;
    case "favorites":
      quiz.headerTitle.textContent = `Избранное, вопрос ${num}`;
      break;
    default:
      quiz.headerTitle.textContent = "";
  }
}

export function renderQuestionStrip() {
  const { quiz } = getDom();
  const strip = quiz.questionStrip;
  strip.innerHTML = "";

  state.currentQuestions.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "q-dot";
    dot.dataset.action = "goToQuestion";
    dot.dataset.index = i;

    if (i === state.currentIndex) {
      dot.classList.add("current");
    } else if (state.answers[i] !== null) {
      dot.classList.add(state.answers[i].correct ? "correct" : "wrong");
    }

    dot.textContent = i + 1;
    strip.appendChild(dot);
  });

  const cur = strip.children[state.currentIndex];
  if (cur) {
    cur.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }
}

export function goToQuestion(index) {
  if (state.answers[index] !== null || index === state.currentIndex) {
    state.currentIndex = index;
    renderQuestionStrip();
    renderQuestion();
  }
}

export function renderQuestion() {
  const { quiz } = getDom();
  const q = state.currentQuestions[state.currentIndex];
  const alreadyAnswered = state.answers[state.currentIndex] !== null;

  updateQuizHeader();
  updateFavoriteToggle();

  quiz.questionText.textContent = q.question;

  quiz.explanationCorrect.textContent = `Правильный ответ: ${q.correct + 1}`;
  quiz.explanationText.textContent = q.explanation;

  quiz.options.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.dataset.action = "selectAnswer";
    btn.dataset.index = i;
    btn.textContent = `${i + 1}.  ${opt}`;

    if (alreadyAnswered) {
      btn.classList.add("disabled");
      btn.disabled = true;
      if (i === q.correct) {
        btn.classList.add("correct");
      }
      if (i === state.answers[state.currentIndex].selectedIndex && !state.answers[state.currentIndex].correct) {
        btn.classList.add("wrong");
      }
    }

    quiz.options.appendChild(btn);
  });

  quiz.explanation.classList.toggle("visible", alreadyAnswered);
  quiz.nextWrap.classList.toggle("visible", alreadyAnswered);

  const nextBtn =
    quiz.nextWrap.querySelector('[data-action="nextQuestion"]') || quiz.nextWrap.querySelector(".btn");
  const isLast = state.currentIndex >= state.currentQuestions.length - 1;
  if (isLast && alreadyAnswered) {
    const firstUnanswered = state.answers.findIndex((a) => a === null);
    nextBtn.textContent = firstUnanswered === -1 ? "РЕЗУЛЬТАТЫ" : "СЛЕДУЮЩИЙ ВОПРОС";
  } else {
    nextBtn.textContent = "СЛЕДУЮЩИЙ ВОПРОС";
  }
}

export function updateFavoriteToggle() {
  const q = state.currentQuestions[state.currentIndex];
  const key = questionKey(q);
  const isFav = getFavorites().has(key);
  const { quiz } = getDom();
  const toggle = quiz.favoriteToggle;

  toggle.className = `favorite-toggle${isFav ? " active" : ""}`;
  toggle.querySelector(".fav-icon").innerHTML = isFav ? "&#11088;" : "&#9734;";
  toggle.querySelector(".fav-text").textContent = isFav ? "УБРАТЬ ИЗ ИЗБРАННОГО" : "ДОБАВИТЬ В ИЗБРАННОЕ";
}
