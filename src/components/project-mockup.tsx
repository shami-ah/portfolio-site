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

function CodeLensBody(): React.ReactElement {
  const lines: { text: string; color: string; delay: number }[] = [
    { text: "❯ codelens review .", color: "text-accent", delay: 0 },
    { text: "✓ 305 patterns loaded · 9 stacks", color: "text-green-400", delay: 0.15 },
    { text: "✓ Persistent index ready · 60ms incremental", color: "text-green-400", delay: 0.3 },
    { text: "✓ Cross-file tracing complete", color: "text-green-400", delay: 0.45 },
    { text: "", color: "", delay: 0.55 },
    { text: "⚠  3 findings across 2 files", color: "text-amber-400", delay: 0.65 },
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

      {/* Finding card */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, delay: 0.85 }}
        className="mt-3 pl-2 border-l-2 border-amber-500/60 text-[10px] md:text-[11px]"
      >
        <p className="text-amber-300">auth.ts:47 · HIGH</p>
        <p className="text-muted/70">source: req.body.email</p>
        <p className="text-muted/70">→ sink: db.raw(&quot;SELECT...&quot;)</p>
        <p className="text-muted/50">CWE-89 · SQL injection via taint flow</p>
      </motion.div>

      {/* Risk score */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: 1.1 }}
        className="mt-4 pt-3 border-t border-card-border"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-muted/70 text-[10px]">PR Risk Score</span>
          <span className="text-amber-300 font-bold">7.2 / 10</span>
        </div>
        <div className="h-1.5 bg-background/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "72%" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.2, delay: 1.3, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-amber-500 to-red-500/80"
          />
        </div>
        <p className="text-[9px] text-muted/50 mt-2">
          auth changes · schema mods · missing tests
        </p>
      </motion.div>
    </div>
  );
}

/* ------------------------------ Gogaa -------------------------------- */

function GogaaBody(): React.ReactElement {
  const steps = [
    { name: "read_file", detail: "src/auth/middleware.ts", ms: 127, delay: 0.15 },
    { name: "grep", detail: '"jwt" in src/', ms: 42, delay: 0.35 },
    { name: "llm_plan", detail: "sonnet-4.6 · 412 tok", ms: 2100, delay: 0.55 },
    { name: "search_replace", detail: "middleware.ts · 2 blocks", ms: 31, delay: 0.8 },
    { name: "auto_verify", detail: "lint + tests · 187 passed", ms: 4320, delay: 1.0 },
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
        <span className="text-accent">❯</span> add jwt refresh-token rotation
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="text-muted/70 pl-4"
      >
        intent: code_task · conf 0.94
      </motion.p>

      <div className="mt-3 space-y-1">
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1;
          return (
            <motion.div
              key={s.name}
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
        transition={{ duration: 0.4, delay: 1.2 }}
        className="mt-4 pt-3 border-t border-card-border flex items-center justify-between text-[10px]"
      >
        <span className="text-muted/60">11 providers · auto-fallback</span>
        <span className="text-muted/60">
          cost <span className="text-accent/80">$0.021</span>
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
