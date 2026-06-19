"use client";

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Lock, MessageSquare } from "lucide-react";
import type { ProjectData } from "@/data/projects";
import { diagrams } from "@/data/diagrams";
import { ArchitectureDiagram } from "./architecture-diagram";
import { DecisionTree } from "./decision-tree";
import { AccessRequestModal } from "./access-request-modal";
import { AgentEmoji } from "./agent-bar";

const EMOJI_COMMENTARY: Record<string, { mood: "proud" | "curious" | "default" | "surprised"; text: string }> = {
  openevent: { mood: "proud", text: "8 months, 100+ clients, zero AI errors." },
  codelens: { mood: "curious", text: "430 patterns from real PRs, not theory." },
  "gogaa-cli": { mood: "surprised", text: "1,418 tests. I don't ship without them." },
  rasad: { mood: "default", text: "Built this so I could see inside the black box." },
};

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
  onNavigate?: (dir: 1 | -1) => void;
}

const typeColors: Record<string, string> = {
  "AI Dev Tool": "text-accent border-accent/20 bg-accent/10",
  "Production SaaS": "text-accent border-accent/20 bg-accent/10",
  "Developer Tool": "text-green-400 border-green-500/30 bg-green-500/10",
  "Developer Tool / CLI": "text-green-400 border-green-500/30 bg-green-500/10",
  "Cross-Platform": "text-purple-400 border-purple-500/30 bg-purple-500/10",
  "Multi-Agent": "text-pink-400 border-pink-500/30 bg-pink-500/10",
  "AI Agents": "text-pink-400 border-pink-500/30 bg-pink-500/10",
  "AI / ML": "text-accent border-accent/20 bg-accent/10",
  DevOps: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
};

/** Short explainer for common architecture node types. */
function describeNode(node: string): string {
  const head = node.toLowerCase();
  if (head.includes("git diff")) return "Reads the staged or working diff to scope the review to what changed.";
  if (head.includes("ast") || head.includes("parser")) return "Parses source into an AST-aware structure for accurate pattern matching.";
  if (head.includes("persistent index") || head.includes("repo map"))
    return "Builds a call graph, schema graph, and symbol tree stored locally for 60ms incremental updates.";
  if (head.includes("pattern scan")) return "Runs the full hand-crafted rule library in parallel; deterministic, fast, zero false-positive noise.";
  if (head.includes("taint")) return "Source-to-sink tracer for user input reaching dangerous sinks like SQL, exec, innerHTML.";
  if (head.includes("ai reasoning") || head.includes("llm"))
    return "LLM layer for deep cross-file reasoning. Runs only when patterns and index can't answer alone.";
  if (head.includes("risk score")) return "Weighted score across 8 PR risk factors: auth changes, schema mods, missing tests, and more.";
  if (head.includes("self-learning") || head.includes("feedback"))
    return "Tracks which findings developers act on vs dismiss, auto-suppresses noise over time.";
  if (head.includes("glean")) return "Pipeline that mines real PR reviews for new generalizable bug patterns and imports them.";
  if (head.includes("intent classif")) return "LLM classifies email intent (booking, question, invoice) before task extraction.";
  if (head.includes("entity extraction")) return "Extracts dates, names, amounts, and references from free-form email text.";
  if (head.includes("pgvector") || head.includes("enrichment"))
    return "Semantic search and historical context lookup via vector embeddings in Postgres.";
  if (head.includes("human review") || head.includes("human approval") || head.includes("approve"))
    return "The human-in-the-loop gate. AI proposes, a human approves before anything touches money or commitments.";
  if (head.includes("workflow engine")) return "Declarative JSON/YAML workflows. Non-engineers can add steps without touching code.";
  if (head.includes("execution") || head.includes("calendar, stripe")) return "Fires real integrations: calendar bookings, Stripe invoicing, CRM sync, webhooks.";
  if (head.includes("audit")) return "Full audit log per session with trajectory replay for debugging agent behavior.";
  if (head.includes("provider manager")) return "11 LLM providers behind one streaming interface. Auto-fallback on rate-limit or timeout.";
  if (head.includes("tool registry")) return "24+ tools: file, bash, grep, glob, web, memory, LSP, sub-agent, and more.";
  if (head.includes("smart router")) return "Auto-routes each prompt to the best available model by task type.";
  if (head.includes("search/replace")) return "Aider-exact edit blocks that modify specific lines without rewriting whole files.";
  if (head.includes("watch mode")) return "Triggers an agentic session the moment you save a file with an `// AI!` comment.";
  if (head.includes("lsp")) return "Language servers for TS, Python, Go, Rust. Agent can goto-def, find-refs, get diagnostics.";
  if (head.includes("agentic loop")) return "Streaming tool calls with stuck detection, auto-retry, and post-mutation verify.";
  if (head.includes("auto-lint") || head.includes("lint/test")) return "After every file edit, runs linters and tests. On failure, injects a repair prompt automatically.";
  if (head.includes("git layer") || head.includes("llm commit"))
    return "LLM-generated commit messages from staged diffs with attribution trailers.";
  if (head.includes("plugin")) return "CC-style tabbed UI: Discover / Installed / Marketplaces / Errors. Keyboard nav, Space to install.";
  if (head.includes("scheduler")) return "Cron / interval / daily@HH:MM triggers. Auto-starts at TUI launch.";
  if (head.includes("parallel agent")) return "Spawn N concurrent agent sessions with live output in split panes.";
  if (head.includes("branch") || head.includes("checkpoint")) return "Save/restore session state, fork at any turn in the conversation.";
  if (head.includes("context manager") || head.includes("lazy"))
    return "Intent-based lazy loading. A greeting uses 24 tokens of context instead of 3,909.";
  if (head.includes("session") || head.includes("wal")) return "Write-ahead log. Crash mid-task, resume by ID with zero lost work.";
  if (head.includes("ink") || head.includes("tui")) return "React Ink component model for streaming, inline diffs, 22 themes, command palette.";
  if (head.includes("fastapi")) return "Python async HTTP layer routing each request to its dedicated agent endpoint.";
  if (head.includes("pwa")) return "Installable web app with service worker, push notifications, offline support.";
  return "Core component in the system pipeline.";
}

