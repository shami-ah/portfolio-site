"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavTicker } from "./nav-ticker";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#skills", label: "Skills" },
  { href: "/#contact", label: "Contact" },
];

export function Nav(): React.ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const replayIntro = (): void => {
    sessionStorage.removeItem("boot-seen");
    sessionStorage.removeItem("boot-complete");
    window.location.href = "/";
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-card-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-6 py-3.5 md:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <a
            href="/"
            className="font-mono text-sm font-bold tracking-wider text-accent shrink-0"
          >
            Ahtesham Ahmad
          </a>
          <NavTicker />
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}

          {/* Replay intro icon */}
          <button
            type="button"
            onClick={replayIntro}
            aria-label="Replay intro"
            title="Replay intro"
            className="p-1.5 rounded-md text-muted/50 hover:text-accent hover:bg-accent/5 transition-all"
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
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>

          {/* Take the tour — prominent */}
          <a
            href="/journey"
            className="inline-flex items-center gap-1.5 text-sm px-4 py-2 bg-accent/10 text-accent border border-accent/30 rounded-lg hover:bg-accent/20 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-200 font-medium group"
          >
            Take the tour
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-muted hover:text-foreground p-2"
          aria-label="Toggle menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {mobileOpen ? (
              <path d="M4 4l12 12M16 4L4 16" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card/95 backdrop-blur-xl border-b border-card-border"
        >
          <div className="px-5 py-4 flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-card-border flex items-center gap-3 flex-wrap">
              <a
                href="/journey"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2 bg-accent/10 text-accent border border-accent/30 rounded-lg font-medium"
              >
                Take the tour →
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  replayIntro();
                }}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-2 border border-card-border rounded-lg text-muted"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                replay intro
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
