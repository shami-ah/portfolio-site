"use client";

import { FadeUp } from "./motion";

interface Article {
  title: string;
  tag: string;
  tagColor: string;
  summary: string;
  href?: string;
  soon?: boolean;
}

const articles: Article[] = [
  {
    title: "WISC: A Context Engineering Framework for AI Agents",
    tag: "framework",
    tagColor: "text-accent",
    summary:
      "Write, Isolate, Select, Compress. How I reduced a 72KB always-loaded context to 11.7KB with zero capability loss. The same methodology behind Gogaa CLI's 99.4% token reduction.",
    soon: true,
  },
  {
    title: "Why Your AI Code Review Misses the Bugs That Ship",
    tag: "engineering",
    tagColor: "text-accent-secondary",
    summary:
      "The gap between style linters and real production bugs. How cross-file taint tracking and hand-crafted patterns catch what ESLint and SonarQube can't.",
    soon: true,
  },
  {
    title: "Building a 5-Strategy JSON Parser for Unreliable LLM Output",
    tag: "deep dive",
    tagColor: "text-accent-status",
    summary:
      "Every AI agent tutorial assumes models return valid JSON. In practice, they don't. How progressive fallback parsing brought tool call success from ~70% to ~95%.",
    soon: true,
  },
];

export function Writing(): React.ReactElement {
  return (
    <section id="writing" className="py-20 md:py-32">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            $ cat ~/writing/*.md
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Writing &amp; thinking.
          </h2>
          <p className="text-sm md:text-base text-muted mb-10 md:mb-14 max-w-xl">
            Technical writing on the problems I solve. Architecture decisions,
            framework design, and the engineering that doesn&apos;t fit in a README.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {articles.map((a, i) => (
            <FadeUp key={a.title} delay={i * 0.08}>
              <div className="card-glow h-full rounded-xl bg-card border border-card-border p-5 flex flex-col hover:border-accent/20 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${a.tagColor}`}>
                    {a.tag}
                  </span>
                  {a.soon && (
                    <span className="text-[9px] font-mono text-muted/40 px-2 py-0.5 rounded border border-card-border">
                      coming soon
                    </span>
                  )}
                </div>
                <h3 className="text-sm md:text-base font-semibold mb-2 group-hover:text-accent transition-colors leading-snug">
                  {a.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed flex-1">
                  {a.summary}
                </p>
                {a.href && (
                  <a
                    href={a.href}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-accent mt-4 hover:underline"
                  >
                    read <span>&rarr;</span>
                  </a>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
