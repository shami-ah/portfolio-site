"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useStatus } from "@/lib/use-status";
import { openCvDrawer } from "@/components/cv-drawer";
import { useTilt } from "@/lib/use-tilt";

/* ------------------------------------------------------------------ */
/*  Terminal About Card — char-by-char typing + response streaming     */
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

function HeroAboutCard(): React.ReactElement {
  const tilt = useTilt(10);

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

      {/* Mobile photo — small, centered above commands */}
      <div className="flex sm:hidden flex-col items-center pt-4 pb-2">
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-br from-accent/20 to-accent-secondary/12 rounded-full blur-xl pointer-events-none" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ahtesham.jpg" loading="eager" fetchPriority="high" alt="Ahtesham Ahmad" className="relative w-16 h-16 rounded-full object-cover border-2 border-accent/30 shadow-lg shadow-accent/10" />
        </div>
      </div>

      {/* Card body — terminal left, photo right */}
      <div className="flex flex-1 overflow-hidden">
        {/* Terminal commands — left side */}
        <div className="flex-1 px-4 py-3 font-mono text-small leading-[1.9] overflow-hidden">
          {TERM_STEPS.map((step) => (
            <div key={step.cmd} className="mb-1">
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
            </div>
          ))}

          <div>
            <span className="text-accent">❯</span>{" "}
            <span className="inline-block w-[6px] h-[12px] bg-accent/60 translate-y-[2px] animate-pulse" />
          </div>
        </div>

        {/* Photo — right side, fills 80% of card height, vertically centered */}
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

export function ConfigHero(): React.ReactElement {
  const { status } = useStatus();
  const [epoch, setEpoch] = useState(0);

  // Re-stream hero content after boot animation completes (including reboot)
  useEffect(() => {
    const onBootComplete = (): void => {
      setEpoch((e) => e + 1);
    };
    window.addEventListener("boot-complete", onBootComplete);
    return () => window.removeEventListener("boot-complete", onBootComplete);
  }, []);

  const { scrollY } = useScroll();
  const orbY1 = useTransform(scrollY, [0, 800], [0, 120]);
  const orbY2 = useTransform(scrollY, [0, 800], [0, -80]);
  const orbOpacity = useTransform(scrollY, [0, 600], [1, 0.3]);
  const cardY = useTransform(scrollY, [0, 600], [0, -40]);
  const cardScale = useTransform(scrollY, [0, 600], [1, 0.97]);

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
            {/* 1. Badge streams in first */}
            <motion.div
              key={`badge-${epoch}`}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-status/10 border border-accent-status/20 text-accent-status text-caption md:text-xs font-mono mb-6"
            >
              <span className="w-1.5 h-1.5 bg-accent-status rounded-full animate-pulse" />
              Open to opportunities
            </motion.div>

            {/* 2. Title streams in */}
            <motion.h1
              key={`h1-${epoch}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-5"
            >
              I architect{" "}
              <span className="text-gradient">AI systems</span>
              {" "}and ship them to production.
            </motion.h1>

            {/* 3. Description streams in */}
            <motion.p
              key={`desc-${epoch}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm md:text-base text-muted max-w-md leading-relaxed mb-8"
            >
              From multi-agent orchestration and RAG pipelines to full-stack
              AI-powered SaaS. I design the architecture, build the product, and own the delivery.
            </motion.p>

            {/* 4. CTA button streams in */}
            <motion.div
              key={`cta-${epoch}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="flex flex-wrap gap-3 justify-center md:justify-start"
            >
              <a
                href="#projects"
                className="px-6 py-2.5 bg-accent text-background font-medium rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 text-sm"
              >
                See the work
              </a>
            </motion.div>

            {/* 5. Building status streams in last */}
            <motion.div
              key={`build-${epoch}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.2 }}
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

          {/* Right: about card slides in alongside the title */}
          <motion.div
            key={`card-${epoch}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: cardY, scale: cardScale }}
          >
            <HeroAboutCard />
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        key={`scroll-${epoch}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2.5 }}
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
