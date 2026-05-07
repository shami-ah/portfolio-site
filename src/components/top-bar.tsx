"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function TopBar(): React.ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
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
      <motion.a
        href="/"
        initial={{ opacity: 0, y: -10 }}
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
        <span className="font-mono text-sm md:text-base tracking-tight">
          <span className="text-accent">&gt;</span>{" "}
          <span className="text-foreground font-semibold">ahtesham</span>
          <span className="text-muted/50">.dev</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            className="inline-block w-[2px] h-[14px] bg-accent ml-1 align-middle"
          />
        </span>
      </motion.a>

      {/* Actions — top-right */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
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
          className="group relative inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-card/85 backdrop-blur-md border border-card-border hover:border-accent/50 hover:bg-card transition-all duration-200 shadow-md"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted group-hover:text-accent transition-colors shrink-0"
          >
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
          <span className="hidden sm:inline text-xs md:text-sm text-muted group-hover:text-foreground transition-colors whitespace-nowrap">
            Reboot System
          </span>
        </button>

        {/* My setup — hidden on small mobile to avoid crowding */}
        <a
          href="/uses"
          aria-label="Tools, stack, and workflow"
          className="group relative hidden sm:inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-card/85 backdrop-blur-md border border-card-border hover:border-accent/50 hover:bg-card transition-all duration-200 shadow-md"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted group-hover:text-accent transition-colors shrink-0"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <span className="hidden sm:inline text-xs md:text-sm text-muted group-hover:text-foreground transition-colors whitespace-nowrap">
            My setup
          </span>
        </a>

        {/* How I work */}
        <a
          href="/journey"
          aria-label="Walk through my career"
          className="group relative inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 font-medium"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <polyline points="3 17 9 11 13 15 21 7" />
            <polyline points="14 7 21 7 21 14" />
          </svg>
          <span className="hidden sm:inline text-xs md:text-sm whitespace-nowrap">
            How I work
          </span>
        </a>
      </motion.div>
    </>
  );
}
