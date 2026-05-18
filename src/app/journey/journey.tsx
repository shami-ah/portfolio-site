"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { TiltCard } from "@/components/tilt-card";
import { TimeMachine } from "@/components/time-machine";
import { AgentEmoji } from "@/components/agent-bar";

/* ------------------------------------------------------------------ */
/*  Content — the "how" behind the "what" on the home page.           */
/*  No career timeline (home covers that). No stack list (/uses).     */
/*  Just: principles, daily workflow, CTA.                            */
/* ------------------------------------------------------------------ */

interface Principle {
  tag: string;
  headline: string;
  body: string;
  example: string;
  mood: "default" | "proud" | "curious" | "waving" | "surprised";
}

const principles: Principle[] = [
  {
    tag: "01 · default",
    headline: "Human-in-the-loop, always.",
    body: "If an AI action touches money, commitments, or trust, a human approves it first. Full automation fails the first time the model misreads context.",
    example:
      "OpenEvent won't send an invoice until a human clicks approve. That single boundary is why 100+ clients stayed after the AI misfired.",
    mood: "proud",
  },
  {
    tag: "02 · sequence",
    headline: "Architect first. Code second.",
    body: "Every feature gets an architecture doc before a single line of code. The spec is checked into the repo, then the agent scaffolds from it.",
    example:
      "Thread summarization feature: 1 day of architecture doc, 2 hours of scaffolding, 0 rewrites. If the spec is right, the code falls out.",
    mood: "default",
  },
  {
    tag: "03 · trust-boundary",
    headline: "Strict at boundaries. Loose inside.",
    body: "All validation happens at system edges (user input, external APIs, webhook payloads). Internally, I trust the types and the invariants.",
    example:
      "Stripe webhooks have dual-secret verification + replay protection at the boundary. Business logic downstream assumes the payload is clean.",
    mood: "curious",
  },
  {
    tag: "04 · tools",
    headline: "Consumer AND producer of tooling.",
    body: "When the tool I need doesn't exist, I build it. CodeLens, gogaa, a custom dev container — each started as a personal frustration that became infrastructure.",
    example:
      "No commercial AI reviewer caught the bugs I saw in real PRs. So I built 305 hand-crafted patterns across 9 stacks. Now every PR runs through it.",
    mood: "surprised",
  },
  {
    tag: "05 · focus",
    headline: "One task per session.",
    body: "Context is sacred. I spawn a fresh agent session for each task, with scoped rules and a dedicated memory. Cross-contamination is the enemy.",
    example:
      "Reviewing an Openevent PR? That session only has OE's CLAUDE.md loaded. Drafting a gogaa feature? Different session, different memory.",
    mood: "default",
  },
  {
    tag: "06 · output",
    headline: "Deploy behind feature flags.",
    body: "Shipped code is off by default. I turn it on for 10% first, watch Sentry for 24h, then roll globally. No big-bang releases.",
    example:
      "Every OpenEvent feature ships dark. A bad migration caught in staging means one hour of rollback, not a week of bug fires.",
    mood: "waving",
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
            "linear-gradient(color-mix(in srgb, var(--foreground) 10%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--foreground) 10%, transparent) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/60 backdrop-blur-xl border-b border-card-border">
        <div className="max-w-5xl mx-auto px-5 md:px-6 py-3 flex items-center justify-between">
          <a
            href="https://ahtesham.dev.wadwarehouse.com/book"
            target="_blank"
            rel="noopener noreferrer"
            className="text-caption md:text-xs font-mono px-3 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all"
          >
            book a call
          </a>
          <p className="text-caption md:text-xs font-mono text-muted/80 text-center truncate hidden sm:block">
            <span className="text-accent">how I work</span> · behind the systems
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-accent transition-colors"
          >
            ← back to portfolio
          </Link>
        </div>
      </header>

      {/* Intro */}
      <section className="min-h-[calc(100vh-56px)] flex items-center justify-center px-5 md:px-6 pt-24 pb-16">
        <div className="max-w-5xl mx-auto w-full">
          <motion.p
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="text-sm font-mono text-accent mb-4 uppercase tracking-[0.3em] text-center"
          >
            behind the systems
          </motion.p>
          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-4xl mx-auto text-center text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.06] mb-5"
          >
            The operating principles behind every AI system I ship.
          </motion.h1>
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-sm md:text-lg text-muted leading-relaxed max-w-2xl mx-auto text-center"
          >
            Not a resume and not another project grid. This is the decision
            system: where AI can act, where humans approve, how context stays
            clean, and how production changes roll out without drama.
          </motion.p>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              ["Human gates", "Money, commitments, and trust always need approval."],
              ["Architecture first", "Specs and invariants before agent-generated code."],
              ["Tool producer", "Gogaa, CodeLens, Rasad, and WISC came from real workflow gaps."],
              ["Controlled rollout", "Feature flags, 10% exposure, Sentry, then global release."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl border border-card-border bg-card/70 p-4 text-left">
                <p className="font-mono text-caption uppercase tracking-[0.18em] text-accent mb-2">{title}</p>
                <p className="text-xs leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="mt-8 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-5 h-8 rounded-full border-2 border-muted/40 flex items-start justify-center p-1"
            >
              <div className="w-1 h-2 bg-accent rounded-full" />
            </motion.div>
            <p className="text-caption font-mono text-muted/60 uppercase tracking-widest">
              scroll
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="py-20 md:py-32 px-5 md:px-6 relative">
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
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
              <TiltCard className="group card-glow card-gradient-border p-6 md:p-7 rounded-xl bg-card border border-card-border hover:border-transparent transition-all duration-300 relative overflow-hidden h-full">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-caption font-mono uppercase tracking-wider text-accent/80">
                    {p.tag}
                  </p>
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-card-border to-card border border-accent-status/20 flex items-center justify-center shadow-sm shadow-accent/10">
                    <AgentEmoji size={24} mood={p.mood} />
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 leading-tight">
                  {p.headline}
                </h3>
                <p className="text-xs md:text-sm text-muted leading-relaxed mb-4">
                  {p.body}
                </p>
                <div className="pt-3 border-t border-card-border">
                  <p className="text-caption font-mono uppercase tracking-wider text-muted/60 mb-1.5">
                    real example
                  </p>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {p.example}
                  </p>
                </div>
              </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DAY IN THE LIFE — interactive TimeMachine */}
      <section className="py-20 md:py-32 px-5 md:px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 md:mb-10 text-center">
            <p className="text-sm font-mono text-accent mb-3 uppercase tracking-[0.3em]">
              a typical day
            </p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
              07:00 to 18:00 · drag through the day.
            </h2>
            <p className="text-sm md:text-base text-muted max-w-xl mx-auto">
              Deep work over meetings. Architecture over reaction. Memory over rework.
            </p>
          </div>
          <TimeMachine />
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
              className="px-6 py-3 btn-gradient font-medium rounded-lg hover:shadow-lg hover:shadow-accent/20 transition-all text-sm"
            >
              Book a 15-min call
            </a>
            <Link
              href="/#projects"
              className="px-6 py-3 border border-card-border text-foreground rounded-lg hover:bg-card hover:border-muted/20 transition-all"
            >
              See the projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
