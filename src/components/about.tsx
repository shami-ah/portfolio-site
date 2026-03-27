"use client";

import { FadeUp, SlideIn } from "./motion";

const stats = [
  { value: "250+", label: "Projects Shipped" },
  { value: "5+", label: "Years Building" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "<1s", label: "CodeLens Reviews" },
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

        <div className="grid md:grid-cols-2 gap-12 mb-16">
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
              <p className="text-foreground font-medium italic border-l-2 border-accent pl-4">
                Design the system first. Then let AI agents handle the repetitive
                work while humans stay in control.
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
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </SlideIn>
        </div>
      </div>
    </section>
  );
}
