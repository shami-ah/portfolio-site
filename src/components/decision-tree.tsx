"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Decision {
  scenario: string;
  question: string;
  options: string[];
  commonChoice: number;
  myChoice: number;
  reasoning: string;
}

export function DecisionTree({ decision }: { decision: Decision }): React.ReactElement {
  const [picked, setPicked] = useState<number | null>(null);

  const matched = picked === decision.myChoice;

  return (
    <section className="my-10 md:my-14 p-5 md:p-8 rounded-2xl bg-gradient-to-br from-accent/[0.06] via-card to-card border border-accent/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

      <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-accent mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        your call, architect
      </p>

      <h3 className="text-lg md:text-xl font-bold mb-3 leading-tight">
        {decision.scenario}
      </h3>
      <p className="text-sm md:text-base text-muted mb-5 leading-relaxed">
        {decision.question}
      </p>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {decision.options.map((opt, i) => {
          const isPicked = picked === i;
          const isMine = picked !== null && i === decision.myChoice;
          const isCommon = picked !== null && i === decision.commonChoice && i !== decision.myChoice;
          return (
            <motion.button
              key={opt}
              type="button"
              disabled={picked !== null}
              onClick={() => setPicked(i)}
              whileHover={picked === null ? { x: 4 } : {}}
              className={`w-full text-left p-3 md:p-4 rounded-lg border transition-all duration-300 flex items-start gap-3 ${
                picked === null
                  ? "border-card-border bg-card/50 hover:border-accent/40 hover:bg-accent/5 cursor-pointer"
                  : isMine
                    ? "border-green-500/50 bg-green-500/10"
                    : isPicked
                      ? "border-accent/40 bg-accent/10"
                      : isCommon
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-card-border bg-card/30 opacity-60"
              }`}
            >
              <span
                className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-mono mt-0.5 ${
                  picked === null
                    ? "border-muted/40 text-muted/60"
                    : isMine
                      ? "border-green-400 text-green-400 bg-green-500/10"
                      : isPicked
                        ? "border-accent text-accent bg-accent/10"
                        : isCommon
                          ? "border-amber-500/50 text-amber-400"
                          : "border-muted/20 text-muted/40"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-sm md:text-[15px] leading-relaxed">
                {opt}
              </span>
              {picked !== null && (
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {isMine && (
                    <span className="text-[9px] font-mono text-green-400 px-1.5 py-0.5 rounded border border-green-500/30 bg-green-500/10">
                      what I did
                    </span>
                  )}
                  {isCommon && !isMine && (
                    <span className="text-[9px] font-mono text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/10">
                      common pick
                    </span>
                  )}
                  {isPicked && !isMine && !isCommon && (
                    <span className="text-[9px] font-mono text-accent px-1.5 py-0.5 rounded border border-accent/30 bg-accent/10">
                      your pick
                    </span>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Reveal */}
      <AnimatePresence>
        {picked !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 pt-5 border-t border-accent/20"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-green-400 mb-2 flex items-center gap-2">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {matched ? "you got it — here's why" : "here's what I actually did"}
            </p>
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
              {decision.reasoning}
            </p>

            {!matched && (
              <button
                type="button"
                onClick={() => setPicked(null)}
                className="mt-4 text-[10px] font-mono text-muted/50 hover:text-muted transition-colors"
              >
                ↻ try another option
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
