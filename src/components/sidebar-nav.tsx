"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { User, FolderOpen, GitCommit, Mail } from "lucide-react";

const L = 2;   // left position
const R = 16;  // right position

const pipelineSteps = [
  { id: "hero", label: "About", icon: User, x: L, y: 0 },
  { id: "projects", label: "Work", icon: FolderOpen, x: R, y: 93 },
  { id: "log", label: "Career", icon: GitCommit, x: L, y: 186 },
  { id: "contact", label: "Connect", icon: Mail, x: R, y: 280 },
] as const;

/** SVG center of each node (icon center = x + 19, y + 19 for a 38px box) */
function cx(i: number): number { return pipelineSteps[i].x + 19; }
function cy(i: number): number { return pipelineSteps[i].y + 19; }

function wirePath(a: number, b: number): string {
  const ax = cx(a), ay = cy(a), bx = cx(b), by = cy(b);
  const midY = (ay + by) / 2;
  return `M ${ax} ${ay} Q ${(ax + bx) / 2 + 4} ${midY} ${bx} ${by}`;
}

/** Get point at t (0→1) along the quadratic bezier between two nodes */
function wirePoint(a: number, b: number, t: number): { x: number; y: number } {
  const ax = cx(a), ay = cy(a), bx = cx(b), by = cy(b);
  const qx = (ax + bx) / 2 + 4, qy = (ay + by) / 2;
  const u = 1 - t;
  return {
    x: u * u * ax + 2 * u * t * qx + t * t * bx,
    y: u * u * ay + 2 * u * t * qy + t * t * by,
  };
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
  const smoothWire = useSpring(scrollProgress, { stiffness: 80, damping: 20, mass: 0.5 });
  const [wireProgress, setWireProgress] = useState(0);

  /* Subscribe to spring output for re-renders */
  useEffect(() => {
    const unsub = smoothWire.on("change", (v: number) => setWireProgress(v));
    return unsub;
  }, [smoothWire]);

  const updateActive = useCallback(() => {
    const scrollY = window.scrollY;
    const lookAhead = scrollY + window.innerHeight * 0.35;

    /* Collect section offsets */
    const offsets: number[] = [];
    for (const { id } of pipelineSteps) {
      const el = document.getElementById(id);
      offsets.push(el ? el.offsetTop : 0);
    }

    /* Active section detection — uses lookahead for snappy nav highlight */
    let current: string = pipelineSteps[0].id;
    for (const { id } of pipelineSteps) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= lookAhead) current = id;
    }

    /* Wire fill — maps total scroll range to 0→N fractional progress.
       First wire fills from scrollY=0 to offsets[1].
       Wire i fills from offsets[i] to offsets[i+1]. */
    let fractional = 0;
    if (offsets.length > 1) {
      for (let i = 0; i < offsets.length - 1; i++) {
        const start = offsets[i];
        const end = offsets[i + 1];
        if (scrollY >= end) {
          fractional = i + 1;
        } else if (scrollY >= start) {
          const range = end - start;
          fractional = i + (range > 0 ? (scrollY - start) / range : 0);
          break;
        } else {
          break;
        }
      }
    }
    scrollProgress.set(fractional);

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

  /* Wire fill: use wireProgress to determine how much of each wire is green.
     wireProgress = 0.0 at top of page, 1.0 at second section, etc.
     Wire i connects section i → i+1.
     Wire i fill = clamp(wireProgress - i, 0, 1) */
  const wires = pipelineSteps.slice(0, -1).map((_, i) => {
    const path = wirePath(i, i + 1);
    const fill = Math.min(1, Math.max(0, wireProgress - i));
    const completed = fill >= 1;
    const filling = fill > 0 && fill < 1;
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
      className="fixed left-3 top-1/2 -translate-y-1/2 z-40 hidden lg:flex font-mono"
      style={{ width: 56, height: 320 }}
    >
      {/* Constellation wires */}
      <svg
        className="absolute inset-0 pointer-events-none overflow-visible"
        viewBox="0 0 56 320"
        fill="none"
      >
        {wires.map((w, i) => {
          const pathLen = 80;
          return (
            <g key={i}>
              {/* Base dashed wire — always visible underneath */}
              <path
                d={w.path}
                stroke="rgba(42,37,32,0.6)"
                strokeWidth={1}
                strokeDasharray="6 4"
                opacity={w.completed ? 0 : 1}
                style={{ transition: "opacity 0.3s" }}
              />

              {/* Green solid overlay — grows from start to end via dashoffset */}
              {w.fill > 0 && (
                <path
                  d={w.path}
                  stroke="rgba(74,222,128,0.3)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeDasharray={pathLen}
                  strokeDashoffset={pathLen * (1 - w.fill)}
                />
              )}

              {/* Scroll-driven energy dot — positioned along bezier curve */}
              {w.fill > 0.01 && w.fill < 0.99 && (() => {
                const pt = wirePoint(i, i + 1, w.fill);
                return (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="2.5"
                    fill="#4ade80"
                    filter="url(#glow-green)"
                    opacity={Math.min(1, Math.min(w.fill, 1 - w.fill) * 6)}
                  />
                );
              })()}

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
              background: isActive ? "rgba(160,120,104,0.12)" : "transparent",
              boxShadow: isActive
                ? "0 4px 24px rgba(160,120,104,0.2), inset 0 1px 0 rgba(255,255,255,0.06)"
                : "none",
              border: isActive ? "1px solid rgba(160,120,104,0.15)" : "1px solid transparent",
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
                  ? "text-accent drop-shadow-[0_0_6px_rgba(160,120,104,0.5)]"
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
          0% { box-shadow: 0 0 6px var(--accent), 0 0 12px rgba(160,120,104,0.2); }
          100% { box-shadow: 0 0 14px var(--accent), 0 0 28px rgba(160,120,104,0.4); }
        }
      `}</style>
    </motion.nav>
  );
}
