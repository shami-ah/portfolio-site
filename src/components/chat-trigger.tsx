"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatTrigger(): React.ReactElement {
  const [visible, setVisible] = useState(false);

  // Show after a short delay so it doesn't compete with boot sequence
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Hide on /chat page itself
  if (typeof window !== "undefined" && window.location.pathname === "/chat") {
    return <></>;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="/chat"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          title="Chat with Shami's AI"
          className="fixed bottom-20 right-4 md:right-6 z-40 group flex items-center justify-center w-11 h-11 rounded-full bg-accent/20 border border-accent/20 text-accent hover:bg-accent/20 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/15 transition-all duration-200 backdrop-blur-sm"
        >
          <span className="font-mono text-sm font-bold">&gt;_</span>

          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-2.5 py-1.5 rounded-lg bg-card/80 backdrop-blur-md border border-card-border text-small font-mono text-foreground whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
            Chat with my AI
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
