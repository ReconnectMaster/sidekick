import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, ChevronDown, ArrowLeftRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/i18n";

type GoldType = "thai965" | "k24" | "k22" | "k18" | "k14" | "k9";

const GOLD_PURITY: Record<GoldType, number> = {
  thai965: 0.965,
  k24:     0.999,
  k22:     0.917,
  k18:     0.750,
  k14:     0.583,
  k9:      0.375,
};
const GOLD_TYPE_ORDER: GoldType[] = ["thai965", "k24", "k22", "k18", "k14", "k9"];
const BAHT_GRAMS = 15.244;

function toThaiWeight(grams: number) {
  const totalBaht = grams / BAHT_GRAMS;
  const baht = Math.floor(totalBaht);
  const rem = totalBaht - baht;
  const salungFloat = rem * 4;
  const salung = Math.floor(salungFloat);
  const hun = Math.min(Math.round((salungFloat - salung) * 4), 3);
  return { baht, salung, hun };
}

export default function Gold() {
  const { t, currencySymbol, fmtCurrency } = useTranslation();

  const [mode, setMode]           = useState<"buy" | "sell">("buy");
  const [goldPrice, setGoldPrice] = useState<number | "">("");
  const [goldType, setGoldType]   = useState<GoldType>("thai965");
  const [moneyInput, setMoneyInput]   = useState<number | "">("");
  const [weightInput, setWeightInput] = useState<number | "">("");
  const [inputMode, setInputMode]     = useState<"money" | "weight">("money");
  const [makingFee, setMakingFee] = useState<number | "">(500);
  const [spread, setSpread]       = useState<number | "">(0);
  const [includeVat, setIncludeVat]   = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const effectiveRate = useMemo(() => {
    if (typeof goldPrice !== "number" || goldPrice <= 0) return null;
    const purity = GOLD_PURITY[goldType];
    const sp = typeof spread === "number" ? spread : 0;
    const mf = typeof makingFee === "number" ? makingFee : 0;
    if (mode === "buy") {
      const base = goldPrice * purity * (1 + sp / 100);
      const makingPerGram = mf / BAHT_GRAMS;
      const subtotal = base + makingPerGram;
      return includeVat ? subtotal * 1.07 : subtotal;
    } else {
      return goldPrice * purity * (1 - sp / 100);
    }
  }, [goldPrice, goldType, mode, spread, makingFee, includeVat]);

  const computedWeight = useMemo(() => {
    if (!effectiveRate || effectiveRate <= 0) return null;
    if (inputMode === "money" && typeof moneyInput === "number" && moneyInput > 0)
      return moneyInput / effectiveRate;
    return null;
  }, [moneyInput, effectiveRate, inputMode]);

  const computedMoney = useMemo(() => {
    if (!effectiveRate || effectiveRate <= 0) return null;
    if (inputMode === "weight" && typeof weightInput === "number" && weightInput > 0)
      return weightInput * effectiveRate;
    return null;
  }, [weightInput, effectiveRate, inputMode]);

  const activeGrams = inputMode === "money" ? computedWeight
    : (typeof weightInput === "number" && weightInput > 0 ? weightInput : null);
  const activeMoney = inputMode === "weight" ? computedMoney
    : (typeof moneyInput === "number" && moneyInput > 0 ? moneyInput : null);
  const hasResult = activeGrams !== null && activeMoney !== null && activeGrams > 0 && activeMoney > 0;

  const thaiWeight = activeGrams ? toThaiWeight(activeGrams) : null;

  const breakdown = useMemo(() => {
    if (!hasResult || typeof goldPrice !== "number" || !activeGrams) return null;
    const purity = GOLD_PURITY[goldType];
    const sp = typeof spread === "number" ? spread : 0;
    const mf = typeof makingFee === "number" ? makingFee : 0;
    const goldValue  = goldPrice * purity * activeGrams;
    const spreadAmt  = goldValue * sp / 100;
    const makingAmt  = mode === "buy" ? (activeGrams / BAHT_GRAMS) * mf : 0;
    const subtotal   = goldValue + spreadAmt + makingAmt;
    const vatAmt     = includeVat && mode === "buy" ? subtotal * 0.07 : 0;
    return { goldValue, spreadAmt, makingAmt, vatAmt, total: subtotal + vatAmt };
  }, [hasResult, goldPrice, goldType, spread, makingFee, includeVat, mode, activeGrams]);

  const insights = useMemo(() => {
    if (!hasResult || !breakdown) return [];
    const sp = typeof spread === "number" ? spread : 0;
    const mf = typeof makingFee === "number" ? makingFee : 0;
    const parts: string[] = [];
    if (mode === "buy" && mf > 0 && breakdown.goldValue > 0) {
      const pct = (breakdown.makingAmt / breakdown.goldValue * 100).toFixed(1);
      parts.push(t.gold.insightMaking.replace("{pct}", pct));
    }
    if (sp > 0) parts.push(t.gold.insightSpread.replace("{pct}", sp.toString()));
    if (thaiWeight) {
      const { baht, salung, hun } = thaiWeight;
      const seg: string[] = [];
      if (baht > 0)   seg.push(`${baht} ${t.gold.baht}`);
      if (salung > 0) seg.push(`${salung} ${t.gold.salung}`);
      if (hun > 0)    seg.push(`${hun} ${t.gold.hun}`);
      if (seg.length) parts.push(`${t.gold.insightApprox} ${seg.join(" ")}`);
    }
    return parts;
  }, [hasResult, breakdown, spread, makingFee, mode, thaiWeight, t]);

  const moneyDisplayValue = inputMode === "money"
    ? moneyInput
    : computedMoney !== null ? parseFloat(computedMoney.toFixed(2)) : "";

  const weightDisplayValue = inputMode === "weight"
    ? weightInput
    : computedWeight !== null ? parseFloat(computedWeight.toFixed(4)) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5 max-w-2xl mx-auto pb-12"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
          <Gem size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.gold.title}</h1>
          <p className="text-muted-foreground">{t.gold.subtitle}</p>
        </div>
      </div>

      {/* Spot price + mode */}
      <Card className="border-t-4 border-t-yellow-500 shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t.gold.goldPriceLabel}
            </Label>
            <Tabs value={mode} onValueChange={(v) => setMode(v as "buy" | "sell")}>
              <TabsList className="h-8">
                <TabsTrigger value="buy"  className="text-xs px-3">{t.gold.modeBuy}</TabsTrigger>
                <TabsTrigger value="sell" className="text-xs px-3">{t.gold.modeSell}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex gap-3 items-start">
            <div className="relative flex-1">
              <span className="absolute left-3 top-3 text-muted-foreground text-sm select-none">{currencySymbol}</span>
              <Input
                type="number" min="0" step="0.01"
                value={goldPrice}
                onChange={(e) => setGoldPrice(e.target.value ? parseFloat(e.target.value) : "")}
                className="pl-7 h-11 text-base"
                placeholder="0.00"
              />
            </div>
            <div className="flex items-center h-11 px-3 rounded-md border border-input bg-muted/40 text-sm text-muted-foreground shrink-0 whitespace-nowrap">
              {t.gold.perGram}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t.gold.goldType}
            </Label>
            <Select value={goldType} onValueChange={(v: GoldType) => setGoldType(v)}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOLD_TYPE_ORDER.map((k) => (
                  <SelectItem key={k} value={k}>{t.gold.types[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bidirectional converter */}
      <Card className="shadow-sm">
        <CardContent className="p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.gold.converter}</p>

          {/* Money */}
          <div className={`rounded-lg border-2 p-4 transition-colors cursor-text ${inputMode === "money" ? "border-yellow-400 bg-yellow-50/40 dark:bg-yellow-900/10" : "border-border"}`}>
            <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2 block">
              {t.gold.budget}
            </Label>
            <div className="relative">
              <span className="absolute left-0 top-1 text-muted-foreground text-sm select-none">{currencySymbol}</span>
              <Input
                type="number" min="0" step="0.01"
                value={moneyDisplayValue}
                onChange={(e) => {
                  setInputMode("money");
                  setMoneyInput(e.target.value ? parseFloat(e.target.value) : "");
                }}
                className="pl-5 h-10 text-lg font-semibold border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none p-0 pl-5"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
            <ArrowLeftRight size={14} className="text-yellow-500" />
            <span>{t.gold.swapHint}</span>
          </div>

          {/* Weight */}
          <div className={`rounded-lg border-2 p-4 transition-colors cursor-text ${inputMode === "weight" ? "border-yellow-400 bg-yellow-50/40 dark:bg-yellow-900/10" : "border-border"}`}>
            <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2 block">
              {t.gold.goldWeight}
            </Label>
            <div className="relative">
              <Input
                type="number" min="0" step="0.0001"
                value={weightDisplayValue}
                onChange={(e) => {
                  setInputMode("weight");
                  setWeightInput(e.target.value ? parseFloat(e.target.value) : "");
                }}
                className="h-10 text-lg font-semibold border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none p-0 pr-8"
                placeholder="0.0000"
              />
              <span className="absolute right-0 top-1.5 text-muted-foreground text-sm select-none">{t.gold.grams}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced (buy mode only) */}
      {mode === "buy" && (
        <div className="rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/40 transition-colors text-left"
          >
            <span className="text-sm font-semibold">{t.gold.advanced}</span>
            <ChevronDown
              size={16}
              className={`text-muted-foreground transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {showAdvanced && (
              <motion.div
                key="advanced"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-5 border-t border-border space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        {t.gold.makingFee}
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground text-sm select-none">{currencySymbol}</span>
                        <Input
                          type="number" min="0" step="50"
                          value={makingFee}
                          onChange={(e) => setMakingFee(e.target.value ? parseFloat(e.target.value) : "")}
                          className="pl-7 h-11"
                          placeholder="500"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">{t.gold.makingFeeHint}</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        {t.gold.spread}
                      </Label>
                      <div className="relative">
                        <Input
                          type="number" min="0" max="100" step="0.1"
                          value={spread}
                          onChange={(e) => setSpread(e.target.value ? parseFloat(e.target.value) : "")}
                          className="pr-8 h-11"
                          placeholder="0"
                        />
                        <span className="absolute right-3 top-3 text-muted-foreground text-sm select-none">%</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{t.gold.spreadHint}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{t.gold.includeVat}</p>
                    <Switch checked={includeVat} onCheckedChange={setIncludeVat} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state */}
      {!effectiveRate && (
        <div className="text-center py-8 text-muted-foreground text-sm opacity-50">
          {t.gold.noPrice}
        </div>
      )}

      {/* Results */}
      {hasResult && breakdown && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {/* Cost breakdown */}
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{t.gold.results}</p>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.gold.goldValue}</span>
                  <span className="font-mono font-semibold">{fmtCurrency(breakdown.goldValue)}</span>
                </div>
                {breakdown.spreadAmt > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.gold.spreadLabel} ({spread}%)</span>
                    <span className="font-mono font-semibold">{fmtCurrency(breakdown.spreadAmt)}</span>
                  </div>
                )}
                {mode === "buy" && breakdown.makingAmt > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.gold.makingFeeLabel}</span>
                    <span className="font-mono font-semibold">{fmtCurrency(breakdown.makingAmt)}</span>
                  </div>
                )}
                {breakdown.vatAmt > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.gold.vatLabel}</span>
                    <span className="font-mono font-semibold">{fmtCurrency(breakdown.vatAmt)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <span className="font-bold text-base">{t.gold.total}</span>
                  <span className="font-mono font-bold text-2xl text-yellow-600 dark:text-yellow-400">
                    {fmtCurrency(breakdown.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thai weight units */}
          {thaiWeight && (thaiWeight.baht > 0 || thaiWeight.salung > 0 || thaiWeight.hun > 0) && (
            <Card className="shadow-sm border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {t.gold.weightInThaiUnits}
                </span>
                <div className="flex gap-5">
                  {thaiWeight.baht > 0 && (
                    <div className="text-center">
                      <p className="font-mono font-bold text-2xl text-yellow-600 dark:text-yellow-400">{thaiWeight.baht}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.gold.baht}</p>
                    </div>
                  )}
                  {thaiWeight.salung > 0 && (
                    <div className="text-center">
                      <p className="font-mono font-bold text-2xl text-yellow-600 dark:text-yellow-400">{thaiWeight.salung}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.gold.salung}</p>
                    </div>
                  )}
                  {thaiWeight.hun > 0 && (
                    <div className="text-center">
                      <p className="font-mono font-bold text-2xl text-yellow-600 dark:text-yellow-400">{thaiWeight.hun}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.gold.hun}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Smart insights */}
          {insights.length > 0 && (
            <div className="space-y-2">
              {insights.map((text, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/40 rounded-lg px-4 py-2.5">
                  <span className="text-yellow-500 mt-0.5 shrink-0">✦</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
