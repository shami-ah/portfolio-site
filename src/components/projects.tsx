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
        { label: "clients", value: `${status.openevent.clients}+` },
        { label: "events", value: `${status.openevent.events}+` },
        { label: "time saved", value: "83%" },
      ],
    },
    codelens: {
      status: "BETA",
      statusColor: "text-accent-secondary",
      metrics: [
        { label: "bug patterns", value: `~${status.codelens.patterns}` },
        { label: "languages", value: `${status.codelens.stacks}` },
        { label: "review speed", value: "<1s" },
      ],
    },
    "gogaa-cli": {
      status: "BETA",
      statusColor: "text-accent-secondary",
      metrics: [
        { label: "AI models", value: `${status.gogaa.providers}` },
        { label: "auto-fallback", value: "yes" },
        { label: "vendor lock-in", value: "zero" },
      ],
    },
    rasad: {
      status: "SHIPPED",
      statusColor: "text-accent",
      metrics: [
        { label: "sessions tracked", value: "656" },
        { label: "data privacy", value: "100%" },
        { label: "cloud dependency", value: "none" },
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

/* ------------------------------------------------------------------ */
/*  Platform-native cards for "Other Deployments"                      */
/*  Each card IS the platform the product runs on                      */
/* ------------------------------------------------------------------ */

type FrameKind = "phone" | "pwa" | "docker" | "huggingface" | "streamlit" | "dag";

const CARD_FRAMES: Record<string, FrameKind> = {
  "command-center":     "pwa",
  "gluten-free":        "phone",
  "rag-pipeline":       "streamlit",
  "vqa-agent":          "streamlit",
  "dev-env":            "docker",
  "agent-orchestrator": "dag",
  "agent-system":       "huggingface",
};

/** Shared props for every card frame */
interface FrameProps {
  project: ProjectData;
  onOpen: (p: ProjectData) => void;
  counter: string;
  className: string;
}

/** Footer row — same for all frames */
function CardFooter({ project, onOpen, counter }: { project: ProjectData; onOpen: (p: ProjectData) => void; counter: string }): React.ReactElement {
  return (
    <div className="flex items-center justify-between pt-2.5 mt-auto border-t border-card-border/30">
      <button type="button" onClick={() => onOpen(project)} className="text-small font-mono text-accent hover:text-accent/80 transition-colors">
        view &rarr;
      </button>
      <span className="text-caption font-mono text-muted/30">{counter}</span>
    </div>
  );
}

/* ---------- Phone (iOS) ---------- */
function PhoneCard({ project, onOpen, counter, className }: FrameProps): React.ReactElement {
  return (
    <motion.div className={className} layout>
      <div className="w-full h-full rounded-[24px] border-2 border-card-border bg-card flex flex-col overflow-hidden">
        {/* Dynamic Island */}
        <div className="flex items-center justify-center pt-2 pb-1">
          <div className="w-20 h-[5px] rounded-full bg-card-border/60" />
        </div>
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pb-1">
          <span className="text-caption text-muted/40 font-mono">9:41</span>
          <div className="flex items-center gap-1">
            <span className="text-caption text-muted/40">5G</span>
            <div className="flex gap-[2px] items-end h-2.5">
              {[40, 60, 80, 100].map((h) => (
                <div key={h} className="w-[3px] rounded-sm bg-muted/30" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
        {/* App content */}
        <div className="flex-1 px-4 pb-2 flex flex-col">
          <p className="font-bold text-base mb-1">{project.title}</p>
          <span className="inline-block text-caption font-mono px-2 py-0.5 rounded-full bg-accent/8 text-accent border border-accent/15 mb-2 self-start">
            {project.type}
          </span>
          <p className="text-small text-muted leading-relaxed line-clamp-2">{project.cardSummary ?? project.subtitle}</p>
          <CardFooter project={project} onOpen={onOpen} counter={counter} />
        </div>
        {/* Home indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-28 h-1 rounded-full bg-muted/20" />
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- PWA (browser with install badge) ---------- */
function PwaCard({ project, onOpen, counter, className }: FrameProps): React.ReactElement {
  return (
    <motion.div className={className} layout>
      <div className="w-full h-full rounded-xl border border-card-border bg-card flex flex-col overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border/50 bg-background/40">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/40" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/40" />
            <span className="w-2 h-2 rounded-full bg-green-500/40" />
          </div>
          <div className="flex-1 mx-1 px-2.5 py-0.5 rounded-md bg-background/50 border border-card-border/40 flex items-center gap-1.5">
            <span className="text-green-400/50 text-caption">🔒</span>
            <span className="text-caption font-mono text-muted/50 truncate">command-center.app</span>
          </div>
        </div>
        {/* PWA install banner */}
        <div className="mx-3 mt-2.5 px-2.5 py-1.5 rounded-lg bg-accent/8 border border-accent/15 flex items-center gap-2">
          <span className="text-caption">⬇</span>
          <span className="text-caption text-accent/80">Install as app</span>
          <span className="text-caption text-muted/40 ml-auto">Works offline</span>
        </div>
        <div className="flex-1 p-4 pt-2.5 flex flex-col">
          <p className="font-bold text-base mb-1">{project.title}</p>
          <p className="text-small text-muted leading-relaxed line-clamp-2 mb-1">{project.cardSummary ?? project.subtitle}</p>
          <CardFooter project={project} onOpen={onOpen} counter={counter} />
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Docker Desktop ---------- */
function DockerCard({ project, onOpen, counter, className }: FrameProps): React.ReactElement {
  return (
    <motion.div className={className} layout>
      <div className="w-full h-full rounded-xl border border-card-border bg-card flex flex-col overflow-hidden">
        {/* Docker Desktop header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border/50 bg-background/40">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/40" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/40" />
            <span className="w-2 h-2 rounded-full bg-green-500/40" />
          </div>
          <span className="text-caption font-semibold text-muted/60 ml-1">Docker Desktop</span>
          <span className="text-caption text-muted/30 ml-auto">Containers</span>
        </div>
        {/* Container list */}
        <div className="px-3 pt-2 space-y-1.5">
          {[
            { name: "dev-env", status: "Running", port: "3000", color: "bg-green-400" },
            { name: "postgres-15", status: "Running", port: "5432", color: "bg-green-400" },
            { name: "redis-7", status: "Running", port: "6379", color: "bg-green-400" },
          ].map((c) => (
            <div key={c.name} className="flex items-center gap-2 px-2 py-1 rounded bg-background/40 border border-card-border/30">
              <span className={`w-1.5 h-1.5 rounded-full ${c.color} shrink-0`} />
              <span className="text-caption font-mono text-foreground/70 flex-1 truncate">{c.name}</span>
              <span className="text-caption text-muted/40">:{c.port}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 px-4 pt-2 pb-4 flex flex-col">
          <p className="font-bold text-base mb-1">{project.title}</p>
          <p className="text-small text-muted leading-relaxed line-clamp-2">{project.cardSummary ?? project.subtitle}</p>
          <CardFooter project={project} onOpen={onOpen} counter={counter} />
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- HuggingFace Spaces ---------- */
function HuggingFaceCard({ project, onOpen, counter, className }: FrameProps): React.ReactElement {
  return (
    <motion.div className={className} layout>
      <div className="w-full h-full rounded-xl border border-card-border bg-card flex flex-col overflow-hidden">
        {/* HF gradient header */}
        <div className="px-3 py-2.5 bg-gradient-to-r from-yellow-500/15 via-orange-500/10 to-red-500/10 border-b border-card-border/50">
          <div className="flex items-center gap-2">
            <span className="text-base">🤗</span>
            <span className="text-caption font-semibold text-foreground/80">Hugging Face</span>
            <span className="text-caption text-muted/40">Spaces</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-caption font-mono text-foreground/60">shami96/deep-agent</span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/15 border border-green-500/25 text-caption text-green-500">
              <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
              Running
            </span>
          </div>
        </div>
        <div className="flex-1 p-4 pt-3 flex flex-col">
          <p className="font-bold text-base mb-1">{project.title}</p>
          <p className="text-small text-muted leading-relaxed line-clamp-2">{project.cardSummary ?? project.subtitle}</p>
          <CardFooter project={project} onOpen={onOpen} counter={counter} />
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Streamlit (chat/search UI) ---------- */
function StreamlitCard({ project, onOpen, counter, className }: FrameProps): React.ReactElement {
  const isVqa = project.slug === "vqa-agent";
  return (
    <motion.div className={className} layout>
      <div className="w-full h-full rounded-xl border border-card-border bg-card flex flex-col overflow-hidden">
        {/* Streamlit header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border/50 bg-background/40">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-red-500/60 to-pink-500/60 flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">S</span>
          </div>
          <span className="text-caption font-mono text-muted/50">localhost:8501</span>
          <span className="flex items-center gap-1 ml-auto px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-caption text-green-500/70">
            <span className="w-1 h-1 rounded-full bg-green-400" />
            Live
          </span>
        </div>
        {/* Mini chat / query UI */}
        <div className="px-3 pt-2.5 space-y-1.5">
          {isVqa ? (
            <>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-background/40 border border-card-border/30">
                <span className="text-caption">🖼</span>
                <span className="text-caption text-muted/60 font-mono">warehouse_photo.jpg</span>
              </div>
              <div className="px-2 py-1.5 rounded bg-accent/5 border border-accent/15">
                <span className="text-caption text-foreground/70">&ldquo;What safety hazards are in this image?&rdquo;</span>
              </div>
            </>
          ) : (
            <>
              <div className="px-2 py-1.5 rounded bg-accent/5 border border-accent/15">
                <span className="text-caption text-foreground/70">&ldquo;How do I process a refund?&rdquo;</span>
              </div>
              <div className="px-2 py-1.5 rounded bg-green-500/5 border border-green-500/15 flex items-start gap-1.5">
                <span className="text-caption text-green-500/60 shrink-0 mt-0.5">✓</span>
                <span className="text-caption text-muted/60 line-clamp-1">Go to Payment Ops SOP, section 4.2...</span>
              </div>
            </>
          )}
        </div>
        <div className="flex-1 px-4 pt-2 pb-4 flex flex-col">
          <p className="font-bold text-base mb-1">{project.title}</p>
          <p className="text-small text-muted leading-relaxed line-clamp-1">{project.cardSummary ?? project.subtitle}</p>
          <CardFooter project={project} onOpen={onOpen} counter={counter} />
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- DAG / Agent flow ---------- */
function DagCard({ project, onOpen, counter, className }: FrameProps): React.ReactElement {
  return (
    <motion.div className={className} layout>
      <div className="w-full h-full rounded-xl border border-card-border bg-card flex flex-col overflow-hidden">
        {/* Agent header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border/50 bg-background/40">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-caption font-mono text-muted/60">orchestrator · task DAG</span>
        </div>
        {/* Mini DAG visualization */}
        <div className="px-3 pt-2.5 flex items-center gap-1">
          {[
            { label: "Plan", color: "bg-accent/20 text-accent border-accent/30" },
            { label: "→", color: "text-muted/30" },
            { label: "Worker", color: "bg-green-500/15 text-green-500 border-green-500/25" },
            { label: "→", color: "text-muted/30" },
            { label: "Validate", color: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
            { label: "→", color: "text-muted/30" },
            { label: "✓", color: "bg-green-500/15 text-green-500 border-green-500/25" },
          ].map((n, i) => (
            n.label === "→"
              ? <span key={i} className={`text-caption ${n.color}`}>→</span>
              : <span key={i} className={`px-1.5 py-0.5 rounded text-caption font-mono border ${n.color}`}>{n.label}</span>
          ))}
        </div>
        {/* Task state */}
        <div className="px-3 pt-1.5 flex items-center gap-2">
          <span className="text-caption text-muted/40 font-mono">state:</span>
          <span className="text-caption text-green-500/70 font-mono">completed</span>
          <span className="text-caption text-muted/30 font-mono ml-auto">3/3 critique rounds</span>
        </div>
        <div className="flex-1 px-4 pt-2 pb-4 flex flex-col">
          <p className="font-bold text-base mb-1">{project.title}</p>
          <p className="text-small text-muted leading-relaxed line-clamp-2">{project.cardSummary ?? project.subtitle}</p>
          <CardFooter project={project} onOpen={onOpen} counter={counter} />
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Frame router ---------- */
function DeviceCard({ project, onOpen, counter, className }: FrameProps): React.ReactElement {
  const frame = CARD_FRAMES[project.slug] ?? "pwa";
  const props = { project, onOpen, counter, className };
  switch (frame) {
    case "phone":       return <PhoneCard {...props} />;
    case "pwa":         return <PwaCard {...props} />;
    case "docker":      return <DockerCard {...props} />;
    case "huggingface": return <HuggingFaceCard {...props} />;
    case "streamlit":   return <StreamlitCard {...props} />;
    case "dag":         return <DagCard {...props} />;
    default:            return <PwaCard {...props} />;
  }
}

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
        <div className="relative w-[340px] h-[300px] mt-8">
          {others.map((project, i) => {
            const pos = (i - current + others.length) % others.length;
            const transformClass = pos < 3
              ? STACK_TRANSFORMS[pos]
              : "translate-y-7 translate-x-4 rotate-[4deg] scale-[0.91] opacity-0 pointer-events-none z-[4]";
            const counter = pos === 0 ? `${i + 1} / ${others.length}` : "";

            return (
              <DeviceCard
                key={project.slug}
                project={project}
                onOpen={onOpen}
                counter={counter}
                className={`absolute top-0 left-0 w-[340px] h-[280px] cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${transformClass}`}
              />
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
              <p className="text-sm md:text-base text-muted leading-relaxed max-w-sm">
                Production AI systems, developer tools, and SaaS products. Each one links to a full case study with architecture decisions and results.
              </p>
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
