"use client";

declare global {
  // eslint-disable-next-line no-var
  var __agentScrolling: boolean | undefined;
}

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { openCvDrawer } from "@/components/cv-drawer";
import { useTilt } from "@/lib/use-tilt";

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
      <div className="absolute inset-0 bg-background/88 backdrop-blur-[20px]" />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)" }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22, mass: 0.8 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[340px] rounded-xl bg-card/95 backdrop-blur-[24px] border border-accent-secondary/25 p-7 overflow-hidden"
        style={{
          boxShadow: "0 0 60px rgba(59,130,246,0.15), 0 0 120px rgba(59,130,246,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="absolute -top-[30%] -left-[20%] w-[140%] h-[60%] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(128,128,128,0.04) 0%, transparent 70%)" }} />
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
/*  Agent emoji face — shared between hero and pill bar                */
/* ------------------------------------------------------------------ */

type EmojiMood = "default" | "curious" | "proud" | "waving" | "confused" | "sleeping" | "surprised" | "dancing";

export function AgentEmoji({ size = 40, hovered = false, mood = "default" }: { size?: number; hovered?: boolean; mood?: EmojiMood }): React.ReactElement {
  const s = size;
  const fc = "fill-accent-status";
  const sc = "stroke-accent-status";
  const isDancing = mood === "dancing";
  const isSleeping = mood === "sleeping";

  // Mood-specific mouth paths (in face-only 48x48 coordinate space)
  const mouths: Record<EmojiMood, { rest: string; animated?: string[] }> = {
    default:  { rest: "M 16 32 Q 24 32 32 32", animated: ["M 16 32 Q 24 32 32 32", "M 16 30 Q 24 38 32 30", "M 16 30 Q 24 38 32 30", "M 16 32 Q 24 32 32 32"] },
    curious:  { rest: "M 18 32 Q 24 34 30 32" },
    proud:    { rest: "M 14 30 Q 24 40 34 30" },
    waving:   { rest: "M 16 30 Q 24 37 32 30", animated: ["M 16 30 Q 24 37 32 30", "M 16 30 Q 24 38 32 30", "M 16 30 Q 24 37 32 30"] },
    confused: { rest: "M 18 34 Q 24 30 30 34" },
    sleeping: { rest: "M 18 33 Q 24 33 30 33" },
    surprised:{ rest: "M 20 30 Q 24 38 28 30" },
    dancing:  { rest: "M 14 29 Q 24 40 34 29" },
  };

  const m = mouths[mood] ?? mouths.default;

  // Dancing stick figure — round head (same face), body below, tilts and dances
  if (isDancing && s > 18) {
    return (
      <motion.svg
        viewBox="0 0 48 96"
        width={s}
        height={s * 2}
        fill="none"
        className="shrink-0"
        style={{ filter: s > 24 ? "drop-shadow(0 0 6px rgba(74,222,128,0.3))" : "none" }}
        animate={{ rotate: [0, -6, 6, -4, 4, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* === Head — round circle like normal emoji === */}
        <circle cx="24" cy="24" r="22" className={sc} strokeWidth="1.5" opacity="0.2" fill="none" />
        {/* Eyes — same position as normal face */}
        <motion.circle cx="16" cy="19" r={2.5} className={fc} animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 0.3, delay: 1.5, repeat: Infinity, repeatDelay: 2.5 }} />
        <motion.circle cx="32" cy="19" r={2.5} className={fc} animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 0.3, delay: 1.5, repeat: Infinity, repeatDelay: 2.5 }} />
        {/* Nose */}
        <line x1="24" y1="22" x2="24" y2="27" className={sc} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        {/* Mouth — big grin */}
        <motion.path d="M 14 30 Q 24 40 34 30" className={sc} strokeWidth="2" strokeLinecap="round" fill="none" animate={{ d: ["M 14 30 Q 24 40 34 30", "M 16 31 Q 24 38 32 31", "M 14 30 Q 24 40 34 30"] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }} />

        {/* === Body === */}
        {/* Torso — from bottom of head circle */}
        <motion.line
          x1="24" y1="46" x2="24" y2="66"
          className={sc} strokeWidth="2" strokeLinecap="round"
          animate={{ x2: [24, 22, 26, 24] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Left arm */}
        <motion.line
          x1="24" y1="52" x2="10" y2="58"
          className={sc} strokeWidth="2" strokeLinecap="round"
          animate={{ x2: [10, 8, 14, 10], y2: [58, 46, 60, 58] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Right arm */}
        <motion.line
          x1="24" y1="52" x2="38" y2="58"
          className={sc} strokeWidth="2" strokeLinecap="round"
          animate={{ x2: [38, 40, 34, 38], y2: [58, 46, 60, 58] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
        />
        {/* Left leg */}
        <motion.line
          x1="24" y1="66" x2="14" y2="86"
          className={sc} strokeWidth="2" strokeLinecap="round"
          animate={{ x2: [14, 10, 18, 14], y2: [86, 84, 88, 86] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Right leg */}
        <motion.line
          x1="24" y1="66" x2="34" y2="86"
          className={sc} strokeWidth="2" strokeLinecap="round"
          animate={{ x2: [34, 38, 30, 34], y2: [86, 84, 88, 86] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
        />
      </motion.svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" width={s} height={s} fill="none" className="shrink-0" style={{ filter: s > 24 ? "drop-shadow(0 0 6px rgba(74,222,128,0.3))" : "none" }}>
      {/* Eyes */}
      <motion.circle
        cx="16" cy="19" r={2.5 * (s > 24 ? 1 : 0.9)}
        className={fc}
        animate={
          isSleeping ? { scaleY: 0.15 }
          : hovered ? { scaleY: [1, 0.1, 1, 0.1, 1] }
          : { scaleY: [1, 0.1, 1] }
        }
        transition={hovered
          ? { duration: 0.5, ease: "easeInOut" }
          : { duration: 0.3, delay: 2, repeat: isSleeping ? 0 : Infinity, repeatDelay: 3.5 }
        }
      />
      <motion.circle
        cx="32" cy="19" r={2.5 * (s > 24 ? 1 : 0.9)}
        className={fc}
        animate={
          isSleeping ? { scaleY: 0.15 }
          : mood === "curious" ? { cx: [32, 34, 32] }
          : { scaleY: [1, 0.1, 1] }
        }
        transition={
          mood === "curious"
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3, delay: 2, repeat: isSleeping ? 0 : Infinity, repeatDelay: 3.5 }
        }
      />
      {/* Nose */}
      {s > 24 && (
        <line x1="24" y1="22" x2="24" y2="27" className={sc} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      )}
      {/* Waving hand */}
      {mood === "waving" && s > 24 && (
        <motion.text
          x="38" y="16" fontSize="12"
          animate={{ rotate: [0, 20, -10, 20, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          style={{ transformOrigin: "38px 14px" }}
        >
          👋
        </motion.text>
      )}
      {/* Sleeping Zs */}
      {isSleeping && s > 24 && (
        <motion.text
          x="34" y="14" fontSize="10" className={fc}
          animate={{ opacity: [0, 1, 0], y: [14, 8, 2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          z
        </motion.text>
      )}
      {/* Mouth */}
      <motion.path
        d={hovered && mood === "default" ? "M 14 29 Q 24 40 34 29" : m.rest}
        className={sc}
        strokeWidth={s > 24 ? 2 : 1.5}
        strokeLinecap="round"
        fill="none"
        animate={(hovered && mood === "default") ? {} : m.animated ? { d: m.animated } : {}}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Whoami popup — full-screen overlay with about card                 */
/* ------------------------------------------------------------------ */

const TERM_STEPS = [
  { cmd: "whoami", type: "identity" as const },
  { cmd: "cat location", output: "Islamabad, PK · remote-first" },
  { cmd: "echo $LANGUAGES", output: "EN, UR, PS, SD, AR" },
  { cmd: "cat interests.txt", output: "Snooker, cricket, history, technology" },
  { cmd: "cat superpower.txt", output: "Picks up anything fast" },
  { cmd: "cat philosophy.md", output: "Build the tool when none exists", green: true },
];

function WhoamiPopup({ onDone }: { onDone: () => void }): React.ReactElement {
  const tilt = useTilt(10);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Line-by-line reveal
  useEffect(() => {
    if (visibleLines >= TERM_STEPS.length) return;
    const t = setTimeout(
      () => setVisibleLines((v) => v + 1),
      180 + Math.random() * 100,
    );
    return () => clearTimeout(t);
  }, [visibleLines]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDone]);

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
      <div className="absolute inset-0 bg-background/88 backdrop-blur-[20px]" />
      {/* Ambient glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(160,120,104,0.12) 0%, transparent 70%)" }}
      />
      <motion.div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        style={tilt.style}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 0 40px rgba(160,120,104,0.06)" }}
        transition={{ type: "spring", stiffness: 300, damping: 22, mass: 0.8 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[720px] rounded-xl bg-card/95 backdrop-blur-[24px] border border-card-border overflow-hidden shadow-2xl shadow-black/30 cursor-default"
      >
        {/* Chrome */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-card-border bg-card/40">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="ml-1 text-caption font-mono text-muted/60">shami.agent — whoami</span>
          </div>
          <button
            type="button"
            onClick={onDone}
            className="text-muted/40 hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Mobile photo */}
        <div className="flex sm:hidden flex-col items-center pt-4 pb-2">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-br from-accent/20 to-accent-secondary/12 rounded-full blur-xl pointer-events-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ahtesham.jpg" loading="eager" fetchPriority="high" alt="Ahtesham Ahmad" className="relative w-16 h-16 rounded-full object-cover border-2 border-accent/30 shadow-lg shadow-accent/10" />
          </div>
        </div>

        {/* Card body — terminal left, photo right */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 px-4 py-3 font-mono text-small leading-[1.9] overflow-hidden">
            {TERM_STEPS.map((step, idx) => (
              <motion.div
                key={step.cmd}
                className="mb-1"
                animate={{
                  opacity: idx < visibleLines ? 1 : 0,
                  y: idx < visibleLines ? 0 : 5,
                }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <div><span className="text-accent">❯</span> <span className="text-foreground/80">{step.cmd}</span></div>
                {step.type === "identity" ? (
                  <div className="pl-3 py-0.5">
                    <span className="text-foreground font-bold">Ahtesham Ahmad</span>
                    <span className="text-accent/60 ml-2">AI Engineer</span>
                  </div>
                ) : (
                  <div className={`pl-3 ${step.green ? "text-accent-status/70" : "text-foreground/60"}`}>
                    {step.output}
                  </div>
                )}
              </motion.div>
            ))}
            <div>
              <span className="text-accent">❯</span>{" "}
              <span className="inline-block w-[6px] h-[12px] bg-accent/60 translate-y-[2px] animate-pulse" />
            </div>
          </div>

          {/* Photo — right side */}
          <div className="hidden sm:flex items-center justify-center px-8 border-l border-card-border/30">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-accent/15 to-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ahtesham.jpg" loading="eager" fetchPriority="high" alt="Ahtesham Ahmad" className="relative aspect-square h-[80%] min-h-[180px] max-h-[240px] w-auto rounded-full object-cover border-3 border-accent/25 shadow-2xl shadow-accent/15" />
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="px-3 py-1.5 border-t border-card-border/40 flex items-center justify-between bg-card/20">
          <div className="flex items-center gap-2 text-caption font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-status animate-pulse" />
            <span className="text-accent-status/70">available for hire</span>
          </div>
          <button
            type="button"
            data-cv-open="true"
            onClick={() => { onDone(); openCvDrawer(); }}
            className="group flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-caption font-mono border border-accent/25 bg-accent/8 text-accent/70 hover:bg-accent/15 hover:text-accent hover:border-accent/40 transition-all duration-200 cursor-pointer"
          >
            <span className="w-1 h-1 rounded-full bg-accent/60 group-hover:bg-accent transition-colors" />
            View CV
          </button>
        </div>
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
  /** If set, agent shows pipeline then routes this query to chat widget */
  routeToChat?: string;
}

function scrollTo(id: string): void {
  // Flag programmatic scroll so top-bar meteor animation doesn't trigger
  window.__agentScrolling = true;
  setTimeout(() => { window.__agentScrolling = false; }, 2000);
  // Dispatch reveal event — AgentRevealParticles blurs the section,
  // fires particles after scroll settles, then deblurs on arrival
  window.dispatchEvent(new CustomEvent("section-reveal", { detail: { sectionId: id } }));
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ------------------------------------------------------------------ */
/*  Fuzzy intent matching for free-text queries                        */
/* ------------------------------------------------------------------ */

interface FuzzyMatch {
  command: AgentCommand;
  score: number;
}

const PROJECT_KEYWORDS: Record<string, string[]> = {
  projects: ["show me your projects", "your projects", "portfolio", "what you built", "what have you built"],
  openevent: ["event", "management", "booking", "openevent", "open event", "client", "crm", "invoice", "email automation", "event platform"],
  codelens: ["code review", "lint", "pattern", "bug", "security", "pr review", "codelens", "code lens", "static analysis", "code quality"],
  gogaa: ["coding agent", "ai coding", "terminal agent", "provider", "gogaa", "llm tool", "ai cli", "coding cli"],
  rasad: ["observability", "session analytics", "cost tracking", "token usage", "rasad", "monitoring ai", "ai observatory", "session replay"],
  rate: ["rate", "price", "pricing", "cost", "charge", "budget", "hourly", "salary", "pay", "compensation", "how much", "expensive", "fee", "quote"],
  hire: ["hire", "hiring", "recruit", "work with", "engage", "freelance", "contract", "full-time", "looking for", "need a developer", "need an engineer"],
  cv: ["resume", "cv", "qualification", "education", "degree"],
  contact: ["contact", "reach", "email", "call", "talk", "connect", "meet", "book a call", "get in touch"],
  chat: ["chat", "question", "explain", "help me", "more info", "tell me more"],
  build: ["build process", "ship", "deliver", "methodology", "how do you work", "development process"],
  tour: ["tour", "journey", "story", "who are you", "about you", "about yourself", "what do you do"],
  stack: ["stack", "tools", "framework", "language", "react", "typescript", "supabase", "next", "python", "docker", "react native"],
  availability: ["available", "availability", "when can you start", "timeline", "capacity", "schedule"],
  impact: ["impact", "results", "numbers", "metrics", "achievement"],
  experience: ["career", "worked at", "work at", "work in", "worked in", "company", "job history", "role", "position", "years of experience", "your work", "rouelite", "rouelite techno", "more life", "more life hospitality", "wadware", "wadware house", "outlier", "rws", "translated"],
  skills: ["skills", "tech stack", "technology", "what do you know", "expertise", "proficient", "capable"],
};

function fuzzyMatch(query: string, cmds: AgentCommand[]): FuzzyMatch | null {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/);

  let best: FuzzyMatch | null = null;

  for (const [keyword, phrases] of Object.entries(PROJECT_KEYWORDS)) {
    let score = 0;
    for (const phrase of phrases) {
      if (q.includes(phrase)) {
        score += phrase.split(/\s+/).length * 2;
      } else {
        for (const token of tokens) {
          if (token.length >= 3 && phrase.includes(token)) score += 1;
        }
      }
    }
    if (score > 0) {
      const cmd = cmds.find((c) => c.keyword === keyword);
      if (cmd && (!best || score > best.score)) {
        best = { score, command: { ...cmd, confidence: Math.min(0.95, 0.6 + score * 0.05) } };
      }
    }
  }

  return best && best.score >= 2 ? best : null;
}

const commands: AgentCommand[] = [
  {
    keyword: "whoami",
    intent: "identity_query",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: identity_query · conf 0.99", ms: 8 },
      { name: "retrieve_context", detail: "identity_card", ms: 12 },
    ],
    response: "Ahtesham Ahmad — Full-Stack + AI Engineer. Islamabad, remote-first.",
    action: () => window.dispatchEvent(new CustomEvent("show-whoami")),
  },
  {
    keyword: "hi",
    intent: "greeting",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: greeting · conf 0.99", ms: 12 },
    ],
    response: "Hey! I'm Ahtesham's portfolio agent. Try: projects, rate, skills, or just ask anything.",
  },
  {
    keyword: "hello",
    intent: "greeting",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: greeting · conf 0.99", ms: 12 },
    ],
    response: "Hey! I'm Ahtesham's portfolio agent. Try: projects, rate, skills, or just ask anything.",
  },
  {
    keyword: "hey",
    intent: "greeting",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: greeting · conf 0.99", ms: 12 },
    ],
    response: "Hey! I'm Ahtesham's portfolio agent. Try: projects, rate, skills, or just ask anything.",
  },
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
    // action is handled specially in the component for client-side navigation
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
    response: "4 flagship projects + 5 side projects below. Click any card for the full case study.",
    action: () => scrollTo("projects"),
  },
  {
    keyword: "openevent",
    intent: "project_detail",
    confidence: 0.97,
    steps: [
      { name: "classify_intent", detail: "label: project_detail · conf 0.97", ms: 24 },
      { name: "route_to_chat", detail: "→ chat agent (RAG)", ms: 8 },
    ],
    response: "Routing to chat — full context on OpenEvent loaded.",
    routeToChat: "Tell me about OpenEvent — the AI event management platform",
  },
  {
    keyword: "codelens",
    intent: "project_detail",
    confidence: 0.97,
    steps: [
      { name: "classify_intent", detail: "label: project_detail · conf 0.97", ms: 24 },
      { name: "route_to_chat", detail: "→ chat agent (RAG)", ms: 8 },
    ],
    response: "Routing to chat — full context on CodeLens loaded.",
    routeToChat: "Tell me about CodeLens — the AI code review engine",
  },
  {
    keyword: "gogaa",
    intent: "project_detail",
    confidence: 0.97,
    steps: [
      { name: "classify_intent", detail: "label: project_detail · conf 0.97", ms: 24 },
      { name: "route_to_chat", detail: "→ chat agent (RAG)", ms: 8 },
    ],
    response: "Routing to chat — full context on Gogaa CLI loaded.",
    routeToChat: "Tell me about Gogaa CLI — the AI coding agent with 11 providers",
  },
  {
    keyword: "rasad",
    intent: "project_detail",
    confidence: 0.97,
    steps: [
      { name: "classify_intent", detail: "label: project_detail · conf 0.97", ms: 24 },
      { name: "route_to_chat", detail: "→ chat agent (RAG)", ms: 8 },
    ],
    response: "Routing to chat — full context on Rasad loaded.",
    routeToChat: "Tell me about Rasad — the AI session observatory",
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
    keyword: "dance",
    intent: "easter_egg",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: easter_egg · conf 0.99", ms: 5 },
      { name: "activate_mood", detail: "mood: dancing", ms: 3 },
    ],
    response: "Can't stop, won't stop.",
    action: () => window.dispatchEvent(new CustomEvent("emoji-mood", { detail: "dancing" })),
  },
  {
    keyword: "sleep",
    intent: "easter_egg",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: easter_egg · conf 0.99", ms: 5 },
      { name: "activate_mood", detail: "mood: sleeping", ms: 3 },
    ],
    response: "zzz... wake me when you need me.",
    action: () => window.dispatchEvent(new CustomEvent("emoji-mood", { detail: "sleeping" })),
  },
  {
    keyword: "surprise",
    intent: "easter_egg",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: easter_egg · conf 0.99", ms: 5 },
      { name: "activate_mood", detail: "mood: surprised", ms: 3 },
    ],
    response: "Wait — you found this?!",
    action: () => window.dispatchEvent(new CustomEvent("emoji-mood", { detail: "surprised" })),
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
      { name: "route_to_chat", detail: "→ chat agent (pricing context)", ms: 6 },
    ],
    response: "Routing to chat — detailed pricing breakdown.",
    routeToChat: "What are Ahtesham's rates for contract and full-time work?",
  },
  {
    keyword: "stack",
    intent: "tech_stack",
    confidence: 0.94,
    steps: [
      { name: "classify_intent", detail: "label: tech_stack · conf 0.94", ms: 30 },
      { name: "route_to_chat", detail: "→ chat agent (stack context)", ms: 6 },
    ],
    response: "Routing to chat — full stack details.",
    routeToChat: "What is Ahtesham's tech stack?",
  },
  {
    keyword: "availability",
    intent: "availability_check",
    confidence: 0.93,
    steps: [
      { name: "classify_intent", detail: "label: availability_check · conf 0.93", ms: 26 },
      { name: "route_to_chat", detail: "→ chat agent (availability)", ms: 6 },
    ],
    response: "Routing to chat — availability details.",
    routeToChat: "Is Ahtesham available for work? What's his availability?",
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
    action: () => scrollTo("projects"),
  },
  {
    keyword: "experience",
    intent: "career_query",
    confidence: 0.95,
    steps: [
      { name: "classify_intent", detail: "label: career_query · conf 0.95", ms: 28 },
      { name: "route_to_chat", detail: "→ chat agent (career context)", ms: 6 },
    ],
    response: "Routing to chat — full career context loaded.",
    routeToChat: "Tell me about Ahtesham's career and work experience",
  },
  {
    keyword: "career",
    intent: "browse_career",
    confidence: 0.93,
    steps: [
      { name: "classify_intent", detail: "label: browse_career · conf 0.93", ms: 32 },
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
    response: "Navigate: projects · impact · experience · contact · cv · skills · build · tour. Ask anything else — I'll route to the chat agent.",
  },
];

/* ------------------------------------------------------------------ */
/*  Suggestion chips — home page sections                              */
/* ------------------------------------------------------------------ */

// Chips match homepage section scroll order (one line)
// All suggestion chips mapped to section scroll order
const ALL_CHIPS = [
  { label: "Projects", command: "projects", section: "projects" },
  { label: "Career", command: "career", section: "log" },
  { label: "Contact", command: "contact", section: "contact" },
];

const SECTION_ORDER = ["hero", "projects", "log", "contact"] as const;

/* ------------------------------------------------------------------ */
/*  Section-aware agent personality                                    */
/* ------------------------------------------------------------------ */

interface AgentPersonality {
  dotColor: string;
  glowColor: string;
  hoverLabel: string;
}

const SECTION_PERSONALITY: Record<string, AgentPersonality> = {
  hero: {
    dotColor: "bg-green-400",
    glowColor: "rgba(74,222,128,0.4)",
    hoverLabel: "agent",
  },
  projects: {
    dotColor: "bg-blue-400",
    glowColor: "rgba(96,165,250,0.4)",
    hoverLabel: "explore",
  },
  log: {
    dotColor: "bg-purple-400",
    glowColor: "rgba(192,132,252,0.4)",
    hoverLabel: "career",
  },
  contact: {
    dotColor: "bg-accent",
    glowColor: "rgba(160,120,104,0.5)",
    hoverLabel: "connect",
  },
};

/* ------------------------------------------------------------------ */
/*  AgentBar — Button / Panel / Flying-to-Chat                        */
/* ------------------------------------------------------------------ */

type UIState = "hidden" | "button" | "panel" | "processing" | "responding" | "flying-to-chat";

/* ------------------------------------------------------------------ */
/*  Visitor memory — persists in sessionStorage                        */
/* ------------------------------------------------------------------ */
const MEMORY_KEY = "agent-visitor-memory";

interface VisitorMemory {
  sectionsViewed: string[];
  commandsUsed: string[];
  projectsOpened: string[];
  visitCount: number;
}

function loadMemory(): VisitorMemory {
  try {
    const raw = sessionStorage.getItem(MEMORY_KEY);
    if (raw) return JSON.parse(raw) as VisitorMemory;
  } catch { /* noop */ }
  return { sectionsViewed: [], commandsUsed: [], projectsOpened: [], visitCount: 0 };
}

function saveMemory(mem: VisitorMemory): void {
  try { sessionStorage.setItem(MEMORY_KEY, JSON.stringify(mem)); } catch { /* noop */ }
}

function recordSection(id: string): void {
  const mem = loadMemory();
  if (!mem.sectionsViewed.includes(id)) {
    mem.sectionsViewed.push(id);
    saveMemory(mem);
  }
}

function recordCommand(keyword: string): void {
  const mem = loadMemory();
  if (!mem.commandsUsed.includes(keyword)) {
    mem.commandsUsed.push(keyword);
    saveMemory(mem);
  }
}

export function AgentBar(): React.ReactElement {
  const router = useRouter();
  const [uiState, setUiState] = useState<UIState>("hidden");
  const [input, setInput] = useState("");
  const [buffer, setBuffer] = useState("");
  const [activeCmd, setActiveCmd] = useState<AgentCommand | null>(null);
  const [shownSteps, setShownSteps] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [showBuildPopup, setShowBuildPopup] = useState(false);
  const [showWhoami, setShowWhoami] = useState(false);
  const [buttonReady, setButtonReady] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [viewingProject, setViewingProject] = useState<string | null>(null);
  const [inHeroViewport, setInHeroViewport] = useState(true);
  const [heroAgentOpen, setHeroAgentOpen] = useState(false);
  const [emojiHovered, setEmojiHovered] = useState(false);
  const [emojiMoodOverride, setEmojiMoodOverride] = useState<EmojiMood | null>(null);
  const [persistentMood, setPersistentMood] = useState<EmojiMood>("default");
  // Bubble suggestion phases: "hidden" → "dots" → "hint" → "chips" → "dance-hint"
  const [bubblePhase, setBubblePhase] = useState<"hidden" | "dots" | "hint" | "chips" | "dance-hint">("hidden");
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const bubbleCycleRef = useRef(0); // 0-3 = mood picker cycles, then stops
  const [danceHintShown, setDanceHintShown] = useState(false);
  const [danceTried, setDanceTried] = useState(false);
  // Emoji position phases: "hidden" → "bottom" → "settled" (in hero mount)
  const [emojiPhase, setEmojiPhase] = useState<"hidden" | "bottom" | "settled">("hidden");
  const emojiHasSettled = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Track which section the user is currently viewing
  useEffect(() => {
    let ticking = false;
    const onScroll = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const probeY = window.scrollY + window.innerHeight * 0.5;
        let current = "hero";
        for (const id of SECTION_ORDER) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= probeY) current = id;
        }
        setActiveSection(current);
        recordSection(current);
        // Track hero viewport — agent input lives in hero above this threshold
        const heroEl = document.getElementById("hero");
        if (heroEl) {
          const wasInHero = window.scrollY < heroEl.offsetHeight * 0.7;
          setInHeroViewport(wasInHero);
          // Reset emoji when leaving hero — always show emoji on return
          if (!wasInHero) {
            setHeroAgentOpen(false);
            setEmojiPhase("settled");
          }
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Load persistent mood + dance state from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("agent-mood") as EmojiMood | null;
      if (saved) setPersistentMood(saved);
      if (sessionStorage.getItem("dance-tried") === "1") setDanceTried(true);
    } catch { /* noop */ }
  }, []);

  // Show mood suggestions — increasing intervals (3s, 6s, 9s, 12s), max 4 mood cycles
  // Dance hint shows once (after 2nd mood cycle) if visitor hasn't tried it
  useEffect(() => {
    if (emojiPhase !== "settled" || heroAgentOpen || !inHeroViewport || emojiMoodOverride) {
      setBubblePhase("hidden");
      return;
    }
    const cycle = bubbleCycleRef.current;
    if (cycle >= 4) return; // stop after 4 mood picker cycles
    const delay = 3000 + cycle * 3000; // 3s, 6s, 9s, 12s
    // Show dance hint on cycle 1 if not tried yet
    const showDance = cycle === 1 && !danceTried && !danceHintShown;
    bubbleTimerRef.current = setTimeout(() => {
      setBubblePhase("dots");
      setTimeout(() => setBubblePhase("hint"), 600);
      setTimeout(() => {
        if (showDance) {
          setBubblePhase("dance-hint");
          setDanceHintShown(true);
        } else {
          setBubblePhase("chips");
        }
      }, 1600);
    }, delay);
    return () => { if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current); };
  }, [emojiPhase, heroAgentOpen, inHeroViewport, emojiMoodOverride, persistentMood, danceTried, danceHintShown]); // re-trigger after mood changes

  /* ── Methodology chips per project ── */
  const PROJECT_METHODOLOGY: Record<string, { label: string; command: AgentCommand }[]> = {
    openevent: [
      { label: "Why human-in-the-loop?", command: {
        keyword: "why-hitl", intent: "methodology_query", confidence: 0.97,
        steps: [
          { name: "classify_intent", detail: "label: methodology_query · conf 0.97", ms: 31 },
          { name: "load_principle", detail: "principle_1: trust_boundary", ms: 12 },
          { name: "retrieve_evidence", detail: "openevent: 100+ clients", ms: 28 },
          { name: "compose_response", detail: "linking principle to outcome", ms: 8 },
        ],
        response: "Full automation fails on the first misread. Event coordination is full of ambiguity. I designed AI to handle extraction and proposal — humans approve before anything touches money. That trust boundary is why 100+ clients adopted in 8 months with zero AI errors.",
      }},
      { label: "Why this architecture?", command: {
        keyword: "why-arch", intent: "architecture_query", confidence: 0.95,
        steps: [
          { name: "classify_intent", detail: "label: architecture_query · conf 0.95", ms: 29 },
          { name: "load_principle", detail: "principle_2: architect_first", ms: 14 },
          { name: "retrieve_evidence", detail: "declarative workflows + pgvector", ms: 22 },
        ],
        response: "JSON/YAML workflows so non-engineers can add steps without deploys. pgvector inside Postgres — no separate vector DB, zero sync lag. Every component is replaceable without rewriting the pipeline.",
      }},
      { label: "How was this shipped?", command: {
        keyword: "how-ship", intent: "process_query", confidence: 0.96,
        steps: [
          { name: "classify_intent", detail: "label: process_query · conf 0.96", ms: 26 },
          { name: "load_principle", detail: "principle_6: feature_flags", ms: 10 },
          { name: "retrieve_evidence", detail: "8 months, 100+ clients, zero downtime", ms: 18 },
        ],
        response: "Architecture doc first (3 days). Sprint-based delivery. Every PR through CodeLens. Dark deploy → 10% rollout → full launch. 8 months from zero to 100+ clients with zero-downtime deploys.",
        action: () => window.dispatchEvent(new CustomEvent("show-build-popup")),
      }},
    ],
    codelens: [
      { label: "Why patterns over AI?", command: {
        keyword: "why-patterns", intent: "methodology_query", confidence: 0.96,
        steps: [
          { name: "classify_intent", detail: "label: methodology_query · conf 0.96", ms: 28 },
          { name: "load_principle", detail: "deterministic_first", ms: 11 },
          { name: "retrieve_evidence", detail: "430 patterns, <1s, 8%→100%", ms: 24 },
        ],
        response: "AI catches novel bugs but hallucinates on known ones. 430 hand-crafted patterns from real PRs run in <1s with zero false positives. AI layer runs after — only for what patterns can't express. When Greptile caught 12 issues I missed, I ran a gap analysis and closed all 12. Coverage: 8% → 100%.",
      }},
      { label: "Why build your own?", command: {
        keyword: "why-build-own", intent: "methodology_query", confidence: 0.94,
        steps: [
          { name: "classify_intent", detail: "label: methodology_query · conf 0.94", ms: 30 },
          { name: "load_principle", detail: "principle_4: consumer_producer", ms: 13 },
          { name: "retrieve_evidence", detail: "351KB, zero deps, runs anywhere", ms: 20 },
        ],
        response: "I'm both consumer and producer of dev tooling. SonarQube needs Java + a server. Commercial SaaS sends your code to a third party. CodeLens is one 351KB file — runs as a pre-commit hook, no cloud dependency, no vendor lock-in.",
      }},
    ],
    "gogaa-cli": [
      { label: "Why 11 providers?", command: {
        keyword: "why-providers", intent: "methodology_query", confidence: 0.95,
        steps: [
          { name: "classify_intent", detail: "label: methodology_query · conf 0.95", ms: 27 },
          { name: "load_principle", detail: "no_vendor_lock", ms: 12 },
          { name: "retrieve_evidence", detail: "11 providers, auto-fallback", ms: 19 },
        ],
        response: "If your provider rate-limits, you stop working. I made the provider a variable — 11 providers behind one streaming interface with automatic fallback. When Claude goes down, it switches to GPT. When GPT goes down, it switches to Groq. You never stop working.",
      }},
      { label: "Why build from scratch?", command: {
        keyword: "why-scratch", intent: "methodology_query", confidence: 0.93,
        steps: [
          { name: "classify_intent", detail: "label: methodology_query · conf 0.93", ms: 32 },
          { name: "load_principle", detail: "principle_4: consumer_producer", ms: 14 },
          { name: "retrieve_evidence", detail: "1,400+ tests, WAL persistence", ms: 21 },
        ],
        response: "Forking means inheriting vendor assumptions. Wrapping means fighting their architecture. I built from scratch so every subsystem — provider, TUI, git, tools, session — is first-class and swappable. 1,400+ tests prove it works.",
      }},
    ],
    rasad: [
      { label: "Why local-first?", command: {
        keyword: "why-local", intent: "methodology_query", confidence: 0.96,
        steps: [
          { name: "classify_intent", detail: "label: methodology_query · conf 0.96", ms: 25 },
          { name: "load_principle", detail: "principle_3: strict_boundaries", ms: 11 },
          { name: "retrieve_evidence", detail: "zero outbound requests", ms: 16 },
        ],
        response: "AI session data contains your code, your prompts, your costs. That data should never leave your machine. Rasad runs 100% local — SQLite, localhost API, zero outbound requests. Your observability data stays yours.",
      }},
      { label: "Why unified observatory?", command: {
        keyword: "why-unified", intent: "methodology_query", confidence: 0.94,
        steps: [
          { name: "classify_intent", detail: "label: methodology_query · conf 0.94", ms: 29 },
          { name: "retrieve_evidence", detail: "4 tools, 656 sessions, one dashboard", ms: 23 },
        ],
        response: "Billing dashboards show cost, not behavior. Custom logging means modifying each tool. Rasad reads session files directly from Claude Code, Gogaa, and Codex — one dashboard for 656 sessions, 38K messages, 14K tool calls. No tool modifications needed.",
      }},
    ],
  };

  // Section-specific chip suggestions:
  // Pattern: relevant to THIS section + one nudge toward NEXT section (last chip)
  const SECTION_CHIPS: Record<string, { label: string; command: string }[]> = {
    hero: [
      { label: "whoami", command: "whoami" },
      { label: "Projects", command: "projects" },
      { label: "How I ship", command: "build" },
    ],
    projects: [
      { label: "Skills", command: "skills" },
      { label: "Chat", command: "chat" },
      { label: "See career →", command: "career" },
    ],
    log: [
      { label: "Rate", command: "rate" },
      { label: "Full journey", command: "tour" },
      { label: "Get in touch →", command: "contact" },
    ],
    contact: [
      { label: "Book a call", command: "call" },
      { label: "Availability", command: "availability" },
      { label: "View CV", command: "cv" },
    ],
  };

  // Section-aware placeholder and hints for the input bar
  const SECTION_INPUT: Record<string, { placeholder: string }> = {
    hero: { placeholder: "ask anything about Ahtesham's work..." },
    projects: { placeholder: "ask about any project..." },
    log: { placeholder: "ask about experience..." },
    contact: { placeholder: "ask about availability, rate..." },
  };

  const mem = loadMemory();

  // When viewing a project, show methodology chips instead of section chips
  const methodologyChips = viewingProject ? PROJECT_METHODOLOGY[viewingProject] ?? [] : [];

  // Section-aware chips — always show relevant suggestions for current section
  // Never filter these out based on usage; they're contextual navigation aids
  const sectionChips = methodologyChips.length > 0
    ? []
    : (SECTION_CHIPS[activeSection] ?? SECTION_CHIPS.hero);

  const visibleChips = sectionChips.slice(0, 5);

  const inputConfig = SECTION_INPUT[activeSection] ?? SECTION_INPUT.hero;

  // Listen for build popup trigger
  useEffect(() => {
    const handler = (): void => setShowBuildPopup(true);
    window.addEventListener("show-build-popup", handler);
    return () => window.removeEventListener("show-build-popup", handler);
  }, []);

  // Listen for emoji mood changes — temporary override from easter eggs, persistent from mood chips
  useEffect(() => {
    const handler = (e: Event): void => {
      const detail = (e as CustomEvent<{ mood: string; persistent?: boolean }>).detail;
      const mood = (typeof detail === "string" ? detail : detail.mood) as EmojiMood;
      const persistent = typeof detail === "object" && detail.persistent;
      if (persistent) {
        setPersistentMood(mood);
        setEmojiMoodOverride(null);
        try { sessionStorage.setItem("agent-mood", mood); } catch { /* noop */ }
      } else {
        setEmojiMoodOverride(mood);
        setTimeout(() => setEmojiMoodOverride(null), mood === "dancing" ? 5000 : 8000);
      }
    };
    window.addEventListener("emoji-mood", handler);
    return () => window.removeEventListener("emoji-mood", handler);
  }, []);

  // Listen for whoami popup trigger
  useEffect(() => {
    const handler = (): void => setShowWhoami(true);
    window.addEventListener("show-whoami", handler);
    return () => window.removeEventListener("show-whoami", handler);
  }, []);

  // Track project modal opens for visitor memory + set viewing context
  useEffect(() => {
    const onOpen = (e: Event): void => {
      const slug = (e as CustomEvent<string>).detail;
      if (slug) {
        setViewingProject(slug);
        const m = loadMemory();
        if (!m.projectsOpened.includes(slug)) {
          m.projectsOpened.push(slug);
          saveMemory(m);
        }
      }
    };
    const onClose = (): void => setViewingProject(null);
    window.addEventListener("project-opened", onOpen);
    // Listen for modal close via body attribute change
    const obs = new MutationObserver(() => {
      if (document.body.getAttribute("data-modal-open") !== "true") {
        setViewingProject(null);
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-modal-open"] });
    return () => { window.removeEventListener("project-opened", onOpen); obs.disconnect(); };
  }, []);

  // Listen for agent-button-ready from boot animation
  useEffect(() => {
    const onReady = (): void => {
      setButtonReady(true);
      setUiState("button");
      // Emoji appears at bottom center ONLY on first boot (never again)
      if (!emojiHasSettled.current) {
        setEmojiPhase("bottom");
      }
    };
    window.addEventListener("agent-button-ready", onReady);

    // When hero is fully written by particles → emoji floats up to hero position
    const onHeroReady = (): void => {
      setTimeout(() => {
        setEmojiPhase("settled");
        emojiHasSettled.current = true;
        try { sessionStorage.setItem("emoji-settled", "1"); } catch { /* noop */ }
      }, 400);
    };
    window.addEventListener("hero-fully-written", onHeroReady);

    // If boot was already seen this session, skip bottom animation
    if (sessionStorage.getItem("boot-complete") === "1") {
      setButtonReady(true);
      setUiState("button");
      // If boot played this session already, emoji settles immediately
      // If fresh page load (new session), boot will play and trigger bottom→settled
      if (sessionStorage.getItem("emoji-settled") === "1") {
        setEmojiPhase("settled");
        emojiHasSettled.current = true;
      }
    }

    return () => {
      window.removeEventListener("agent-button-ready", onReady);
      window.removeEventListener("hero-fully-written", onHeroReady);
    };
  }, []);

  // Listen for replay-intro to hide button
  useEffect(() => {
    const onReplay = (): void => {
      setUiState("hidden");
      setButtonReady(false);
      setHeroAgentOpen(false);
      setEmojiPhase("hidden");
      setBubblePhase("hidden");
      setPersistentMood("default");
      setDanceTried(false);
      setDanceHintShown(false);
      bubbleCycleRef.current = 0;
      emojiHasSettled.current = false;
      try { sessionStorage.removeItem("emoji-settled"); sessionStorage.removeItem("agent-mood"); sessionStorage.removeItem("dance-tried"); } catch { /* noop */ }
    };
    window.addEventListener("replay-intro", onReplay);
    return () => window.removeEventListener("replay-intro", onReplay);
  }, []);

  // Hide agent when chat widget is open or modal is open
  const [chatOpen, setChatOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const onChatOpen = (): void => setChatOpen(true);
    const onChatClose = (): void => setChatOpen(false);
    window.addEventListener("open-chat-widget", onChatOpen);
    window.addEventListener("chat-widget-active", onChatOpen);
    window.addEventListener("close-chat-widget", onChatClose);

    // Watch for data-modal-open attribute on body (set by ProjectModal & ExpandModal)
    const observer = new MutationObserver(() => {
      setModalOpen(document.body.hasAttribute("data-modal-open"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-modal-open"] });

    return () => {
      window.removeEventListener("open-chat-widget", onChatOpen);
      window.removeEventListener("chat-widget-active", onChatOpen);
      window.removeEventListener("close-chat-widget", onChatClose);
      observer.disconnect();
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

  // Clean up nav timer on unmount
  useEffect(() => () => { if (navTimerRef.current) clearTimeout(navTimerRef.current); }, []);

  // After response, keep panel visible until user interacts (mouse move / click / scroll)
  // Commands with navigation actions (scroll/navigate) auto-dismiss after a brief read delay
  useEffect(() => {
    if (uiState !== "responding" || !activeCmd) return;

    // Chat command or routeToChat — fly to chat widget
    if (activeCmd.keyword === "chat" || activeCmd.routeToChat) {
      const query = activeCmd.routeToChat;
      const flyTimer = setTimeout(() => {
        setUiState("flying-to-chat");
        // If routing with a query, dispatch it after the fly animation lands
        if (query) {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("chat-with-query", { detail: query }));
          }, 1100);
        }
      }, 800);
      return () => clearTimeout(flyTimer);
    }

    const cmd = activeCmd;
    const hasAction = !!cmd.action || cmd.keyword === "tour";

    const dismiss = (): void => {
      setActiveCmd(null);
      setShownSteps(0);
      setShowResponse(false);
      setInput("");
      setUiState("button");
      // Fire navigation action after panel closes (skip easter eggs — already fired on submit)
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
      navTimerRef.current = setTimeout(() => {
        if (cmd.keyword === "tour") router.push("/journey");
        else if (cmd.intent !== "easter_egg") cmd.action?.();
      }, 400);
    };

    // For commands with a navigation action, auto-dismiss after 2s read time
    // For info-only commands (rate, stack, availability), wait for user interaction
    let autoTimer: ReturnType<typeof setTimeout> | undefined;
    if (hasAction) {
      autoTimer = setTimeout(dismiss, 2000);
    }

    // Always dismiss on mouse move, click, or scroll (after a 600ms grace period)
    let armed = false;
    const armTimer = setTimeout(() => { armed = true; }, 600);

    const onInteract = (): void => {
      if (!armed) return;
      dismiss();
    };

    window.addEventListener("mousemove", onInteract, { once: true });
    window.addEventListener("click", onInteract, { once: true });
    window.addEventListener("scroll", onInteract, { once: true, passive: true });

    return () => {
      clearTimeout(armTimer);
      if (autoTimer) clearTimeout(autoTimer);
      window.removeEventListener("mousemove", onInteract);
      window.removeEventListener("click", onInteract);
      window.removeEventListener("scroll", onInteract);
    };
  }, [uiState, activeCmd]);

  // Reappear as button after being hidden (post-command)
  useEffect(() => {
    if (uiState !== "hidden" || !buttonReady) return;
    const t = setTimeout(() => setUiState("button"), 3000);
    return () => clearTimeout(t);
  }, [uiState, buttonReady]);

  // Flying-to-chat animation completion — glow the chat trigger, then open chat
  useEffect(() => {
    if (uiState !== "flying-to-chat") return;
    // Fire glow at ~85% through animation (bubble reaches chat button)
    const glowTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("agent-flying-to-chat"));
    }, 850);
    // Open chat after bubble fully absorbed
    const openTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-chat-widget"));
      setActiveCmd(null);
      setShownSteps(0);
      setShowResponse(false);
      setInput("");
      setUiState("button");
    }, 1100);
    return () => {
      clearTimeout(glowTimer);
      clearTimeout(openTimer);
    };
  }, [uiState]);

  const runCommand = useCallback((cmd: AgentCommand): void => {
    recordCommand(cmd.keyword);
    setActiveCmd(cmd);
    setShownSteps(0);
    setShowResponse(false);
    setUiState("processing");
    // Easter eggs: fire mood change immediately so the hero emoji reacts while processing
    if (cmd.intent === "easter_egg" && cmd.action) {
      cmd.action();
      if (cmd.keyword === "dance") {
        setDanceTried(true);
        try { sessionStorage.setItem("dance-tried", "1"); } catch { /* noop */ }
      }
    }
  }, []);

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const q = input.trim().toLowerCase();
    if (!q) return;

    // 0. Project-context queries — "why", "how", "architecture" map to methodology chips
    if (viewingProject && methodologyChips.length > 0) {
      const contextKeywords: Record<string, number> = {
        why: 0, "why this": 0, "why not": 0, reason: 0,
        how: 2, "how did": 2, ship: 2, process: 2, shipped: 2,
        architecture: 1, arch: 1, design: 1, "why this architecture": 1,
      };
      for (const [kw, idx] of Object.entries(contextKeywords)) {
        if (q.includes(kw) && methodologyChips[idx]) {
          runCommand(methodologyChips[idx].command);
          return;
        }
      }
    }

    // 1. Exact keyword match — instant
    const exact = commands.find((c) => c.keyword === q);
    if (exact) { runCommand(exact); return; }
    // 2. Fuzzy intent match — instant
    const fuzzy = fuzzyMatch(q, commands);
    if (fuzzy) { runCommand(fuzzy.command); return; }
    // 3. Any free-text prompt → route to chat (it has full RAG context)
    runCommand({
      keyword: q,
      intent: "route_to_chat",
      confidence: 0.90,
      steps: [
        { name: "tokenize", detail: `${q.split(/\s+/).length} tokens`, ms: 3 },
        { name: "classify_intent", detail: "free-text query detected", ms: 18 },
        { name: "route_to_chat", detail: "→ chat agent (full context)", ms: 6 },
      ],
      response: "Routing to chat — ask anything there.",
      routeToChat: q,
    });
  };

  const onChipClick = (command: string): void => {
    const match = commands.find((c) => c.keyword === command);
    if (match) runCommand(match);
  };

  if (uiState === "hidden" || modalOpen) return <></>;

  const totalMs = activeCmd?.steps.reduce((s, x) => s + x.ms, 0) ?? 0;

  // Hero portal mount point
  const heroMount = typeof document !== "undefined" ? document.getElementById("hero-agent-mount") : null;

  // When in hero viewport, the agent panel renders inline in the hero via portal.
  // The button state is skipped — we go straight to panel appearance in the hero.
  // When scrolled past hero, it renders as the fixed bottom pill/panel.
  const isHeroInline = inHeroViewport && heroMount;

  // In hero viewport, auto-show panel if button state (agent is always "open" in hero)
  const effectiveUiState = isHeroInline && uiState === "button" ? "panel" : uiState;

  // Chat open/minimized: hero emoji still visible, only pill bar hidden
  const hidePillBar = chatOpen;

  // ── Shared processing/response area (used by both hero and fixed modes) ──
  const processingContent = (
    <AnimatePresence>
      {(effectiveUiState === "processing" || effectiveUiState === "responding") && activeCmd && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          className="mb-2 rounded-xl glass-strong overflow-hidden"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
        >
          <div className="px-4 py-3 font-mono text-small space-y-1">
            <p className="text-caption font-mono text-accent uppercase tracking-wider mb-2">
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
  );

  // ── Shared suggestion chips ──
  const chipsContent = (
    <AnimatePresence>
      {effectiveUiState === "panel" && !activeCmd && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center gap-1.5 flex-wrap px-2"
        >
          {methodologyChips.length > 0
            ? methodologyChips.map((mc, i) => (
                <motion.button
                  key={mc.command.keyword}
                  type="button"
                  onClick={() => runCommand(mc.command)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                  className="px-3 py-1.5 rounded-full glass text-small font-mono text-green-400/70 border-green-500/20 hover:text-green-400 hover:border-green-500/40 hover:bg-green-500/5 transition-all cursor-pointer"
                >
                  {mc.label}
                </motion.button>
              ))
            : visibleChips.map((chip, i) => (
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
              ))
          }
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── Hero inline content — emoji face (closed) or agent input (open) ──
  const heroContent = (
    <div className="max-w-[440px] mx-auto">
      <AnimatePresence mode="wait">
        {!heroAgentOpen ? (
          /* ── Agent emoji face — animated, clickable, with mood picker ── */
          <motion.div
            key="agent-emoji"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-3"
          >
            <div
              onClick={() => {
                if (emojiMoodOverride === "dancing") return; // don't open input while dancing
                setBubblePhase("hidden");
                setHeroAgentOpen(true);
                // Hide chat widget when hero agent opens
                window.dispatchEvent(new CustomEvent("hide-chat-widget"));
                setTimeout(() => inputRef.current?.focus(), 200);
              }}
              onMouseEnter={() => setEmojiHovered(true)}
              onMouseLeave={() => setEmojiHovered(false)}
              className="cursor-pointer flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {emojiMoodOverride === "dancing" ? (
                  /* ── Dancing stick figure ── */
                  <motion.div
                    key="dancing-figure"
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.3, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="flex items-center justify-center"
                  >
                    <AgentEmoji size={40} mood="dancing" />
                  </motion.div>
                ) : (
                  /* ── Normal emoji face in circle ── */
                  <motion.div
                    key="emoji-face"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    className="relative w-16 h-16 rounded-full"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(74,222,128,0.3), 0 0 20px rgba(74,222,128,0.15)",
                          "0 0 0 12px rgba(74,222,128,0), 0 0 30px rgba(160,120,104,0.2)",
                          "0 0 0 0 rgba(74,222,128,0.3), 0 0 20px rgba(74,222,128,0.15)",
                        ],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-card-border to-card border border-accent-status/20 flex items-center justify-center">
                      <AgentEmoji size={40} hovered={emojiHovered} mood={emojiMoodOverride ?? persistentMood} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mood label / picker / hints */}
            <AnimatePresence mode="wait">
              {emojiMoodOverride ? (
                /* ── Active override label ── */
                <motion.p
                  key={`override-${emojiMoodOverride}`}
                  className="font-mono text-caption text-accent"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  {emojiMoodOverride === "dancing" ? "vibing..." : emojiMoodOverride === "sleeping" ? "zzz..." : emojiMoodOverride === "surprised" ? "whoa!" : emojiMoodOverride}
                </motion.p>
              ) : bubblePhase === "chips" ? (
                /* ── Mood face picker ── */
                <motion.div
                  key="mood-picker"
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex items-center gap-1"
                >
                  {([
                    { mood: "default" as EmojiMood, tip: "normal" },
                    { mood: "curious" as EmojiMood, tip: "curious" },
                    { mood: "proud" as EmojiMood, tip: "happy" },
                    { mood: "sleeping" as EmojiMood, tip: "sleepy" },
                    { mood: "confused" as EmojiMood, tip: "confused" },
                  ]).map((m, i) => (
                    <motion.button
                      key={m.mood}
                      type="button"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06, type: "spring", stiffness: 500, damping: 20 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.dispatchEvent(new CustomEvent("emoji-mood", { detail: { mood: m.mood, persistent: true } }));
                        setBubblePhase("hidden");
                        bubbleCycleRef.current++;
                      }}
                      title={m.tip}
                      className={`group relative w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        persistentMood === m.mood
                          ? "bg-accent/15 ring-1 ring-accent/40 scale-110"
                          : "hover:bg-foreground/5 hover:scale-110"
                      }`}
                    >
                      <AgentEmoji size={18} mood={m.mood} />
                      {/* Tooltip on hover */}
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-mono text-accent bg-card border border-card-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {m.tip}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              ) : bubblePhase === "dance-hint" ? (
                /* ── Dance suggestion — clickable ── */
                <motion.p
                  key="dance-hint"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="font-mono text-caption text-accent-status/70"
                >
                  wanna see me{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBubblePhase("hidden");
                      setDanceTried(true);
                      try { sessionStorage.setItem("dance-tried", "1"); } catch { /* noop */ }
                      window.dispatchEvent(new CustomEvent("emoji-mood", { detail: "dancing" }));
                      bubbleCycleRef.current++;
                    }}
                    className="text-accent hover:text-accent/80 underline underline-offset-2 cursor-pointer transition-colors"
                  >
                    dance
                  </button>
                  ?
                </motion.p>
              ) : bubblePhase === "dots" ? (
                /* ── Typing dots ── */
                <motion.div
                  key="dots"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="w-1 h-1 rounded-full bg-accent-status" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </motion.div>
              ) : bubblePhase === "hint" ? (
                /* ── "psst..." text ── */
                <motion.p
                  key="psst"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="font-mono text-caption text-accent-status/70"
                >
                  psst... change my mood
                </motion.p>
              ) : (
                /* ── Default hint ── */
                <motion.p
                  key="default-hint"
                  className="font-mono text-caption text-accent-status/70"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {emojiHovered ? "let\u2019s talk!" : "I\u2019m alive \u2014 click me"}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ── Agent input bar (after clicking emoji) ── */
          <motion.div
            key="agent-input"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            {processingContent}
            {/* Emoji mood popup — floats above input when easter egg fires */}
            <AnimatePresence>
              {emojiMoodOverride && (
                <motion.div
                  key={emojiMoodOverride}
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex items-center justify-center gap-2 mb-3"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-card-border to-card border border-accent-status/20 flex items-center justify-center">
                    <AgentEmoji size={32} mood={emojiMoodOverride} />
                  </div>
                  <span className="font-mono text-sm text-accent">
                    {emojiMoodOverride === "dancing" ? "vibing..." : emojiMoodOverride === "sleeping" ? "zzz..." : emojiMoodOverride === "surprised" ? "whoa!" : emojiMoodOverride}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <form
              onSubmit={onSubmit}
              className="glass-strong rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}
            >
              <div className="flex items-center gap-3 px-5 py-4">
                <span className="text-accent font-mono text-body font-semibold shrink-0">&#10095;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="ask anything about Ahtesham's work..."
                  disabled={effectiveUiState === "processing" || effectiveUiState === "responding"}
                  className="flex-1 min-w-0 bg-transparent outline-none font-mono text-sm placeholder:text-muted/40 text-foreground disabled:opacity-50"
                />
              </div>
            </form>
            <div className="mt-4">
              {chipsContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ── Fixed bottom panel content (❯ prompt style) ──
  const fixedPanelContent = (
    <>
      {processingContent}
      {chipsContent}
      <form
        onSubmit={onSubmit}
        className="glass-strong rounded-xl overflow-hidden"
        style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.5), 0 0 60px rgba(0,0,0,0.2)" }}
      >
        <div className="flex items-center gap-2 px-4 py-3">
          <span className="text-accent font-mono text-body font-semibold shrink-0">&#10095;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={viewingProject ? `ask about this project...` : inputConfig.placeholder}
            disabled={effectiveUiState === "processing" || effectiveUiState === "responding"}
            className="flex-1 min-w-0 bg-transparent outline-none font-mono text-small placeholder:text-muted/35 text-foreground disabled:opacity-50"
          />
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
    </>
  );

  return (
    <>
      {/* ── Emoji at fixed bottom center (born from boot bubble, throws particles) ── */}
      <AnimatePresence>
        {emojiPhase === "bottom" && inHeroViewport && (
          <motion.div
            key="emoji-bottom"
            className="fixed z-[45] bottom-8 left-1/2"
            initial={{ opacity: 0, scale: 0, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%" }}
            exit={{
              opacity: 0,
              scale: 0.6,
              y: -300,
              x: "-50%",
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                className="relative w-16 h-16 rounded-full bg-gradient-to-br from-card-border to-card border border-accent-status/20 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(74,222,128,0.3), 0 0 20px rgba(74,222,128,0.15)",
                    "0 0 0 14px rgba(74,222,128,0), 0 0 35px rgba(160,120,104,0.25)",
                    "0 0 0 0 rgba(74,222,128,0.3), 0 0 20px rgba(74,222,128,0.15)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <AgentEmoji size={40} />
              </motion.div>
              <motion.p
                className="font-mono text-caption text-accent-status/70"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                writing your story...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero inline agent (portal into hero section — emoji settled or agent open) ── */}
      {isHeroInline && emojiPhase === "settled" && (effectiveUiState === "panel" || effectiveUiState === "processing" || effectiveUiState === "responding") && heroMount &&
        ReactDOM.createPortal(heroContent, heroMount)
      }

      {/* ── Fixed bottom agent (when scrolled past hero, hidden when chat active) ── */}
      {!isHeroInline && !hidePillBar && (
        <>
          {/* Agent pill bar (button state — shows label + input) */}
          <AnimatePresence>
            {uiState === "button" && buttonReady && (
              <div className="fixed z-[100] bottom-5 left-1/2 -translate-x-1/2">
                {(() => {
                  const p = SECTION_PERSONALITY[activeSection] ?? SECTION_PERSONALITY.hero;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-3 glass-strong rounded-full px-4 py-2.5 cursor-pointer w-[380px]"
                      style={{
                        boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 12px ${p.glowColor}`,
                      }}
                      onClick={() => {
                        setUiState("panel");
                        setTimeout(() => inputRef.current?.focus(), 150);
                      }}
                    >
                      <motion.div
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-card-border to-card border border-accent-status/20 flex items-center justify-center shrink-0"
                        key={activeSection}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <AgentEmoji size={24} mood={emojiMoodOverride ?? (activeSection === "projects" ? "curious" : activeSection === "log" ? "proud" : activeSection === "contact" ? "waving" : persistentMood)} />
                      </motion.div>
                      <span className="flex-1 font-mono text-small text-muted/25 bg-foreground/[0.03] rounded-full px-4 py-1 truncate">
                        {inputConfig.placeholder}
                      </span>
                    </motion.div>
                  );
                })()}
              </div>
            )}
          </AnimatePresence>

          {/* Panel (expanded command bar — fixed bottom) */}
          <AnimatePresence>
            {(uiState === "panel" || uiState === "processing" || uiState === "responding") && (
              <div className="fixed z-[100] bottom-5 left-1/2 -translate-x-1/2 w-[calc(100vw-1.5rem)] max-w-[440px]">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {fixedPanelContent}
              </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ── Flying-to-chat bubble animation ── */}
      <AnimatePresence>
        {uiState === "flying-to-chat" && (
          <motion.div
            ref={flyRef}
            className="fixed z-[100]"
            initial={{
              /* Center-bottom: same position as agent button */
              bottom: 20,
              left: (typeof window !== "undefined" ? window.innerWidth / 2 : 500) - 22,
              width: 44,
              height: 44,
              borderRadius: 9999,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              /* Land exactly on chat trigger: right-5 = 20px from right, w-11 = 44px */
              bottom: 20,
              left: (typeof window !== "undefined" ? window.innerWidth : 1000) - 20 - 44,
              width: 44,
              height: 44,
              borderRadius: 9999,
              opacity: [1, 1, 1, 0.9, 0],
              scale: [1, 1.15, 1, 0.8, 0.2],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 1,
              ease: [0.25, 0.1, 0.25, 1],
              left: { duration: 1, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 1, times: [0, 0.2, 0.6, 0.85, 1] },
              scale: { duration: 1, times: [0, 0.15, 0.5, 0.85, 1] },
            }}
          >
            {/* Inner glowing orb */}
            <motion.div
              className="w-full h-full rounded-full"
              style={{
                background: "radial-gradient(circle at 40% 40%, rgba(74,222,128,0.9) 0%, rgba(74,222,128,0.5) 40%, rgba(74,222,128,0.15) 70%, transparent 100%)",
                boxShadow: "0 0 20px rgba(74,222,128,0.6), 0 0 40px rgba(74,222,128,0.3), 0 0 80px rgba(74,222,128,0.15), inset 0 0 15px rgba(74,222,128,0.3)",
                border: "1.5px solid rgba(74,222,128,0.5)",
              }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(74,222,128,0.6), 0 0 40px rgba(74,222,128,0.3), 0 0 80px rgba(74,222,128,0.15), inset 0 0 15px rgba(74,222,128,0.3)",
                  "0 0 30px rgba(74,222,128,0.8), 0 0 60px rgba(74,222,128,0.4), 0 0 100px rgba(74,222,128,0.2), inset 0 0 20px rgba(74,222,128,0.4)",
                  "0 0 15px rgba(74,222,128,0.5), 0 0 30px rgba(74,222,128,0.2), 0 0 60px rgba(74,222,128,0.1), inset 0 0 10px rgba(74,222,128,0.2)",
                ],
              }}
              transition={{ duration: 1, times: [0, 0.5, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Build pipeline popup */}
      <AnimatePresence>
        {showBuildPopup && (
          <BuildPopup onDone={() => setShowBuildPopup(false)} />
        )}
      </AnimatePresence>

      {/* Whoami popup */}
      <AnimatePresence>
        {showWhoami && (
          <WhoamiPopup onDone={() => setShowWhoami(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
