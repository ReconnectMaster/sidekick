import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercent } from "@/lib/format";

export default function Profit() {
  const [cost, setCost] = useState<number | "">("");
  const [sellingPrice, setSellingPrice] = useState<number | "">("");
  const [desiredMargin, setDesiredMargin] = useState<number | "">("");

  // Mode 1: Calculate Profit & Margin
  const m1Profit = typeof cost === "number" && typeof sellingPrice === "number" ? sellingPrice - cost : null;
  const m1Margin = m1Profit !== null && sellingPrice ? (m1Profit / sellingPrice) * 100 : null;
  const m1Markup = m1Profit !== null && cost ? (m1Profit / cost) * 100 : null;

  // Mode 2: Target Margin
  const m2SellingPrice = typeof cost === "number" && typeof desiredMargin === "number" && desiredMargin < 100
    ? cost / (1 - (desiredMargin / 100))
    : null;
  const m2Profit = m2SellingPrice !== null && typeof cost === "number" ? m2SellingPrice - cost : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 max-w-3xl mx-auto pb-12"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
          <TrendingUp size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profit & Margin</h1>
          <p className="text-muted-foreground">Calculate absolute profit, margin, and markup.</p>
        </div>
      </div>

      <Tabs defaultValue="calc-profit" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="calc-profit">Calculate Margin</TabsTrigger>
          <TabsTrigger value="target-margin">Target Margin</TabsTrigger>
        </TabsList>
        
        {/* MODE 1 */}
        <TabsContent value="calc-profit">
          <Card className="border-t-4 border-t-purple-500 shadow-sm">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Cost Price</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={cost}
                        onChange={(e) => setCost(e.target.value ? parseFloat(e.target.value) : "")}
                        className="pl-8 text-lg h-12"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Selling Price</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value ? parseFloat(e.target.value) : "")}
                        className="pl-8 text-lg h-12"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-6 flex flex-col justify-center relative overflow-hidden">
                  <ArrowUpRight className="absolute -right-6 -bottom-6 text-purple-500/10" size={140} />
                  <div className="relative z-10 space-y-6">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Gross Profit</div>
                      <div className={`text-4xl font-mono font-bold ${m1Profit && m1Profit < 0 ? 'text-destructive' : 'text-purple-600 dark:text-purple-400'}`}>
                        {m1Profit !== null ? formatCurrency(m1Profit) : "$0.00"}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Margin</div>
                        <div className="font-mono text-lg font-bold">
                          {m1Margin !== null ? formatPercent(m1Margin) : "0%"}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Profit / Revenue</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Markup</div>
                        <div className="font-mono text-lg font-bold">
                          {m1Markup !== null ? formatPercent(m1Markup) : "0%"}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Profit / Cost</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MODE 2 */}
        <TabsContent value="target-margin">
          <Card className="border-t-4 border-t-purple-500 shadow-sm">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Cost Price</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={cost}
                        onChange={(e) => setCost(e.target.value ? parseFloat(e.target.value) : "")}
                        className="pl-8 text-lg h-12"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Desired Margin</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min="0"
                        max="99"
                        step="1"
                        value={desiredMargin}
                        onChange={(e) => setDesiredMargin(e.target.value ? parseFloat(e.target.value) : "")}
                        className="pr-8 text-lg h-12"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-3 text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Must be less than 100%</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-6 flex flex-col justify-center relative overflow-hidden">
                  <Target className="absolute -right-4 -bottom-4 text-purple-500/10" size={120} />
                  <div className="relative z-10 space-y-6">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Required Selling Price</div>
                      <div className="text-4xl font-mono font-bold text-foreground">
                        {m2SellingPrice !== null ? formatCurrency(m2SellingPrice) : "$0.00"}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Profit Amount</div>
                        <div className="font-mono font-semibold text-purple-600 dark:text-purple-400">
                          {m2Profit !== null ? formatCurrency(m2Profit) : "$0.00"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Cost Base</div>
                        <div className="font-mono font-semibold">
                          {cost !== "" ? formatCurrency(cost) : "$0.00"}
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
