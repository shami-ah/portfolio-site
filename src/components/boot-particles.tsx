"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Theme-aware color helpers                                          */
/* ------------------------------------------------------------------ */

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function readThemePalette(): { color: string; glow: string }[] {
  const s = getComputedStyle(document.documentElement);
  const accent = s.getPropertyValue("--accent").trim();
  const secondary = s.getPropertyValue("--accent-secondary").trim();
  const status = s.getPropertyValue("--accent-status").trim();
  const fg = s.getPropertyValue("--foreground").trim();

  return [
    { color: hexToRgba(accent, 0.92), glow: hexToRgba(accent, 0.45) },     // 0: accent bright
    { color: hexToRgba(accent, 0.6), glow: hexToRgba(accent, 0.25) },      // 1: accent dim
    { color: hexToRgba(secondary, 0.75), glow: hexToRgba(secondary, 0.32) },// 2: secondary
    { color: hexToRgba(status, 0.82), glow: hexToRgba(status, 0.38) },     // 3: status bright
    { color: hexToRgba(status, 0.5), glow: hexToRgba(status, 0.2) },      // 4: status dim
    { color: hexToRgba(fg, 0.3), glow: hexToRgba(fg, 0.1) },             // 5: foreground subtle
  ];
}

/* ------------------------------------------------------------------ */
/*  Types & Config                                                     */
/* ------------------------------------------------------------------ */

interface Particle {
  id: number;
  sx: number; sy: number;
  cx: number; cy: number;
  tx: number; ty: number;
  size: number;
  color: string;
  glow: string;
  delay: number;
  duration: number;
  focal: boolean;
}

interface WaveConfig {
  target: string;
  xRange: [number, number];
  yRange: [number, number];
  count: number;
  sizes: [number, number];
  baseDelay: number;
  durationRange: [number, number];
  focalCount: number;
  paletteIndices: number[];   // indices into theme palette
}

const WAVES: WaveConfig[] = [
  {
    target: "badge",
    xRange: [0.08, 0.32], yRange: [0.28, 0.38],
    count: 6, sizes: [3, 7], focalCount: 1,
    baseDelay: 0, durationRange: [1.3, 1.8],
    paletteIndices: [3, 4, 5],              // green tones
  },
  {
    target: "title",
    xRange: [0.05, 0.45], yRange: [0.34, 0.5],
    count: 14, sizes: [3, 10], focalCount: 3,
    baseDelay: 0.15, durationRange: [1.5, 2.3],
    paletteIndices: [0, 1, 5, 0],           // gold dominant
  },
  {
    target: "card",
    xRange: [0.52, 0.92], yRange: [0.22, 0.72],
    count: 16, sizes: [3, 10], focalCount: 3,
    baseDelay: 0.25, durationRange: [1.6, 2.8],
    paletteIndices: [0, 2, 3, 5, 1],        // mixed
  },
  {
    target: "desc",
    xRange: [0.05, 0.38], yRange: [0.52, 0.62],
    count: 8, sizes: [2, 8], focalCount: 1,
    baseDelay: 0.55, durationRange: [1.6, 2.3],
    paletteIndices: [2, 5, 1],              // blue + subtle
  },
  {
    target: "cta",
    xRange: [0.05, 0.22], yRange: [0.64, 0.72],
    count: 5, sizes: [4, 8], focalCount: 1,
    baseDelay: 0.8, durationRange: [1.6, 2.3],
    paletteIndices: [0, 1],                 // gold
  },
];

