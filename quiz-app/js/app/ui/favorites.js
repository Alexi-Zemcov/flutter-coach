import { ALL_QUESTIONS } from "../../questions.js";
import { getDom } from "../dom.js";
import { getFavorites, questionKey } from "../storage.js";

export function renderFavoritesContent() {
  const { lists } = getDom();
  const container = lists.favoritesContent;
  const favs = getFavorites();
  const favQs = ALL_QUESTIONS.filter((q) => favs.has(questionKey(q)));

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
        <button class="btn btn-primary" data-action="startFavoritesQuiz">Начать</button>
      </div>
    `;
  }
}
