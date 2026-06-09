/**
 * Word count tool — DOM wiring and rendering.
 */

import { t } from "../../core/i18n.js";
import { analyzeText, estimateReadingMinutes } from "./word-count.logic.js";

const STAT_KEYS = [
  "words",
  "chars",
  "charsNoSp",
  "sentences",
  "paragraphs",
  "lines",
];

function render() {
  const textarea = document.getElementById("word-count-text");
  if (!textarea) return;

  const labels = t().wordCount;
  const stats = analyzeText(textarea.value);

  STAT_KEYS.forEach((key) => {
    const el = document.getElementById(`word-stat-${key}`);
    if (el) el.textContent = stats[key].toLocaleString();
  });

  const readingBox = document.getElementById("word-reading-time");
  if (!readingBox) return;

  if (stats.words > 0) {
    const mins = estimateReadingMinutes(stats.words);
    readingBox.hidden = false;
    readingBox.querySelector("[data-reading-value]").textContent = String(mins);
    readingBox.querySelector("[data-reading-unit]").textContent =
      mins === 1 ? labels.min : labels.mins;
  } else {
    readingBox.hidden = true;
  }
}

function mount() {
  const textarea = document.getElementById("word-count-text");
  const clearBtn = document.getElementById("word-count-clear");
  if (!textarea) return;

  textarea.addEventListener("input", render);
  clearBtn?.addEventListener("click", () => {
    textarea.value = "";
    render();
  });
  document.addEventListener("langchange", render);
  render();
}

mount();
