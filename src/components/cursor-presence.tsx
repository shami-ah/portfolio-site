"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

interface Ghost {
  id: string;
  name: string;
  color: string;
  targetX: number;
  targetY: number;
}

const names = ["Berlin", "Dubai", "Singapore", "NYC", "Amsterdam", "Lisbon", "Tokyo", "Riyadh"];
const colors = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#ec4899"];

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function makeGhost(i: number): Ghost {
  return {
    id: `g-${i}-${Math.floor(Math.random() * 10000)}`,
    name: names[Math.floor(Math.random() * names.length)],
    color: colors[i % colors.length],
    targetX: rand(0.15, 0.85),
    targetY: rand(0.15, 0.85),
  };
}

export function CursorPresence(): React.ReactElement | null {
  const [on, setOn] = useState(false);
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const [canEnable, setCanEnable] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanEnable(mq.matches);

    // Toggle via custom event (from agent bar / command palette)
    const handler = (): void => setOn((v) => !v);
    window.addEventListener("toggle-presence", handler);
    return () => window.removeEventListener("toggle-presence", handler);
  }, []);

  useEffect(() => {
    if (!on) return;
    setGhosts(Array.from({ length: 3 }, (_, i) => makeGhost(i)));
    const t = setInterval(() => {
      setGhosts((gs) =>
        gs.map((g) => ({
          ...g,
          targetX: rand(0.1, 0.9),
          targetY: rand(0.1, 0.9),
        })),
      );
    }, 3500);
    return () => clearInterval(t);
  }, [on]);

  if (!canEnable || !on) return null;

  return (
    <>
      {/* Small on-indicator top-right (next to nav) */}
      <div className="fixed top-20 right-5 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={() => setOn(false)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/15 border border-accent/40 text-accent text-[10px] font-mono backdrop-blur-md shadow-lg shadow-accent/20 hover:bg-accent/25 transition-all"
          title="Turn off presence"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          presence on · click to stop
        </button>
      </div>

      <AnimatePresence>
        {ghosts.map((g) => (
          <GhostCursor key={g.id} ghost={g} />
        ))}
      </AnimatePresence>
    </>
  );
}

function GhostCursor({ ghost }: { ghost: Ghost }): React.ReactElement {
  const x = useMotionValue(ghost.targetX * window.innerWidth);
  const y = useMotionValue(ghost.targetY * window.innerHeight);
  const sx = useSpring(x, { damping: 26, stiffness: 60, mass: 1.2 });
  const sy = useSpring(y, { damping: 26, stiffness: 60, mass: 1.2 });

  useEffect(() => {
    x.set(ghost.targetX * window.innerWidth);
    y.set(ghost.targetY * window.innerHeight);
  }, [ghost.targetX, ghost.targetY, x, y]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ x: sx, y: sy }}
      className="fixed top-0 left-0 z-20 pointer-events-none"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" className="drop-shadow-md" style={{ color: ghost.color }}>
        <path d="M2 2 L14 8 L8 10 L6 14 Z" fill="currentColor" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />
      </svg>
      <div
        className="absolute left-5 top-3 px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap"
        style={{
          background: `${ghost.color}30`,
          border: `1px solid ${ghost.color}50`,
          color: ghost.color,
        }}
      >
        {ghost.name}
      </div>
    </motion.div>
  );
}
