"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useStatus } from "@/lib/use-status";

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

function HeroAboutCard({ ready }: { ready: boolean }): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  // Phase machine: type command char by char → show output → next command
  const [stepIdx, setStepIdx] = useState(0);
  const [cmdChars, setCmdChars] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [outputChars, setOutputChars] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<TermStep[]>([]);

  const currentStep = TERM_STEPS[stepIdx] as TermStep | undefined;
  const isTypingCmd = currentStep && cmdChars < currentStep.cmd.length;
  const isStreamingOutput = currentStep && showOutput && currentStep.output && outputChars < currentStep.output.length;
  const allDone = stepIdx >= TERM_STEPS.length;

  // Type command characters — starts when hero is ready
  useEffect(() => {
    if (!ready || !currentStep || allDone) return;
    if (cmdChars < currentStep.cmd.length) {
      const timer = setTimeout(() => setCmdChars((c) => c + 1), 35);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setShowOutput(true), 200);
    return () => clearTimeout(timer);
  }, [ready, cmdChars, currentStep, allDone]);

  // Stream output characters
  useEffect(() => {
    if (!showOutput || !currentStep) return;
    if (currentStep.type === "identity") {
      const timer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, currentStep]);
        setStepIdx((i) => i + 1);
        setCmdChars(0);
        setShowOutput(false);
        setOutputChars(0);
      }, 500);
      return () => clearTimeout(timer);
    }
    if (currentStep.output && outputChars < currentStep.output.length) {
      const timer = setTimeout(() => setOutputChars((c) => c + 1), 18);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setStepIdx((i) => i + 1);
      setCmdChars(0);
      setShowOutput(false);
      setOutputChars(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [showOutput, outputChars, currentStep]);

  // 3D tilt
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 10);
    rx.set((0.5 - (e.clientY - rect.top) / rect.height) * 10);
  }, [rx, ry]);

  const onMouseLeave = useCallback((): void => { rx.set(0); ry.set(0); }, [rx, ry]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
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
          <img src="/ahtesham.jpg" alt="Ahtesham Ahmad" className="relative w-16 h-16 rounded-full object-cover border-2 border-accent/30 shadow-lg shadow-accent/10" />
        </div>
      </div>

      {/* Card body — terminal left, photo right */}
      <div className="flex flex-1 overflow-hidden">
        {/* Terminal commands — left side */}
        <div className="flex-1 px-4 py-3 font-mono text-small leading-[1.9] overflow-hidden">
          {completedSteps.map((step) => (
            <div key={step.cmd} className="mb-1">
              <div><span className="text-accent">❯</span> <span className="text-foreground/80">{step.cmd}</span></div>
              {step.type === "identity" ? (
                <div className="pl-3 py-0.5">
                  <span className="text-foreground font-bold font-sans text-xs">Ahtesham Ahmad</span>
                  <span className="text-accent/60 ml-2 text-caption">AI Engineer</span>
                </div>
              ) : (
                <div className={`pl-3 ${step.green ? "text-accent-status/70" : "text-foreground/60"}`}>
                  {step.output}
                </div>
              )}
            </div>
          ))}

          {currentStep && !allDone && (
            <div className="mb-1">
              <div>
                <span className="text-accent">❯</span>{" "}
                <span className="text-foreground/80">{currentStep.cmd.slice(0, cmdChars)}</span>
                {isTypingCmd && <span className="inline-block w-[6px] h-[12px] bg-accent/80 ml-px translate-y-[2px] animate-pulse" />}
              </div>
              {showOutput && currentStep.type === "identity" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-3 py-0.5">
                  <span className="text-foreground font-bold font-sans text-xs">Ahtesham Ahmad</span>
                  <span className="text-accent/60 ml-2 text-caption">AI Engineer</span>
                </motion.div>
              )}
              {showOutput && currentStep.output && currentStep.type !== "identity" && (
                <div className={`pl-3 ${currentStep.green ? "text-accent-status/70" : "text-foreground/60"}`}>
                  {currentStep.output.slice(0, outputChars)}
                  {isStreamingOutput && <span className="inline-block w-[5px] h-[10px] bg-foreground/30 ml-px translate-y-[1px] animate-pulse" />}
                </div>
              )}
            </div>
          )}

          {allDone && (
            <div>
              <span className="text-accent">❯</span>{" "}
              <span className="inline-block w-[6px] h-[12px] bg-accent/60 translate-y-[2px] animate-pulse" />
            </div>
          )}
        </div>

        {/* Photo — right side, fills 80% of card height, vertically centered */}
        <div className="hidden sm:flex items-center justify-center px-8 border-l border-card-border/30">
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-accent/15 to-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ahtesham.jpg" alt="Ahtesham Ahmad" className="relative aspect-square h-[80%] min-h-[180px] max-h-[240px] w-auto rounded-full object-cover border-3 border-accent/25 shadow-2xl shadow-accent/15" />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="px-3 py-1.5 border-t border-card-border/40 flex items-center justify-between bg-card/20">
        <div className="flex items-center gap-2 text-caption font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-status animate-pulse" />
          <span className="text-accent-status/70">available for hire</span>
        </div>
        <a href="/uses" className="text-caption font-mono text-muted/40 hover:text-accent transition-colors">setup &rarr;</a>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */

export function ConfigHero(): React.ReactElement {
  const { status } = useStatus();
  const [ready, setReady] = useState(false);

  const { scrollY } = useScroll();
  const orbY1 = useTransform(scrollY, [0, 800], [0, 120]);
  const orbY2 = useTransform(scrollY, [0, 800], [0, -80]);
  const orbOpacity = useTransform(scrollY, [0, 600], [1, 0.3]);
  const cardY = useTransform(scrollY, [0, 600], [0, -40]);
  const cardScale = useTransform(scrollY, [0, 600], [1, 0.97]);

  // Wait for boot-complete
  useEffect(() => {
    if (typeof window === "undefined") return;
    const done = sessionStorage.getItem("boot-complete");
    if (done) {
      setReady(true);
      return;
    }
    const onDone = (): void => setReady(true);
    window.addEventListener("boot-complete", onDone);
    const fallback = setTimeout(() => setReady(true), 4000);
    return () => {
      window.removeEventListener("boot-complete", onDone);
      clearTimeout(fallback);
    };
  }, []);

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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={ready ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-status/10 border border-accent-status/20 text-accent-status text-caption md:text-xs font-mono mb-6"
            >
              <span className="w-1.5 h-1.5 bg-accent-status rounded-full animate-pulse" />
              Open to opportunities
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-5"
            >
              I architect{" "}
              <span className="text-gradient">AI systems</span>
              {" "}and ship them to production.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm md:text-base text-muted max-w-md leading-relaxed mb-8"
            >
              From multi-agent orchestration and RAG pipelines to full-stack
              AI-powered SaaS. I design the architecture, build the product, and own the delivery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex flex-wrap gap-3 justify-center md:justify-start"
            >
              <a
                href="#projects"
                className="px-6 py-2.5 bg-accent text-background font-medium rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 text-sm"
              >
                See the work
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.5 }}
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

          {/* Right: about card with parallax */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: cardY, scale: cardScale }}
          >
            <HeroAboutCard ready={ready} />
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
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
