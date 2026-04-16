"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { FadeUp, SlideIn } from "./motion";
import { useStatus } from "@/lib/use-status";

function CountUp({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }): React.ReactElement {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1400;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, to]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

export function About(): React.ReactElement {
  const { status } = useStatus();
  const smallStats = [
    { counter: <CountUp to={status.portfolio.yearsBuilding} suffix="+" />, label: "Years Building" },
    { counter: <CountUp to={status.gogaa.tests} />, label: "Gogaa Tests Passing" },
    { counter: <span>&lt;1s</span>, label: "CodeLens Reviews" },
  ];
  return (
    <section id="about" className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            About
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 md:mb-12 leading-tight">
            Most AI projects break in production.
            <br />
            <span className="text-muted">I make sure mine don&apos;t.</span>
          </h2>
        </FadeUp>

        {/* Editorial split: narrative left, dramatic stat right */}
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16 items-center mb-14 md:mb-20">
          <SlideIn direction="left">
            <div className="space-y-4 md:space-y-5 text-sm md:text-base text-muted leading-relaxed">
              <p>
                The gap between an AI demo and a production system is enormous.
                Hallucinations slip through, there&apos;s no human oversight, and
                the whole thing is held together by a single API call. I&apos;ve
                spent five years closing that gap.
              </p>
              <p>
                I work where{" "}
                <span className="text-foreground font-medium">
                  AI orchestration
                </span>{" "}
                meets{" "}
                <span className="text-foreground font-medium">
                  systems engineering
                </span>
                : multi-agent architectures with human approval gates, workflow
                engines that connect LLM reasoning to real actions like calendar
                bookings and invoices, and full-stack products shipped from schema
                design to polished UI.
              </p>
              <p className="text-foreground font-medium border-l-2 border-accent pl-4">
                Most engineers are consumers of AI tooling. I&apos;m also a builder of it. When
                the tools I needed didn&apos;t exist, I built them. A code review engine that catches
                bugs commercial tools miss. An open-source coding agent that closes every gap
                simultaneously. That&apos;s a different relationship with the technology.
              </p>
            </div>
          </SlideIn>

          {/* Dramatic number — the display moment */}
          <SlideIn direction="right">
            <div className="relative">
              <p className="font-bold tabular-nums leading-[0.85] tracking-tighter bg-gradient-to-br from-foreground to-muted/50 bg-clip-text text-transparent text-[100px] sm:text-[140px] md:text-[160px] lg:text-[200px]">
                <CountUp to={status.portfolio.projects} suffix="" />
                <span className="text-accent">+</span>
              </p>
              <p className="text-xs md:text-sm font-mono text-muted/70 uppercase tracking-[0.2em] mt-2">
                production projects shipped
              </p>
              <p className="text-[10px] md:text-xs text-muted/50 mt-1">
                2019 → now · 40+ returning clients · 100% satisfaction
              </p>
            </div>
          </SlideIn>
        </div>

        {/* Supporting stats row — small, ground for the big number */}
        <div className="grid grid-cols-3 gap-3 md:gap-5">
          {smallStats.map((stat) => (
            <div
              key={stat.label}
              className="p-4 md:p-5 rounded-xl bg-card/60 border border-card-border text-center md:text-left"
            >
              <p className="text-2xl md:text-3xl font-bold text-foreground font-mono">
                {stat.counter}
              </p>
              <p className="text-[10px] md:text-xs text-muted mt-1 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
