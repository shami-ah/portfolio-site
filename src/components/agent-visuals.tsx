"use client";

import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { openCvDrawer } from "@/components/cv-drawer";

/* ------------------------------------------------------------------ */
/*  Build pipeline popup — 5-second centered overlay                  */
/* ------------------------------------------------------------------ */

export const BUILD_STEPS = [
  { label: "Product", detail: "Pin the outcome" },
  { label: "Architect", detail: "Sketch the flow" },
  { label: "Spec", detail: "Schema + RLS + edge cases" },
  { label: "Scaffold", detail: "Agent generates from spec" },
  { label: "Review", detail: "CodeLens catches what I miss" },
  { label: "Ship", detail: "Feature flag, 10%, then 100%" },
];

export function BuildPopup({ onDone }: { onDone: () => void }): React.ReactElement {
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
/*  Agent Stage sub-components (internal, not exported)                */
/* ------------------------------------------------------------------ */

export const STAGE_MESSAGES = [
  { text: "ask me about fit", duration: 4200 },
  { text: "show project proof", duration: 4200 },
  { text: "estimate scope", duration: 3800 },
  { text: "check my stack", duration: 3800 },
  { text: "open the agent", duration: 4200 },
];

export const DATA_FRAGS = ["0x4a", "RAG", "LLM", "RLS"];

export function StageSpeechBubble({ visible, emojiHovered }: { visible: boolean; emojiHovered: boolean }): React.ReactElement {
  const [msgIdx, setMsgIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Hover typing state
  const [hoverCharIdx, setHoverCharIdx] = useState(0);
  const [hoverTyped, setHoverTyped] = useState("");
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hoverMsg = "click to open";

  // Type hover message character by character
  useEffect(() => {
    if (!emojiHovered) {
      const frame = requestAnimationFrame(() => {
        setHoverCharIdx(0);
        setHoverTyped("");
      });
      clearTimeout(hoverTimerRef.current);
      return () => cancelAnimationFrame(frame);
    }
    if (hoverCharIdx < hoverMsg.length) {
      hoverTimerRef.current = setTimeout(() => {
        setHoverCharIdx((c) => c + 1);
        setHoverTyped(hoverMsg.slice(0, hoverCharIdx + 1));
      }, 30 + Math.random() * 18);
      return () => clearTimeout(hoverTimerRef.current);
    }
  }, [emojiHovered, hoverCharIdx]);

  // Type characters (normal messages)
  useEffect(() => {
    if (!visible || emojiHovered) return;
    const msg = STAGE_MESSAGES[msgIdx];
    if (charIdx < msg.text.length) {
      timerRef.current = setTimeout(() => {
        setCharIdx((c) => c + 1);
        setTyped(msg.text.slice(0, charIdx + 1));
      }, 30 + Math.random() * 18);
      return () => clearTimeout(timerRef.current);
    }
    // Done typing — wait then move to next
    const next = setTimeout(() => {
      const nextIdx = msgIdx + 1 >= STAGE_MESSAGES.length ? 1 : msgIdx + 1;
      setMsgIdx(nextIdx);
      setCharIdx(0);
      setTyped("");
    }, STAGE_MESSAGES[msgIdx].duration);
    return () => clearTimeout(next);
  }, [visible, emojiHovered, msgIdx, charIdx]);

  // Reset when becoming visible
  useEffect(() => {
    if (!visible) return;
    const frame = requestAnimationFrame(() => {
      setMsgIdx(0);
      setCharIdx(0);
      setTyped("");
    });
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  if (!visible) return <></>;

  const displayText = emojiHovered ? hoverTyped : typed;
  const isActivelyTyping = emojiHovered
    ? hoverCharIdx < hoverMsg.length
    : charIdx < STAGE_MESSAGES[msgIdx].text.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.92, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -6, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full shrink-0"
    >
      <div className="relative flex justify-center">
        {/* Bubble — fixed width, text wraps inside */}
        <div className="speech-bubble relative w-[min(330px,calc(100vw-3rem))] md:w-[420px] min-h-[48px] md:min-h-[58px] rounded-[16px] md:rounded-[20px] px-4 py-3 md:px-6 md:py-4 flex items-center justify-center text-center border border-accent-secondary/20 backdrop-blur-xl overflow-hidden"
        >
          <motion.span
            aria-hidden
            className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-accent-status"
            animate={{
              opacity: [0.35, 1, 0.35],
              boxShadow: [
                "0 0 0 0 rgba(74,222,128,0.25)",
                "0 0 0 6px rgba(74,222,128,0)",
                "0 0 0 0 rgba(74,222,128,0.25)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            aria-hidden
            className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-accent-status/60 to-transparent"
            animate={{ x: ["-100%", "100%"], opacity: [0, 0.85, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="speech-text font-mono text-[11px] md:text-sm leading-relaxed text-white/80">
            {displayText}<span className="inline-block w-[2px] h-[13px] ml-0.5 align-middle rounded-full animate-pulse"
              style={{ backgroundColor: "rgba(255,255,255,0.5)", animationDuration: isActivelyTyping ? "0.4s" : "1.2s" }} />
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Mood faces — vertical column on the left, evenly spaced, no overlap
// 220px zone, 38px faces, need ~44px between centers
export const MOOD_POSITIONS = [
  { mood: "curious" as const, label: "curious", style: { top: "34px", left: "40px" } },
  { mood: "proud" as const, label: "proud", style: { top: "34px", left: "184px" } },
  { mood: "confused" as const, label: "focus", style: { top: "166px", left: "42px" } },
  { mood: "dancing" as const, label: "dance", style: { top: "166px", left: "184px" } },
];

/* ------------------------------------------------------------------ */
/*  Agent emoji face — shared between hero and pill bar                */
/* ------------------------------------------------------------------ */

export type EmojiMood = "default" | "curious" | "proud" | "waving" | "confused" | "sleeping" | "surprised" | "dancing";

export function AgentEmoji({ size = 40, hovered = false, mood = "default" }: { size?: number; hovered?: boolean; mood?: EmojiMood }): React.ReactElement {
  const s = size;
  const fc = "fill-[var(--agent-emoji)]";
  const sc = "stroke-[var(--agent-emoji)]";
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

  // Disco mode — round face with ecstatic grin, bouncing, musical notes floating out
  if (isDancing && s > 40) {
    const notes = ["♪", "♫", "♬"];
    return (
      <div className="relative shrink-0" style={{ width: s, height: s }}>
        {/* Musical notes floating up */}
        {notes.map((note, i) => (
          <motion.span
            key={i}
            className="absolute text-accent-status/60 pointer-events-none select-none"
            style={{ fontSize: s * 0.18, left: `${20 + i * 28}%`, top: "10%" }}
            animate={{
              y: [0, -s * 0.6],
              x: [0, (i % 2 === 0 ? 1 : -1) * s * 0.15],
              opacity: [0, 0.8, 0],
              rotate: [0, (i % 2 === 0 ? 15 : -15)],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
          >
            {note}
          </motion.span>
        ))}
        {/* The face itself — same viewBox as normal, but bouncing */}
        <motion.svg
          viewBox="0 0 48 48"
          width={s}
          height={s}
          fill="none"
          style={{ filter: "drop-shadow(0 0 8px rgba(74,222,128,0.4))" }}
          animate={{ y: [0, -4, 0, -2, 0], rotate: [0, -3, 0, 3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Happy squinted eyes — arc shapes */}
          <motion.path className={sc} strokeWidth="2.5" strokeLinecap="round" fill="none"
            initial={{ d: "M 12 18 Q 16 14 20 18" }}
            animate={{ d: ["M 12 18 Q 16 14 20 18", "M 12 19 Q 16 15 20 19", "M 12 18 Q 16 14 20 18"] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path className={sc} strokeWidth="2.5" strokeLinecap="round" fill="none"
            initial={{ d: "M 28 18 Q 32 14 36 18" }}
            animate={{ d: ["M 28 18 Q 32 14 36 18", "M 28 19 Q 32 15 36 19", "M 28 18 Q 32 14 36 18"] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Nose */}
          <line x1="24" y1="22" x2="24" y2="27" className={sc} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          {/* Wide open grin */}
          <motion.path
            className={sc}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            initial={{ d: "M 12 30 Q 24 44 36 30" }}
            animate={{ d: ["M 12 30 Q 24 44 36 30", "M 14 31 Q 24 42 34 31", "M 12 30 Q 24 44 36 30"] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
      </div>
    );
  }

  // Proud/happy uses squinted arc-eyes (like disco but calmer)
  const useArcEyes = mood === "proud";
  // Confused uses asymmetric eyes (one higher)
  const isConfused = mood === "confused";
  const isSurprised = mood === "surprised";
  const er = 2.5 * (s > 24 ? 1 : 0.9);

  return (
    <svg viewBox="0 0 48 48" width={s} height={s} fill="none" className="shrink-0" style={{ filter: s > 24 ? "drop-shadow(0 0 6px rgba(74,222,128,0.3))" : "none" }}>
      {/* Eyes — mood-specific */}
      {useArcEyes ? (
        /* Proud: squinted happy arc-eyes */
        <>
          <motion.path className={sc} strokeWidth="2" strokeLinecap="round" fill="none"
            initial={{ d: "M 12 19 Q 16 15 20 19" }}
            animate={{ d: ["M 12 19 Q 16 15 20 19", "M 12 20 Q 16 16 20 20", "M 12 19 Q 16 15 20 19"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path className={sc} strokeWidth="2" strokeLinecap="round" fill="none"
            initial={{ d: "M 28 19 Q 32 15 36 19" }}
            animate={{ d: ["M 28 19 Q 32 15 36 19", "M 28 20 Q 32 16 36 20", "M 28 19 Q 32 15 36 19"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : isSurprised ? (
        /* Surprised: wide open eyes */
        <>
          <motion.circle cx="16" cy="18" r={er * 1.3} className={fc}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle cx="32" cy="18" r={er * 1.3} className={fc}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />
        </>
      ) : (
        /* Default/curious/confused/waving/sleeping/dancing: circle eyes */
        <>
          <motion.circle
            cx="16" cy={isConfused ? 17 : 19} r={er}
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
            cx="32" cy={isConfused ? 21 : 19} r={er}
            className={fc}
            animate={
              isSleeping ? { scaleY: 0.15 }
              : mood === "curious" ? { x: [0, 2, 0] }
              : { scaleY: [1, 0.1, 1] }
            }
            transition={
              mood === "curious"
                ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.3, delay: 2, repeat: isSleeping ? 0 : Infinity, repeatDelay: 3.5 }
            }
          />
        </>
      )}
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
      {/* Confused: raised eyebrow */}
      {isConfused && s > 24 && (
        <motion.line x1="28" y1="13" x2="36" y2="15" className={sc} strokeWidth="1.5" strokeLinecap="round"
          animate={{ y1: [13, 11, 13], y2: [15, 14, 15] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {/* Mouth */}
      <path
        d={hovered && mood === "default" ? "M 14 29 Q 24 40 34 29" : m.rest}
        className={sc}
        strokeWidth={s > 24 ? 2 : 1.5}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Whoami popup — full-screen overlay with about card                 */
/* ------------------------------------------------------------------ */

export const TERM_STEPS = [
  { cmd: "whoami", type: "identity" as const },
  { cmd: "cat location", output: "Islamabad, PK · remote-first" },
  { cmd: "echo $LANGUAGES", output: "EN, UR, PS, SD, AR" },
  { cmd: "cat interests.txt", output: "Snooker, cricket, history, technology" },
  { cmd: "cat superpower.txt", output: "Picks up anything fast" },
  { cmd: "cat philosophy.md", output: "Build the tool when none exists", green: true },
];

export function WhoamiPopup({ onDone }: { onDone: () => void }): React.ReactElement {
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
