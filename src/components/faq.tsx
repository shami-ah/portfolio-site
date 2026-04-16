"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "./motion";

interface FaqItem {
  q: string;
  a: React.ReactNode;
}

const items: FaqItem[] = [
  {
    q: "What are your rates?",
    a: (
      <>
        For scoped project work: tier-based, starting around <strong>$3k</strong>{" "}
        for focused deliveries and scaling with complexity. For full-time roles:
        flexible, depending on scope, equity, and impact. Book a call and
        we&apos;ll talk specifics.
      </>
    ),
  },
  {
    q: "Which timezone do you work in?",
    a: (
      <>
        Pakistan (UTC+5). That overlaps cleanly with both{" "}
        <strong>EU mornings</strong> and <strong>Gulf business hours</strong>.
        I&apos;m async-first: my tools (CodeLens, gogaa, memory systems) mean
        progress doesn&apos;t wait for meetings.
      </>
    ),
  },
  {
    q: "What kinds of projects do you say no to?",
    a: (
      <>
        Throwaway prototypes with no production path. Fully autonomous systems
        where human oversight matters (I will always propose a human-in-the-loop
        design instead). Any work on surveillance tooling.
      </>
    ),
  },
  {
    q: "How do you work with clients?",
    a: (
      <>
        <strong>Architecture document first</strong> (1-3 day discovery). Then
        sprint-based delivery with weekly demos. CodeLens runs on every PR so
        you see the review findings alongside every change. I default to
        transparency: staging environment, shared Supabase dashboard, PR-by-PR
        visibility.
      </>
    ),
  },
  {
    q: "Which parts of the stack are you strongest in?",
    a: (
      <>
        <strong>AI orchestration</strong> (Claude, OpenAI, RAG on pgvector,
        multi-agent coordination with human gates) and{" "}
        <strong>full-stack TypeScript</strong> (React, Next.js, Supabase, Edge
        Functions, Stripe). The stack is secondary though — my real value is
        the architecture decisions that keep systems stable under real load.
      </>
    ),
  },
  {
    q: "Are you open to relocation or on-site work?",
    a: (
      <>
        Remote full-time is my preference. Open to occasional on-site for
        Gulf/EU clients. No permanent relocation without the right role and
        conditions.
      </>
    ),
  },
  {
    q: "Can I see real code from something you&apos;ve built?",
    a: (
      <>
        Private client work (OpenEvent, CodeLens) stays private. The{" "}
        <strong>patterns</strong> and <strong>architecture decisions</strong>{" "}
        are all documented in the case studies though. Happy to do a code walkthrough
        on a call under NDA.
      </>
    ),
  },
  {
    q: "What&apos;s your response time?",
    a: (
      <>
        Usually under <strong>24 hours</strong>. The booking link goes straight
        to my calendar with open slots for the next two weeks.
      </>
    ),
  },
];

export function FAQ(): React.ReactElement {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-5 md:px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            Before you reach out
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 md:mb-12 leading-tight">
            Things people ask me.
          </h2>
        </FadeUp>

        <div className="space-y-2.5 md:space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <FadeUp key={item.q} delay={i * 0.04}>
                <div
                  className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "border-accent/30 bg-card/80 shadow-lg shadow-accent/5"
                      : "border-card-border bg-card/40 hover:border-accent/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full text-left px-4 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4"
                  >
                    <span
                      className={`text-sm md:text-base font-medium transition-colors ${
                        isOpen ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {item.q}
                    </span>
                    <span
                      className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? "border-accent bg-accent/10 rotate-45 text-accent"
                          : "border-muted/40 text-muted/50"
                      }`}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 md:px-6 pb-4 md:pb-6 text-sm md:text-[15px] text-muted leading-relaxed">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            );
          })}
        </div>

        {/* Bottom nudge */}
        <FadeUp delay={0.3}>
          <div className="mt-10 text-center">
            <p className="text-xs md:text-sm text-muted/60">
              Still have a question?{" "}
              <a
                href="#contact"
                className="text-accent hover:underline underline-offset-4"
              >
                Ask me directly
              </a>
              {" "}or type it in the agent bar at the bottom.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
