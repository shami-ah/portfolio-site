"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number; // start x (agent button center)
  y: number; // start y
  tx: number; // target x (random spread)
  ty: number; // target y
  size: number;
  color: string;
  delay: number;
}

const COLORS = [
  "rgba(212,168,83,0.8)", // accent
  "rgba(74,222,128,0.7)", // green
  "rgba(139,164,196,0.6)", // secondary
  "rgba(212,168,83,0.5)",
  "rgba(74,222,128,0.4)",
  "rgba(255,255,255,0.3)",
];

export function BootParticles(): React.ReactElement {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onBurst = (): void => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Agent button is at bottom-center
      const cx = vw / 2;
      const cy = vh - 30;

      const count = 40;
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        // Spread particles across the hero area (top 70% of viewport)
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
        const distance = 150 + Math.random() * Math.max(vw, vh) * 0.5;
        newParticles.push({
          id: i,
          x: cx,
          y: cy,
          tx: cx + Math.cos(angle) * distance * (0.5 + Math.random()),
          ty: cy + Math.sin(angle) * distance * (0.3 + Math.random() * 0.7) - vh * 0.5,
          size: 2 + Math.random() * 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          delay: Math.random() * 0.15,
        });
      }
      setParticles(newParticles);
      setActive(true);

      // Clean up after animation completes
      setTimeout(() => {
        setActive(false);
        setParticles([]);
      }, 2500);
    };

    window.addEventListener("boot-particles", onBurst);
    return () => window.removeEventListener("boot-particles", onBurst);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-[199] pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: p.x,
                y: p.y,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                x: p.tx,
                y: p.ty,
                scale: [0, 1.5, 1, 0.5, 0],
                opacity: [0, 1, 0.8, 0.4, 0],
              }}
              transition={{
                duration: 1.8 + Math.random() * 0.6,
                delay: p.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: p.color,
                boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
