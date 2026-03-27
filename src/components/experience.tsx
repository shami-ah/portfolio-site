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
    period: "Sep 2025 \u2013 Present",
    points: [
      "Building OpenEvent, an AI-powered event management SaaS handling real client workloads",
      "Designed the full agentic pipeline: emails come in, AI classifies them, humans approve actions, workflows execute automatically",
      "Architected the data model and AI orchestration layer on Supabase Edge Functions with OpenAI and pgvector",
      "Shipped the React frontend: Task Inbox, Workflow Runner, Approval Flows, Marketing Hub, Admin Dashboard",
      "Integrated Stripe billing, Google/Outlook calendars, row-level security, and CI/CD with GitHub Actions",
    ],
    stack: "React, TypeScript, Supabase, OpenAI, pgvector, Stripe, Docker",
  },
  {
    title: "Director of IT & R&D",
    company: "Rouelite Techno Pvt. Ltd.",
    period: "2022 \u2013 2024",
    points: [
      "Built a CRM from scratch that cut the solar project lifecycle from 14 days to 5",
      "Introduced AI into daily operations, reducing manual data entry by 70%",
      "Ran an agile team of 6 engineers, shipping quarterly releases",
      "Replaced 3 legacy spreadsheet processes with React + Supabase internal tools",
    ],
    stack: "React, Supabase, PostgreSQL, Tailwind CSS",
  },
  {
    title: "Freelance AI Consultant",
    company: "Fiverr, Upwork & Wadware House",
    period: "2019 \u2013 Present",
    points: [
      "Shipped 250+ projects: prompt engineering, chatbot automation, RAG systems, analytics dashboards",
      "98% client satisfaction with 40+ returning long-term clients",
      "500+ RLHF/SFT evaluation sessions on frontier models (Outlier, RWS, Translated)",
      "Founded Wadware House in 2025 as a boutique AI automation agency",
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
            Where I&apos;ve shipped
            <span className="text-muted"> production systems.</span>
          </h2>
        </FadeUp>

        <div className="relative">
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-card-border" />

          <div className="space-y-12">
            {roles.map((role, i) => (
              <FadeUp key={role.company} delay={i * 0.1}>
                <div className="relative pl-8 md:pl-20">
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
                          <span className="text-accent/60 mt-1 shrink-0 text-xs">
                            &#9654;
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
                            className="px-2.5 py-1 text-xs font-mono bg-accent/5 text-accent/70 rounded-md border border-accent/10"
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
