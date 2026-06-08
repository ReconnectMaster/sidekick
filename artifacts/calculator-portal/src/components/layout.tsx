import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Calculator,
  ShoppingCart,
  Percent,
  TrendingUp,
  Receipt,
  Bed,
  FileText,
  Moon,
  Sun,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslation, LangToggle } from "@/i18n";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(!isDark);

  const navItems = [
    { href: "/",           label: t.nav.home,      icon: Calculator  },
    { href: "/shopping",   label: t.nav.shopping,   icon: ShoppingCart },
    { href: "/discount",   label: t.nav.discount,   icon: Percent     },
    { href: "/profit",     label: t.nav.profit,     icon: TrendingUp  },
    { href: "/vat",        label: t.nav.vat,        icon: Receipt     },
    { href: "/hotel",      label: t.nav.hotel,      icon: Bed         },
    { href: "/word-count", label: t.nav.wordCount,  icon: FileText    },
  ];

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <div
              onClick={onClick}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground font-sans">
      {/* Mobile Header — menu + dark mode LEFT · logo CENTER · lang toggle RIGHT */}
      <header className="md:hidden flex items-center p-3 border-b border-border bg-card">
        {/* Left: hamburger + dark mode */}
        <div className="flex items-center gap-1">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px]">
              <div className="flex items-center gap-2 font-bold mb-6 mt-4">
                <Calculator className="text-primary" />
                <span>CalcPortal</span>
              </div>
              <NavLinks />
            </SheetContent>
          </Sheet>
          <Button variant="ghost" size="icon" onClick={toggleDark}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>

        {/* Center: logo */}
        <div className="flex-1 flex items-center justify-center gap-2 font-bold text-base">
          <Calculator size={18} className="text-primary" />
          <span>CalcPortal</span>
        </div>

        {/* Right: language toggle */}
        <div className="flex items-center">
          <LangToggle />
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 p-4 shrink-0">
        <div className="flex items-center gap-2 font-bold text-xl mb-8 px-2">
          <Calculator className="text-primary" />
          <span>CalcPortal</span>
        </div>
        <div className="flex-1">
          <NavLinks />
        </div>
        <div className="pt-4 border-t border-border mt-auto space-y-2">
          <div className="px-1">
            <LangToggle />
          </div>
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={toggleDark}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDark ? t.common.lightMode : t.common.darkMode}</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
