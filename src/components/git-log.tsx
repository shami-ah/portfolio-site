"use client";

import { FadeUp } from "./motion";
import { useStatus } from "@/lib/use-status";

interface Role {
  hash: string;
  branch: string;
  company: string;
  title: string;
  period: string;
  points: string[];
  stack: string[];
  stats: { files: number; insertions: number; deletions: number };
}

function getRoles(oe: { clients: number; events: number; hoursSavedPerDay: number }): Role[] {
  return [
    {
      hash: "f4a9c2d",
      branch: "HEAD -> present",
      company: "More Life Hospitality GmbH",
      title: "Lead AI Developer",
      period: "Sep 2025 - Present",
      points: [
        `Own the AI product roadmap and delivery for OpenEvent, now live with ${oe.clients}+ clients across ${oe.events}+ events`,
        "Designed multi-agent orchestration: email ingestion, AI classification, entity extraction, human approval gates, automated execution",
        "Built the full AI layer and shipped the product end-to-end: from pgvector embeddings to Stripe billing",
      ],
      stack: ["React", "TypeScript", "Supabase", "OpenAI", "pgvector", "Stripe", "Docker"],
      stats: { files: 14, insertions: 340, deletions: 28 },
    },
    {
      hash: "b1e7a3f",
      branch: "leadership",
      company: "Rouelite Techno Pvt. Ltd.",
      title: "Director of IT & R&D",
      period: "2022 - 2024",
      points: [
        "Led a team of 6 engineers, driving quarterly releases and AI-first feature development",
        "Introduced AI into daily operations, cutting manual data entry by 70%",
        "Architected a CRM from scratch that cut solar project lifecycle from 14 days to 5",
      ],
      stack: ["React", "Supabase", "PostgreSQL", "Tailwind CSS"],
      stats: { files: 8, insertions: 200, deletions: 15 },
    },
    {
      hash: "a0d1e9c",
      branch: "origin/agency",
      company: "Wadware House",
      title: "Co-Founder & AI Engineer",
      period: "2023 - Present",
      points: [
        "Co-founded and run an AI automation agency serving global clients",
        "Own client acquisition, project scoping, and end-to-end delivery",
      ],
      stack: ["TypeScript", "React", "Supabase", "Python", "Docker"],
      stats: { files: 12, insertions: 1800, deletions: 400 },
    },
  ];
}

export function GitLog(): React.ReactElement {
  const { status } = useStatus();
  const roles = getRoles(status.openevent);

  return (
    <section id="log" className="py-20 md:py-32 bg-card/30">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            $ git log --stat --oneline
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 md:mb-16 leading-tight">
            Where I&apos;ve shipped
            <span className="text-muted"> production systems.</span>
          </h2>
        </FadeUp>

        <div className="space-y-6 md:space-y-8">
          {roles.map((role, i) => (
            <FadeUp key={role.hash} delay={i * 0.1}>
              <div className="rounded-xl bg-card border border-card-border p-5 md:p-6 font-mono text-sm hover:border-accent/20 transition-colors duration-300">
                {/* Commit header */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1 text-xs">
                  <span className="text-accent-secondary">{role.hash}</span>
                  <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-[10px] border border-accent/20">
                    {role.branch}
                  </span>
                  <span className="text-muted/40 hidden sm:inline">{role.company}</span>
                </div>

                {/* Author + date */}
                <div className="text-xs text-muted/50 mb-4">
                  <span>Author: Ahtesham Ahmad</span>
                  <span className="mx-2 text-muted/20">|</span>
                  <span className="text-accent-secondary/70">{role.period}</span>
                </div>

                {/* Commit message = title */}
                <h3 className="text-base md:text-lg font-bold font-sans mb-3">
                  {role.title}{" "}
                  <span className="text-muted/60 font-normal">@ {role.company}</span>
                </h3>

                {/* Points as commit body (indented) */}
                <div className="pl-4 border-l-2 border-card-border space-y-1.5 mb-4">
                  {role.points.map((point) => (
                    <p key={point.slice(0, 30)} className="text-xs md:text-sm text-muted leading-relaxed font-sans">
                      {point}
                    </p>
                  ))}
                </div>

                {/* Stack as git decorations */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {role.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] bg-accent/5 text-accent/70 rounded border border-accent/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Git stats */}
                <div className="flex items-center gap-3 text-[11px] text-muted/50 pt-3 border-t border-card-border/50">
                  <span>{role.stats.files} files changed</span>
                  <span className="text-accent-status">+{role.stats.insertions.toLocaleString()}</span>
                  <span className="text-red-400/70">-{role.stats.deletions.toLocaleString()}</span>
                </div>
              </div>
            </FadeUp>
          ))}

          {/* Initial commit */}
          <FadeUp delay={0.3}>
            <div className="flex items-center gap-3 pl-5 md:pl-6 py-3 text-xs font-mono text-muted/30">
              <span className="w-2 h-2 rounded-full bg-muted/20" />
              Initial Commit (Hello World) · 2019
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
