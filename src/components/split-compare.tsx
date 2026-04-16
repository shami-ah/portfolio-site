"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplitCompareProps {
  mine: { title: string; bullets: string[] };
  standard: { title: string; bullets: string[] };
}

export function SplitCompare({ mine, standard }: SplitCompareProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <section className="my-10 md:my-14">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left p-5 md:p-6 rounded-xl border border-card-border hover:border-accent/40 bg-card/40 hover:bg-card/70 transition-all group"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-accent/80 mb-2">
              side-by-side
            </p>
            <h3 className="text-base md:text-lg font-bold">
              My approach vs the standard approach
            </h3>
            <p className="text-xs md:text-sm text-muted mt-1">
              Tap to compare {mine.title} with {standard.title}.
            </p>
          </div>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="shrink-0 w-7 h-7 rounded-full border border-accent/30 bg-accent/10 text-accent flex items-center justify-center"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 12 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              {/* Mine */}
              <div className="relative p-5 md:p-6 rounded-xl bg-gradient-to-br from-accent/[0.08] via-card to-card border border-accent/30">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                    my approach
                  </p>
                </div>
                <h4 className="text-base md:text-lg font-bold mb-3">{mine.title}</h4>
                <ul className="space-y-2">
                  {mine.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-2 text-xs md:text-sm text-foreground/90 leading-relaxed"
                    >
                      <span className="text-accent shrink-0 mt-0.5">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Standard */}
              <div className="p-5 md:p-6 rounded-xl bg-card/40 border border-card-border">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted/40" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted/60">
                    standard approach
                  </p>
                </div>
                <h4 className="text-base md:text-lg font-bold text-muted mb-3">
                  {standard.title}
                </h4>
                <ul className="space-y-2">
                  {standard.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-2 text-xs md:text-sm text-muted/70 leading-relaxed"
                    >
                      <span className="text-muted/40 shrink-0 mt-0.5">✕</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
