"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { openCvDrawer } from "@/components/cv-drawer";

/* ------------------------------------------------------------------ */
/*  Build pipeline popup — 5-second centered overlay                  */
/* ------------------------------------------------------------------ */

const BUILD_STEPS = [
  { label: "Product", detail: "Pin the outcome" },
  { label: "Architect", detail: "Sketch the flow" },
  { label: "Spec", detail: "Schema + RLS + edge cases" },
  { label: "Scaffold", detail: "Agent generates from spec" },
  { label: "Review", detail: "CodeLens catches what I miss" },
  { label: "Ship", detail: "Feature flag, 10%, then 100%" },
];

function BuildPopup({ onDone }: { onDone: () => void }): React.ReactElement {
  const [step, setStep] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (step < BUILD_STEPS.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [step, onDone]);

  if (typeof document === "undefined") return <></>;

  const el = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
      onClick={onDone}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(9,9,11,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }} />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", pointerEvents: "none" }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22, mass: 0.8 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "340px",
          borderRadius: "28px",
          background: "rgba(24,24,27,0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(59,130,246,0.25)",
          boxShadow: "0 0 60px rgba(59,130,246,0.15), 0 0 120px rgba(59,130,246,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
          padding: "28px",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: "-30%", left: "-20%", width: "140%", height: "60%",
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none", borderRadius: "50%",
        }} />
        <p className="text-caption font-mono text-accent uppercase tracking-[0.25em] mb-5 flex items-center justify-center gap-2 relative">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          how I ship every feature
        </p>
        <div className="space-y-2.5 relative">
          {BUILD_STEPS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                i < step
                  ? { scale: 1, opacity: 1, y: 0 }
                  : { scale: 0.85, opacity: 0.12, y: 0 }
              }
              transition={
                i < step
                  ? { type: "spring", stiffness: 500, damping: 18, mass: 0.5, delay: 0.05 }
                  : { duration: 0.2 }
              }
              className={`flex items-center gap-3 px-4 py-2.5 rounded-full border transition-colors ${
                i < step ? "bg-accent/10 border-accent/20" : "bg-card/20 border-card-border/20"
              }`}
            >
              <span className={`text-caption font-mono tabular-nums shrink-0 ${i < step ? "text-accent" : "text-muted/40"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-sm font-semibold flex-1 ${i < step ? "text-foreground" : "text-muted/40"}`}>
                {s.label}
              </span>
              <span className={`text-caption hidden sm:inline ${i < step ? "text-muted/80" : "text-muted/20"}`}>
                {s.detail}
              </span>
              {i < step && (
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="text-green-400 shrink-0"
                >
                  <Check size={14} strokeWidth={3} />
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
        {step >= BUILD_STEPS.length && (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mt-5 text-xs text-muted text-center"
          >
            Every project. Every time.
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );

  return ReactDOM.createPortal(el, document.body);
}

/* ------------------------------------------------------------------ */
/*  Commands                                                           */
/* ------------------------------------------------------------------ */

interface AgentStep {
  name: string;
  detail: string;
  ms: number;
}

interface AgentCommand {
  keyword: string;
  label?: string;
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
    label: "Hire",
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
    keyword: "contact",
    intent: "hiring_intent",
    confidence: 0.94,
    steps: [
      { name: "classify_intent", detail: "label: hiring_intent · conf 0.94", ms: 38 },
      { name: "route_to_tool", detail: "→ scroll_to_section", ms: 6 },
      { name: "execute", detail: "target: #contact", ms: 120 },
    ],
    response: "Scrolling to contact section.",
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
    response: "Hey, you found it. AI engineer, Lead AI Dev, builder of tools. Thanks for actually exploring. Most don't.",
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
    action: () => { setTimeout(() => { window.location.href = "/journey"; }, 450); },
  },
  {
    keyword: "call",
    intent: "meeting_request",
    confidence: 0.93,
    steps: [
      { name: "classify_intent", detail: "label: meeting_request · conf 0.93", ms: 38 },
      { name: "route_to_tool", detail: "→ open_booking", ms: 5 },
      { name: "execute", detail: "url: ahtesham.dev.wadwarehouse.com/book", ms: 22 },
    ],
    response: "Opening 15-min intro call scheduler in a new tab.",
    action: () => window.open("https://ahtesham.dev.wadwarehouse.com/book", "_blank", "noopener,noreferrer"),
  },
  {
    keyword: "cv",
    intent: "resume_request",
    confidence: 0.96,
    steps: [
      { name: "classify_intent", detail: "label: resume_request · conf 0.96", ms: 26 },
      { name: "route_to_tool", detail: "→ open_cv_drawer", ms: 4 },
      { name: "execute", detail: "target: cv-drawer", ms: 30 },
    ],
    response: "Opening visual CV. Pro tip: there's a print-ready version too.",
    action: () => openCvDrawer(),
  },
  {
    keyword: "resume",
    intent: "resume_request",
    confidence: 0.96,
    steps: [
      { name: "classify_intent", detail: "label: resume_request · conf 0.96", ms: 26 },
      { name: "route_to_tool", detail: "→ open_cv_drawer", ms: 4 },
      { name: "execute", detail: "target: cv-drawer", ms: 30 },
    ],
    response: "Opening visual CV. Pro tip: there's a print-ready version too.",
    action: () => openCvDrawer(),
  },
  {
    keyword: "build",
    intent: "feature_walkthrough",
    confidence: 0.93,
    steps: [
      { name: "classify_intent", detail: "label: feature_walkthrough · conf 0.93", ms: 32 },
      { name: "load_pipeline", detail: "6-step delivery pipeline", ms: 12 },
    ],
    response: "Rendering the pipeline now.",
    action: () => window.dispatchEvent(new CustomEvent("show-build-popup")),
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
    response: "Launching chat agent. Ask anything about my work.",
    // action is handled specially in the component for fly-to-chat animation
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
    keyword: "writing",
    intent: "browse_writing",
    confidence: 0.91,
    steps: [
      { name: "classify_intent", detail: "label: browse_writing · conf 0.91", ms: 33 },
      { name: "route_to_tool", detail: "→ scroll_to_section", ms: 5 },
      { name: "execute", detail: "target: #writing", ms: 100 },
    ],
    response: "Scrolling to writing section.",
    action: () => scrollTo("writing"),
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
    response: "Replaying intro sequence...",
    action: () => window.dispatchEvent(new CustomEvent("replay-intro")),
  },
  {
    keyword: "wow",
    intent: "reaction_positive",
    confidence: 0.88,
    steps: [
      { name: "classify_intent", detail: "label: reaction_positive · conf 0.88", ms: 31 },
    ],
    response: "That's the feeling. Every interaction here is wired to something real. Keep poking.",
  },
  {
    keyword: "presence",
    intent: "toggle_presence",
    confidence: 0.98,
    steps: [
      { name: "classify_intent", detail: "label: toggle_presence · conf 0.98", ms: 24 },
      { name: "dispatch_event", detail: "toggle-presence", ms: 3 },
    ],
    response: "Toggled visitor presence. Fake cursors from other cities moving around.",
    action: () => window.dispatchEvent(new CustomEvent("toggle-presence")),
  },
  {
    keyword: "skills",
    intent: "show_skills",
    confidence: 0.96,
    steps: [
      { name: "tokenize", detail: "1 token", ms: 2 },
      { name: "classify_intent", detail: "label: show_skills · conf 0.96", ms: 30 },
      { name: "render_neural_map", detail: "27 nodes · 34 edges · 5 groups", ms: 45 },
    ],
    response: "Opening neural map. Hover nodes to explore connections.",
    action: () => window.dispatchEvent(new CustomEvent("show-skills-modal")),
  },
  {
    keyword: "skill",
    intent: "show_skills",
    confidence: 0.96,
    steps: [
      { name: "tokenize", detail: "1 token", ms: 2 },
      { name: "classify_intent", detail: "label: show_skills · conf 0.96", ms: 30 },
      { name: "render_neural_map", detail: "27 nodes · 34 edges · 5 groups", ms: 45 },
    ],
    response: "Opening neural map. Hover nodes to explore connections.",
    action: () => window.dispatchEvent(new CustomEvent("show-skills-modal")),
  },
  {
    keyword: "rate",
    intent: "pricing_query",
    confidence: 0.95,
    steps: [
      { name: "classify_intent", detail: "label: pricing_query · conf 0.95", ms: 28 },
      { name: "retrieve_context", detail: "pricing_card", ms: 12 },
    ],
    response: "$80-120/hr contract · $8-10K/mo full-time. Full stack ownership — architecture to deployed SaaS.",
  },
  {
    keyword: "stack",
    intent: "tech_stack",
    confidence: 0.94,
    steps: [
      { name: "classify_intent", detail: "label: tech_stack · conf 0.94", ms: 30 },
      { name: "retrieve_context", detail: "stack_card", ms: 14 },
    ],
    response: "TypeScript · React · Next.js · Supabase · Claude API · Docker · GitHub Actions · Cloudflare",
  },
  {
    keyword: "availability",
    intent: "availability_check",
    confidence: 0.93,
    steps: [
      { name: "classify_intent", detail: "label: availability_check · conf 0.93", ms: 26 },
      { name: "retrieve_context", detail: "status_card", ms: 10 },
    ],
    response: "Open to opportunities. Available for full-time, contract, or consulting. Gulf/remote preferred.",
  },
  {
    keyword: "impact",
    intent: "browse_impact",
    confidence: 0.92,
    steps: [
      { name: "classify_intent", detail: "label: browse_impact · conf 0.92", ms: 30 },
      { name: "route_to_tool", detail: "→ scroll_to_section", ms: 5 },
      { name: "execute", detail: "target: #mission", ms: 100 },
    ],
    response: "50+ production systems, 100+ teams on OpenEvent, 150+ events managed.",
    action: () => scrollTo("mission"),
  },
  {
    keyword: "experience",
    intent: "browse_experience",
    confidence: 0.93,
    steps: [
      { name: "classify_intent", detail: "label: browse_experience · conf 0.93", ms: 32 },
      { name: "route_to_tool", detail: "→ scroll_to_section", ms: 5 },
      { name: "execute", detail: "target: #log", ms: 100 },
    ],
    response: "Career timeline: Lead AI Dev at More Life Hospitality, Director at Rouelite, Co-Founder at Wadware House.",
    action: () => scrollTo("log"),
  },
  {
    keyword: "help",
    intent: "show_commands",
    confidence: 1.0,
    steps: [
      { name: "introspect", detail: "loading command registry", ms: 18 },
    ],
    response: "Commands: projects · writing · contact · cv · impact · experience · rate · stack · skills · availability · chat · build · tour · call · help",
  },
];

/* ------------------------------------------------------------------ */
/*  Suggestion chips — home page sections                              */
/* ------------------------------------------------------------------ */

// Chips match homepage section scroll order (one line)
const CHIPS = [
  { label: "Impact", command: "impact" },
  { label: "Projects", command: "projects" },
  { label: "Experience", command: "experience" },
  { label: "Writing", command: "writing" },
  { label: "Contact", command: "contact" },
];

/* ------------------------------------------------------------------ */
/*  AgentBar — Button / Panel / Flying-to-Chat                        */
/* ------------------------------------------------------------------ */

type UIState = "hidden" | "button" | "panel" | "processing" | "responding" | "flying-to-chat";

export function AgentBar(): React.ReactElement {
  const [uiState, setUiState] = useState<UIState>("hidden");
  const [input, setInput] = useState("");
  const [buffer, setBuffer] = useState("");
  const [activeCmd, setActiveCmd] = useState<AgentCommand | null>(null);
  const [shownSteps, setShownSteps] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [showBuildPopup, setShowBuildPopup] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [buttonReady, setButtonReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);

  // Listen for build popup trigger
  useEffect(() => {
    const handler = (): void => setShowBuildPopup(true);
    window.addEventListener("show-build-popup", handler);
    return () => window.removeEventListener("show-build-popup", handler);
  }, []);

  // Listen for agent-button-ready from boot animation
  useEffect(() => {
    const onReady = (): void => {
      setButtonReady(true);
      setUiState("button");
      // Show tooltip for 2.5s
      setTimeout(() => setShowTooltip(true), 500);
      setTimeout(() => setShowTooltip(false), 3000);
    };
    window.addEventListener("agent-button-ready", onReady);

    // If boot was already seen (returning visitor), show button immediately
    if (sessionStorage.getItem("boot-complete") === "1") {
      setButtonReady(true);
      setUiState("button");
    }

    return () => window.removeEventListener("agent-button-ready", onReady);
  }, []);

  // Listen for replay-intro to hide button
  useEffect(() => {
    const onReplay = (): void => {
      setUiState("hidden");
      setButtonReady(false);
    };
    window.addEventListener("replay-intro", onReplay);
    return () => window.removeEventListener("replay-intro", onReplay);
  }, []);

  // Hide agent when chat widget is open
  const [chatOpen, setChatOpen] = useState(false);
  useEffect(() => {
    const onChatOpen = (): void => setChatOpen(true);
    const onChatClose = (): void => setChatOpen(false);
    window.addEventListener("open-chat-widget", onChatOpen);
    window.addEventListener("close-chat-widget", onChatClose);
    return () => {
      window.removeEventListener("open-chat-widget", onChatOpen);
      window.removeEventListener("close-chat-widget", onChatClose);
    };
  }, []);

  // Global keystroke buffer — typing anywhere triggers commands
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      // Escape closes panel from anywhere (even when input is focused)
      if (e.key === "Escape" && (uiState === "panel" || uiState === "processing" || uiState === "responding")) {
        e.preventDefault();
        setActiveCmd(null);
        setShownSteps(0);
        setShowResponse(false);
        setInput("");
        setUiState("button");
        return;
      }

      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // "/" focuses the panel
      if (e.key === "/" && uiState !== "processing" && uiState !== "responding" && uiState !== "flying-to-chat") {
        e.preventDefault();
        setUiState("panel");
        setTimeout(() => inputRef.current?.focus(), 100);
        return;
      }

      if (e.key.length !== 1) return;
      if (uiState === "processing" || uiState === "responding" || uiState === "flying-to-chat") return;

      setBuffer((prev) => {
        const next = (prev + e.key.toLowerCase()).slice(-12);
        const match = commands.find((c) => next.endsWith(c.keyword));
        if (match) {
          runCommand(match);
          return "";
        }
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [uiState]);

  // Stage the steps one-by-one during processing
  useEffect(() => {
    if (uiState !== "processing" || !activeCmd) return;
    if (shownSteps >= activeCmd.steps.length) {
      const t = setTimeout(() => {
        setShowResponse(true);
        setUiState("responding");
      }, 220);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setShownSteps((n) => n + 1),
      activeCmd.steps[shownSteps].ms + 120,
    );
    return () => clearTimeout(t);
  }, [uiState, activeCmd, shownSteps]);

  // After response, execute action + return to panel
  useEffect(() => {
    if (uiState !== "responding" || !activeCmd) return;

    // Special handling for "chat" command — fly to chat widget
    if (activeCmd.keyword === "chat") {
      const flyTimer = setTimeout(() => {
        setUiState("flying-to-chat");
      }, 800);
      return () => clearTimeout(flyTimer);
    }

    const actionTimer = setTimeout(() => {
      activeCmd.action?.();
    }, 300);
    // After showing response briefly, hide the agent (reappear handled by separate effect)
    const hideTimer = setTimeout(() => {
      setActiveCmd(null);
      setShownSteps(0);
      setShowResponse(false);
      setInput("");
      setUiState("hidden");
    }, 3000);
    return () => {
      clearTimeout(actionTimer);
      clearTimeout(hideTimer);
    };
  }, [uiState, activeCmd]);

  // Reappear as button after being hidden (post-command)
  useEffect(() => {
    if (uiState !== "hidden" || !buttonReady) return;
    const t = setTimeout(() => setUiState("button"), 3000);
    return () => clearTimeout(t);
  }, [uiState, buttonReady]);

  // Flying-to-chat animation completion
  useEffect(() => {
    if (uiState !== "flying-to-chat") return;
    const t = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("agent-flying-to-chat"));
      window.dispatchEvent(new CustomEvent("open-chat-widget"));
      setActiveCmd(null);
      setShownSteps(0);
      setShowResponse(false);
      setInput("");
      setUiState("button");
    }, 600);
    return () => clearTimeout(t);
  }, [uiState]);

  const runCommand = useCallback((cmd: AgentCommand): void => {
    setActiveCmd(cmd);
    setShownSteps(0);
    setShowResponse(false);
    setUiState("processing");
  }, []);

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const q = input.trim().toLowerCase();
    if (!q) return;
    const match = commands.find((c) => c.keyword === q);
    if (match) {
      runCommand(match);
    } else {
      runCommand({
        keyword: q,
        intent: "unknown",
        confidence: 0.12,
        steps: [
          { name: "classify_intent", detail: "label: unknown · conf 0.12", ms: 28 },
          { name: "fallback", detail: "no matching tool", ms: 12 },
        ],
        response: `No tool matched "${q}". Try: projects · cv · rate · skills · chat`,
      });
    }
  };

  const onChipClick = (command: string): void => {
    const match = commands.find((c) => c.keyword === command);
    if (match) runCommand(match);
  };

  if (uiState === "hidden" || chatOpen) return <></>;

  const totalMs = activeCmd?.steps.reduce((s, x) => s + x.ms, 0) ?? 0;

  return (
    <>
      {/* ── Agent Button (pill at bottom center) ── */}
      <AnimatePresence>
        {uiState === "button" && buttonReady && (
          <>
            {/* Tooltip — wrapper centers, inner animates */}
            <AnimatePresence>
              {showTooltip && (
                <div className="fixed z-[101] bottom-[68px] left-1/2 -translate-x-1/2 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="font-mono text-small text-foreground whitespace-nowrap px-4 py-2 rounded-xl bg-card border border-card-border shadow-lg relative"
                  >
                    ask me anything — <span className="text-accent">I&apos;m live</span>
                    <span className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-card border-r border-b border-card-border rotate-45" />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Button — wrapper centers, motion animates */}
            <div className="fixed z-[100] bottom-5 left-1/2 -translate-x-1/2">
              <motion.button
                type="button"
                onClick={() => {
                  setShowTooltip(false);
                  setUiState("panel");
                  setTimeout(() => inputRef.current?.focus(), 150);
                }}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="flex items-center gap-2.5 cursor-pointer glass rounded-full px-5 py-2.5"
                style={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)",
                }}
              >
              <span
                className="w-2 h-2 rounded-full bg-accent-status shrink-0"
                style={{ animation: "green-pulse 2s infinite" }}
              />
              <span className="text-accent font-mono text-small font-semibold">&#10095;</span>
              <span className="font-mono text-small text-muted/60">agent</span>
              <span
                className="font-mono text-muted/30 border border-card-border/30 rounded px-1.5 py-0.5"
                style={{ fontSize: "10px" }}
              >
                /
              </span>
              </motion.button>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ── Panel (expanded command bar) ── */}
      <AnimatePresence>
        {(uiState === "panel" || uiState === "processing" || uiState === "responding") && (
          <div className="fixed z-[100] bottom-5 left-1/2 -translate-x-1/2 w-[calc(100vw-1.5rem)] max-w-[620px]">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Response area (when processing/responding) */}
            <AnimatePresence>
              {(uiState === "processing" || uiState === "responding") && activeCmd && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                  className="mb-2 rounded-xl glass-strong overflow-hidden"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
                >
                  <div className="px-4 py-3 font-mono text-small space-y-1">
                    <p className="text-caption font-mono text-accent uppercase tracking-[0.15em] mb-2">
                      shami.agent
                    </p>
                    <p className="text-foreground/80">
                      <span className="text-accent">&#10095; parse</span>
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
                          <span className="text-green-400 ml-auto shrink-0">&#10003;</span>
                          <span className="text-muted/40 text-caption tabular-nums">{s.ms}ms</span>
                        </motion.div>
                      );
                    })}

                    <AnimatePresence>
                      {showResponse && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                          className="pt-2 mt-2 border-t border-card-border/60"
                        >
                          <p className="text-foreground leading-relaxed">
                            <span className="text-accent">&#10095; response</span>
                            <span className="text-muted/60">:</span>{" "}
                            <span>{activeCmd.response}</span>
                          </p>
                          <p className="text-caption text-muted/40 mt-1 tabular-nums">
                            completed in {totalMs}ms
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suggestion chips — only show when idle (panel state, no active command) */}
            <AnimatePresence>
              {uiState === "panel" && !activeCmd && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center gap-1.5 mb-2 flex-wrap px-2"
                >
                  {CHIPS.map((chip, i) => (
                    <motion.button
                      key={chip.command}
                      type="button"
                      onClick={() => onChipClick(chip.command)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                      className="px-3 py-1.5 rounded-full glass text-small font-mono text-muted/70 hover:text-accent hover:border-accent/30 transition-all cursor-pointer"
                    >
                      {chip.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input bar */}
            <form
              onSubmit={onSubmit}
              className="glass-strong rounded-xl overflow-hidden"
              style={{
                boxShadow: "0 4px 30px rgba(0,0,0,0.5), 0 0 60px rgba(0,0,0,0.2)",
              }}
            >
              <div className="flex items-center gap-2 px-4 py-3">
                <span className="text-accent font-mono text-body font-semibold shrink-0">&#10095;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="ask anything..."
                  disabled={uiState === "processing" || uiState === "responding"}
                  className="flex-1 min-w-0 bg-transparent outline-none font-mono text-small placeholder:text-muted/35 text-foreground disabled:opacity-50"
                />
                {!input && (
                  <span className="hidden sm:flex items-center gap-1 shrink-0 font-mono text-caption text-muted/30">
                    cv · rate · skills · chat · tour · help
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setActiveCmd(null);
                    setShownSteps(0);
                    setShowResponse(false);
                    setInput("");
                    setUiState("button");
                  }}
                  aria-label="Close agent panel"
                  className="text-muted/40 hover:text-foreground shrink-0 transition-colors cursor-pointer ml-1"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Flying-to-chat animation ── */}
      <AnimatePresence>
        {uiState === "flying-to-chat" && (
          <motion.div
            ref={flyRef}
            initial={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              x: "-50%",
              width: 200,
              height: 44,
              borderRadius: 22,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              bottom: 80,
              left: "calc(100% - 40px)",
              x: "-50%",
              width: 44,
              height: 44,
              borderRadius: 22,
              opacity: 0.6,
              scale: 0.5,
              filter: "blur(8px) brightness(2)",
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="fixed z-[100] glass-strong"
            style={{
              boxShadow: "0 0 30px rgba(74,222,128,0.3), 0 0 60px rgba(74,222,128,0.1)",
              background: "radial-gradient(circle, rgba(74,222,128,0.2), rgba(21,21,21,0.7))",
            }}
          />
        )}
      </AnimatePresence>

      {/* Build pipeline popup */}
      <AnimatePresence>
        {showBuildPopup && (
          <BuildPopup onDone={() => setShowBuildPopup(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
