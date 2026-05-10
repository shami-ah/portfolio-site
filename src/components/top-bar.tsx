"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCcw, Wrench, TrendingUp } from "lucide-react";

export function TopBar(): React.ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const [onProjects, setOnProjects] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // ── Per-button signal suppression ──
  const [seenReboot, setSeenReboot] = useState(false);
  const [seenSetup, setSeenSetup] = useState(false);
  const [seenJourney, setSeenJourney] = useState(false);

  useEffect(() => {
    if (typeof sessionStorage === "undefined") return;
    if (sessionStorage.getItem("seen-reboot") === "1") setSeenReboot(true);
    if (sessionStorage.getItem("seen-setup") === "1") setSeenSetup(true);
    if (sessionStorage.getItem("seen-journey") === "1") setSeenJourney(true);
  }, []);

  const markSeen = useCallback((key: "reboot" | "setup" | "journey"): void => {
    if (typeof sessionStorage !== "undefined") sessionStorage.setItem(`seen-${key}`, "1");
    if (key === "reboot") setSeenReboot(true);
    if (key === "setup") setSeenSetup(true);
    if (key === "journey") setSeenJourney(true);
  }, []);

  // ── Reboot: pressure builds slowly, sacred animations ──
  const [pressure, setPressure] = useState(0);
  const scrollDistance = useRef(0);
  const lastScrollY = useRef(0);

  // ── Setup: glow when relevant section is in view ──
  const [setupGlow, setSetupGlow] = useState(false);

  // ── Journey: meteor rises from bottom to button ──
  const [meteorProgress, setMeteorProgress] = useState(0); // 0-100
  const [meteorLanded, setMeteorLanded] = useState(false);
  const journeyBtnRef = useRef<HTMLAnchorElement>(null);
  const [journeyPos, setJourneyPos] = useState({ cx: 0, cy: 0, bottom: 0 });
  const meteorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const meteorAnimRef = useRef<number | null>(null);
  const meteorAutoMode = useRef(false); // true = time-based animation active
  const meteorProgressRef = useRef(0);

  const updatePressure = useCallback(() => {
    setPressure((p) => Math.min(p + 1, 100));
  }, []);

  useEffect(() => {
    const onScroll = (): void => {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);

        // Detect if we're on the projects section (full-bleed scrollytelling)
        const projectsEl = document.getElementById("projects");
        if (projectsEl) {
          const pt = projectsEl.getBoundingClientRect().top;
          const pb = projectsEl.getBoundingClientRect().bottom;
          setOnProjects(pt < 60 && pb > 0);
        }

        // Accumulate total scroll distance for pressure (very gradual)
        const delta = Math.abs(y - lastScrollY.current);
        scrollDistance.current += delta;
        lastScrollY.current = y;

        // Only add pressure every ~2000px of scrolling
        if (scrollDistance.current > 2000) {
          updatePressure();
          scrollDistance.current = 0;
        }

        // Setup glow: activate near mission/stats or projects section
        const mission = document.getElementById("mission");
        const projects = document.getElementById("projects");
        if (mission || projects) {
          const missionTop = mission?.getBoundingClientRect().top ?? Infinity;
          const projectsBottom = projects?.getBoundingClientRect().bottom ?? -Infinity;
          setSetupGlow(missionTop < window.innerHeight * 0.6 && projectsBottom > 0);
        }

        // Journey meteor: time-based when entering contact, scroll-based on retraction
        const contact = document.getElementById("contact");
        if (contact) {
          const vh = window.innerHeight;
          const startScroll = contact.offsetTop - vh;

          // Suppress meteor animation during agent-triggered scrolls
          const agentScrolling = (globalThis as Record<string, unknown>).__agentScrolling === true;

          if (y < startScroll || agentScrolling) {
            // Scrolled above contact — cancel any pending timer/animation and retract
            if (meteorTimerRef.current) { clearTimeout(meteorTimerRef.current); meteorTimerRef.current = null; }
            if (meteorAnimRef.current) { cancelAnimationFrame(meteorAnimRef.current); meteorAnimRef.current = null; }
            meteorAutoMode.current = false;
            setMeteorProgress(0);
            setMeteorLanded(false);
          } else {
            // In contact zone — scroll-based retraction (scroll up pulls the line back)
            const maxScroll = document.documentElement.scrollHeight - vh;
            const totalRange = maxScroll - startScroll;
            if (totalRange > 0) {
              const scrollProgress = ((y - startScroll) / totalRange) * 100;
              // Only retract (never increase via scroll — the timer handles forward motion)
              if (scrollProgress < meteorProgressRef.current) {
                // Cancel any in-progress auto-animation
                if (meteorAnimRef.current) { cancelAnimationFrame(meteorAnimRef.current); meteorAnimRef.current = null; }
                meteorAutoMode.current = false;
                setMeteorProgress(scrollProgress);
                setMeteorLanded(false);
              }
            }
          }
        }

        // Track journey button position
        if (journeyBtnRef.current) {
          const r = journeyBtnRef.current.getBoundingClientRect();
          setJourneyPos({ cx: r.left + r.width / 2, cy: r.top + r.height / 2, bottom: r.bottom });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [updatePressure]);

  // Keep ref in sync with state for scroll handler access
  useEffect(() => { meteorProgressRef.current = meteorProgress; }, [meteorProgress]);

  // ── Journey meteor: 3-second timer triggers auto-animation when contact is visible ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    const contact = document.getElementById("contact");
    if (!contact) return;

    const DELAY_MS = 3000;
    const ANIM_DURATION_MS = 1200;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Contact section visible — start 3s countdown
          if (!meteorTimerRef.current && !meteorAutoMode.current && meteorProgressRef.current < 100) {
            meteorTimerRef.current = setTimeout(() => {
              meteorTimerRef.current = null;
              meteorAutoMode.current = true;

              // Smooth 0→100 animation over ANIM_DURATION_MS
              const startTime = performance.now();
              const startProgress = meteorProgressRef.current;
              const animate = (now: number): void => {
                const elapsed = now - startTime;
                const t = Math.min(elapsed / ANIM_DURATION_MS, 1);
                // Ease-out cubic for natural deceleration
                const eased = 1 - Math.pow(1 - t, 3);
                const p = startProgress + (100 - startProgress) * eased;
                setMeteorProgress(p);
                if (t < 1) {
                  meteorAnimRef.current = requestAnimationFrame(animate);
                } else {
                  meteorAnimRef.current = null;
                  setMeteorProgress(100);
                  setMeteorLanded(true);
                }
              };
              meteorAnimRef.current = requestAnimationFrame(animate);
            }, DELAY_MS);
          }
        } else {
          // Contact section left viewport — cancel pending timer
          if (meteorTimerRef.current) {
            clearTimeout(meteorTimerRef.current);
            meteorTimerRef.current = null;
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(contact);
    return () => {
      observer.disconnect();
      if (meteorTimerRef.current) clearTimeout(meteorTimerRef.current);
      if (meteorAnimRef.current) cancelAnimationFrame(meteorAnimRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const sync = (): void => {
      setModalOpen(document.body.getAttribute("data-modal-open") === "true");
    };
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-modal-open"],
    });
    return () => obs.disconnect();
  }, []);

  const reboot = (): void => {
    // Reset all signal flags — reboot is a full system restart
    setSeenReboot(false);
    setSeenSetup(false);
    setSeenJourney(false);
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem("seen-reboot");
      sessionStorage.removeItem("seen-setup");
      sessionStorage.removeItem("seen-journey");
    }
    setPressure(0);
    scrollDistance.current = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("replay-intro", { detail: { slow: true } }));
    }, 300);
  };

  // Sacred thresholds — only apply when signals are active
  const tremor = !seenReboot && pressure >= 80;
  const heavy = !seenReboot && pressure >= 92;
  const fillPct = !seenReboot ? Math.min(pressure, 100) : 0;
  const showMeteor = !seenJourney && meteorProgress > 0;

  return (
    <>
      {/* Signature — top-left corner */}
      <motion.div
        initial={false}
        animate={{
          opacity: modalOpen ? 0 : 1,
          y: modalOpen ? -20 : 0,
          pointerEvents: modalOpen ? "none" : "auto",
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 z-40 px-4 md:px-6 py-3 md:py-4 transition-all duration-300 ${
          scrolled && !onProjects ? "bg-background/70 backdrop-blur-md" : ""
        }`}
      >
        <Link href="/">
          <span className="font-mono text-sm md:text-base tracking-tight">
            <span className="text-accent">&gt;</span>{" "}
            <span className="text-foreground font-semibold">ahtesham</span>
            <span className="text-muted/60">.dev</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block w-[2px] h-[14px] bg-accent ml-1 align-middle"
            />
          </span>
        </Link>
      </motion.div>

      {/* ── Journey meteor — rises from viewport bottom to journey button ── */}
      {journeyPos.cx > 0 && (
        <div className="fixed inset-0 z-30 pointer-events-none" style={{ opacity: showMeteor ? 1 : 0, transition: "opacity 0.6s ease" }}>
          {(() => {
            const vh = typeof window !== "undefined" ? window.innerHeight : 800;
            const lineX = journeyPos.cx;
            const targetY = journeyPos.cy; // meteor merges into button center
            const startY = vh; // bottom of viewport
            const travelDist = startY - targetY;
            const meteorY = startY - (meteorProgress / 100) * travelDist;

            return (
              <>
                {/* Ambient glow */}
                {!meteorLanded && (
                  <div
                    className="absolute"
                    style={{
                      left: lineX - 30,
                      top: meteorY,
                      bottom: 0,
                      width: 60,
                      background: "linear-gradient(to top, transparent 0%, rgba(74,222,128,0.06) 30%, rgba(74,222,128,0.15) 70%, rgba(74,222,128,0.25) 100%)",
                      filter: "blur(12px)",
                    }}
                  />
                )}
                {/* Core trail */}
                {!meteorLanded && (
                  <div
                    className="absolute"
                    style={{
                      left: lineX - 2,
                      top: meteorY,
                      bottom: 0,
                      width: 4,
                      borderRadius: 2,
                      background: "linear-gradient(to top, rgba(74,222,128,0.05) 0%, rgba(74,222,128,0.3) 20%, rgba(74,222,128,0.6) 60%, rgba(74,222,128,0.9) 100%)",
                    }}
                  />
                )}
                {/* Meteor head */}
                {!meteorLanded && meteorProgress > 0 && (
                  <div
                    className="absolute"
                    style={{
                      left: lineX - 9,
                      top: meteorY - 9,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, #fff 0%, rgba(74,222,128,1) 20%, rgba(74,222,128,0.6) 50%, transparent 75%)",
                      boxShadow: "0 0 20px 8px rgba(74,222,128,0.7), 0 0 50px 16px rgba(74,222,128,0.35), 0 0 80px 30px rgba(74,222,128,0.15)",
                    }}
                  />
                )}
                {/* Post-landing: faint line + signal pulses */}
                {meteorLanded && (
                  <>
                    <div
                      className="absolute"
                      style={{
                        left: lineX - 1.5,
                        top: targetY,
                        bottom: 0,
                        width: 3,
                        borderRadius: 2,
                        background: "linear-gradient(to top, rgba(74,222,128,0.05) 0%, rgba(74,222,128,0.15) 50%, rgba(74,222,128,0.3) 100%)",
                      }}
                    />
                    <div
                      className="absolute nav-signal-pulse"
                      style={{
                        left: lineX - 8,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(74,222,128,0.9) 0%, rgba(74,222,128,0.4) 40%, transparent 70%)",
                        boxShadow: "0 0 16px 6px rgba(74,222,128,0.5), 0 0 30px 10px rgba(74,222,128,0.2)",
                        "--signal-start": `${vh}px`,
                        "--signal-target": `${targetY}px`,
                      } as React.CSSProperties}
                    />
                  </>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Actions — top-right */}
      <motion.div
        initial={false}
        animate={{
          opacity: modalOpen ? 0 : 1,
          y: modalOpen ? -20 : 0,
          pointerEvents: modalOpen ? "none" : "auto",
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 right-0 z-40 px-3 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-4"
      >
        {/* ── Reboot ── */}
        <button
          type="button"
          onClick={reboot}
          aria-label="Reboot system — replay intro"
          className={`group relative flex items-center cursor-pointer glass rounded-full p-2.5 hover:px-4 hover:gap-2 transition-all overflow-hidden ${tremor ? "nav-tremor" : "duration-300"}`}
          style={{
            boxShadow: heavy
              ? "0 6px 25px rgba(74,222,128,0.25), 0 0 40px rgba(74,222,128,0.15)"
              : "0 4px 12px rgba(0,0,0,0.12), 0 0 4px rgba(0,0,0,0.06)",
            transform: heavy ? "translateY(3px)" : "translateY(0)",
            transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.8s",
          }}
        >
          <span
            className="absolute bottom-0 left-0 right-0 bg-accent-status/15 rounded-full pointer-events-none"
            style={{ height: `${fillPct}%`, transition: "height 2s ease-out" }}
          />
          <RefreshCcw
            size={13}
            className={`relative z-10 shrink-0 transition-colors duration-500 ${
              heavy ? "text-accent-status" : tremor ? "text-accent-status/70" : "text-muted/60 group-hover:text-accent-status"
            }`}
          />
          <span className="relative z-10 max-w-0 overflow-hidden group-hover:max-w-[60px] transition-all duration-300 whitespace-nowrap font-mono text-small text-muted/60">
            reboot
          </span>
        </button>

        {/* ── Setup ── */}
        <Link
          href="/uses"
          onClick={() => markSeen("setup")}
          aria-label="Tools, stack, and workflow"
          className={`group relative hidden sm:flex items-center cursor-pointer glass rounded-full p-2.5 hover:px-4 hover:gap-2 transition-all duration-500 ${
            !seenSetup && setupGlow ? "nav-setup-glow" : ""
          }`}
          style={{
            boxShadow: setupGlow
              ? "0 4px 20px rgba(212,168,83,0.15), 0 0 30px rgba(212,168,83,0.1)"
              : "0 4px 12px rgba(0,0,0,0.12), 0 0 4px rgba(0,0,0,0.06)",
          }}
        >
          <span className={`absolute w-[3px] h-[3px] rounded-full nav-orbit pointer-events-none ${setupGlow ? "bg-accent/60" : "bg-accent/20"}`} style={{ animationDuration: setupGlow ? "2s" : "4s" }} />
          <span className={`absolute w-[2px] h-[2px] rounded-full nav-orbit pointer-events-none ${setupGlow ? "bg-accent-secondary/60" : "bg-accent-secondary/20"}`} style={{ animationDuration: setupGlow ? "3s" : "6s", animationDelay: "-2s" }} />
          <span className={`absolute w-[2px] h-[2px] rounded-full nav-orbit pointer-events-none ${setupGlow ? "bg-accent/50" : "bg-accent/15"}`} style={{ animationDuration: setupGlow ? "2.5s" : "5s", animationDelay: "-3.5s" }} />
          <Wrench
            size={13}
            className={`shrink-0 transition-all duration-500 group-hover:rotate-[-20deg] ${
              setupGlow ? "text-accent" : "text-muted/60 group-hover:text-accent"
            }`}
          />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[60px] transition-all duration-300 whitespace-nowrap font-mono text-small text-muted/60">
            setup
          </span>
        </Link>

        {/* ── Journey ── */}
        <Link
          ref={journeyBtnRef}
          href="/journey"
          onClick={() => markSeen("journey")}
          aria-label="Walk through my career"
          className={`group relative flex items-center cursor-pointer rounded-full p-2.5 hover:px-4 hover:gap-2 backdrop-blur-md transition-all duration-500 ${
            meteorLanded ? "nav-journey-active" : "nav-journey-idle"
          }`}
          style={{
            boxShadow: meteorLanded
              ? "0 0 20px rgba(74,222,128,0.3), 0 0 40px rgba(74,222,128,0.15)"
              : "0 4px 12px rgba(0,0,0,0.12), 0 0 4px rgba(212,168,83,0.04)",
          }}
        >
          <TrendingUp
            size={13}
            className={`shrink-0 transition-colors duration-500 ${
              meteorLanded ? "text-accent-status" : "text-accent/70 group-hover:text-accent"
            }`}
          />
          <span className={`max-w-0 overflow-hidden group-hover:max-w-[70px] transition-all duration-300 whitespace-nowrap font-mono text-small ${
            meteorLanded ? "text-accent-status/60" : "text-accent/60"
          }`}>
            journey
          </span>
        </Link>
      </motion.div>
    </>
  );
}
