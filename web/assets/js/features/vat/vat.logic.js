/**
 * VAT calculator — pure business logic (no DOM).
 */

/** Add VAT to a net price. */
export function addVat(netPrice, vatRatePercent) {
  if (typeof netPrice !== "number" || typeof vatRatePercent !== "number") {
    return { vatAmount: null, gross: null };
  }
  const vatAmount = netPrice * (vatRatePercent / 100);
  return { vatAmount, gross: netPrice + vatAmount };
}

/** Extract VAT from a gross price. */
export function extractVat(grossPrice, vatRatePercent) {
  if (typeof grossPrice !== "number" || typeof vatRatePercent !== "number") {
    return { net: null, vatAmount: null };
  }
  const net = grossPrice / (1 + vatRatePercent / 100);
  return { net, vatAmount: grossPrice - net };
}
