import homeScreen from "../../partials/home.html?raw";
import ticketsScreen from "../../partials/tickets.html?raw";
import topicsScreen from "../../partials/topics.html?raw";
import marathonScreen from "../../partials/marathon.html?raw";
import errorsScreen from "../../partials/errors.html?raw";
import favoritesScreen from "../../partials/favorites.html?raw";
import quizScreen from "../../partials/quiz.html?raw";
import resultsScreen from "../../partials/results.html?raw";
import modals from "../../partials/modals.html?raw";

const SCREEN_MARKUP = [
  homeScreen,
  ticketsScreen,
  topicsScreen,
  marathonScreen,
  errorsScreen,
  favoritesScreen,
  quizScreen,
  resultsScreen,
  modals,
].join("\n");

export function composeScreens() {
  const container = document.getElementById("app");
  if (!container) {
    throw new Error("Missing #app container for screen composition.");
  }
  container.innerHTML = SCREEN_MARKUP;
  return container;
}
