"use client";

import { FadeUp } from "./motion";

interface SkillGroup {
  title: string;
  items: string[];
}

const skillGroups: SkillGroup[] = [
  {
    title: "AI & Agents",
    items: [
      "Multi-agent orchestration",
      "Human approval gates",
      "OpenAI GPT-4o, o1",
      "Claude Opus, Sonnet",
      "RAG pipelines",
      "pgvector, Pinecone",
      "LangChain",
      "RLHF / SFT evaluation",
      "Prompt engineering",
    ],
  },
  {
    title: "Full Stack",
    items: [
      "React, Next.js",
      "React Native (Expo)",
      "TypeScript, Python",
      "FastAPI, Deno",
      "Supabase (Postgres, Edge, RLS)",
      "Stripe",
      "Google Calendar & Gmail APIs",
      "Redis, Firebase, pgvector",
    ],
  },
  {
    title: "Infrastructure",
    items: [
      "GitHub Actions CI/CD",
      "Docker Compose",
      "Containerized dev envs",
      "Sentry, Grafana",
      "Structured logging",
      "n8n automation",
      "Cloudflare, Vercel",
    ],
  },
  {
    title: "Process",
    items: [
      "Architect-first",
      "Spec before code",
      "Team lead (3-8 eng)",
      "Cross-functional delivery",
      "SOWs & stakeholder alignment",
      "CodeLens (305 patterns, 9 stacks)",
      "Gogaa CLI (1418 tests, 11 providers)",
    ],
  },
];

export function Skills(): React.ReactElement {
  return (
    <section id="skills" className="py-24 md:py-32 bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            Stack
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What I work with every week.
          </h2>
          <p className="text-muted mb-16 max-w-lg">
            Not a tool inventory. These are the patterns and technologies behind
            the systems I ship.
          </p>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skillGroups.map((group, i) => (
            <FadeUp key={group.title} delay={i * 0.08}>
              <div className="h-full p-5 rounded-xl bg-card border border-card-border hover:border-accent/20 transition-all duration-300">
                <h3 className="font-bold text-sm mb-4 text-accent">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-1 text-[10px] font-mono bg-accent/5 text-accent/80 rounded border border-accent/10"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Market context */}
        <FadeUp delay={0.3}>
          <div className="mt-16 p-6 md:p-8 rounded-xl bg-gradient-to-r from-accent/5 to-blue-500/5 border border-accent/10">
            <p className="text-xs font-mono text-accent mb-3 uppercase tracking-wider">
              Why this matters in 2026
            </p>
            <p className="text-sm text-muted leading-relaxed max-w-3xl">
              Senior AI engineer demand is surging while entry-level roles
              flatten. Companies don&apos;t need more people who write
              code. They need people who{" "}
              <span className="text-foreground font-medium">
                design systems, manage AI agents, and make product decisions
              </span>
              . That&apos;s the intersection where I operate: technical depth, system
              architecture, and the judgment to know what to build.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
