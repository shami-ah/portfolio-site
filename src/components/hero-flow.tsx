"use client";

import { motion } from "framer-motion";

const NODES = [
  "Ingest",
  "Classify",
  "Orchestrate",
  "Review",
  "Execute",
  "Observe",
];

/** Animated data-flow visualization that replaces the flat chip row.
 *  A pulse travels along a connecting line, lighting up each node as it
 *  arrives. Loops infinitely. */
export function HeroFlow(): React.ReactElement {
  const nodeCount = NODES.length;

  return (
    <div className="relative w-full font-mono">
      {/* Pulses — small accent dots that travel along the x-axis.
          We stagger 3 so there's always something moving. */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] pointer-events-none overflow-visible">
        {/* Connecting line */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

        {[0, 2.5, 5].map((delay) => (
          <motion.div
            key={delay}
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_rgba(59,130,246,0.8)]"
            initial={{ left: "0%", opacity: 0 }}
            animate={{
              left: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 7.5,
              delay,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.05, 0.95, 1],
            }}
          />
        ))}
      </div>

      {/* Nodes */}
      <div className="relative grid grid-cols-6 gap-0.5 md:gap-2 items-center">
        {NODES.map((node, i) => (
          <Node key={node} label={node} index={i} total={nodeCount} />
        ))}
      </div>
    </div>
  );
}

function Node({
  label,
  index,
  total,
}: {
  label: string;
  index: number;
  total: number;
}): React.ReactElement {
  // Each node glows when the pulse arrives. The glow is synced to the pulse
  // position: delay = (index / total) * pulseDuration
  const pulseDuration = 7.5;
  const arrival = (index / (total - 1)) * pulseDuration * 0.9; // 0.9 keeps it
                                                               // before reset

  return (
    <div className="relative flex flex-col items-center gap-1 md:gap-1.5">
      <motion.div
        className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg border border-accent/30 bg-card/80 backdrop-blur-sm flex items-center justify-center"
        animate={{
          borderColor: [
            "rgba(59,130,246,0.3)",
            "rgba(59,130,246,0.8)",
            "rgba(59,130,246,0.3)",
          ],
          boxShadow: [
            "0 0 0 0 rgba(59,130,246,0)",
            "0 0 20px 2px rgba(59,130,246,0.35)",
            "0 0 0 0 rgba(59,130,246,0)",
          ],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 0.9,
          delay: arrival,
          repeat: Infinity,
          repeatDelay: pulseDuration - 0.9,
          ease: "easeOut",
        }}
      >
        {/* Inner dot */}
        <motion.span
          className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent"
          animate={{
            scale: [0.6, 1.2, 0.6],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.9,
            delay: arrival,
            repeat: Infinity,
            repeatDelay: pulseDuration - 0.9,
            ease: "easeOut",
          }}
        />
      </motion.div>
      <p className="text-[9px] md:text-[11px] text-muted/70 whitespace-nowrap">
        {label}
      </p>
    </div>
  );
}
