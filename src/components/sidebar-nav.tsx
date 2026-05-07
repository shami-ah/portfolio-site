"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

const sections = [
  { id: "hero", label: "home", icon: "⌂" },
  { id: "mission", label: "mission", icon: "◎" },
  { id: "projects", label: "projects", icon: "◫" },
  { id: "log", label: "log", icon: "⎋" },
  { id: "writing", label: "writing", icon: "✎" },
  { id: "contact", label: "contact", icon: "✉" },
] as const;

export function SidebarNav(): React.ReactElement {
  const [active, setActive] = useState("hero");
  const [modalOpen, setModalOpen] = useState(false);

  const updateActive = useCallback(() => {
    const scrollY = window.scrollY + window.innerHeight * 0.35;
    let current: string = sections[0].id;
    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.offsetTop <= scrollY) current = id;
    }
    setActive(current);
  }, []);

  useEffect(() => {
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [updateActive]);

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

  const scrollTo = (id: string): void => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: -12 }}
      animate={{
        opacity: modalOpen ? 0 : 1,
        x: modalOpen ? -12 : 0,
        pointerEvents: modalOpen ? "none" as const : "auto" as const,
      }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Section navigation"
      className="fixed left-3 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-1.5"
    >
      {sections.map(({ id, label, icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            title={label}
            className={`group relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
              isActive
                ? "bg-accent/15 text-accent"
                : "text-muted/30 hover:text-muted/70 hover:bg-card/50"
            }`}
          >
            {/* Active side indicator */}
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-full transition-all duration-300 ${
                isActive
                  ? "h-4 bg-accent shadow-[0_0_6px_rgba(212,168,83,0.5)]"
                  : "h-0 bg-transparent"
              }`}
            />

            <span className="text-sm leading-none">{icon}</span>

            {/* Tooltip on hover */}
            <span className="absolute left-full ml-2 px-2 py-1 rounded-md bg-card/95 backdrop-blur-md border border-card-border text-[11px] font-mono text-foreground whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
              <span className="text-accent/60">&gt; </span>{label}
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
}
