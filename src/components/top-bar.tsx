"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCcw, Wrench, TrendingUp } from "lucide-react";

export function TopBar(): React.ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
        {/* Reboot — breathing spin icon, orbiting ring on hover */}
        <button
          type="button"
          onClick={reboot}
          aria-label="Reboot system — replay intro"
          className="group relative flex items-center cursor-pointer glass rounded-full p-2.5 hover:px-4 hover:gap-2 transition-all duration-300"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)" }}
        >
          {/* Orbiting ring — visible on hover */}
          <span className="absolute inset-[-3px] rounded-full border border-transparent group-hover:border-accent-status/30 transition-all duration-500 group-hover:animate-[spin_3s_linear_infinite]" />
          <RefreshCcw size={14} className="text-muted/60 group-hover:text-accent-status shrink-0 nav-reboot-spin" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[60px] transition-all duration-300 whitespace-nowrap font-mono text-small text-muted/60">
            reboot
          </span>
        </button>

        {/* My setup — wrench with subtle tilt, gear-like pulse ring */}
        <Link
          href="/uses"
          aria-label="Tools, stack, and workflow"
          className="group relative hidden sm:flex items-center cursor-pointer glass rounded-full p-2.5 hover:px-4 hover:gap-2 transition-all duration-300"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)" }}
        >
          {/* Pulse ring — breathes on hover */}
          <span className="absolute inset-[-3px] rounded-full border border-transparent group-hover:border-accent/20 transition-all duration-300 group-hover:animate-[pulse_2s_ease-in-out_infinite]" />
          <Wrench size={14} className="text-muted/60 group-hover:text-accent shrink-0 nav-wrench-tilt" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[60px] transition-all duration-300 whitespace-nowrap font-mono text-small text-muted/60">
            setup
          </span>
        </Link>

        {/* Journey — accent pill, rising arrow animation, persistent pulse dot */}
        <Link
          href="/journey"
          aria-label="Walk through my career"
          className="group relative flex items-center cursor-pointer rounded-full p-2.5 hover:px-4 hover:gap-2 bg-accent/10 border border-accent/20 hover:bg-accent/20 hover:border-accent/40 backdrop-blur-md transition-all duration-300"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 30px rgba(212,168,83,0.08)" }}
        >
          {/* Pulse dot — always visible, draws attention */}
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-accent animate-[nav-pulse_2.5s_ease-in-out_infinite]" />
          <TrendingUp size={14} className="text-accent/70 group-hover:text-accent shrink-0 nav-arrow-rise" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[70px] transition-all duration-300 whitespace-nowrap font-mono text-small text-accent/60">
            journey
          </span>
        </Link>
      </motion.div>
    </>
  );
}
