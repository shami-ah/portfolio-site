"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProjectData } from "@/data/projects";

type Role = "user" | "me";

interface Bubble {
  role: Role;
  text: string;
  delayMs?: number;
}

function buildBubbles(project: ProjectData): Bubble[] {
  const bubbles: Bubble[] = [];

  bubbles.push({ role: "user", text: `Tell me about ${project.title}.` });
  bubbles.push({ role: "me", text: project.impact });

  bubbles.push({ role: "user", text: "What was the problem you were solving?" });
  bubbles.push({ role: "me", text: project.problem });

  bubbles.push({ role: "user", text: "What did you actually build?" });
  bubbles.push({ role: "me", text: project.solution });

  if (project.techDecisions && project.techDecisions.length > 0) {
    bubbles.push({
      role: "user",
      text: "What's the most interesting technical decision in there?",
    });
    const d = project.techDecisions[0];
    bubbles.push({ role: "me", text: `${d.title}.` });
    bubbles.push({ role: "me", text: d.description });
  }

  if (project.results && project.results.length > 0) {
    bubbles.push({ role: "user", text: "What's the outcome?" });
    const top = project.results.slice(0, 3);
    bubbles.push({ role: "me", text: top.join(" · ") });
  }

  bubbles.push({ role: "user", text: "How do I work with you on something like this?" });
  bubbles.push({
    role: "me",
    text:
      "Easiest path: book a 15-min call at calendly.com/shami8024/30min. We'll talk scope and timeline. I'll follow up with an architecture doc before any code.",
  });

  return bubbles;
}

export function Story({ project }: { project: ProjectData }): React.ReactElement {
  const bubbles = buildBubbles(project);
  const [shown, setShown] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom as bubbles reveal
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [shown]);

  // Auto-reveal next bubble every 1.8s until user interacts
  const [autoPlay, setAutoPlay] = useState(true);
  useEffect(() => {
    if (!autoPlay) return;
    if (shown >= bubbles.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), 1600);
    return () => clearTimeout(t);
  }, [shown, autoPlay, bubbles.length]);

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col">
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-card-border">
        <div className="max-w-3xl mx-auto px-5 md:px-6 py-3 flex items-center justify-between gap-3">
          <a
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-accent transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            full case study
          </a>
          <p className="text-[10px] md:text-xs font-mono text-muted/70 truncate">
            story mode · <span className="text-accent">{project.title}</span>
          </p>
          <button
            type="button"
            onClick={() => setAutoPlay((v) => !v)}
            className="text-[10px] font-mono px-2 py-1 rounded border border-card-border bg-card/60 text-muted hover:text-accent transition-all"
          >
            {autoPlay ? "⏸ pause" : "▶ play"}
          </button>
        </div>
      </header>

      {/* Chat */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-4">
          {bubbles.slice(0, shown).map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`flex ${b.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl text-sm md:text-[15px] leading-relaxed ${
                  b.role === "user"
                    ? "bg-accent text-white rounded-br-md"
                    : "bg-card border border-card-border text-foreground/90 rounded-bl-md"
                }`}
              >
                {b.role === "me" && (
                  <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-accent/70 mb-1.5">
                    ahtesham
                  </p>
                )}
                <p className="whitespace-pre-wrap">{b.text}</p>
              </div>
            </motion.div>
          ))}

          {/* Dots while waiting */}
          {autoPlay && shown < bubbles.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-card border border-card-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                    className="w-1.5 h-1.5 rounded-full bg-accent/70"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* End CTA */}
        <AnimatePresence>
          {shown >= bubbles.length && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto px-4 md:px-6 pb-10"
            >
              <div className="p-5 md:p-6 rounded-xl bg-gradient-to-br from-accent/10 via-card to-card border border-accent/30 text-center">
                <p className="text-sm md:text-base mb-4 text-muted">
                  That&apos;s the short version. Want the full case study or to talk about your own system?
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <a
                    href={`/projects/${project.slug}`}
                    className="px-4 py-2 text-sm rounded-lg border border-card-border hover:border-accent/40 text-muted hover:text-foreground transition-all"
                  >
                    full case study →
                  </a>
                  <a
                    href="https://calendly.com/shami8024/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-all"
                  >
                    book 15-min call →
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
