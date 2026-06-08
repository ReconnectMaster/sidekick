import { useState } from "react";
import { motion } from "framer-motion";
import { Receipt, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/format";

const COMMON_RATES = [5, 10, 15, 20, 23];

export default function Vat() {
  const [netPrice, setNetPrice] = useState<number | "">("");
  const [grossPrice, setGrossPrice] = useState<number | "">("");
  const [vatRate, setVatRate] = useState<number | "">(20);

  // Mode 1: Add VAT to Net
  const m1VatAmount = typeof netPrice === "number" && typeof vatRate === "number" ? netPrice * (vatRate / 100) : null;
  const m1Gross = typeof netPrice === "number" && m1VatAmount !== null ? netPrice + m1VatAmount : null;

  // Mode 2: Extract VAT from Gross
  const m2Net = typeof grossPrice === "number" && typeof vatRate === "number" ? grossPrice / (1 + (vatRate / 100)) : null;
  const m2VatAmount = typeof grossPrice === "number" && m2Net !== null ? grossPrice - m2Net : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 max-w-3xl mx-auto pb-12"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <Receipt size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">VAT Calculator</h1>
          <p className="text-muted-foreground">Add or extract Value Added Tax.</p>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Select VAT Rate</Label>
        <div className="flex flex-wrap items-center gap-2">
          {COMMON_RATES.map((rate) => (
            <button
              key={rate}
              onClick={() => setVatRate(rate)}
              className={`px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all ${
                vatRate === rate 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {rate}%
            </button>
          ))}
          <div className="relative ml-2 w-24">
            <Input
              type="number"
              min="0"
              step="0.1"
              value={vatRate}
              onChange={(e) => setVatRate(e.target.value ? parseFloat(e.target.value) : "")}
              className={`pr-6 font-mono font-bold ${!COMMON_RATES.includes(vatRate as number) ? 'border-amber-500 ring-1 ring-amber-500/20' : ''}`}
              placeholder="0"
            />
            <span className="absolute right-2 top-2.5 text-muted-foreground text-sm">%</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="add-vat" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="add-vat">Add VAT (Net to Gross)</TabsTrigger>
          <TabsTrigger value="extract-vat">Extract VAT (Gross to Net)</TabsTrigger>
        </TabsList>
        
        {/* MODE 1 */}
        <TabsContent value="add-vat">
          <Card className="border-t-4 border-t-amber-500 shadow-sm">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Net Price (Before VAT)</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={netPrice}
                        onChange={(e) => setNetPrice(e.target.value ? parseFloat(e.target.value) : "")}
                        className="pl-8 text-lg h-12"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-6 flex flex-col justify-center relative overflow-hidden">
                  <Building2 className="absolute -right-4 -bottom-4 text-amber-500/10" size={120} />
                  <div className="relative z-10 space-y-6">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Gross Price (Final)</div>
                      <div className="text-4xl font-mono font-bold text-foreground">
                        {m1Gross !== null ? formatCurrency(m1Gross) : "$0.00"}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">VAT Amount</div>
                        <div className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                          +{m1VatAmount !== null ? formatCurrency(m1VatAmount) : "$0.00"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Net Base</div>
                        <div className="font-mono font-semibold text-muted-foreground">
                          {netPrice !== "" ? formatCurrency(netPrice) : "$0.00"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MODE 2 */}
        <TabsContent value="extract-vat">
          <Card className="border-t-4 border-t-amber-500 shadow-sm">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Gross Price (Final Total)</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={grossPrice}
                        onChange={(e) => setGrossPrice(e.target.value ? parseFloat(e.target.value) : "")}
                        className="pl-8 text-lg h-12"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-6 flex flex-col justify-center relative overflow-hidden">
                  <Building2 className="absolute -right-4 -bottom-4 text-amber-500/10" size={120} />
                  <div className="relative z-10 space-y-6">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Net Price (Excl. VAT)</div>
                      <div className="text-4xl font-mono font-bold text-foreground">
                        {m2Net !== null ? formatCurrency(m2Net) : "$0.00"}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Included VAT</div>
                        <div className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                          {m2VatAmount !== null ? formatCurrency(m2VatAmount) : "$0.00"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Gross Total</div>
                        <div className="font-mono font-semibold text-muted-foreground">
                          {grossPrice !== "" ? formatCurrency(grossPrice) : "$0.00"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
