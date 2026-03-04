import { TICKETS } from "../data.js";
import { getDom } from "../dom.js";
import { getQuizStats, questionKey } from "../storage.js";

export function renderTicketList() {
  const stats = getQuizStats();
  const { lists } = getDom();
  const container = lists.ticketList;
  container.innerHTML = "";

  TICKETS.forEach((ticket) => {
    const correctCount = ticket.questions.filter((q) => {
      const s = stats[questionKey(q)];
      return s && s.correct > 0;
    }).length;

    const total = ticket.questions.length;
    const allDone = correctCount === total;
    const pct = (correctCount / total) * 100;

    const card = document.createElement("div");
    card.className = `ticket-card${allDone ? " completed" : ""}`;
    card.dataset.action = "startTicketQuiz";
    card.dataset.ticketId = ticket.id;
    card.innerHTML = `
      <div class="ticket-number">${ticket.id}</div>
      <div class="ticket-info">
        <div class="ticket-status">${correctCount} / ${total}</div>
        <div class="ticket-progress">
          <div class="ticket-progress-fill" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}
