/**
 * Gold calculator constants — purity, units, and tax defaults.
 */

/** Grams in one Thai baht-weight (บาท). */
export const BAHT_GRAMS = 15.244;

/** Thai VAT rate applied when "include VAT" is enabled. */
export const GOLD_VAT_RATE = 0.07;

/** Default making fee shown on first load (per baht-weight). */
export const GOLD_DEFAULT_MAKING_FEE = 500;

/** Salung subdivisions per baht-weight. */
export const SALUNG_PER_BAHT = 4;

/** Hun subdivisions per salung. */
export const HUN_PER_SALUNG = 4;

/** Gold types ordered for dropdown display. */
export const GOLD_TYPE_ORDER = ["thai965", "k24", "k22", "k18", "k14", "k9"];

/** Purity fraction per gold type (0–1). */
export const GOLD_PURITY = {
  thai965: 0.965,
  k24: 0.999,
  k22: 0.917,
  k18: 0.75,
  k14: 0.583,
  k9: 0.375,
};
