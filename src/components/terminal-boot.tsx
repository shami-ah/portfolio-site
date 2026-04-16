"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Check {
  label: string;
  detail: string;
}

const checks: Check[] = [
  { label: "5 years production AI", detail: "since 2019" },
  { label: "250+ projects shipped", detail: "global clients" },
  { label: "1,418 tests passing", detail: "gogaa v0.9.1" },
  { label: "305 patterns active", detail: "codelens v0.3.3" },
  { label: "100+ clients live", detail: "openevent" },
];

interface BootProps {
  /** If true, replays the boot even if already seen this session. */
  force?: boolean;
  /** Called when boot dismisses. */
  onDone?: () => void;
}

export function TerminalBoot({ force = false, onDone }: BootProps): React.ReactElement | null {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<
    "intro" | "checks" | "status" | "launching" | "exit"
  >("intro");
  const [checkStep, setCheckStep] = useState(0);
  const [introTyped, setIntroTyped] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const introText = "$ ./ahtesham init";

  // Short beep on type
  const beep = (): void => {
    if (!soundOn) return;
    try {
      const ctx =
        audioCtxRef.current ??
        new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 680 + Math.random() * 180;
      osc.type = "square";
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // ignore
    }
  };

  // Mount decision: show on every fresh load (reload, direct URL, external
  // referrer). Skip when arriving from an internal page like /cv or /journey.
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load sound preference regardless
    const saved = localStorage.getItem("boot-sound");
    if (saved === "1") setSoundOn(true);

    if (force) {
      setVisible(true);
      return;
    }

    // Detect internal navigation: if the user just came from /cv, /journey,
    // or a /projects/* page, don't replay the intro.
    let cameFromInternal = false;
    try {
      const ref = document.referrer;
      if (ref) {
        const refUrl = new URL(ref);
        if (refUrl.origin === window.location.origin) {
          const p = refUrl.pathname;
          if (p !== "/" && p !== "") cameFromInternal = true;
        }
      }
    } catch {
      // ignore malformed referrer
    }

    if (cameFromInternal) {
      sessionStorage.setItem("boot-complete", "1");
      window.dispatchEvent(new CustomEvent("boot-complete"));
      return;
    }

    // Clear any stale flags from previous sessions and show
    sessionStorage.removeItem("boot-complete");
    setVisible(true);
  }, [force]);

  const dismiss = (): void => {
    setPhase("exit");
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("boot-complete", "1");
      window.dispatchEvent(new CustomEvent("boot-complete"));
      onDone?.();
    }, 500);
  };

  // Phase: intro typing
  useEffect(() => {
    if (!visible || phase !== "intro") return;
    if (introTyped < introText.length) {
      const t = setTimeout(() => {
        setIntroTyped((i) => i + 1);
        beep();
      }, 45);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("checks"), 280);
    return () => clearTimeout(t);
  }, [visible, phase, introTyped, soundOn]);

  // Phase: checks cascade
  useEffect(() => {
    if (!visible || phase !== "checks") return;
    if (checkStep >= checks.length) {
      const t = setTimeout(() => setPhase("status"), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => {
        setCheckStep((s) => s + 1);
        beep();
      },
      checkStep === 0 ? 180 : 230,
    );
    return () => clearTimeout(t);
  }, [visible, phase, checkStep, soundOn]);

  // Phase: status → launching → exit
  useEffect(() => {
    if (!visible) return;
    if (phase === "status") {
      const t = setTimeout(() => setPhase("launching"), 500);
      return () => clearTimeout(t);
    }
    if (phase === "launching") {
      const t = setTimeout(dismiss, 650);
      return () => clearTimeout(t);
    }
  }, [visible, phase]);

  const toggleSound = (): void => {
    const next = !soundOn;
    setSoundOn(next);
    localStorage.setItem("boot-sound", next ? "1" : "0");
  };

  if (!visible) return null;

  const progress =
    phase === "intro"
      ? 0
      : phase === "checks"
        ? (checkStep / checks.length) * 85
        : phase === "status"
          ? 90
          : 100;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] bg-background flex items-center justify-center px-4"
        >
          {/* Backdrop grid */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/[0.05] rounded-full blur-3xl pointer-events-none" />

          {/* Terminal window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={
              phase === "exit"
                ? { opacity: 0, scale: 1.08, filter: "blur(10px)" }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={{ duration: phase === "exit" ? 0.5 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl rounded-xl border border-accent/30 bg-card/90 backdrop-blur-md shadow-2xl shadow-accent/20 font-mono text-sm overflow-hidden"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border bg-card/60">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <p className="text-[10px] text-muted/60 ml-auto font-mono">
                ahtesham@portfolio ~ zsh
              </p>
            </div>

            {/* Body */}
            <div className="p-5 md:p-6 space-y-3 min-h-[320px]">
              {/* Intro command line */}
              <p className="text-[13px] leading-relaxed">
                <span className="text-accent">❯</span>{" "}
                <span className="text-foreground/90">
                  {introText.slice(0, introTyped)}
                </span>
                {phase === "intro" && (
                  <span className="inline-block w-[7px] h-[14px] bg-accent/80 ml-0.5 translate-y-[2px] animate-pulse" />
                )}
              </p>

              {/* Progress bar */}
              {phase !== "intro" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="pt-2"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-muted/70 tracking-widest uppercase">
                      {phase === "checks" && "loading modules"}
                      {phase === "status" && "status"}
                      {phase === "launching" && "launching"}
                      {phase === "exit" && "launching"}
                    </span>
                    <span className="text-[10px] font-mono text-accent/80 tabular-nums">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="h-1 bg-background/50 rounded-full overflow-hidden border border-card-border/60">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-accent via-accent to-accent/80"
                    />
                  </div>
                </motion.div>
              )}

              {/* Check list */}
              <div className="space-y-1.5 pt-2">
                {checks.map((c, i) => {
                  const visibleCheck = i < checkStep;
                  return (
                    <motion.div
                      key={c.label}
                      initial={{ opacity: 0, x: -6 }}
                      animate={
                        visibleCheck
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: -6 }
                      }
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="flex items-center gap-2.5 text-[12px]"
                    >
                      <span className="text-green-400 shrink-0">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span className="text-foreground/90 flex-1">{c.label}</span>
                      <span className="text-muted/40 text-[10px] font-mono">
                        {c.detail}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Status lines */}
              <AnimatePresence>
                {(phase === "status" ||
                  phase === "launching" ||
                  phase === "exit") && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[12px] pt-3 border-t border-card-border/50 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                    <span className="text-muted/60">status:</span>
                    <span className="text-green-400">ready</span>
                  </motion.p>
                )}
                {(phase === "launching" || phase === "exit") && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[12px] text-accent flex items-center gap-2"
                  >
                    <span className="text-accent">❯</span>
                    launching portfolio
                    <span className="inline-flex gap-0.5">
                      <span className="animate-pulse">.</span>
                      <span className="animate-pulse" style={{ animationDelay: "0.15s" }}>.</span>
                      <span className="animate-pulse" style={{ animationDelay: "0.3s" }}>.</span>
                    </span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="absolute bottom-6 right-6 flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundOn ? "Mute" : "Unmute"}
              className="text-muted/40 hover:text-muted transition-colors"
            >
              {soundOn ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="text-[10px] font-mono text-muted/40 hover:text-muted transition-colors"
            >
              skip →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
