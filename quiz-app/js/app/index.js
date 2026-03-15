import { bindGlobalEvents } from "./events.js";
import { initTheme } from "./theme.js";
import { updateHomeCounters } from "./ui/home.js";

export function initApp() {
  initTheme();
  bindGlobalEvents();
  updateHomeCounters();
}
