"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Calendar, FileText } from "lucide-react";
import { useStatus } from "@/lib/use-status";
import { useLens, useVisitorIntent } from "@/lib/use-lens";
import { openCvDrawer } from "@/components/cv-drawer";

/* ------------------------------------------------------------------ */
/*  StreamingWords — reveals text word-by-word with a typing cursor    */
/* ------------------------------------------------------------------ */

interface WordSegment {
  text: string;
  className?: string;
}

function StreamingWords({
  segments,
  active,
  immediate,
  speed = 100,
  showCursor = false,
}: {
  segments: WordSegment[];
  active: boolean;
  immediate: boolean;
  speed?: number;
  showCursor?: boolean;
}): React.ReactElement {
  const [count, setCount] = useState(() => immediate ? segments.length : 0);
  const [cursorOn, setCursorOn] = useState(false);

  useEffect(() => {
    // Returning visitor — show everything instantly
    if (immediate) {
      const t = setTimeout(() => {
        setCount(segments.length);
        setCursorOn(false);
      }, 0);
      return () => clearTimeout(t);
    }
    // Replay reset
    if (!active) {
      const t = setTimeout(() => {
        setCount(0);
        setCursorOn(false);
      }, 0);
      return () => clearTimeout(t);
    }
    // Done streaming — blink cursor briefly then hide
    if (count >= segments.length) {
      if (showCursor) {
        const t1 = setTimeout(() => setCursorOn(true), 0);
        const t2 = setTimeout(() => setCursorOn(false), 1200);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
      return;
    }
    // Stream next word
    const cursorTimer = setTimeout(() => setCursorOn(showCursor), 0);
    const t = setTimeout(
      () => setCount((c) => c + 1),
      speed + Math.random() * speed * 0.5,
    );
    return () => {
      clearTimeout(cursorTimer);
      clearTimeout(t);
    };
  }, [active, immediate, count, segments.length, speed, showCursor]);

  return (
    <>
      {segments.map((seg, i) => (
        <motion.span
          key={i}
          animate={{
            opacity: i < count ? 1 : 0,
            filter: i < count ? "blur(0px)" : "blur(3px)",
            y: i < count ? 0 : 2,
          }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className={seg.className}
          style={{ display: "inline" }}
        >
          {seg.text}
          {i < segments.length - 1 ? " " : ""}
        </motion.span>
      ))}
      {cursorOn && count > 0 && (
        <motion.span
          className="inline-block w-[2px] h-[0.8em] bg-accent/80 ml-0.5 translate-y-[3px] rounded-full"
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Text Segments                                                      */
/* ------------------------------------------------------------------ */

const TITLE_SEGMENTS: WordSegment[] = [
  { text: "I'm" },
  { text: "Ahtesham.", className: "text-accent" },
  { text: "\n" },
  { text: "I" },
  { text: "ship" },
  { text: "AI products", className: "text-gradient" },
  { text: "that" },
  { text: "don't" },
  { text: "break." },
];

const toSegments = (copy: string): WordSegment[] => copy.split(" ").map((text) => ({ text }));

const DESC_SEGMENTS = {
  plain: toSegments(
    "I build AI software that businesses rely on every day. OpenEvent serves 100+ event companies and saves each team about 90 minutes a day. I design it, build it, and keep it running.",
  ),
  technical: toSegments(
    "OpenEvent runs with 100+ clients. CodeLens reviews PRs in under a second. Gogaa keeps coding work moving across 11 providers. I design the architecture, build the product, and own delivery.",
  ),
} as const;

const BOOK_URL = "https://ahtesham.dev.wadwarehouse.com/book";
const GITHUB_URL = "https://github.com/shami-ah";
const CTA_PRIMARY =
  "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg btn-gradient font-semibold text-sm hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer";
const CTA_SECONDARY =
  "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-card-border bg-card/40 text-sm text-foreground/80 hover:border-accent/40 hover:text-foreground transition-all duration-200 cursor-pointer";

/* ------------------------------------------------------------------ */
/*  Hero Section — Agent-first centered layout                         */
/* ------------------------------------------------------------------ */

const ALL_TARGETS = ["title", "desc", "agent", "scroll"];
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ConfigHero(): React.ReactElement {
  const { status } = useStatus();
  const lens = useLens();
  const intent = useVisitorIntent();

  // Materialization state — driven by particle arrival events
  const [materialized, setMaterialized] = useState<Set<string>>(new Set());

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        if (sessionStorage.getItem("boot-complete") === "1") {
          setMaterialized(new Set(ALL_TARGETS));
        }
      } catch {
        // noop
      }
    });

    // Particle-driven reveals
    const onReveal = (e: Event): void => {
      const target = (e as CustomEvent<{ target: string }>).detail?.target;
      if (!target) return;
      setMaterialized((prev) => {
        const next = new Set(prev);
        next.add(target);
        return next;
      });
      // Desc triggers agent + scroll, then signal hero is fully written
      if (target === "desc") {
        setTimeout(() => {
          setMaterialized((prev) => {
            const next = new Set([...prev, "agent", "scroll"]);
            // All targets revealed → emoji can float up
            if (next.size >= ALL_TARGETS.length) {
              window.dispatchEvent(new CustomEvent("hero-fully-written"));
            }
            return next;
          });
        }, 500);
      }
    };

    // Fallback — only if particles never arrive (e.g. animation disabled)
    const onBootComplete = (): void => {
      setTimeout(() => {
        setMaterialized((prev) => {
          if (prev.size === 0) return new Set(ALL_TARGETS);
          return prev;
        });
      }, 6000);
    };

    // Replay resets
    const onReplay = (): void => {
      setMaterialized(new Set());
    };

    window.addEventListener("hero-reveal", onReveal);
    window.addEventListener("boot-complete", onBootComplete);
    window.addEventListener("replay-intro", onReplay);
    return () => {
      window.removeEventListener("hero-reveal", onReveal);
      window.removeEventListener("boot-complete", onBootComplete);
      window.removeEventListener("replay-intro", onReplay);
      cancelAnimationFrame(frame);
    };
  }, []);

  const { scrollY } = useScroll();
  const orbY1 = useTransform(scrollY, [0, 800], [0, 120]);
  const orbY2 = useTransform(scrollY, [0, 800], [0, -80]);
  const orbOpacity = useTransform(scrollY, [0, 600], [1, 0.3]);

  const m = useCallback(
    (name: string): boolean => materialized.has(name),
    [materialized],
  );
  const immediate = materialized.size === ALL_TARGETS.length;

  return (
    <section
      id="hero"
      className="relative min-h-dvh md:min-h-screen flex items-center justify-center overflow-hidden pt-12 pb-6 md:pt-20 md:pb-24"
    >
      {/* Parallax gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: orbY1, opacity: orbOpacity }}
          className="absolute -top-40 -right-40 w-72 md:w-[32rem] h-72 md:h-[32rem] bg-accent/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: orbY2, opacity: orbOpacity }}
          className="absolute -bottom-40 -left-40 w-72 md:w-[32rem] h-72 md:h-[32rem] bg-accent-secondary/6 rounded-full blur-3xl"
        />
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-5 md:px-6 text-center">

        {/* Hero text content — the agent is docked bottom-right, so nothing here needs to make room for it */}
        <div>
          {/* 1. Title — word-by-word streaming with cursor */}
          <h1
            data-hero="title"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            <StreamingWords
              segments={TITLE_SEGMENTS}
              active={m("title")}
              immediate={immediate}
              speed={100}
              showCursor
            />
          </h1>

          {/* 3. Description — word-by-word streaming (faster, no cursor) */}
          <p
            data-hero="desc"
            className="text-base md:text-lg text-muted max-w-xl mx-auto leading-relaxed mb-6 tracking-[-0.01em]"
          >
            <StreamingWords
              key={lens}
              segments={DESC_SEGMENTS[lens]}
              active={m("desc")}
              immediate={immediate}
              speed={50}
            />
          </p>

          {/* 4. Compact stats strip — proof, not claims */}
          <motion.div
            data-hero="desc"
            initial={false}
            animate={{
              opacity: m("desc") ? 1 : 0,
              y: m("desc") ? 0 : 8,
            }}
            transition={{ duration: immediate ? 0 : 0.6, delay: immediate ? 0 : 0.3, ease: EASE }}
            className="flex items-center justify-center gap-4 md:gap-6 mb-4 md:mb-5 font-mono text-[11px] md:text-xs tracking-wide"
          >
            <span className="text-foreground font-semibold">{status.portfolio.productionSystems}+ <span className="text-muted/50 font-normal">systems shipped</span></span>
            <span className="text-muted/20">/</span>
            <span className="text-foreground font-semibold">10 <span className="text-muted/50 font-normal">showcased</span></span>
            <span className="text-muted/20">/</span>
            <span className="text-foreground font-semibold">{status.portfolio.yearsBuilding}+ <span className="text-muted/50 font-normal">years</span></span>
          </motion.div>

          {/* 5. Labelled actions — the primary one follows what the visitor told the agent */}
          <motion.div
            data-hero="desc"
            initial={false}
            animate={{ opacity: m("desc") ? 1 : 0, y: m("desc") ? 0 : 8 }}
            transition={{ duration: immediate ? 0 : 0.6, delay: immediate ? 0 : 0.45, ease: EASE }}
            className="flex flex-wrap items-center justify-center gap-3 mt-4 md:mt-6"
          >
            {intent === "project" ? (
              <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className={CTA_PRIMARY}>
                <Calendar size={15} strokeWidth={1.5} />
                Book a 15-min call
              </a>
            ) : intent === "developer" ? (
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={CTA_PRIMARY}>
                See the code on GitHub
              </a>
            ) : (
              <button type="button" data-cv-open="true" onClick={openCvDrawer} className={CTA_PRIMARY}>
                <FileText size={15} strokeWidth={1.5} />
                View my CV
              </button>
            )}
            <a href="#projects" className={CTA_SECONDARY}>
              See my work
              <ArrowDown size={14} strokeWidth={1.5} />
            </a>
          </motion.div>
        </div>

        {/* The agent lives in the bottom-right dock now; this keeps the reveal target for the intro particles */}
        <div data-hero="agent" aria-hidden />
      </div>

    </section>
  );
}
