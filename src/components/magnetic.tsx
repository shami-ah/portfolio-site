"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  as?: "a" | "div" | "button";
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

/** Wraps a child element so it gently drifts toward the cursor within a radius.
 *  Use for CTAs, icons, or any focal interactive element. */
export function Magnetic({
  children,
  strength = 0.3,
  className = "",
  as = "div",
  ...rest
}: MagneticProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  const onMouseMove = (e: React.MouseEvent<HTMLElement>): void => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };
  const onMouseLeave = (): void => {
    x.set(0);
    y.set(0);
  };

  const MotionEl =
    as === "a" ? motion.a : as === "button" ? motion.button : motion.div;

  return (
    <MotionEl
      ref={ref as React.Ref<HTMLElement & HTMLAnchorElement & HTMLButtonElement & HTMLDivElement>}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: sx, y: sy, display: "inline-block" }}
      className={className}
      {...rest}
    >
      {children}
    </MotionEl>
  );
}
