"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { setVisitorIntent, type VisitorIntent } from "@/lib/use-lens";

/* ------------------------------------------------------------------ */
/*  First-visit question, asked from inside the dock itself:           */
/*  one line of text, one row of short chips. The answer picks the     */
/*  reading lens and the hero's primary action. Ignoring it is fine.   */
/* ------------------------------------------------------------------ */

const DISMISS_KEY = "visitor-intent-dismissed";

const OPTIONS: { intent: VisitorIntent; label: string; reply: string }[] = [
  { intent: "hiring", label: "Hiring", reply: "Great. CV is up front, no jargon." },
  { intent: "project", label: "A project", reply: "Great. Booking a call is one click." },
  { intent: "developer", label: "Developer", reply: "Nice. Technical mode is on." },
];

const CHIP =
  "px-2.5 py-1 rounded-full border border-accent-status/30 bg-background/40 text-[11px] leading-none text-foreground/85 hover:border-accent-status/70 hover:bg-accent-status/10 transition-colors duration-200 cursor-pointer whitespace-nowrap";

export function isIntentPromptDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function VisitorIntentPrompt({ onDone }: { onDone: () => void }): React.ReactElement {
  const [reply, setReply] = useState<string | null>(null);

  // Let the agent's answer sit for a moment, then hand the dock back
  useEffect(() => {
    if (!reply) return;
    const t = setTimeout(onDone, 2600);
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
    <span className="min-w-0 flex flex-col gap-1.5 text-left">
      <span className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-semibold text-foreground leading-tight" aria-live="polite">
          {reply ?? "What brings you here?"}
        </span>
        {!reply && (
          <button
            type="button"
            onClick={dismiss}
            aria-label="Just looking, dismiss the question"
            className="shrink-0 -mr-1 p-0.5 rounded-full text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
          >
            <X size={13} strokeWidth={2} />
          </button>
        )}
      </span>
      {!reply && (
        <span className="flex items-center gap-1.5">
          {OPTIONS.map((opt) => (
            <button key={opt.intent} type="button" onClick={() => choose(opt)} className={CHIP}>
              {opt.label}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}
