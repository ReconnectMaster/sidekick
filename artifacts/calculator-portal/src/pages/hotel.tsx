import { useState } from "react";
import { motion } from "framer-motion";
import { Bed, CalendarDays, Moon, Sun, Wallet } from "lucide-react";
import { differenceInDays, isWeekend, addDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";
import { useTranslation } from "@/i18n";

export default function Hotel() {
  const { t } = useTranslation();
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
        if (isWeekend(curr)) {
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

  const pluralNight = (n: number) =>
    `${n} ${n === 1 ? t.hotel.night : t.hotel.nights}`;
  const pluralWeekday = (n: number) =>
    `${n} ${n === 1 ? t.hotel.weekday : t.hotel.weekdays}`;
  const pluralWeekend = (n: number) =>
    `${n} ${n === 1 ? t.hotel.weekend : t.hotel.weekends}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 max-w-2xl mx-auto pb-12"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <Bed size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.hotel.title}</h1>
          <p className="text-muted-foreground">{t.hotel.subtitle}</p>
        </div>
      </div>

      {/* Dates */}
      <Card className="border-t-4 border-t-rose-500 shadow-sm">
        <CardContent className="p-6 space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.hotel.dates}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="check-in" className="text-sm font-semibold">{t.hotel.checkIn}</Label>
              <Input id="check-in" type="date" value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)} className="h-12 text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="check-out" className="text-sm font-semibold">{t.hotel.checkOut}</Label>
              <Input id="check-out" type="date" value={checkOut} min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)} className="h-12 text-base" />
            </div>
          </div>
          {hasResult && (
            <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-900/20 rounded-lg px-4 py-2.5 border border-rose-200 dark:border-rose-800">
              <CalendarDays size={16} />
              {pluralNight(totalNights)} —{" "}
              <span className="font-normal text-muted-foreground">
                {pluralWeekday(weekdayNights)}, {pluralWeekend(weekendNights)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rates */}
      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.hotel.rates}</p>
          <div className="space-y-2">
            <Label htmlFor="nightly-rate" className="text-sm font-semibold">{t.hotel.nightlyRate}</Label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-muted-foreground select-none">$</span>
              <Input id="nightly-rate" type="number" min="0" step="1" value={nightlyRate}
                onChange={(e) => setNightlyRate(e.target.value ? parseFloat(e.target.value) : "")}
                className="pl-9 h-12 text-base" placeholder={t.hotel.nightlyPlaceholder} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weekend-rate" className="text-sm font-semibold">
              {t.hotel.weekendRate}{" "}
              <span className="text-xs font-normal text-muted-foreground">({t.hotel.weekendRateHint})</span>
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-muted-foreground select-none">$</span>
              <Input id="weekend-rate" type="number" min="0" step="1" value={weekendRate}
                onChange={(e) => setWeekendRate(e.target.value ? parseFloat(e.target.value) : "")}
                className="pl-9 h-12 text-base" placeholder={t.hotel.weekendPlaceholder} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget */}
      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.hotel.budgetCheck}</p>
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-sm font-semibold">
              {t.hotel.myBudget}{" "}
              <span className="text-xs font-normal text-muted-foreground">({t.common.optional})</span>
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-muted-foreground select-none">$</span>
              <Input id="budget" type="number" min="0" step="1" value={budget}
                onChange={(e) => setBudget(e.target.value ? parseFloat(e.target.value) : "")}
                className="pl-9 h-12 text-base" placeholder={t.hotel.budgetPlaceholder} />
            </div>
          </div>
          {maxNightsOnBudget !== null && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-4 py-2.5 border border-emerald-200 dark:border-emerald-800">
              <Wallet size={16} />
              {t.hotel.canAfford}{" "}
              <span className="font-bold">{pluralNight(maxNightsOnBudget)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-rose-500 text-white px-6 py-4">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">{t.hotel.totalCost}</p>
            <p className="text-5xl font-mono font-bold mt-1">
              {hasResult ? formatCurrency(totalCost) : "—"}
            </p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border">
            <StatBox icon={<Moon size={16} />}        label={t.hotel.totalNights}   value={hasResult ? String(totalNights) : "—"}          highlight />
            <StatBox icon={<Sun size={16} />}         label={t.hotel.avgNight}      value={hasResult ? formatCurrency(avgPerNight) : "—"}   />
            <StatBox icon={<CalendarDays size={16} />} label={t.hotel.weekendNights} value={hasResult ? String(weekendNights) : "—"}         />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatBox({ icon, label, value, highlight = false }: {
  icon: React.ReactNode; label: string; value: string; highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-5 px-3 text-center">
      <div className={`mb-1 ${highlight ? "text-rose-500" : "text-muted-foreground"}`}>{icon}</div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{label}</p>
      <p className={`font-mono font-bold text-xl ${highlight ? "text-rose-600 dark:text-rose-400" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
