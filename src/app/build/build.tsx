"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  key: string;
  title: string;
  tag: string;
  tool: string;
  body: string;
  decision?: { q: string; options: string[]; mine: number };
  code?: string;
}

const feature = "Add email-thread auto-summarization to OpenEvent";

const steps: Step[] = [
  {
    key: "intent",
    title: "Pin the outcome, not the feature",
    tag: "01 · product",
    tool: "memory · spec file",
    body:
      "Before any code: what does 'auto-summarize' unlock? I write one sentence in the project memory: 'Team lead opens a thread and sees a 3-line AI summary with action items, saving the 2-3 minute skim.' That sentence becomes the north star every later step checks against.",
    decision: {
      q: "Where does the summary live?",
      options: [
        "Inline in the thread",
        "Collapsible header above the thread",
        "Separate /summaries page",
      ],
      mine: 1,
    },
  },
  {
    key: "architect",
    title: "Sketch the architecture before the schema",
    tag: "02 · architecture",
    tool: "gogaa /architect + Mermaid",
    body:
      "Edge Function receives a thread_id → fetches messages from Supabase → calls Claude with a summarization prompt → writes summary + action_items[] back to thread_summaries table → emits realtime event. I sketch this flow in 5 Mermaid nodes and paste into memory. Every step downstream maps to one of these nodes.",
  },
  {
    key: "spec",
    title: "Write the spec, not the code",
    tag: "03 · spec",
    tool: "CLAUDE.md + schema",
    body:
      "Spec file: inputs/outputs, retry behavior, cost ceiling ($0.003/summary), auth boundary (RLS: team members only), and failure modes (malformed response, timeout, rate-limit). RLS policy written first — before the function — so security can't be an afterthought.",
    code: `-- thread_summaries
create table thread_summaries (
  thread_id uuid primary key references threads,
  summary text not null,
  action_items jsonb not null default '[]',
  model text not null,
  cost_usd numeric(6,4),
  created_at timestamptz default now()
);

alter table thread_summaries enable row level security;
create policy "team-members-read" on thread_summaries
  for select using (
    thread_id in (
      select t.id from threads t
      where t.team_id in (
        select team_id from team_members where user_id = auth.uid()
      )
    )
  );`,
  },
  {
    key: "scaffold",
    title: "Let the agent scaffold",
    tag: "04 · implementation",
    tool: "gogaa code · SEARCH/REPLACE",
    body:
      "gogaa reads the spec + schema + existing code patterns (Edge Function boilerplate, Claude client wrapper, retry helper) and produces a SEARCH/REPLACE diff. I don't accept it blindly — I read each block. ~90% goes through, 10% needs adjustment for patterns it can't see from context alone.",
    code: `// supabase/functions/summarize-thread/index.ts
import { withAuth, withRetry } from "../_shared/utils.ts";
import { claude } from "../_shared/claude.ts";

export default withAuth(async (req, { user, supabase }) => {
  const { thread_id } = await req.json();
  const { data: messages } = await supabase
    .from("messages").select("body, author, created_at")
    .eq("thread_id", thread_id).order("created_at");

  const result = await withRetry(() =>
    claude.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt(messages) }],
    })
  );

  const parsed = JSON.parse(result.content[0].text);
  return supabase.from("thread_summaries").upsert({
    thread_id, summary: parsed.summary,
    action_items: parsed.action_items,
    model: "claude-sonnet-4-6", cost_usd: result.usage.cost_usd,
  });
});`,
  },
  {
    key: "review",
    title: "CodeLens catches what I miss",
    tag: "05 · review",
    tool: "CodeLens guardian",
    body:
      "Every PR runs CodeLens. On this one it flagged: (1) no timeout set on the Claude call — could hang indefinitely on rate-limit. (2) JSON.parse without try/catch — will 500 on malformed model output. (3) no cost cap check before invocation. I added all three. Lesson: guardrails are free when they run locally in <1s.",
  },
  {
    key: "ship",
    title: "Ship behind a feature flag",
    tag: "06 · deploy",
    tool: "GitHub Actions + Supabase",
    body:
      "Commit. Push. GitHub Action runs migration against staging, deploys the edge function, runs e2e test. Feature flag off in production for 24h while I watch error rates in Sentry. Flag on for 10% of teams. Cost tracking dashboard shows $0.0018/summary average — under budget. Flag on globally.",
  },
];

