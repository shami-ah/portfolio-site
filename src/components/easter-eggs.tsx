"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type EggKind = "shami" | "hire" | "boot" | "wow";

interface Burst {
  id: number;
  x: number;
  y: number;
}

const KEYWORDS: Record<string, EggKind> = {
  shami: "shami",
  hire: "hire",
  boot: "boot",
  wow: "wow",
};

const messages: Record<EggKind, string> = {
  shami: "Hey, you found it. Thanks for exploring :)",
  hire: "Jumping to Contact — let's build something together.",
  boot: "Replaying intro...",
  wow: "That's the idea. Keep scrolling.",
};

const colors = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#ec4899"];

export function EasterEggs(): React.ReactElement {
  const [buffer, setBuffer] = useState("");
  const [activeEgg, setActiveEgg] = useState<EggKind | null>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length !== 1) return; // only single chars

      setBuffer((prev) => {
        const next = (prev + e.key.toLowerCase()).slice(-10);
        for (const kw of Object.keys(KEYWORDS)) {
          if (next.endsWith(kw)) {
            trigger(KEYWORDS[kw]);
            return "";
          }
        }
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const trigger = (kind: EggKind): void => {
    setActiveEgg(kind);

    // Particle burst from center
    const id = Date.now();
    setBursts((b) => [...b, { id, x: 50, y: 50 }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1200);

    // Per-kind side effects
    if (kind === "hire") {
      setTimeout(() => {
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 450);
    }
    if (kind === "boot") {
      sessionStorage.removeItem("boot-seen");
      sessionStorage.removeItem("boot-complete");
      setTimeout(() => window.location.reload(), 500);
    }

    setTimeout(() => setActiveEgg(null), kind === "boot" ? 600 : 2400);
  };

  return (
    <>
      {/* Message toast */}
      <AnimatePresence>
        {activeEgg && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[180] px-5 py-3 rounded-xl bg-card/95 border border-accent/40 backdrop-blur-md shadow-2xl shadow-accent/20 pointer-events-none"
          >
            <p className="text-sm font-mono text-foreground flex items-center gap-2 whitespace-nowrap">
              <span className="text-accent">❯</span>
              {messages[activeEgg]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particle bursts */}
      {bursts.map((b) => (
        <ParticleBurst key={b.id} />
      ))}
    </>
  );
}

function ParticleBurst(): React.ReactElement {
  const particles = Array.from({ length: 36 }, (_, i) => {
    const angle = (i / 36) * Math.PI * 2;
    const distance = 180 + Math.random() * 120;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const color = colors[i % colors.length];
    const size = 4 + Math.random() * 6;
    return { tx, ty, color, size, id: i };
  });

  return (
    <div className="fixed inset-0 z-[170] pointer-events-none flex items-center justify-center">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.tx, y: p.ty, opacity: 0, scale: 0.4 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}
