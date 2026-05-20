"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useStatus } from "@/lib/use-status";

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

const DESC_SEGMENTS: WordSegment[] =
  "OpenEvent runs with 100+ clients. CodeLens reviews PRs in under a second. Gogaa keeps coding work moving across 11 providers. I design the architecture, build the product, and own delivery."
    .split(" ")
    .map((text) => ({ text }));

/* ------------------------------------------------------------------ */
/*  Hero Section — Agent-first centered layout                         */
/* ------------------------------------------------------------------ */

const ALL_TARGETS = ["title", "desc", "agent", "scroll"];
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ConfigHero(): React.ReactElement {
  const { status } = useStatus();

  // Materialization state — driven by particle arrival events
  const [materialized, setMaterialized] = useState<Set<string>>(new Set());

  // Agent overlays — hero copy fades out while command output or chat is active
  const [chatActive, setChatActive] = useState(false);
  const [agentActive, setAgentActive] = useState(false);

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

    const onChatOpen = (): void => setChatActive(true);
    const onChatClose = (): void => setChatActive(false);
    const onAgentOpen = (): void => setAgentActive(true);
    const onAgentClose = (): void => setAgentActive(false);

    window.addEventListener("hero-reveal", onReveal);
    window.addEventListener("boot-complete", onBootComplete);
    window.addEventListener("replay-intro", onReplay);
    window.addEventListener("chat-overlay-open", onChatOpen);
    window.addEventListener("chat-overlay-close", onChatClose);
    window.addEventListener("agent-overlay-open", onAgentOpen);
    window.addEventListener("agent-overlay-close", onAgentClose);
    return () => {
      window.removeEventListener("hero-reveal", onReveal);
      window.removeEventListener("boot-complete", onBootComplete);
      window.removeEventListener("replay-intro", onReplay);
      window.removeEventListener("chat-overlay-open", onChatOpen);
      window.removeEventListener("chat-overlay-close", onChatClose);
      window.removeEventListener("agent-overlay-open", onAgentOpen);
      window.removeEventListener("agent-overlay-close", onAgentClose);
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
  const overlayActive = chatActive || agentActive;

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

        {/* Hero text content — fades out when agent/chat overlays are open */}
        <motion.div
          animate={{
            opacity: overlayActive ? 0 : 1,
            y: overlayActive ? -12 : 0,
            filter: overlayActive ? "blur(8px)" : "blur(0px)",
          }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ pointerEvents: overlayActive ? "none" : "auto" }}
        >
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
              segments={DESC_SEGMENTS}
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
        </motion.div>

        {/* 5. Agent input container — agent-bar renders here via portal */}
        <motion.div
          id="hero-agent-mount"
          data-hero="agent"
          initial={false}
          animate={{
            opacity: m("agent") ? 1 : 0,
            y: m("agent") ? 0 : 16,
            filter: m("agent") ? "blur(0px)" : "blur(6px)",
          }}
          transition={{ duration: immediate ? 0 : 0.7, ease: EASE }}
          className="mt-0 max-w-[700px] mx-auto min-h-[255px] md:min-h-[315px] flex items-center justify-center"
        />
      </div>

    </section>
  );
}