export function BuildWithMe(): React.ReactElement {
  const [step, setStep] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, number>>({});

  const pickDecision = (stepKey: string, i: number): void => {
    setDecisions((d) => ({ ...d, [stepKey]: i }));
  };

  const current = steps[step];

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Ambient */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="fixed -top-40 -left-40 w-[32rem] h-[32rem] bg-accent/[0.06] rounded-full blur-3xl pointer-events-none" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-card-border">
        <div className="max-w-4xl mx-auto px-5 md:px-6 py-3 flex items-center justify-between gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-accent transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            back
          </a>
          <p className="text-[10px] md:text-xs font-mono text-muted/70 text-center truncate">
            build with me · <span className="text-accent">{feature}</span>
          </p>
          <span className="text-[10px] font-mono text-muted/40 tabular-nums shrink-0">
            {step + 1} / {steps.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-[2px] bg-card-border">
          <motion.div
            className="h-full bg-gradient-to-r from-accent via-purple-500 to-emerald-400"
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent mb-3">
              {current.tag}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
              {current.title}
            </h1>
            <p className="text-[10px] font-mono text-muted/50 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
              tool: {current.tool}
            </p>

            <p className="text-base md:text-lg text-muted leading-relaxed mb-8">
              {current.body}
            </p>

            {/* Inline decision */}
            {current.decision && (
              <div className="my-8 p-5 rounded-xl bg-card/60 border border-accent/20">
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent/80 mb-3">
                  your call
                </p>
                <p className="text-sm md:text-base mb-4 font-medium">
                  {current.decision.q}
                </p>
                <div className="space-y-2">
                  {current.decision.options.map((opt, i) => {
                    const mine = current.decision!.mine;
                    const picked = decisions[current.key];
                    const isMine = picked !== undefined && i === mine;
                    const isPicked = i === picked;
                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={picked !== undefined}
                        onClick={() => pickDecision(current.key, i)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                          picked === undefined
                            ? "border-card-border hover:border-accent/40 hover:bg-accent/5"
                            : isMine
                              ? "border-green-500/50 bg-green-500/10 text-green-100"
                              : isPicked
                                ? "border-accent/40 bg-accent/10"
                                : "border-card-border bg-card/30 opacity-60"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span>{opt}</span>
                          {picked !== undefined && isMine && (
                            <span className="text-[9px] font-mono text-green-400 px-1.5 py-0.5 rounded border border-green-500/30">
                              mine
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Inline code */}
            {current.code && (
              <div className="my-6 rounded-xl bg-card/80 border border-card-border overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-card-border bg-background/40">
                  <span className="text-[10px] font-mono text-muted/60">
                    {current.code.split("\n")[0].replace(/^--\s*|^\/\/\s*/, "")}
                  </span>
                  <span className="text-[9px] font-mono text-accent/60">
                    real shape · stylized
                  </span>
                </div>
                <pre className="p-4 overflow-x-auto text-[11px] md:text-[12px] font-mono text-muted/90 leading-[1.65]">
                  {current.code
                    .split("\n")
                    .slice(1)
                    .join("\n")}
                </pre>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="flex items-center justify-between gap-3 mt-10 pt-6 border-t border-card-border">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-card-border text-sm text-muted hover:text-foreground hover:border-accent/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← previous
          </button>

          <div className="flex gap-1.5">
            {steps.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setStep(i)}
                aria-label={`Jump to step ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === step
                    ? "bg-accent w-6"
                    : i < step
                      ? "bg-accent/60"
                      : "bg-card-border"
                }`}
              />
            ))}
          </div>

          {step === steps.length - 1 ? (
            <a
              href="https://calendly.com/shami8024/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 transition-all"
            >
              book a call →
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-all"
            >
              next →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
