"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStatus } from "@/lib/use-status";
import { Check, Volume2, VolumeX } from "lucide-react";

interface Check {
  label: string;
  detail: string;
}

interface BootProps {
  /** If true, replays the boot even if already seen this session. */
  force?: boolean;
  /** Called when boot dismisses. */
  onDone?: () => void;
}

export function TerminalBoot({ force = false, onDone }: BootProps): React.ReactElement | null {
  const { status } = useStatus();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<
    "intro" | "checks" | "status" | "launching" | "exit"
  >("intro");
  const [checkStep, setCheckStep] = useState(0);
  const [introTyped, setIntroTyped] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const introText = "$ shami init --mode=command-center";

  // Classify visitor based on referrer
  const [visitorClass, setVisitorClass] = useState({ referrer: "direct", intent: "curious_explorer", persona: "explorer" });
  useEffect(() => {
    if (typeof document === "undefined") return;
    const ref = document.referrer;
    if (ref.includes("linkedin")) setVisitorClass({ referrer: "linkedin.com", intent: "likely_hiring", persona: "decision_maker" });
    else if (ref.includes("github")) setVisitorClass({ referrer: "github.com", intent: "likely_developer", persona: "technical_evaluator" });
    else if (ref.includes("upwork")) setVisitorClass({ referrer: "upwork.com", intent: "potential_client", persona: "buyer" });
    else if (ref.includes("google")) setVisitorClass({ referrer: "google.com", intent: "researcher", persona: "explorer" });
    else if (ref.includes("twitter") || ref.includes("x.com")) setVisitorClass({ referrer: "x.com", intent: "social_referral", persona: "curious_visitor" });
  }, []);

  const checks: Check[] = [
    { label: "detecting visitor", detail: "scanning" },
    { label: `referrer: ${visitorClass.referrer}`, detail: "classified" },
    { label: `intent: ${visitorClass.intent}`, detail: `conf 0.87` },
    { label: `optimizing for: ${visitorClass.persona}`, detail: "layout ready" },
    { label: `${status.openevent.clients}+ clients live`, detail: "openevent" },
    { label: "ready", detail: "personalized for you" },
  ];

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

  // Mount decision: show ONCE (persisted via localStorage). After that,
  // never on reload unless a "replay-intro" event is dispatched or the
  // localStorage flag is manually cleared (via /replay command).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("boot-sound");
    if (saved === "1") setSoundOn(true);

    const seen = localStorage.getItem("boot-ever-seen") === "1";

    // Listen for replay events (from agent/palette commands)
    // Detail can specify { slow: true } for slower replay
    const onReplay = (e: Event): void => {
      const slow = (e as CustomEvent<{ slow?: boolean }>).detail?.slow ?? false;
      localStorage.removeItem("boot-ever-seen");
      sessionStorage.removeItem("boot-complete");
      if (slow) sessionStorage.setItem("boot-slow", "1");
      else sessionStorage.removeItem("boot-slow");
      setPhase("intro");
      setIntroTyped(0);
      setCheckStep(0);
      setVisible(true);
    };
    window.addEventListener("replay-intro", onReplay);

    const closeRestoredOverlay = (): void => {
      const complete = sessionStorage.getItem("boot-complete") === "1";
      const alreadySeen = localStorage.getItem("boot-ever-seen") === "1";
      if (!complete && !alreadySeen) return;

      setVisible(false);
      sessionStorage.setItem("boot-complete", "1");
      window.dispatchEvent(new CustomEvent("boot-complete"));
      window.dispatchEvent(new CustomEvent("agent-button-ready"));
    };

    window.addEventListener("pageshow", closeRestoredOverlay);
    document.addEventListener("visibilitychange", closeRestoredOverlay);

    if (force || !seen) {
      setVisible(true);
      return () => {
        window.removeEventListener("replay-intro", onReplay);
        window.removeEventListener("pageshow", closeRestoredOverlay);
        document.removeEventListener("visibilitychange", closeRestoredOverlay);
      };
    }

    // Already seen — signal complete immediately so Hero etc. can proceed
    sessionStorage.setItem("boot-complete", "1");
    window.dispatchEvent(new CustomEvent("boot-complete"));
    return () => {
      window.removeEventListener("replay-intro", onReplay);
      window.removeEventListener("pageshow", closeRestoredOverlay);
      document.removeEventListener("visibilitychange", closeRestoredOverlay);
    };
  }, [force]);

  const dismiss = (): void => {
    setPhase("exit");

    // Timeline:
    // 0ms      — content starts fading, terminal starts shrinking
    // 800ms    — terminal nearly collapsed, fire hero streaming
    // 1200ms   — terminal fully collapsed into orb at agent position
    // 1300ms   — agent button appears, particles burst outward
    // 1500ms   — hero elements start materializing
    // 2200ms   — cleanup

    // Hero starts streaming while terminal is still collapsing
    setTimeout(() => {
      sessionStorage.setItem("boot-complete", "1");
      window.dispatchEvent(new CustomEvent("boot-complete"));
    }, 800);

    // Agent button ready + particle burst
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("agent-button-ready"));
      window.dispatchEvent(new CustomEvent("boot-particles"));
    }, 1300);

    // Cleanup
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem("boot-ever-seen", "1");
      onDone?.();
    }, 2200);
  };

  // Speed multiplier: 1x for first visit, 2.5x for replay (slower so user can read)
  const slow = typeof sessionStorage !== "undefined" && sessionStorage.getItem("boot-slow") === "1";
  const m = slow ? 2.5 : 1;

  // Phase: intro typing
  useEffect(() => {
    if (!visible || phase !== "intro") return;
    if (introTyped < introText.length) {
      const t = setTimeout(() => {
        setIntroTyped((i) => i + 1);
        beep();
      }, 18 * m);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("checks"), 90 * m);
    return () => clearTimeout(t);
  }, [visible, phase, introTyped, soundOn, m]);

  // Phase: checks cascade
  useEffect(() => {
    if (!visible || phase !== "checks") return;
    if (checkStep >= checks.length) {
      const t = setTimeout(() => setPhase("status"), 140 * m);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => {
        setCheckStep((s) => s + 1);
        beep();
      },
      80 * m,
    );
    return () => clearTimeout(t);
  }, [visible, phase, checkStep, soundOn, m]);

  // Phase: status → launching → exit
  useEffect(() => {
    if (!visible) return;
    if (phase === "status") {
      const t = setTimeout(() => setPhase("launching"), 220 * m);
      return () => clearTimeout(t);
    }
    if (phase === "launching") {
      const t = setTimeout(dismiss, 280);
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
          transition={{ duration: 0.1 }}
          className="fixed inset-0 z-[200] bg-background flex items-center justify-center px-4"
          style={
            phase === "exit"
              ? {
                  animation: "boot-collapse 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards",
                }
              : undefined
          }
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

          {/* Orb glow at landing point */}
          {phase === "exit" && (
            <div
              className="fixed z-[201] w-10 h-10 rounded-full pointer-events-none"
              style={{
                left: "50%",
                bottom: "36px",
                transform: "translateX(-50%) scale(0)",
                background: "radial-gradient(circle, var(--accent-status) 0%, rgba(74,222,128,0.3) 40%, transparent 70%)",
                animation: "orb-glow 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.7s forwards",
              }}
            />
          )}

          {/* Terminal window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl rounded-xl border border-accent/20 bg-card/80 backdrop-blur-md shadow-2xl shadow-accent/20 font-mono text-sm overflow-hidden"
            style={
              phase === "exit"
                ? { animation: "boot-content-fade 0.35s ease-out forwards" }
                : undefined
            }
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border bg-card/60">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <p className="text-caption text-muted/60 ml-auto font-mono">
                shami@command-center ~ zsh
              </p>
            </div>

            {/* Body */}
            <div className="p-5 md:p-6 space-y-3 min-h-[320px]">
              {/* Intro command line */}
              <p className="text-body leading-relaxed">
                <span className="text-accent">❯</span>{" "}
                <span className="text-foreground/80">
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
                    <span className="text-caption text-muted/80 tracking-widest uppercase">
                      {phase === "checks" && "loading modules"}
                      {phase === "status" && "status"}
                      {phase === "launching" && "launching"}
                      {phase === "exit" && "launching"}
                    </span>
                    <span className="text-caption font-mono text-accent/80 tabular-nums">
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
                      className="flex items-center gap-2.5 text-small"
                    >
                      <span className="text-green-400 shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span className="text-foreground/80 flex-1">{c.label}</span>
                      <span className="text-muted/40 text-caption font-mono">
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
                    key="status-ready"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-small pt-3 border-t border-card-border/40 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                    <span className="text-muted/60">status:</span>
                    <span className="text-green-400">ready</span>
                  </motion.p>
                )}
                {(phase === "launching" || phase === "exit") && (
                  <motion.p
                    key="status-launching"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-small text-accent flex items-center gap-2"
                  >
                    <span className="text-accent">❯</span>
                    entering command center
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
                <Volume2 size={14} />
              ) : (
                <VolumeX size={14} />
              )}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="text-caption font-mono text-muted/40 hover:text-muted transition-colors"
            >
              skip →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
