"use client";

import { motion } from "framer-motion";
import { FadeUp } from "@/components/motion";

/* ------------------------------------------------------------------ */
/*  Code card                                                         */
/* ------------------------------------------------------------------ */

function CodeCard({
  filename,
  children,
  delay = 0,
}: {
  filename: string;
  children: React.ReactNode;
  delay?: number;
}): React.ReactElement {
  return (
    <FadeUp delay={delay}>
      <div className="card-glow rounded-xl border border-card-border bg-card/80 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-card-border bg-card/50">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="ml-2 text-[11px] font-mono text-muted/60">{filename}</span>
        </div>
        <div className="p-5 md:p-6">{children}</div>
      </div>
    </FadeUp>
  );
}

/* ------------------------------------------------------------------ */
/*  Config line                                                       */
/* ------------------------------------------------------------------ */

function Line({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}): React.ReactElement {
  return (
    <div className="flex gap-2 font-mono text-[12px] md:text-[13px] leading-[1.8]">
      <span className="text-foreground/70 shrink-0">{label}</span>
      <span className="text-muted/40">:</span>
      <span className={accent ? "text-accent" : "text-accent-secondary/80"}>{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat strip for tool cards                                         */
/* ------------------------------------------------------------------ */

function StatStrip({ stats }: { stats: { label: string; value: string }[] }): React.ReactElement {
  return (
    <div className="flex gap-4 mt-2">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-1.5 text-[10px] font-mono">
          <span className="text-foreground/80 font-semibold">{s.value}</span>
          <span className="text-muted/40">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ecosystem loop — animated circular diagram                        */
/* ------------------------------------------------------------------ */

const loopNodes = [
  { label: "Gogaa CLI", stat: "writes code", color: "border-accent/40 text-accent" },
  { label: "CodeLens", stat: "reviews it", color: "border-accent-secondary/40 text-accent-secondary" },
  { label: "Patterns", stat: "feed back in", color: "border-accent-status/40 text-accent-status" },
  { label: "Rasad", stat: "monitors all", color: "border-accent/40 text-accent" },
];

function EcosystemLoop(): React.ReactElement {
  return (
    <FadeUp delay={0.1}>
      <div className="rounded-xl border border-accent/20 bg-gradient-to-br from-card via-card to-accent/[0.03] p-6 md:p-8 mb-8">
        <p className="text-[10px] font-mono text-accent uppercase tracking-[0.2em] mb-4">
          The loop nobody else has
        </p>
        <p className="text-sm md:text-base text-foreground font-medium mb-2">
          I don&apos;t just use AI tools. I built an ecosystem where each tool makes the others better.
        </p>
        <p className="text-xs md:text-sm text-muted mb-8 leading-relaxed max-w-2xl">
          Gogaa writes the code. CodeLens reviews it and catches bugs. Those patterns
          feed back into Gogaa&apos;s context via Guardian mode, so the same bug is never generated twice.
          Rasad monitors every session, tracking cost, quality, and drift.
          The whole system improves with every project.
        </p>

        {/* Circular diagram */}
        <div className="relative flex items-center justify-center py-6">
          {/* Connecting ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full border border-dashed border-accent/15"
          />
          {/* Animated pulse ring */}
          <motion.div
            className="absolute w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full border border-accent/10"
            animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Center label */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="absolute text-center"
          >
            <p className="text-[9px] font-mono text-muted/40 uppercase tracking-widest">self</p>
            <p className="text-[9px] font-mono text-muted/40 uppercase tracking-widest">improving</p>
          </motion.div>

          {/* Nodes positioned around the circle */}
          <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px]">
            {loopNodes.map((node, i) => {
              // Position: top, right, bottom, left
              const positions = [
                "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
                "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
                "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
                "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
              ];
              // Arrow positions between nodes
              const arrowPositions = [
                "top-[15%] right-[10%]",
                "bottom-[15%] right-[10%]",
                "bottom-[15%] left-[10%]",
                "top-[15%] left-[10%]",
              ];
              const arrowChars = ["\u2198", "\u2199", "\u2196", "\u2197"]; // ↘ ↙ ↖ ↗

              return (
                <div key={node.label}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 300, damping: 20 }}
                    className={`absolute ${positions[i]} z-10 px-4 py-2.5 rounded-xl border bg-card shadow-lg shadow-background/50 text-center min-w-[100px]`}
                    style={{ borderColor: `var(--${node.color.includes('secondary') ? 'accent-secondary' : node.color.includes('status') ? 'accent-status' : 'accent'})` }}
                  >
                    <p className={`text-xs font-bold ${node.color.split(' ')[1]}`}>{node.label}</p>
                    <p className="text-[9px] text-muted/60 mt-0.5">{node.stat}</p>
                  </motion.div>
                  {/* Arrow */}
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.25 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                    className={`absolute ${arrowPositions[i]} text-accent/40 text-sm`}
                  >
                    {arrowChars[i]}
                  </motion.span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day-in-my-life timeline */}
        <div className="mt-6 pt-5 border-t border-card-border/30">
          <p className="text-[9px] font-mono text-muted/40 uppercase tracking-widest mb-3">
            What this looks like in practice
          </p>
          <div className="flex flex-wrap items-center gap-1.5 md:gap-0">
            {[
              { time: "9:00", action: "Gogaa scaffolds feature", color: "text-accent" },
              { time: "9:04", action: "CodeLens auto-reviews", color: "text-accent-secondary" },
              { time: "9:05", action: "2 patterns caught, fixed", color: "text-accent-status" },
              { time: "9:06", action: "commit + push", color: "text-foreground/70" },
              { time: "9:07", action: "Rasad logs session", color: "text-accent" },
              { time: "9:08", action: "patterns updated", color: "text-accent-status" },
            ].map((step, i, arr) => (
              <div key={step.time} className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/40 border border-card-border/50">
                  <span className="text-[9px] font-mono text-muted/50 tabular-nums">{step.time}</span>
                  <span className={`text-[10px] font-mono ${step.color}`}>{step.action}</span>
                </div>
                {i < arr.length - 1 && (
                  <span className="text-muted/20 text-[10px] mx-0.5">&rarr;</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                         */
/* ------------------------------------------------------------------ */

export function Uses(): React.ReactElement {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <a href="/" className="font-mono text-sm">
          <span className="text-accent">&gt;</span>{" "}
          <span className="font-semibold">ahtesham</span>
          <span className="text-muted/50">.dev</span>
        </a>
        <div className="flex gap-2">
          <a
            href="/"
            className="px-3 py-1.5 text-xs font-mono text-muted hover:text-foreground transition-colors rounded-lg border border-card-border bg-card/50"
          >
            &larr; Back
          </a>
          <a
            href="/journey"
            className="px-3 py-1.5 text-xs font-mono text-accent hover:text-accent/80 transition-colors rounded-lg border border-accent/30 bg-accent/10"
          >
            How I work
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-6 py-12 md:py-20">
        {/* Header */}
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            $ cat ~/setup.config.ts
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            What I use to build.
          </h1>
          <p className="text-base md:text-lg text-muted mb-6 max-w-2xl leading-relaxed">
            Not just a list of tools. This is a system where every piece
            was chosen because it makes the others better. Most of the AI
            tooling here I built myself because nothing else did what I needed.
          </p>
        </FadeUp>

        {/* The ecosystem loop */}
        <EcosystemLoop />

        {/* Cards */}
        <div className="space-y-5">

          {/* AI Tooling — with stat strips */}
          <CodeCard filename="ai-tooling.ts" delay={0.05}>
            <p className="text-[10px] font-mono text-accent uppercase tracking-[0.15em] mb-4">
              AI tooling — all built by me
            </p>
            <div className="space-y-5">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">Gogaa CLI</span>
                  <span className="text-[9px] font-mono text-accent/60 px-1.5 py-0.5 rounded border border-accent/15">primary agent</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  My coding agent. 11 providers with auto-fallback, so I never stop working when one API goes down.
                  SEARCH/REPLACE edits, repo map, watch mode. I use it daily alongside Claude Code
                  and switch based on the task.
                </p>
                <StatStrip stats={[
                  { value: "1,418", label: "tests" },
                  { value: "11", label: "providers" },
                  { value: "22", label: "themes" },
                  { value: "95%", label: "tool success" },
                ]} />
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">CodeLens</span>
                  <span className="text-[9px] font-mono text-accent-secondary/60 px-1.5 py-0.5 rounded border border-accent-secondary/15">review engine</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Runs before every commit. Guardian mode injects patterns into
                  Claude Code and Gogaa so bugs are prevented at generation time, not caught after. The pattern library
                  grows from every project I review.
                </p>
                <StatStrip stats={[
                  { value: "~430", label: "patterns" },
                  { value: "<1s", label: "reviews" },
                  { value: "9", label: "stacks" },
                  { value: "351KB", label: "single file" },
                ]} />
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">Rasad</span>
                  <span className="text-[9px] font-mono text-accent-status/60 px-1.5 py-0.5 rounded border border-accent-status/15">observatory</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Monitors every AI coding session across Claude Code, Gogaa, and Codex.
                  I know exactly what each session cost, how efficient it was, and where
                  context was wasted. X-Ray replay, quality grading, drift detection. 100% local.
                </p>
                <StatStrip stats={[
                  { value: "656", label: "sessions" },
                  { value: "38K", label: "messages" },
                  { value: "14K", label: "tool calls" },
                  { value: "6.2s", label: "first sync" },
                ]} />
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">Claude Code</span>
                  <span className="text-[9px] font-mono text-muted/40 px-1.5 py-0.5 rounded border border-card-border">daily driver</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  46 custom enhancements. Skills, hooks, path-scoped rules, auto-pilot intent routing, project-level
                  memory. My CC setup is a reference implementation for context engineering — I wrote the WISC
                  framework based on optimizing it.
                </p>
                <StatStrip stats={[
                  { value: "46", label: "enhancements" },
                  { value: "84%", label: "context reduction" },
                  { value: "44", label: "skills" },
                  { value: "5", label: "agents" },
                ]} />
              </div>
            </div>
          </CodeCard>

          {/* WISC Framework */}
          <CodeCard filename="wisc-framework.ts" delay={0.1}>
            <p className="text-[10px] font-mono text-accent uppercase tracking-[0.15em] mb-4">
              WISC — context engineering framework
            </p>
            <p className="text-xs text-muted leading-relaxed mb-5">
              A methodology I developed for managing AI agent context. The problem: a well-configured
              Claude Code setup with 5 agents, 10 commands, 23 plugins, and 7 rules burns 35-40K tokens
              before you type a single prompt. WISC cuts that to what you actually need per turn.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { letter: "W", word: "Write", desc: "Persist decisions to files (CLAUDE.md, memory), not conversation. Every session starts informed." },
                { letter: "I", word: "Isolate", desc: "One task per conversation. Subagents for research. Worktrees for parallel branches. Never cross-contaminate." },
                { letter: "S", word: "Select", desc: "Path-scoped rules only load when matching files are opened. Skills load body on invoke, not startup." },
                { letter: "C", word: "Compress", desc: "Agent definitions stripped from 58KB to 5KB. Commands converted to lazy-loaded skills. Rules trimmed to essentials." },
              ].map((item) => (
                <div key={item.letter} className="p-3 rounded-lg border border-card-border bg-background/30">
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="text-lg font-bold text-accent font-mono">{item.letter}</span>
                    <span className="text-xs font-semibold text-foreground">{item.word}</span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-card-border/50 flex items-center gap-3 text-[11px] font-mono">
              <span className="text-muted/50">result:</span>
              <span className="text-accent-status">72KB &rarr; 11.7KB</span>
              <span className="text-muted/30">&middot;</span>
              <span className="text-muted/50">84% reduction, zero capability loss</span>
            </div>
          </CodeCard>

          {/* Stack */}
          <CodeCard filename="stack.ts" delay={0.15}>
            <p className="text-[10px] font-mono text-accent uppercase tracking-[0.15em] mb-4">
              Stack — every choice has a reason
            </p>
            <div className="space-y-0.5">
              <Line label="TypeScript" value="types prevent prod bugs. no any, ever" />
              <Line label="React 19" value="component model, not jQuery. Server components where it matters" />
              <Line label="Next.js 16" value="app router, static export for Cloudflare Pages" />
              <Line label="Supabase" value="pgvector + RLS + Edge Functions + Auth in one platform" />
              <Line label="Tailwind v4" value="utility CSS, no naming debt, design tokens via CSS vars" />
              <Line label="Framer Motion" value="production animations without fighting CSS transitions" />
              <Line label="Docker" value="identical env on Mac, Linux VPS, and phone-based SSH dev" />
              <Line label="Stripe" value="billing, Connect, webhooks — battle-tested payment infra" />
              <Line label="GitHub Actions" value="CI/CD, auto-publish Docker images, deploy on push" />
            </div>
          </CodeCard>

          {/* Workflow */}
          <CodeCard filename="workflow.ts" delay={0.2}>
            <p className="text-[10px] font-mono text-accent uppercase tracking-[0.15em] mb-4">
              How every feature ships
            </p>
            <div className="space-y-2">
              {[
                { n: "01", label: "Product", desc: "Pin the outcome. What does the user see when this works?" },
                { n: "02", label: "Architect", desc: "Sketch the data flow. Decide what talks to what before writing a line." },
                { n: "03", label: "Spec", desc: "Schema, RLS policies, edge cases, error states. The boring stuff that prevents 3 AM debugging." },
                { n: "04", label: "Scaffold", desc: "AI agent generates from the spec. Gogaa or Claude Code, depending on complexity." },
                { n: "05", label: "Review", desc: "CodeLens runs ~430 patterns. Taint tracking catches what grep can't. Fix before commit." },
                { n: "06", label: "Ship", desc: "Feature flag, 10% rollout, then 100%. Rasad monitors the session that built it." },
              ].map((step) => (
                <div key={step.n} className="flex gap-3 items-start">
                  <span className="text-[10px] font-mono text-accent/60 tabular-nums pt-0.5 shrink-0">{step.n}</span>
                  <div>
                    <span className="text-xs font-semibold text-foreground">{step.label}</span>
                    <span className="text-xs text-muted"> — {step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </CodeCard>

          {/* Hardware & Environment */}
          <CodeCard filename="environment.ts" delay={0.25}>
            <p className="text-[10px] font-mono text-accent uppercase tracking-[0.15em] mb-4">
              Hardware &amp; environment
            </p>
            <div className="space-y-0.5 mb-5">
              <Line label="machine" value="MacBook Pro M-series, 16GB" />
              <Line label="server" value="Ubuntu VPS — Docker + Traefik + Gitea + private registry" />
              <Line label="mobile dev" value="Phone → Mac via Tailscale + SSH + tmux. Full dev from anywhere" />
              <Line label="container" value="Docker dev env: Node 24, Python, Deno, Playwright, 10+ CLIs" />
              <Line label="onboarding" value="clone → setup.sh → start.sh. Zero to productive in 10 minutes" />
            </div>
            <p className="text-[10px] font-mono text-accent uppercase tracking-[0.15em] mb-4">
              Terminal
            </p>
            <div className="space-y-0.5">
              <Line label="shell" value="zsh + oh-my-zsh + Powerlevel10k + autosuggestions" />
              <Line label="fonts" value="JetBrains Mono (code), Inter (UI), Space Grotesk (headings)" />
              <Line label="git" value="dual identity — personal (shami-ah) + client (fsoell)" />
              <Line label="editor" value="VS Code + Claude Code. Cursor for second opinions" />
            </div>
          </CodeCard>

          {/* Philosophy — styled as git log */}
          <CodeCard filename="git log --oneline --philosophy" delay={0.3}>
            <p className="text-[10px] font-mono text-accent uppercase tracking-[0.15em] mb-4">
              Principles
            </p>
            <div className="space-y-2.5">
              {[
                { hash: "f4a9c2d", msg: "ship it, then improve it", body: "Perfection is the enemy of production. Get it live, measure, iterate." },
                { hash: "b1e7a3f", msg: "architect first, code second", body: "30 minutes with a whiteboard saves 30 hours of refactoring." },
                { hash: "a0d1e9c", msg: "if the tool doesn't exist, build it", body: "CodeLens, Gogaa, Rasad — each started because nothing else closed the gap." },
                { hash: "c3f8b21", msg: "no any in TypeScript, ever", body: "any is a lie you tell the compiler. It always comes back as a runtime error." },
                { hash: "e7d4a90", msg: "AI with human gates, not full automation", body: "The first time AI misreads 'sometime next week' and books the wrong slot, you lose the client." },
              ].map((c) => (
                <div key={c.hash} className="font-mono text-[12px] md:text-[13px]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-accent-secondary">{c.hash}</span>
                    <span className="text-foreground">{c.msg}</span>
                  </div>
                  <p className="text-[11px] text-muted/50 pl-[4.5rem] leading-relaxed">{c.body}</p>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-muted/30">
                <span className="w-2 h-2 rounded-full bg-muted/20" />
                Initial Commit — 2019
              </div>
            </div>
          </CodeCard>
        </div>

        {/* Bottom CTA */}
        <FadeUp delay={0.35}>
          <div className="mt-12 md:mt-16 pt-8 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted">
              This setup ships 250+ projects. Want it working on yours?
            </p>
            <a
              href="https://ahtesham.dev.wadwarehouse.com/book"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-background font-medium hover:brightness-110 hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 text-sm shrink-0"
            >
              Book a 15-min call
            </a>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
