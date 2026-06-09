/**
 * App-wide constants shared across tools.
 * Keep tool-specific numbers in each feature's own constants file.
 */

/** Default UI language when nothing is stored in localStorage. */
export const DEFAULT_LANG = "en";

/** localStorage key for language preference. */
export const LANG_STORAGE_KEY = "calc-hub-lang";

/** localStorage key for dark mode preference. */
export const THEME_STORAGE_KEY = "calc-hub-theme";

/** Site brand name shown in the sidebar and mobile header. */
export const APP_NAME = "Calc Hub";

/** Currency codes per language (used by format.js). */
export const CURRENCY_BY_LANG = {
  en: { code: "USD", symbol: "$" },
  th: { code: "THB", symbol: "฿" },
};

/** Minimum number of shopping rows the UI must keep visible. */
export const SHOPPING_MIN_ROWS = 1;

/** Initial shopping comparison rows when the page loads. */
export const SHOPPING_INITIAL_ROW_COUNT = 2;
