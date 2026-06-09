/**
 * Gold & jewelry calculator — pure business logic (no DOM).
 */

import {
  BAHT_GRAMS,
  GOLD_PURITY,
  GOLD_VAT_RATE,
  HUN_PER_SALUNG,
  SALUNG_PER_BAHT,
} from "./gold.constants.js";

/** Convert grams to Thai baht / salung / hun units. */
export function toThaiWeight(grams) {
  const totalBaht = grams / BAHT_GRAMS;
  const baht = Math.floor(totalBaht);
  const remainder = totalBaht - baht;
  const salungFloat = remainder * SALUNG_PER_BAHT;
  const salung = Math.floor(salungFloat);
  const hun = Math.min(Math.round((salungFloat - salung) * HUN_PER_SALUNG), HUN_PER_SALUNG - 1);
  return { baht, salung, hun };
}

/**
 * Effective price per gram after purity, spread, making fee, and optional VAT.
 * @param {"buy"|"sell"} mode
 */
export function calcEffectiveRatePerGram({
  goldPrice,
  goldType,
  mode,
  spread = 0,
  makingFee = 0,
  includeVat = false,
}) {
  if (typeof goldPrice !== "number" || goldPrice <= 0) return null;

  const purity = GOLD_PURITY[goldType];
  const spreadPercent = typeof spread === "number" ? spread : 0;
  const makingFeeAmount = typeof makingFee === "number" ? makingFee : 0;

  if (mode === "buy") {
    const base = goldPrice * purity * (1 + spreadPercent / 100);
    const makingPerGram = makingFeeAmount / BAHT_GRAMS;
    const subtotal = base + makingPerGram;
    return includeVat ? subtotal * (1 + GOLD_VAT_RATE) : subtotal;
  }

  return goldPrice * purity * (1 - spreadPercent / 100);
}

/** Convert money ↔ weight using the effective rate. */
export function convertGoldAmount({
  effectiveRate,
  inputMode,
  moneyInput,
  weightInput,
}) {
  if (!effectiveRate || effectiveRate <= 0) {
    return { grams: null, money: null };
  }

  let grams = null;
  let money = null;

  if (inputMode === "money" && typeof moneyInput === "number" && moneyInput > 0) {
    grams = moneyInput / effectiveRate;
    money = moneyInput;
  }

  if (inputMode === "weight" && typeof weightInput === "number" && weightInput > 0) {
    grams = weightInput;
    money = weightInput * effectiveRate;
  }

  return { grams, money };
}

/** Detailed cost breakdown for buy/sell results. */
export function calcGoldBreakdown({
  goldPrice,
  goldType,
  mode,
  grams,
  spread = 0,
  makingFee = 0,
  includeVat = false,
}) {
  if (!grams || typeof goldPrice !== "number") return null;

  const purity = GOLD_PURITY[goldType];
  const spreadPercent = typeof spread === "number" ? spread : 0;
  const makingFeeAmount = typeof makingFee === "number" ? makingFee : 0;

  const goldValue = goldPrice * purity * grams;
  const spreadAmt = goldValue * (spreadPercent / 100);
  const makingAmt = mode === "buy" ? (grams / BAHT_GRAMS) * makingFeeAmount : 0;
  const subtotal = goldValue + spreadAmt + makingAmt;
  const vatAmt = includeVat && mode === "buy" ? subtotal * GOLD_VAT_RATE : 0;

  return {
    goldValue,
    spreadAmt,
    makingAmt,
    vatAmt,
    total: subtotal + vatAmt,
  };
}

/** Human-readable insight lines for the results panel. */
export function buildGoldInsights({
  mode,
  spread,
  makingFee,
  breakdown,
  thaiWeight,
  labels,
}) {
  if (!breakdown) return [];

  const parts = [];
  const spreadPercent = typeof spread === "number" ? spread : 0;
  const makingFeeAmount = typeof makingFee === "number" ? makingFee : 0;

  if (mode === "buy" && makingFeeAmount > 0 && breakdown.goldValue > 0) {
    const pct = ((breakdown.makingAmt / breakdown.goldValue) * 100).toFixed(1);
    parts.push(labels.insightMaking.replace("{pct}", pct));
  }

  if (spreadPercent > 0) {
    parts.push(labels.insightSpread.replace("{pct}", String(spreadPercent)));
  }

  if (thaiWeight) {
    const segments = [];
    if (thaiWeight.baht > 0) segments.push(`${thaiWeight.baht} ${labels.baht}`);
    if (thaiWeight.salung > 0) segments.push(`${thaiWeight.salung} ${labels.salung}`);
    if (thaiWeight.hun > 0) segments.push(`${thaiWeight.hun} ${labels.hun}`);
    if (segments.length) {
      parts.push(`${labels.insightApprox} ${segments.join(" ")}`);
    }
  }

  return parts;
}
