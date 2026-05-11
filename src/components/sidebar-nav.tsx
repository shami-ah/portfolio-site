"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { User, Zap, FolderOpen, GitCommit, PenLine, Mail } from "lucide-react";

const L = 2;   // left position
const R = 16;  // right position

const pipelineSteps = [
  { id: "hero", label: "About", icon: User, x: L, y: 0 },
  { id: "mission", label: "Impact", icon: Zap, x: R, y: 70 },
  { id: "projects", label: "Work", icon: FolderOpen, x: L, y: 140 },
  { id: "log", label: "Career", icon: GitCommit, x: R, y: 210 },
  { id: "contact", label: "Connect", icon: Mail, x: L, y: 280 },
] as const;

/** SVG center of each node (icon center = x + 19, y + 19 for a 38px box) */
function cx(i: number): number { return pipelineSteps[i].x + 19; }
function cy(i: number): number { return pipelineSteps[i].y + 19; }

function wirePath(a: number, b: number): string {
  const ax = cx(a), ay = cy(a), bx = cx(b), by = cy(b);
  const midY = (ay + by) / 2;
  return `M ${ax} ${ay} Q ${(ax + bx) / 2 + 4} ${midY} ${bx} ${by}`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

export function SidebarNav(): React.ReactElement {
  const [active, setActive] = useState("hero");
  const [modalOpen, setModalOpen] = useState(false);
  const [sectionTimes, setSectionTimes] = useState<Record<string, number>>({});
  const activeRef = useRef("hero");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Smooth scroll progress — fractional index (0.0 → 4.0) */
  const scrollProgress = useMotionValue(0);
  const [wireProgress, setWireProgress] = useState(0);

  const updateActive = useCallback(() => {
    const scrollY = window.scrollY + window.innerHeight * 0.35;
    let current: string = pipelineSteps[0].id;
    let currentIdx = 0;

    /* Find the active section AND compute fractional progress between sections */
    const offsets: number[] = [];
    for (const { id } of pipelineSteps) {
      const el = document.getElementById(id);
      offsets.push(el ? el.offsetTop : 0);
    }

    for (let i = 0; i < pipelineSteps.length; i++) {
      if (offsets[i] <= scrollY) {
        current = pipelineSteps[i].id;
        currentIdx = i;
      }
    }

    /* Fractional progress: how far between currentIdx and currentIdx+1 */
    let fractional = currentIdx;
    if (currentIdx < pipelineSteps.length - 1) {
      const sectionStart = offsets[currentIdx];
      const sectionEnd = offsets[currentIdx + 1];
      const range = sectionEnd - sectionStart;
      if (range > 0) {
        fractional = currentIdx + Math.min(1, Math.max(0, (scrollY - sectionStart) / range));
      }
    }
    scrollProgress.set(fractional);
    setWireProgress(fractional);

    if (current !== activeRef.current) {
      setActive(current);
      activeRef.current = current;
    }
  }, [scrollProgress]);

  // Track time per section — 1s interval (display only shows m:s)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSectionTimes((prev) => ({
        ...prev,
        [activeRef.current]: (prev[activeRef.current] ?? 0) + 1,
      }));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Throttled scroll handler — one update per animation frame
  useEffect(() => {
    let ticking = false;
    const onScroll = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    };
    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  /* scrollFraction: 0→1 progress within the current section's wire */
  const scrollFraction = wireProgress - Math.floor(wireProgress);

  // Build wire segments with scroll-driven state
  const wires = pipelineSteps.slice(0, -1).map((_, i) => {
    const path = wirePath(i, i + 1);
    const completed = i < activeIdx;           // fully lit
    const filling = i === activeIdx;           // currently being filled by scroll
    const fill = filling ? scrollFraction : 0; // 0→1 how much of this wire is filled
    return { path, completed, filling, fill };
  });

  return (
    <motion.nav
      initial={false}
      animate={{
        opacity: modalOpen ? 0 : 1,
        x: modalOpen ? -16 : 0,
        pointerEvents: modalOpen ? ("none" as const) : ("auto" as const),
      }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Pipeline navigation"
      className="fixed left-3 top-1/2 -translate-y-1/2 z-40 hidden xl:flex font-mono"
      style={{ width: 56, height: 320 }}
    >
      {/* Constellation wires */}
      <svg
        className="absolute inset-0 pointer-events-none overflow-visible"
        viewBox="0 0 56 320"
        fill="none"
      >
        {wires.map((w, i) => {
          /* Approximate path length for dashoffset calculations */
          const pathLen = 80;
          return (
            <g key={i}>
              {/* Base wire — dashed when inactive, hidden when filled */}
              {!w.completed && (
                <path
                  d={w.path}
                  stroke="rgba(42,37,32,0.6)"
                  strokeWidth={1}
                  strokeDasharray={w.filling ? "none" : "6 4"}
                />
              )}

              {/* Green fill — completed: solid, filling: proportional */}
              {(w.completed || w.filling) && (
                <path
                  d={w.path}
                  stroke="rgba(74,222,128,0.25)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeDasharray={w.completed ? "none" : pathLen}
                  strokeDashoffset={w.completed ? 0 : pathLen * (1 - w.fill)}
                  style={{ transition: w.filling ? "stroke-dashoffset 0.15s ease-out" : "none" }}
                />
              )}

              {/* Energy particle — scroll-driven on filling wire */}
              {w.filling && w.fill > 0.08 && (
                <circle r="2.5" fill="#4ade80" filter="url(#glow-green)" opacity={Math.min(1, w.fill * 3)}>
                  <animateMotion
                    dur="0.001s"
                    fill="freeze"
                    path={w.path}
                    keyTimes="0;1"
                    keyPoints={`${w.fill};${w.fill}`}
                    calcMode="linear"
                  />
                </circle>
              )}

              {/* Looping energy particles on completed wires */}
              {w.completed && (
                <circle r="2" fill="#4ade80" filter="url(#glow-green)">
                  <animateMotion
                    dur={`${1.8 + i * 0.4}s`}
                    repeatCount="indefinite"
                    path={w.path}
                    keyTimes="0;1"
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1"
                    begin={`${i * 0.6}s`}
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur={`${1.8 + i * 0.4}s`}
                    repeatCount="indefinite"
                    begin={`${i * 0.6}s`}
                  />
                </circle>
              )}
            </g>
          );
        })}
        <defs>
          <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>


      {/* Nav nodes in constellation layout */}
      {pipelineSteps.map(({ id, label, icon: Icon, x, y }, i) => {
        const isDone = i < activeIdx;
        const isActive = i === activeIdx;
        const timeSpent = sectionTimes[id] ?? 0;
        const showTime = isDone && timeSpent >= 1;

        return (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            aria-label={label}
            className="group absolute flex items-center justify-center cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              left: x,
              top: y,
              width: isActive ? 46 : 38,
              height: isActive ? 46 : 38,
              marginLeft: isActive ? -4 : 0,
              marginTop: isActive ? -4 : 0,
              borderRadius: 14,
              background: isActive ? "rgba(201,160,78,0.12)" : "transparent",
              boxShadow: isActive
                ? "0 4px 24px rgba(201,160,78,0.2), inset 0 1px 0 rgba(255,255,255,0.06)"
                : "none",
              border: isActive ? "1px solid rgba(201,160,78,0.15)" : "1px solid transparent",
            }}
          >
            {/* Pulse ring on active */}
            {isActive && (
              <span
                className="absolute inset-0 rounded-[14px] border border-accent/30 animate-[pulse-expand_2.5s_ease-out_infinite]"
              />
            )}

            <Icon
              size={isActive ? 20 : 15}
              strokeWidth={isActive ? 2 : 1.5}
              className={`transition-all duration-500 ${
                isActive
                  ? "text-accent drop-shadow-[0_0_6px_rgba(201,160,78,0.5)]"
                  : isDone
                    ? "text-accent-status/70 group-hover:text-accent-status"
                    : "text-muted/25 group-hover:text-muted/50"
              }`}
            />

            {/* Time badge — beside the wire between this node and the next */}
            {showTime && i < pipelineSteps.length - 1 && (() => {
              const goesRight = pipelineSteps[i + 1].x > x;
              return (
                <span
                  className="absolute text-[7px] leading-none text-accent-status/45 tabular-nums font-medium whitespace-nowrap pointer-events-none"
                  style={{
                    top: ((pipelineSteps[i + 1].y - y) / 2) + 19,
                    ...(goesRight
                      ? { right: 18 }
                      : { left: 18 }),
                  }}
                >
                  {formatTime(timeSpent)}
                </span>
              );
            })()}

            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-card/90 backdrop-blur-xl border border-card-border/50 text-[10px] text-foreground/80 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 transition-all duration-200 shadow-lg z-10">
              {label}
            </span>
          </button>
        );
      })}

      <style>{`
        @keyframes pulse-expand {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes star-breathe {
          0% { box-shadow: 0 0 6px var(--accent), 0 0 12px rgba(201,160,78,0.2); }
          100% { box-shadow: 0 0 14px var(--accent), 0 0 28px rgba(201,160,78,0.4); }
        }
      `}</style>
    </motion.nav>
  );
}
