"use client";

import { motion } from "framer-motion";

export type MockupKind = "codelens" | "gogaa" | "openevent" | "rasad";

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
          {kind === "gogaa" && "gogaa · v1.0.0"}
          {kind === "openevent" && "app.openevent.io — inbox"}
          {kind === "rasad" && "rasad dashboard · localhost:9847"}
        </p>
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 font-mono text-[11px] md:text-[12px] leading-relaxed min-h-[240px]">
        {kind === "codelens" && <CodeLensBody />}
        {kind === "gogaa" && <GogaaBody />}
        {kind === "openevent" && <OpenEventBody />}
        {kind === "rasad" && <RasadBody />}
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
/* Real welcome banner rendered by Banner.tsx in ~/gogaa-ts/src/ui       */

function GogaaBody(): React.ReactElement {
  return (
    <div className="space-y-0">
      {/* Block-art logo + title row */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="flex gap-3 items-start"
      >
        {/* 3-row Unicode block logo — copied exactly from gogaa source */}
        <pre className="text-white font-mono leading-[1.1] text-[14px] md:text-[16px] select-none">
{` ▐▛███▜▌
▝▜█████▛▘
  ▘▘ ▝▝`}
        </pre>

        <div className="flex flex-col pt-0.5">
          <p className="text-foreground">
            <span className="font-bold">Gogaa</span>{" "}
            <span className="text-muted/60">v0.10.0</span>
          </p>
          <p className="text-muted/60">claude-sonnet-4 · Anthropic</p>
          <p className="text-muted/60">~/gogaa-ts (main)</p>
        </div>
      </motion.div>

      {/* Identity + tagline block */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-4 pl-1"
      >
        <p className="text-muted/60">
          Message from shami&apos;s workspace:
        </p>
        <p className="text-foreground">
          Engr Ahtesham{" "}
          <span className="text-muted/60">
            — Build fast · ship clean · automate all
          </span>
        </p>
      </motion.div>

      {/* Prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.3, delay: 0.45 }}
        className="mt-5 pt-3 border-t border-card-border flex items-center gap-2"
      >
        <span className="text-accent">❯</span>
        <span className="text-muted/40">Type a message or press ? for help</span>
        <span className="inline-block w-[7px] h-[14px] bg-accent/80 ml-0.5 translate-y-[2px] animate-pulse" />
      </motion.div>

      {/* Status footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-3 flex items-center justify-between text-[9px]"
      >
        <span className="text-muted/50">11 providers · auto-fallback</span>
        <span className="text-green-400/70 inline-flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
          1,418 tests passing
        </span>
      </motion.div>
    </div>
  );
}

/* ---------------------------- OpenEvent ------------------------------ */
/* Rebuilt from real UI screenshots of app.openevent.io — inbox + AI    */
/* actions on an email thread (Created Site Visit, Updated Calendar,    */
/* Updated CRM, Created event LEAD).                                    */

function OpenEventBody(): React.ReactElement {
  return (
    <div className="font-sans">
      {/* Inbox header */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex items-center justify-between text-[10px] mb-3 pb-2 border-b border-card-border"
      >
        <span className="text-foreground/80 font-semibold text-[11px]">
          Event Requests
        </span>
        <span className="text-accent/80 text-[10px]">5 threads</span>
      </motion.div>

      {/* Top thread */}
      <motion.div
        initial={{ opacity: 0, x: -4 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="flex items-start gap-2.5 py-2 px-2 rounded bg-accent/5 border-l-2 border-accent mb-3"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent/80 to-purple-500/80 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
          SJ
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold text-foreground truncate">
              Sarah Johnson
            </p>
            <p className="text-[9px] text-muted/50 shrink-0">11:42 AM</p>
          </div>
          <p className="text-[10px] text-muted truncate">
            Corporate Conference · 150 Guests · March 15
          </p>
        </div>
      </motion.div>

      {/* AI actions — the yellow/amber action chain from the real UI */}
      <div className="space-y-1.5">
        {[
          { text: "Created a Site Visit", detail: "Mar 1, 14:00", delay: 0.4 },
          { text: "Updated Event on Calendar", detail: "Main Hall · 9:00", delay: 0.55 },
          { text: "Updated CRM", detail: "added billing address", delay: 0.7 },
          { text: "Created event “LEAD” on calendar", detail: "TechCorp Inc.", delay: 0.85 },
        ].map((a) => (
          <motion.div
            key={a.text}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: a.delay, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 rounded-md bg-amber-500/15 border border-amber-500/25 px-2.5 py-1.5"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-400 shrink-0"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-[10.5px] text-foreground/95 font-medium flex-1 truncate">
              {a.text}
            </p>
            <span className="text-[9px] text-muted/60 truncate max-w-[40%]">
              {a.detail}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Side insight card */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: 1.0 }}
        className="mt-3 p-2.5 rounded-md border border-red-500/30 bg-red-500/[0.06]"
      >
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-1 h-1 rounded-full bg-red-400" />
          <p className="text-[9px] uppercase tracking-widest text-red-300 font-semibold">
            date conflict detected
          </p>
        </div>
        <p className="text-[10px] text-muted/80">
          Conflicts with <span className="text-foreground">Chen Wedding</span>{" "}
          (CHF 25,000)
        </p>
        <div className="flex gap-1.5 mt-2">
          <span className="flex-1 text-center text-[9px] py-1 rounded bg-accent/15 text-accent border border-accent/30">
            Accept New
          </span>
          <span className="flex-1 text-center text-[9px] py-1 rounded border border-card-border text-muted">
            Keep Existing
          </span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: 1.2 }}
        className="text-[9px] text-muted/50 text-center pt-2 mt-2 border-t border-card-border"
      >
        100+ clients · 150+ events · every AI action needs human approval
      </motion.p>
    </div>
  );
}

/* ------------------------------ Rasad --------------------------------- */
/* Rebuilt from real Rasad dashboard — cockpit stats, session health,     */
/* X-Ray action breakdown, and quality grading.                           */

function RasadBody(): React.ReactElement {
  return (
    <div className="font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex items-center justify-between mb-3 pb-2 border-b border-card-border"
      >
        <div className="flex items-center gap-2">
          <span className="text-foreground/80 font-semibold text-[11px]">
            Daily AI Control
          </span>
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            local-first
          </span>
        </div>
        <span className="text-muted/50 text-[9px]">localhost:9847</span>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="grid grid-cols-4 gap-2 mb-3"
      >
        {[
          { label: "Today", value: "345", color: "text-emerald-400" },
          { label: "Spend", value: "$877", color: "text-amber-400" },
          { label: "Avg/Day", value: "$564", color: "text-cyan-400" },
          { label: "Actions", value: "14.6K", color: "text-accent" },
        ].map((s) => (
          <div
            key={s.label}
            className="p-1.5 rounded bg-background/40 border border-card-border"
          >
            <p className="text-[8px] text-muted/50 uppercase">{s.label}</p>
            <p className={`text-[12px] font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* X-Ray session card */}
      <motion.div
        initial={{ opacity: 0, x: -4 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, delay: 0.4 }}
        className="p-2.5 rounded-md border border-accent/20 bg-accent/5 mb-3"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-foreground">X-Ray</span>
            <span className="text-[8px] px-1 py-0.5 rounded bg-accent/15 text-accent border border-accent/25">
              Claude Code
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
              100% clean
            </span>
            <span className="text-[8px] text-muted/50">1h 28m</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-center">
          {[
            { label: "Actions", value: "202", color: "text-foreground" },
            { label: "Write/Edit", value: "135", color: "text-emerald-400" },
            { label: "Files", value: "25", color: "text-cyan-400" },
          ].map((m) => (
            <div
              key={m.label}
              className="py-1 rounded bg-background/30 border border-card-border"
            >
              <p className={`text-[11px] font-bold ${m.color}`}>{m.value}</p>
              <p className="text-[7px] text-muted/50">{m.label}</p>
            </div>
          ))}
        </div>
        {/* Session health blocks */}
        <div className="flex gap-[2px] mt-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.15, delay: 0.5 + i * 0.03 }}
              className="flex-1 h-2.5 rounded-[2px] bg-emerald-500/60"
            />
          ))}
        </div>
      </motion.div>

      {/* Quality grade */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, delay: 0.7 }}
        className="flex items-center justify-between p-2 rounded-md border border-card-border bg-background/30"
      >
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[12px] font-bold text-emerald-400">
            A
          </span>
          <div>
            <p className="text-[10px] font-medium text-foreground">Session Quality</p>
            <p className="text-[8px] text-muted/50">82 avg · 200 scored</p>
          </div>
        </div>
        <div className="flex gap-1">
          {["A", "B", "C", "D"].map((g) => (
            <span
              key={g}
              className={`text-[8px] px-1 py-0.5 rounded ${
                g === "A"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-background/40 text-muted/40"
              }`}
            >
              {g}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: 0.9 }}
        className="text-[9px] text-muted/50 text-center pt-2 mt-2 border-t border-card-border"
      >
        656 sessions · 38K messages · your data never leaves your machine
      </motion.p>
    </div>
  );
}
