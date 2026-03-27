"use client";

import { FadeUp, StaggerContainer } from "./motion";
import { motion } from "framer-motion";

interface SkillGroup {
  title: string;
  icon: string;
  items: string[];
}

const skillGroups: SkillGroup[] = [
  {
    title: "AI Agent Architecture",
    icon: "\u{1F916}",
    items: [
      "Multi-agent orchestration (Planner/Worker/Validator)",
      "Human-in-the-loop approval systems",
      "OpenAI (GPT-4o, o1), Claude (Opus, Sonnet)",
      "RAG: pgvector, Pinecone, LangChain",
      "RLHF, SFT, DPO evaluation (500+ sessions)",
    ],
  },
  {
    title: "Production Stack",
    icon: "\u{1F528}",
    items: [
      "React, Next.js, React Native (Expo)",
      "Supabase (Postgres + Edge Functions + RLS)",
      "TypeScript, Python, Deno, FastAPI",
      "PostgreSQL, Redis, Firebase, pgvector",
      "Stripe, Google Calendar/Gmail, WebSockets",
    ],
  },
  {
    title: "DevOps & Reliability",
    icon: "\u{2699}\u{FE0F}",
    items: [
      "GitHub Actions, Docker, branch-based deploys",
      "Sentry, Grafana, structured logging",
      "n8n workflow automation, cron scheduling",
      "Cloudflare, Vercel, Supabase hosting",
      "CI/CD pipelines, automated testing",
    ],
  },
  {
    title: "Development Approach",
    icon: "\u{1F3AF}",
    items: [
      "AI-assisted dev with Claude Code",
      "Architecture-first: design \u2192 data \u2192 backend \u2192 AI \u2192 UI",
      "Team leadership (cross-functional, 3-8 people)",
      "Client-facing requirements & SOW writing",
      "Built CodeLens: custom code review system",
    ],
  },
];

const itemVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function Skills(): React.ReactElement {
  return (
    <section id="skills" className="py-24 md:py-32 bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            Skills & Stack
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Architecture patterns.
            <span className="text-muted"> Not just tools.</span>
          </h2>
          <p className="text-muted mb-16 max-w-xl">
            I don&apos;t list tools I&apos;ve touched once. These are the
            patterns and technologies I use in production every week.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6">
          {skillGroups.map((group, i) => (
            <FadeUp key={group.title} delay={i * 0.1}>
              <div className="h-full p-6 rounded-xl bg-card border border-card-border hover:border-accent/20 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{group.icon}</span>
                  <h3 className="font-bold text-lg">{group.title}</h3>
                </div>
                <StaggerContainer>
                  <ul className="space-y-3">
                    {group.items.map((item) => (
                      <motion.li
                        key={item}
                        variants={itemVariant}
                        className="text-sm text-muted flex items-start gap-2"
                      >
                        <span className="text-accent mt-0.5 text-xs">
                          &#9654;
                        </span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </StaggerContainer>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Market positioning */}
        <FadeUp delay={0.3}>
          <div className="mt-16 p-8 rounded-xl bg-gradient-to-r from-accent/5 to-blue-500/5 border border-accent/10">
            <h3 className="font-bold text-lg mb-4">
              Why This Matters Right Now
            </h3>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                The AI industry is bifurcating. According to recent data (FT,
                Mar 2026), demand for senior AI engineers is surging while
                entry-level roles flatten. Senior developer salaries are up
                ~15%. The reason: companies don&apos;t need more people who can
                write code &mdash; AI handles that. They need engineers who can{" "}
                <span className="text-foreground font-medium">
                  architect systems, delegate to AI agents, review AI output,
                  and make product decisions
                </span>
                .
              </p>
              <p>
                The engineers who thrive in 2026+ combine three layers:{" "}
                <span className="text-accent font-medium">
                  technical depth
                </span>{" "}
                (AI agents, RAG, infrastructure),{" "}
                <span className="text-accent font-medium">system thinking</span>{" "}
                (architecture, data flow, reliability), and{" "}
                <span className="text-accent font-medium">
                  product judgement
                </span>{" "}
                (knowing what to build and why).
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
