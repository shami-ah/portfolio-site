"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface YearContext {
  year: number;
  label: string;
  lines: string[];
}

const contexts: YearContext[] = [
  {
    year: 2019,
    label: "origin",
    lines: [
      "Started shipping ML/NLP projects on Upwork and Fiverr",
      "Python + sklearn + early transformer API wrappers",
      "Learned the hard way: demos ≠ production",
    ],
  },
  {
    year: 2021,
    label: "model evaluation",
    lines: [
      "500+ RLHF / SFT sessions on frontier models",
      "Outlier, RWS, Translated — ringside seat to model behavior",
      "Started thinking about guardrails before hallucination was a headline",
    ],
  },
  {
    year: 2022,
    label: "leadership",
    lines: [
      "Director of IT & R&D at Rouelite Techno",
      "10-person team, CRM serving 500+ daily users",
      "First time owning architecture end-to-end",
    ],
  },
  {
    year: 2024,
    label: "tool-builder",
    lines: [
      "Started CodeLens because no commercial tool caught what I saw in PRs",
      "305 patterns, 9 stacks, cross-file taint tracking",
      "Guardian mode: inject rules into Claude Code / Cursor / Copilot",
    ],
  },
  {
    year: 2025,
    label: "openevent launch",
    lines: [
      "Upwork gig → full-time Lead AI Developer at More Life Hospitality",
      "Architected OpenEvent from scratch: email → AI → approve → execute",
      "pgvector, Edge Functions, Stripe, full multi-tenant",
    ],
  },
  {
    year: 2026,
    label: "now",
    lines: [
      "Gogaa v0.9.1 shipped: 11 providers, 1,418 tests, Aider parity",
      "OpenEvent live with 100+ clients across 150+ events",
      "Building what comes next: Architect Mode, Spec-to-Code Traceability",
    ],
  },
];

export function TimeMachine(): React.ReactElement {
  const [idx, setIdx] = useState(contexts.length - 1);
  const [userInteracted, setUserInteracted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Auto-advance once when mounted (on first view)
  useEffect(() => {
    if (userInteracted) return;
    const total = contexts.length;
    let i = 0;
    const t = setInterval(() => {
      if (i >= total) {
        clearInterval(t);
        setIdx(total - 1);
        return;
      }
      setIdx(i);
      i++;
    }, 700);
    return () => clearInterval(t);
  }, [userInteracted]);

  // Update idx from pointer X on the track
  const updateFromPointer = (clientX: number): void => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const next = Math.min(contexts.length - 1, Math.floor(ratio * contexts.length));
    if (next !== idx) setIdx(next);
  };

  // Drag lifecycle
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent): void => {
      e.preventDefault();
      updateFromPointer(e.clientX);
    };
    const onUp = (): void => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, idx]);

  const ctx = contexts[idx];

  return (
    <div className="mb-10 md:mb-14 p-5 md:p-7 rounded-2xl bg-gradient-to-br from-accent/[0.05] via-card to-card border border-card-border relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="flex items-center justify-between mb-5 gap-3">
        <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-accent flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          time machine
        </p>
        <p className="text-[10px] font-mono text-muted/50 hidden sm:block">
          drag or click a year
        </p>
      </div>

      {/* Year row */}
      <div className="flex items-center justify-between gap-1 md:gap-2 mb-3">
        {contexts.map((c, i) => {
          const active = i === idx;
          return (
            <button
              key={c.year}
              type="button"
              onClick={() => {
                setUserInteracted(true);
                setIdx(i);
              }}
              className={`flex-1 text-[10px] md:text-xs font-mono py-1.5 rounded transition-all ${
                active
                  ? "text-accent font-bold"
                  : "text-muted/50 hover:text-muted"
              }`}
            >
              {c.year}
            </button>
          );
        })}
      </div>

      {/* Draggable track */}
      <div
        ref={trackRef}
        role="slider"
        aria-valuemin={contexts[0].year}
        aria-valuemax={contexts[contexts.length - 1].year}
        aria-valuenow={ctx.year}
        tabIndex={0}
        onPointerDown={(e) => {
          e.preventDefault();
          setUserInteracted(true);
          setDragging(true);
          updateFromPointer(e.clientX);
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            setUserInteracted(true);
            setIdx((i) => Math.max(0, i - 1));
          } else if (e.key === "ArrowRight") {
            setUserInteracted(true);
            setIdx((i) => Math.min(contexts.length - 1, i + 1));
          }
        }}
        className={`relative h-8 mb-6 touch-none cursor-grab ${
          dragging ? "cursor-grabbing" : ""
        }`}
        style={{ touchAction: "none" }}
      >
        {/* Visual track */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-card-border rounded-full pointer-events-none" />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-gradient-to-r from-accent to-accent/70 rounded-full pointer-events-none"
          animate={{ width: `${((idx + 0.5) / contexts.length) * 100}%` }}
          transition={{ duration: dragging ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          animate={{ left: `calc(${((idx + 0.5) / contexts.length) * 100}% - 10px)` }}
          transition={{ duration: dragging ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-accent shadow-lg shadow-accent/40 ring-4 ring-background pointer-events-none"
        />
      </div>

      {/* Context card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={ctx.year}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <p className="text-3xl md:text-4xl font-bold font-mono text-foreground">
              {ctx.year}
            </p>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded border border-accent/30 bg-accent/10 text-accent">
              {ctx.label}
            </span>
          </div>
          <ul className="space-y-1.5">
            {ctx.lines.map((l) => (
              <li
                key={l}
                className="flex gap-2 text-xs md:text-sm text-muted leading-relaxed"
              >
                <span className="text-accent/60 shrink-0 mt-0.5">▸</span>
                {l}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
