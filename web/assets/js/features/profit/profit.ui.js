/**
 * Profit & margin calculator — DOM wiring and rendering.
 */

import { fmtCurrency, getCurrency, t } from "../../core/i18n.js";
import { formatPercent } from "../../core/format.js";
import { parseOptionalNumber } from "../../shared/parse-number.js";
import { calcProfitFromPrices, calcSellingPriceForMargin } from "./profit.logic.js";

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function render() {
  const { symbol } = getCurrency();
  document.querySelectorAll("[data-currency-prefix]").forEach((el) => {
    el.textContent = symbol;
  });

  const cost = parseOptionalNumber(
    document.querySelector(".profit-cost-input")?.value,
  );
  const sellingPrice = parseOptionalNumber(
    document.getElementById("profit-selling")?.value,
  );
  const desiredMargin = parseOptionalNumber(
    document.getElementById("profit-margin")?.value,
  );

  const m1 = calcProfitFromPrices(cost, sellingPrice);
  const profitEl = document.getElementById("profit-result-profit");
  if (profitEl) {
    profitEl.textContent =
      m1.profit !== null ? fmtCurrency(m1.profit) : fmtCurrency(0);
    profitEl.classList.toggle("is-negative", m1.profit !== null && m1.profit < 0);
  }

  setText(
    "profit-result-margin",
    m1.margin !== null ? formatPercent(m1.margin) : "0%",
  );
  setText(
    "profit-result-markup",
    m1.markup !== null ? formatPercent(m1.markup) : "0%",
  );

  const m2 = calcSellingPriceForMargin(cost, desiredMargin);
  setText(
    "profit-result-required-price",
    m2.sellingPrice !== null ? fmtCurrency(m2.sellingPrice) : fmtCurrency(0),
  );
  setText(
    "profit-result-profit-amount",
    m2.profit !== null ? fmtCurrency(m2.profit) : fmtCurrency(0),
  );
  setText(
    "profit-result-cost-base",
    cost !== null ? fmtCurrency(cost) : fmtCurrency(0),
  );
}

function mount() {
  document.querySelectorAll("#profit-tool input").forEach((input) => {
    input.addEventListener("input", (event) => {
      if (event.target.classList.contains("profit-cost-input")) {
        document.querySelectorAll(".profit-cost-input").forEach((other) => {
          if (other !== event.target) other.value = event.target.value;
        });
      }
      render();
    });
  });
  document.addEventListener("langchange", render);
  render();
}

mount();
