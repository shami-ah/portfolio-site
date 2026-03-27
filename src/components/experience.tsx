"use client";

import { FadeUp } from "./motion";

interface Role {
  title: string;
  company: string;
  period: string;
  points: string[];
  stack?: string;
}

const roles: Role[] = [
  {
    title: "Lead AI Developer",
    company: "More Life Hospitality GmbH",
    period: "Sep 2025 - Present",
    points: [
      "Leading AI architecture and full-stack development for OpenEvent, an AI-powered event management SaaS platform",
      "Designed and built agentic workflows: email-to-task automation, human-in-the-loop approval systems, and declarative workflow engine",
      "Architected the end-to-end data model and AI orchestration layer (Supabase Edge Functions + OpenAI + pgvector)",
      "Built React UI: Task Inbox, Workflow Runner, Approval Flows, Marketing Hub, and Admin Dashboard",
      "Implemented Stripe billing, calendar integrations (Google/Outlook), RLS policies, and CI/CD pipelines",
    ],
    stack:
      "React, TypeScript, Supabase, OpenAI, pgvector, Stripe, GitHub Actions, Docker",
  },
  {
    title: "Director of IT & R&D",
    company: "Rouelite Techno Pvt. Ltd.",
    period: "2022 - 2024",
    points: [
      "Built a custom CRM that reduced solar project lifecycle from 14 days to 5 days through workflow automation",
      "Managed R&D for AI integration, cutting manual data entry by 70% across operations",
      "Led a cross-functional agile team of 6, delivering quarterly releases with CI/CD pipelines",
      "Architected internal tools with React + Supabase, replacing 3 legacy spreadsheet-based processes",
    ],
    stack: "React, Supabase, PostgreSQL, Tailwind CSS",
  },
  {
    title: "Freelance AI Consultant & Agency Lead",
    company: "Fiverr & Upwork",
    period: "2019 - Present",
    points: [
      "Delivered 250+ projects across prompt engineering, chatbot automation, RAG systems, and analytics dashboards",
      "Maintained a 98% client satisfaction rate with repeat business from 40+ long-term clients",
      "AI Evaluator (Outlier, RWS, Translated): 500+ RLHF/SFT evaluation sessions on frontier models",
      "Founded Wadware House (2025) \u2014 a boutique AI automation agency handling end-to-end project delivery",
    ],
  },
];

export function Experience(): React.ReactElement {
  return (
    <section id="experience" className="py-24 md:py-32 bg-card/30">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            Experience
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            Where I&apos;ve built
            <span className="text-muted"> production systems.</span>
          </h2>
        </FadeUp>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-card-border" />

          <div className="space-y-12">
            {roles.map((role, i) => (
              <FadeUp key={role.company} delay={i * 0.1}>
                <div className="relative pl-8 md:pl-20">
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-8 top-2 w-3 h-3 -translate-x-[5px] rounded-full bg-accent border-2 border-background" />

                  <div className="p-6 rounded-xl bg-card border border-card-border hover:border-accent/20 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{role.title}</h3>
                        <p className="text-accent text-sm">{role.company}</p>
                      </div>
                      <p className="text-sm text-muted font-mono mt-1 md:mt-0">
                        {role.period}
                      </p>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {role.points.map((point) => (
                        <li
                          key={point.slice(0, 40)}
                          className="text-sm text-muted leading-relaxed flex gap-2"
                        >
                          <span className="text-accent mt-1 shrink-0">
                            &bull;
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>

                    {role.stack && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-card-border">
                        {role.stack.split(", ").map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 text-xs font-mono bg-accent/5 text-accent/80 rounded-md border border-accent/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
