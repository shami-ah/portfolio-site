"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { projects, type ProjectData } from "@/data/projects";
import { FadeUp } from "./motion";
import { TypeLabel } from "./type-label";
import { ProjectModal } from "./project-modal";
import { ProjectMockup, type MockupKind } from "./project-mockup";
import { useStatus } from "@/lib/use-status";

const FLAGSHIP_SLUGS: { slug: string; mockup: MockupKind }[] = [
  { slug: "openevent", mockup: "openevent" },
  { slug: "codelens", mockup: "codelens" },
  { slug: "gogaa-cli", mockup: "gogaa" },
  { slug: "rasad", mockup: "rasad" },
];

interface FlagshipMeta {
  status: string;
  statusColor: string;
  version: string;
  metrics: { label: string; value: string }[];
}

function useFlagshipMeta(): Record<string, FlagshipMeta> {
  const { status } = useStatus();
  return {
    openevent: {
      status: "LIVE",
      statusColor: "text-accent-status",
      version: "SaaS",
      metrics: [
        { label: "clients", value: `${status.openevent.clients}+` },
        { label: "events", value: `${status.openevent.events}+` },
        { label: "saved/day", value: `${status.openevent.hoursSavedPerDay}h` },
      ],
    },
    codelens: {
      status: "BETA",
      statusColor: "text-accent-secondary",
      version: `v${status.codelens.version}`,
      metrics: [
        { label: "patterns", value: `~${status.codelens.patterns}` },
        { label: "stacks", value: `${status.codelens.stacks}` },
        { label: "speed", value: "<1s" },
      ],
    },
    "gogaa-cli": {
      status: "BETA",
      statusColor: "text-accent-secondary",
      version: `v${status.gogaa.version}`,
      metrics: [
        { label: "tests", value: `${status.gogaa.tests.toLocaleString()}` },
        { label: "providers", value: `${status.gogaa.providers}` },
        { label: "status", value: status.gogaa.status },
      ],
    },
    rasad: {
      status: "ALPHA",
      statusColor: "text-accent",
      version: "v0.1.x",
      metrics: [
        { label: "sessions", value: "656" },
        { label: "messages", value: "38K" },
        { label: "tool calls", value: "14K" },
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Flagship system card                                               */
/* ------------------------------------------------------------------ */

function SystemCard({
  project,
  mockup,
  meta,
  index,
  onOpen,
}: {
  project: ProjectData;
  mockup: MockupKind;
  meta: FlagshipMeta;
  index: number;
  onOpen: (p: ProjectData) => void;
}): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96, rotateX: 2 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
      style={{ perspective: 800 }}
    >
      <div className="card-glow card-gradient-border rounded-xl bg-card border border-card-border overflow-hidden hover:border-transparent transition-all duration-300 group h-full flex flex-col">
        {/* Header row: status + name + version */}
        <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-card-border/40">
          <div className="flex items-center gap-2.5">
            <span className={`flex items-center gap-1.5 text-caption font-mono ${meta.statusColor}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {meta.status}
            </span>
            <h3 className="font-semibold text-base md:text-lg group-hover:text-accent transition-colors">
              {project.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-caption font-mono text-muted/40">{meta.version}</span>
            <span className="px-2 py-0.5 text-caption font-mono rounded bg-card-hover text-muted/60 border border-card-border">
              {project.type}
            </span>
          </div>
        </div>

        {/* Mockup — compact, fixed height, consistent */}
        <div className="border-b border-card-border/20 p-2 md:p-3 bg-background/30">
          <div className="max-h-[140px] md:max-h-[200px] overflow-hidden rounded-lg">
            <ProjectMockup kind={mockup} className="shadow-none border-card-border/40" />
          </div>
        </div>

        {/* Info */}
        <div className="p-4 md:px-5 md:py-4 flex-1 flex flex-col">
          {/* Description — use cardSummary for concise cards, fall back to impact */}
          <p className="text-xs md:text-sm text-muted leading-relaxed mb-4">
            {project.cardSummary ?? project.impact}
          </p>

          {/* Metrics row */}
          <div className="flex gap-5 mb-4">
            {meta.metrics.map((m) => (
              <div key={m.label}>
                <p className="text-lg md:text-xl font-bold font-mono text-foreground">{m.value}</p>
                <p className="text-caption font-mono text-muted/60 uppercase">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Stack tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.stack.slice(0, 7).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-caption font-mono bg-accent/5 text-accent/80 rounded border border-accent/20"
              >
                {t}
              </span>
            ))}
            {project.stack.length > 7 && (
              <span className="px-2 py-0.5 text-caption font-mono text-muted/40">
                +{project.stack.length - 7}
              </span>
            )}
          </div>

          {/* Actions — pinned to bottom */}
          <div className="flex items-center gap-3 pt-3 border-t border-card-border/20 mt-auto">
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs bg-accent text-background font-medium rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-accent/20 transition-all"
            >
              Quick view
            </button>
            <a
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors font-mono"
            >
              case study <span>→</span>
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent-status transition-colors font-mono ml-auto"
              >
                demo <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Compact deployment row for other projects                          */
/* ------------------------------------------------------------------ */

function DeploymentRow({
  project,
  index,
  onOpen,
}: {
  project: ProjectData;
  index: number;
  onOpen: (p: ProjectData) => void;
}): React.ReactElement {
  return (
    <FadeUp delay={index * 0.04}>
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="w-full group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-card-hover border border-transparent hover:border-card-border transition-all duration-200 text-left"
      >
        <span className="text-accent/40 font-mono text-xs shrink-0">▸</span>
        <span className="font-medium text-sm group-hover:text-accent transition-colors truncate">
          {project.title}
        </span>
        <span className="px-2 py-0.5 text-caption font-mono rounded bg-card-hover text-muted/60 border border-card-border shrink-0">
          {project.type}
        </span>
        {project.requestAccess && (
          <span className="text-caption font-mono text-muted/40 shrink-0">private</span>
        )}
        <span className="text-xs text-muted/40 truncate hidden sm:block flex-1 text-right">
          {project.subtitle}
        </span>
        <span className="text-caption text-muted/40 group-hover:text-accent transition-colors font-mono shrink-0">
          view →
        </span>
      </button>
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

  useEffect(() => {
    const onOpen = (e: Event): void => {
      const ce = e as CustomEvent<string>;
      const match = projects.find((p) => p.slug === ce.detail);
      if (match) {
        document
          .getElementById("projects")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => setActiveProject(match), 400);
      }
    };
    window.addEventListener("open-project", onOpen);
    return () => window.removeEventListener("open-project", onOpen);
  }, []);

  return (
    <section id="projects" className="py-20 md:py-32">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <FadeUp>
          <TypeLabel
            text="$ systemctl status --all"
            className="text-sm font-mono text-accent mb-4 uppercase tracking-wider"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Systems I&apos;ve shipped.
          </h2>
          <p className="text-sm md:text-base text-muted mb-10 md:mb-14 max-w-xl">
            Click any system for architecture, key decisions, and results.
            Each links to a full case study.
          </p>
        </FadeUp>

        {/* Flagship systems — 2x2 grid, uniform height */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-5 mb-10 md:mb-14 items-stretch">
          {flagships.map(({ project, mockup }, i) => (
            <SystemCard
              key={project.slug}
              project={project}
              mockup={mockup}
              meta={flagshipMeta[project.slug] ?? {
                status: "SHIPPED",
                statusColor: "text-muted",
                version: "",
                metrics: [],
              }}
              index={i}
              onOpen={setActiveProject}
            />
          ))}
        </div>

        {/* Other deployments — compact list */}
        <div className="pt-6 border-t border-card-border/40">
          <FadeUp>
            <p className="text-caption font-mono text-muted/60 uppercase tracking-wider mb-3 px-4">
              Other deployments · {others.length} systems
            </p>
          </FadeUp>
          <div className="space-y-0.5">
            {others.map((project, i) => (
              <DeploymentRow
                key={project.slug}
                project={project}
                index={i}
                onOpen={setActiveProject}
              />
            ))}
          </div>
        </div>
      </div>

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onNavigate={navigate}
      />
    </section>
  );
}
