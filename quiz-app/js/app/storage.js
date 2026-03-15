import { ALL_QUESTIONS } from "../questions.js";
import { state } from "./state.js";

const STORAGE_KEY = "flutterQuizStats";
const FAVORITES_KEY = "flutterQuizFavorites";
const SESSION_KEY = "flutterQuizSession";
const THEME_KEY = "flutterQuizTheme";
const ALLOWED_THEMES = new Set(["dark", "white", "black"]);
const LEGACY_THEME_MAP = {
  default: "dark",
  "white-contrast": "white",
  "black-contrast": "black",
};

export function getQuizStats() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveQuizStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {}
}

export function questionKey(q) {
  return `${q.category}|${q.question}`;
}

export function getFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

export function saveFavorites(favSet) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favSet]));
}

export function toggleFavorite(qKey) {
  const favs = getFavorites();
  if (favs.has(qKey)) {
    favs.delete(qKey);
  } else {
    favs.add(qKey);
  }
  saveFavorites(favs);
  return favs.has(qKey);
}

export function saveSession() {
  if (state.currentMode !== "ticket") {
    return;
  }
  try {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        mode: state.currentMode,
        context: state.currentModeContext,
        currentQuestions: state.currentQuestions,
        answers: state.answers,
        currentIndex: state.currentIndex,
      })
    );
  } catch {}
}

export function loadSession(ticketId) {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!session || session.mode !== "ticket" || session.context.ticketId !== ticketId) {
      return null;
    }
    const answered = session.answers.filter((a) => a !== null).length;
    if (answered === 0 || answered >= session.currentQuestions.length) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getThemePreference() {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (!savedTheme) {
      return "dark";
    }
    const normalizedTheme = LEGACY_THEME_MAP[savedTheme] || savedTheme;
    if (!ALLOWED_THEMES.has(normalizedTheme)) {
      return "dark";
    }
    return normalizedTheme;
  } catch {
    return "dark";
  }
}

export function saveThemePreference(theme) {
  if (!ALLOWED_THEMES.has(theme)) {
    return;
  }
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

export function getErrorQuestions() {
  const stats = getQuizStats();
  return ALL_QUESTIONS.filter((q) => {
    const s = stats[questionKey(q)];
    return s && s.total > s.correct;
  });
}
