import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Trash2, Trophy, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";

type Unit = "g" | "kg" | "ml" | "L" | "oz" | "lb";

const UNIT_MULTIPLIERS: Record<Unit, { base: "g" | "ml", multiplier: number }> = {
  "g": { base: "g", multiplier: 1 },
  "kg": { base: "g", multiplier: 1000 },
  "oz": { base: "g", multiplier: 28.3495 },
  "lb": { base: "g", multiplier: 453.592 },
  "ml": { base: "ml", multiplier: 1 },
  "L": { base: "ml", multiplier: 1000 },
};

interface Item {
  id: string;
  name: string;
  price: number | "";
  quantity: number | "";
  unit: Unit;
}

export default function Shopping() {
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "Brand A", price: 4.99, quantity: 500, unit: "g" },
    { id: "2", name: "Brand B", price: 8.50, quantity: 1, unit: "kg" },
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
      (item) => typeof item.price === "number" && typeof item.quantity === "number" && item.price > 0 && item.quantity > 0
    );

    const calculated = validItems.map((item) => {
      const { base, multiplier } = UNIT_MULTIPLIERS[item.unit];
      const baseQuantity = (item.quantity as number) * multiplier;
      // standard unit cost (per 100g or 100ml)
      const costPerStandard = ((item.price as number) / baseQuantity) * 100;
      
      return {
        ...item,
        baseQuantity,
        baseUnit: base,
        costPerStandard,
        costLabel: `${formatCurrency(costPerStandard)} / 100${base}`
      };
    });

    const sorted = [...calculated].sort((a, b) => a.costPerStandard - b.costPerStandard);
    
    return items.map(item => {
      const calcInfo = sorted.find(s => s.id === item.id);
      return {
        ...item,
        calcInfo,
        isBest: sorted.length > 1 && sorted[0].id === item.id && calcInfo !== undefined
      };
    });
  }, [items]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 max-w-5xl mx-auto pb-12"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
          <ShoppingCart size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping</h1>
          <p className="text-muted-foreground">Compare price-per-unit across products.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {analyzedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={`overflow-hidden border-l-4 transition-all duration-300 ${item.isBest ? 'border-l-blue-500 shadow-md shadow-blue-500/10 bg-blue-50/30 dark:bg-blue-900/10' : 'border-l-transparent'}`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 flex-1">
                    <div className="col-span-2 sm:col-span-2 space-y-1.5">
                      <Label htmlFor={`name-${item.id}`} className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Product</Label>
                      <Input
                        id={`name-${item.id}`}
                        value={item.name}
                        onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        placeholder="Brand A"
                        className="font-medium"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor={`price-${item.id}`} className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input
                          id={`price-${item.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, "price", e.target.value ? parseFloat(e.target.value) : "")}
                          className="pl-7"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor={`qty-${item.id}`} className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Qty</Label>
                      <Input
                        id={`qty-${item.id}`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", e.target.value ? parseFloat(e.target.value) : "")}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Unit</Label>
                      <Select
                        value={item.unit}
                        onValueChange={(val: Unit) => updateItem(item.id, "unit", val)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="oz">oz</SelectItem>
                          <SelectItem value="lb">lb</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center justify-between sm:justify-center sm:min-w-[140px] pl-0 sm:pl-4 sm:border-l border-border h-full pt-2 sm:pt-0">
                    {item.calcInfo ? (
                      <div className="flex flex-col items-start sm:items-end w-full">
                        <div className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider">Unit Price</div>
                        <div className="font-mono text-lg sm:text-xl font-bold text-foreground">
                          {item.calcInfo.costLabel}
                        </div>
                        {item.isBest && (
                          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-semibold mt-1 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-full">
                            <Trophy size={12} />
                            BEST VALUE
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-start sm:items-end w-full opacity-50">
                        <div className="text-xs text-muted-foreground mb-1">Unit Price</div>
                        <div className="font-mono text-lg">--</div>
                      </div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive shrink-0 mt-0 sm:mt-2"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 1}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Button onClick={addItem} variant="outline" className="w-full border-dashed py-8 text-muted-foreground hover:text-foreground">
        <Plus size={18} className="mr-2" />
        Add Item to Compare
      </Button>
      
      {analyzedItems.filter(i => i.calcInfo).length === 0 && (
        <div className="text-center py-12 opacity-50 flex flex-col items-center">
          <Calculator size={48} className="mb-4 text-muted-foreground" />
          <p>Enter price and quantity to see unit costs.</p>
        </div>
      )}
    </motion.div>
  );
}
