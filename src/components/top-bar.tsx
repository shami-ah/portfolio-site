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
        className="fixed top-0 right-0 z-40 px-3 md:px-6 py-3 md:py-4 flex items-center gap-2 md:gap-3"
      >
        {/* Reboot */}
        <button
          type="button"
          onClick={reboot}
          aria-label="Reboot system — replay intro"
          className="group relative inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-card/80 backdrop-blur-md border border-card-border hover:border-accent/40 hover:bg-card transition-all duration-200 shadow-md"
        >
          <RefreshCcw size={14} className="text-muted group-hover:text-accent transition-colors shrink-0" />
          <span className="hidden sm:inline text-xs md:text-sm text-muted group-hover:text-foreground transition-colors whitespace-nowrap">
            Reboot System
          </span>
        </button>

        {/* My setup — hidden on small mobile to avoid crowding */}
        <Link
          href="/uses"
          aria-label="Tools, stack, and workflow"
          className="group relative hidden sm:inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-card/80 backdrop-blur-md border border-card-border hover:border-accent/40 hover:bg-card transition-all duration-200 shadow-md"
        >
          <Wrench size={14} className="text-muted group-hover:text-accent transition-colors shrink-0" />
          <span className="hidden sm:inline text-xs md:text-sm text-muted group-hover:text-foreground transition-colors whitespace-nowrap">
            My setup
          </span>
        </Link>

        {/* How I work */}
        <Link
          href="/journey"
          aria-label="Walk through my career"
          className="group relative inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 font-medium"
        >
          <TrendingUp size={14} className="shrink-0" />
          <span className="hidden sm:inline text-xs md:text-sm whitespace-nowrap">
            How I work
          </span>
        </Link>
      </motion.div>
    </>
  );
}
