"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import mermaid from "mermaid";
import { projects, type ProjectData } from "@/data/projects";
import { diagrams } from "@/data/diagrams";
import { FadeUp } from "./motion";
import { TypeLabel } from "./type-label";
import { ProjectModal } from "./project-modal";
import { ProjectMockup, type MockupKind } from "./project-mockup";
import { AccessRequestModal } from "./access-request-modal";
import { DecisionTree } from "./decision-tree";
import { AgentEmoji } from "./agent-bar";
import { useStatus } from "@/lib/use-status";

const EMOJI_COMMENTARY: Record<string, { mood: "proud" | "curious" | "default" | "surprised"; text: string }> = {
  openevent: { mood: "proud", text: "8 months, 100+ clients, zero AI errors." },
  codelens: { mood: "curious", text: "430 patterns from real PRs, not theory." },
  "gogaa-cli": { mood: "surprised", text: "1,418 tests. I don't ship without them." },
  rasad: { mood: "default", text: "Built this so I could see inside the black box." },
};
import { useScrollLock } from "@/lib/use-scroll-lock";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Flagship config                                                    */
/* ------------------------------------------------------------------ */

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
        { label: "in months", value: "8" },
        { label: "time saved", value: "83%" },
      ],
    },
    codelens: {
      status: "BETA",
      statusColor: "text-accent-secondary",
      metrics: [
        { label: "bug patterns", value: `~${status.codelens.patterns}` },
        { label: "mined from", value: "600+ PRs" },
        { label: "review speed", value: "<1s" },
      ],
    },
    "gogaa-cli": {
      status: "BETA",
      statusColor: "text-accent-secondary",
      metrics: [
        { label: "providers", value: `${status.gogaa.providers}` },
        { label: "if one fails", value: "auto-switch" },
        { label: "lock-in", value: "zero" },
      ],
    },
    rasad: {
      status: "SHIPPED",
      statusColor: "text-accent",
      metrics: [
        { label: "sessions", value: "656" },
        { label: "graded", value: "A-F" },
        { label: "cloud", value: "none" },
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Per-project content for the scrollytelling panels                  */
/* ------------------------------------------------------------------ */

interface PanelContent {
  title: string;
  oneLiner: string;
  problem: string;
  solution: string;
  glow: string;
}

type ExpandedPanel = { kind: "mockup" | "diagram"; project: ProjectData; mockup: MockupKind; content: PanelContent } | null;

const PANEL_CONTENT: Record<string, PanelContent> = {
  openevent: {
    title: "OpenEvent",
    oneLiner: "AI turns client emails into approved bookings, invoices, and CRM updates.",
    problem: "Event teams waste 90 min/day on email to CRM data entry.",
    solution: "AI reads emails, creates bookings, detects conflicts, updates CRM. Zero manual entry.",
    glow: "radial-gradient(ellipse at 30% 50%, rgba(160,120,104,0.06), transparent 70%)",
  },
  codelens: {
    title: "CodeLens",
    oneLiner: "430 bug patterns mined from 600+ real PRs. Reviews in under one second.",
    problem: "Code review misses bugs that patterns catch in milliseconds.",
    solution: "430 patterns from 600+ real PRs. Scans in <1s. Your code never leaves your machine.",
    glow: "radial-gradient(ellipse at 70% 40%, rgba(74,85,120,0.06), transparent 70%)",
  },
  "gogaa-cli": {
    title: "Gogaa CLI",
    oneLiner: "11 AI providers behind one interface. If one goes down, you don't stop working.",
    problem: "AI providers go down. Your work stops.",
    solution: "11 providers behind one interface. Auto-fallback. 1,400+ tests. Zero lock-in.",
    glow: "radial-gradient(ellipse at 40% 60%, rgba(74,85,120,0.04), transparent 70%)",
  },
  rasad: {
    title: "Rasad",
    oneLiner: "Every tool call, every file touch, graded A-F. 656 sessions analyzed. 100% local.",
    problem: "AI coding sessions are black boxes — no way to know what worked.",
    solution: "Every tool call, every file touch, graded A-F. 656 sessions analyzed. 100% local.",
    glow: "radial-gradient(ellipse at 50% 50%, rgba(160,120,104,0.06), transparent 70%)",
  },
};

/* ------------------------------------------------------------------ */
/*  Scrollytelling panel — one full-viewport sticky card               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Inline diagram renderer                                             */
/* ------------------------------------------------------------------ */

interface DiagramNode {
  id: string;
  label: string;
}

interface DiagramEdge {
  from: string;
  to: string;
}

function cleanDiagramLabel(label: string): string {
  return label.replace(/\\n/g, " ").replace(/\s+/g, " ").trim();
}

function parseDiagram(chart: string): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  const nodes = new Map<string, string>();
  const edges: DiagramEdge[] = [];
  const nodePattern = /([A-Za-z][A-Za-z0-9_-]*)\s*(?:\[[^\]]+\]|\{[^}]+\})/g;
  const edgePattern = /([A-Za-z][A-Za-z0-9_-]*)\s*(?:-->|-.->|&)\s*([A-Za-z][A-Za-z0-9_-]*)/g;
  let match: RegExpExecArray | null;

  while ((match = nodePattern.exec(chart)) !== null) {
    const token = match[0];
    const id = match[1];
    const label = token.slice(id.length).replace(/^[\s[{]+|[\]}]+$/g, "");
    nodes.set(id, cleanDiagramLabel(label || id));
  }

  while ((match = edgePattern.exec(chart)) !== null) {
    edges.push({ from: match[1], to: match[2] });
    if (!nodes.has(match[1])) nodes.set(match[1], match[1]);
    if (!nodes.has(match[2])) nodes.set(match[2], match[2]);
  }

  return {
    nodes: Array.from(nodes, ([id, label]) => ({ id, label })).slice(0, 14),
    edges: edges.slice(0, 18),
  };
}

