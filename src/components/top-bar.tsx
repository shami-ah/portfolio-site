"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function TopBar(): React.ReactElement {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openSearch = (): void => {
    const ev = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(ev);
  };

  return (
    <>
      {/* Signature name — top-left corner, always visible */}
      <motion.a
        href="/"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 z-40 px-4 md:px-6 py-3 md:py-4 transition-all duration-300 ${
          scrolled ? "bg-background/70 backdrop-blur-md" : ""
        }`}
      >
        <p className="text-[9px] md:text-[10px] font-mono text-accent uppercase tracking-[0.3em] mb-0.5">
          Engr.
        </p>
        <h1 className="text-base md:text-2xl font-bold tracking-tight leading-none">
          Ahtesham Ahmad
        </h1>
        <p className="text-[8px] md:text-[10px] font-mono text-muted/50 uppercase tracking-[0.2em] mt-1">
          AI Automation Architect
        </p>
      </motion.a>

      {/* Actions — top-right */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 right-0 z-40 px-3 md:px-6 py-3 md:py-4 flex items-center gap-2 md:gap-3"
      >
        {/* Search — clear, inviting, labeled */}
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search the portfolio · open command palette"
          className="group relative inline-flex items-center gap-2 md:gap-2.5 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-card/85 backdrop-blur-md border border-card-border hover:border-accent/50 hover:bg-card transition-all duration-200 shadow-md"
        >
          {/* Pulse ring to draw attention */}
          <span className="absolute -inset-[1px] rounded-lg pointer-events-none">
            <span className="absolute inset-0 rounded-lg border border-accent/0 group-hover:border-accent/30 transition-colors" />
          </span>
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="hidden sm:inline text-xs md:text-sm text-muted group-hover:text-foreground transition-colors whitespace-nowrap">
            Search &amp; jump
          </span>
          <kbd className="hidden md:inline text-[10px] font-mono text-muted/60 border border-card-border px-1.5 py-0.5 rounded bg-background/70">
            ⌘K
          </kbd>

          {/* Hint tooltip appears on hover */}
          <span className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <span className="inline-block text-[10px] font-mono text-muted/80 bg-card/95 backdrop-blur-md border border-card-border rounded-md px-2 py-1.5 shadow-lg">
              jump to any section, project, or action
            </span>
          </span>
        </button>

        {/* Walk my career — clear CTA */}
        <a
          href="/journey"
          aria-label="Walk through my career — interactive timeline"
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
          <span className="sm:hidden text-xs">How</span>

          {/* Hint tooltip */}
          <span className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <span className="inline-block text-[10px] font-mono text-muted/80 bg-card/95 backdrop-blur-md border border-card-border rounded-md px-2 py-1.5 shadow-lg">
              my principles, daily workflow &amp; dev stack
            </span>
          </span>
        </a>
      </motion.div>
    </>
  );
}
