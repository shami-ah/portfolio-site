"use client";

import { FadeUp, StaggerContainer } from "./motion";
import { motion } from "framer-motion";

interface SkillGroup {
  title: string;
  items: string[];
}

const skillGroups: SkillGroup[] = [
  {
    title: "AI & Agents",
    items: [
      "Multi-agent orchestration with human approval gates",
      "OpenAI (GPT-4o, o1), Claude (Opus, Sonnet)",
      "RAG pipelines: pgvector, Pinecone, LangChain",
      "RLHF/SFT evaluation on frontier models",
      "Prompt engineering and template management",
    ],
  },
  {
    title: "Full Stack",
    items: [
      "React, Next.js, React Native (Expo)",
      "Supabase: Postgres, Edge Functions, RLS, Realtime",
      "TypeScript, Python, Deno, FastAPI",
      "Stripe, Google Calendar, Gmail, Maps APIs",
      "PostgreSQL, Redis, Firebase, pgvector",
    ],
  },
  {
    title: "Infrastructure",
    items: [
      "GitHub Actions CI/CD, Docker, containerized dev envs",
      "Sentry, Grafana, structured logging",
      "n8n workflow automation, cron scheduling",
      "Cloudflare, Vercel, Supabase hosting",
    ],
  },
  {
    title: "Process",
    items: [
      "Architect-first: spec before code, agents for execution",
      "Team lead: 3-8 engineers, cross-functional delivery",
      "Client-facing: requirements, SOWs, stakeholder alignment",
      "CodeLens: 305-pattern AI code review (9 stacks)",
      "Gogaa CLI: open-source AI coding agent (1418 tests, 11 providers)",
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
                <StaggerContainer>
                  <ul className="space-y-2.5">
                    {group.items.map((item) => (
                      <motion.li
                        key={item}
                        variants={itemVariant}
                        className="text-xs text-muted leading-relaxed"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </StaggerContainer>
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
