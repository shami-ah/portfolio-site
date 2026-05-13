"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

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
    <section className="my-10 md:my-14 p-5 md:p-8 rounded-xl bg-gradient-to-br from-accent/[0.06] via-card to-card border border-accent/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

      <p className="text-caption md:text-xs font-mono uppercase tracking-[0.25em] text-accent mb-3 flex items-center gap-2">
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
                  ? "border-card-border bg-card/40 hover:border-accent/40 hover:bg-accent/5 cursor-pointer"
                  : isMine
                    ? "border-green-500/50 bg-green-500/10"
                    : isPicked
                      ? "border-accent/40 bg-accent/10"
                      : isCommon
                        ? "border-accent-secondary/30 bg-accent-secondary/5"
                        : "border-card-border bg-card/20 opacity-60"
              }`}
            >
              <span
                className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-caption font-mono mt-0.5 ${
                  picked === null
                    ? "border-muted/40 text-muted/60"
                    : isMine
                      ? "border-green-400 text-green-400 bg-green-500/10"
                      : isPicked
                        ? "border-accent text-accent bg-accent/10"
                        : isCommon
                          ? "border-accent-secondary/50 text-accent-secondary"
                          : "border-muted/20 text-muted/40"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-sm md:text-lead leading-relaxed">
                {opt}
              </span>
              {picked !== null && (
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {isMine && (
                    <span className="text-caption font-mono text-green-400 px-1.5 py-0.5 rounded border border-green-500/30 bg-green-500/10">
                      what I did
                    </span>
                  )}
                  {isCommon && !isMine && (
                    <span className="text-caption font-mono text-accent-secondary px-1.5 py-0.5 rounded border border-accent-secondary/30 bg-accent-secondary/10">
                      common pick
                    </span>
                  )}
                  {isPicked && !isMine && !isCommon && (
                    <span className="text-caption font-mono text-accent px-1.5 py-0.5 rounded border border-accent/20 bg-accent/10">
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
            <p className="text-caption font-mono uppercase tracking-[0.25em] text-green-400 mb-2 flex items-center gap-2">
              <Check size={10} strokeWidth={3} />
              {matched ? "you got it — here's why" : "here's what I actually did"}
            </p>
            <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
              {decision.reasoning}
            </p>

            {!matched && (
              <button
                type="button"
                onClick={() => setPicked(null)}
                className="mt-4 text-caption font-mono text-muted/60 hover:text-muted transition-colors"
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
