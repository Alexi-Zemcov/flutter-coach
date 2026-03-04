import { getDom } from "../dom.js";
import { state } from "../state.js";

export function startTimer(onTimeUp) {
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    state.timerSeconds--;
    updateTimerDisplay();
    if (state.timerSeconds <= 0) {
      stopTimer();
      if (onTimeUp) {
        onTimeUp();
      }
    }
  }, 1000);
}

export function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  const { quiz } = getDom();
  quiz.timer.textContent = "";
}

export function updateTimerDisplay() {
  const min = Math.floor(state.timerSeconds / 60);
  const sec = state.timerSeconds % 60;
  const { quiz } = getDom();
  const el = quiz.timer;
  el.textContent = `\u23F1 ${min}:${sec.toString().padStart(2, "0")}`;
  el.style.color = state.timerSeconds < 60 ? "#f44336" : "#ccc";
}
