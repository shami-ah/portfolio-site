"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Wrench, TrendingUp } from "lucide-react";

/* ── Whisper tooltips — cycle one at a time ── */
const WHISPERS = [
  { id: "reboot", text: "replay the intro" },
  { id: "setup", text: "peek under the hood" },
  { id: "journey", text: "the story behind the code" },
] as const;

function useWhisperCycle(): string | null {
  const [active, setActive] = useState<string | null>(null);
  const idx = useRef(0);

  useEffect(() => {
    // First whisper after 6s, then cycle every 10s
    const startTimer = setTimeout(() => {
      setActive(WHISPERS[0].id);
      idx.current = 0;

      const interval = setInterval(() => {
        // Hide current
        setActive(null);

        // Show next after a pause
        setTimeout(() => {
          idx.current = (idx.current + 1) % WHISPERS.length;
          setActive(WHISPERS[idx.current].id);
        }, 2000);
      }, 8000);

      // Hide first one after display time
      setTimeout(() => setActive(null), 3500);

      return () => clearInterval(interval);
    }, 6000);

    return () => clearTimeout(startTimer);
  }, []);

  return active;
}

function Whisper({ show, text, side = "bottom" }: { show: boolean; text: string; side?: "bottom" | "left" }): React.ReactElement {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, y: side === "bottom" ? -4 : 0, x: side === "left" ? 8 : 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: side === "bottom" ? -4 : 0, x: side === "left" ? 8 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute whitespace-nowrap font-mono text-[10px] text-muted/50 pointer-events-none ${
            side === "bottom" ? "top-full mt-2.5 right-0" : "right-full mr-3"
          }`}
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function TopBar(): React.ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const whisper = useWhisperCycle();

  useEffect(() => {
    let ticking = false;
    const onScroll = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  // Periodic glitch on reboot button
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const reboot = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("replay-intro", { detail: { slow: true } }));
    }, 300);
  };

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
        {/* CRT glitch every ~8s — icon distorts briefly, feels like the system wants to restart */}
        <button
          type="button"
          onClick={reboot}
          aria-label="Reboot system — replay intro"
          className="group relative flex items-center cursor-pointer glass rounded-full p-2.5 hover:px-4 hover:gap-2 transition-all duration-300"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)" }}
        >
          <span className={`shrink-0 transition-all duration-100 ${glitch ? "nav-glitch" : ""}`}>
            <RefreshCcw size={14} className="text-muted/60 group-hover:text-accent-status nav-reboot-spin" />
          </span>
          <span className="max-w-0 overflow-hidden group-hover:max-w-[60px] transition-all duration-300 whitespace-nowrap font-mono text-small text-muted/60">
            reboot
          </span>
          <Whisper show={whisper === "reboot"} text="replay the intro" />
        </button>

        {/* ── Setup ── */}
        {/* Orbiting dots — tiny particles circle the button like electrons */}
        <Link
          href="/uses"
          aria-label="Tools, stack, and workflow"
          className="group relative hidden sm:flex items-center cursor-pointer glass rounded-full p-2.5 hover:px-4 hover:gap-2 transition-all duration-300"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)" }}
        >
          {/* Orbiting particle 1 */}
          <span className="absolute w-[3px] h-[3px] rounded-full bg-accent/30 nav-orbit" style={{ animationDuration: "4s" }} />
          {/* Orbiting particle 2 */}
          <span className="absolute w-[2px] h-[2px] rounded-full bg-accent-secondary/30 nav-orbit" style={{ animationDuration: "6s", animationDelay: "-2s" }} />
          {/* Orbiting particle 3 */}
          <span className="absolute w-[2px] h-[2px] rounded-full bg-accent/20 nav-orbit" style={{ animationDuration: "5s", animationDelay: "-3.5s" }} />
          <Wrench size={14} className="text-muted/60 group-hover:text-accent shrink-0 group-hover:rotate-[-20deg] transition-transform duration-300" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[60px] transition-all duration-300 whitespace-nowrap font-mono text-small text-muted/60">
            setup
          </span>
          <Whisper show={whisper === "setup"} text="peek under the hood" />
        </Link>

        {/* ── Journey ── */}
        {/* Animated gradient border traces around the pill like a path being drawn */}
        <Link
          href="/journey"
          aria-label="Walk through my career"
          className="group relative flex items-center cursor-pointer rounded-full p-2.5 hover:px-4 hover:gap-2 backdrop-blur-md transition-all duration-300 nav-journey-border"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 30px rgba(212,168,83,0.08)" }}
        >
          {/* Pulse dot — always visible */}
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-accent nav-dot-pulse" />
          <TrendingUp size={14} className="text-accent/70 group-hover:text-accent shrink-0 transition-colors" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[70px] transition-all duration-300 whitespace-nowrap font-mono text-small text-accent/60">
            journey
          </span>
          <Whisper show={whisper === "journey"} text="the story behind the code" />
        </Link>
      </motion.div>
    </>
  );
}
