"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeStop {
  time: string;
  label: string;
  lines: string[];
}

const stops: TimeStop[] = [
  {
    time: "07:00",
    label: "input",
    lines: [
      "CodeLens reports on every repo I touched yesterday",
      "Triage what matters. File issues for what doesn't",
      "Coffee. Terminal. Zero unread before anything new",
    ],
  },
  {
    time: "08:00",
    label: "spec",
    lines: [
      "One feature. Open spec file. Sketch the architecture",
      "Use gogaa /architect to diagram dependencies and data flow",
      "Save the diagram to memory. No code yet",
    ],
  },
  {
    time: "10:00",
    label: "build",
    lines: [
      "Gogaa reads spec + patterns. Produces a SEARCH/REPLACE diff",
      "I review block by block. ~90% accepted first pass",
      "Tests written alongside, not after. If specs are right, code falls out",
    ],
  },
  {
    time: "13:00",
    label: "review",
    lines: [
      "Claude Code + CodeLens in parallel on every PR",
      "Merge only after both pass. No exceptions",
      "Guardian mode prevents half the bug classes upstream",
    ],
  },
  {
    time: "15:00",
    label: "deep",
    lines: [
      "Tool-building (gogaa, CodeLens) or hard research",
      "No meetings, no Slack. Timer at 90 minutes",
      "This is where the real leverage comes from",
    ],
  },
  {
    time: "18:00",
    label: "close",
    lines: [
      "Write down what I learned. Update CLAUDE.md",
      "Save feedback to agent memory. Commit. Ship",
      "Tomorrow's 07:00 review starts from a clean state",
    ],
  },
];

export function TimeMachine(): React.ReactElement {
  const [idx, setIdx] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Auto-advance once when mounted (on first view)
  useEffect(() => {
    if (userInteracted) return;
    const total = stops.length;
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
  const updateFromPointer = useCallback((clientX: number): void => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const next = Math.min(stops.length - 1, Math.floor(ratio * stops.length));
    if (next !== idx) setIdx(next);
  }, [idx]);

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
  }, [dragging, updateFromPointer]);

  const stop = stops[idx];

  return (
    <div className="mb-10 md:mb-14 p-5 md:p-7 rounded-xl bg-gradient-to-br from-accent/[0.05] via-card to-card border border-card-border relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="flex items-center justify-between mb-5 gap-3">
        <p className="text-caption md:text-xs font-mono uppercase tracking-[0.25em] text-accent flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          a day in the life
        </p>
        <p className="text-caption font-mono text-muted/60 hidden sm:block">
          drag or click a time block
        </p>
      </div>

      {/* Time row */}
      <div className="flex items-center justify-between gap-1 md:gap-2 mb-3">
        {stops.map((s, i) => {
          const active = i === idx;
          return (
            <button
              key={s.time}
              type="button"
              onClick={() => {
                setUserInteracted(true);
                setIdx(i);
              }}
              className={`flex-1 text-caption md:text-xs font-mono py-1.5 rounded transition-all ${
                active
                  ? "text-accent font-bold"
                  : "text-muted/60 hover:text-muted"
              }`}
            >
              {s.time}
            </button>
          );
        })}
      </div>

      {/* Draggable track */}
      <div
        ref={trackRef}
        role="slider"
        aria-label="Time of day slider"
        aria-valuemin={7}
        aria-valuemax={18}
        aria-valuenow={parseInt(stop.time)}
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
            setIdx((i) => Math.min(stops.length - 1, i + 1));
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
          animate={{ width: `${((idx + 0.5) / stops.length) * 100}%` }}
          transition={{ duration: dragging ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          animate={{ left: `calc(${((idx + 0.5) / stops.length) * 100}% - 10px)` }}
          transition={{ duration: dragging ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-accent shadow-lg shadow-accent/40 ring-4 ring-background pointer-events-none"
        />
      </div>

      {/* Context card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stop.time}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <p className="text-3xl md:text-4xl font-bold font-mono text-foreground">
              {stop.time}
            </p>
            <span className="px-2 py-0.5 text-caption font-mono rounded border border-accent/20 bg-accent/10 text-accent">
              {stop.label}
            </span>
          </div>
          <ul className="space-y-1.5">
            {stop.lines.map((l) => (
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
