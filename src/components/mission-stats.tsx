"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { FadeUp } from "./motion";
import { TypeLabel } from "./type-label";
import { useStatus } from "@/lib/use-status";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }): React.ReactElement {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1400;
    const start = Date.now();
    const tick = (): void => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, to]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export function MissionStats(): React.ReactElement {
  const { status } = useStatus();

  const widgets = [
    {
      key: "projects_delivered",
      label: "projects_delivered",
      value: <CountUp to={status.portfolio.projects} suffix="+" />,
      desc: "Across 40+ clients globally",
    },
    {
      key: "openevent_clients",
      label: "openevent.clients",
      value: <CountUp to={status.openevent.clients} suffix="+" />,
      desc: "Using OpenEvent daily",
    },
    {
      key: "events_managed",
      label: "events.managed",
      value: <CountUp to={status.openevent.events} suffix="+" />,
      desc: "Saving ~90 min/day per team",
    },
    {
      key: "gogaa_tests",
      label: "gogaa.tests",
      value: <CountUp to={status.gogaa.tests} />,
      desc: "Passing across open-source tools",
    },
  ];

  return (
    <section id="mission" className="py-20 md:py-32">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <div className="grid lg:grid-cols-[7fr_3fr] gap-8 lg:gap-10 items-stretch mb-14 md:mb-20">
          {/* Left 70% — mission content */}
          <div>
            <FadeUp>
              <TypeLabel
                text="$ cat mission.md"
                className="text-sm font-mono text-accent mb-4 uppercase tracking-wider"
              />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 md:mb-12 leading-tight">
                Most AI projects break in production.
                <br />
                <span className="text-muted">I make sure mine don&apos;t.</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.05}>
              <div className="space-y-4 md:space-y-5 text-sm md:text-base text-muted leading-relaxed">
                <p>
                  The gap between an AI demo and a production system is enormous.
                  I close that gap.
                </p>
                <p>
                  <span className="text-foreground font-medium">AI orchestration</span>
                  {" "}meets{" "}
                  <span className="text-foreground font-medium">systems engineering</span>
                  : multi-agent pipelines with human approval gates, LLM reasoning
                  connected to real actions, full-stack products shipped end-to-end.
                </p>
                <p className="text-foreground font-medium border-l-2 border-accent pl-4">
                  When the tools I needed didn&apos;t exist, I built them.
                  I don&apos;t just integrate AI. I build the infrastructure around it.
                </p>
              </div>
            </FadeUp>
          </div>

          {/* Right 30% — terminal about card with 3D tilt + typing */}
          <FadeUp delay={0.1} className="h-full">
            <TerminalAboutCard />
          </FadeUp>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-stretch">
          {widgets.map((w, i) => (
            <motion.div
              key={w.key}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <div className="card-glow card-gradient-border p-4 md:p-5 rounded-xl bg-card border border-card-border h-full flex flex-col group hover:border-transparent transition-colors duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-status animate-pulse group-hover:scale-150 transition-transform" />
                  <span className="text-[10px] font-mono text-muted/50 uppercase tracking-wider group-hover:text-accent/70 transition-colors">
                    {w.label}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold font-mono text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                  {w.value}
                </p>
                <p className="text-[10px] md:text-xs text-muted">
                  {w.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
  { cmd: "cat superpower.txt", output: "Picks up anything fast" },
  { cmd: "cat philosophy.md", output: "Build the tool when none exists", green: true },
];

function TerminalAboutCard(): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

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

  // Type command characters
  useEffect(() => {
    if (!isInView || !currentStep || allDone) return;
    if (cmdChars < currentStep.cmd.length) {
      const timer = setTimeout(() => setCmdChars((c) => c + 1), 35);
      return () => clearTimeout(timer);
    }
    // Command fully typed — pause then show output
    const timer = setTimeout(() => setShowOutput(true), 200);
    return () => clearTimeout(timer);
  }, [isInView, cmdChars, currentStep, allDone]);

  // Stream output characters
  useEffect(() => {
    if (!showOutput || !currentStep) return;
    if (currentStep.type === "identity") {
      // Identity shows instantly (it's a card, not text)
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
    // Output done — move to next step
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
      className="rounded-xl bg-card border border-card-border overflow-hidden h-full flex flex-col shadow-2xl shadow-black/20 cursor-default"
    >
      {/* Chrome */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border bg-card/50">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="ml-1 text-[10px] font-mono text-muted/50">shami ~ zsh</span>
      </div>

      {/* Photo centered at top */}
      <div className="flex flex-col items-center pt-4 pb-2">
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-br from-accent/15 to-accent-secondary/10 rounded-full blur-xl pointer-events-none" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ahtesham.jpg" alt="Ahtesham Ahmad" className="relative w-14 h-14 rounded-full object-cover border-2 border-accent/25" />
        </div>
      </div>

      {/* Terminal body */}
      <div className="px-4 pb-3 font-mono text-[10.5px] leading-[1.9] flex-1 overflow-hidden">
        {/* Completed steps */}
        {completedSteps.map((step) => (
          <div key={step.cmd} className="mb-1">
            <div><span className="text-accent">❯</span> <span className="text-foreground/80">{step.cmd}</span></div>
            {step.type === "identity" ? (
              <div className="pl-3 py-0.5">
                <span className="text-foreground font-bold font-sans text-xs">Ahtesham Ahmad</span>
                <span className="text-accent/60 ml-2 text-[9px]">AI Engineer</span>
              </div>
            ) : (
              <div className={`pl-3 ${step.green ? "text-accent-status/70" : "text-foreground/60"}`}>
                {step.output}
              </div>
            )}
          </div>
        ))}

        {/* Currently typing command */}
        {currentStep && !allDone && (
          <div className="mb-1">
            <div>
              <span className="text-accent">❯</span>{" "}
              <span className="text-foreground/80">{currentStep.cmd.slice(0, cmdChars)}</span>
              {isTypingCmd && <span className="inline-block w-[6px] h-[12px] bg-accent/80 ml-px translate-y-[2px] animate-pulse" />}
            </div>
            {/* Streaming output */}
            {showOutput && currentStep.type === "identity" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-3 py-0.5">
                <span className="text-foreground font-bold font-sans text-xs">Ahtesham Ahmad</span>
                <span className="text-accent/60 ml-2 text-[9px]">AI Engineer</span>
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

        {/* Final cursor */}
        {allDone && (
          <div>
            <span className="text-accent">❯</span>{" "}
            <span className="inline-block w-[6px] h-[12px] bg-accent/70 translate-y-[2px] animate-pulse" />
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-3 py-1.5 border-t border-card-border/50 flex items-center justify-between bg-card/30">
        <div className="flex items-center gap-2 text-[9px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-status animate-pulse" />
          <span className="text-accent-status/70">available for hire</span>
        </div>
        <a href="/uses" className="text-[9px] font-mono text-muted/30 hover:text-accent transition-colors">setup &rarr;</a>
      </div>
    </motion.div>
  );
}
