"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { FadeUp, SlideIn } from "./motion";

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

const stats = [
  { counter: <CountUp to={250} suffix="+" />, label: "Projects Shipped" },
  { counter: <CountUp to={5} suffix="+" />, label: "Years Building" },
  { counter: <CountUp to={1418} />, label: "Gogaa Tests Passing" },
  { counter: <span>&lt;1s</span>, label: "CodeLens Reviews" },
];

export function About(): React.ReactElement {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            About
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Most AI projects break in production.
            <br />
            <span className="text-muted">I make sure mine don&apos;t.</span>
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <SlideIn direction="left">
            <div className="space-y-5 text-muted leading-relaxed">
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
                Most engineers are consumers of AI tooling. I&apos;m also a builder of it — when the tools
                I needed didn&apos;t exist, I built them. A code review engine that catches bugs commercial
                tools miss. An open-source coding agent that closes every gap simultaneously.
                That&apos;s a different relationship with the technology.
              </p>
            </div>
          </SlideIn>

          <SlideIn direction="right">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-xl bg-card border border-card-border hover:border-accent/30 transition-all duration-300 group"
                >
                  <p className="text-3xl font-bold text-accent group-hover:scale-105 transition-transform">
                    {stat.counter}
                  </p>
                  <p className="text-sm text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </SlideIn>
        </div>

        {/* Dev workflow strip */}
        <FadeUp delay={0.2}>
          <div className="p-5 rounded-xl bg-card/50 border border-card-border">
            <p className="text-xs font-mono text-muted mb-4 uppercase tracking-wider">
              My actual dev workflow — every day
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {[
                "Phone + Tailscale",
                "Docker Container",
                "Claude Code + gogaa",
                "CodeLens review",
                "GitHub Actions",
                "Deploy",
              ].map((step, i, arr) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 text-xs font-mono bg-accent/10 text-accent border border-accent/20 rounded-md whitespace-nowrap">
                    {step}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="text-muted/40 text-xs">&rarr;</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
