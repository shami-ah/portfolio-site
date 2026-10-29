"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AgentEmoji, type EmojiMood } from "@/components/agent-visuals";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ------------------------------------------------------------------ */
/*  Story primitives — the plain-lens presentation layer.              */
/*  Motion rule: things move only when content arrives or changes.     */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Splits "~1,400+" into prefix "~", number 1400, suffix "+". Non-numeric values pass through untouched. */
function parseMetric(value: string): { prefix: string; target: number; decimals: number; grouped: boolean; suffix: string } | null {
  const match = value.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const raw = match[2];
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  return {
    prefix: match[1],
    target: Number(raw.replace(/,/g, "")),
    decimals,
    grouped: raw.includes(","),
    suffix: match[3],
  };
}

/** Counts up to the number inside `value` once it scrolls into view. */
export function CountUp({ value, className }: { value: string; className?: string }): React.ReactElement {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const parsed = parseMetric(value);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!parsed || !inView || reduced) return;
    const duration = 1100;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / duration);
      setShown(parsed.target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // parsed is derived from value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, value]);

  if (!parsed) return <span ref={ref} className={className}>{value}</span>;

  const current = reduced || !inView ? (reduced ? parsed.target : 0) : shown;
  const text = parsed.grouped
    ? Math.round(current).toLocaleString("en-US")
    : current.toFixed(parsed.decimals);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {parsed.prefix}
      {text}
      {parsed.suffix}
    </span>
  );
}

/** Content arrives: fade and rise once, when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Small uppercase label above a section or block. The only place mono type appears in the plain lens. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }): React.ReactElement {
  return (
    <p className={`font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-accent ${className ?? ""}`}>
      {children}
    </p>
  );
}

interface ImpactSide {
  value: string;
  unit: string;
  context: string;
}

/** Before → after. The "before" number is struck out as the "after" number counts in. */
export function BeforeAfter({ before, after }: { before: ImpactSide; after: ImpactSide }): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <div ref={ref} className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 md:gap-8 max-w-3xl">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50 mb-2">Before</p>
        <p className="relative inline-block font-heading font-bold text-4xl sm:text-5xl md:text-7xl leading-none text-foreground/45">
          {before.value}
          <span className="text-xl md:text-3xl ml-1">{before.unit}</span>
          <motion.span
            aria-hidden
            className="absolute left-0 top-1/2 h-[3px] w-full origin-left rounded-full bg-accent/70"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: inView ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          />
        </p>
        <p className="mt-3 text-sm md:text-base text-foreground/60 leading-snug max-w-[16rem]">{before.context}</p>
      </div>

      <motion.span
        aria-hidden
        className="pb-10 md:pb-16 text-2xl md:text-4xl text-accent"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -12 }}
        transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
      >
        →
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
        transition={{ duration: 0.7, delay: 1, ease: EASE }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-status mb-2">After</p>
        <p className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl leading-none text-gradient">
          <CountUp value={after.value} />
          <span className="text-xl md:text-3xl ml-1">{after.unit}</span>
        </p>
        <p className="mt-3 text-sm md:text-base text-foreground/80 leading-snug max-w-[16rem]">{after.context}</p>
      </motion.div>
    </div>
  );
}

/** The agent narrates: one plain sentence, with a face that reacts when the line scrolls into view. */
export function AgentLine({
  text,
  mood,
  className,
}: {
  text: string;
  mood: EmojiMood;
  className?: string;
}): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-25% 0px" });

  return (
    <div ref={ref} className={`flex items-center gap-3 ${className ?? ""}`}>
      <motion.span
        className="shrink-0 flex h-14 w-14 items-center justify-center rounded-full border border-accent-status/40 bg-accent-status/[0.08] shadow-[0_0_24px_rgba(74,222,128,0.18)]"
        animate={{ scale: inView ? 1 : 0.85, opacity: inView ? 1 : 0.5 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <AgentEmoji size={38} mood={inView ? mood : "default"} />
      </motion.span>
      <p className="text-sm md:text-base text-foreground/75 leading-snug">
        <span className="sr-only">Agent: </span>
        {text}
      </p>
    </div>
  );
}
