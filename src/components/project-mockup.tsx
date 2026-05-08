"use client";

import { motion } from "framer-motion";
import { Check, GitPullRequest, MessageSquare, Shield, AlertTriangle } from "lucide-react";

export type MockupKind = "codelens" | "gogaa" | "openevent" | "rasad";

/* ------------------------------------------------------------------ */
/*  Shared chrome helpers                                              */
/* ------------------------------------------------------------------ */

function TerminalChrome({ title }: { title: string }): React.ReactElement {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border bg-background/40">
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
      </div>
      <p className="text-caption font-mono text-muted/60 ml-2">{title}</p>
    </div>
  );
}

function BrowserChrome({ url, favicon }: { url: string; favicon?: string }): React.ReactElement {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border bg-background/40">
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
      </div>
      <div className="flex-1 mx-2 px-3 py-1 rounded-md bg-background/60 border border-card-border/60 flex items-center gap-2">
        <span className="text-green-400/60 text-caption">🔒</span>
        {favicon && <span className="text-caption">{favicon}</span>}
        <span className="text-caption font-mono text-muted/80 truncate">{url}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export function ProjectMockup({
  kind,
  className = "",
}: {
  kind: MockupKind;
  className?: string;
}): React.ReactElement {
  return (
    <div
      className={`relative rounded-xl border border-card-border bg-card/60 backdrop-blur-sm shadow-2xl shadow-background/40 overflow-hidden ${className}`}
    >
      {kind === "codelens" && <CodeLensBody />}
      {kind === "gogaa" && <GogaaBody />}
      {kind === "openevent" && <OpenEventBody />}
      {kind === "rasad" && <RasadBody />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CodeLens — GitHub PR review style                                  */
/* ------------------------------------------------------------------ */

function CodeLensBody(): React.ReactElement {
  return (
    <>
      <BrowserChrome url="github.com/acme/dashboard/pull/142" favicon="🐙" />
      <div className="p-4 md:p-5 font-sans text-small leading-relaxed min-h-[240px]">
        {/* PR header */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-2 mb-3 pb-2.5 border-b border-card-border"
        >
          <GitPullRequest size={14} className="text-green-400" />
          <span className="font-semibold text-foreground text-small">feat: add payment dashboard</span>
          <span className="text-caption text-muted/50 ml-auto">#142</span>
        </motion.div>

        {/* Review summary badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="flex items-center gap-2 mb-3"
        >
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/15 border border-amber-500/25 text-caption font-mono">
            <AlertTriangle size={10} className="text-amber-400" />
            <span className="text-amber-300">2 critical</span>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-caption font-mono">
            <span className="text-yellow-300">4 warnings</span>
          </span>
          <span className="text-caption text-muted/50 font-mono ml-auto">113ms</span>
        </motion.div>

        {/* Inline review comment — like a GitHub PR comment */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="rounded-lg border border-red-500/30 overflow-hidden mb-3"
        >
          {/* Code context */}
          <div className="px-3 py-2 bg-background/60 font-mono text-caption border-b border-red-500/20">
            <div className="flex items-center gap-2 text-muted/50 mb-1">
              <span>dashboard.tsx</span>
              <span className="text-muted/30">:19</span>
            </div>
            <div className="text-red-300/80">
              &lt;div <span className="text-red-400 font-semibold">dangerouslySetInnerHTML</span>=&#123;...&#125; /&gt;
            </div>
          </div>
          {/* Comment */}
          <div className="px-3 py-2.5 bg-red-500/[0.06]">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={11} className="text-red-400" />
              <span className="text-caption font-semibold text-red-300">XSS Vulnerability</span>
              <span className="text-caption text-muted/40 font-mono ml-auto">CWE-79</span>
            </div>
            <p className="text-caption text-muted/80">
              Unsanitized HTML injection. Use <span className="text-foreground/80 font-mono">DOMPurify.sanitize()</span> before rendering.
            </p>
          </div>
        </motion.div>

        {/* Second finding — compact */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: 0.5 }}
          className="rounded-lg border border-amber-500/25 overflow-hidden mb-3"
        >
          <div className="px-3 py-2 bg-amber-500/[0.04] flex items-center gap-2">
            <MessageSquare size={11} className="text-amber-400" />
            <span className="text-caption text-foreground/80">api/payments.ts:45</span>
            <span className="text-caption text-amber-300 ml-auto">Missing .limit()</span>
          </div>
        </motion.div>

        {/* Risk score bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="pt-3 border-t border-card-border"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-caption text-muted/60 font-mono">PR Risk Score</span>
            <span className="text-caption text-amber-300 font-bold font-mono">5 / 10</span>
          </div>
          <div className="h-1.5 bg-background/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "50%" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-amber-500 to-red-500/80"
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Gogaa — Terminal CLI                                               */
/* ------------------------------------------------------------------ */

function GogaaBody(): React.ReactElement {
  return (
    <>
      <TerminalChrome title="gogaa · claude-sonnet-4 · ~/project" />
      <div className="p-4 md:p-5 font-mono text-small leading-relaxed min-h-[240px]">
        {/* Block-art logo + title */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="flex gap-3 items-start"
        >
          <pre className="text-foreground font-mono leading-[1.1] text-body md:text-lead select-none">
{` ▐▛███▜▌
▝▜█████▛▘
  ▘▘ ▝▝`}
          </pre>
          <div className="flex flex-col pt-0.5">
            <p className="text-foreground">
              <span className="font-bold">Gogaa</span>{" "}
              <span className="text-muted/60">v1.2.1</span>
            </p>
            <p className="text-muted/60">claude-sonnet-4 · Anthropic</p>
            <p className="text-muted/60">~/project (main)</p>
          </div>
        </motion.div>

        {/* Streaming agent output */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 pl-1 space-y-1"
        >
          <p><span className="text-accent">❯</span> <span className="text-foreground/80">add auth middleware to /api routes</span></p>
          <p className="text-muted/60 pl-3">Reading src/api/routes.ts...</p>
          <p className="text-green-400/80 pl-3">✓ Edit src/api/routes.ts (+12 -3)</p>
          <p className="text-green-400/80 pl-3">✓ Edit src/middleware/auth.ts (+28 -0)</p>
          <p className="text-muted/60 pl-3">Running tests...</p>
          <p className="text-green-400/80 pl-3">✓ 47 tests passing</p>
        </motion.div>

        {/* Status footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-4 pt-3 border-t border-card-border flex items-center justify-between text-caption"
        >
          <span className="text-muted/60">11 providers · auto-fallback</span>
          <span className="text-green-400/70 inline-flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
            1,400+ tests passing
          </span>
        </motion.div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  OpenEvent — Web app / SaaS interface                               */
/* ------------------------------------------------------------------ */

function OpenEventBody(): React.ReactElement {
  return (
    <>
      <BrowserChrome url="app.openevent.io/inbox" />
      <div className="p-4 md:p-5 font-sans text-small leading-relaxed min-h-[240px]">
        {/* Inbox header */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex items-center justify-between text-caption mb-3 pb-2 border-b border-card-border"
        >
          <span className="text-foreground/80 font-semibold text-small">
            Event Requests
          </span>
          <span className="text-accent/80 text-caption">5 threads</span>
        </motion.div>

        {/* Top email thread */}
        <motion.div
          initial={{ opacity: 0, x: -4 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="flex items-start gap-2.5 py-2 px-2 rounded bg-accent/5 border-l-2 border-accent mb-3"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent/80 to-purple-500/80 flex items-center justify-center text-caption text-white font-bold shrink-0">
            SJ
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-small font-semibold text-foreground truncate">
                Sarah Johnson
              </p>
              <p className="text-caption text-muted/60 shrink-0">11:42 AM</p>
            </div>
            <p className="text-caption text-muted truncate">
              Corporate Conference · 150 Guests · March 15
            </p>
          </div>
        </motion.div>

        {/* AI action chain */}
        <div className="space-y-1.5">
          {[
            { text: "Created a Site Visit", detail: "Mar 1, 14:00", delay: 0.4 },
            { text: "Updated Event on Calendar", detail: "Main Hall · 9:00", delay: 0.55 },
            { text: "Updated CRM", detail: "added billing address", delay: 0.7 },
            { text: "Created event LEAD", detail: "TechCorp Inc.", delay: 0.85 },
          ].map((a) => (
            <motion.div
              key={a.text}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: a.delay, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 rounded-lg bg-amber-500/15 border border-amber-500/25 px-2.5 py-1.5"
            >
              <Check size={10} strokeWidth={3} className="text-amber-400 shrink-0" />
              <p className="text-small text-foreground/80 font-medium flex-1 truncate">
                {a.text}
              </p>
              <span className="text-caption text-muted/60 truncate max-w-[40%]">
                {a.detail}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Conflict detection */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 1.0 }}
          className="mt-3 p-2.5 rounded-lg border border-red-500/30 bg-red-500/[0.06]"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1 h-1 rounded-full bg-red-400" />
            <p className="text-caption uppercase tracking-widest text-red-300 font-semibold">
              date conflict detected
            </p>
          </div>
          <p className="text-caption text-muted/80">
            Conflicts with <span className="text-foreground">Chen Wedding</span>{" "}
            (CHF 25,000)
          </p>
          <div className="flex gap-1.5 mt-2">
            <span className="flex-1 text-center text-caption py-1 rounded bg-accent/20 text-accent border border-accent/20">
              Accept New
            </span>
            <span className="flex-1 text-center text-caption py-1 rounded border border-card-border text-muted">
              Keep Existing
            </span>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Rasad — Dashboard with browser chrome                              */
/* ------------------------------------------------------------------ */

function RasadBody(): React.ReactElement {
  return (
    <>
      <BrowserChrome url="localhost:9847/xray" />
      <div className="relative overflow-hidden">
        {/* Real screenshot */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/projects/rasad/xray-hero.png"
          alt="Rasad — X-Ray session drilldown with health blocks and action breakdown"
          loading="lazy"
          className="w-full h-auto object-cover object-top max-h-[320px]"
        />
        {/* Fade-out at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      </div>
    </>
  );
}
