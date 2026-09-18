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
    headline: "People stay in control.",
    body: "When an AI action affects money, commitments, or customer trust, a person reviews it before anything is finalized. AI handles the work; people make the important decisions.",
    example:
      "In OpenEvent, AI can prepare bookings and invoices, but a human approves the final action before it is sent.",
    mood: "proud",
  },
  {
    tag: "02 · sequence",
    headline: "Plan first. Code second.",
    body: "Before building a feature, I define how it should work, what can go wrong, and how the pieces connect. This reduces unnecessary rework and keeps development focused.",
    example:
      "For a thread summarization feature, the workflow was defined before development began, allowing the implementation to move quickly with fewer rewrites.",
    mood: "default",
  },
  {
    tag: "03 · trust-boundary",
    headline: "Protect the important parts.",
    body: "User input, payments, and information coming from outside systems are checked carefully before they enter the application. This helps keep the rest of the product reliable.",
    example:
      "Payment webhooks are verified and protected against replay before the rest of the application processes them.",
    mood: "curious",
  },
  {
    tag: "04 · tools",
    headline: "I build the tools I need.",
    body: "When an existing tool does not solve the problem well enough, I create one. These tools often become useful infrastructure for future projects.",
    example:
      "CodeLens started because existing AI reviewers were missing bugs found in real code reviews. It grew into a system with hundreds of patterns across multiple technology stacks.",
    mood: "surprised",
  },
  {
    tag: "05 · focus",
    headline: "One clear task per session.",
    body: "Each development task gets its own focused working context. This keeps requirements clear, reduces confusion, and helps prevent unrelated work from affecting the result.",
    example:
      "An OpenEvent task has its own project context and rules, while a Gogaa feature is handled separately with its own requirements.",
    mood: "default",
  },
  {
    tag: "06 · output",
    headline: "Release carefully, not all at once.",
    body: "New features are introduced gradually instead of exposing every customer to a change immediately. I monitor the product, check for problems, and expand the release when it is ready.",
    example:
      "OpenEvent features can be released gradually so problems can be identified and rolled back before they affect the entire user base.",
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
            How I turn ideas into reliable AI products.
          </motion.h1>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-sm md:text-lg text-muted leading-relaxed max-w-2xl mx-auto text-center"
          >
            A simple look at how I plan, build, test, and release AI products
            so they solve real problems while people stay in control.
          </motion.p>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              [
                "People stay in control",
                "Important actions are reviewed before they happen.",
              ],
              [
                "Plan before building",
                "Clear requirements help reduce rework.",
              ],
              [
                "Build what is needed",
                "Custom tools fill gaps when existing solutions fall short.",
              ],
              [
                "Release carefully",
                "New features are introduced gradually and monitored.",
              ],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-xl border border-card-border bg-card/70 p-4 text-left"
              >
                <p className="font-mono text-caption uppercase tracking-[0.18em] text-accent mb-2">
                  {title}
                </p>

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
              How I build products.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            {principles.map((p, i) => (
              <motion.div
                key={p.tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
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
              Focused building, clear planning, and time spent improving the
              product instead of unnecessary meetings.
            </p>
          </div>

          <TimeMachine />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-5 md:px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Need an AI product?
            <br />
            <span className="text-accent">Let&apos;s build it.</span>
          </h2>

          <p className="text-sm md:text-base text-muted mb-10 max-w-lg mx-auto leading-relaxed">
            This is how I approach client projects: understand the problem,
            plan the solution, build it carefully, and release it with
            confidence. If that sounds like what you need, book a 15-minute
            intro call.
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

