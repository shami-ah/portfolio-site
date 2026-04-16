"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/** Fixed background overlay whose radial color subtly shifts as the user
 *  scrolls through sections. Creates a feeling of "journey" without being
 *  distracting. */
export function HueShift(): React.ReactElement {
  const { scrollYProgress } = useScroll();

  // Colored radial gradient whose color stops shift with scroll progress.
  const bg = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
    [
      // Hero – cool blue
      "radial-gradient(1200px circle at 50% 20%, rgba(59,130,246,0.06), transparent 60%)",
      // About
      "radial-gradient(1200px circle at 30% 30%, rgba(59,130,246,0.055), transparent 60%)",
      // Experience – amber hint
      "radial-gradient(1200px circle at 60% 40%, rgba(245,158,11,0.045), transparent 60%)",
      // Before/After – accent + green
      "radial-gradient(1200px circle at 40% 50%, rgba(16,185,129,0.05), transparent 60%)",
      // Projects – accent
      "radial-gradient(1200px circle at 55% 55%, rgba(59,130,246,0.06), transparent 60%)",
      // Skills – purple accent
      "radial-gradient(1200px circle at 35% 60%, rgba(168,85,247,0.05), transparent 60%)",
      // Contact – cool blue again
      "radial-gradient(1200px circle at 50% 70%, rgba(59,130,246,0.06), transparent 60%)",
    ],
  );

  return (
    <motion.div
      aria-hidden
      style={{ background: bg }}
      className="fixed inset-0 pointer-events-none z-0 transition-colors"
    />
  );
}