/* ------------------------------------------------------------------ */
/*  Particle generation                                                */
/* ------------------------------------------------------------------ */

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function generateParticles(vw: number, vh: number): {
  particles: Particle[];
  revealSchedule: { target: string; time: number }[];
} {
  const palette = readThemePalette();
  const particles: Particle[] = [];
  const revealSchedule: { target: string; time: number }[] = [];
  let id = 0;

  const sx = vw / 2;
  const sy = vh - 32;

  for (const wave of WAVES) {
    let minArrival = Infinity;

    for (let i = 0; i < wave.count; i++) {
      const tx = lerp(wave.xRange[0], wave.xRange[1], Math.random()) * vw;
      const ty = lerp(wave.yRange[0], wave.yRange[1], Math.random()) * vh;

      // Arc control point — fountain upward then curve to target
      const cx = sx + (tx - sx) * (0.3 + Math.random() * 0.4) + (Math.random() - 0.5) * 100;
      const cy = Math.min(ty, vh * 0.35) * (0.4 + Math.random() * 0.35);

      const palIdx = wave.paletteIndices[Math.floor(Math.random() * wave.paletteIndices.length)];
      const pal = palette[palIdx];
      const delay = wave.baseDelay + Math.random() * 0.25;
      const duration = lerp(wave.durationRange[0], wave.durationRange[1], Math.random());
      const focal = i < wave.focalCount;

      const arrival = delay + duration * 0.88;
      if (arrival < minArrival) minArrival = arrival;

      particles.push({
        id: id++,
        sx, sy, cx, cy, tx, ty,
        size: focal
          ? lerp(wave.sizes[1] * 1.5, wave.sizes[1] * 2.2, Math.random())
          : lerp(wave.sizes[0], wave.sizes[1], Math.random()),
        color: pal.color,
        glow: pal.glow,
        delay,
        duration,
        focal,
      });
    }

    revealSchedule.push({
      target: wave.target,
      time: Math.max(0, minArrival - 0.1) * 1000,
    });
  }

  return { particles, revealSchedule };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function BootParticles(): React.ReactElement {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [active, setActive] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const onBurst = (): void => {
      // Clear previous (replay support)
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const { particles: newP, revealSchedule } = generateParticles(vw, vh);

      setParticles(newP);
      setActive(true);

      // Dispatch hero-reveal events synchronized with particle arrivals
      for (const r of revealSchedule) {
        timersRef.current.push(
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("hero-reveal", { detail: { target: r.target } }),
            );
          }, r.time),
        );
      }

      // Cleanup after all particles finish
      const maxTime = Math.max(...newP.map((p) => (p.delay + p.duration) * 1000));
      timersRef.current.push(
        setTimeout(() => {
          setActive(false);
          setParticles([]);
        }, maxTime + 600),
      );
    };

    window.addEventListener("boot-particles", onBurst);
    return () => {
      window.removeEventListener("boot-particles", onBurst);
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-[199] pointer-events-none overflow-hidden">
          {particles.map((p) => {
            const glowSpread = p.focal ? p.size * 4 : p.size * 2;
            const trailSpread = p.focal ? p.size * 7 : p.size * 3.5;

            return (
              <motion.div
                key={p.id}
                initial={{
                  x: p.sx,
                  y: p.sy,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: [p.sx, p.sx, p.cx, p.tx, p.tx],
                  y: [p.sy, p.sy, p.cy, p.ty, p.ty],
                  scale: p.focal
                    ? [0, 1.0, 1.05, 1.5, 0]
                    : [0, 0.7, 0.9, 1.15, 0],
                  opacity: p.focal
                    ? [0, 0.9, 0.85, 1, 0]
                    : [0, 0.6, 0.75, 0.55, 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  times: [0, 0.1, 0.5, 0.82, 1],
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="absolute will-change-transform"
                style={{
                  width: p.size,
                  height: p.size,
                  borderRadius: "50%",
                  background: p.focal
                    ? `radial-gradient(circle, rgba(255,255,255,0.9) 0%, ${p.color} 40%, transparent 70%)`
                    : `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
                  boxShadow: [
                    `0 0 ${glowSpread}px ${p.glow}`,
                    `0 0 ${trailSpread}px ${p.glow}`,
                    p.focal ? `0 ${p.size}px ${p.size * 3}px ${p.glow}` : "",
                  ]
                    .filter(Boolean)
                    .join(", "),
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
