"use client";

import { useEffect, useState } from "react";
import { useScrollLock } from "@/lib/use-scroll-lock";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { NeuralMap } from "./neural-map";
import { skillNodes, groupColors } from "@/data/skills-graph";

const groupLabels: Record<string, string> = {
  ai: "AI & ML",
  frontend: "Frontend",
  backend: "Backend",
  infra: "Infrastructure",
  tools: "Tools I Built",
};

export function SkillsModal(): React.ReactElement {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (): void => setOpen(true);
    window.addEventListener("show-skills-modal", handler);
    return () => window.removeEventListener("show-skills-modal", handler);
  }, []);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (typeof document === "undefined") return <></>;

  // Group skills for the legend
  const groups = Object.entries(groupLabels).map(([key, label]) => ({
    key,
    label,
    color: groupColors[key as keyof typeof groupColors],
    skills: skillNodes.filter((n) => n.group === key).map((n) => n.label),
  }));

  const el = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[80vh] rounded-xl bg-card/80 border border-card-border overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-card-border bg-card/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/70 cursor-pointer" onClick={() => setOpen(false)} />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="font-mono text-sm text-muted/60">neural-map — skills &amp; expertise</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-caption font-mono text-muted/40">{skillNodes.length} nodes · hover to explore</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-muted/60 hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body — neural map + legend */}
            <div className="flex-1 flex overflow-hidden">
              {/* Neural map canvas */}
              <div className="flex-1 relative">
                <NeuralMap />
              </div>

              {/* Legend sidebar */}
              <div className="w-56 shrink-0 border-l border-card-border p-4 overflow-y-auto hidden md:block">
                <p className="text-caption font-mono text-muted/60 uppercase tracking-wider mb-4">
                  Skill Groups
                </p>
                <div className="space-y-4">
                  {groups.map((g) => (
                    <div key={g.key}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: g.color }}
                        />
                        <span className="text-xs font-medium text-foreground/80">{g.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pl-4">
                        {g.skills.map((s) => (
                          <span key={s} className="text-caption font-mono text-muted/60 bg-card-hover px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-card-border/40">
                  <p className="text-caption font-mono text-muted/40 leading-relaxed">
                    Nodes sized by expertise level. Edges show how skills connect in my workflow. Hover any node to highlight its cluster.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-card-border bg-card/20 shrink-0">
              <span className="text-caption font-mono text-muted/40">
                5 groups · {skillNodes.length} technologies · production-tested
              </span>
              <kbd className="text-caption font-mono text-muted/40 border border-card-border px-1.5 py-0.5 rounded">
                ESC to close
              </kbd>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(el, document.body);
}
