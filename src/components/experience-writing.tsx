"use client";

import React from "react";
import { motion } from "framer-motion";
import { FadeUp } from "./motion";
import { TiltCard } from "./tilt-card";
import { TypeLabel } from "./type-label";
import { useStatus } from "@/lib/use-status";
import { getFeaturedArticles } from "@/data/writing";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Roles data (same as git-log.tsx)                                   */
/* ------------------------------------------------------------------ */

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

function getRoles(oe: { clients: number; events: number }): Role[] {
  return [
    {
      hash: "f4a9c2d",
      branch: "HEAD -> present",
      company: "More Life Hospitality GmbH",
      title: "Lead AI Developer",
      period: "Sep 2025 - Present",
      points: [
        `Own the AI product roadmap and delivery for OpenEvent, now live with ${oe.clients}+ clients across ${oe.events}+ events`,
        "Built the full AI layer end-to-end: from pgvector embeddings to Stripe billing",
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
        "Led 6 engineers, introduced AI into daily operations — cut manual data entry by 70%",
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

/* ------------------------------------------------------------------ */
/*  Combined Section                                                   */
/* ------------------------------------------------------------------ */

export function ExperienceAndWriting(): React.ReactElement {
  const { status } = useStatus();
  const roles = getRoles(status.openevent);
  const featured = getFeaturedArticles();

  return (
    <section id="log" className="py-10 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        {/* Section header */}
        <FadeUp>
          <div className="text-center mb-8 md:mb-16">
            <TypeLabel
              text="$ systemctl status --all"
              className="text-sm font-mono text-accent mb-4 uppercase tracking-wider"
            />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Where I&apos;ve shipped.{" "}
              <span className="text-gradient">What I&apos;ve learned.</span>
            </h2>
          </div>
        </FadeUp>

        {/* ── Mobile layout: experience first, then writing ── */}
        <div className="md:hidden space-y-8">
          {/* Experience section */}
          <div>
            <FadeUp>
              <div className="flex items-center gap-2 mb-4" id="experience">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-caption font-mono text-accent uppercase tracking-wider">
                  $ git log --graph
                </span>
              </div>
            </FadeUp>
            <div className="space-y-3">
              {roles.map((role, i) => (
                <motion.div
                  key={role.hash}
                  initial={false}
                  animate={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TiltCard className="h-full">
                  <div className="card-glow card-gradient-border rounded-lg bg-card border border-card-border p-3 h-full flex flex-col font-mono hover:border-transparent transition-colors duration-300">
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mb-1.5 text-caption">
                      <span className="text-accent-secondary">{role.hash}</span>
                      <span className="px-1 py-px rounded bg-accent/10 text-accent border border-accent/20">{role.branch}</span>
                      <span className="text-muted/40">{role.period}</span>
                    </div>
                    <h3 className="text-small font-bold font-sans mb-1.5">
                      {role.title} <span className="text-muted/50 font-normal">@ {role.company}</span>
                    </h3>
                    <div className="pl-2.5 border-l-2 border-card-border space-y-0.5 mb-2 flex-1">
                      {role.points.map((point) => (
                        <p key={point.slice(0, 30)} className="text-caption text-muted leading-snug font-sans">{point}</p>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-caption text-muted/50 pt-1.5 border-t border-card-border/40">
                      <span>{role.stats.files} files</span>
                      <span className="text-accent-status">+{role.stats.insertions.toLocaleString()}</span>
                      <span className="text-red-400/60">-{role.stats.deletions.toLocaleString()}</span>
                    </div>
                  </div>
                  </TiltCard>
                </motion.div>
              ))}
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="text-caption font-mono text-muted/40">branches →</span>
                {["gogaa-cli", "codelens", "rasad"].map((branch) => (
                  <span key={branch} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-accent/5 text-accent/50 border border-accent/15">{branch}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Writing section */}
          <div>
            <FadeUp>
              <div className="flex items-center gap-2 mb-4" id="writing">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary" />
                <span className="text-caption font-mono text-accent-secondary uppercase tracking-wider">
                  $ cat ~/writing/*.md
                </span>
              </div>
            </FadeUp>
            <div className="space-y-3">
              {featured.map((article, i) => (
                <motion.div
                  key={article.slug}
                  initial={false}
                  animate={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TiltCard className="h-full">
                  <Link
                    href={`/writing#${article.slug}`}
                    className="group card-glow card-gradient-border rounded-lg bg-card border border-card-border p-3 h-full flex flex-col font-mono hover:border-transparent transition-colors duration-300"
                  >
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mb-1.5 text-caption">
                      <span className="text-accent-secondary">~/writing/{article.slug}.md</span>
                      <span className="text-muted/30">{article.date}</span>
                    </div>
                    <h3 className="text-small font-bold font-sans mb-1.5 group-hover:text-accent transition-colors">
                      <span className="text-accent-secondary/30 font-normal"># </span>{article.title}
                    </h3>
                    <div className="pl-2.5 border-l-2 border-card-border mb-2 flex-1">
                      <p className="text-caption text-muted leading-snug font-sans line-clamp-3">{article.summary}</p>
                    </div>
                    <div className="flex items-center gap-2 text-caption text-muted/50 pt-1.5 border-t border-card-border/40">
                      <span className="text-accent-secondary/60">~{(parseInt(article.readTime) * 200).toLocaleString()} words</span>
                      <span>{article.readTime}</span>
                      <span className="ml-auto text-muted/30 group-hover:text-accent transition-colors">→</span>
                    </div>
                  </Link>
                  </TiltCard>
                </motion.div>
              ))}
              <Link href="/writing" className="inline-flex items-center gap-1.5 font-mono text-caption text-muted/40 hover:text-accent-secondary transition-colors">
                View all articles →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Desktop layout: paired grid (experience left, writing right) ── */}
        <div className="hidden md:block">
          {/* Column headers */}
          <div className="grid md:grid-cols-2 gap-14 mb-6">
            <FadeUp>
              <div className="flex items-center gap-2" id="experience-desktop">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-caption font-mono text-accent uppercase tracking-wider">
                  $ git log --graph
                </span>
              </div>
            </FadeUp>
            <FadeUp>
              <div className="flex items-center gap-2" id="writing-desktop">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary" />
                <span className="text-caption font-mono text-accent-secondary uppercase tracking-wider">
                  $ cat ~/writing/*.md
                </span>
              </div>
            </FadeUp>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 relative">
            {/* Vertical divider */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-card-border/60 to-transparent" />

            {/* Row by row: git card left, writing card right */}
            {roles.map((role, i) => {
              const article = featured[i];
              return (
                <React.Fragment key={role.hash}>
                  {/* Left: Git commit card with branch line */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative pl-8"
                  >
                    {/* Branch line — full height through gap */}
                    <div className="absolute left-[7px] top-0 -bottom-5 w-[2px] bg-gradient-to-b from-accent via-accent-secondary to-accent-secondary/40" />
                    {/* Commit dot */}
                    <div className={`absolute left-0 top-3 w-[16px] h-[16px] rounded-full border-[2.5px] bg-background z-10 ${
                      i === 0 ? "border-accent shadow-[0_0_6px_rgba(160,120,104,0.4)]" :
                      i === 1 ? "border-accent-secondary" :
                      "border-accent-status"
                    }`} />
                    <TiltCard className="h-full">
                    <div className="card-glow card-gradient-border rounded-lg bg-card border border-card-border p-4 h-full flex flex-col font-mono hover:border-transparent transition-colors duration-300">
                      {/* Hash + branch + period */}
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mb-1.5 text-caption">
                        <span className="text-accent-secondary">{role.hash}</span>
                        <span className="px-1 py-px rounded bg-accent/10 text-accent border border-accent/20">{role.branch}</span>
                        <span className="text-muted/40">{role.period}</span>
                      </div>
                      {/* Title */}
                      <h3 className="text-small font-bold font-sans mb-1.5">
                        {role.title} <span className="text-muted/50 font-normal">@ {role.company}</span>
                      </h3>
                      {/* Points — compact */}
                      <div className="pl-2.5 border-l-2 border-card-border space-y-0.5 mb-2 flex-1">
                        {role.points.map((point) => (
                          <p key={point.slice(0, 30)} className="text-caption text-muted leading-snug font-sans">{point}</p>
                        ))}
                      </div>
                      {/* Stats */}
                      <div className="flex items-center gap-2 text-caption text-muted/50 pt-1.5 border-t border-card-border/40">
                        <span>{role.stats.files} files</span>
                        <span className="text-accent-status">+{role.stats.insertions.toLocaleString()}</span>
                        <span className="text-red-400/60">-{role.stats.deletions.toLocaleString()}</span>
                      </div>
                    </div>
                    </TiltCard>
                  </motion.div>

                  {/* Right: Writing .md card */}
                  {article ? (
                    <motion.div
                      initial={false}
                      animate={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <TiltCard className="h-full">
                      <Link
                        href={`/writing#${article.slug}`}
                        className="group card-glow card-gradient-border rounded-lg bg-card border border-card-border p-4 h-full flex flex-col font-mono hover:border-transparent transition-colors duration-300"
                      >
                        {/* File path + date */}
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mb-1.5 text-caption">
                          <span className="text-accent-secondary">~/writing/{article.slug}.md</span>
                          <span className="text-muted/30">{article.date}</span>
                        </div>
                        {/* Title */}
                        <h3 className="text-small font-bold font-sans mb-1.5 group-hover:text-accent transition-colors">
                          <span className="text-accent-secondary/30 font-normal"># </span>{article.title}
                        </h3>
                        {/* Summary */}
                        <div className="pl-2.5 border-l-2 border-card-border mb-2 flex-1">
                          <p className="text-caption text-muted leading-snug font-sans line-clamp-3">{article.summary}</p>
                        </div>
                        {/* Stats */}
                        <div className="flex items-center gap-2 text-caption text-muted/50 pt-1.5 border-t border-card-border/40">
                          <span className="text-accent-secondary/60">~{(parseInt(article.readTime) * 200).toLocaleString()} words</span>
                          <span>{article.readTime}</span>
                          <span className="ml-auto text-muted/30 group-hover:text-accent transition-colors">→</span>
                        </div>
                      </Link>
                      </TiltCard>
                    </motion.div>
                  ) : <div />}
                </React.Fragment>
              );
            })}

            {/* Bottom row: branches (left) + view all (right) */}
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative pl-8"
            >
              {/* Branch line continues to footer */}
              <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent-secondary/40 to-muted/10" />
              <div className="absolute left-[3px] top-2 w-[10px] h-[10px] rounded-full border-2 border-muted/30 bg-background z-10" />
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="text-caption font-mono text-muted/40">branches →</span>
                {["gogaa-cli", "codelens", "rasad"].map((branch) => (
                  <span key={branch} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-accent/5 text-accent/50 border border-accent/15">{branch}</span>
                ))}
              </div>
              <div className="text-caption font-mono text-muted/30">Initial Commit · 2019</div>
            </motion.div>
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-start pt-1"
            >
              <Link href="/writing" className="inline-flex items-center gap-1.5 font-mono text-caption text-muted/40 hover:text-accent-secondary transition-colors">
                View all articles →
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
