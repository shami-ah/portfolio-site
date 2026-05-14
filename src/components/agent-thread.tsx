"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentEmoji } from "./agent-visuals";
import type { AgentAction } from "@/lib/agent-dispatch";

/* ── Types ── */

export interface ThreadMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  actions?: AgentAction[];
}

/* ── Persistence ── */

const STORAGE_KEY = "agent-thread-history";
const MAX_AGE = 30 * 60 * 1000; // 30 minutes
const MAX_MESSAGES = 30;

export function loadThreadHistory(): ThreadMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as { messages: ThreadMessage[]; timestamp: number };
    if (Date.now() - data.timestamp > MAX_AGE) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return data.messages.slice(-MAX_MESSAGES);
  } catch {
    return [];
  }
}

export function saveThreadHistory(messages: ThreadMessage[]): void {
  try {
    const finished = messages.filter((m) => !m.streaming).slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: finished, timestamp: Date.now() }));
  } catch { /* noop */ }
}

export function hasStoredHistory(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw) as { messages: ThreadMessage[]; timestamp: number };
    return Date.now() - data.timestamp < MAX_AGE && data.messages.length > 0;
  } catch {
    return false;
  }
}

export function getStoredMessageCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const data = JSON.parse(raw) as { messages: ThreadMessage[]; timestamp: number };
    if (Date.now() - data.timestamp > MAX_AGE) return 0;
    return data.messages.length;
  } catch {
    return 0;
  }
}

/* ── Stream Words ── */

export function useStreamWords(
  setMessages: React.Dispatch<React.SetStateAction<ThreadMessage[]>>,
): (id: string, text: string) => Promise<void> {
  return useCallback(
    async (id: string, text: string): Promise<void> => {
      const words = text.split(" ");
      for (let i = 0; i < words.length; i++) {
        await new Promise((r) => setTimeout(r, 18 + Math.random() * 22));
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, content: words.slice(0, i + 1).join(" ") } : m)),
        );
      }
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, streaming: false } : m)));
    },
    [setMessages],
  );
}

/* ── Thread Component ── */

interface ThreadProps {
  messages: ThreadMessage[];
  isRestoredSession?: boolean;
  maxHeight?: string;
  onActionClick?: (action: AgentAction) => void;
}

export function AgentThread({ messages, isRestoredSession, maxHeight = "360px", onActionClick }: ThreadProps): React.ReactElement {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  if (messages.length === 0) return <></>;

  return (
    <div
      ref={scrollRef}
      className="overflow-y-auto px-4 py-3 flex flex-col gap-2.5 font-mono"
      style={{ maxHeight }}
    >
      {/* Session divider for restored history */}
      {isRestoredSession && (
        <div className="flex items-center gap-2 py-1">
          <div className="flex-1 h-px bg-card-border/50" />
          <span className="text-[8px] text-muted/40 whitespace-nowrap">previous session</span>
          <div className="flex-1 h-px bg-card-border/50" />
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.role === "user" ? (
            /* User message — right aligned */
            <div className="flex justify-end">
              <span className="bg-accent/10 text-foreground px-3 py-1.5 rounded-xl rounded-br-sm text-[11px] max-w-[85%]">
                {msg.content}
              </span>
            </div>
          ) : (
            /* Agent message — left aligned with avatar */
            <div className="flex gap-2">
              <div className="w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))" }}
              >
                <AgentEmoji size={10} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-foreground/75 leading-relaxed">
                  {msg.content}
                  {msg.streaming && (
                    <span className="inline-block w-[2px] h-[11px] ml-0.5 align-middle rounded-full animate-pulse"
                      style={{ backgroundColor: "rgba(255,255,255,0.5)", animationDuration: "0.4s" }}
                    />
                  )}
                </p>
                {/* Action buttons */}
                {msg.actions && msg.actions.length > 0 && !msg.streaming && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {msg.actions.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() => onActionClick?.(action)}
                        className="px-2 py-0.5 rounded-lg text-[9px] font-mono bg-accent/8 text-accent border border-accent/15 hover:bg-accent/15 hover:border-accent/30 transition-all cursor-pointer"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
