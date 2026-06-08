import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ShoppingCart,
  Percent,
  TrendingUp,
  Receipt,
  Bed,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/i18n";

export default function Home() {
  const { t } = useTranslation();

  const tools = [
    { href: "/shopping",   key: "shopping"  as const, icon: ShoppingCart, color: "text-blue-500",   bg: "bg-blue-500/10"   },
    { href: "/discount",   key: "discount"  as const, icon: Percent,      color: "text-green-500",  bg: "bg-green-500/10"  },
    { href: "/profit",     key: "profit"    as const, icon: TrendingUp,   color: "text-purple-500", bg: "bg-purple-500/10" },
    { href: "/vat",        key: "vat"       as const, icon: Receipt,      color: "text-amber-500",  bg: "bg-amber-500/10"  },
    { href: "/hotel",      key: "hotel"     as const, icon: Bed,          color: "text-rose-500",   bg: "bg-rose-500/10"   },
    { href: "/word-count", key: "wordCount" as const, icon: FileText,     color: "text-indigo-500", bg: "bg-indigo-500/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
          {t.home.title}
        </h1>
        <p className="text-xl text-muted-foreground">{t.home.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          const entry = t.home.tools[tool.key];
          return (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={tool.href}>
                <Card className="group h-full cursor-pointer hover:border-primary/50 transition-colors hover:shadow-md">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tool.bg} ${tool.color}`}>
                      <Icon size={24} />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {entry.title}
                      <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {entry.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
