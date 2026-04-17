"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { findAnswer, starters } from "@/lib/kb";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const FALLBACK =
  "Hmm, that's outside what I know well. Ahtesham would answer it better on a call — calendly.com/shami8024/30min. Or try rephrasing — I know about rate, stack, availability, his tools, and how he works with clients.";

export function ChatCV(): React.ReactElement {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "assistant",
      content:
        "Hi. I'm an AI assistant scoped to Ahtesham's portfolio. Ask me about his rate, stack, availability, the tools he's built, or how you'd work together. I use his full portfolio as context.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const streamWords = async (id: string, text: string): Promise<void> => {
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 22 + Math.random() * 25));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, content: words.slice(0, i + 1).join(" ") }
            : m,
        ),
      );
    }
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, streaming: false } : m)),
    );
  };

  const streamAnswer = async (query: string): Promise<void> => {
    setIsThinking(true);

    const id = `a-${Date.now()}`;
    let answer = "";

    // Try Groq RAG first, fall back to local KB
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });
      if (res.ok) {
        const data = (await res.json()) as { answer: string };
        answer = data.answer;
      }
    } catch {
      // API unavailable — silent fallback
    }

    // If API returned nothing useful, try local KB
    if (!answer) {
      const entry = findAnswer(query);
      answer = entry ? entry.response : FALLBACK;
    }

    setIsThinking(false);
    setMessages((prev) => [
      ...prev,
      { id, role: "assistant", content: "", streaming: true },
    ]);
    await streamWords(id, answer);
  };

  const send = (q: string): void => {
    const query = q.trim();
    if (!query) return;
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: query },
    ]);
    setInput("");
    void streamAnswer(query);
  };

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    send(input);
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Ambient backdrop */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="fixed -top-40 -right-40 w-[32rem] h-[32rem] bg-accent/[0.06] rounded-full blur-3xl pointer-events-none" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-card-border">
        <div className="max-w-3xl mx-auto px-5 md:px-6 py-3 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-accent transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            back
          </a>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <p className="text-xs font-mono text-muted">
              <span className="text-accent/80">agent</span> · scoped to my work
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://calendly.com/shami8024/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono px-3 py-1.5 rounded-md bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 transition-all"
            >
              book a call →
            </a>
          </div>
        </div>
      </header>

      {/* Chat body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto relative"
      >
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-5">
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} />
          ))}
          {isThinking && <TypingDots />}
        </div>

        {/* Starter chips — only shown before first user message */}
        {messages.length <= 1 && (
          <div className="max-w-3xl mx-auto px-4 md:px-6 pb-4">
            <p className="text-[10px] font-mono text-muted/40 uppercase tracking-[0.25em] mb-3">
              try one of these
            </p>
            <div className="flex flex-wrap gap-2">
              {starters.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-card-border bg-card/60 hover:border-accent/40 hover:bg-accent/10 hover:text-accent transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="sticky bottom-0 z-20 bg-background/90 backdrop-blur-xl border-t border-card-border"
      >
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center gap-3">
          <span className="text-accent font-mono text-lg shrink-0">❯</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ask me anything about my work…"
            className="flex-1 bg-transparent outline-none text-sm md:text-base placeholder:text-muted/40"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 md:px-4 py-2 bg-accent text-white text-xs md:text-sm font-medium rounded-lg hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            send
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
        <p className="text-[9px] md:text-[10px] font-mono text-muted/30 text-center pb-2 px-4">
          powered by Groq · scoped to portfolio context · polite fallback if
          outside scope
        </p>
      </form>
    </main>
  );
}

function MessageBubble({ msg }: { msg: Message }): React.ReactElement {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl text-sm md:text-[15px] leading-relaxed ${
          isUser
            ? "bg-accent text-white rounded-br-md"
            : "bg-card border border-card-border text-foreground/90 rounded-bl-md"
        }`}
      >
        {!isUser && (
          <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-accent/70 mb-1.5">
            agent
          </p>
        )}
        <p className="whitespace-pre-wrap">
          {msg.content}
          {msg.streaming && (
            <span className="inline-block w-[2px] h-[14px] bg-foreground/60 ml-0.5 translate-y-[2px] animate-pulse" />
          )}
        </p>
      </div>
    </motion.div>
  );
}

function TypingDots(): React.ReactElement {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex justify-start"
      >
        <div className="bg-card border border-card-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className="w-1.5 h-1.5 rounded-full bg-accent/70"
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
