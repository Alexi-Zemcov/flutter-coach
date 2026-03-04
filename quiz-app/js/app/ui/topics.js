import { TOPICS } from "../data.js";
import { getDom } from "../dom.js";
import { getQuizStats, questionKey } from "../storage.js";

export function renderTopicList() {
  const stats = getQuizStats();
  const { lists } = getDom();
  const container = lists.topicList;
  container.innerHTML = "";

  TOPICS.forEach((topic) => {
    const allCorrect = topic.questions.every((q) => {
      const s = stats[questionKey(q)];
      return s && s.correct > 0;
    });

    const card = document.createElement("div");
    card.className = `topic-card${allCorrect ? " completed" : ""}`;
    card.dataset.action = "startTopicQuiz";
    card.dataset.topicName = topic.name;
    card.innerHTML = `
      <div class="topic-name">${topic.id}. ${topic.name}</div>
      <div class="topic-count">${topic.questions.length} вопросов</div>
    `;
    container.appendChild(card);
  });
}
