/**
 * Discount calculator — DOM wiring and rendering.
 */

import { fmtCurrency, getCurrency, t } from "../../core/i18n.js";
import { formatPercent } from "../../core/format.js";
import { parseOptionalNumber } from "../../shared/parse-number.js";
import {
  calcDiscountPercent,
  calcFinalPrice,
  calcOriginalPrice,
} from "./discount.logic.js";

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function render() {
  const labels = t().discount;
  const { symbol } = getCurrency();

  document.querySelectorAll("[data-currency-prefix]").forEach((el) => {
    el.textContent = symbol;
  });

  const originalPrice = parseOptionalNumber(
    document.getElementById("discount-original")?.value,
  );
  const discountPercent =
    parseOptionalNumber(document.getElementById("discount-percent")?.value) ??
    parseOptionalNumber(document.getElementById("discount-percent-reverse")?.value);
  const finalPriceInput = parseOptionalNumber(
    document.getElementById("discount-final-reverse")?.value,
  );
  const origForPct = parseOptionalNumber(
    document.getElementById("discount-orig-pct")?.value,
  );
  const finalForPct = parseOptionalNumber(
    document.getElementById("discount-final-pct")?.value,
  );

  const tab1 = calcFinalPrice(originalPrice, discountPercent);
  setText(
    "discount-result-final",
    tab1.finalPrice !== null ? fmtCurrency(tab1.finalPrice) : fmtCurrency(0),
  );
  setText(
    "discount-result-save",
    tab1.savings !== null ? fmtCurrency(tab1.savings) : fmtCurrency(0),
  );

  const tab2 = calcOriginalPrice(finalPriceInput, discountPercent);
  setText(
    "discount-result-original",
    tab2.original !== null ? fmtCurrency(tab2.original) : fmtCurrency(0),
  );
  setText(
    "discount-result-save-reverse",
    tab2.savings !== null ? fmtCurrency(tab2.savings) : fmtCurrency(0),
  );

  const tab3 = calcDiscountPercent(origForPct, finalForPct);
  const pctPanel = document.getElementById("discount-pct-hint");
  if (tab3.discountPercent !== null) {
    setText("discount-result-rate", formatPercent(tab3.discountPercent));
    setText("discount-result-amount-saved", fmtCurrency(tab3.amountSaved));
    if (pctPanel) pctPanel.hidden = true;
  } else {
    setText("discount-result-rate", "0%");
    setText("discount-result-amount-saved", fmtCurrency(0));
    if (pctPanel) pctPanel.hidden = false;
  }
}

function mount() {
  document.querySelectorAll("#discount-tool input").forEach((input) => {
    input.addEventListener("input", render);
  });
  document.addEventListener("langchange", render);
  render();
}

mount();
