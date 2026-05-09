"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Agent Navigation Reveal — particles fly from agent button to a     */
/*  section, section deblurs as particles arrive                       */
/* ------------------------------------------------------------------ */

function hexToRgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}

function readPalette(): { color: string; glow: string }[] {
  const s = getComputedStyle(document.documentElement);
  const ac = s.getPropertyValue("--accent").trim() || "#d4a853";
  const sc = s.getPropertyValue("--accent-secondary").trim() || "#8ba4c4";
  const st = s.getPropertyValue("--accent-status").trim() || "#4ade80";
  const fg = s.getPropertyValue("--foreground").trim() || "#ede8e0";
  return [
    { color: hexToRgba(ac, 0.9), glow: hexToRgba(ac, 0.45) },
    { color: hexToRgba(ac, 0.6), glow: hexToRgba(ac, 0.25) },
    { color: hexToRgba(sc, 0.75), glow: hexToRgba(sc, 0.35) },
    { color: hexToRgba(st, 0.8), glow: hexToRgba(st, 0.35) },
    { color: hexToRgba(fg, 0.35), glow: hexToRgba(fg, 0.12) },
  ];
}

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

/** Walk up to the nearest <section> so blur covers the full section */
function findSection(id: string): HTMLElement | null {
  const el = document.getElementById(id);
  if (!el) return null;
  if (el.tagName === "SECTION") return el;
  return el.closest("section") ?? el;
}

export function AgentRevealParticles(): React.ReactElement {
  const [particles, setParticles] = useState<Particle[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const idCounter = useRef(0);
  const prevSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onReveal = (e: Event): void => {
      const sectionId = (e as CustomEvent<{ sectionId: string }>).detail?.sectionId;
      if (!sectionId) return;

      const section = findSection(sectionId);
      if (!section) return;

      // Clean up any previous reveal
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      // Reset previous section's styles if it was still mid-reveal
      if (prevSectionRef.current) {
        prevSectionRef.current.style.transition = "";
        prevSectionRef.current.style.filter = "";
        prevSectionRef.current.style.opacity = "";
      }
      prevSectionRef.current = section;
      // Clear old particles immediately
      setParticles([]);

      // Step 1: Blur the section (blurs while scrolling into view)
      section.style.transition = "none";
      section.style.filter = "blur(10px)";
      section.style.opacity = "0.15";
      void section.offsetHeight;
      section.style.transition =
        "filter 1s cubic-bezier(0.4,0,0.2,1), opacity 1s cubic-bezier(0.4,0,0.2,1)";

      // Step 2: After scroll settles, fire particles
      timersRef.current.push(
        setTimeout(() => {
          const rect = section.getBoundingClientRect();
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const palette = readPalette();

          const ox = vw / 2;
          const oy = vh - 32;

          // Target the visible portion of the section
          const visTop = Math.max(rect.top, 0);
          const visBot = Math.min(rect.bottom, vh);
          const visH = Math.max(visBot - visTop, vh * 0.3);

          const count = 25;
          const base = idCounter.current;
          idCounter.current += count;
          const newP: Particle[] = [];

          for (let i = 0; i < count; i++) {
            const tx = rect.left + Math.random() * rect.width;
            const ty = visTop + Math.random() * visH;
            const pal = palette[Math.floor(Math.random() * palette.length)];

            const mx = (ox + tx) / 2;
            const my = (oy + ty) / 2;
            const dx = tx - ox;
            const dy = ty - oy;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const curve = (Math.random() - 0.5) * 0.45;
            const cpx = mx + (-dy / len) * curve * Math.min(vw, vh) * 0.25;
            const cpy = my + (dx / len) * curve * Math.min(vw, vh) * 0.25;

            const focal = i < 4;

            newP.push({
              id: base + i,
              sx: ox, sy: oy,
              cx: cpx, cy: cpy,
              tx, ty,
              size: focal ? 12 + Math.random() * 10 : 3 + Math.random() * 8,
              color: pal.color,
              glow: pal.glow,
              delay: Math.random() * 0.25,
              duration: 1.3 + Math.random() * 0.8,
              focal,
            });
          }

          setParticles(newP);

          // Step 3: Deblur when particles arrive
          timersRef.current.push(
            setTimeout(() => {
              section.style.filter = "blur(0px)";
              section.style.opacity = "1";
            }, 1000),
          );

          // Step 4: Cleanup particles + inline styles
          timersRef.current.push(
            setTimeout(() => {
              setParticles([]);
              section.style.transition = "";
              section.style.filter = "";
              section.style.opacity = "";
              prevSectionRef.current = null;
            }, 2800),
          );
        }, 600),
      );
    };

    window.addEventListener("section-reveal", onReveal);
    return () => {
      window.removeEventListener("section-reveal", onReveal);
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  if (particles.length === 0) return <></>;

  return (
    <div className="fixed inset-0 z-[199] pointer-events-none overflow-hidden">
      {particles.map((p) => {
        const gs = p.focal ? p.size * 4 : p.size * 2.5;
        const ts = p.focal ? p.size * 7 : p.size * 4;

        return (
          <motion.div
            key={p.id}
            initial={{ x: p.sx, y: p.sy, scale: 0, opacity: 0 }}
            animate={{
              x: [p.sx, p.sx, p.cx, p.tx, p.tx],
              y: [p.sy, p.sy, p.cy, p.ty, p.ty],
              scale: p.focal
                ? [0, 1.0, 1.1, 1.5, 0]
                : [0, 0.7, 0.95, 1.2, 0],
              opacity: p.focal
                ? [0, 0.95, 0.9, 1, 0]
                : [0, 0.65, 0.75, 0.55, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              times: [0, 0.1, 0.48, 0.82, 1],
              ease: [0.4, 0, 0.2, 1],
            }}
            className="absolute will-change-transform"
            style={{
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.focal
                ? `radial-gradient(circle, rgba(255,255,255,0.85) 0%, ${p.color} 35%, transparent 70%)`
                : `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
              boxShadow: `0 0 ${gs}px ${p.glow}, 0 0 ${ts}px ${p.glow}`,
            }}
          />
        );
      })}
    </div>
  );
}
