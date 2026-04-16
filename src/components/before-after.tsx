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
    /* FULL-BLEED SECTION — breaks out of any container above it */
    <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] py-20 md:py-36 overflow-hidden">
      {/* Split background: muted left, accent-glow right */}
      <div className="absolute inset-0 grid grid-cols-[1fr_1.2fr] pointer-events-none">
        <div className="bg-card/20" />
        <div className="relative bg-gradient-to-br from-accent/[0.08] via-card/30 to-transparent">
          <div className="absolute -top-40 -right-40 w-[40rem] h-[40rem] bg-accent/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        {/* Header — left-anchored */}
        <FadeUp>
          <div className="max-w-2xl mb-14 md:mb-20">
            <p className="text-xs md:text-sm font-mono text-accent mb-3 uppercase tracking-[0.25em]">
              OpenEvent · measured impact
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Before,
              <br />
              <span className="text-muted/50">and after.</span>
            </h2>
            <p className="text-sm md:text-base text-muted mt-5 md:mt-6 leading-relaxed">
              Event coordinators used to spend their mornings reading and sorting
              hundreds of client emails. The AI layer turned that workflow inside
              out.
            </p>
          </div>
        </FadeUp>

        {/* Editorial two-panel split with asymmetric weight */}
        <div className="grid md:grid-cols-[1fr_1.3fr] gap-4 md:gap-0 items-stretch relative">
          {/* BEFORE — muted, smaller */}
          <FadeUp delay={0.1}>
            <div className="relative h-full p-6 md:p-10 rounded-2xl md:rounded-l-2xl md:rounded-r-none bg-card/40 border border-card-border md:border-r-0">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-mono text-muted/60 uppercase tracking-[0.25em]">
                  Before
                </span>
                <span className="text-[10px] font-mono text-muted/40">
                  manual flow
                </span>
              </div>

              <p className="font-bold font-mono text-muted tabular-nums tracking-tight leading-[0.9] text-[72px] md:text-[96px] lg:text-[120px] mb-3">
                ~{oe.hoursSavedPerDay}
                <span className="text-muted/40 text-3xl md:text-5xl">
                  hrs
                </span>
              </p>
              <p className="text-sm md:text-base text-muted/70 leading-relaxed mb-8 max-w-sm">
                Per team member, every day, just to read and triage inbound
                client email.
              </p>

              <div className="space-y-2.5 pt-6 border-t border-card-border">
                {[
                  "Open each thread individually",
                  "Guess intent, copy details into tools",
                  "Chase approvals across Slack / email",
                  "Forget one. Lose a client.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 text-xs md:text-sm text-muted/70"
                  >
                    <span className="text-muted/30 mt-0.5 shrink-0">✕</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* AFTER — larger, brighter, shifted */}
          <FadeUp delay={0.2}>
            <div className="relative h-full p-6 md:p-12 rounded-2xl md:rounded-r-2xl md:rounded-l-none bg-gradient-to-br from-accent/[0.12] via-card to-card border border-accent/30 overflow-hidden md:-ml-px md:shadow-2xl md:shadow-accent/10">
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] md:text-xs font-mono text-accent uppercase tracking-[0.25em] font-semibold">
                    After
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-mono text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    live in production
                  </span>
                </div>

                <p className="font-bold font-mono text-accent tabular-nums tracking-tight leading-[0.9] text-[96px] md:text-[140px] lg:text-[180px] mb-3">
                  ~15
                  <span className="text-accent/50 text-4xl md:text-6xl">
                    min
                  </span>
                </p>
                <p className="text-sm md:text-base text-muted leading-relaxed mb-8 max-w-md">
                  Per team member, every day, to review AI-drafted actions and
                  tap approve.
                </p>

                <div className="space-y-2.5 pt-6 border-t border-accent/20">
                  {[
                    "AI classifies every inbound email",
                    "Entities + intent extracted automatically",
                    "Draft action shown. Human clicks approve.",
                    "Calendar, invoice, CRM fire. Audit logged.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2.5 text-xs md:text-sm text-foreground/90"
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

        {/* Bottom stats row — dramatic */}
        <FadeUp delay={0.3}>
          <div className="mt-10 md:mt-14 grid grid-cols-3 gap-3 md:gap-6">
            {[
              { n: `${oe.clients}+`, l: "active clients" },
              { n: `${oe.events}+`, l: "events run" },
              { n: `${savedPercent}%`, l: "time saved per team" },
            ].map((s, i) => (
              <div
                key={s.l}
                className={`p-5 md:p-7 rounded-xl backdrop-blur-sm text-center md:text-left ${
                  i === 2
                    ? "bg-accent/10 border border-accent/30"
                    : "bg-card/60 border border-card-border"
                }`}
              >
                <p
                  className={`text-3xl md:text-5xl font-bold font-mono tabular-nums leading-none ${
                    i === 2 ? "text-accent" : "text-foreground"
                  }`}
                >
                  {s.n}
                </p>
                <p className="text-[10px] md:text-xs text-muted mt-2 md:mt-3 uppercase tracking-[0.15em]">
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
