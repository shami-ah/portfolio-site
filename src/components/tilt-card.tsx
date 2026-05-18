"use client";

import { motion } from "framer-motion";
import { useTilt } from "@/lib/use-tilt";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxDeg?: number;
}

export function TiltCard({ children, className = "", maxDeg = 5 }: TiltCardProps): React.ReactElement {
  const { ref, onMouseMove, onMouseLeave, style } = useTilt(maxDeg);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}
