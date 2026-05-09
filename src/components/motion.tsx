"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const instant = { duration: 0 };

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
      viewport={{ once: true, margin: "-50px" }}
      transition={reduced ? instant : { duration: 0.5, delay, ease: "easeOut" }}
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
      viewport={{ once: true, margin: "-50px" }}
      transition={reduced ? instant : { duration: 0.6, delay }}
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
      viewport={{ once: true, margin: "-50px" }}
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
      viewport={{ once: true, margin: "-50px" }}
      transition={reduced ? instant : { duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export { motion };
