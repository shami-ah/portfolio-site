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
/*  Terminal About Card — 3D tilt + staggered command typing           */
/* ------------------------------------------------------------------ */

const TERM_LINES = [
  { cmd: "whoami", type: "identity" as const },
  { cmd: "cat location", output: "Islamabad, PK · remote-first" },
  { cmd: "echo $LANGUAGES", output: "EN, UR, PS, SD, AR" },
  { cmd: "cat superpower.txt", output: "Picks up anything fast" },
  { cmd: "cat philosophy.md", output: "Build the tool when none exists", green: true },
];

function TerminalAboutCard(): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [visibleLines, setVisibleLines] = useState(0);

  // 3D tilt
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 10);
    rx.set((0.5 - py) * 10);
  }, [rx, ry]);

  const onMouseLeave = useCallback((): void => {
    rx.set(0);
    ry.set(0);
  }, [rx, ry]);

  // Type lines one by one
  useEffect(() => {
    if (!isInView) return;
    if (visibleLines >= TERM_LINES.length) return;
    const timer = setTimeout(
      () => setVisibleLines((n) => n + 1),
      visibleLines === 0 ? 400 : 600,
    );
    return () => clearTimeout(timer);
  }, [isInView, visibleLines]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 0 40px rgba(212,168,83,0.06)",
      }}
      transition={{ duration: 0.2 }}
      className="rounded-xl bg-card border border-card-border overflow-hidden h-full flex flex-col shadow-2xl shadow-black/20 cursor-default"
    >
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border bg-card/50">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="ml-1 text-[10px] font-mono text-muted/50">shami ~ whoami</span>
      </div>

      {/* Terminal body */}
      <div className="p-4 font-mono text-[11px] leading-[1.8] flex-1">
        {TERM_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={line.cmd}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={i > 0 ? "mt-1" : ""}
          >
            {/* Command */}
            <div>
              <span className="text-accent">❯</span>{" "}
              <span className={line.type === "identity" ? "text-foreground/90" : "text-muted/40"}>
                {line.cmd}
              </span>
            </div>

            {/* Output */}
            {line.type === "identity" ? (
              <div className="flex items-center gap-3 my-2 pl-1">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1.5 bg-gradient-to-br from-accent/15 to-accent-secondary/10 rounded-full blur-lg pointer-events-none" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/ahtesham.jpg"
                    alt="Ahtesham Ahmad"
                    className="relative w-12 h-12 rounded-full object-cover border border-accent/25"
                  />
                </div>
                <div>
                  <p className="text-foreground font-bold text-sm font-sans">Ahtesham Ahmad</p>
                  <p className="text-accent text-[10px]">AI Engineer</p>
                </div>
              </div>
            ) : (
              <div className={`pl-4 text-[10.5px] ${line.green ? "text-accent-status/70" : "text-foreground/70"}`}>
                {line.output}
              </div>
            )}
          </motion.div>
        ))}

        {/* Blinking cursor while typing */}
        {isInView && visibleLines < TERM_LINES.length && (
          <div className="mt-1">
            <span className="text-accent">❯</span>{" "}
            <span className="inline-block w-[7px] h-[13px] bg-accent/70 animate-pulse translate-y-[2px]" />
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-3 py-2 border-t border-card-border/50 flex items-center justify-between bg-card/30">
        <div className="flex items-center gap-2 text-[9px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-status animate-pulse" />
          <span className="text-accent-status/70">available</span>
        </div>
        <a href="/uses" className="text-[9px] font-mono text-muted/30 hover:text-accent transition-colors">
          setup &rarr;
        </a>
      </div>
    </motion.div>
  );
}
