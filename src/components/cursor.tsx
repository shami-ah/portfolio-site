"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type Mode = "idle" | "link" | "text" | "code" | "drag";

export function Cursor(): React.ReactElement | null {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [hidden, setHidden] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { damping: 28, stiffness: 420, mass: 0.4 });
  const sy = useSpring(y, { damping: 28, stiffness: 420, mass: 0.4 });

  // Only enable on devices with fine pointer + hover
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = (): void => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Track mouse position + mode from hovered element
  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent): void => {
      x.set(e.clientX);
      y.set(e.clientY);

      const el = e.target as HTMLElement | null;
      if (!el) return setMode("idle");

      if (el.closest('a, button, [role="button"], summary, label')) {
        setMode("link");
      } else if (el.closest("pre, code, kbd, [contenteditable]")) {
        setMode("code");
      } else if (el.closest("input, textarea")) {
        setMode("text");
      } else {
        setMode("idle");
      }
    };

    const onLeave = (): void => setHidden(true);
    const onEnter = (): void => setHidden(false);
    const onDown = (): void => setMode("drag");
    const onUp = (): void => setMode("idle");

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [enabled, x, y]);

  if (!enabled || hidden) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="fixed top-0 left-0 z-[250] pointer-events-none"
    >
      <AnimatePresence mode="wait">
        {mode === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18 }}
            className="relative -translate-x-1/2 -translate-y-1/2"
          >
            {/* Terminal chevron */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              className="text-accent drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
            >
              <path
                d="M3 2 L9 7 L3 12"
                stroke="currentColor"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="10" y="10" width="3" height="1.5" fill="currentColor" rx="0.5" />
            </svg>
          </motion.div>
        )}

        {mode === "link" && (
          <motion.div
            key="link"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative -translate-x-1/2 -translate-y-1/2"
          >
            {/* Crosshair ring with inner dot */}
            <div className="w-8 h-8 rounded-full border border-accent/70 flex items-center justify-center backdrop-blur-sm bg-accent/5">
              <div className="w-1 h-1 rounded-full bg-accent" />
            </div>
            {/* Compass ticks */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[34px] h-[2px]">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[1px] bg-accent/60" />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-[1px] bg-accent/60" />
              </div>
            </div>
          </motion.div>
        )}

        {mode === "text" && (
          <motion.div
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-[2px] h-[18px] bg-accent animate-pulse" />
          </motion.div>
        )}

        {mode === "code" && (
          <motion.div
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative -translate-x-1/2 -translate-y-1/2 font-mono text-accent text-xs drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]"
          >
            ❯
          </motion.div>
        )}

        {mode === "drag" && (
          <motion.div
            key="drag"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.12 }}
            className="relative -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-4 h-4 rounded-full bg-accent/20 border-2 border-accent" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
