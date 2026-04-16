"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TRACKED_SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Stack" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

export function ExplorationHud(): React.ReactElement | null {
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [hidden, setHidden] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [nudgeFired, setNudgeFired] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const seenRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("hud-hidden")) {
      setHidden(true);
      return;
    }

    const observers: IntersectionObserver[] = [];
    for (const s of TRACKED_SECTIONS) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
              seenRef.current.add(s.id);
              setSeen(new Set(seenRef.current));
            }
          }
        },
        { threshold: [0.35] },
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Fire nudge once when ≥4 sections explored
  useEffect(() => {
    if (nudgeFired) return;
    if (seen.size >= 4) {
      setNudgeFired(true);
      setShowNudge(true);
      setTimeout(() => setShowNudge(false), 9000);
    }
  }, [seen, nudgeFired]);

  const dismiss = (): void => {
    sessionStorage.setItem("hud-hidden", "1");
    setHidden(true);
  };

  if (hidden) return null;

  const total = TRACKED_SECTIONS.length;
  const count = seen.size;
  const percent = Math.round((count / total) * 100);

  return (
    <>
      {/* HUD dot/pill bottom-left */}
      <div className="fixed bottom-5 left-5 z-40 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="group"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >
          <motion.div
            layout
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/85 backdrop-blur-md border border-card-border hover:border-accent/30 transition-colors cursor-default"
          >
            {/* Progress ring */}
            <div className="relative w-5 h-5 shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                className="-rotate-90"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  className="text-card-border"
                />
                <motion.circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  className="text-accent"
                  style={{
                    strokeDasharray: 2 * Math.PI * 8,
                    strokeDashoffset:
                      2 * Math.PI * 8 * (1 - count / total),
                  }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 8 * (1 - count / total),
                  }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] font-mono text-accent/80 tabular-nums">
                  {count}
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!expanded && (
                <motion.p
                  key="compact"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] font-mono text-muted/70 whitespace-nowrap overflow-hidden"
                >
                  {percent}% explored
                </motion.p>
              )}
              {expanded && (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  <div className="flex items-center gap-2 text-[10px] font-mono text-muted/70">
                    <span>{count}/{total} sections</span>
                    <button
                      type="button"
                      onClick={dismiss}
                      aria-label="Hide"
                      className="text-muted/40 hover:text-muted transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Nudge toast after 4+ sections */}
      <AnimatePresence>
        {showNudge && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 left-5 z-40 max-w-xs pointer-events-auto"
          >
            <div className="p-4 rounded-xl bg-card/95 backdrop-blur-md border border-accent/30 shadow-xl shadow-accent/20 relative">
              <p className="text-xs md:text-sm mb-2.5 leading-relaxed">
                <span className="text-accent font-semibold">
                  You&apos;ve seen most of the work.
                </span>{" "}
                <span className="text-muted">Want to talk about a project?</span>
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="https://calendly.com/shami8024/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono px-3 py-1.5 rounded-md bg-accent text-white hover:bg-accent/90 transition-all"
                >
                  book 15-min call →
                </a>
                <button
                  type="button"
                  onClick={() => setShowNudge(false)}
                  className="text-[11px] font-mono text-muted/50 hover:text-muted px-2"
                >
                  later
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
