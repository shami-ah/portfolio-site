"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProjectData } from "@/data/projects";

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

const typeColors: Record<string, string> = {
  "AI Dev Tool": "text-accent border-accent/30 bg-accent/10",
  "Production SaaS": "text-amber-400 border-amber-500/30 bg-amber-500/10",
  "Developer Tool": "text-green-400 border-green-500/30 bg-green-500/10",
  "Cross-Platform": "text-purple-400 border-purple-500/30 bg-purple-500/10",
  "Multi-Agent": "text-pink-400 border-pink-500/30 bg-pink-500/10",
  "AI / ML": "text-blue-400 border-blue-500/30 bg-blue-500/10",
  "DevOps": "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
};

export function ProjectModal({
  project,
  onClose,
}: ProjectModalProps): React.ReactElement {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-card-border rounded-2xl shadow-2xl shadow-accent/5 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-card/90 border border-card-border hover:border-accent/40 hover:bg-card-hover transition-all duration-200 flex items-center justify-center text-muted hover:text-foreground backdrop-blur-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-5 md:px-10 pt-6 md:pt-10 pb-24 md:pb-28">
              {/* Header — type + title + impact */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`px-2.5 py-1 text-[10px] md:text-xs font-mono rounded border ${
                      typeColors[project.type] ?? "text-muted border-card-border bg-card-hover"
                    }`}
                  >
                    {project.type}
                  </span>
                  {project.live && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] md:text-xs font-mono rounded border border-green-500/30 bg-green-500/10 text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">
                  {project.title}
                </h2>
                <p className="text-sm md:text-base text-muted mb-5">
                  {project.subtitle}
                </p>
                <p className="text-sm md:text-base text-foreground/90 leading-relaxed border-l-2 border-accent pl-4">
                  {project.impact}
                </p>
              </motion.div>

              {/* Problem / Solution split */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="mt-8 md:mt-10 grid md:grid-cols-2 gap-5 md:gap-6"
              >
                <div>
                  <p className="text-[10px] md:text-xs font-mono text-accent/70 uppercase tracking-[0.2em] mb-2">
                    Problem
                  </p>
                  <p className="text-xs md:text-sm text-muted leading-relaxed line-clamp-[8]">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-mono text-accent/70 uppercase tracking-[0.2em] mb-2">
                    Solution
                  </p>
                  <p className="text-xs md:text-sm text-muted leading-relaxed line-clamp-[8]">
                    {project.solution}
                  </p>
                </div>
              </motion.div>

              {/* Architecture flow */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className="mt-8 md:mt-10"
              >
                <p className="text-[10px] md:text-xs font-mono text-accent/70 uppercase tracking-[0.2em] mb-3">
                  System Architecture
                </p>
                <div className="p-4 md:p-5 rounded-xl bg-background/50 border border-card-border">
                  <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                    {project.architecture.slice(0, 8).map((node, i) => (
                      <motion.div
                        key={node}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.05, duration: 0.25 }}
                        className="flex items-center gap-1.5 md:gap-2"
                      >
                        <span className="px-2 md:px-2.5 py-1 md:py-1.5 text-[10px] md:text-[11px] font-mono bg-accent/10 text-accent/90 border border-accent/20 rounded whitespace-nowrap">
                          {node.split(/[(\n—]/)[0].trim().slice(0, 32)}
                        </span>
                        {i < Math.min(project.architecture.length, 8) - 1 && (
                          <span className="text-accent/40 text-xs">→</span>
                        )}
                      </motion.div>
                    ))}
                    {project.architecture.length > 8 && (
                      <span className="text-[10px] font-mono text-muted/50 ml-2">
                        +{project.architecture.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Key Results */}
              {project.results && project.results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.35 }}
                  className="mt-8 md:mt-10"
                >
                  <p className="text-[10px] md:text-xs font-mono text-accent/70 uppercase tracking-[0.2em] mb-3">
                    Key Results
                  </p>
                  <ul className="grid md:grid-cols-2 gap-2.5 md:gap-3">
                    {project.results.slice(0, 6).map((r, i) => (
                      <motion.li
                        key={r}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 + i * 0.04, duration: 0.25 }}
                        className="flex gap-2 text-xs md:text-sm text-muted leading-relaxed"
                      >
                        <span className="text-accent/70 shrink-0 mt-0.5">▸</span>
                        <span>{r}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Tech decisions preview */}
              {project.techDecisions && project.techDecisions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.35 }}
                  className="mt-8 md:mt-10"
                >
                  <p className="text-[10px] md:text-xs font-mono text-accent/70 uppercase tracking-[0.2em] mb-3">
                    Key Technical Decisions
                  </p>
                  <ul className="space-y-2">
                    {project.techDecisions.slice(0, 3).map((d, i) => (
                      <motion.li
                        key={d.title}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 + i * 0.05, duration: 0.25 }}
                        className="flex gap-2 items-start text-xs md:text-sm"
                      >
                        <span className="text-accent/60 mt-0.5 shrink-0">◆</span>
                        <span className="text-foreground/85">{d.title}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Stack */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.35 }}
                className="mt-8 md:mt-10"
              >
                <p className="text-[10px] md:text-xs font-mono text-accent/70 uppercase tracking-[0.2em] mb-3">
                  Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-[10px] md:text-[11px] font-mono bg-background/50 text-muted rounded border border-card-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sticky footer CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-card via-card to-card/90 border-t border-card-border backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-muted/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                  <span className="truncate">Quick overview · full case study for the deep dive</span>
                </div>
                <div className="flex gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 md:px-4 py-2 text-xs md:text-sm border border-card-border rounded-lg hover:border-accent/40 hover:bg-card-hover transition-all duration-200 text-muted hover:text-foreground"
                    >
                      GitHub
                    </a>
                  )}
                  <a
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 px-4 md:px-5 py-2 text-xs md:text-sm bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 group"
                  >
                    Read full case study
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
