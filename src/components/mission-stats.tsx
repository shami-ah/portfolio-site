"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FadeUp } from "./motion";
import { TiltCard } from "./tilt-card";
import { TypeLabel } from "./type-label";
import { useStatus } from "@/lib/use-status";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }): React.ReactElement {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(to);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current || to === 0) return;
    hasAnimated.current = true;
    setCount(0);
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
      key: "production_systems",
      label: "production_systems",
      value: <CountUp to={status.portfolio.productionSystems} suffix="+" />,
      desc: "Shipped for real businesses",
    },
    {
      key: "openevent_teams",
      label: "openevent.teams",
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
        <div className="max-w-3xl mb-14 md:mb-20">
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
            <p className="text-foreground font-medium border-l-2 border-accent pl-4 text-sm md:text-base leading-relaxed">
              When the tools I needed didn&apos;t exist, I built them.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-stretch">
          {widgets.map((w, i) => (
            <TiltCard
              key={w.key}
              className="h-full"
            >
              <div className="card-glow card-gradient-border p-4 md:p-5 rounded-xl bg-card border border-card-border h-full flex flex-col group hover:border-transparent hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-status animate-pulse group-hover:scale-150 transition-transform" />
                  <span className="text-caption font-mono text-muted/60 uppercase tracking-wider group-hover:text-accent/80 transition-colors">
                    {w.label}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold font-mono text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                  {w.value}
                </p>
                <p className="text-caption md:text-xs text-muted">
                  {w.desc}
                </p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
