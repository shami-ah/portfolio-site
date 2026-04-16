"use client";

import { FadeUp } from "./motion";

const upcoming = [
  {
    title: "Gogaa Architect Mode",
    description:
      "Two-model split for complex tasks: a strong model plans and writes specs, a fast model executes edits. Cuts cost and improves quality on hard problems. No other open-source CLI has this.",
    status: "Next Up",
  },
  {
    title: "OpenEvent Adaptive Approval Engine",
    description:
      "The system tracks which action types are approved, edited, or rejected over time. As patterns emerge, trust thresholds adjust automatically. Human review load drops week-over-week without removing the human from the loop. Progressive trust, not blind automation.",
    status: "Designing",
  },
  {
    title: "Gogaa Remote Session Viewer",
    description:
      "Watch and control any gogaa agent session from a browser or phone, over LAN or tunnel. Real-time streaming of tool calls, diffs, and cost. The same agent running on your dev machine, accessible from anywhere.",
    status: "Planned",
  },
];

export function BuildingNext(): React.ReactElement {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            Roadmap
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 md:mb-16 leading-tight">
            What I&apos;m building next.
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {upcoming.map((item, i) => (
            <FadeUp key={item.title} delay={i * 0.1}>
              <div className="h-full p-5 md:p-6 rounded-xl bg-card border border-card-border hover:border-accent/20 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between gap-3 mb-3 md:mb-4">
                  <h3 className="font-bold text-sm md:text-base leading-tight">{item.title}</h3>
                  <span
                    className={`shrink-0 px-2 py-0.5 text-[10px] md:text-xs font-mono rounded ${
                      item.status === "Next Up"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : item.status === "Designing"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : "bg-muted/10 text-muted border border-card-border"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
