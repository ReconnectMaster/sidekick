/**
 * Shopping calculator — DOM wiring and rendering.
 * Business rules live in shopping.logic.js.
 */

import {
  SHOPPING_INITIAL_ROW_COUNT,
  SHOPPING_MIN_ROWS,
} from "../../config/constants.js";
import { getCurrency, t } from "../../core/i18n.js";
import { refreshI18nText } from "../../core/layout.js";
import { parseOptionalNumber } from "../../shared/parse-number.js";
import { UNIT_ORDER } from "./shopping.constants.js";
import { analyzeShoppingItems, buildShoppingSummary } from "./shopping.logic.js";

let items = [];
let nextId = 1;

function createEmptyItem() {
  return { id: String(nextId++), price: null, quantity: null, unit: "pcs" };
}

function readItemsFromDom() {
  const rows = document.querySelectorAll("[data-shopping-row]");
  return [...rows].map((row) => ({
    id: row.dataset.shoppingRow,
    price: parseOptionalNumber(row.querySelector("[data-field='price']")?.value),
    quantity: parseOptionalNumber(row.querySelector("[data-field='quantity']")?.value),
    unit: row.querySelector("[data-field='unit']")?.value ?? "pcs",
  }));
}

function render() {
  const labels = t().shopping;
  const { code } = getCurrency();
  const lang = document.documentElement.lang;
  items = readItemsFromDom();
  const analyzed = analyzeShoppingItems(items, code, lang);

  analyzed.forEach((item, index) => {
    const row = document.querySelector(`[data-shopping-row="${item.id}"]`);
    if (!row) return;

    const resultBox = row.querySelector("[data-unit-price]");
    const badge = row.querySelector("[data-best-badge]");
    const removeBtn = row.querySelector("[data-remove-row]");
    const clearBtn = row.querySelector("[data-clear-row]");

    row.classList.toggle("is-best", Boolean(item.isBest));

    if (item.calcInfo) {
      resultBox.classList.add("has-value");
      resultBox.querySelector("[data-unit-price-value]").textContent = item.calcInfo.costLabel;
    } else {
      resultBox.classList.remove("has-value");
      resultBox.querySelector("[data-unit-price-value]").textContent = "—";
    }

    badge.hidden = !item.isBest;
    removeBtn.disabled = items.length <= SHOPPING_MIN_ROWS;
    clearBtn.disabled =
      item.price === null && item.quantity === null;
  });

  const summaryEl = document.getElementById("shopping-summary");
  const summary = buildShoppingSummary(analyzed, labels.item);
  if (summary && summaryEl) {
    summaryEl.hidden = false;
    summaryEl.innerHTML = `
      <span class="summary-icon" aria-hidden="true">🏆</span>
      <p>
        <strong>${summary.bestLabel}</strong> ${labels.summaryBest} —
        ${labels.unitPrice} <strong class="mono">${summary.bestCostLabel}</strong> —
        <strong>${summary.pct}%</strong> ${labels.summaryCheaper}
      </p>
    `;
  } else if (summaryEl) {
    summaryEl.hidden = true;
  }

  const emptyHint = document.getElementById("shopping-empty");
  if (emptyHint) {
    emptyHint.hidden = analyzed.some((item) => item.calcInfo);
  }
}

function buildUnitOptions(selected) {
  const labels = t().shopping.units;
  return UNIT_ORDER.map(
    (unit) =>
      `<option value="${unit}" ${unit === selected ? "selected" : ""}>${labels[unit]}</option>`,
  ).join("");
}

function createRowElement(item, index) {
  const labels = t().shopping;
  const { symbol } = getCurrency();
  const row = document.createElement("article");
  row.className = "card shopping-row";
  row.dataset.shoppingRow = item.id;

  row.innerHTML = `
    <div class="shopping-row__head">
      <span class="label-caps">${labels.item} ${index + 1}</span>
      <div class="shopping-row__actions">
        <span class="badge badge--best" data-best-badge hidden>${labels.bestValue}</span>
        <button type="button" class="btn btn-icon" data-remove-row aria-label="Remove item">×</button>
      </div>
    </div>
    <div class="shopping-row__inputs">
      <label class="field">
        <span class="label-caps">${labels.price}</span>
        <span class="input-wrap">
          <span class="input-prefix">${symbol}</span>
          <input type="number" min="0" step="0.01" data-field="price" placeholder="0.00" />
        </span>
      </label>
      <label class="field">
        <span class="label-caps">${labels.quantity}</span>
        <input type="number" min="0" step="0.1" data-field="quantity" placeholder="1" />
      </label>
      <label class="field field--unit">
        <span class="label-caps">${labels.unit}</span>
        <select data-field="unit">${buildUnitOptions(item.unit)}</select>
      </label>
    </div>
    <div class="unit-price" data-unit-price>
      <span class="label-caps">${labels.unitPrice}</span>
      <span class="mono" data-unit-price-value>—</span>
    </div>
    <button type="button" class="btn btn-ghost btn-block" data-clear-row>${labels.clearItem}</button>
  `;

  row.querySelector("[data-remove-row]").addEventListener("click", () => {
    if (items.length <= SHOPPING_MIN_ROWS) return;
    row.remove();
    render();
  });

  row.querySelector("[data-clear-row]").addEventListener("click", () => {
    row.querySelector("[data-field='price']").value = "";
    row.querySelector("[data-field='quantity']").value = "";
    render();
  });

  row.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  return row;
}

function mount() {
  const list = document.getElementById("shopping-list");
  const addBtn = document.getElementById("shopping-add");
  if (!list) return;

  items = Array.from({ length: SHOPPING_INITIAL_ROW_COUNT }, () => createEmptyItem());
  list.replaceChildren(...items.map((item, index) => createRowElement(item, index)));

  addBtn?.addEventListener("click", () => {
    const item = createEmptyItem();
    items.push(item);
    list.appendChild(createRowElement(item, items.length - 1));
    render();
  });

  document.addEventListener("langchange", () => {
    list.querySelectorAll("[data-shopping-row]").forEach((row, index) => {
      const unitSelect = row.querySelector("[data-field='unit']");
      const current = unitSelect.value;
      unitSelect.innerHTML = buildUnitOptions(current);
      row.querySelector(".shopping-row__head .label-caps").textContent =
        `${t().shopping.item} ${index + 1}`;
    });
    refreshI18nText();
    render();
  });

  render();
}

mount();
