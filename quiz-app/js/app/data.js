import { ALL_QUESTIONS } from "../questions.js";

export const TICKETS_SIZE = 20;
export const BLITZ_SIZE = 20;
export const BLITZ_TIME = 20 * 60;

export const TICKETS = generateTickets(ALL_QUESTIONS);
export const TOPICS = generateTopics(ALL_QUESTIONS);

export function generateTickets(questions) {
  const tickets = [];
  for (let i = 0; i < questions.length; i += TICKETS_SIZE) {
    tickets.push({
      id: tickets.length + 1,
      questions: questions.slice(i, i + TICKETS_SIZE),
    });
  }
  return tickets;
}

export function generateTopics(questions) {
  const map = new Map();
  questions.forEach((q) => {
    if (!map.has(q.category)) {
      map.set(q.category, []);
    }
    map.get(q.category).push(q);
  });
  return [...map.entries()].map(([name, qs], i) => ({
    id: i + 1,
    name,
    questions: qs,
  }));
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function shuffleOptions(questions) {
  return questions.map((q) => {
    const correctText = q.options[q.correct];
    const shuffled = shuffle(q.options);
    return { ...q, options: shuffled, correct: shuffled.indexOf(correctText) };
  });
}
