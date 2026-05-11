"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function SectionDivider(): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="max-w-5xl mx-auto px-5 md:px-6 py-2">
      <motion.svg
        viewBox="0 0 1200 12"
        preserveAspectRatio="none"
        className="w-full h-3 overflow-visible"
        initial={{ opacity: 0, scaleX: 0.3 }}
        animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ type: "spring", stiffness: 80, damping: 20, duration: 1.2 }}
        style={{ originX: 0.5 }}
      >
        {/* Hand-drawn brushstroke path — irregular, not a straight line */}
        <path
          d="M0 6 C80 4, 160 8, 280 5 S440 7, 560 6 S720 3, 840 6 S1000 8, 1100 5 L1200 6"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeOpacity="0.12"
          strokeLinecap="round"
        />
        {/* Faint secondary stroke for depth — slightly offset */}
        <path
          d="M100 7 C200 5, 320 9, 500 6 S700 4, 900 7 S1050 5, 1200 6"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.8"
          strokeOpacity="0.06"
          strokeLinecap="round"
        />
      </motion.svg>
    </div>
  );
}
