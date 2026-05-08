"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { projects, type ProjectData } from "@/data/projects";
import { FadeUp, SlideIn } from "./motion";
import { TypeLabel } from "./type-label";
import { ProjectModal } from "./project-modal";
import { ProjectMockup, type MockupKind } from "./project-mockup";
import { useStatus } from "@/lib/use-status";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FLAGSHIP_SLUGS: { slug: string; mockup: MockupKind }[] = [
  { slug: "openevent", mockup: "openevent" },
  { slug: "codelens", mockup: "codelens" },
  { slug: "gogaa-cli", mockup: "gogaa" },
  { slug: "rasad", mockup: "rasad" },
];

interface FlagshipMeta {
  status: string;
  statusColor: string;
  metrics: { label: string; value: string }[];
}

function useFlagshipMeta(): Record<string, FlagshipMeta> {
  const { status } = useStatus();
  return {
    openevent: {
      status: "LIVE",
      statusColor: "text-accent-status",
      metrics: [
        { label: "teams", value: `${status.openevent.clients}+` },
        { label: "events", value: `${status.openevent.events}+` },
        { label: "saved/day", value: `${status.openevent.hoursSavedPerDay}h` },
      ],
    },
    codelens: {
      status: "BETA",
      statusColor: "text-accent-secondary",
      metrics: [
        { label: "patterns", value: `~${status.codelens.patterns}` },
        { label: "stacks", value: `${status.codelens.stacks}` },
        { label: "speed", value: "<1s" },
      ],
    },
    "gogaa-cli": {
      status: "BETA",
      statusColor: "text-accent-secondary",
      metrics: [
        { label: "tests", value: `${status.gogaa.tests.toLocaleString()}` },
        { label: "providers", value: `${status.gogaa.providers}` },
        { label: "status", value: "beta" },
      ],
    },
    rasad: {
      status: "ALPHA",
      statusColor: "text-accent",
      metrics: [
        { label: "sessions", value: "656" },
        { label: "messages", value: "38K" },
        { label: "tool calls", value: "14K" },
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Flagship project card (right column)                               */
/* ------------------------------------------------------------------ */

function FlagshipCard({
  project,
  mockup,
  meta,
  index,
}: {
  project: ProjectData;
  mockup: MockupKind;
  meta: FlagshipMeta;
  index: number;
}): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rounded-xl bg-card border border-card-border overflow-hidden hover:border-accent/20 transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-5 py-3 border-b border-card-border/40">
          <span className={`flex items-center gap-1.5 text-caption font-mono ${meta.statusColor}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {meta.status}
          </span>
          <h3 className="font-semibold text-lg">{project.title}</h3>
        </div>

        {/* Mockup -- no height cap */}
        <div className="border-b border-card-border/20 p-3 bg-background/30">
          <ProjectMockup kind={mockup} className="shadow-none border-card-border/40" />
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-sm text-muted leading-relaxed mb-5">
            {project.oneLiner ?? project.cardSummary ?? project.impact}
          </p>

          {/* Metrics */}
          <div className="flex gap-7 mb-5">
            {meta.metrics.map((m) => (
              <div key={m.label}>
                <p className="text-xl font-bold font-mono text-foreground">{m.value}</p>
                <p className="text-caption font-mono text-muted/50 uppercase">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 pt-4 border-t border-card-border/30">
            <Link
              href={`/projects/${project.slug}`}
              className="text-small font-mono text-accent hover:text-accent/80 transition-colors"
            >
              case study &rarr;
            </Link>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-small font-mono text-muted hover:text-accent-status transition-colors"
              >
                demo {"\u2197"}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stacked card carousel for other deployments                        */
/* ------------------------------------------------------------------ */

const STACK_TRANSFORMS = [
  "translate-y-0 rotate-0 scale-100 opacity-100 z-[7]",
  "translate-y-2.5 translate-x-1.5 rotate-[1.5deg] scale-[0.97] opacity-60 z-[6]",
  "translate-y-5 translate-x-3 rotate-[3deg] scale-[0.94] opacity-30 z-[5]",
] as const;

function OtherDeployments({
  others,
  onOpen,
}: {
  others: ProjectData[];
  onOpen: (p: ProjectData) => void;
}): React.ReactElement {
  const [current, setCurrent] = useState(0);

  const next = (): void => setCurrent((c) => (c + 1) % others.length);
  const prev = (): void => setCurrent((c) => (c - 1 + others.length) % others.length);

  return (
    <FadeUp>
      <div className="flex flex-col items-center pt-16 md:pt-24">
        <p className="text-base font-semibold mb-1">
          Other deployments
          <span className="text-muted font-normal text-small ml-2">{others.length} systems</span>
        </p>

        {/* Card stack */}
        <div className="relative w-[340px] h-[260px] mt-8">
          {others.map((project, i) => {
            const pos = (i - current + others.length) % others.length;
            const transformClass = pos < 3
              ? STACK_TRANSFORMS[pos]
              : "translate-y-7 translate-x-4 rotate-[4deg] scale-[0.91] opacity-0 pointer-events-none z-[4]";

            return (
              <motion.div
                key={project.slug}
                className={`absolute top-0 left-0 w-[340px] h-[240px] rounded-xl border border-card-border bg-card p-6 cursor-pointer flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-accent/25 ${transformClass}`}
                layout
              >
                <div>
                  <p className="font-bold text-base mb-1">{project.title}</p>
                  <span className="inline-block text-caption font-mono px-2 py-0.5 rounded-full bg-accent/8 text-accent border border-accent/15 mb-3">
                    {project.type}
                  </span>
                  <p className="text-small text-muted leading-relaxed">
                    {project.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-card-border/30">
                  <button
                    type="button"
                    onClick={() => onOpen(project)}
                    className="text-small font-mono text-accent hover:text-accent/80 transition-colors"
                  >
                    view &rarr;
                  </button>
                  <span className="text-caption font-mono text-muted/30">
                    {pos === 0 ? `${i + 1} / ${others.length}` : ""}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation arrows */}
        <div className="flex gap-2.5 mt-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous project"
            className="w-10 h-10 rounded-full border border-card-border bg-card flex items-center justify-center text-foreground hover:border-accent hover:text-accent transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next project"
            className="w-10 h-10 rounded-full border border-card-border bg-card flex items-center justify-center text-foreground hover:border-accent hover:text-accent transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </FadeUp>
  );
}

/* ------------------------------------------------------------------ */
/*  Main projects section                                              */
/* ------------------------------------------------------------------ */

export function Projects(): React.ReactElement {
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const flagshipMeta = useFlagshipMeta();

  const flagships = FLAGSHIP_SLUGS.map(({ slug, mockup }) => ({
    project: projects.find((p) => p.slug === slug),
    mockup,
  })).filter((x): x is { project: ProjectData; mockup: MockupKind } => !!x.project);

  const flagshipSlugs = new Set(FLAGSHIP_SLUGS.map((s) => s.slug));
  const others = projects.filter((p) => !flagshipSlugs.has(p.slug));

  const navigate = useCallback(
    (dir: 1 | -1) => {
      setActiveProject((current) => {
        if (!current) return current;
        const idx = projects.findIndex((p) => p.slug === current.slug);
        if (idx === -1) return current;
        const next = (idx + dir + projects.length) % projects.length;
        return projects[next];
      });
    },
    [],
  );

  return (
    <section id="projects" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:pl-24">
        {/* Sticky scroll: heading left, cards right */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: sticky column */}
          <div className="md:sticky md:top-[15vh] self-start">
            <FadeUp>
              <TypeLabel
                text="$ systemctl status --all"
                className="text-sm font-mono text-accent mb-4 uppercase tracking-wider"
              />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.08] tracking-tight mb-5">
                Systems I&apos;ve<br />shipped<span className="text-muted">.</span>
              </h2>
              <p className="text-sm md:text-base text-muted leading-relaxed max-w-sm mb-8">
                Production AI systems, developer tools, and SaaS products. Each one links to a full case study with architecture decisions and results.
              </p>
              <div className="flex gap-8 pt-6 border-t border-card-border/40">
                <div>
                  <p className="text-2xl font-bold font-mono text-accent">50+</p>
                  <p className="text-caption font-mono text-muted uppercase tracking-wider mt-1">production<br />systems</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-accent">40+</p>
                  <p className="text-caption font-mono text-muted uppercase tracking-wider mt-1">returning<br />clients</p>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Right: scrolling flagship cards */}
          <div className="flex flex-col gap-6">
            {flagships.map(({ project, mockup }, i) => (
              <FlagshipCard
                key={project.slug}
                project={project}
                mockup={mockup}
                meta={flagshipMeta[project.slug] ?? {
                  status: "SHIPPED",
                  statusColor: "text-muted",
                  metrics: [],
                }}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Stacked card carousel for other deployments */}
        <OtherDeployments others={others} onOpen={setActiveProject} />
      </div>

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onNavigate={navigate}
      />
    </section>
  );
}