export function ProjectModal({
  project,
  onClose,
  onNavigate,
}: ProjectModalProps): React.ReactElement {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [accessModalOpen, setAccessModalOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setSelectedNode(null);
      setAccessModalOpen(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [project?.slug]);

  useScrollLock(!!project);

  // Signal sidebar/topbar to hide when modal is open
  useEffect(() => {
    if (project) {
      document.body.setAttribute("data-modal-open", "true");
    } else {
      document.body.removeAttribute("data-modal-open");
    }
    return () => document.body.removeAttribute("data-modal-open");
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && onNavigate) onNavigate(1);
      if (e.key === "ArrowLeft" && onNavigate) onNavigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose, onNavigate]);

  const askAgentAboutProject = (): void => {
    if (!project) return;
    const query = `Walk me through ${project.title}: what problem it solves, the architecture, tradeoffs, and why it matters.`;
    onClose();
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("chat-with-query", { detail: query }));
    }, 220);
  };

  if (typeof document === "undefined") return <></>;

  return ReactDOM.createPortal(
    <>
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 overscroll-contain"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

          {/* Prev / Next chevrons (desktop) */}
          {onNavigate && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(-1);
                }}
                aria-label="Previous project"
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-card/80 border border-card-border hover:border-accent/40 hover:bg-card-hover transition-all items-center justify-center text-muted hover:text-foreground backdrop-blur-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(1);
                }}
                aria-label="Next project"
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-card/80 border border-card-border hover:border-accent/40 hover:bg-card-hover transition-all items-center justify-center text-muted hover:text-foreground backdrop-blur-sm"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Modal */}
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-card-border rounded-xl shadow-2xl shadow-accent/5 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-card/80 border border-card-border hover:border-accent/40 hover:bg-card-hover transition-all duration-200 flex items-center justify-center text-muted hover:text-foreground backdrop-blur-sm"
            >
              <X size={16} />
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto overscroll-contain flex-1 px-5 md:px-10 pt-6 md:pt-10 pb-24 md:pb-28">
              {/* Header: type + title + case-study framing */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`px-2.5 py-1 text-caption md:text-xs font-mono rounded border ${
                      typeColors[project.type] ?? "text-muted border-card-border bg-card-hover"
                    }`}
                  >
                    {project.type}
                  </span>
                  {project.live && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-caption md:text-xs font-mono rounded border border-green-500/30 bg-green-500/10 text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">
                  {project.title}
                </h2>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed border-l-2 border-accent pl-4 max-w-3xl">
                  {project.oneLiner ?? project.impact}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={askAgentAboutProject}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-accent/25 bg-accent/10 text-accent hover:bg-accent/15 hover:border-accent/40 transition-colors text-xs md:text-sm font-mono"
                  >
                    <MessageSquare size={14} />
                    Ask agent about this project
                  </button>
                  <span className="text-caption md:text-xs font-mono text-muted/50">
                    Opens with project context
                  </span>
                </div>

                {/* Agent emoji commentary */}
                {EMOJI_COMMENTARY[project.slug] && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="flex items-center gap-2.5 mt-5 px-3 py-2 rounded-lg bg-accent-status/5 border border-accent-status/10 w-fit"
                  >
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-card-border to-card border border-accent-status/20 flex items-center justify-center shrink-0">
                      <AgentEmoji size={14} mood={EMOJI_COMMENTARY[project.slug].mood} />
                    </span>
                    <span className="font-mono text-caption text-accent-status/70">
                      {EMOJI_COMMENTARY[project.slug].text}
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* Problem / Solution split */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="mt-8 md:mt-10 grid md:grid-cols-2 gap-5 md:gap-6"
              >
                <div>
                  <p className="text-caption md:text-xs font-mono text-accent/80 uppercase tracking-[0.2em] mb-2">
                    Problem
                  </p>
                  <p className="text-xs md:text-sm text-muted leading-relaxed line-clamp-[8]">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <p className="text-caption md:text-xs font-mono text-accent/80 uppercase tracking-[0.2em] mb-2">
                    Solution
                  </p>
                  <p className="text-xs md:text-sm text-muted leading-relaxed line-clamp-[8]">
                    {project.solution}
                  </p>
                </div>
              </motion.div>

              {/* Decision tree — interactive "test yourself" */}
              {project.decision && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.35 }}
                >
                  <DecisionTree decision={project.decision} />
                </motion.div>
              )}

              {/* Architecture flow — clickable */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className="mt-8 md:mt-10"
              >
                <p className="text-caption md:text-xs font-mono text-accent/80 uppercase tracking-[0.2em] mb-3">
                  System Architecture
                  <span className="text-muted/40 normal-case tracking-normal ml-2 hidden sm:inline">
                    click any node for detail
                  </span>
                </p>
                <div className="p-4 md:p-5 rounded-xl bg-background/50 border border-card-border">
                  <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                    {project.architecture.slice(0, 8).map((node, i) => {
                      const label = node.split(/[(\n]/)[0].trim().slice(0, 32);
                      const isSelected = selectedNode === node;
                      return (
                        <motion.div
                          key={node}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35 + i * 0.05, duration: 0.25 }}
                          className="flex items-center gap-1.5 md:gap-2"
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedNode(isSelected ? null : node)}
                            className={`px-2 md:px-2.5 py-1 md:py-1.5 text-caption md:text-small font-mono rounded whitespace-nowrap border transition-all ${
                              isSelected
                                ? "bg-accent text-white border-accent shadow-lg shadow-accent/30"
                                : "bg-accent/10 text-accent/80 border-accent/20 hover:bg-accent/20 hover:border-accent/40"
                            }`}
                          >
                            {label}
                          </button>
                          {i < Math.min(project.architecture.length, 8) - 1 && (
                            <span className="text-accent/40 text-xs">→</span>
                          )}
                        </motion.div>
                      );
                    })}
                    {project.architecture.length > 8 && (
                      <span className="text-caption font-mono text-muted/60 ml-2">
                        +{project.architecture.length - 8} more
                      </span>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {selectedNode && (
                      <motion.div
                        key={selectedNode}
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 border-t border-card-border/60 text-small md:text-xs text-muted leading-relaxed">
                          <span className="text-accent/80 font-mono">
                            {selectedNode.split(/[(\n]/)[0].trim()}
                          </span>
                          <span className="mx-2 text-muted/40">·</span>
                          <span>{describeNode(selectedNode)}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Mermaid architecture diagram */}
              {diagrams[project.slug] && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.35 }}
                >
                  <ArchitectureDiagram chart={diagrams[project.slug]} />
                </motion.div>
              )}

              {/* Before / After impact panel — any project with measuredImpact */}
              {project.measuredImpact && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.35 }}
                  className="mt-8 md:mt-10"
                >
                  <p className="text-caption md:text-xs font-mono text-accent/80 uppercase tracking-[0.2em] mb-3">
                    Measured Impact
                  </p>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <div className="p-4 md:p-5 rounded-xl bg-background/50 border border-card-border">
                      <p className="text-caption font-mono text-muted/60 uppercase tracking-[0.2em] mb-1.5">
                        before
                      </p>
                      <p className="text-3xl md:text-5xl font-bold text-muted font-mono leading-none">
                        {project.measuredImpact.before.value}
                        {project.measuredImpact.before.unit && (
                          <span className="text-muted/40 text-lg md:text-2xl">{project.measuredImpact.before.unit}</span>
                        )}
                      </p>
                      <p className="text-caption md:text-xs text-muted/80 mt-2">
                        {project.measuredImpact.before.context}
                      </p>
                    </div>
                    <div className="relative p-4 md:p-5 rounded-xl bg-gradient-to-br from-accent/10 via-background/50 to-background/50 border border-accent/20 overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                      <p className="text-caption font-mono text-accent uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                        after
                      </p>
                      <p className="text-3xl md:text-5xl font-bold text-accent font-mono leading-none">
                        {project.measuredImpact.after.value}
                        {project.measuredImpact.after.unit && (
                          <span className="text-accent/60 text-lg md:text-2xl">{project.measuredImpact.after.unit}</span>
                        )}
                      </p>
                      <p className="text-caption md:text-xs text-muted mt-2">
                        {project.measuredImpact.after.context}
                      </p>
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
                        <p
                          className={`text-base md:text-lg font-bold font-mono tabular-nums ${
                            i === project.measuredImpact!.highlights.length - 1 ? "text-accent" : "text-foreground/80"
                          }`}
                        >
                          {s.n}
                        </p>
                        <p className="text-caption text-muted/60 uppercase tracking-wider">
                          {s.l}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Key Results */}
              {project.results && project.results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.35 }}
                  className="mt-8 md:mt-10"
                >
                  <p className="text-caption md:text-xs font-mono text-accent/80 uppercase tracking-[0.2em] mb-3">
                    Key Results
                  </p>
                  <ul className="grid md:grid-cols-2 gap-2.5 md:gap-3">
                    {project.results.slice(0, 6).map((r, i) => (
                      <motion.li
                        key={r}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 + i * 0.04, duration: 0.25 }}
                        className="flex gap-2 text-xs md:text-sm text-muted leading-relaxed"
                      >
                        <span className="text-accent/80 shrink-0 mt-0.5">▸</span>
                        <span>{r}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* My approach vs standard */}
              {project.vs && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.35 }}
                  className="mt-8 md:mt-10"
                >
                  <p className="text-caption md:text-xs font-mono text-accent/80 uppercase tracking-[0.2em] mb-3">
                    Approach Comparison
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {/* My approach */}
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
                    {/* Standard approach */}
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
                </motion.div>
              )}

              {/* Tech decisions preview */}
              {project.techDecisions && project.techDecisions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.35 }}
                  className="mt-8 md:mt-10"
                >
                  <p className="text-caption md:text-xs font-mono text-accent/80 uppercase tracking-[0.2em] mb-3">
                    Key Technical Decisions
                  </p>
                  <ul className="space-y-2">
                    {project.techDecisions.slice(0, 3).map((d, i) => (
                      <motion.li
                        key={d.title}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 + i * 0.05, duration: 0.25 }}
                        className="flex gap-2 items-start text-xs md:text-sm"
                      >
                        <span className="text-accent/60 mt-0.5 shrink-0">◆</span>
                        <span className="text-foreground/80">{d.title}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Stack */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.35 }}
                className="mt-8 md:mt-10"
              >
                <p className="text-caption md:text-xs font-mono text-accent/80 uppercase tracking-[0.2em] mb-3">
                  Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-caption md:text-small font-mono bg-background/50 text-muted rounded border border-card-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sticky footer CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-card via-card to-card/90 border-t border-card-border backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-caption md:text-xs font-mono text-muted/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                  <span className="truncate hidden sm:inline">
                    {onNavigate ? "← → to browse projects" : "Full project details"}
                  </span>
                  <span className="truncate sm:hidden">Swipe cards or tap below</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.requestAccess && (
                    <button
                      type="button"
                      onClick={() => setAccessModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 md:px-4 py-2 text-xs md:text-sm border border-accent/30 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 hover:border-accent/50 transition-all duration-200"
                    >
                      <Lock size={14} />
                      Request Access
                    </button>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 md:px-4 py-2 text-xs md:text-sm border border-card-border rounded-lg hover:border-accent/40 hover:bg-card-hover transition-all duration-200 text-muted hover:text-foreground"
                    >
                      GitHub
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 md:px-4 py-2 text-xs md:text-sm border border-green-500/30 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 hover:border-green-500/50 transition-all duration-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Try live
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Access Request Modal — renders outside the main modal */}
    <AccessRequestModal
      open={accessModalOpen}
      onClose={() => setAccessModalOpen(false)}
    />
    </>,
    document.body,
  );
}
