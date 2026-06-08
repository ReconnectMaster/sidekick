import { useState } from "react";
import { motion } from "framer-motion";
import { Bed, CalendarDays, Moon, Sun, Wallet } from "lucide-react";
import { differenceInDays, isWeekend, addDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";

export default function Hotel() {
  const [checkIn,     setCheckIn]     = useState<string>("");
  const [checkOut,    setCheckOut]    = useState<string>("");
  const [nightlyRate, setNightlyRate] = useState<number | "">("");
  const [weekendRate, setWeekendRate] = useState<number | "">("");
  const [budget,      setBudget]      = useState<number | "">("");

  let totalNights   = 0;
  let weekendNights = 0;
  let weekdayNights = 0;
  let totalCost     = 0;

  if (checkIn && checkOut && nightlyRate !== "") {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);

    if (d1 < d2) {
      totalNights = differenceInDays(d2, d1);
      let curr = d1;
      for (let i = 0; i < totalNights; i++) {
        const isWe = isWeekend(curr);
        if (isWe) {
          weekendNights++;
          totalCost += typeof weekendRate === "number" ? weekendRate : (nightlyRate as number);
        } else {
          weekdayNights++;
          totalCost += nightlyRate as number;
        }
        curr = addDays(curr, 1);
      }
    }
  }

  const avgPerNight = totalNights > 0 ? totalCost / totalNights : 0;

  const maxNightsOnBudget =
    budget !== "" && nightlyRate !== "" && nightlyRate > 0
      ? Math.floor((budget as number) / (nightlyRate as number))
      : null;

  const hasResult = totalNights > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 max-w-2xl mx-auto pb-12"
    >
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <Bed size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotel Stay</h1>
          <p className="text-muted-foreground">Calculate duration and total costs for your stay.</p>
        </div>
      </div>

      {/* Dates */}
      <Card className="border-t-4 border-t-rose-500 shadow-sm">
        <CardContent className="p-6 space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dates</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="check-in" className="text-sm font-semibold">
                Check-in Date
              </Label>
              <Input
                id="check-in"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="h-12 text-base"
                data-testid="input-check-in"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="check-out" className="text-sm font-semibold">
                Check-out Date
              </Label>
              <Input
                id="check-out"
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="h-12 text-base"
                data-testid="input-check-out"
              />
            </div>
          </div>

          {/* Nights duration pill */}
          {hasResult && (
            <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-900/20 rounded-lg px-4 py-2.5 border border-rose-200 dark:border-rose-800">
              <CalendarDays size={16} />
              {totalNights} night{totalNights !== 1 ? "s" : ""} —{" "}
              <span className="font-normal text-muted-foreground">
                {weekdayNights} weekday{weekdayNights !== 1 ? "s" : ""}, {weekendNights} weekend{weekendNights !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rates */}
      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rates</p>

          <div className="space-y-2">
            <Label htmlFor="nightly-rate" className="text-sm font-semibold">
              Nightly Rate (Weekday)
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-muted-foreground select-none">$</span>
              <Input
                id="nightly-rate"
                type="number"
                min="0"
                step="1"
                value={nightlyRate}
                onChange={(e) => setNightlyRate(e.target.value ? parseFloat(e.target.value) : "")}
                className="pl-9 h-12 text-base"
                placeholder="e.g. 120.00"
                data-testid="input-nightly-rate"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weekend-rate" className="text-sm font-semibold">
              Weekend Rate{" "}
              <span className="text-xs font-normal text-muted-foreground">(optional — leave blank to use nightly rate)</span>
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-muted-foreground select-none">$</span>
              <Input
                id="weekend-rate"
                type="number"
                min="0"
                step="1"
                value={weekendRate}
                onChange={(e) => setWeekendRate(e.target.value ? parseFloat(e.target.value) : "")}
                className="pl-9 h-12 text-base"
                placeholder="Same as nightly rate"
                data-testid="input-weekend-rate"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget */}
      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Budget Check</p>

          <div className="space-y-2">
            <Label htmlFor="budget" className="text-sm font-semibold">
              My Budget{" "}
              <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-muted-foreground select-none">$</span>
              <Input
                id="budget"
                type="number"
                min="0"
                step="1"
                value={budget}
                onChange={(e) => setBudget(e.target.value ? parseFloat(e.target.value) : "")}
                className="pl-9 h-12 text-base"
                placeholder="How much can you spend?"
                data-testid="input-budget"
              />
            </div>
          </div>

          {maxNightsOnBudget !== null && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-4 py-2.5 border border-emerald-200 dark:border-emerald-800">
              <Wallet size={16} />
              You can afford up to{" "}
              <span className="font-bold">{maxNightsOnBudget} night{maxNightsOnBudget !== 1 ? "s" : ""}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-rose-500 text-white px-6 py-4">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Total Cost</p>
            <p className="text-5xl font-mono font-bold mt-1">
              {hasResult ? formatCurrency(totalCost) : "—"}
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-border">
            <StatBox
              icon={<Moon size={16} />}
              label="Total Nights"
              value={hasResult ? String(totalNights) : "—"}
              highlight
            />
            <StatBox
              icon={<Sun size={16} />}
              label="Avg / Night"
              value={hasResult ? formatCurrency(avgPerNight) : "—"}
            />
            <StatBox
              icon={<CalendarDays size={16} />}
              label="Weekend Nights"
              value={hasResult ? String(weekendNights) : "—"}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatBox({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-5 px-3 text-center">
      <div className={`mb-1 ${highlight ? "text-rose-500" : "text-muted-foreground"}`}>{icon}</div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{label}</p>
      <p className={`font-mono font-bold text-xl ${highlight ? "text-rose-600 dark:text-rose-400" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
