import { getThemePreference, saveThemePreference } from "./storage.js";

export const THEMES = {
  DARK: "dark",
  WHITE: "white",
  BLACK: "black",
};

const THEME_ORDER = [THEMES.DARK, THEMES.WHITE, THEMES.BLACK];
const THEME_VALUES = new Set(Object.values(THEMES));
const THEME_ICON_MAP = {
  [THEMES.DARK]: "🌕",
  [THEMES.WHITE]: "☀️",
  [THEMES.BLACK]: "🌙",
};
const THEME_ICON_LABELS = {
  [THEMES.DARK]: "Theme: dark. Tap to switch theme",
  [THEMES.WHITE]: "Theme: white. Tap to switch theme",
  [THEMES.BLACK]: "Theme: black. Tap to switch theme",
};
const THEME_ICON_SELECTOR = "#themeIconSymbol";
const THEME_ICON_BUTTON_SELECTOR = '[data-action="cycleTheme"]';

function normalizeTheme(theme) {
  if (!theme || !THEME_VALUES.has(theme)) {
    return THEMES.DARK;
  }
  return theme;
}

function syncThemeIcon(activeTheme) {
  const icon = document.querySelector(THEME_ICON_SELECTOR);
  const button = document.querySelector(THEME_ICON_BUTTON_SELECTOR);
  if (icon) {
    icon.textContent = THEME_ICON_MAP[activeTheme];
  }
  if (button) {
    button.setAttribute("aria-label", THEME_ICON_LABELS[activeTheme]);
    button.setAttribute("title", THEME_ICON_LABELS[activeTheme]);
  }
}

export function getNextTheme(theme) {
  const activeTheme = normalizeTheme(theme);
  const currentIndex = THEME_ORDER.indexOf(activeTheme);
  const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
  return THEME_ORDER[nextIndex];
}

export function applyTheme(theme) {
  const normalizedTheme = normalizeTheme(theme);
  document.body.dataset.theme = normalizedTheme;
  syncThemeIcon(normalizedTheme);
  return normalizedTheme;
}

export function initTheme() {
  const savedTheme = getThemePreference();
  return applyTheme(savedTheme);
}

export function setTheme(theme) {
  const normalizedTheme = applyTheme(theme);
  saveThemePreference(normalizedTheme);
  return normalizedTheme;
}

export function cycleTheme() {
  const currentTheme = normalizeTheme(document.body.dataset.theme);
  const nextTheme = getNextTheme(currentTheme);
  return setTheme(nextTheme);
}
