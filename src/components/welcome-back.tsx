"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function WelcomeBack(): React.ReactElement | null {
  const [show, setShow] = useState(false);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("boot-ever-seen") === "1";
    if (!seen) return;

    const count = parseInt(localStorage.getItem("visit-count") ?? "1", 10) + 1;
    localStorage.setItem("visit-count", String(count));
    setVisitCount(count);

    // Show after hero has materialized
    const timer = setTimeout(() => setShow(true), 800);
    const hide = setTimeout(() => setShow(false), 4500);
    return () => {
      clearTimeout(timer);
      clearTimeout(hide);
    };
  }, []);

  if (visitCount < 2) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-lg bg-card/90 backdrop-blur-md border border-accent/15 shadow-lg shadow-accent/5 font-mono text-caption md:text-xs text-muted/70"
        >
          <span className="text-accent mr-1.5">wb</span>
          visit #{visitCount} — your session is remembered
        </motion.div>
      )}
    </AnimatePresence>
  );
}
