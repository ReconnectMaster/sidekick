import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Trash2, Trophy, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";
import { useTranslation } from "@/i18n";

type Unit = "g" | "kg" | "ml" | "L" | "oz" | "lb";

const UNIT_MULTIPLIERS: Record<Unit, { base: "g" | "ml"; multiplier: number }> = {
  g:  { base: "g",  multiplier: 1 },
  kg: { base: "g",  multiplier: 1000 },
  oz: { base: "g",  multiplier: 28.3495 },
  lb: { base: "g",  multiplier: 453.592 },
  ml: { base: "ml", multiplier: 1 },
  L:  { base: "ml", multiplier: 1000 },
};

interface Item {
  id: string;
  name: string;
  price: number | "";
  quantity: number | "";
  unit: Unit;
}

export default function Shopping() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "Brand A", price: 4.99, quantity: 500, unit: "g" },
    { id: "2", name: "Brand B", price: 8.50, quantity: 1,   unit: "kg" },
    { id: "3", name: "Brand C", price: "",   quantity: "",  unit: "g" },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Math.random().toString(36).substring(7), name: `Item ${items.length + 1}`, price: "", quantity: "", unit: "g" },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof Item, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const analyzedItems = useMemo(() => {
    const validItems = items.filter(
      (item) =>
        typeof item.price === "number" &&
        typeof item.quantity === "number" &&
        item.price > 0 &&
        item.quantity > 0
    );

    const calculated = validItems.map((item) => {
      const { base, multiplier } = UNIT_MULTIPLIERS[item.unit];
      const baseQuantity = (item.quantity as number) * multiplier;
      const costPerStandard = ((item.price as number) / baseQuantity) * 100;
      return {
        ...item,
        baseQuantity,
        baseUnit: base,
        costPerStandard,
        costLabel: `${formatCurrency(costPerStandard)} / 100${base}`,
      };
    });

    const sorted = [...calculated].sort((a, b) => a.costPerStandard - b.costPerStandard);

    return items.map((item) => {
      const calcInfo = sorted.find((s) => s.id === item.id);
      return {
        ...item,
        calcInfo,
        isBest: sorted.length > 1 && sorted[0].id === item.id && calcInfo !== undefined,
      };
    });
  }, [items]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5 max-w-2xl mx-auto pb-12"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
          <ShoppingCart size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.shopping.title}</h1>
          <p className="text-muted-foreground">{t.shopping.subtitle}</p>
        </div>
      </div>

      {/* Summary banner */}
      {(() => {
        const valid = analyzedItems.filter((i) => i.calcInfo);
        const best  = valid.find((i) => i.isBest);
        if (valid.length < 2 || !best) return null;
        const worst = [...valid].sort(
          (a, b) => b.calcInfo!.costPerStandard - a.calcInfo!.costPerStandard
        )[0];
        const saving    = worst.calcInfo!.costPerStandard - best.calcInfo!.costPerStandard;
        const savingPct = (saving / worst.calcInfo!.costPerStandard) * 100;
        return (
          <div className="rounded-xl bg-blue-500 text-white px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-lg shadow-blue-500/20">
            <Trophy size={22} className="shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-base leading-snug">
                <span className="opacity-80">{t.shopping.bestDeal} </span>{best.name}
              </p>
              <p className="text-sm opacity-80 mt-0.5">
                {savingPct.toFixed(1)}% {t.shopping.cheaperThan} {worst.name} — {t.shopping.save} {formatCurrency(saving)} {t.shopping.per} 100{best.calcInfo!.baseUnit}
              </p>
            </div>
            <div className="font-mono font-bold text-xl sm:text-2xl shrink-0">
              {best.calcInfo!.costLabel}
            </div>
          </div>
        );
      })()}

      <div className="space-y-4">
        {analyzedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`border-l-4 transition-all duration-300 ${
                item.isBest
                  ? "border-l-blue-500 shadow-md shadow-blue-500/10 bg-blue-50/40 dark:bg-blue-900/10"
                  : "border-l-transparent"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {t.shopping.item} {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.isBest && (
                      <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 px-2.5 py-1 rounded-full">
                        <Trophy size={11} />
                        {t.shopping.bestValue}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 1}
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  <Label htmlFor={`name-${item.id}`} className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    {t.shopping.productName}
                  </Label>
                  <Input
                    id={`name-${item.id}`}
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    placeholder={t.shopping.productPlaceholder}
                    className="h-11 text-base"
                    data-testid={`input-name-${item.id}`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="space-y-1.5">
                    <Label htmlFor={`price-${item.id}`} className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      {t.shopping.price}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground text-sm select-none">$</span>
                      <Input
                        id={`price-${item.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(item.id, "price", e.target.value ? parseFloat(e.target.value) : "")
                        }
                        className="pl-7 h-11 text-base"
                        placeholder="0.00"
                        data-testid={`input-price-${item.id}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`qty-${item.id}`} className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      {t.shopping.quantity}
                    </Label>
                    <Input
                      id={`qty-${item.id}`}
                      type="number"
                      min="0"
                      step="0.1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", e.target.value ? parseFloat(e.target.value) : "")
                      }
                      placeholder="500"
                      className="h-11 text-base"
                      data-testid={`input-qty-${item.id}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{t.shopping.unit}</Label>
                    <Select
                      value={item.unit}
                      onValueChange={(val: Unit) => updateItem(item.id, "unit", val)}
                    >
                      <SelectTrigger className="h-11 text-base" data-testid={`select-unit-${item.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="g">g — gram</SelectItem>
                        <SelectItem value="kg">kg — kilogram</SelectItem>
                        <SelectItem value="oz">oz — ounce</SelectItem>
                        <SelectItem value="lb">lb — pound</SelectItem>
                        <SelectItem value="ml">ml — millilitre</SelectItem>
                        <SelectItem value="L">L — litre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {item.calcInfo ? (
                  <div className="flex items-center justify-between rounded-lg bg-muted/60 px-4 py-3 border border-border">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{t.shopping.unitPrice}</span>
                    <span className="font-mono text-lg font-bold text-foreground">{item.calcInfo.costLabel}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3 border border-dashed border-border opacity-50">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{t.shopping.unitPrice}</span>
                    <span className="font-mono text-lg text-muted-foreground">—</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={addItem}
        variant="outline"
        className="w-full border-dashed py-7 text-muted-foreground hover:text-foreground"
        data-testid="button-add-item"
      >
        <Plus size={18} className="mr-2" />
        {t.shopping.addItem}
      </Button>

      {analyzedItems.filter((i) => i.calcInfo).length === 0 && (
        <div className="text-center py-10 opacity-40 flex flex-col items-center gap-3">
          <Calculator size={44} className="text-muted-foreground" />
          <p className="text-sm">{t.shopping.emptyHint}</p>
        </div>
      )}
    </motion.div>
  );
}
