"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, FolderOpen, GitCommit, Network, Mail } from "lucide-react";

export type Room = "home" | "projects" | "experience" | "toolbelt" | "contact";

const L = 2;
const R = 16;

const pipelineSteps = [
  { id: "home" as Room, label: "About", icon: User, x: L, y: 0 },
  { id: "projects" as Room, label: "Work", icon: FolderOpen, x: R, y: 70 },
  { id: "experience" as Room, label: "Career", icon: GitCommit, x: L, y: 140 },
  { id: "toolbelt" as Room, label: "Skills", icon: Network, x: R, y: 210 },
  { id: "contact" as Room, label: "Connect", icon: Mail, x: L, y: 280 },
];

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

export function SignalRail({
  room,
  setRoom,
}: {
  room: Room;
  setRoom: (room: Room) => void;
}): React.ReactElement {
  const [modalOpen, setModalOpen] = useState(false);
  const [sectionTimes, setSectionTimes] = useState<Record<string, number>>({});
  const activeRef = useRef(room);

  const activeIdx = pipelineSteps.findIndex((s) => s.id === room);

  // Track active room in ref for timer
  useEffect(() => {
    activeRef.current = room;
  }, [room]);

  // Track time per section
  useEffect(() => {
    const timer = setInterval(() => {
      setSectionTimes((prev) => ({
        ...prev,
        [activeRef.current]: (prev[activeRef.current] ?? 0) + 1,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Modal detection — hide nav when modals are open
  useEffect(() => {
    if (typeof document === "undefined") return;
    const sync = (): void => {
      setModalOpen(document.body.getAttribute("data-modal-open") === "true");
    };
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-modal-open"] });
    return () => obs.disconnect();
  }, []);

  // Wire fill based on active room index — only completed wires are green
  const wires = pipelineSteps.slice(0, -1).map((_, i) => {
    const path = wirePath(i, i + 1);
    const completed = i < activeIdx;
    return { path, completed };
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
      <svg className="absolute inset-0 pointer-events-none overflow-visible" viewBox="0 0 56 320" fill="none">
        {wires.map((w, i) => {
          const pathLen = 80;
          return (
            <g key={i}>
              {/* Base dashed wire */}
              <path
                d={w.path}
                stroke="var(--wire-stroke)"
                strokeWidth={1}
                strokeDasharray="6 4"
                opacity={w.completed ? 0 : 1}
                style={{ transition: "opacity 0.3s" }}
              />

              {/* Green solid overlay for completed wires */}
              {w.completed && (
                <path
                  d={w.path}
                  stroke="var(--wire-green)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
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

      {/* Nav nodes */}
      {pipelineSteps.map(({ id, label, icon: Icon, x, y }, i) => {
        const isDone = i < activeIdx;
        const isActive = i === activeIdx;
        const timeSpent = sectionTimes[id] ?? 0;
        const showTime = isDone && timeSpent >= 1;

        return (
          <button
            key={id}
            type="button"
            onClick={() => setRoom(id)}
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
              background: isActive ? "var(--accent-glow)" : "transparent",
              boxShadow: isActive
                ? "0 4px 24px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.06)"
                : "none",
              border: isActive
                ? "1px solid color-mix(in srgb, var(--accent) 20%, transparent)"
                : "1px solid transparent",
            }}
          >
            {isActive && (
              <span className="absolute inset-0 rounded-[14px] border border-accent/30 animate-[pulse-expand_2.5s_ease-out_infinite]" />
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

            {/* Time badge */}
            {showTime && i < pipelineSteps.length - 1 && (() => {
              const goesRight = pipelineSteps[i + 1].x > x;
              return (
                <span
                  className="absolute text-[7px] leading-none text-accent-status/45 tabular-nums font-medium whitespace-nowrap pointer-events-none"
                  style={{
                    top: ((pipelineSteps[i + 1].y - y) / 2) + 19,
                    ...(goesRight ? { right: 18 } : { left: 18 }),
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
      `}</style>
    </motion.nav>
  );
}
