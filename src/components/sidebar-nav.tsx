"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";

const pipelineSteps = [
  { id: "hero", label: "init" },
  { id: "mission", label: "assess" },
  { id: "projects", label: "review" },
  { id: "log", label: "verify" },
  { id: "contact", label: "decide" },
] as const;

export function SidebarNav(): React.ReactElement {
  const [active, setActive] = useState("hero");
  const [modalOpen, setModalOpen] = useState(false);
  // Track real time spent on each section in seconds
  const [sectionTimes, setSectionTimes] = useState<Record<string, number>>({});
  const activeRef = useRef("hero");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateActive = useCallback(() => {
    const scrollY = window.scrollY + window.innerHeight * 0.35;
    let current: string = pipelineSteps[0].id;
    for (const { id } of pipelineSteps) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.offsetTop <= scrollY) current = id;
    }
    setActive(current);
    activeRef.current = current;
  }, []);

  // Section time tracker — counts real seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSectionTimes((prev) => ({
        ...prev,
        [activeRef.current]: (prev[activeRef.current] ?? 0) + 0.1,
      }));
    }, 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
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

  const activeIdx = pipelineSteps.findIndex((s) => s.id === active);

  return (
    <motion.nav
      initial={{ opacity: 0, x: -12 }}
      animate={{
        opacity: modalOpen ? 0 : 1,
        x: modalOpen ? -12 : 0,
        pointerEvents: modalOpen ? "none" as const : "auto" as const,
      }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Pipeline navigation"
      className="fixed left-2 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-0 font-mono"
    >
      {pipelineSteps.map(({ id, label }, i) => {
        const isDone = i < activeIdx;
        const isActive = i === activeIdx;
        const isPending = i > activeIdx;
        const timeSpent = sectionTimes[id] ?? 0;
        const timeStr = timeSpent >= 1 ? `${timeSpent.toFixed(1)}s` : timeSpent > 0 ? `${(timeSpent * 1000).toFixed(0)}ms` : "";

        return (
          <div key={id}>
            <button
              type="button"
              onClick={() => scrollTo(id)}
              className={`group relative flex items-center gap-1 px-1.5 py-1 rounded-md transition-all duration-300 w-full text-left ${
                isActive ? "bg-accent/8" : ""
              }`}
            >
              {/* Active glow bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-3 rounded-full bg-accent shadow-[0_0_6px_rgba(212,168,83,0.5)]" />
              )}

              <span className={`text-caption shrink-0 ${
                isDone ? "text-accent-status" : isActive ? "text-accent" : "text-muted/20"
              }`}>
                {isDone ? "✓" : isActive ? "▸" : "○"}
              </span>
              <span className={`text-caption transition-colors ${
                isDone ? "text-foreground/50" : isActive ? "text-accent" : "text-muted/20"
              }`}>
                {label}
              </span>
              {(isDone || isActive) && timeStr && (
                <span className={`text-caption ml-auto tabular-nums ${
                  isDone ? "text-accent-status/30" : "text-accent/30"
                }`}>
                  {timeStr}
                </span>
              )}
            </button>

            {/* Connector line */}
            {i < pipelineSteps.length - 1 && (
              <div className={`w-px h-1 ml-[10px] transition-colors duration-300 ${
                isDone ? "bg-accent-status/15" : "bg-card-border/30"
              }`} />
            )}
          </div>
        );
      })}
    </motion.nav>
  );
}
