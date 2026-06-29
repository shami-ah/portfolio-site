"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { AgentEmoji } from "@/components/agent-visuals";

export type Room = "home" | "projects" | "experience" | "toolbelt" | "contact";
export const roomOrder: Room[] = ["home", "projects", "experience", "toolbelt", "contact"];

/* ─── SVG CHARACTER ─── consistent style across all rooms ─── */

const G = "rgba(74,222,128,";
const B = "rgba(16,17,22,";
const S = "rgba(173,172,166,";

/** The character SVG — same guy, one hand on wire, pointing forward. Used on Home wire. */
function CharacterSVG({ excited }: { excited?: boolean }): React.ReactElement {
  return (
    <svg width="90" height="100" viewBox="0 0 90 100" fill="none" aria-hidden="true">
      <path d="M38 18C34 10 38 2 42 0" stroke={`${G}0.7)`} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="42" cy="2" r="3" fill={`${G}0.9)`} />
      <circle cx="42" cy="28" r="14" fill={`${B}0.98)`} stroke={`${G}0.4)`} strokeWidth="1.5" />
      <circle cx="38" cy="26" r="2" fill={`${G}1)`} />
      <circle cx="46" cy="26" r="2" fill={`${G}1)`} />
      {excited ? (
        <ellipse cx="42" cy="34" rx="4" ry="3" fill={`${G}0.3)`} stroke={`${G}1)`} strokeWidth="1.5" />
      ) : (
        <path d="M38 34C40 36 46 36 48 34" stroke={`${G}1)`} strokeWidth="1.8" strokeLinecap="round" />
      )}
      <rect x="34" y="44" width="16" height="22" rx="8" fill={`${B}0.98)`} stroke={`${G}0.35)`} strokeWidth="1.5" transform="rotate(5 42 55)" />
      <motion.path d="M50 50C60 48 70 42 78 38" stroke={`${G}0.65)`} strokeWidth="3.5" strokeLinecap="round"
        animate={{ d: ["M50 50C60 48 70 42 78 38", "M50 50C60 46 72 40 80 36", "M50 50C60 48 70 42 78 38"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle cx="78" cy="38" r="2.5" fill={`${G}0.8)`}
        animate={{ cx: [78, 80, 78], cy: [38, 36, 38] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <path d="M38 65L30 80" stroke={`${S}0.65)`} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M44 65L52 78" stroke={`${S}0.65)`} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M27 80H35" stroke={`${S}0.6)`} strokeWidth="3" strokeLinecap="round" />
      <path d="M50 78H58" stroke={`${S}0.6)`} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ─── CURTAIN PULL ─── character hangs from wire, pulls next room down like a curtain ─── */

const PULL_THRESHOLD = 90;
const PULL_MAX = 350;
const WIRE_REST = 56;

/** Preview content shown inside the curtain as it's being pulled */
export function NextRoomPreview({ room }: { room: Room }): React.ReactElement {
  const nextIdx = roomOrder.indexOf(room) + 1;
  const nextRoom = roomOrder[nextIdx];
  const labels: Record<Room, { tag: string; title: string; desc: string }> = {
    home: { tag: "", title: "", desc: "" },
    projects: { tag: "what I've shipped", title: "Projects", desc: "Four flagship builds with clean proof and full case files." },
    experience: { tag: "work history + thinking", title: "Experience + Writing", desc: "Career proof and written thinking, side by side." },
    toolbelt: { tag: "choose what to inspect", title: "Skills + CV + Chat", desc: "Skills map, downloadable CV, and a live agent." },
    contact: { tag: "deploy pipeline", title: "Deploy me.", desc: "One engineer, full ownership, zero handoffs." },
  };
  if (!nextRoom) return <></>;
  const { tag, title, desc } = labels[nextRoom];
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <p className="font-mono text-caption uppercase tracking-[0.28em] text-accent">{tag}</p>
      <h2 className="mt-4 text-5xl font-bold md:text-7xl">{title}</h2>
      <p className="mx-auto mt-5 max-w-2xl text-muted md:text-lg">{desc}</p>
    </div>
  );
}

export function CurtainPullAgent({
  room,
  onNext,
  nextRoomContent,
}: {
  room: Room;
  onNext: () => void;
  nextRoomContent: React.ReactNode;
}): React.ReactElement {
  const roomIdx = roomOrder.indexOf(room);
  const isLast = roomIdx === roomOrder.length - 1;

  const [showHint, setShowHint] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [committed, setCommitted] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pullY = useMotionValue(0);

  // Wire stretches with pull
  const wireHeight = useTransform(pullY, [0, PULL_MAX], [WIRE_REST, WIRE_REST + PULL_MAX]);
  // Curtain slides down from top: starts at -100vh, moves to 0
  const curtainY = useTransform(pullY, [0, PULL_MAX], [-100, 0]);
  // Curtain opacity
  const curtainOpacity = useTransform(pullY, [0, 40, PULL_MAX], [0, 0.6, 1]);

  useEffect(() => {
    setShowHint(false);
    setCommitted(false);
    hintTimer.current = setTimeout(() => setShowHint(true), 4000);
    return () => clearTimeout(hintTimer.current);
  }, [room]);

  const handleDrag = useCallback(
    (_: unknown, info: { offset: { y: number } }) => {
      if (committed) return;
      setIsDragging(true);
      setShowHint(false);
      const clamped = Math.max(0, Math.min(PULL_MAX, info.offset.y));
      pullY.set(clamped);
    },
    [pullY, committed],
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
      if (committed) return;
      setIsDragging(false);
      const fast = Math.abs(info.velocity.y) > 400;
      const pastThreshold = info.offset.y > PULL_THRESHOLD;

      if ((pastThreshold || fast) && !isLast) {
        // Commit — animate curtain fully down then switch rooms
        setCommitted(true);
        animate(pullY, PULL_MAX, {
          type: "spring",
          stiffness: 200,
          damping: 28,
          onComplete: () => {
            onNext();
            pullY.set(0);
            setCommitted(false);
          },
        });
      } else {
        // Snap back
        animate(pullY, 0, { type: "spring", stiffness: 400, damping: 30 });
      }
    },
    [isLast, onNext, pullY, committed],
  );

  const curtainTranslateY = useTransform(curtainY, (v) => `${v}vh`);

  if (isLast) {
    return <div className="hidden" aria-hidden="true" />;
  }

  return (
    <>
      {/* ── Curtain: next room preview slides down from top ── */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-screen overflow-hidden"
        style={{
          y: curtainTranslateY,
          opacity: curtainOpacity,
        }}
        aria-hidden={!committed}
      >
        {/* Curtain visual — frosted glass + glow */}
        <div className="absolute inset-0 bg-background/[0.97] backdrop-blur-xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(74,222,128,0.14),transparent_50%)]" />
        {/* Bottom edge glow — the "fold" of the curtain */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-green-400/40 shadow-[0_0_30px_rgba(74,222,128,0.4)]" />
        {/* Next room content preview */}
        <div className="relative h-full overflow-hidden px-5 pt-16 md:px-8 md:pl-28 md:pt-20">
          {nextRoomContent}
        </div>
      </motion.div>

      {/* ── Wire + Character ── */}
      <div className="fixed top-0 right-[200px] z-[65]" style={{ width: 200 }}>
        {/* Wire line from top edge to character */}
        <motion.div
          className="absolute top-0 w-px"
          style={{ left: 45, height: wireHeight }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-green-400/60 via-green-400/40 to-green-400/25 shadow-[0_0_12px_rgba(74,222,128,0.3)]" />
          {/* Energy pulse flows down */}
          {!isDragging && !committed && (
            <motion.div
              className="absolute left-0 top-0 h-10 w-px bg-gradient-to-b from-transparent via-green-300 to-transparent"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }}
            />
          )}
          {/* Curtain attachment line — connects wire to curtain edge */}
          {(isDragging || committed) && (
            <div className="absolute bottom-0 left-[-20px] right-[-20px] h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
          )}
        </motion.div>

        {/* Draggable character */}
        <motion.div
          drag={committed ? false : "y"}
          dragConstraints={{ top: 0, bottom: PULL_MAX }}
          dragElastic={0.06}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="absolute cursor-grab active:cursor-grabbing"
          style={{ left: 0, top: WIRE_REST - 10, y: pullY }}
          role="button"
          tabIndex={0}
          aria-label={`Pull down to go to ${roomOrder[roomIdx + 1]}`}
        >
          {/* Character with idle sway */}
          <motion.div
            animate={isDragging || committed ? {} : { y: [-1, 2, -1], rotate: [-1, 1, -1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <CharacterSVG excited={isDragging || committed} />
          </motion.div>

          {/* Hint bubble */}
          <AnimatePresence>
            {showHint && !isDragging && !committed && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-wide text-accent"
              >
                {/* Thought bubble dots */}
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-[2px]">
                  <span className="h-1 w-1 rounded-full bg-accent/40" />
                  <span className="h-[3px] w-[3px] rounded-full bg-accent/30" />
                </span>
                <span className="rounded-full border border-accent/20 bg-card/90 px-2.5 py-1 shadow-[0_0_12px_rgba(74,222,128,0.06)] backdrop-blur-xl">
                  pull me ↓
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
