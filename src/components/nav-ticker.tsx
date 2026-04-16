"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStatus } from "@/lib/use-status";

export function NavTicker(): React.ReactElement {
  const { status, isLive } = useStatus();
  const [i, setI] = useState(0);

  const facts = [
    { label: "Gogaa", value: `v${status.gogaa.version} · ${status.gogaa.tests.toLocaleString()} tests` },
    { label: "CodeLens", value: `v${status.codelens.version} · ${status.codelens.patterns} patterns` },
    { label: "OpenEvent", value: `${status.openevent.clients}+ clients · ${status.openevent.events}+ events` },
    { label: "Providers", value: `${status.gogaa.providers} · unified streaming` },
    { label: "Stack", value: "React · TS · Supabase · OpenAI" },
  ];

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % facts.length), 3500);
    return () => clearInterval(t);
  }, [facts.length]);

  const f = facts[i];
  return (
    <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-muted/50 overflow-hidden h-4">
      <span
        className={`w-1 h-1 rounded-full shrink-0 ${isLive ? "bg-green-400 animate-pulse" : "bg-accent/60 animate-pulse"}`}
        title={isLive ? "live" : "cached"}
      />
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
