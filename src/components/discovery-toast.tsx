"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Floating toast that reveals interactive affordances (⌘K, easter-egg
 *  typing) after a short delay, once per session. Auto-dismisses. */
export function DiscoveryToast(): React.ReactElement {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("discovery-seen")) return;

    // Wait until the user has had a moment to breathe
    const bootComplete = sessionStorage.getItem("boot-complete");
    const initialDelay = bootComplete ? 12000 : 18000;

    const showTimer = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem("discovery-seen", "1");
    }, initialDelay);

    return () => clearTimeout(showTimer);
  }, []);

  // Auto-dismiss after 10s
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 10000);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-20 left-5 md:left-auto md:right-5 md:bottom-[5.25rem] z-[45] max-w-[calc(100vw-2.5rem)] md:max-w-sm pointer-events-auto"
        >
          <div className="p-4 rounded-xl bg-card/95 backdrop-blur-md border border-accent/30 shadow-2xl shadow-accent/20 relative">
            <button
              type="button"
              onClick={() => setShow(false)}
              aria-label="Dismiss"
              className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-muted/50 hover:text-foreground transition-colors"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex items-start gap-3 pr-4">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-accent"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-semibold mb-1.5">
                  Hidden layer unlocked
                </p>
                <p className="text-[11px] md:text-xs text-muted leading-relaxed mb-2.5">
                  Press{" "}
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-background/60 border border-card-border rounded">
                    ⌘K
                  </kbd>{" "}
                  for the command palette. Or{" "}
                  <span className="text-accent">just start typing</span> words
                  like{" "}
                  <span className="font-mono text-accent">shami</span>,{" "}
                  <span className="font-mono text-accent">hire</span>, or{" "}
                  <span className="font-mono text-accent">wow</span>.
                </p>
                <p className="text-[10px] font-mono text-muted/50">
                  secrets hidden throughout
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
