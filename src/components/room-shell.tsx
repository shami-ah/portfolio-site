"use client";

import { motion, type Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function RoomShell({
  children,
  className = "",
  variants,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}): React.ReactElement {
  return (
    <motion.section
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.45, ease }}
      className={`absolute inset-0 z-10 overflow-y-auto overflow-x-hidden px-5 pb-24 pt-16 md:overflow-hidden md:px-8 md:pb-6 md:pl-28 md:pt-20 ${className}`}
    >
      {children}
    </motion.section>
  );
}
