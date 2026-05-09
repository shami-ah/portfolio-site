"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCcw, Wrench, TrendingUp } from "lucide-react";

export function TopBar(): React.ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // ── Reboot: pressure builds slowly, sacred animations ──
  const [pressure, setPressure] = useState(0);
  const scrollDistance = useRef(0);
  const lastScrollY = useRef(0);

  // ── Setup: glow when relevant section is in view ──
  const [setupGlow, setSetupGlow] = useState(false);

  // ── Journey: meteor rises from bottom to button ──
  const [meteorProgress, setMeteorProgress] = useState(0); // 0-100
  const [meteorLanded, setMeteorLanded] = useState(false);

  const updatePressure = useCallback(() => {
    setPressure((p) => Math.min(p + 1, 100));
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);

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

        // Journey meteor: tied to contact section visibility
        const contact = document.getElementById("contact");
        if (contact) {
          const rect = contact.getBoundingClientRect();
          const visibility = 1 - Math.max(0, Math.min(1, rect.top / window.innerHeight));
          if (visibility > 0.2) {
            const progress = Math.min(100, ((visibility - 0.2) / 0.6) * 100);
            setMeteorProgress(progress);
            setMeteorLanded(progress >= 98);
          } else {
            setMeteorProgress(0);
            setMeteorLanded(false);
          }
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [updatePressure]);

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
    setPressure(0);
    scrollDistance.current = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("replay-intro", { detail: { slow: true } }));
    }, 300);
  };

  // Sacred thresholds — tremor only at 80%, heavy at 92%
  const tremor = pressure >= 80;
  const heavy = pressure >= 92;
  const fillPct = Math.min(pressure, 100);

  // Meteor position: 0% = bottom of screen, 100% = at the button
  // Button is ~40px from top, screen bottom to there is ~calc(100vh - 40px)
  const meteorY = meteorProgress > 0 ? `${100 - meteorProgress}%` : "100%";

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
          scrolled ? "bg-background/70 backdrop-blur-md" : ""
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

      {/* ── Journey meteor — glowing dot with trail rising to button ── */}
      {meteorProgress > 0 && !meteorLanded && (
        <div className="fixed right-[26px] md:right-[38px] z-30 pointer-events-none" style={{ inset: 0 }}>
          {/* Trail — fades from bottom to meteor position */}
          <div
            className="absolute right-0 w-[2px] transition-all duration-300"
            style={{
              bottom: 0,
              top: meteorY,
              background: "linear-gradient(to top, transparent, rgba(74,222,128,0.1) 30%, rgba(74,222,128,0.3))",
            }}
          />
          {/* Meteor head — the bright glowing dot */}
          <div
            className="absolute right-[-3px] w-[8px] h-[8px] rounded-full transition-all duration-300"
            style={{
              top: meteorY,
              background: "radial-gradient(circle, rgba(74,222,128,1) 0%, rgba(74,222,128,0.6) 40%, transparent 70%)",
              boxShadow: "0 0 12px rgba(74,222,128,0.8), 0 0 24px rgba(74,222,128,0.4), 0 4px 16px rgba(74,222,128,0.3)",
            }}
          />
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
              : "0 4px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)",
            transform: heavy ? "translateY(3px)" : "translateY(0)",
            transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.8s",
          }}
        >
          <span
            className="absolute bottom-0 left-0 right-0 bg-accent-status/15 rounded-full pointer-events-none"
            style={{ height: `${fillPct}%`, transition: "height 2s ease-out" }}
          />
          <RefreshCcw
            size={14}
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
          aria-label="Tools, stack, and workflow"
          className={`group relative hidden sm:flex items-center cursor-pointer glass rounded-full p-2.5 hover:px-4 hover:gap-2 transition-all duration-500 ${
            setupGlow ? "nav-setup-glow" : ""
          }`}
          style={{
            boxShadow: setupGlow
              ? "0 4px 20px rgba(212,168,83,0.15), 0 0 30px rgba(212,168,83,0.1)"
              : "0 4px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)",
          }}
        >
          <span className={`absolute w-[3px] h-[3px] rounded-full nav-orbit pointer-events-none ${setupGlow ? "bg-accent/60" : "bg-accent/20"}`} style={{ animationDuration: setupGlow ? "2s" : "4s" }} />
          <span className={`absolute w-[2px] h-[2px] rounded-full nav-orbit pointer-events-none ${setupGlow ? "bg-accent-secondary/60" : "bg-accent-secondary/20"}`} style={{ animationDuration: setupGlow ? "3s" : "6s", animationDelay: "-2s" }} />
          <span className={`absolute w-[2px] h-[2px] rounded-full nav-orbit pointer-events-none ${setupGlow ? "bg-accent/50" : "bg-accent/15"}`} style={{ animationDuration: setupGlow ? "2.5s" : "5s", animationDelay: "-3.5s" }} />
          <Wrench
            size={14}
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
          href="/journey"
          aria-label="Walk through my career"
          className={`group relative flex items-center cursor-pointer rounded-full p-2.5 hover:px-4 hover:gap-2 backdrop-blur-md transition-all duration-500 ${
            meteorLanded ? "nav-journey-active" : "nav-journey-idle"
          }`}
          style={{
            boxShadow: meteorLanded
              ? "0 0 20px rgba(74,222,128,0.3), 0 0 40px rgba(74,222,128,0.15)"
              : "0 4px 20px rgba(0,0,0,0.4), 0 0 30px rgba(212,168,83,0.08)",
          }}
        >
          <TrendingUp
            size={14}
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
