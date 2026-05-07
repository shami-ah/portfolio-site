"use client";

import { motion } from "framer-motion";
import { FadeUp } from "./motion";
import { TypeLabel } from "./type-label";
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
    <section id="log" className="py-20 md:py-32 bg-card/20">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <FadeUp>
          <TypeLabel
            text="$ git log --stat --oneline"
            className="text-sm font-mono text-accent mb-4 uppercase tracking-wider"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 md:mb-16 leading-tight">
            Where I&apos;ve shipped
            <span className="text-muted"> production systems.</span>
          </h2>
        </FadeUp>

        {/* Git graph wrapper */}
        <div className="relative">
          {/* Main branch line */}
          <div className="absolute left-[18px] md:left-[22px] top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-accent via-accent-secondary to-muted/20 hidden md:block" />

          <div className="space-y-6 md:space-y-8">
            {roles.map((role, i) => (
              <motion.div
                key={role.hash}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative md:pl-14"
              >
                {/* Git commit dot on the branch line */}
                <div className={`hidden md:block absolute left-[13px] top-6 w-[21px] h-[21px] rounded-full border-[3px] bg-background z-10 ${
                  i === 0 ? "border-accent shadow-[0_0_8px_rgba(212,168,83,0.4)]" :
                  i === 1 ? "border-accent-secondary" :
                  "border-accent-status"
                }`} />

                <div className="card-glow card-gradient-border rounded-xl bg-card border border-card-border p-5 md:p-6 font-mono text-sm hover:border-transparent transition-colors duration-300">
                  {/* Commit header */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1 text-xs">
                    <span className="text-accent-secondary">{role.hash}</span>
                    <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-caption border border-accent/20">
                      {role.branch}
                    </span>
                    <span className="text-muted/40 hidden sm:inline">{role.company}</span>
                  </div>

                  {/* Author + date */}
                  <div className="text-xs text-muted/60 mb-4">
                    <span>Author: Ahtesham Ahmad</span>
                    <span className="mx-2 text-muted/20">|</span>
                    <span className="text-accent-secondary/70">{role.period}</span>
                  </div>

                  {/* Commit message = title */}
                  <h3 className="text-base md:text-lg font-bold font-sans mb-3">
                    {role.title}{" "}
                    <span className="text-muted/60 font-normal">@ {role.company}</span>
                  </h3>

                  {/* Points as commit body */}
                  <div className="pl-4 border-l-2 border-card-border space-y-1.5 mb-4">
                    {role.points.map((point) => (
                      <p key={point.slice(0, 30)} className="text-xs md:text-sm text-muted leading-relaxed font-sans">
                        {point}
                      </p>
                    ))}
                  </div>

                  {/* Stack */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {role.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-caption bg-accent/5 text-accent/80 rounded border border-accent/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Git stats */}
                  <div className="flex items-center gap-3 text-small text-muted/60 pt-3 border-t border-card-border/40">
                    <span>{role.stats.files} files changed</span>
                    <span className="text-accent-status">+{role.stats.insertions.toLocaleString()}</span>
                    <span className="text-red-400/70">-{role.stats.deletions.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Side project branches */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative md:pl-14"
            >
              {/* Branch dot */}
              <div className="hidden md:block absolute left-[16px] top-3 w-[15px] h-[15px] rounded-full border-2 border-accent/40 bg-background z-10" />

              <div className="flex items-center gap-2 mb-2">
                <span className="text-caption font-mono text-muted/40">branches →</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["gogaa-cli", "codelens", "rasad"].map((branch) => (
                  <span
                    key={branch}
                    className="px-3 py-1 rounded-lg text-caption font-mono bg-accent/5 text-accent/60 border border-accent/20"
                  >
                    {branch}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Initial commit */}
            <FadeUp delay={0.3}>
              <div className="relative md:pl-14">
                {/* Dot */}
                <div className="hidden md:block absolute left-[17px] top-2 w-[13px] h-[13px] rounded-full border-2 border-muted/20 bg-background z-10" />
                <div className="flex items-center gap-3 py-3 text-xs font-mono text-muted/40">
                  <span className="w-2 h-2 rounded-full bg-muted/20 md:hidden" />
                  Initial Commit (Hello World) · 2019
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
