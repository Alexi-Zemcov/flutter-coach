import { getDom } from "../dom.js";
import { getErrorQuestions } from "../storage.js";

export function renderErrorsContent() {
  const { lists } = getDom();
  const container = lists.errorsContent;
  const errorQs = getErrorQuestions();

  if (errorQs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Ошибок пока нет!<br>Начни тренировку</p>
        <button class="btn btn-primary" data-action="showHome">На главную</button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <p class="error-count">${errorQs.length} вопросов с ошибками</p>
      <div style="text-align:center">
        <button class="btn btn-primary" data-action="startErrorsQuiz">Работа над ошибками</button>
      </div>
    `;
  }
}
