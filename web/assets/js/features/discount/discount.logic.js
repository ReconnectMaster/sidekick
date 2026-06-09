/**
 * Discount calculator — pure business logic (no DOM).
 */

/** Tab 1: original price + discount % → final price and savings. */
export function calcFinalPrice(originalPrice, discountPercent) {
  if (typeof originalPrice !== "number" || typeof discountPercent !== "number") {
    return { savings: null, finalPrice: null };
  }
  const savings = originalPrice * (discountPercent / 100);
  return { savings, finalPrice: originalPrice - savings };
}

/** Tab 2: final price + discount % → original price and savings. */
export function calcOriginalPrice(finalPrice, discountPercent) {
  if (
    typeof finalPrice !== "number" ||
    typeof discountPercent !== "number" ||
    discountPercent >= 100
  ) {
    return { original: null, savings: null };
  }
  const original = finalPrice / (1 - discountPercent / 100);
  return { original, savings: original - finalPrice };
}

/** Tab 3: original + final price → discount % and amount saved. */
export function calcDiscountPercent(originalPrice, finalPrice) {
  const valid =
    typeof originalPrice === "number" &&
    typeof finalPrice === "number" &&
    originalPrice > 0 &&
    finalPrice >= 0 &&
    finalPrice <= originalPrice;

  if (!valid) {
    return { discountPercent: null, amountSaved: null };
  }

  const amountSaved = originalPrice - finalPrice;
  const discountPercent = (amountSaved / originalPrice) * 100;
  return { discountPercent, amountSaved };
}
