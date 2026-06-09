/**
 * Shopping calculator constants — unit conversions and display order.
 */

/** Grams per ounce (avoirdupois). */
export const OZ_TO_GRAMS = 28.3495;

/** Grams per pound (avoirdupois). */
export const LB_TO_GRAMS = 453.592;

/** Millilitres per litre. */
export const ML_PER_LITRE = 1000;

/** Grams per kilogram. */
export const GRAMS_PER_KG = 1000;

/** Supported quantity units and how they convert to a base unit. */
export const UNIT_MULTIPLIERS = {
  pcs: { base: "pcs", multiplier: 1 },
  ml: { base: "ml", multiplier: 1 },
  L: { base: "ml", multiplier: ML_PER_LITRE },
  g: { base: "g", multiplier: 1 },
  kg: { base: "g", multiplier: GRAMS_PER_KG },
  oz: { base: "g", multiplier: OZ_TO_GRAMS },
  lb: { base: "g", multiplier: LB_TO_GRAMS },
};

/** Dropdown display order for unit selectors. */
export const UNIT_ORDER = ["pcs", "ml", "L", "g", "kg", "oz", "lb"];
