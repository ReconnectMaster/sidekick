/**
 * Gold & jewelry calculator — DOM wiring and rendering.
 */

import { fmtCurrency, getCurrency, t } from "../../core/i18n.js";
import { formatNumber } from "../../core/format.js";
import { refreshI18nText } from "../../core/layout.js";
import { parseOptionalNumber } from "../../shared/parse-number.js";
import {
  GOLD_DEFAULT_MAKING_FEE,
  GOLD_TYPE_ORDER,
} from "./gold.constants.js";
import {
  buildGoldInsights,
  calcEffectiveRatePerGram,
  calcGoldBreakdown,
  convertGoldAmount,
  toThaiWeight,
} from "./gold.logic.js";

let mode = "buy";
let inputMode = "money";
let showAdvanced = false;

function readState() {
  return {
    goldPrice: parseOptionalNumber(document.getElementById("gold-price")?.value),
    goldType: document.getElementById("gold-type")?.value ?? "thai965",
    moneyInput: parseOptionalNumber(document.getElementById("gold-money")?.value),
    weightInput: parseOptionalNumber(document.getElementById("gold-weight")?.value),
    makingFee: parseOptionalNumber(document.getElementById("gold-making-fee")?.value),
    spread: parseOptionalNumber(document.getElementById("gold-spread")?.value),
    includeVat: document.getElementById("gold-include-vat")?.checked ?? false,
    mode,
    inputMode,
  };
}

function renderTypeOptions() {
  const select = document.getElementById("gold-type");
  if (!select) return;
  const labels = t().gold.types;
  const current = select.value;
  select.innerHTML = GOLD_TYPE_ORDER.map(
    (key) => `<option value="${key}">${labels[key]}</option>`,
  ).join("");
  select.value = current;
}

function render() {
  const labels = t().gold;
  const { symbol } = getCurrency();
  document.querySelectorAll("[data-currency-prefix]").forEach((el) => {
    el.textContent = symbol;
  });

  const state = readState();
  const effectiveRate = calcEffectiveRatePerGram(state);
  const converted = convertGoldAmount({ ...state, effectiveRate });

  const moneyField = document.getElementById("gold-money");
  const weightField = document.getElementById("gold-weight");
  const moneyBox = document.getElementById("gold-money-box");
  const weightBox = document.getElementById("gold-weight-box");

  moneyBox?.classList.toggle("is-active", state.inputMode === "money");
  weightBox?.classList.toggle("is-active", state.inputMode === "weight");

  if (state.inputMode === "weight" && converted.money !== null) {
    moneyField.value = formatNumber(converted.money, 2);
  } else if (state.inputMode === "money") {
    // keep user input
  }

  if (state.inputMode === "money" && converted.grams !== null) {
    weightField.value = formatNumber(converted.grams, 4);
  }

  const emptyState = document.getElementById("gold-empty");
  const results = document.getElementById("gold-results");
  if (!effectiveRate) {
    emptyState.hidden = false;
    results.hidden = true;
    return;
  }
  emptyState.hidden = true;

  const grams = converted.grams;
  const hasResult = grams !== null && converted.money !== null && grams > 0;
  if (!hasResult) {
    results.hidden = true;
    return;
  }

  results.hidden = false;
  const breakdown = calcGoldBreakdown({ ...state, grams });
  const thaiWeight = toThaiWeight(grams);

  const setRow = (id, value, show = true) => {
    const row = document.getElementById(id);
    if (row) row.hidden = !show;
    const val = document.querySelector(`#${id} [data-value]`);
    if (val) val.textContent = value;
  };

  setRow("gold-row-value", fmtCurrency(breakdown.goldValue));
  setRow(
    "gold-row-spread",
    fmtCurrency(breakdown.spreadAmt),
    breakdown.spreadAmt > 0,
  );
  setRow(
    "gold-row-making",
    fmtCurrency(breakdown.makingAmt),
    mode === "buy" && breakdown.makingAmt > 0,
  );
  setRow(
    "gold-row-vat",
    fmtCurrency(breakdown.vatAmt),
    breakdown.vatAmt > 0,
  );
  document.getElementById("gold-total").textContent = fmtCurrency(breakdown.total);

  const thaiCard = document.getElementById("gold-thai-weight");
  if (thaiCard) {
    const showThai =
      thaiWeight.baht > 0 || thaiWeight.salung > 0 || thaiWeight.hun > 0;
    thaiCard.hidden = !showThai;
    document.getElementById("gold-thai-baht").textContent = String(thaiWeight.baht);
    document.getElementById("gold-thai-salung").textContent = String(thaiWeight.salung);
    document.getElementById("gold-thai-hun").textContent = String(thaiWeight.hun);
    document.getElementById("gold-thai-baht-wrap").hidden = thaiWeight.baht <= 0;
    document.getElementById("gold-thai-salung-wrap").hidden = thaiWeight.salung <= 0;
    document.getElementById("gold-thai-hun-wrap").hidden = thaiWeight.hun <= 0;
  }

  const insightsEl = document.getElementById("gold-insights");
  if (insightsEl) {
    const insights = buildGoldInsights({
      mode,
      spread: state.spread,
      makingFee: state.makingFee,
      breakdown,
      thaiWeight,
      labels,
    });
    insightsEl.innerHTML = insights
      .map((line) => `<div class="insight">✦ ${line}</div>`)
      .join("");
    insightsEl.hidden = insights.length === 0;
  }

  const advancedPanel = document.getElementById("gold-advanced-panel");
  const advancedToggle = document.getElementById("gold-advanced-toggle");
  if (advancedPanel) advancedPanel.hidden = mode !== "buy";
  if (advancedToggle) advancedToggle.hidden = mode !== "buy";
}

function mount() {
  const makingFee = document.getElementById("gold-making-fee");
  if (makingFee) makingFee.value = String(GOLD_DEFAULT_MAKING_FEE);

  renderTypeOptions();

  document.querySelectorAll("[data-gold-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      mode = btn.dataset.goldMode;
      document.querySelectorAll("[data-gold-mode]").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      render();
    });
  });

  document.getElementById("gold-money")?.addEventListener("input", (event) => {
    inputMode = "money";
    event.target.value = event.target.value;
    render();
  });

  document.getElementById("gold-weight")?.addEventListener("input", (event) => {
    inputMode = "weight";
    event.target.value = event.target.value;
    render();
  });

  ["gold-price", "gold-type", "gold-making-fee", "gold-spread"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", render);
    document.getElementById(id)?.addEventListener("change", render);
  });

  document.getElementById("gold-include-vat")?.addEventListener("change", render);

  document.getElementById("gold-advanced-toggle")?.addEventListener("click", () => {
    showAdvanced = !showAdvanced;
    document.getElementById("gold-advanced-body").hidden = !showAdvanced;
    document.getElementById("gold-advanced-toggle").classList.toggle(
      "is-open",
      showAdvanced,
    );
  });

  document.addEventListener("langchange", () => {
    renderTypeOptions();
    refreshI18nText();
    render();
  });

  render();
}

mount();
