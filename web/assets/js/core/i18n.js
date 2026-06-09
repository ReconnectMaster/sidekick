/**
 * Language state and translation lookup.
 * Dispatches "langchange" on document when the language changes.
 */

import en from "../../../locales/en.js";
import th from "../../../locales/th.js";
import {
  CURRENCY_BY_LANG,
  DEFAULT_LANG,
  LANG_STORAGE_KEY,
} from "../config/constants.js";
import { formatCurrency } from "./format.js";

const translations = { en, th };

let currentLang = DEFAULT_LANG;

function readStoredLang() {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  return stored === "th" ? "th" : "en";
}

/** Current language code ("en" or "th"). */
export function getLang() {
  return currentLang;
}

/** Active translation object for the current language. */
export function t() {
  return translations[currentLang];
}

/** Currency metadata for the active language. */
export function getCurrency() {
  return CURRENCY_BY_LANG[currentLang];
}

/** Format an amount using the active language's currency. */
export function fmtCurrency(amount) {
  const { code } = getCurrency();
  return formatCurrency(amount, code);
}

/** Switch language, persist preference, and notify listeners. */
export function setLang(lang) {
  currentLang = lang === "th" ? "th" : "en";
  localStorage.setItem(LANG_STORAGE_KEY, currentLang);
  document.documentElement.lang = currentLang;
  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: currentLang } }));
}

/** Load saved language on startup. */
export function initI18n() {
  currentLang = readStoredLang();
  document.documentElement.lang = currentLang;
}
