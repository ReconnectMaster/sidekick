import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, Type, AlignLeft, Minus, Pilcrow, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/i18n";

export default function WordCount() {
  const { t } = useTranslation();
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words      = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const chars      = text.length;
    const charsNoSp  = text.replace(/\s/g, "").length;
    const sentences  = text === "" ? 0 : (text.match(/[.!?]+/g) || []).length;
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n\n+/).filter((p) => p.trim() !== "").length;
    const lines      = text === "" ? 0 : text.split("\n").length;
    return { words, chars, charsNoSp, sentences, paragraphs, lines };
  }, [text]);

  const readingMins = Math.ceil(stats.words / 200);

  const statCards = [
    { label: t.wordCount.words,        value: stats.words,     icon: <Type size={18} />,      color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10" },
    { label: t.wordCount.characters,   value: stats.chars,     icon: <FileText size={18} />,  color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10" },
    { label: t.wordCount.charsNoSpaces,value: stats.charsNoSp, icon: <Minus size={18} />,     color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10" },
    { label: t.wordCount.sentences,    value: stats.sentences, icon: <AlignLeft size={18} />, color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-500/10" },
    { label: t.wordCount.paragraphs,   value: stats.paragraphs,icon: <Pilcrow size={18} />,   color: "text-sky-600 dark:text-sky-400",      bg: "bg-sky-500/10" },
    { label: t.wordCount.lines,        value: stats.lines,     icon: <AlignLeft size={18} />, color: "text-cyan-600 dark:text-cyan-400",    bg: "bg-cyan-500/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 max-w-2xl mx-auto pb-12"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
          <FileText size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.wordCount.title}</h1>
          <p className="text-muted-foreground">{t.wordCount.subtitle}</p>
        </div>
      </div>

      <Card className="border-t-4 border-t-indigo-500 shadow-sm">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="text-input" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t.wordCount.yourText}
            </Label>
            {text.length > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                onClick={() => setText("")} data-testid="button-clear">
                <RotateCcw size={12} />
                {t.wordCount.clear}
              </Button>
            )}
          </div>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.wordCount.placeholder}
            className="w-full min-h-[220px] resize-y rounded-lg border border-input bg-background px-4 py-3 text-base leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-colors"
            data-testid="textarea-text"
          />
          <p className="text-xs text-muted-foreground text-right">{t.wordCount.hint}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statCards.map((s) => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.bg} ${s.color}`}>
                {s.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate">{s.label}</p>
                <p className={`font-mono font-bold text-2xl leading-tight ${s.color}`}>
                  {s.value.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.words > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-indigo-500 text-white px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-indigo-500/20"
        >
          <div>
            <p className="font-bold text-base">{t.wordCount.readingTime}</p>
            <p className="text-sm opacity-80 mt-0.5">{t.wordCount.readingTimeHint}</p>
          </div>
          <div className="font-mono font-bold text-3xl shrink-0">
            {readingMins} {readingMins === 1 ? t.wordCount.min : t.wordCount.mins}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
