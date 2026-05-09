"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { TimeMachine } from "@/components/time-machine";
import { returnWithinPortfolio } from "@/lib/home-navigation";

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
      <div className="fixed -top-40 -right-40 w-[36rem] h-[36rem] bg-accent/[0.06] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -left-40 w-[36rem] h-[36rem] bg-purple-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/60 backdrop-blur-xl border-b border-card-border">
        <div className="max-w-5xl mx-auto px-5 md:px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            onClick={(event) => {
              if (!returnWithinPortfolio()) return;
              event.preventDefault();
            }}
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} />
            back to portfolio
          </Link>
          <p className="text-caption md:text-xs font-mono text-muted/80 text-center truncate hidden sm:block">
            <span className="text-accent">how I work</span> · behind the systems
          </p>
          <a
            href="https://ahtesham.dev.wadwarehouse.com/book"
            target="_blank"
            rel="noopener noreferrer"
            className="text-caption md:text-xs font-mono px-3 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all"
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
            thinking that made it ship. Six principles and a real day.
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
            <p className="text-caption font-mono text-muted/60 uppercase tracking-widest">
              scroll
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRINCIPLES */}
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
                className="group p-6 md:p-7 rounded-xl bg-card/60 border border-card-border hover:border-accent/20 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <p className="text-caption font-mono uppercase tracking-[0.25em] text-accent/80 mb-3">
                  {p.tag}
                </p>
                <h3 className="text-lg md:text-xl font-bold mb-3 leading-tight">
                  {p.headline}
                </h3>
                <p className="text-xs md:text-sm text-muted leading-relaxed mb-4">
                  {p.body}
                </p>
                <div className="pt-3 border-t border-card-border">
                  <p className="text-caption font-mono uppercase tracking-[0.2em] text-muted/60 mb-1.5">
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

      {/* DAY IN THE LIFE — interactive TimeMachine */}
      <section className="py-20 md:py-28 px-5 md:px-6 bg-card/20 relative">
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
              className="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 transition-all"
            >
              Book a 15-min call →
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
