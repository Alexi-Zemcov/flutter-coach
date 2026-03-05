import { getDom } from "./dom.js";
import {
  showErrorsScreen,
  showFavoritesScreen,
  showHome,
  showMarathonScreen,
  showTicketsScreen,
  showTopicsScreen,
  showScreen,
} from "./navigation.js";
import { state } from "./state.js";
import {
  closeExitModal,
  confirmExit,
  confirmRestart,
  confirmResume,
  nextQuestion,
  openExitModal,
  retryCurrentMode,
  selectAnswer,
  startBlitz,
  startErrorsQuiz,
  startFavoritesQuiz,
  startMarathon,
  startTicketQuiz,
  startTopicQuiz,
  toggleCurrentFavorite,
} from "./quiz/flow.js";
import { goToQuestion, renderQuestion, renderQuestionStrip } from "./ui/quiz.js";

const ACTION_HANDLERS = {
  showHome,
  showTicketsScreen,
  showTopicsScreen,
  showMarathonScreen,
  showErrorsScreen,
  showFavoritesScreen,
  startBlitz,
  startMarathon,
  startErrorsQuiz,
  startFavoritesQuiz,
  nextQuestion,
  retryCurrentMode,
  confirmResume,
  confirmRestart,
  closeExitModal,
  confirmExit,
  openExitModal,
  toggleFavorite: () => toggleCurrentFavorite(),
  startTicketQuiz: (el) => startTicketQuiz(Number(el.dataset.ticketId)),
  startTopicQuiz: (el) => startTopicQuiz(el.dataset.topicName),
  goToQuestion: (el) => goToQuestion(Number(el.dataset.index)),
  selectAnswer: (el) => {
    if (el.classList.contains("disabled")) {
      return;
    }
    selectAnswer(Number(el.dataset.index));
  },
};

function onPopState() {
  if (state.exitingQuiz) {
    state.exitingQuiz = false;
    return;
  }
  const { screens, modals } = getDom();
  const isQuizVisible = !screens.quizScreen.classList.contains("hidden");
  const isResultsVisible = !screens.resultsScreen.classList.contains("hidden");
  const isExitModalOpen = !modals.exitModal.classList.contains("hidden");

  if (isExitModalOpen) {
    closeExitModal();
    history.pushState({ screen: "quiz" }, "", location.href);
    return;
  }
  if (isQuizVisible) {
    openExitModal();
    history.pushState({ screen: "quiz" }, "", location.href);
    return;
  }
  if (isResultsVisible && history.state?.screen === "quiz") {
    showScreen("quizScreen");
    renderQuestionStrip();
    renderQuestion();
  }
}

export function bindGlobalEvents() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }
    const action = target.dataset.action;
    const handler = ACTION_HANDLERS[action];
    if (!handler) {
      return;
    }
    handler(target, event);
  });
  window.addEventListener("popstate", (event) => {
    onPopState(event);
  });
}
