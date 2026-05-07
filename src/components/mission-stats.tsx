"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { FadeUp } from "./motion";
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
              <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
                Mission
              </p>
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

          {/* Right 30% — about card, stretches full height of mission */}
          <FadeUp delay={0.1} className="h-full">
            <div className="card-glow rounded-xl bg-card border border-card-border p-5 h-full flex flex-col justify-between">
              {/* Photo + name */}
              <div>
                <div className="flex flex-col items-center mb-5">
                  <div className="relative mb-3">
                    <div className="absolute -inset-2 bg-gradient-to-br from-accent/15 to-accent-secondary/10 rounded-full blur-xl pointer-events-none" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/ahtesham.jpg"
                      alt="Ahtesham Ahmad"
                      className="relative w-16 h-16 rounded-full object-cover border border-accent/20"
                    />
                  </div>
                  <p className="font-semibold text-foreground">Ahtesham Ahmad</p>
                  <p className="text-[10px] text-accent/70 font-mono">open to opportunities</p>
                </div>

                {/* Quick facts */}
                <div className="space-y-3 text-[11px] text-muted leading-relaxed">
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">&#127759;</span>
                    <span>Islamabad, PK &middot; work globally, remote-first</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">&#9889;</span>
                    <span>Picks up anything fast. Learned React Ink, Docker, Stripe in days, not months</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">&#127921;</span>
                    <span>Snooker player. Same patience applies to debugging production at 2 AM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">&#9749;</span>
                    <span>Tea over coffee. Five languages (EN, UR, PS, SD, AR)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">&#128736;</span>
                    <span>Broke things until they worked. Then built tools so others don&apos;t have to</span>
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-5 pt-3 border-t border-card-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-status animate-pulse" />
                  <span className="text-accent-status/80">available for hire</span>
                </div>
                <a href="/uses" className="text-[10px] font-mono text-muted/40 hover:text-accent transition-colors">
                  my setup &rarr;
                </a>
              </div>
            </div>
          </FadeUp>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-stretch">
          {widgets.map((w, i) => (
            <FadeUp key={w.key} delay={i * 0.08} className="h-full">
              <div className="card-glow p-4 md:p-5 rounded-xl bg-card border border-card-border h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-status animate-pulse" />
                  <span className="text-[10px] font-mono text-muted/50 uppercase tracking-wider">
                    {w.label}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold font-mono text-foreground mb-1">
                  {w.value}
                </p>
                <p className="text-[10px] md:text-xs text-muted">
                  {w.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
