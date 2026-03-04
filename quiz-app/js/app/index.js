import { bindGlobalEvents } from "./events.js";
import { updateHomeCounters } from "./ui/home.js";

export function initApp() {
  bindGlobalEvents();
  updateHomeCounters();
}
