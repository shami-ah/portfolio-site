"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Commands — each is a full "agent trace" the user can trigger      */
/* ------------------------------------------------------------------ */

interface AgentStep {
  name: string;
  detail: string;
  ms: number;
}

interface AgentCommand {
  keyword: string;
  intent: string;
  confidence: number;
  steps: AgentStep[];
  response: string;
  action?: () => void;
}

function scrollTo(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const commands: AgentCommand[] = [
  {
    keyword: "hire",
    intent: "hiring_intent",
    confidence: 0.94,
    steps: [
      { name: "tokenize", detail: "1 token", ms: 3 },
      { name: "classify_intent", detail: "label: hiring_intent · conf 0.94", ms: 42 },
      { name: "route_to_tool", detail: "→ scroll_to_section", ms: 6 },
      { name: "execute", detail: "target: #contact", ms: 120 },
    ],
    response: "Hiring intent detected. Moving to Contact. 15-min call waits below.",
    action: () => scrollTo("contact"),
  },
  {
    keyword: "shami",
    intent: "personal_greeting",
    confidence: 0.99,
    steps: [
      { name: "tokenize", detail: "1 token", ms: 2 },
      { name: "classify_intent", detail: "label: personal_greeting · conf 0.99", ms: 28 },
      { name: "retrieve_context", detail: "identity_card", ms: 14 },
    ],
    response:
      "Hey, you found it. 5 years of production AI. Thanks for actually exploring — most don't.",
  },
  {
    keyword: "tour",
    intent: "guided_tour",
    confidence: 0.97,
    steps: [
      { name: "tokenize", detail: "1 token", ms: 2 },
      { name: "classify_intent", detail: "label: guided_tour · conf 0.97", ms: 31 },
      { name: "route_to_tool", detail: "→ navigate", ms: 4 },
      { name: "execute", detail: "target: /journey", ms: 45 },
    ],
    response: "Launching immersive journey. Timeline + a day in my life + parallel systems.",
    action: () => {
      setTimeout(() => {
        window.location.href = "/journey";
      }, 450);
    },
  },
  {
    keyword: "call",
    intent: "meeting_request",
    confidence: 0.93,
    steps: [
      { name: "classify_intent", detail: "label: meeting_request · conf 0.93", ms: 38 },
      { name: "route_to_tool", detail: "→ open_calendly", ms: 5 },
      { name: "execute", detail: "url: calendly.com/shami8024/30min", ms: 22 },
    ],
    response: "Opening 15-min intro call scheduler in a new tab.",
    action: () =>
      window.open("https://calendly.com/shami8024/30min", "_blank", "noopener,noreferrer"),
  },
  {
    keyword: "cv",
    intent: "resume_request",
    confidence: 0.96,
    steps: [
      { name: "classify_intent", detail: "label: resume_request · conf 0.96", ms: 26 },
      { name: "route_to_tool", detail: "→ navigate", ms: 4 },
      { name: "execute", detail: "target: /cv", ms: 30 },
    ],
    response: "Opening visual CV. Pro tip: there's a print-ready version too.",
    action: () => {
      setTimeout(() => {
        window.location.href = "/cv";
      }, 450);
    },
  },
  {
    keyword: "chat",
    intent: "conversational_query",
    confidence: 0.95,
    steps: [
      { name: "classify_intent", detail: "label: conversational_query · conf 0.95", ms: 31 },
      { name: "route_to_tool", detail: "→ spawn_chat_agent", ms: 6 },
      { name: "execute", detail: "target: /chat", ms: 42 },
    ],
    response: "Launching chat agent. Ask anything about my work — scoped knowledge base, no hallucinations.",
    action: () => {
      setTimeout(() => {
        window.location.href = "/chat";
      }, 450);
    },
  },
  {
    keyword: "projects",
    intent: "browse_projects",
    confidence: 0.91,
    steps: [
      { name: "classify_intent", detail: "label: browse_projects · conf 0.91", ms: 35 },
      { name: "route_to_tool", detail: "→ scroll_to_section", ms: 5 },
      { name: "execute", detail: "target: #projects", ms: 110 },
    ],
    response: "9 case studies below. Click any card for architecture + results.",
    action: () => scrollTo("projects"),
  },
  {
    keyword: "boot",
    intent: "replay_intro",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: replay_intro · conf 0.99", ms: 22 },
      { name: "route_to_tool", detail: "→ reset_session", ms: 8 },
      { name: "execute", detail: "clearing flags…", ms: 40 },
    ],
    response: "Rebooting portfolio…",
    action: () => {
      sessionStorage.removeItem("boot-seen");
      sessionStorage.removeItem("boot-complete");
      setTimeout(() => window.location.reload(), 550);
    },
  },
  {
    keyword: "wow",
    intent: "reaction_positive",
    confidence: 0.88,
    steps: [
      { name: "classify_intent", detail: "label: reaction_positive · conf 0.88", ms: 31 },
    ],
    response:
      "That's the feeling. Every interaction here is wired to something real — keep poking.",
  },
  {
    keyword: "help",
    intent: "show_commands",
    confidence: 1.0,
    steps: [
      { name: "introspect", detail: "loading command registry", ms: 18 },
    ],
    response:
      "Available: hire · call · projects · tour · cv · shami · boot · wow. Type any of these.",
  },
];

