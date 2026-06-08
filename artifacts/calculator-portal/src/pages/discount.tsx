import { useState } from "react";
import { motion } from "framer-motion";
import { Percent, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/i18n";

export default function Discount() {
  const { t, currencySymbol, fmtCurrency } = useTranslation();
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [discountPercent, setDiscountPercent] = useState<number | "">("");
  const [finalPrice, setFinalPrice] = useState<number | "">("");

  // Tab 1 — Find Sale Price
  const m1Savings = typeof originalPrice === "number" && typeof discountPercent === "number"
    ? originalPrice * (discountPercent / 100) : null;
  const m1Final = typeof originalPrice === "number" && m1Savings !== null
    ? originalPrice - m1Savings : null;

  // Tab 2 — Find Original Price
  const m2Original = typeof finalPrice === "number" && typeof discountPercent === "number" && discountPercent < 100
    ? finalPrice / (1 - discountPercent / 100) : null;
  const m2Savings = m2Original !== null && typeof finalPrice === "number"
    ? m2Original - finalPrice : null;

  // Tab 3 — Find Discount %
  const [origForPct, setOrigForPct] = useState<number | "">("");
  const [finalForPct, setFinalForPct] = useState<number | "">("");
  const pctValid = typeof origForPct === "number" && typeof finalForPct === "number"
    && origForPct > 0 && finalForPct >= 0 && finalForPct <= origForPct;
  const pctDiscount = pctValid ? ((origForPct as number - (finalForPct as number)) / (origForPct as number)) * 100 : null;
  const pctSaving   = pctValid ? (origForPct as number) - (finalForPct as number) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 max-w-3xl mx-auto pb-12"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
          <Percent size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.discount.title}</h1>
          <p className="text-muted-foreground">{t.discount.subtitle}</p>
        </div>
      </div>

      <Tabs defaultValue="find-final" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="find-final">{t.discount.findSalePrice}</TabsTrigger>
          <TabsTrigger value="find-pct">{t.discount.findDiscountPct}</TabsTrigger>
          <TabsTrigger value="find-original">{t.discount.findOriginalPrice}</TabsTrigger>
        </TabsList>

        {/* Tab 1 — Find Sale Price */}
        <TabsContent value="find-final">
          <Card className="border-t-4 border-t-green-500 shadow-sm">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{t.discount.originalPrice}</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-muted-foreground">{currencySymbol}</span>
                      <Input type="number" min="0" step="0.01" value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value ? parseFloat(e.target.value) : "")}
                        className="pl-8 text-lg h-12" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{t.discount.discountPercentage}</Label>
                    <div className="relative">
                      <Input type="number" min="0" max="100" step="1" value={discountPercent}
                        onChange={(e) => setDiscountPercent(e.target.value ? parseFloat(e.target.value) : "")}
                        className="pr-8 text-lg h-12" placeholder="0" />
                      <span className="absolute right-4 top-3 text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
                <ResultPanel color="green">
                  <BigResult label={t.discount.finalSalePrice} value={m1Final !== null ? fmtCurrency(m1Final) : fmtCurrency(0)} highlight />
                  <TwoStats
                    l1={t.discount.youSave}   v1={m1Savings !== null ? fmtCurrency(m1Savings) : fmtCurrency(0)}
                    l2={t.discount.original}  v2={originalPrice !== "" ? fmtCurrency(originalPrice) : fmtCurrency(0)} v2Strike
                  />
                </ResultPanel>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2 — Find Original Price */}
        <TabsContent value="find-original">
          <Card className="border-t-4 border-t-green-500 shadow-sm">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{t.discount.finalSalePrice}</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-muted-foreground">{currencySymbol}</span>
                      <Input type="number" min="0" step="0.01" value={finalPrice}
                        onChange={(e) => setFinalPrice(e.target.value ? parseFloat(e.target.value) : "")}
                        className="pl-8 text-lg h-12" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{t.discount.discountApplied}</Label>
                    <div className="relative">
                      <Input type="number" min="0" max="99" step="1" value={discountPercent}
                        onChange={(e) => setDiscountPercent(e.target.value ? parseFloat(e.target.value) : "")}
                        className="pr-8 text-lg h-12" placeholder="0" />
                      <span className="absolute right-4 top-3 text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
                <ResultPanel color="green">
                  <BigResult label={t.discount.originalPriceWas} value={m2Original !== null ? fmtCurrency(m2Original) : fmtCurrency(0)} />
                  <TwoStats
                    l1={t.discount.totalSavings} v1={m2Savings !== null ? fmtCurrency(m2Savings) : fmtCurrency(0)} v1Green
                    l2={t.discount.finalPrice}   v2={finalPrice !== "" ? fmtCurrency(finalPrice) : fmtCurrency(0)}
                  />
                </ResultPanel>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3 — Find Discount % */}
        <TabsContent value="find-pct">
          <Card className="border-t-4 border-t-green-500 shadow-sm">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{t.discount.originalPrice}</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-muted-foreground">{currencySymbol}</span>
                      <Input type="number" min="0" step="0.01" value={origForPct}
                        onChange={(e) => setOrigForPct(e.target.value ? parseFloat(e.target.value) : "")}
                        className="pl-8 text-lg h-12" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{t.discount.finalSalePrice}</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-muted-foreground">{currencySymbol}</span>
                      <Input type="number" min="0" step="0.01" value={finalForPct}
                        onChange={(e) => setFinalForPct(e.target.value ? parseFloat(e.target.value) : "")}
                        className="pl-8 text-lg h-12" placeholder="0.00" />
                    </div>
                  </div>
                </div>

                <ResultPanel color="green">
                  {pctDiscount !== null ? (
                    <>
                      <BigResult
                        label={t.discount.discountRate}
                        value={`${pctDiscount.toFixed(2)}%`}
                        highlight
                        huge
                      />
                      <TwoStats
                        l1={t.discount.amountSaved} v1={fmtCurrency(pctSaving!)} v1Green
                        l2={t.discount.finalPrice}  v2={fmtCurrency(finalForPct as number)}
                      />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground text-center px-4">
                      {t.discount.enterBothPrices}
                    </div>
                  )}
                </ResultPanel>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

function ResultPanel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div className="bg-muted/50 rounded-xl p-6 flex flex-col justify-center relative overflow-hidden">
      <Tag className={`absolute -right-4 -bottom-4 text-${color}-500/10`} size={120} />
      <div className="relative z-10 space-y-6">{children}</div>
    </div>
  );
}

function BigResult({ label, value, highlight = false, huge = false }: {
  label: string; value: string; highlight?: boolean; huge?: boolean;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-muted-foreground mb-1">{label}</div>
      <div className={`font-mono font-bold ${huge ? "text-5xl" : "text-4xl"} ${highlight ? "text-green-600 dark:text-green-400" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}

function TwoStats({ l1, v1, v1Green, l2, v2, v2Strike }: {
  l1: string; v1: string; v1Green?: boolean;
  l2: string; v2: string; v2Strike?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
      <div>
        <div className="text-xs text-muted-foreground mb-1">{l1}</div>
        <div className={`font-mono font-semibold ${v1Green ? "text-green-600 dark:text-green-400" : ""}`}>{v1}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-1">{l2}</div>
        <div className={`font-mono font-semibold ${v2Strike ? "text-muted-foreground line-through decoration-destructive/50" : ""}`}>{v2}</div>
      </div>
    </div>
  );
}
