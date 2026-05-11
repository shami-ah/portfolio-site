"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const instant = { duration: 0 };

/* Spring configs with personality — not identical easings everywhere */
const springSnap = { type: "spring" as const, stiffness: 200, damping: 22, mass: 0.8 };
const springSettle = { type: "spring" as const, stiffness: 140, damping: 18, mass: 1 };
const springBounce = { type: "spring" as const, stiffness: 260, damping: 16, mass: 0.6 };

export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}): React.ReactElement {
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={fadeUp}
      initial={false}
      animate="visible"
      transition={reduced ? instant : { ...springSnap, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}): React.ReactElement {
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={fadeIn}
      initial={false}
      animate="visible"
      transition={reduced ? instant : { ...springSettle, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}): React.ReactElement {
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={reduced ? undefined : staggerContainer}
      initial={false}
      animate={reduced ? undefined : "visible"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  direction?: "left" | "right";
  delay?: number;
  className?: string;
}): React.ReactElement {
  const reduced = useReducedMotion();
  void direction;
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, x: 0 }}
      transition={reduced ? instant : { ...springBounce, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export { motion };
