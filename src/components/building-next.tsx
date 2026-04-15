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
    title: "Spec-to-Code Traceability",
    description:
      "Link requirements to the code that implements them. Which functions cover RQ-12? What breaks if this spec changes? The missing connective tissue in every agentic coding stack — nobody has built it yet.",
    status: "Designing",
  },
  {
    title: "CodeLens v0.4",
    description:
      "Tree-sitter AST integration for true semantic analysis beyond regex — blast radius, call graph navigation, and VS Code extension with inline diagnostics.",
    status: "Planned",
  },
];

export function BuildingNext(): React.ReactElement {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            Roadmap
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            What I&apos;m building next.
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {upcoming.map((item, i) => (
            <FadeUp key={item.title} delay={i * 0.1}>
              <div className="h-full p-6 rounded-xl bg-card border border-card-border hover:border-accent/20 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">{item.title}</h3>
                  <span
                    className={`px-2 py-0.5 text-xs font-mono rounded ${
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
                <p className="text-sm text-muted leading-relaxed">
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
