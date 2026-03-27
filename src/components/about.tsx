"use client";

import { FadeUp, SlideIn } from "./motion";

const stats = [
  { value: "250+", label: "Projects Delivered" },
  { value: "5+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "<1s", label: "CodeLens Review Speed" },
];

export function About(): React.ReactElement {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            About Me
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            The production gap is real.
            <br />
            <span className="text-muted">I close it.</span>
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <SlideIn direction="left">
            <div className="space-y-5 text-muted leading-relaxed">
              <p>
                Most AI projects fail in production. They work in demos but
                break at scale &mdash; hallucinations go unchecked, workflows
                lack human oversight, and the &ldquo;AI layer&rdquo; is just an
                API wrapper.
              </p>
              <p>
                My work sits at the intersection of{" "}
                <span className="text-foreground font-medium">
                  AI orchestration
                </span>{" "}
                and{" "}
                <span className="text-foreground font-medium">
                  systems engineering
                </span>
                . I design multi-agent architectures with human-in-the-loop
                approval, build declarative workflow engines that chain LLM
                reasoning with real-world actions, and ship full-stack products
                from database schema to polished UI.
              </p>
              <p className="text-foreground font-medium italic border-l-2 border-accent pl-4">
                Architect the system first, then let AI agents handle the
                repetitive work under human oversight.
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
