"use client";

import { motion } from "framer-motion";
import { TimeMachine } from "@/components/time-machine";

/* ------------------------------------------------------------------ */
/*  Content — intentionally NOT duplicated from the main portfolio.   */
/*  This page is the "how" behind the "what" on the home page.        */
/* ------------------------------------------------------------------ */

interface Principle {
  tag: string;
  headline: string;
  body: string;
  example: string;
}

const principles: Principle[] = [
  {
    tag: "01 · default",
    headline: "Human-in-the-loop, always.",
    body: "If an AI action touches money, commitments, or trust, a human approves it first. Full automation fails the first time the model misreads context.",
    example:
      "OpenEvent won't send an invoice until a human clicks approve. That single boundary is why 100+ clients stayed after the AI misfired.",
  },
  {
    tag: "02 · sequence",
    headline: "Architect first. Code second.",
    body: "Every feature gets an architecture doc before a single line of code. The spec is checked into the repo, then the agent scaffolds from it.",
    example:
      "Thread summarization feature: 1 day of architecture doc, 2 hours of scaffolding, 0 rewrites. If the spec is right, the code falls out.",
  },
  {
    tag: "03 · trust-boundary",
    headline: "Strict at boundaries. Loose inside.",
    body: "All validation happens at system edges (user input, external APIs, webhook payloads). Internally, I trust the types and the invariants.",
    example:
      "Stripe webhooks have dual-secret verification + replay protection at the boundary. Business logic downstream assumes the payload is clean.",
  },
  {
    tag: "04 · tools",
    headline: "Consumer AND producer of tooling.",
    body: "When the tool I need doesn't exist, I build it. CodeLens, gogaa, a custom dev container — each started as a personal frustration that became infrastructure.",
    example:
      "No commercial AI reviewer caught the bugs I saw in real PRs. So I built 305 hand-crafted patterns across 9 stacks. Now every PR runs through it.",
  },
  {
    tag: "05 · focus",
    headline: "One task per session.",
    body: "Context is sacred. I spawn a fresh agent session for each task, with scoped rules and a dedicated memory. Cross-contamination is the enemy.",
    example:
      "Reviewing an Openevent PR? That session only has OE's CLAUDE.md loaded. Drafting a gogaa feature? Different session, different memory.",
  },
  {
    tag: "06 · output",
    headline: "Deploy behind feature flags.",
    body: "Shipped code is off by default. I turn it on for 10% first, watch Sentry for 24h, then roll globally. No big-bang releases.",
    example:
      "Every OpenEvent feature ships dark. A bad migration caught in staging means one hour of rollback, not a week of bug fires.",
  },
];

const day: { time: string; title: string; note: string; tag: string }[] = [
  {
    time: "07:00",
    title: "Overnight review",
    note: "CodeLens reports on every repo I touched yesterday. Triage what matters. File issues for what doesn't.",
    tag: "input",
  },
  {
    time: "08:00",
    title: "Gogaa architect session",
    note: "One feature. Open spec file. Use gogaa /architect to sketch. Save the diagram to memory. No code yet.",
    tag: "spec",
  },
  {
    time: "10:00",
    title: "Spec → scaffold",
    note: "Gogaa reads spec + patterns. Produces a SEARCH/REPLACE diff. I review block by block. ~90% accepted first pass.",
    tag: "build",
  },
  {
    time: "13:00",
    title: "Review hour",
    note: "Claude Code + CodeLens in parallel on every PR. Merge only after both pass. Guardian mode prevents half the bug classes upstream.",
    tag: "review",
  },
  {
    time: "15:00",
    title: "Deep work",
    note: "Either: tool-building (gogaa, CodeLens), or hard research. No meetings, no Slack. Timer at 90 minutes.",
    tag: "deep",
  },
  {
    time: "18:00",
    title: "Retro + memory",
    note: "Write down what I learned. Update CLAUDE.md. Save feedback to agent memory. Commit. Ship.",
    tag: "close",
  },
];

interface ToolStop {
  icon: string;
  label: string;
  why: string;
}

