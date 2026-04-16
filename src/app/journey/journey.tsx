"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface Milestone {
  year: string;
  month?: string;
  title: string;
  description: string;
  tag: string;
  tone: "accent" | "emerald" | "amber" | "purple" | "pink";
}

const milestones: Milestone[] = [
  {
    year: "2019",
    title: "First production ML",
    description:
      "Started shipping for real clients on Upwork & Fiverr. Learned: building demos is easy, production breaks differently.",
    tag: "origin",
    tone: "accent",
  },
  {
    year: "2021",
    title: "Prompt engineering era",
    description:
      "500+ RLHF/SFT evaluation sessions on frontier models at Outlier, RWS, Translated. Ringside seat to how models actually behave.",
    tag: "model evaluation",
    tone: "purple",
  },
  {
    year: "2022",
    month: "Jan",
    title: "Director of IT & R&D",
    description:
      "Led a 10-person team at Rouelite Techno. Designed a CRM serving 500+ daily users. First time owning architecture end-to-end.",
    tag: "leadership",
    tone: "amber",
  },
  {
    year: "2024",
    title: "Tool-builder year",
    description:
      "Started CodeLens because no commercial AI reviewer caught what I saw in real PRs. 305 patterns, 9 stacks, built from real production failures.",
    tag: "codelens v0.1",
    tone: "accent",
  },
  {
    year: "2025",
    month: "Sep",
    title: "Lead AI Developer, More Life Hospitality",
    description:
      "Upwork gig → full-time offer. Architected OpenEvent: email → classify → approve → execute. Live with 100+ clients today.",
    tag: "openevent launch",
    tone: "emerald",
  },
  {
    year: "2026",
    month: "Apr",
    title: "Gogaa v0.9.1 — Aider parity shipped",
    description:
      "11 providers, 1,418 tests, repo map, SEARCH/REPLACE, watch mode, plugin marketplace. The open-source coding agent I wanted to use.",
    tag: "now",
    tone: "pink",
  },
];

const dayInLife: { time: string; title: string; note: string }[] = [
  {
    time: "07:00",
    title: "Morning review",
    note: "Read overnight CodeLens reports on client repos. Triage what matters.",
  },
  {
    time: "08:00",
    title: "Architect in gogaa",
    note: "New feature goes through spec → plan → code in the CLI. One task per session.",
  },
  {
    time: "10:00",
    title: "OpenEvent sprint",
    note: "Workflow engine work. Schema changes, edge function, RLS, Stripe webhook.",
  },
  {
    time: "13:00",
    title: "PR review",
    note: "Claude Code + CodeLens in parallel. Merge only after both pass.",
  },
  {
    time: "15:00",
    title: "Deep work",
    note: "Either tool-building (gogaa, CodeLens) or research. No meetings.",
  },
  {
    time: "18:00",
    title: "Retro",
    note: "Write what I learned to memory. Commit. Ship.",
  },
];

const toneClasses: Record<
  Milestone["tone"],
  { border: string; dot: string; tag: string; bg: string }
> = {
  accent: {
    border: "border-accent/40",
    dot: "bg-accent",
    tag: "text-accent border-accent/30 bg-accent/10",
    bg: "from-accent/5",
  },
  emerald: {
    border: "border-emerald-500/40",
    dot: "bg-emerald-400",
    tag: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    bg: "from-emerald-500/5",
  },
  amber: {
    border: "border-amber-500/40",
    dot: "bg-amber-400",
    tag: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    bg: "from-amber-500/5",
  },
  purple: {
    border: "border-purple-500/40",
    dot: "bg-purple-400",
    tag: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    bg: "from-purple-500/5",
  },
  pink: {
    border: "border-pink-500/40",
    dot: "bg-pink-400",
    tag: "text-pink-400 border-pink-500/30 bg-pink-500/10",
    bg: "from-pink-500/5",
  },
};

