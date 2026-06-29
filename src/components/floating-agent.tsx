"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentEmoji } from "@/components/agent-visuals";
import type { Room } from "@/components/curtain-pull-agent";

const roomMessages: Record<Room, string> = {
  home: "",
  projects: "want details on any project?",
  experience: "curious about a role? ask me",
  toolbelt: "need my CV? just ask",
  contact: "ready to connect? let's talk",
};

export function FloatingAgent({ room }: { room: Room }): React.ReactElement {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, [room]);

  // Hide AgentBar's floating pill when FloatingAgent is visible
  useEffect(() => {
    if (room === "home") {
      document.body.removeAttribute("data-floating-agent");
    } else {
      document.body.setAttribute("data-floating-agent", "true");
    }
    return () => document.body.removeAttribute("data-floating-agent");
  }, [room]);

  if (room === "home") return <div className="hidden" />;

  if (!visible) return <div className="hidden" />;

  return (
    <div className="fixed bottom-6 right-6 z-[55] flex items-end gap-2">
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-2 max-w-[200px] rounded-xl border border-green-400/20 bg-card/95 px-3 py-2 font-mono text-[11px] leading-relaxed text-green-300 shadow-[0_0_24px_rgba(74,222,128,0.1)] backdrop-blur-xl"
          >
            {roomMessages[room]}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("open-chat-widget"))}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative grid h-12 w-12 place-items-center rounded-full border border-green-400/30 bg-card/90 shadow-[0_0_30px_rgba(74,222,128,0.15)] backdrop-blur-xl transition hover:border-green-400/50"
        aria-label="Open agent chat"
      >
        <motion.span
          className="absolute inset-[-4px] rounded-full border border-green-400/10"
          animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-background bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
        <AgentEmoji size={28} mood="default" />
      </motion.button>
    </div>
  );
}