/* ------------------------------------------------------------------ */
/*  State machine                                                     */
/* ------------------------------------------------------------------ */

type Phase = "hidden" | "dormant" | "processing" | "responding";

export function AgentBar(): React.ReactElement {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [input, setInput] = useState("");
  const [buffer, setBuffer] = useState("");
  const [activeCmd, setActiveCmd] = useState<AgentCommand | null>(null);
  const [shownSteps, setShownSteps] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Auto-reveal after settle */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("agent-dismissed")) {
      setDismissed(true);
      return;
    }
    const bootComplete = sessionStorage.getItem("boot-complete");
    const delay = bootComplete ? 10000 : 14000;
    const t = setTimeout(() => {
      setPhase("dormant");
    }, delay);
    return () => clearTimeout(t);
  }, []);

  /* Global keystroke buffer — typing anywhere triggers the bar */
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // "/" focuses the bar's own input
      if (e.key === "/" && phase !== "processing" && phase !== "responding") {
        e.preventDefault();
        if (dismissed) setDismissed(false);
        setPhase("dormant");
        setTimeout(() => inputRef.current?.focus(), 100);
        return;
      }

      if (e.key.length !== 1) return;
      if (phase === "processing" || phase === "responding") return;

      setBuffer((prev) => {
        const next = (prev + e.key.toLowerCase()).slice(-12);
        const match = commands.find((c) => next.endsWith(c.keyword));
        if (match) {
          if (dismissed) setDismissed(false);
          runCommand(match);
          return "";
        }
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, dismissed]);

  /* Stage the steps one-by-one during processing */
  useEffect(() => {
    if (phase !== "processing" || !activeCmd) return;
    if (shownSteps >= activeCmd.steps.length) {
      const t = setTimeout(() => {
        setShowResponse(true);
        setPhase("responding");
      }, 220);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setShownSteps((n) => n + 1),
      activeCmd.steps[shownSteps].ms + 120,
    );
    return () => clearTimeout(t);
  }, [phase, activeCmd, shownSteps]);

  /* After response, execute action + fade back to dormant */
  useEffect(() => {
    if (phase !== "responding" || !activeCmd) return;
    const actionTimer = setTimeout(() => {
      activeCmd.action?.();
    }, 300);
    const resetTimer = setTimeout(() => {
      setActiveCmd(null);
      setShownSteps(0);
      setShowResponse(false);
      setInput("");
      setPhase("dormant");
    }, 3500);
    return () => {
      clearTimeout(actionTimer);
      clearTimeout(resetTimer);
    };
  }, [phase, activeCmd]);

  const runCommand = (cmd: AgentCommand): void => {
    if (phase === "hidden") setPhase("dormant");
    setActiveCmd(cmd);
    setShownSteps(0);
    setShowResponse(false);
    setPhase("processing");
  };

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const q = input.trim().toLowerCase();
    const match = commands.find((c) => c.keyword === q);
    if (match) {
      runCommand(match);
    } else if (q.length > 0) {
      // Unknown command → simulate fallback
      runCommand({
        keyword: q,
        intent: "unknown",
        confidence: 0.12,
        steps: [
          { name: "classify_intent", detail: `label: unknown · conf 0.12`, ms: 28 },
          { name: "fallback", detail: "no matching tool", ms: 12 },
        ],
        response: `No tool matched "${q}". Try: hire · call · projects · tour · cv · help`,
      });
    }
  };

  const dismiss = (): void => {
    sessionStorage.setItem("agent-dismissed", "1");
    setDismissed(true);
  };

  /* Floating re-open tab when dismissed */
  if (dismissed && phase !== "processing" && phase !== "responding") {
    return (
      <button
        type="button"
        onClick={() => {
          sessionStorage.removeItem("agent-dismissed");
          setDismissed(false);
          setPhase("dormant");
        }}
        className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card/80 backdrop-blur-md border border-accent/25 text-[11px] font-mono text-muted hover:text-accent hover:border-accent/50 transition-all shadow-lg shadow-background/40"
        aria-label="Open agent"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent/70 animate-pulse" />
        agent
      </button>
    );
  }

  if (phase === "hidden") return <></>;

  const totalMs = activeCmd?.steps.reduce((s, x) => s + x.ms, 0) ?? 0;

  return (
    <div
      aria-live="polite"
      className="fixed left-1/2 bottom-3 md:bottom-5 -translate-x-1/2 z-40 w-[calc(100vw-1.5rem)] md:w-[calc(100%-2.5rem)] max-w-[640px] pointer-events-none"
    >
      <AnimatePresence mode="wait">
        {/* DORMANT: slim input-ready bar */}
        {phase === "dormant" && (
          <motion.div
            key="dormant"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto"
          >
            <form
              onSubmit={onSubmit}
              className="group relative overflow-hidden rounded-xl bg-card/90 backdrop-blur-md border border-accent/30 shadow-2xl shadow-accent/10 flex items-center gap-2 px-3 md:px-4 py-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
              <span className="text-accent font-mono text-xs md:text-sm shrink-0">❯</span>
              <span className="text-muted/50 font-mono text-xs md:text-sm shrink-0 hidden sm:inline">
                agent ·
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type · hire · call · projects · tour · chat · cv"
                className="flex-1 min-w-0 bg-transparent outline-none font-mono text-xs md:text-sm placeholder:text-muted/40 text-foreground"
              />
              <kbd className="hidden md:inline text-[10px] font-mono text-muted/50 border border-card-border px-1.5 py-0.5 rounded">
                /
              </kbd>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss"
                className="text-muted/40 hover:text-foreground shrink-0 ml-1"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              {/* subtle glowing sweep */}
              <motion.div
                aria-hidden
                className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 pointer-events-none"
                animate={{ x: ["-100%", "400%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
            </form>
          </motion.div>
        )}

        {/* PROCESSING / RESPONDING: expanded agent trace */}
        {(phase === "processing" || phase === "responding") && activeCmd && (
          <motion.div
            key="trace"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto rounded-xl bg-card/95 backdrop-blur-md border border-accent/40 shadow-2xl shadow-accent/25 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 md:px-4 py-2 border-b border-accent/15 bg-background/40">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent/80">
                agent · session active
              </p>
              <p className="ml-auto text-[10px] font-mono text-muted/50 tabular-nums">
                {phase === "responding" ? `${totalMs}ms` : "…"}
              </p>
            </div>

            {/* Body */}
            <div className="px-3 md:px-5 py-3 md:py-4 space-y-1 font-mono text-[11px] md:text-[12px]">
              <p className="text-foreground/90">
                <span className="text-accent">❯ parse</span>
                <span className="text-muted/60">(&ldquo;</span>
                <span className="text-foreground">{activeCmd.keyword}</span>
                <span className="text-muted/60">&rdquo;)</span>
              </p>

              {activeCmd.steps.slice(0, shownSteps).map((s, i) => {
                const isLast = i === activeCmd.steps.length - 1;
                return (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-baseline gap-2"
                  >
                    <span className="text-muted/40">{isLast ? "└─" : "├─"}</span>
                    <span className="text-foreground/80">{s.name}</span>
                    <span className="text-green-400 ml-auto shrink-0">✓</span>
                    <span className="text-muted/40 text-[10px] tabular-nums">
                      {s.ms}ms
                    </span>
                  </motion.div>
                );
              })}

              {activeCmd.steps.slice(0, shownSteps).map((s, i) => (
                <motion.p
                  key={`d-${s.name}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.12, duration: 0.25 }}
                  className="text-muted/50 pl-5 text-[10px] md:text-[11px]"
                >
                  {i === activeCmd.steps.length - 1 ? "   " : "│  "}
                  {s.detail}
                </motion.p>
              ))}

              <AnimatePresence>
                {showResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="pt-2 mt-2 border-t border-card-border/60"
                  >
                    <p className="text-foreground leading-relaxed">
                      <span className="text-accent">❯ response</span>
                      <span className="text-muted/60">:</span>{" "}
                      <span>{activeCmd.response}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
