import {
  showErrorsScreen,
  showFavoritesScreen,
  showHome,
  showMarathonScreen,
  showTicketsScreen,
  showTopicsScreen,
} from "./navigation.js";
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
import { goToQuestion } from "./ui/quiz.js";

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
}
