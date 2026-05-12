"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useStatus } from "@/lib/use-status";
import { openCvDrawer } from "@/components/cv-drawer";
import { useTilt } from "@/lib/use-tilt";

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
  const [count, setCount] = useState(0);
  const [cursorOn, setCursorOn] = useState(false);

  useEffect(() => {
    // Returning visitor — show everything instantly
    if (immediate) {
      setCount(segments.length);
      setCursorOn(false);
      return;
    }
    // Replay reset
    if (!active) {
      setCount(0);
      setCursorOn(false);
      return;
    }
    // Done streaming — blink cursor briefly then hide
    if (count >= segments.length) {
      if (showCursor) {
        setCursorOn(true);
        const t = setTimeout(() => setCursorOn(false), 1200);
        return () => clearTimeout(t);
      }
      return;
    }
    // Stream next word
    setCursorOn(showCursor);
    const t = setTimeout(
      () => setCount((c) => c + 1),
      speed + Math.random() * speed * 0.5,
    );
    return () => clearTimeout(t);
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
  { text: "I" },
  { text: "architect" },
  { text: "AI systems", className: "text-gradient" },
  { text: "and" },
  { text: "ship" },
  { text: "them" },
  { text: "to" },
  { text: "production." },
];

const DESC_SEGMENTS: WordSegment[] =
  "From multi-agent orchestration and RAG pipelines to full-stack AI-powered SaaS. I design the architecture, build the product, and own the delivery."
    .split(" ")
    .map((text) => ({ text }));

/* ------------------------------------------------------------------ */
/*  Terminal About Card                                                */
/* ------------------------------------------------------------------ */

interface TermStep {
  cmd: string;
  output?: string;
  type?: "identity";
  green?: boolean;
}

const TERM_STEPS: TermStep[] = [
  { cmd: "whoami", type: "identity" },
  { cmd: "cat location", output: "Islamabad, PK · remote-first" },
  { cmd: "echo $LANGUAGES", output: "EN, UR, PS, SD, AR" },
  { cmd: "cat interests.txt", output: "Snooker, cricket, history, technology" },
  { cmd: "cat superpower.txt", output: "Picks up anything fast" },
  { cmd: "cat philosophy.md", output: "Build the tool when none exists", green: true },
];

function HeroAboutCard({ active, immediate }: { active: boolean; immediate: boolean }): React.ReactElement {
  const tilt = useTilt(10);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (immediate) {
      setVisibleLines(TERM_STEPS.length);
      return;
    }
    if (!active) {
      setVisibleLines(0);
      return;
    }
    if (visibleLines >= TERM_STEPS.length) return;
    const t = setTimeout(
      () => setVisibleLines((v) => v + 1),
      180 + Math.random() * 100,
    );
    return () => clearTimeout(t);
  }, [active, immediate, visibleLines]);

  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={tilt.style}
      whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 0 40px rgba(212,168,83,0.06)" }}
      transition={{ duration: 0.2 }}
      className="rounded-xl bg-card border border-card-border overflow-hidden flex flex-col shadow-2xl shadow-black/20 cursor-default"
    >
      {/* Chrome */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border bg-card/40">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="ml-1 text-caption font-mono text-muted/60">shami ~ zsh</span>
      </div>

      {/* Mobile photo */}
      <div className="flex sm:hidden flex-col items-center pt-4 pb-2">
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-br from-accent/20 to-accent-secondary/12 rounded-full blur-xl pointer-events-none" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ahtesham.jpg" loading="eager" fetchPriority="high" alt="Ahtesham Ahmad" className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-accent/30 shadow-lg shadow-accent/10" />
        </div>
      </div>

      {/* Card body — terminal left, photo right */}
      <div className="flex flex-1 overflow-hidden">
        {/* Terminal commands — left side */}
        <div className="flex-1 px-4 py-3 font-mono text-small leading-[1.9] overflow-hidden">
          {TERM_STEPS.map((step, idx) => (
            <motion.div
              key={step.cmd}
              className="mb-1"
              animate={{
                opacity: idx < visibleLines ? 1 : 0,
                y: idx < visibleLines ? 0 : 5,
              }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <div><span className="text-accent">❯</span> <span className="text-foreground/80">{step.cmd}</span></div>
              {step.type === "identity" ? (
                <div className="pl-3 py-0.5">
                  <span className="text-foreground font-bold">Ahtesham Ahmad</span>
                  <span className="text-accent/60 ml-2">AI Engineer</span>
                </div>
              ) : (
                <div className={`pl-3 ${step.green ? "text-accent-status/70" : "text-foreground/60"}`}>
                  {step.output}
                </div>
              )}
            </motion.div>
          ))}

          <div>
            <span className="text-accent">❯</span>{" "}
            <span className="inline-block w-[6px] h-[12px] bg-accent/60 translate-y-[2px] animate-pulse" />
          </div>
        </div>

        {/* Photo — right side */}
        <div className="hidden sm:flex items-center justify-center px-8 border-l border-card-border/30">
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-accent/15 to-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ahtesham.jpg" loading="eager" fetchPriority="high" alt="Ahtesham Ahmad" className="relative aspect-square h-[80%] min-h-[180px] max-h-[240px] w-auto rounded-full object-cover border-3 border-accent/25 shadow-2xl shadow-accent/15" />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="px-3 py-1.5 border-t border-card-border/40 flex items-center justify-between bg-card/20">
        <div className="flex items-center gap-2 text-caption font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-status animate-pulse" />
          <span className="text-accent-status/70">available for hire</span>
        </div>
        <button
          type="button"
          data-cv-open="true"
          onClick={openCvDrawer}
          className="group flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-caption font-mono border border-accent/25 bg-accent/8 text-accent/70 hover:bg-accent/15 hover:text-accent hover:border-accent/40 transition-all duration-200 cursor-pointer"
          style={{ animation: "cv-glow 3s ease-in-out infinite" }}
        >
          <span className="w-1 h-1 rounded-full bg-accent/60 group-hover:bg-accent transition-colors" />
          View CV
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */

const ALL_TARGETS = ["badge", "title", "card", "desc", "cta", "build", "scroll"];
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ConfigHero(): React.ReactElement {
  const { status } = useStatus();

  // Materialization state — driven by particle arrival events
  const [materialized, setMaterialized] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Returning visitor — show everything immediately
    const isComplete = sessionStorage.getItem("boot-complete") === "1";
    if (isComplete) {
      setMaterialized(new Set(ALL_TARGETS));
    }

    // Particle-driven reveals
    const onReveal = (e: Event): void => {
      const target = (e as CustomEvent<{ target: string }>).detail?.target;
      if (!target) return;
      setMaterialized((prev) => {
        const next = new Set(prev);
        next.add(target);
        return next;
      });
      // CTA triggers build + scroll
      if (target === "cta") {
        setTimeout(() => {
          setMaterialized((prev) => new Set([...prev, "build", "scroll"]));
        }, 500);
      }
    };

    // Fallback for returning visitors (boot-complete without particles)
    const onBootComplete = (): void => {
      setTimeout(() => {
        setMaterialized((prev) => {
          if (prev.size === 0) return new Set(ALL_TARGETS);
          return prev;
        });
      }, 3000);
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
    };
  }, []);

  const { scrollY } = useScroll();
  const orbY1 = useTransform(scrollY, [0, 800], [0, 120]);
  const orbY2 = useTransform(scrollY, [0, 800], [0, -80]);
  const orbOpacity = useTransform(scrollY, [0, 600], [1, 0.3]);
  const cardY = useTransform(scrollY, [0, 600], [0, -40]);
  const cardScale = useTransform(scrollY, [0, 600], [1, 0.97]);

  const m = useCallback(
    (name: string): boolean => materialized.has(name),
    [materialized],
  );
  const immediate = materialized.size === ALL_TARGETS.length;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 md:pt-20 md:pb-24"
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

      <div className="relative w-full max-w-5xl mx-auto px-5 md:px-6">
        <div className="grid md:grid-cols-[1fr,1.1fr] gap-10 md:gap-14 items-center">

          {/* Left: tagline + CTA */}
          <div className="text-center md:text-left">

            {/* 1. Badge — quick pop-in */}
            <motion.div
              data-hero="badge"
              initial={false}
              animate={{
                opacity: m("badge") ? 1 : 0,
                scale: m("badge") ? 1 : 0.85,
                y: m("badge") ? 0 : 8,
                filter: m("badge") ? "blur(0px)" : "blur(6px)",
              }}
              transition={{ duration: immediate ? 0 : 0.6, ease: EASE }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-status/10 border border-accent-status/20 text-accent-status text-caption md:text-xs font-mono mb-6"
            >
              <span className="w-1.5 h-1.5 bg-accent-status rounded-full animate-pulse" />
              Open to opportunities
            </motion.div>

            {/* 2. Title — word-by-word streaming with cursor */}
            <h1
              data-hero="title"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.2] sm:leading-[1.15] mb-5"
            >
              <StreamingWords
                segments={TITLE_SEGMENTS}
                active={m("title")}
                immediate={immediate}
                speed={120}
                showCursor
              />
            </h1>

            {/* 3. Description — word-by-word streaming (faster, no cursor) */}
            <p
              data-hero="desc"
              className="text-sm md:text-base text-muted max-w-md leading-relaxed mb-8"
            >
              <StreamingWords
                segments={DESC_SEGMENTS}
                active={m("desc")}
                immediate={immediate}
                speed={60}
              />
            </p>

            {/* 4. CTA — slide up */}
            <motion.div
              data-hero="cta"
              initial={false}
              animate={{
                opacity: m("cta") ? 1 : 0,
                y: m("cta") ? 0 : 12,
                filter: m("cta") ? "blur(0px)" : "blur(6px)",
              }}
              transition={{ duration: immediate ? 0 : 0.7, ease: EASE }}
              className="flex flex-wrap gap-3 justify-center md:justify-start"
            >
              <a
                href="#projects"
                className="px-6 py-2.5 btn-gradient font-medium rounded-lg hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 text-sm"
              >
                See the work
              </a>
            </motion.div>

            {/* 5. Building status */}
            <motion.div
              initial={false}
              animate={{ opacity: m("build") ? 1 : 0 }}
              transition={{ duration: immediate ? 0 : 0.5 }}
              className="flex items-center gap-2 mt-6 justify-center md:justify-start"
            >
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              <p className="text-caption md:text-xs font-mono text-muted/60">
                building:{" "}
                <span className="text-accent/80">
                  {status.currentlyBuilding.label}
                </span>
              </p>
            </motion.div>
          </div>

          {/* Right: about card — blur materialize + line-by-line terminal */}
          <motion.div
            data-hero="card"
            initial={false}
            animate={{
              opacity: m("card") ? 1 : 0,
              filter: m("card") ? "blur(0px)" : "blur(14px)",
            }}
            transition={{ duration: immediate ? 0 : 1.2, ease: EASE }}
          >
            <motion.div style={{ y: cardY, scale: cardScale }}>
              <HeroAboutCard active={m("card")} immediate={immediate} />
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={false}
        animate={{ opacity: m("scroll") ? 1 : 0 }}
        transition={{ duration: immediate ? 0 : 0.5 }}
        className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-muted/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-muted/50 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
