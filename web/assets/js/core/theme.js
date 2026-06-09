/**
 * Dark / light theme toggle with localStorage persistence.
 */

import { THEME_STORAGE_KEY } from "../config/constants.js";

function readStoredTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/** Returns "dark" or "light". */
export function getTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/** Toggle theme and persist the choice. */
export function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, next);
  applyTheme(next);
  document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
  return next;
}

/** Apply saved or system theme on startup. */
export function initTheme() {
  applyTheme(readStoredTheme());
}
