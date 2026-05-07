"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Shortcut {
  keys: string[];
  label: string;
}

interface Group {
  title: string;
  items: Shortcut[];
}

const groups: Group[] = [
  {
    title: "Navigation",
    items: [
      { keys: ["⌘", "K"], label: "Command palette (global jump)" },
      { keys: ["/"], label: "Focus the agent bar" },
      { keys: ["?"], label: "Show this help" },
      { keys: ["Esc"], label: "Close any modal / palette" },
    ],
  },
  {
    title: "Project modal",
    items: [
      { keys: ["←", "→"], label: "Browse next / previous project" },
      { keys: ["Esc"], label: "Close modal" },
    ],
  },
  {
    title: "Agent commands (type anywhere)",
    items: [
      { keys: ["h", "i", "r", "e"], label: "Jump to Contact" },
      { keys: ["c", "a", "l", "l"], label: "Book a call" },
      { keys: ["c", "v"], label: "Open Visual CV" },
      { keys: ["c", "h", "a", "t"], label: "Open chat agent" },
      { keys: ["t", "o", "u", "r"], label: "Open the immersive tour" },
      { keys: ["b", "o", "o", "t"], label: "Replay intro sequence" },
      { keys: ["s", "h", "a", "m", "i"], label: "Personal greeting" },
    ],
  },
];

export function ShortcutsOverlay(): React.ReactElement {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "?") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (open && e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[160] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl rounded-xl bg-card border border-accent/20 shadow-2xl shadow-accent/15 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-card-border">
              <div>
                <p className="text-caption font-mono uppercase tracking-[0.25em] text-accent mb-1">
                  Keyboard shortcuts
                </p>
                <h2 className="text-lg md:text-xl font-bold">
                  Move through this site without touching the mouse.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="shrink-0 w-8 h-8 rounded-full border border-card-border hover:border-accent/40 hover:bg-card-hover flex items-center justify-center text-muted hover:text-foreground transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto px-5 md:px-6 py-5 md:py-6 space-y-6">
              {groups.map((g) => (
                <div key={g.title}>
                  <p className="text-caption font-mono uppercase tracking-[0.2em] text-muted/60 mb-3">
                    {g.title}
                  </p>
                  <div className="space-y-2">
                    {g.items.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between gap-4 py-1.5"
                      >
                        <span className="text-sm text-foreground/80">
                          {item.label}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          {item.keys.map((k, i) => (
                            <span key={i} className="inline-flex items-center gap-1">
                              <kbd className="inline-flex items-center justify-center min-w-[22px] h-6 px-1.5 text-small font-mono text-accent bg-accent/10 border border-accent/20 rounded">
                                {k}
                              </kbd>
                              {i < item.keys.length - 1 && (
                                <span className="text-muted/40 text-caption">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 md:px-6 py-3 border-t border-card-border bg-background/40 text-caption font-mono text-muted/60">
              <span>press ? anywhere to toggle</span>
              <span>esc to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
