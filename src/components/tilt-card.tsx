"use client";

import { motion } from "framer-motion";
import { useTilt } from "@/lib/use-tilt";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxDeg?: number;
}

export function TiltCard({ children, className = "", maxDeg = 5 }: TiltCardProps): React.ReactElement {
  const tilt = useTilt(maxDeg);

  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={tilt.style}
      className={className}
    >
      {children}
    </motion.div>
  );
}
