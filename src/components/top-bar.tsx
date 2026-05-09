"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCcw, Wrench, TrendingUp } from "lucide-react";

export function TopBar(): React.ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // ── Reboot: interaction pressure builds up ──
  const [pressure, setPressure] = useState(0); // 0-100
  const interactionCount = useRef(0);
  const lastScrollY = useRef(0);

  // ── Setup: glow when relevant section is in view ──
  const [setupGlow, setSetupGlow] = useState(false);

  // ── Journey: green line rises when contact section reached ──
  const [journeyLine, setJourneyLine] = useState(0); // 0-100 (line height %)
  const journeyBtnRef = useRef<HTMLAnchorElement>(null);

  const updatePressure = useCallback(() => {
    interactionCount.current += 1;
    // Pressure builds with interactions, caps at 100
    setPressure((p) => Math.min(p + 3, 100));
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);

        // Track scroll distance for pressure
        const delta = Math.abs(y - lastScrollY.current);
        if (delta > 200) {
          updatePressure();
          lastScrollY.current = y;
        }

        // Setup glow: activate near mission/stats or projects section
        const mission = document.getElementById("mission");
        const projects = document.getElementById("projects");
        if (mission || projects) {
          const missionTop = mission?.getBoundingClientRect().top ?? Infinity;
          const projectsBottom = projects?.getBoundingClientRect().bottom ?? -Infinity;
          setSetupGlow(missionTop < window.innerHeight * 0.6 && projectsBottom > 0);
        }

        // Journey line: activate when contact section is visible
        const contact = document.getElementById("contact");
        if (contact) {
          const rect = contact.getBoundingClientRect();
          const visibility = 1 - Math.max(0, Math.min(1, rect.top / window.innerHeight));
          if (visibility > 0.3) {
            setJourneyLine(Math.min(100, (visibility - 0.3) / 0.5 * 100));
          } else {
            setJourneyLine(0);
          }
        }

        ticking = false;
      });
    };

    // Track clicks as interactions for pressure
    const onClick = (): void => updatePressure();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
    };
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
    // Reset pressure on reboot
    setPressure(0);
    interactionCount.current = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("replay-intro", { detail: { slow: true } }));
    }, 300);
  };

  // Reboot tremor kicks in above 40% pressure
  const tremor = pressure > 40;
  // Reboot drops from position above 70%
  const heavy = pressure > 70;
  // Fill percentage for the visual fill effect
  const fillPct = Math.min(pressure, 100);

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

      {/* ── Journey rising line — draws from contact section to button ── */}
      {journeyLine > 0 && (
        <div
          className="fixed right-[26px] md:right-[38px] z-30 pointer-events-none transition-all duration-700"
          style={{
            bottom: 0,
            height: `${journeyLine}%`,
            width: "2px",
            background: `linear-gradient(to top, transparent, rgba(74,222,128,0.6) 30%, rgba(74,222,128,0.8))`,
            opacity: journeyLine > 10 ? 1 : 0,
          }}
        />
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
        {/* Fills with color as user interacts, trembles, drops when heavy */}
        <button
          type="button"
          onClick={reboot}
          aria-label="Reboot system — replay intro"
          className={`group relative flex items-center cursor-pointer glass rounded-full p-2.5 hover:px-4 hover:gap-2 transition-all duration-300 overflow-hidden ${tremor ? "nav-tremor" : ""}`}
          style={{
            boxShadow: heavy
              ? "0 6px 25px rgba(74,222,128,0.2), 0 0 40px rgba(74,222,128,0.1)"
              : "0 4px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)",
            transform: heavy ? "translateY(3px)" : "translateY(0)",
            transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s",
          }}
        >
          {/* Fill indicator — rises from bottom */}
          <span
            className="absolute bottom-0 left-0 right-0 bg-accent-status/15 transition-all duration-1000 rounded-full pointer-events-none"
            style={{ height: `${fillPct}%` }}
          />
          <RefreshCcw
            size={14}
            className={`relative z-10 shrink-0 transition-colors duration-500 ${
              heavy ? "text-accent-status" : "text-muted/60 group-hover:text-accent-status"
            }`}
          />
          <span className="relative z-10 max-w-0 overflow-hidden group-hover:max-w-[60px] transition-all duration-300 whitespace-nowrap font-mono text-small text-muted/60">
            reboot
          </span>
        </button>

        {/* ── Setup ── */}
        {/* Glows when mission/projects section is in view */}
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
          {/* Orbiting particles — speed up when glowing */}
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
        {/* Green line connects to this button when contact section is reached */}
        <Link
          ref={journeyBtnRef}
          href="/journey"
          aria-label="Walk through my career"
          className={`group relative flex items-center cursor-pointer rounded-full p-2.5 hover:px-4 hover:gap-2 backdrop-blur-md transition-all duration-500 ${
            journeyLine > 50 ? "nav-journey-active" : "nav-journey-idle"
          }`}
          style={{
            boxShadow: journeyLine > 50
              ? "0 4px 20px rgba(74,222,128,0.2), 0 0 30px rgba(74,222,128,0.1)"
              : "0 4px 20px rgba(0,0,0,0.4), 0 0 30px rgba(212,168,83,0.08)",
          }}
        >
          {/* Pulse dot — turns green when line connects */}
          <span
            className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full nav-dot-pulse transition-colors duration-500"
            style={{ backgroundColor: journeyLine > 50 ? "rgb(74,222,128)" : "rgb(212,168,83)" }}
          />
          <TrendingUp
            size={14}
            className={`shrink-0 transition-colors duration-500 ${
              journeyLine > 50 ? "text-accent-status" : "text-accent/70 group-hover:text-accent"
            }`}
          />
          <span className={`max-w-0 overflow-hidden group-hover:max-w-[70px] transition-all duration-300 whitespace-nowrap font-mono text-small ${
            journeyLine > 50 ? "text-accent-status/60" : "text-accent/60"
          }`}>
            journey
          </span>
        </Link>
      </motion.div>
    </>
  );
}
