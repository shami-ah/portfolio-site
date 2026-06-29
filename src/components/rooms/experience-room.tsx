"use client";

import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import { getFeaturedArticles } from "@/data/writing";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ease = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const roles = [
  {
    hash: "f4a9c2d",
    branch: "HEAD -> present",
    company: "More Life Hospitality GmbH",
    title: "Lead AI Developer",
    period: "Sep 2025 - Present",
    body: "Own OpenEvent roadmap and delivery: pgvector, Stripe, AI workflows, human approval gates.",
  },
  {
    hash: "b1e7a3f",
    branch: "leadership",
    company: "Rouelite Techno Pvt. Ltd.",
    title: "Director of IT & R&D",
    period: "2022 - 2024",
    body: "Led 6 engineers, introduced AI into operations, and rebuilt CRM workflows from first principles.",
  },
  {
    hash: "a0d1e9c",
    branch: "origin/agency",
    company: "Wadware House",
    title: "Co-Founder & AI Engineer",
    period: "2023 - Present",
    body: "Client acquisition, project scoping, architecture, AI automation, delivery, support.",
  },
];

/* ------------------------------------------------------------------ */
/*  ExperienceRoom                                                     */
/* ------------------------------------------------------------------ */

export function ExperienceRoom({
  articles,
}: {
  articles: ReturnType<typeof getFeaturedArticles>;
}): React.ReactElement {
  return (
    <div className="grid h-full min-h-full gap-2 md:min-h-0 md:grid-rows-[auto_minmax(0,1fr)]">
      <div className="flex items-center gap-4">
        <div>
          <p className="font-mono text-caption uppercase tracking-[0.28em] text-accent">
            git log --graph --all
          </p>
          <h2 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">
            Experience
          </h2>
        </div>
      </div>

      <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-card-border bg-card/35 backdrop-blur-md">
        {/* Two-column git graph */}
        <div className="grid flex-1 min-h-0 md:grid-cols-2">
          {/* Left branch — career */}
          <div className="relative flex flex-col border-r border-card-border/50 p-4 md:p-5">
            {/* Branch line */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-green-400/20" />

            <p className="font-mono text-caption text-green-400/60 mb-3">
              <GitBranch size={10} className="inline mr-1" />
              branch: career
            </p>
            <div className="flex flex-1 flex-col justify-between gap-3">
              {roles.map((role, index) => (
                <motion.div
                  key={role.hash}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3, ease }}
                  className="relative flex-1 rounded-xl border border-card-border bg-background/40 p-4"
                >
                  {/* Commit dot on divider */}
                  <div className="absolute -right-[7px] top-4 h-[9px] w-[9px] rounded-full border-[1.5px] border-green-400 bg-background shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                    <span className="rounded bg-yellow-400/10 px-1 py-0.5 text-yellow-300/80">
                      {role.hash}
                    </span>
                    <span className="rounded bg-green-400/10 px-1 py-0.5 text-green-300">
                      {role.branch}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold">{role.title}</h3>
                  <p className="text-caption text-muted/50">
                    {role.company} · {role.period}
                  </p>
                  <p className="mt-1.5 text-small leading-relaxed text-muted">
                    {role.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right branch — writing */}
          <div className="relative flex flex-col p-4 md:p-5">
            {/* Branch line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-amber-400/20" />

            <p className="font-mono text-caption text-amber-400/60 mb-3">
              <GitBranch size={10} className="inline mr-1" />
              branch: writing
            </p>
            <div className="flex flex-1 flex-col justify-between gap-3">
              {articles.slice(0, 3).map((article, index) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.15, duration: 0.3, ease }}
                  className="relative flex-1 rounded-xl border border-card-border bg-background/40 p-4"
                >
                  {/* Commit dot on divider */}
                  <div className="absolute -left-[7px] top-4 h-[9px] w-[9px] rounded-full border-[1.5px] border-amber-400 bg-background shadow-[0_0_6px_rgba(200,160,80,0.4)]" />
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                    <span className="text-amber-300/70">{article.readTime}</span>
                    <span className="text-muted/35">{article.date}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold">{article.title}</h3>
                  <p className="mt-1.5 text-small leading-relaxed text-muted line-clamp-3">
                    {article.summary}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Merge commit bar at bottom */}
        <div className="border-t border-card-border bg-background/30 px-5 py-3 font-mono text-caption text-muted/40">
          <span className="text-green-400/60">●</span>
          <span className="mx-1">──</span>
          <span className="text-amber-400/60">●</span>
          <span className="mx-2">merge: all branches converge here</span>
          <span className="ml-auto text-muted/25">HEAD</span>
        </div>
      </div>
    </div>
  );
}