export function Journey(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Translate the horizontal track based on vertical scroll progress.
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -Math.max(trackWidth - (typeof window !== "undefined" ? window.innerWidth : 1200), 0)],
  );
  const smoothX = useSpring(x, { stiffness: 80, damping: 24, mass: 0.5 });

  useEffect(() => {
    const onResize = (): void => {
      if (trackRef.current) setTrackWidth(trackRef.current.scrollWidth);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <main className="relative">
      {/* Top controls */}
      <div className="fixed top-5 left-5 z-50 flex items-center gap-3">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card/80 backdrop-blur-md border border-card-border hover:border-accent/40 transition-all text-xs font-mono text-muted hover:text-foreground"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          back to portfolio
        </a>
      </div>
      <div className="fixed top-5 right-5 z-50">
        <p className="text-[10px] font-mono text-muted/60 bg-card/80 backdrop-blur-md border border-card-border px-3 py-2 rounded-lg">
          scroll to explore →
        </p>
      </div>

      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-purple-500 to-emerald-400 z-50 origin-left"
      />

      {/* Ambient backdrop */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Intro section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-sm font-mono text-accent mb-4 uppercase tracking-[0.3em]"
          >
            an interactive tour
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Five years of
            <br />
            <span className="text-accent">shipping production AI.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-sm md:text-lg text-muted leading-relaxed max-w-xl mx-auto"
          >
            Keep scrolling. A horizontal timeline will move beneath you. Every
            card is a real moment that shaped how I build.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-5 h-8 rounded-full border-2 border-muted/40 flex items-start justify-center p-1"
            >
              <div className="w-1 h-2 bg-accent rounded-full" />
            </motion.div>
            <p className="text-[10px] font-mono text-muted/50 uppercase tracking-widest">
              scroll
            </p>
          </motion.div>
        </div>
      </section>

      {/* Horizontal scroll timeline */}
      <section
        ref={containerRef}
        className="relative"
        style={{ height: `${milestones.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent pointer-events-none" />

          <motion.div
            ref={trackRef}
            style={{ x: smoothX }}
            className="flex items-center gap-8 md:gap-16 pl-[10vw] pr-[10vw] will-change-transform"
          >
            {milestones.map((m, i) => {
              const t = toneClasses[m.tone];
              return (
                <div
                  key={m.year + m.title}
                  className="shrink-0 w-[80vw] md:w-[500px] lg:w-[560px]"
                >
                  {/* Node on timeline */}
                  <div className="flex items-center gap-4 mb-6">
                    <span
                      className={`w-4 h-4 rounded-full ${t.dot} ring-4 ring-background relative`}
                    >
                      <span className={`absolute inset-0 rounded-full ${t.dot} animate-ping opacity-50`} />
                    </span>
                    <span className="flex-1 h-px bg-gradient-to-r from-card-border to-transparent" />
                    <span className="font-mono text-xs text-muted/40 tabular-nums">
                      {String(i + 1).padStart(2, "0")} / {String(milestones.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Card */}
                  <div
                    className={`relative p-6 md:p-8 rounded-2xl bg-gradient-to-br ${t.bg} via-card to-card border ${t.border} shadow-2xl overflow-hidden`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30 text-accent" />

                    <div className="flex items-center gap-3 mb-5">
                      <p className="text-4xl md:text-5xl font-bold font-mono text-foreground/90 tracking-tight">
                        {m.year}
                      </p>
                      {m.month && (
                        <p className="text-sm font-mono text-muted/60 mt-3">
                          {m.month}
                        </p>
                      )}
                      <span
                        className={`ml-auto px-2.5 py-1 text-[10px] font-mono rounded border ${t.tag}`}
                      >
                        {m.tag}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold mb-3 leading-tight">
                      {m.title}
                    </h2>
                    <p className="text-sm md:text-base text-muted leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Bottom hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-mono text-muted/40">
            <span>←</span>
            <span>scroll vertically to pan through time</span>
            <span>→</span>
          </div>
        </div>
      </section>

      {/* Day in the life */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-6xl mx-auto px-5 md:px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-mono text-accent mb-4 uppercase tracking-[0.3em]">
              a typical day
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Six windows into how I work.
            </h2>
            <p className="text-sm md:text-base text-muted max-w-xl mx-auto">
              Deep work, not meetings. Architecture first, code second.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {dayInLife.map((d, i) => (
              <motion.div
                key={d.time}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative p-6 md:p-7 rounded-xl bg-card border border-card-border hover:border-accent/30 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-3xl md:text-4xl font-mono font-bold text-accent/80 mb-3 tabular-nums">
                  {d.time}
                </p>
                <h3 className="text-base md:text-lg font-bold mb-2">
                  {d.title}
                </h3>
                <p className="text-xs md:text-sm text-muted leading-relaxed">
                  {d.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What runs in parallel */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-mono text-accent mb-4 uppercase tracking-[0.3em]">
              what runs at the same time
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Parallel systems, one operator.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: "OpenEvent",
                subtitle: "production SaaS",
                status: "live",
                detail: "100+ clients · 150+ events · AI triage + human approval",
                tone: "emerald",
              },
              {
                title: "CodeLens",
                subtitle: "AI review engine",
                status: "private beta",
                detail: "305 patterns · 9 stacks · Guardian mode active across AI tools",
                tone: "accent",
              },
              {
                title: "Gogaa CLI",
                subtitle: "open-source coding agent",
                status: "v0.9.1",
                detail: "11 providers · 1,418 tests · Aider parity + plugin marketplace",
                tone: "pink",
              },
            ].map((p, i) => {
              const t = toneClasses[p.tone as Milestone["tone"]];
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative p-6 rounded-xl bg-gradient-to-br ${t.bg} via-card to-card border ${t.border} overflow-hidden`}
                >
                  <span
                    className={`absolute top-4 right-4 px-2 py-0.5 text-[9px] font-mono rounded border ${t.tag}`}
                  >
                    {p.status}
                  </span>
                  <h3 className="text-xl font-bold mb-1">{p.title}</h3>
                  <p className="text-xs font-mono text-muted/60 uppercase tracking-wider mb-4">
                    {p.subtitle}
                  </p>
                  <p className="text-sm text-muted leading-relaxed">
                    {p.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-3xl mx-auto px-5 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Still here?
            <br />
            <span className="text-accent">Let&apos;s talk.</span>
          </h2>
          <p className="text-sm md:text-base text-muted mb-10 max-w-lg mx-auto leading-relaxed">
            If this walk through resonated, you probably have a system that
            could use the same kind of thinking. Reach out.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://calendly.com/shami8024/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 transition-all"
            >
              Book a 15-min call
            </a>
            <a
              href="/#contact"
              className="px-6 py-3 border border-card-border text-foreground rounded-lg hover:bg-card hover:border-muted/30 transition-all"
            >
              See contact options
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
