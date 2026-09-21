"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { setVisitorIntent, type VisitorIntent } from "@/lib/use-lens";

/* ------------------------------------------------------------------ */
/*  First-visit question from the agent: who are you?                  */
/*  The answer picks the reading lens and the hero's primary action.   */
/*  Ignoring it is fine — plain-language defaults stay in place.       */
/* ------------------------------------------------------------------ */

const DISMISS_KEY = "visitor-intent-dismissed";

const OPTIONS: { intent: VisitorIntent; label: string; reply: string }[] = [
  { intent: "hiring", label: "I'm hiring", reply: "Great. CV is up front, and I'll keep it jargon-free." },
  { intent: "project", label: "I have a project", reply: "Great. Booking a call is one click, no jargon on the way." },
  { intent: "developer", label: "I'm a developer", reply: "Nice. Technical mode on: diagrams, stack, code." },
];

const CHIP =
  "px-3 py-1.5 rounded-full border border-accent-status/25 bg-card/70 font-mono text-[11px] md:text-xs text-foreground/85 hover:border-accent-status/60 hover:bg-accent-status/10 transition-colors duration-200 cursor-pointer";

export function isIntentPromptDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function VisitorIntentPrompt({ onDone }: { onDone: () => void }): React.ReactElement {
  const [reply, setReply] = useState<string | null>(null);

  // Let the agent's answer sit for a moment, then hand the bubble back
  useEffect(() => {
    if (!reply) return;
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [reply, onDone]);

  const choose = (opt: (typeof OPTIONS)[number]): void => {
    setVisitorIntent(opt.intent);
    window.dispatchEvent(new CustomEvent("emoji-mood", { detail: "proud" }));
    setReply(opt.reply);
  };

  const dismiss = (): void => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // noop
    }
    onDone();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.92, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex flex-col items-start gap-2.5"
    >
      <p className="text-sm font-semibold text-foreground" aria-live="polite">
        {reply ?? "What brings you here?"}
      </p>
      {!reply && (
        <div className="flex flex-wrap items-center gap-1.5">
          {OPTIONS.map((opt) => (
            <button key={opt.intent} type="button" onClick={() => choose(opt)} className={CHIP}>
              {opt.label}
            </button>
          ))}
          <button
            type="button"
            onClick={dismiss}
            className="px-2 py-1.5 font-mono text-[11px] md:text-xs text-muted/60 hover:text-foreground/80 transition-colors cursor-pointer"
          >
            just looking
          </button>
        </div>
      )}
    </motion.div>
  );
}
