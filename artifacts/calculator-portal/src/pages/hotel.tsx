import { useState } from "react";
import { motion } from "framer-motion";
import { Bed, CalendarDays } from "lucide-react";
import { format, differenceInDays, isWeekend, addDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";

export default function Hotel() {
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [nightlyRate, setNightlyRate] = useState<number | "">("");
  const [weekendRate, setWeekendRate] = useState<number | "">("");

  let totalNights = 0;
  let weekendNights = 0;
  let weekdayNights = 0;
  let totalCost = 0;

  if (checkIn && checkOut && nightlyRate !== "") {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    
    if (d1 < d2) {
      totalNights = differenceInDays(d2, d1);
      
      let currDate = d1;
      for (let i = 0; i < totalNights; i++) {
        const isWe = isWeekend(currDate);
        if (isWe) {
          weekendNights++;
          totalCost += typeof weekendRate === "number" ? weekendRate : nightlyRate;
        } else {
          weekdayNights++;
          totalCost += nightlyRate;
        }
        currDate = addDays(currDate, 1);
      }
    }
  }

  const avgPerNight = totalNights > 0 ? totalCost / totalNights : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 max-w-3xl mx-auto pb-12"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <Bed size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotel Stay</h1>
          <p className="text-muted-foreground">Calculate duration and total costs.</p>
        </div>
      </div>

      <Card className="border-t-4 border-t-rose-500 shadow-sm">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-[1fr_300px] gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Check-in</Label>
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Check-out</Label>
                  <Input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Nightly Rate</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={nightlyRate}
                      onChange={(e) => setNightlyRate(e.target.value ? parseFloat(e.target.value) : "")}
                      className="pl-8 h-12"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Weekend Rate <span className="text-[10px] font-normal lowercase tracking-normal">(Optional)</span></Label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={weekendRate}
                      onChange={(e) => setWeekendRate(e.target.value ? parseFloat(e.target.value) : "")}
                      className="pl-8 h-12"
                      placeholder="Same as nightly"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 flex flex-col justify-center relative overflow-hidden">
              <CalendarDays className="absolute -right-4 -bottom-4 text-rose-500/10" size={120} />
              <div className="relative z-10 space-y-6">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Total Cost</div>
                  <div className="text-4xl font-mono font-bold text-foreground">
                    {formatCurrency(totalCost)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Total Nights</div>
                    <div className="font-mono font-semibold text-rose-600 dark:text-rose-400 text-xl">
                      {totalNights}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Avg / Night</div>
                    <div className="font-mono font-semibold text-muted-foreground">
                      {formatCurrency(avgPerNight)}
                    </div>
                  </div>
                </div>

                {totalNights > 0 && (
                  <div className="flex gap-4 text-xs font-mono text-muted-foreground border-t border-border pt-4">
                    <div>{weekdayNights} Weekday</div>
                    <div>{weekendNights} Weekend</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
