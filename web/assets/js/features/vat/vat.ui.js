/**
 * VAT calculator — DOM wiring and rendering.
 */

import { fmtCurrency, getCurrency, t } from "../../core/i18n.js";
import { parseOptionalNumber } from "../../shared/parse-number.js";
import { VAT_DEFAULT_RATE, VAT_PRESET_RATES } from "./vat.constants.js";
import { addVat, extractVat } from "./vat.logic.js";

let vatRate = VAT_DEFAULT_RATE;

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderRateButtons() {
  const container = document.getElementById("vat-rate-buttons");
  if (!container) return;
  container.replaceChildren();

  VAT_PRESET_RATES.forEach((rate) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `chip ${vatRate === rate ? "is-active" : ""}`;
    btn.textContent = `${rate}%`;
    btn.addEventListener("click", () => {
      vatRate = rate;
      const input = document.getElementById("vat-rate-input");
      if (input) input.value = String(rate);
      renderRateButtons();
      render();
    });
    container.appendChild(btn);
  });
}

function render() {
  const { symbol } = getCurrency();
  document.querySelectorAll("[data-currency-prefix]").forEach((el) => {
    el.textContent = symbol;
  });

  const rateInput = document.getElementById("vat-rate-input");
  if (rateInput) {
    const parsed = parseOptionalNumber(rateInput.value);
    if (parsed !== null) vatRate = parsed;
  }

  const netPrice = parseOptionalNumber(document.getElementById("vat-net")?.value);
  const grossPrice = parseOptionalNumber(document.getElementById("vat-gross")?.value);

  const added = addVat(netPrice, vatRate);
  setText(
    "vat-result-gross",
    added.gross !== null ? fmtCurrency(added.gross) : fmtCurrency(0),
  );
  setText(
    "vat-result-vat-add",
    added.vatAmount !== null ? `+${fmtCurrency(added.vatAmount)}` : fmtCurrency(0),
  );
  setText(
    "vat-result-net-base",
    netPrice !== null ? fmtCurrency(netPrice) : fmtCurrency(0),
  );

  const extracted = extractVat(grossPrice, vatRate);
  setText(
    "vat-result-net",
    extracted.net !== null ? fmtCurrency(extracted.net) : fmtCurrency(0),
  );
  setText(
    "vat-result-vat-extract",
    extracted.vatAmount !== null ? fmtCurrency(extracted.vatAmount) : fmtCurrency(0),
  );
  setText(
    "vat-result-gross-total",
    grossPrice !== null ? fmtCurrency(grossPrice) : fmtCurrency(0),
  );

  const rateInputEl = document.getElementById("vat-rate-input");
  if (rateInputEl) {
    rateInputEl.classList.toggle(
      "is-custom",
      !VAT_PRESET_RATES.includes(vatRate),
    );
  }
}

function mount() {
  const rateInput = document.getElementById("vat-rate-input");
  if (rateInput) rateInput.value = String(VAT_DEFAULT_RATE);

  renderRateButtons();

  document.querySelectorAll("#vat-tool input").forEach((input) => {
    input.addEventListener("input", render);
  });
  document.addEventListener("langchange", render);
  render();
}

mount();
