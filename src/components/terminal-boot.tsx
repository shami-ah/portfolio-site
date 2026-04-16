"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bootLines = [
  { text: "$ ahtesham --init", prefix: "" },
  { text: "loading 5 years of production AI...", prefix: ">" },
  { text: "250+ projects · 1,418 tests · 100+ clients", prefix: ">" },
  { text: "gogaa v0.9.1 online · codelens v0.3.3 online", prefix: ">" },
  { text: "open to opportunities. ready.", prefix: ">", done: true },
];

export function TerminalBoot(): React.ReactElement | null {
  const [visible, setVisible] = useState(false);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("boot-seen");
    if (seen) return;
    setVisible(true);
    sessionStorage.setItem("boot-seen", "1");
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (currentLine >= bootLines.length) {
      const dismiss = setTimeout(() => setVisible(false), 650);
      return () => clearTimeout(dismiss);
    }
    const line = bootLines[currentLine].text;
    if (currentChar < line.length) {
      const speed = currentLine === 0 ? 24 : 14;
      const timer = setTimeout(() => setCurrentChar((c) => c + 1), speed);
      return () => clearTimeout(timer);
    }
    const nextTimer = setTimeout(() => {
      setTypedLines((prev) => [...prev, line]);
      setCurrentLine((c) => c + 1);
      setCurrentChar(0);
    }, currentLine === 0 ? 250 : 150);
    return () => clearTimeout(nextTimer);
  }, [visible, currentLine, currentChar]);

  if (!visible) return null;

  const active = bootLines[currentLine];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[200] bg-background flex items-center justify-center px-4"
        >
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative w-full max-w-xl rounded-lg border border-accent/30 bg-card/90 backdrop-blur-sm shadow-2xl shadow-accent/10 font-mono text-sm overflow-hidden"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border bg-card/50">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <p className="text-[10px] text-muted/60 ml-auto">~/portfolio</p>
            </div>

            {/* Terminal body */}
            <div className="p-4 md:p-5 space-y-1 min-h-[180px]">
              {typedLines.map((line, i) => (
                <p key={i} className="leading-relaxed text-[13px]">
                  <span className={bootLines[i].prefix === "$" ? "text-accent" : "text-muted/50"}>
                    {bootLines[i].prefix}
                  </span>{" "}
                  <span className={bootLines[i].done ? "text-green-400" : "text-foreground/90"}>
                    {line}
                  </span>
                </p>
              ))}
              {active && (
                <p className="leading-relaxed text-[13px]">
                  <span className={active.prefix === "$" ? "text-accent" : "text-muted/50"}>
                    {active.prefix}
                  </span>{" "}
                  <span className={active.done ? "text-green-400" : "text-foreground/90"}>
                    {active.text.slice(0, currentChar)}
                  </span>
                  <span className="inline-block w-[7px] h-[14px] bg-accent/80 ml-0.5 translate-y-[2px] animate-pulse" />
                </p>
              )}
            </div>
          </motion.div>

          {/* Skip hint */}
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute bottom-6 right-6 text-[10px] font-mono text-muted/40 hover:text-muted transition-colors"
          >
            skip →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