const devStack: ToolStop[] = [
  {
    icon: "📱",
    label: "Phone + Tailscale",
    why: "My dev environment follows me. SSH into my Mac from anywhere, private mesh network, no port forwarding.",
  },
  {
    icon: "🐳",
    label: "Docker container",
    why: "Reproducible isolated env. Same container on Mac, Linux VPS, phone-SSH. Zero 'works on my machine'.",
  },
  {
    icon: "🤖",
    label: "Claude Code + gogaa",
    why: "Two agents, different strengths. CC for complex tasks, gogaa when I need 11 providers or Aider-grade git flow.",
  },
  {
    icon: "🛡",
    label: "CodeLens guardian",
    why: "Injects 305 patterns into Claude Code / Cursor / Copilot's context. Bugs are prevented at generation, not review.",
  },
  {
    icon: "⚙",
    label: "GitHub Actions",
    why: "Every PR: build, lint, CodeLens review, auto-migration to staging. Green CI is the only path to main.",
  },
  {
    icon: "🚀",
    label: "Feature-flag deploy",
    why: "Ship dark. 10% → watch → 100%. Sentry + Grafana dashboards open during rollout.",
  },
];

export function Journey(): React.ReactElement {
  return (
    <main className="relative min-h-screen">
      {/* Ambient */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="fixed -top-40 -right-40 w-[36rem] h-[36rem] bg-accent/[0.06] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -left-40 w-[36rem] h-[36rem] bg-purple-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/60 backdrop-blur-xl border-b border-card-border">
        <div className="max-w-5xl mx-auto px-5 md:px-6 py-3 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-accent transition-colors"
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
          <p className="text-[10px] md:text-xs font-mono text-muted/70 text-center truncate hidden sm:block">
            <span className="text-accent">how I work</span> · behind the systems
          </p>
          <a
            href="https://ahtesham.dev.wadwarehouse.com/book"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] md:text-xs font-mono px-3 py-1.5 rounded-md bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 transition-all"
          >
            book a call →
          </a>
        </div>
      </header>

      {/* Intro */}
      <section className="min-h-[80vh] flex items-center justify-center px-5 md:px-6 pt-24 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-sm font-mono text-accent mb-4 uppercase tracking-[0.3em]"
          >
            not the resume. not the projects.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
          >
            The
            <span className="text-accent"> principles </span>
            and the
            <span className="text-accent"> day-to-day </span>
            behind every system I ship.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm md:text-lg text-muted leading-relaxed max-w-xl mx-auto"
          >
            The home page shows what I&apos;ve built. This page shows the
            thinking that made it ship. Six principles. A real day. The tools
            I reach for.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
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

      {/* TIME MACHINE — the career trajectory in one control */}
      <section className="py-16 md:py-20 px-5 md:px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 md:mb-10 text-center">
            <p className="text-sm font-mono text-accent mb-3 uppercase tracking-[0.3em]">
              trajectory
            </p>
            <h2 className="text-2xl md:text-4xl font-bold leading-tight">
              Drag through the years.
            </h2>
          </div>
          <TimeMachine />
        </div>
      </section>

      {/* PRINCIPLES — the unique content */}
      <section className="py-20 md:py-28 px-5 md:px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 md:mb-16 text-center">
            <p className="text-sm font-mono text-accent mb-4 uppercase tracking-[0.3em]">
              six principles
            </p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              The rules I actually follow.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            {principles.map((p, i) => (
              <motion.div
                key={p.tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group p-6 md:p-7 rounded-2xl bg-card/60 border border-card-border hover:border-accent/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent/70 mb-3">
                  {p.tag}
                </p>
                <h3 className="text-lg md:text-xl font-bold mb-3 leading-tight">
                  {p.headline}
                </h3>
                <p className="text-xs md:text-sm text-muted leading-relaxed mb-4">
                  {p.body}
                </p>
                <div className="pt-3 border-t border-card-border">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted/50 mb-1.5">
                    real example
                  </p>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {p.example}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DAY IN THE LIFE */}
      <section className="py-20 md:py-28 px-5 md:px-6 bg-card/20 relative">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 md:mb-16 text-center">
            <p className="text-sm font-mono text-accent mb-4 uppercase tracking-[0.3em]">
              a typical day
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              07:00 to 18:00 · exactly this.
            </h2>
            <p className="text-sm md:text-base text-muted max-w-xl mx-auto">
              Deep work over meetings. Architecture over reaction. Memory over rework.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[27px] md:left-[60px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

            <div className="space-y-6 md:space-y-8">
              {day.map((d, i) => (
                <motion.div
                  key={d.time}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative pl-16 md:pl-32"
                >
                  {/* Time label */}
                  <div className="absolute left-0 top-0 w-14 md:w-[110px] text-left">
                    <p className="text-sm md:text-base font-mono font-bold text-accent/90 tabular-nums">
                      {d.time}
                    </p>
                    <p className="text-[9px] md:text-[10px] font-mono text-muted/40 uppercase tracking-widest mt-0.5">
                      {d.tag}
                    </p>
                  </div>
                  {/* Dot */}
                  <div className="absolute left-[22px] md:left-[55px] top-2 w-3 h-3 rounded-full bg-accent ring-4 ring-background" />
                  {/* Content */}
                  <div className="p-4 md:p-5 rounded-xl bg-card border border-card-border hover:border-accent/30 transition-colors">
                    <h3 className="text-base md:text-lg font-bold mb-1.5">
                      {d.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted leading-relaxed">
                      {d.note}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DEV STACK */}
      <section className="py-20 md:py-28 px-5 md:px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 md:mb-16 text-center">
            <p className="text-sm font-mono text-accent mb-4 uppercase tracking-[0.3em]">
              the stack I actually reach for
            </p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Every tool earns its place.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {devStack.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="p-5 md:p-6 rounded-xl bg-card/60 border border-card-border hover:border-accent/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl" aria-hidden>
                    {t.icon}
                  </span>
                  <p className="text-sm md:text-base font-bold">{t.label}</p>
                </div>
                <p className="text-xs md:text-sm text-muted leading-relaxed">
                  {t.why}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BUILDING NEXT — roadmap */}
      <section className="py-20 md:py-28 px-5 md:px-6 bg-card/20 relative">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 md:mb-16 text-center">
            <p className="text-sm font-mono text-accent mb-4 uppercase tracking-[0.3em]">
              on the roadmap
            </p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              What I&apos;m building next.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                title: "Gogaa Architect Mode",
                status: "Next Up",
                desc: "Two-model split for complex tasks: a strong model plans and writes specs, a fast model executes edits. Cuts cost and improves quality on hard problems.",
              },
              {
                title: "OpenEvent Adaptive Approval Engine",
                status: "Designing",
                desc: "The system tracks which actions are approved vs rejected. As patterns emerge, trust thresholds adjust automatically. Human review load drops week-over-week without removing the human from the loop.",
              },
              {
                title: "Gogaa Remote Session Viewer",
                status: "Planned",
                desc: "Watch and control any gogaa agent session from a browser or phone, over LAN or tunnel. Real-time streaming of tool calls, diffs, and cost. The agent running on your dev machine, accessible anywhere.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative p-5 md:p-6 rounded-xl bg-card/60 border border-card-border hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-sm md:text-base font-bold leading-tight">
                    {item.title}
                  </h3>
                  <span
                    className={`shrink-0 px-2 py-0.5 text-[10px] font-mono rounded ${
                      item.status === "Next Up"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : item.status === "Designing"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : "bg-muted/10 text-muted/80 border border-card-border"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-muted leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-5 md:px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            If the principles fit
            <br />
            <span className="text-accent">let&apos;s build something.</span>
          </h2>
          <p className="text-sm md:text-base text-muted mb-10 max-w-lg mx-auto leading-relaxed">
            This is how I work with every client and every repo. If that
            sounds like what you need, book a 15-minute intro call.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://ahtesham.dev.wadwarehouse.com/book"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 transition-all"
            >
              Book a 15-min call →
            </a>
            <a
              href="/#projects"
              className="px-6 py-3 border border-card-border text-foreground rounded-lg hover:bg-card hover:border-muted/30 transition-all"
            >
              See the projects
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
