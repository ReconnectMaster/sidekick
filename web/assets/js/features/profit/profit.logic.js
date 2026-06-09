/**
 * Profit & margin calculator — pure business logic (no DOM).
 */

/** Maximum margin percent allowed for target-margin mode. */
export const MAX_MARGIN_PERCENT = 100;

/** Calculate profit, margin, and markup from cost and selling price. */
export function calcProfitFromPrices(cost, sellingPrice) {
  if (typeof cost !== "number" || typeof sellingPrice !== "number") {
    return { profit: null, margin: null, markup: null };
  }
  const profit = sellingPrice - cost;
  const margin = sellingPrice ? (profit / sellingPrice) * 100 : null;
  const markup = cost ? (profit / cost) * 100 : null;
  return { profit, margin, markup };
}

/** Calculate required selling price for a target margin. */
export function calcSellingPriceForMargin(cost, desiredMarginPercent) {
  if (
    typeof cost !== "number" ||
    typeof desiredMarginPercent !== "number" ||
    desiredMarginPercent >= MAX_MARGIN_PERCENT
  ) {
    return { sellingPrice: null, profit: null };
  }
  const sellingPrice = cost / (1 - desiredMarginPercent / 100);
  return { sellingPrice, profit: sellingPrice - cost };
}
