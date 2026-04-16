"use client";

import { motion } from "framer-motion";

export type MockupKind = "codelens" | "gogaa" | "openevent";

/** Stylized product mockup. Brand-consistent, scalable, and never breaks
 *  like a raw screenshot would. Renders terminal/dashboard chrome plus
 *  representative output. */
export function ProjectMockup({
  kind,
  className = "",
}: {
  kind: MockupKind;
  className?: string;
}): React.ReactElement {
  return (
    <div
      className={`relative rounded-xl border border-card-border bg-card/70 backdrop-blur-sm shadow-2xl shadow-background/40 overflow-hidden ${className}`}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border bg-background/40">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <p className="text-[10px] font-mono text-muted/60 ml-2">
          {kind === "codelens" && "codelens review ."}
          {kind === "gogaa" && "gogaa · v0.9.1"}
          {kind === "openevent" && "app.openevent.io — inbox"}
        </p>
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 font-mono text-[11px] md:text-[12px] leading-relaxed min-h-[240px]">
        {kind === "codelens" && <CodeLensBody />}
        {kind === "gogaa" && <GogaaBody />}
        {kind === "openevent" && <OpenEventBody />}
      </div>
    </div>
  );
}

/* ---------------------------- CodeLens ------------------------------- */
/* Real output captured from: codelens review ./dashboard.tsx           */

function CodeLensBody(): React.ReactElement {
  const lines: { text: string; color: string; delay: number }[] = [
    { text: "❯ codelens review .", color: "text-accent", delay: 0 },
    { text: "Stack: typescript · Layers: components", color: "text-muted/60", delay: 0.15 },
    { text: "Patterns Checked: 123 · Review time: 113ms", color: "text-muted/60", delay: 0.3 },
    { text: "", color: "", delay: 0.4 },
    { text: "Verdict: REQUEST CHANGES", color: "text-amber-400", delay: 0.5 },
    { text: "2 critical · 4 warning · 2 info", color: "text-amber-300/80", delay: 0.6 },
  ];
  return (
    <div className="space-y-0.5">
      {lines.map((l, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.3, delay: l.delay }}
          className={l.color}
        >
          {l.text || "\u00A0"}
        </motion.p>
      ))}

      {/* Finding card — real CWE from actual run */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, delay: 0.75 }}
        className="mt-3 pl-2 border-l-2 border-red-500/60 text-[10px] md:text-[11px]"
      >
        <p className="text-red-300">
          dashboard.tsx:19 · HIGH{" "}
          <span className="text-muted/50 ml-1">[U14]</span>
        </p>
        <p className="text-muted/70">
          &lt;div dangerouslySetInnerHTML=&#123;...&#125; /&gt;
        </p>
        <p className="text-muted/50">CWE-79 · XSS · OWASP A05</p>
        <p className="text-muted/60 mt-1 italic">
          → Use DOMPurify.sanitize() before inserting HTML
        </p>
      </motion.div>

      {/* Risk score */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: 1.0 }}
        className="mt-4 pt-3 border-t border-card-border"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-muted/70 text-[10px]">PR Risk Score</span>
          <span className="text-amber-300 font-bold">5 / 10</span>
        </div>
        <div className="h-1.5 bg-background/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "50%" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-amber-500 to-red-500/80"
          />
        </div>
        <p className="text-[9px] text-muted/50 mt-2">
          critical findings +2 · warnings +1 · low test coverage +1.5
        </p>
      </motion.div>
    </div>
  );
}

/* ------------------------------ Gogaa -------------------------------- */
/* Real trace from ~/.gogaa/audit session c1ff8f3e — dev-env setup task */

function GogaaBody(): React.ReactElement {
  const steps = [
    { name: "glob", detail: "**/Dockerfile*", ms: 1426, delay: 0.15 },
    { name: "file-read", detail: "dev-env/docker-compose.yml", ms: 817, delay: 0.35 },
    { name: "file-read", detail: "dev-env/README.md", ms: 603, delay: 0.55 },
    { name: "bash", detail: "ls dev-env/configs/", ms: 422, delay: 0.75 },
    { name: "file-write", detail: "configs/.zshrc · 44 lines", ms: 938, delay: 0.95 },
  ];
  return (
    <div className="space-y-0.5">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.3 }}
        className="text-foreground/90"
      >
        <span className="text-accent">❯</span> set up my dev container configs
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="text-muted/70 pl-4"
      >
        model: claude-sonnet-4 · intent: code_task
      </motion.p>

      <div className="mt-3 space-y-1">
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1;
          return (
            <motion.div
              key={s.name + i}
              initial={{ opacity: 0, x: -4 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.3, delay: s.delay }}
              className="flex items-baseline gap-2"
            >
              <span className="text-muted/40">{isLast ? "└─" : "├─"}</span>
              <span className="text-foreground/80">{s.name}</span>
              <span className="text-muted/50 text-[10px] flex-1 truncate">
                {s.detail}
              </span>
              <span className="text-green-400">✓</span>
              <span className="text-muted/40 text-[9px] tabular-nums">
                {s.ms}ms
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: 1.15 }}
        className="mt-4 pt-3 border-t border-card-border flex items-center justify-between text-[10px]"
      >
        <span className="text-muted/60">77,482 tokens · 72.9s session</span>
        <span className="text-muted/60">
          cost <span className="text-accent/80">$0.305</span>
        </span>
      </motion.div>
    </div>
  );
}

/* ---------------------------- OpenEvent ------------------------------ */

function OpenEventBody(): React.ReactElement {
  return (
    <div className="space-y-2">
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex items-center justify-between text-[10px]"
      >
        <span className="text-muted/70">▾ Inbox</span>
        <span className="text-accent/80 font-mono">14 new</span>
      </motion.div>

      {/* Thread preview */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="rounded-lg border border-card-border bg-background/40 p-3"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-foreground/90 text-[11px] font-sans">
            Maria — Coffee meeting next week?
          </span>
          <span className="text-[9px] text-muted/50">2m ago</span>
        </div>
        <p className="text-[10px] text-muted/70 font-sans truncate">
          Hi, wondering if we could meet sometime next week for coffee...
        </p>

        {/* AI classification row */}
        <div className="mt-2 pt-2 border-t border-card-border flex items-center gap-2 text-[9px]">
          <span className="px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
            booking_request
          </span>
          <span className="text-muted/60">confidence 94%</span>
        </div>
      </motion.div>

      {/* AI proposal */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, delay: 0.5 }}
        className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3"
      >
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <p className="text-[9px] uppercase tracking-widest text-amber-400">
            ai proposal · awaiting approval
          </p>
        </div>
        <p className="text-[11px] text-foreground/90 font-sans leading-relaxed mb-3">
          Book <span className="text-accent">Tue, Apr 22 · 10:00 AM</span>{" "}
          — 1 hour coffee at usual spot. Send confirmation to Maria.
        </p>
        <div className="flex items-center gap-2">
          <span className="flex-1 text-center text-[10px] py-1.5 rounded bg-green-500/15 text-green-400 border border-green-500/30">
            approve
          </span>
          <span className="text-center text-[10px] py-1.5 px-3 rounded border border-card-border text-muted">
            edit
          </span>
          <span className="text-center text-[10px] py-1.5 px-3 rounded border border-card-border text-muted">
            skip
          </span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="text-[9px] text-muted/50 text-center pt-1"
      >
        100+ clients · 150+ events · 1.5 hrs saved / day / team
      </motion.p>
    </div>
  );
}
