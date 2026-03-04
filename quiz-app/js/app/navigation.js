import { ALL_QUESTIONS } from "../questions.js";
import { getDom, SCREEN_IDS } from "./dom.js";
import { stopTimer } from "./quiz/timer.js";
import { renderErrorsContent } from "./ui/errors.js";
import { renderFavoritesContent } from "./ui/favorites.js";
import { updateHomeCounters } from "./ui/home.js";
import { renderTicketList } from "./ui/tickets.js";
import { renderTopicList } from "./ui/topics.js";

export function showScreen(screenId) {
  const { screens } = getDom();
  SCREEN_IDS.forEach((id) => {
    screens[id].classList.toggle("hidden", id !== screenId);
  });
  window.scrollTo(0, 0);
}

export function showHome() {
  stopTimer();
  showScreen("homeScreen");
  updateHomeCounters();
}

export function showTicketsScreen() {
  showScreen("ticketsScreen");
  renderTicketList();
}

export function showTopicsScreen() {
  showScreen("topicsScreen");
  renderTopicList();
}

export function showMarathonScreen() {
  showScreen("marathonScreen");
  const { marathonTotal } = getDom();
  marathonTotal.textContent = ALL_QUESTIONS.length;
}

export function showErrorsScreen() {
  showScreen("errorsScreen");
  renderErrorsContent();
}

export function showFavoritesScreen() {
  showScreen("favoritesScreen");
  renderFavoritesContent();
}
