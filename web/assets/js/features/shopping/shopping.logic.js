/**
 * Shopping comparison — pure business logic (no DOM).
 */

import { UNIT_MULTIPLIERS } from "./shopping.constants.js";
import { formatCurrency } from "../../core/format.js";

/**
 * @typedef {{ id: string, price: number|null, quantity: number|null, unit: string }} ShoppingItem
 */

function displayBaseUnit(base, lang) {
  if (base === "pcs" && lang === "th") return "ชิ้น";
  return base;
}

/**
 * Analyze items and mark the best value per base unit.
 * @param {ShoppingItem[]} items
 * @param {string} currency
 * @param {string} lang
 */
export function analyzeShoppingItems(items, currency, lang) {
  const validItems = items.filter(
    (item) =>
      typeof item.price === "number" &&
      typeof item.quantity === "number" &&
      item.price > 0 &&
      item.quantity > 0,
  );

  const calculated = validItems.map((item) => {
    const { base, multiplier } = UNIT_MULTIPLIERS[item.unit];
    const baseQuantity = item.quantity * multiplier;
    const costPerUnit = item.price / baseQuantity;
    const baseLabel = displayBaseUnit(base, lang);

    return {
      ...item,
      baseQuantity,
      baseUnit: base,
      costPerUnit,
      costLabel: `${formatCurrency(costPerUnit, currency)} / 1 ${baseLabel}`,
    };
  });

  const sorted = [...calculated].sort((a, b) => a.costPerUnit - b.costPerUnit);

  return items.map((item) => {
    const calcInfo = sorted.find((entry) => entry.id === item.id);
    return {
      ...item,
      calcInfo,
      isBest: sorted.length > 1 && sorted[0].id === item.id && calcInfo !== undefined,
    };
  });
}

/**
 * Build a summary comparing best vs worst valid items.
 * @returns {{ bestIndex: number, bestLabel: string, pct: string } | null}
 */
export function buildShoppingSummary(analyzedItems, itemLabelPrefix) {
  const valid = analyzedItems.filter((item) => item.calcInfo);
  const best = valid.find((item) => item.isBest);
  if (valid.length < 2 || !best) return null;

  const worst = [...valid].sort(
    (a, b) => b.calcInfo.costPerUnit - a.calcInfo.costPerUnit,
  )[0];

  const pct = (
    ((worst.calcInfo.costPerUnit - best.calcInfo.costPerUnit) /
      worst.calcInfo.costPerUnit) *
    100
  ).toFixed(1);

  const bestIndex = analyzedItems.indexOf(best) + 1;

  return {
    bestIndex,
    bestLabel: `${itemLabelPrefix} ${bestIndex}`,
    bestCostLabel: best.calcInfo.costLabel,
    pct,
  };
}