function DiagramFallback({ chart }: { chart: string }): React.ReactElement {
  const parsed = useMemo(() => parseDiagram(chart), [chart]);
  const nodes = parsed.nodes.length > 0 ? parsed.nodes : [{ id: "diagram", label: "Architecture diagram" }];
  const edgeLabels = parsed.edges
    .map((edge) => {
      const from = nodes.find((node) => node.id === edge.from)?.label ?? edge.from;
      const to = nodes.find((node) => node.id === edge.to)?.label ?? edge.to;
      return `${from} -> ${to}`;
    })
    .slice(0, 5);

  return (
    <div className="h-full w-full overflow-auto p-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {nodes.slice(0, 9).map((node, index) => (
          <div
            key={`${node.id}-${index}`}
            className="min-h-12 rounded-lg border border-accent/20 bg-accent/[0.04] px-2.5 py-2 text-left"
          >
            <p className="text-[10px] font-mono uppercase tracking-wider text-accent/50">{String(index + 1).padStart(2, "0")}</p>
            <p className="mt-1 text-[11px] leading-snug text-foreground/80">{node.label}</p>
          </div>
        ))}
      </div>
      {edgeLabels.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {edgeLabels.map((label) => (
            <p key={label} className="truncate text-[10px] font-mono text-muted/45">
              {label}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function MermaidDiagram({ chart, className }: { chart: string; className?: string }): React.ReactElement {
  const reactId = useId();
  const [svg, setSvg] = useState("");
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled) setShowFallback(true);
    }, 1500);

    async function render(): Promise<void> {
      setSvg("");
      setShowFallback(false);
      if (!chart.trim()) {
        return;
      }
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          primaryColor: "#1e3a5f",
          primaryTextColor: "#93c5fd",
          primaryBorderColor: "#3b82f6",
          lineColor: "#3b82f680",
          secondaryColor: "#18181b",
          tertiaryColor: "#27272a",
          fontFamily: "ui-monospace, monospace",
          fontSize: "11px",
          nodeBorder: "#3b82f640",
          mainBkg: "#1e293b",
          clusterBkg: "#0f172a",
          clusterBorder: "#3b82f630",
          edgeLabelBackground: "#09090b",
          nodeTextColor: "#e2e8f0",
        },
        flowchart: { htmlLabels: true, curve: "basis", padding: 8, nodeSpacing: 20, rankSpacing: 30 },
      });
      const safeId = reactId.replace(/[^a-zA-Z0-9_-]/g, "") || "diagram";
      const randomId = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const id = `mermaid-${safeId}-${randomId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
      try {
        const { svg: rendered } = await mermaid.render(id, chart);
        if (!cancelled) {
          window.clearTimeout(fallbackTimer);
          setSvg(rendered);
          setShowFallback(false);
        }
      } catch (err) {
        if (!cancelled) {
          window.clearTimeout(fallbackTimer);
          setShowFallback(true);
        }
      }
    }
    render();
    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
    };
  }, [chart, reactId]);

  return (
    <div className={className}>
      {svg ? (
        <div
          className="flex items-center justify-center h-full w-full overflow-auto p-2 [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto [&_svg]:m-auto [&_svg]:block"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : showFallback ? (
        <DiagramFallback chart={chart} />
      ) : (
        <div className="flex items-center justify-center h-full text-caption text-muted/30 font-mono">
          Loading diagram...
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Expand modal — full-screen view for mockup or diagram              */
/* ------------------------------------------------------------------ */

function StreamingText({ text, delay = 600 }: { text: string; delay?: number }): React.ReactElement {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    setShown(0);
    const start = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setShown(i);
        if (i >= text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(start);
  }, [text, delay]);
  if (shown === 0) return <span className="text-muted/40">...</span>;
  return <>{text.slice(0, shown)}<span className="animate-pulse">|</span></>;
}

function ExpandModal({
  open,
  onClose,
  title,
  projectSlug,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  projectSlug?: string;
  children: React.ReactNode;
}): React.ReactElement {
  useScrollLock(open);
  useEffect(() => {
    if (!open) return;
    document.body.setAttribute("data-modal-open", "true");
    const onKey = (e: KeyboardEvent): void => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.removeAttribute("data-modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const commentary = projectSlug ? EMOJI_COMMENTARY[projectSlug] : undefined;

  // Portal to document.body so modal sits above all fixed elements (nav, sidebar, agent, chat)
  if (typeof document === "undefined") return <></>;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-5xl max-h-[90vh] rounded-xl border border-card-border bg-card overflow-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b border-card-border/50 bg-card/90 backdrop-blur-sm">
              <p className="text-sm font-mono text-muted">{title}</p>
              <div className="flex items-center gap-3">
                {/* Agent emoji commentary — top-right, animated */}
                {commentary && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/10"
                  >
                    <motion.div
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-card-border to-card border border-accent-status/20 flex items-center justify-center shrink-0"
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <AgentEmoji size={16} mood={commentary.mood} />
                    </motion.div>
                    <span className="font-mono text-caption text-accent/70 hidden sm:block whitespace-nowrap">
                      <StreamingText text={commentary.text} />
                    </span>
                  </motion.div>
                )}
                <button type="button" onClick={onClose} className="text-muted hover:text-foreground transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="p-5 md:p-8">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/*  Scrollytelling panel                                               */
/* ------------------------------------------------------------------ */

function ScrollPanel({
  project,
  mockup,
  meta,
  content,
  index,
  total,
  onExpand,
}: {
  project: ProjectData;
  mockup: MockupKind;
  meta: FlagshipMeta;
  content: PanelContent;
  index: number;
  total: number;
  onExpand: (panel: Exclude<ExpandedPanel, null>) => void;
}): React.ReactElement {
  const num = String(index + 1).padStart(2, "0");
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const panelPayload = { project, mockup, content };

  return (
    <>
      {/* Sticky panel — slides over previous via z-index */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-background scroll-snap-align-start"
        style={{ zIndex: (index + 1) * 10 }}
      >
        {/* Top shadow for smooth slide-over visual */}
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-20 pointer-events-none z-20"
          style={{ background: "linear-gradient(to bottom, var(--background), transparent)", boxShadow: "0 -20px 40px var(--background)" }}
        />
        {/* Subtle per-project glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: content.glow }}
        />

        <div className="relative z-10 h-full flex flex-col px-4 md:px-8 lg:px-16 py-5 md:py-10 max-w-[1400px] mx-auto">
          {/* Top row: status + title left, big number right */}
          <div className="flex items-start justify-between gap-4 mb-4 md:mb-5">
            <div className="flex-1 min-w-0">
              <span className={`inline-flex items-center gap-1.5 text-caption font-mono uppercase tracking-wider ${meta.statusColor} mb-2`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {meta.status}
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-2 md:mb-3">
                {content.title}<span className="text-muted">.</span>
              </h3>
              <p className="text-xs md:text-sm text-muted leading-relaxed max-w-lg">
                {content.oneLiner}
              </p>
            </div>
            <span className="hidden sm:block text-[7rem] md:text-[9rem] lg:text-[11rem] font-bold leading-none text-foreground/[0.04] select-none tracking-tighter shrink-0">
              {num}
            </span>
          </div>

          {/* Problem → Solution — single row, inline */}
          <div className="p-2.5 md:p-4 rounded-xl border border-card-border/50 bg-card/30 mb-3 md:mb-5">
            <p className="text-[11px] md:text-sm text-muted leading-relaxed">
              <span className="font-mono uppercase tracking-wider text-muted/60 text-caption">Problem: </span>
              {content.problem}
              <span className="mx-2 text-accent/40">→</span>
              <span className="font-mono uppercase tracking-wider text-accent/60 text-caption">Solution: </span>
              <span className="text-foreground/80">{content.solution}</span>
            </p>
          </div>

          {/* Live Preview + Architecture — clearly labeled, full width */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Mockup */}
            <button
              type="button"
              data-project-expand="mockup"
              data-project-slug={project.slug}
              onClick={() => onExpand({ kind: "mockup", ...panelPayload })}
              className="relative group min-h-0 overflow-hidden rounded-xl border border-card-border/40 bg-card/20 cursor-pointer hover:border-accent/30 transition-colors text-left"
            >
              <ProjectMockup kind={mockup} className="shadow-none border-card-border/40 h-full" />
              <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background/80 backdrop-blur-sm border border-card-border/50 opacity-60 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={11} className="text-accent" />
                <span className="text-caption font-mono text-muted">full details</span>
              </div>
            </button>
            {/* Architecture diagram */}
            <button
              type="button"
              data-project-expand="diagram"
              data-project-slug={project.slug}
              onClick={() => onExpand({ kind: "diagram", ...panelPayload })}
              className="relative group min-h-0 overflow-hidden rounded-xl border border-card-border/40 bg-card cursor-pointer hover:border-accent/30 transition-colors"
            >
              <p className="text-caption font-mono uppercase tracking-wider text-muted/40 pt-3 text-center">architecture</p>
              <MermaidDiagram chart={diagrams[project.slug] ?? ""} className="h-[calc(100%-2rem)] p-3" />
              <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background/80 backdrop-blur-sm border border-card-border/50 opacity-60 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={11} className="text-accent" />
                <span className="text-caption font-mono text-muted">expand</span>
              </div>
            </button>
          </div>

          {/* Metrics + stack + links */}
          <div className="flex flex-col gap-2 mt-3 md:mt-4 shrink-0">
            <div className="flex items-end justify-between gap-4">
              <div className="flex gap-6 md:gap-8">
                {meta.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-lg md:text-xl font-bold font-mono text-foreground">{m.value}</p>
                    <p className="text-caption font-mono text-muted/50 uppercase tracking-wider">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {project.requestAccess && (
                  <button type="button" onClick={() => setAccessModalOpen(true)} className="text-caption font-mono px-2.5 py-1 rounded-lg border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 transition-colors cursor-pointer">
                    request access
                  </button>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-caption font-mono text-accent-status hover:text-accent-status/80 transition-colors">
                    live demo ↗
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-caption font-mono text-muted hover:text-foreground transition-colors">
                    github ↗
                  </a>
                )}
                <span className="text-caption font-mono text-muted/30">
                  {num} / {String(total).padStart(2, "0")}
                </span>
              </div>
            </div>
            {/* Tech stack tags */}
            <div className="flex flex-wrap gap-1.5">
              {project.stack.slice(0, 8).map((tech) => (
                <span key={tech} className="px-2 py-0.5 text-caption font-mono rounded bg-card/50 border border-card-border/40 text-muted/60">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AccessRequestModal open={accessModalOpen} onClose={() => setAccessModalOpen(false)} />
    </>
  );
}

function ProjectDetailsContent({ project, mockup }: { project: ProjectData; mockup: MockupKind }): React.ReactElement {
  return (
    <>
      <ProjectMockup kind={mockup} />

      {project.decision && (
        <DecisionTree decision={project.decision} />
      )}

      {/* Measured Impact — before/after */}
      {project.measuredImpact && (
        <div className="mt-8 pt-6 border-t border-card-border/30">
          <p className="text-xs font-mono text-accent mb-4 uppercase tracking-wider">Measured Impact</p>
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="p-4 md:p-5 rounded-xl bg-background/50 border border-card-border">
              <p className="text-caption font-mono text-muted/60 uppercase tracking-[0.2em] mb-1.5">before</p>
              <p className="text-3xl md:text-5xl font-bold text-muted font-mono leading-none">
                {project.measuredImpact.before.value}
                {project.measuredImpact.before.unit && <span className="text-muted/40 text-lg md:text-2xl">{project.measuredImpact.before.unit}</span>}
              </p>
              <p className="text-caption md:text-xs text-muted/80 mt-2">{project.measuredImpact.before.context}</p>
            </div>
            <div className="relative p-4 md:p-5 rounded-xl bg-gradient-to-br from-accent/10 via-background/50 to-background/50 border border-accent/20 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              <p className="text-caption font-mono text-accent uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                after
              </p>
              <p className="text-3xl md:text-5xl font-bold text-accent font-mono leading-none">
                {project.measuredImpact.after.value}
                {project.measuredImpact.after.unit && <span className="text-accent/60 text-lg md:text-2xl">{project.measuredImpact.after.unit}</span>}
              </p>
              <p className="text-caption md:text-xs text-muted mt-2">{project.measuredImpact.after.context}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {project.measuredImpact.highlights.map((s, i) => (
              <div
                key={s.l}
                className={`p-2.5 rounded-lg text-center ${
                  i === project.measuredImpact!.highlights.length - 1
                    ? "bg-accent/10 border border-accent/20"
                    : "bg-background/50 border border-card-border"
                }`}
              >
                <p className={`text-base md:text-lg font-bold font-mono tabular-nums ${i === project.measuredImpact!.highlights.length - 1 ? "text-accent" : "text-foreground/80"}`}>{s.n}</p>
                <p className="text-caption text-muted/60 uppercase tracking-wider">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.features.length > 0 && (
        <div className="mt-8 pt-6 border-t border-card-border/30">
          <p className="text-xs font-mono text-accent mb-4 uppercase tracking-wider">Key Features</p>
          <ul className="space-y-2">
            {project.features.map((f) => (
              <li key={f.slice(0, 30)} className="flex gap-2.5 text-sm text-muted leading-relaxed">
                <span className="text-accent shrink-0 mt-1 text-xs">&#9654;</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Approach comparison */}
      {project.vs && (
        <div className="mt-8 pt-6 border-t border-card-border/30">
          <p className="text-xs font-mono text-accent mb-4 uppercase tracking-wider">Approach Comparison</p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-4 md:p-5 rounded-xl bg-gradient-to-br from-green-500/5 via-background/50 to-background/50 border border-green-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent" />
              <p className="text-caption font-mono text-green-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                {project.vs.mine.title}
              </p>
              <ul className="space-y-2">
                {project.vs.mine.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-xs md:text-sm text-foreground/80 leading-relaxed">
                    <span className="text-green-400/80 shrink-0 mt-0.5">▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 md:p-5 rounded-xl bg-background/50 border border-card-border relative overflow-hidden">
              <p className="text-caption font-mono text-muted/60 uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-muted/40" />
                {project.vs.standard.title}
              </p>
              <ul className="space-y-2">
                {project.vs.standard.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-xs md:text-sm text-muted leading-relaxed">
                    <span className="text-muted/40 shrink-0 mt-0.5">▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {project.techDecisions && project.techDecisions.length > 0 && (
        <div className="mt-8 pt-6 border-t border-card-border/30">
          <p className="text-xs font-mono text-accent mb-4 uppercase tracking-wider">Key Technical Decisions</p>
          <div className="grid md:grid-cols-2 gap-3">
            {project.techDecisions.map((d) => (
              <div key={d.title} className="p-4 rounded-xl bg-card/50 border border-card-border">
                <h4 className="font-bold text-sm mb-1.5">{d.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.results.length > 0 && (
        <div className="mt-8 pt-6 border-t border-card-border/30">
          <p className="text-xs font-mono text-accent mb-4 uppercase tracking-wider">Results</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {project.results.map((r) => (
              <div key={r.slice(0, 30)} className="flex items-start gap-2.5 p-3 rounded-lg bg-card/50 border border-card-border">
                <span className="text-accent mt-0.5 text-xs">&#10003;</span>
                <span className="text-xs text-muted leading-relaxed">{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll progress indicator                                          */
/* ------------------------------------------------------------------ */

function ScrollProgress({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }): React.ReactElement {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = (): void => {
      const rect = container.getBoundingClientRect();
      const total = container.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      setProgress(Math.max(0, Math.min(100, (scrolled / total) * 100)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  if (progress <= 0) return <></>;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[3px] bg-card-border/30 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-accent to-accent-secondary transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
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

type FrameKind = "phone" | "pwa" | "docker" | "huggingface" | "streamlit" | "dag";

const CARD_FRAMES: Record<string, FrameKind> = {
  "command-center":     "pwa",
  "gluten-free":        "phone",
  "dev-env":            "docker",
  "agent-orchestrator": "dag",
  "agent-system":       "huggingface",
};

interface FrameProps {
  project: ProjectData;
  onOpen: (p: ProjectData) => void;
  counter: string;
  className: string;
}

function CardFooter({ project, onOpen, counter }: { project: ProjectData; onOpen: (p: ProjectData) => void; counter: string }): React.ReactElement {
  return (
    <div className="mt-auto">
      {/* Top result */}
      {project.results.length > 0 && (
        <p className="flex gap-1.5 text-caption text-muted/60 leading-snug mb-2.5">
          <span className="text-accent/50 shrink-0">&#10003;</span>
          <span className="line-clamp-1">{project.results[0]}</span>
        </p>
      )}
      <div className="flex items-center justify-between pt-2.5 border-t border-card-border/30">
        <button type="button" onClick={() => onOpen(project)} className="text-small font-mono text-accent hover:text-accent/80 transition-colors">
          view details &rarr;
        </button>
        <span className="text-caption font-mono text-muted/30">{counter}</span>
      </div>
    </div>
  );
}

/* ---------- Phone (iOS) ---------- */
function PhoneCard({ project, onOpen, counter, className }: FrameProps): React.ReactElement {
  return (
    <motion.div className={className} layout>
      <div className="w-full h-full rounded-[24px] border-2 border-card-border bg-card flex flex-col overflow-hidden">
        <div className="flex items-center justify-center pt-2 pb-1">
          <div className="w-20 h-[5px] rounded-full bg-card-border/60" />
        </div>
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
        <div className="flex-1 px-4 pb-2 flex flex-col">
          <p className="font-bold text-base mb-1">{project.title}</p>
          <span className="inline-block text-caption font-mono px-2 py-0.5 rounded-full bg-accent/8 text-accent border border-accent/15 mb-2 self-start">
            {project.type}
          </span>
          <p className="text-small text-muted leading-relaxed mb-2">{project.cardSummary ?? project.subtitle}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {project.stack.slice(0, 4).map((t) => (
              <span key={t} className="px-1.5 py-0.5 text-caption font-mono rounded bg-card-border/20 text-muted/50">{t}</span>
            ))}
          </div>
          <CardFooter project={project} onOpen={onOpen} counter={counter} />
        </div>
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
        <div className="mx-3 mt-2.5 px-2.5 py-1.5 rounded-lg bg-accent/8 border border-accent/15 flex items-center gap-2">
          <span className="text-caption">⬇</span>
          <span className="text-caption text-accent/80">Install as app</span>
          <span className="text-caption text-muted/40 ml-auto">Works offline</span>
        </div>
        <div className="flex-1 p-4 pt-2.5 flex flex-col">
          <p className="font-bold text-base mb-1">{project.title}</p>
          <p className="text-small text-muted leading-relaxed mb-2">{project.cardSummary ?? project.subtitle}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {project.stack.slice(0, 4).map((t) => (
              <span key={t} className="px-1.5 py-0.5 text-caption font-mono rounded bg-card-border/20 text-muted/50">{t}</span>
            ))}
          </div>
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
        <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border/50 bg-background/40">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/40" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/40" />
            <span className="w-2 h-2 rounded-full bg-green-500/40" />
          </div>
          <span className="text-caption font-semibold text-muted/60 ml-1">Docker Desktop</span>
          <span className="text-caption text-muted/30 ml-auto">Containers</span>
        </div>
        <div className="px-3 pt-2 space-y-1.5">
          {[
            { name: "dev-env", status: "Running", port: "3000", color: "bg-green-400" },
            { name: "postgres-15", status: "Running", port: "5432", color: "bg-green-400" },
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
          <p className="text-small text-muted leading-relaxed mb-2">{project.cardSummary ?? project.subtitle}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {project.stack.slice(0, 4).map((t) => (
              <span key={t} className="px-1.5 py-0.5 text-caption font-mono rounded bg-card-border/20 text-muted/50">{t}</span>
            ))}
          </div>
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
          <p className="text-small text-muted leading-relaxed mb-2">{project.cardSummary ?? project.subtitle}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {project.stack.slice(0, 4).map((t) => (
              <span key={t} className="px-1.5 py-0.5 text-caption font-mono rounded bg-card-border/20 text-muted/50">{t}</span>
            ))}
          </div>
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
        <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border/50 bg-background/40">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-caption font-mono text-muted/60">orchestrator · task DAG</span>
        </div>
        <div className="px-3 pt-2.5 flex items-center gap-1">
          {[
            { label: "Plan", color: "bg-accent/20 text-accent border-accent/30" },
            { label: "→", color: "text-muted/30" },
            { label: "Worker", color: "bg-green-500/15 text-green-500 border-green-500/25" },
            { label: "→", color: "text-muted/30" },
            { label: "Validate", color: "bg-accent/15 text-accent border-accent/25" },
            { label: "→", color: "text-muted/30" },
            { label: "✓", color: "bg-green-500/15 text-green-500 border-green-500/25" },
          ].map((n, i) => (
            n.label === "→"
              ? <span key={i} className={`text-caption ${n.color}`}>→</span>
              : <span key={i} className={`px-1.5 py-0.5 rounded text-caption font-mono border ${n.color}`}>{n.label}</span>
          ))}
        </div>
        <div className="px-3 pt-1.5 flex items-center gap-2">
          <span className="text-caption text-muted/40 font-mono">state:</span>
          <span className="text-caption text-green-500/70 font-mono">completed</span>
          <span className="text-caption text-muted/30 font-mono ml-auto">3/3 critique rounds</span>
        </div>
        <div className="flex-1 px-4 pt-2 pb-4 flex flex-col">
          <p className="font-bold text-base mb-1">{project.title}</p>
          <p className="text-small text-muted leading-relaxed mb-2">{project.cardSummary ?? project.subtitle}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {project.stack.slice(0, 4).map((t) => (
              <span key={t} className="px-1.5 py-0.5 text-caption font-mono rounded bg-card-border/20 text-muted/50">{t}</span>
            ))}
          </div>
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
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="text-caption font-mono text-accent uppercase tracking-wider">
            $ ls deployments/
          </span>
        </div>
        <h3 className="text-lg md:text-xl font-bold mb-1">
          Side projects that made it to production
        </h3>
        <p className="text-xs md:text-sm text-muted/60 mb-8">{others.length} systems shipped and running</p>

        <div className="relative w-[400px] sm:w-[440px] h-[360px] sm:h-[380px]">
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
                className={`absolute top-0 left-0 w-[400px] sm:w-[440px] h-[340px] sm:h-[360px] cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${transformClass}`}
              />
            );
          })}
        </div>

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
  const [activeProject, setActiveProjectRaw] = useState<ProjectData | null>(null);
  const setActiveProject = useCallback((p: ProjectData | null | ((prev: ProjectData | null) => ProjectData | null)) => {
    setActiveProjectRaw((prev) => {
      const next = typeof p === "function" ? p(prev) : p;
      if (next) {
        queueMicrotask(() => window.dispatchEvent(new CustomEvent("project-opened", { detail: next.slug })));
      }
      return next;
    });
  }, []);
  const [expandedPanel, setExpandedPanel] = useState<ExpandedPanel>(null);
  const flagshipMeta = useFlagshipMeta();
  const sectionRef = useRef<HTMLElement>(null);

  const flagships = FLAGSHIP_SLUGS.map(({ slug, mockup }) => ({
    project: projects.find((p) => p.slug === slug),
    mockup,
  })).filter((x): x is { project: ProjectData; mockup: MockupKind } => !!x.project);

  const flagshipSlugs = new Set(FLAGSHIP_SLUGS.map((s) => s.slug));
  const others = projects.filter((p) => !flagshipSlugs.has(p.slug));
  const expandBySlug = useCallback((slug: string, kind: "mockup" | "diagram") => {
    const flagship = FLAGSHIP_SLUGS.find((item) => item.slug === slug);
    const project = projects.find((item) => item.slug === slug);
    if (!flagship || !project) return;
    const content = PANEL_CONTENT[project.slug] ?? {
      title: project.title,
      oneLiner: project.impact,
      problem: project.problem,
      solution: project.solution,
      glow: "none",
    };
    setExpandedPanel({ kind, project, mockup: flagship.mockup, content });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onClick = (event: MouseEvent): void => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-project-expand][data-project-slug]")
        : null;
      if (!target || !section.contains(target)) return;
      const kind = target.dataset.projectExpand;
      const slug = target.dataset.projectSlug;
      if ((kind === "mockup" || kind === "diagram") && slug) {
        expandBySlug(slug, kind);
      }
    };

    section.addEventListener("click", onClick, true);
    return () => section.removeEventListener("click", onClick, true);
  }, [expandBySlug]);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      setActiveProject((current) => {
        if (!current) return current;
        const idx = others.findIndex((p) => p.slug === current.slug);
        if (idx === -1) return current;
        const next = (idx + dir + others.length) % others.length;
        return others[next];
      });
    },
    [others],
  );

  return (
    <section id="projects" ref={sectionRef}>
      <ScrollProgress containerRef={sectionRef} />

      {/* Section intro */}
      <div className="md:min-h-[60vh] flex flex-col items-center justify-center text-center px-5 md:px-8 py-8 md:py-20">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-[0.3em]">
            what I&apos;ve shipped
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-5">
            4 production systems<span className="text-muted">.</span>
            <br />
            <span className="text-muted">Scroll to explore</span><span className="text-accent">.</span>
          </h2>
          <p className="text-sm md:text-base text-muted leading-relaxed max-w-md mx-auto">
            Each one built from scratch, solving a real problem, running in production. Click the mockup or diagram to expand.
          </p>
        </FadeUp>
      </div>

      {/* Scrollytelling panels — scroll-snap for smooth snapping */}
      <div className="scroll-snap-projects">
        {flagships.map(({ project, mockup }, i) => (
          <ScrollPanel
            key={project.slug}
            project={project}
            mockup={mockup}
            meta={flagshipMeta[project.slug] ?? { status: "SHIPPED", statusColor: "text-muted", metrics: [] }}
            content={PANEL_CONTENT[project.slug] ?? { title: project.title, oneLiner: project.impact, problem: project.problem, solution: project.solution, glow: "none", mermaid: "" }}
            index={i}
            total={flagships.length}
            onExpand={setExpandedPanel}
          />
        ))}
      </div>

      {/* Other deployments carousel */}
      <div className="py-8 md:py-16 px-4 md:px-8">
        <OtherDeployments others={others} onOpen={setActiveProject} />
      </div>

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onNavigate={navigate}
      />
      <ExpandModal open={!!expandedPanel} onClose={() => setExpandedPanel(null)} title={expandedPanel ? `${expandedPanel.content.title} — ${expandedPanel.kind === "mockup" ? "Details" : "Architecture"}` : ""} projectSlug={expandedPanel?.project.slug}>
        {expandedPanel?.kind === "mockup" ? (
          <ProjectDetailsContent project={expandedPanel.project} mockup={expandedPanel.mockup} />
        ) : expandedPanel ? (
          <MermaidDiagram chart={diagrams[expandedPanel.project.slug] ?? ""} className="min-h-[60vh] flex items-center justify-center" />
        ) : null}
      </ExpandModal>
    </section>
  );
}
