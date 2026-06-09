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

type Unit = "pcs" | "ml" | "L" | "g" | "kg" | "oz" | "lb";

const UNIT_MULTIPLIERS: Record<Unit, { base: string; multiplier: number }> = {
  pcs: { base: "pcs", multiplier: 1 },
  ml:  { base: "ml",  multiplier: 1 },
  L:   { base: "ml",  multiplier: 1000 },
  g:   { base: "g",   multiplier: 1 },
  kg:  { base: "g",   multiplier: 1000 },
  oz:  { base: "g",   multiplier: 28.3495 },
  lb:  { base: "g",   multiplier: 453.592 },
};

interface Item {
  id: string;
  name: string;
  price: number | "";
  quantity: number | "";
  unit: Unit;
}

export default function Shopping() {
  const { t, lang, currency, currencySymbol, fmtCurrency } = useTranslation();

  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "", price: "", quantity: "", unit: "pcs" },
    { id: "2", name: "", price: "", quantity: "", unit: "pcs" },
    { id: "3", name: "", price: "", quantity: "", unit: "pcs" },
  ]);

  const addItem = () =>
    setItems([...items, { id: Math.random().toString(36).substring(7), name: "", price: "", quantity: "", unit: "pcs" }]);

  const removeItem = (id: string) => setItems(items.filter((item) => item.id !== id));

  const clearItem = (id: string) =>
    setItems(items.map((item) =>
      item.id === id ? { ...item, name: "", price: "", quantity: "" } : item
    ));

  const updateItem = (id: string, field: keyof Item, value: any) =>
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));

  // Translate base unit label for display (only pcs differs in Thai)
  const displayBase = (base: string) => {
    if (base === "pcs" && lang === "th") return "ชิ้น";
    return base;
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
      const costPerUnit = (item.price as number) / baseQuantity;
      const baseLabel = base === "pcs" && lang === "th" ? "ชิ้น" : base;
      return {
        ...item,
        baseQuantity,
        baseUnit: base,
        costPerUnit,
        costLabel: `${formatCurrency(costPerUnit, currency)} / 1 ${baseLabel}`,
      };
    });

    const sorted = [...calculated].sort((a, b) => a.costPerUnit - b.costPerUnit);

    return items.map((item) => {
      const calcInfo = sorted.find((s) => s.id === item.id);
      return {
        ...item,
        calcInfo,
        isBest: sorted.length > 1 && sorted[0].id === item.id && calcInfo !== undefined,
      };
    });
  }, [items, currency, lang]);

  const UNIT_ORDER: Unit[] = ["pcs", "ml", "L", "g", "kg", "oz", "lb"];

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
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    {t.shopping.productName}
                  </Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    placeholder={t.shopping.productPlaceholder}
                    className="h-11 text-base"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      {t.shopping.price}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground text-sm select-none">{currencySymbol}</span>
                      <Input
                        type="number" min="0" step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, "price", e.target.value ? parseFloat(e.target.value) : "")}
                        className="pl-7 h-11 text-base"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      {t.shopping.quantity}
                    </Label>
                    <Input
                      type="number" min="0" step="0.1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", e.target.value ? parseFloat(e.target.value) : "")}
                      placeholder="1"
                      className="h-11 text-base"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      {t.shopping.unit}
                    </Label>
                    <Select value={item.unit} onValueChange={(val: Unit) => updateItem(item.id, "unit", val)}>
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIT_ORDER.map((u) => (
                          <SelectItem key={u} value={u}>{t.shopping.units[u]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Unit price result — highlighted for best */}
                {item.calcInfo ? (
                  <div className={`flex items-center justify-between rounded-lg px-4 py-3 border transition-all ${
                    item.isBest
                      ? "bg-blue-500 text-white border-blue-500 shadow-sm shadow-blue-500/30"
                      : "bg-muted/60 border-border"
                  }`}>
                    <span className={`text-xs font-bold uppercase tracking-wider ${item.isBest ? "text-blue-100" : "text-muted-foreground"}`}>
                      {t.shopping.unitPrice}
                    </span>
                    <span className="font-mono text-lg font-bold">{item.calcInfo.costLabel}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3 border border-dashed border-border opacity-50">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{t.shopping.unitPrice}</span>
                    <span className="font-mono text-lg text-muted-foreground">—</span>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-border"
                  onClick={() => clearItem(item.id)}
                  disabled={item.name === "" && item.price === "" && item.quantity === ""}
                >
                  {t.shopping.clearItem}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={addItem}
        variant="outline"
        className="w-full border-dashed py-7 text-muted-foreground hover:text-foreground"
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
