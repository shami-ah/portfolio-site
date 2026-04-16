"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const facts = [
  { label: "Gogaa", value: "v0.9.1 · 1,418 tests" },
  { label: "CodeLens", value: "v0.3.3 · 305 patterns" },
  { label: "OpenEvent", value: "100+ clients · 150+ events" },
  { label: "Providers", value: "11 · unified streaming" },
  { label: "Stack", value: "React · TS · Supabase · OpenAI" },
];

export function NavTicker(): React.ReactElement {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % facts.length), 3500);
    return () => clearInterval(t);
  }, []);
  const f = facts[i];
  return (
    <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-muted/50 overflow-hidden h-4">
      <span className="w-1 h-1 rounded-full bg-accent/60 animate-pulse shrink-0" />
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="whitespace-nowrap"
        >
          <span className="text-accent/70">{f.label}</span>
          <span className="mx-1.5 text-muted/30">·</span>
          <span>{f.value}</span>
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
