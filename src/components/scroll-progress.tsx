"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress(): React.ReactElement {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX: progress }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-purple-500 to-emerald-400 z-[60] origin-left pointer-events-none"
    />
  );
}
