import { createContext, useContext, useState } from "react";
import { Lang, Translations, translations } from "./translations";
import { formatCurrency as _fmt } from "@/lib/format";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    return (stored === "th" ? "th" : "en") as Lang;
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang: handleSetLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

const CURRENCY: Record<Lang, { code: string; symbol: string }> = {
  en: { code: "USD", symbol: "$" },
  th: { code: "THB", symbol: "฿" },
};

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  const cur = CURRENCY[ctx.lang];
  const fmtCurrency = (amount: number) => _fmt(amount, cur.code);
  return { ...ctx, currency: cur.code, currencySymbol: cur.symbol, fmtCurrency };
}

export function LangToggle() {
  const { lang, setLang } = useTranslation();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "th" : "en")}
      aria-label="Toggle language"
      className="flex items-center gap-0.5 px-2 py-1 rounded-md text-[11px] font-bold tracking-wider border border-border hover:border-primary/60 transition-colors select-none"
      data-testid="button-lang-toggle"
    >
      <span className={lang === "en" ? "text-foreground" : "text-muted-foreground"}>EN</span>
      <span className="text-muted-foreground px-0.5">|</span>
      <span className={lang === "th" ? "text-foreground" : "text-muted-foreground"}>TH</span>
    </button>
  );
}
