import { ALL_QUESTIONS } from "../../questions.js";
import { TICKETS, TOPICS } from "../data.js";
import { getDom } from "../dom.js";
import { getQuizStats, questionKey } from "../storage.js";

export function updateHomeCounters() {
  const stats = getQuizStats();
  const totalQ = ALL_QUESTIONS.length;
  const totalT = TICKETS.length;
  const totalTopics = TOPICS.length;

  const doneQ = ALL_QUESTIONS.filter((q) => {
    const s = stats[questionKey(q)];
    return s && s.correct > 0;
  }).length;

  const doneT = TICKETS.filter((t) =>
    t.questions.every((q) => {
      const s = stats[questionKey(q)];
      return s && s.correct > 0;
    })
  ).length;

  const doneTopics = TOPICS.filter((t) =>
    t.questions.every((q) => {
      const s = stats[questionKey(q)];
      return s && s.correct > 0;
    })
  ).length;

  const { counters, bars } = getDom();
  counters.questions.textContent = doneQ;
  counters.questionsTotal.textContent = totalQ;
  bars.questions.style.width = `${(doneQ / totalQ) * 100}%`;

  counters.tickets.textContent = doneT;
  counters.ticketsTotal.textContent = totalT;
  bars.tickets.style.width = `${(doneT / totalT) * 100}%`;

  counters.topics.textContent = doneTopics;
  counters.topicsTotal.textContent = totalTopics;
  bars.topics.style.width = `${(doneTopics / totalTopics) * 100}%`;
}
