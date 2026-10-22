
"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function WelcomeBack(): React.ReactElement | null {
  const [show, setShow] = useState(false);
  const [visitCount, setVisitCount] = useState(0);

  // Restore the previous portfolio scroll position.
  useLayoutEffect(() => {
    const savedPosition = sessionStorage.getItem(
      "portfolio-scroll-position"
    );

    if (savedPosition === null) return;

    const position = Number(savedPosition);

    if (!Number.isFinite(position)) {
      sessionStorage.removeItem("portfolio-scroll-position");
      return;
    }

    let secondFrame = 0;

    const firstFrame = requestAnimationFrame(() => {
      window.scrollTo(0, position);

      secondFrame = requestAnimationFrame(() => {
        window.scrollTo(0, position);
        sessionStorage.removeItem("portfolio-scroll-position");
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);

  // Keep the existing welcome-back notification.
  useEffect(() => {
    const seen = localStorage.getItem("boot-ever-seen") === "1";
    if (!seen) return;

    const count =
      parseInt(localStorage.getItem("visit-count") ?? "1", 10) + 1;

    localStorage.setItem("visit-count", String(count));

    const timer = setTimeout(() => {
      setVisitCount(count);
      setShow(true);
    }, 800);

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
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 1, 1],
          }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-lg bg-card/90 backdrop-blur-md border border-accent/15 shadow-lg shadow-accent/5 font-mono text-caption md:text-xs text-muted/70"
        >
          <span className="text-accent mr-1.5">wb</span>
          visit #{visitCount} — your session is remembered
        </motion.div>
      )}
    </AnimatePresence>
  );
}
