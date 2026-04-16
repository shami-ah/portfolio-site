"use client";

import { FadeUp } from "./motion";
import { useStatus } from "@/lib/use-status";

export function BeforeAfter(): React.ReactElement {
  const { status } = useStatus();
  const oe = status.openevent;
  const mins = Math.round(oe.hoursSavedPerDay * 60);
  const afterMins = 15;
  const savedPercent = Math.round(((mins - afterMins) / mins) * 100);
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            OpenEvent · measured impact
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight">
            Before and after.
          </h2>
          <p className="text-sm md:text-base text-muted mb-10 md:mb-12 max-w-2xl">
            Event coordinators used to spend their mornings reading and sorting
            hundreds of client emails. The AI layer turned that workflow inside
            out.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-4 md:gap-5 items-stretch">
          {/* BEFORE */}
          <FadeUp delay={0.05}>
            <div className="relative h-full p-6 md:p-8 rounded-xl bg-card/50 border border-card-border">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-mono text-muted/60 uppercase tracking-[0.2em]">
                  Before
                </span>
                <span className="text-[10px] font-mono text-muted/40">manual flow</span>
              </div>

              <p className="text-4xl md:text-5xl font-bold text-muted mb-2 font-mono">
                ~{oe.hoursSavedPerDay}
                <span className="text-muted/40 text-2xl">hrs</span>
              </p>
              <p className="text-sm text-muted/70 mb-6">
                per team member, per day<br />
                just to read and triage client email
              </p>

              <div className="space-y-2 pt-5 border-t border-card-border">
                {[
                  "Open each thread individually",
                  "Guess intent, copy details into tools",
                  "Chase approvals across Slack / email",
                  "Forget one. Lose a client.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 text-xs md:text-sm text-muted/70"
                  >
                    <span className="text-muted/40 mt-0.5 shrink-0">✕</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* AFTER */}
          <FadeUp delay={0.15}>
            <div className="relative h-full p-6 md:p-8 rounded-xl bg-gradient-to-br from-accent/10 via-card to-card border border-accent/30 overflow-hidden">
              {/* Accent glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono text-accent uppercase tracking-[0.2em]">
                    After
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    live in production
                  </span>
                </div>

                <p className="text-4xl md:text-5xl font-bold text-accent mb-2 font-mono">
                  ~15<span className="text-accent/50 text-2xl">min</span>
                </p>
                <p className="text-sm text-muted mb-6">
                  per team member, per day<br />
                  to review AI-drafted actions and approve
                </p>

                <div className="space-y-2 pt-5 border-t border-accent/20">
                  {[
                    "AI classifies every inbound email",
                    "Entities + intent extracted automatically",
                    "Draft action shown. Human clicks approve.",
                    "Calendar, invoice, CRM fire. Audit logged.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-xs md:text-sm text-foreground/90"
                    >
                      <span className="text-accent mt-0.5 shrink-0">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Bottom stats row */}
        <FadeUp delay={0.25}>
          <div className="mt-6 md:mt-8 grid grid-cols-3 gap-3 md:gap-5">
            {[
              { n: `${oe.clients}+`, l: "active clients" },
              { n: `${oe.events}+`, l: "events run" },
              { n: `${savedPercent}%`, l: "time saved" },
            ].map((s) => (
              <div
                key={s.l}
                className="p-4 md:p-5 rounded-lg bg-card/50 border border-card-border text-center"
              >
                <p className="text-xl md:text-3xl font-bold text-accent font-mono">
                  {s.n}
                </p>
                <p className="text-[10px] md:text-xs text-muted mt-1 uppercase tracking-wider">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
