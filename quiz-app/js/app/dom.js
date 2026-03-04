export const SCREEN_IDS = [
  "homeScreen",
  "ticketsScreen",
  "topicsScreen",
  "marathonScreen",
  "errorsScreen",
  "favoritesScreen",
  "quizScreen",
  "resultsScreen",
];

let cached = null;

export function getDom() {
  if (cached) {
    return cached;
  }

  const screens = {};
  SCREEN_IDS.forEach((id) => {
    screens[id] = document.getElementById(id);
  });

  cached = {
    screens,
    counters: {
      questions: document.getElementById("counterQuestions"),
      questionsTotal: document.getElementById("counterQuestionsTotal"),
      tickets: document.getElementById("counterTickets"),
      ticketsTotal: document.getElementById("counterTicketsTotal"),
      topics: document.getElementById("counterTopics"),
      topicsTotal: document.getElementById("counterTopicsTotal"),
    },
    bars: {
      questions: document.getElementById("barQuestions"),
      tickets: document.getElementById("barTickets"),
      topics: document.getElementById("barTopics"),
    },
    lists: {
      ticketList: document.getElementById("ticketList"),
      topicList: document.getElementById("topicList"),
      errorsContent: document.getElementById("errorsContent"),
      favoritesContent: document.getElementById("favoritesContent"),
    },
    marathonTotal: document.getElementById("marathonTotal"),
    quiz: {
      backButton: document.getElementById("quizBackBtn"),
      headerTitle: document.getElementById("quizHeaderTitle"),
      timer: document.getElementById("quizTimer"),
      questionStrip: document.getElementById("questionStrip"),
      questionText: document.getElementById("qText"),
      options: document.getElementById("qOptions"),
      favoriteToggle: document.getElementById("favoriteToggle"),
      explanation: document.getElementById("qExplanation"),
      explanationCorrect: document.getElementById("explanationCorrect"),
      explanationText: document.getElementById("explanationText"),
      nextWrap: document.getElementById("nextWrap"),
    },
    results: {
      scoreCircle: document.getElementById("scoreCircle"),
      scoreNumber: document.getElementById("scoreNumber"),
      scoreLabel: document.getElementById("scoreLabel"),
      categoryResults: document.getElementById("categoryResults"),
    },
    modals: {
      resumeModal: document.getElementById("resumeModal"),
      resumeModalText: document.getElementById("resumeModalText"),
      exitModal: document.getElementById("exitModal"),
    },
  };

  return cached;
}
