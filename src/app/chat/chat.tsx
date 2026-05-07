"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { findAnswer, starters } from "@/lib/kb";

/* ------------------------------------------------------------------ */
/*  Types & constants                                                  */
/* ------------------------------------------------------------------ */

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const MODELS = [
  { id: "groq", label: "Llama 3.3", provider: "Groq", color: "text-accent" },
  { id: "claude", label: "Claude 4", provider: "Anthropic", color: "text-accent-secondary" },
  { id: "gpt4", label: "GPT-4o", provider: "OpenAI", color: "text-accent-status" },
  { id: "nvidia", label: "Nemotron", provider: "NVIDIA", color: "text-green-400" },
] as const;

const FALLBACK =
  "Hmm, that's outside what I know well. Ahtesham would answer it better on a call. Try rephrasing, I know about rate, stack, availability, his tools, and how he works with clients.";

const WELCOME_LOGO = "GOGAA";
const WELCOME_META = [
  "v1.2.1 · Portfolio Agent Mode",
  "Built by Ahtesham Ahmad · gogaa.dev",
  "",
  "● Model: Llama 3.3 via Groq",
  "● Context: Full portfolio + knowledge base",
  "● Scope: Rate, stack, availability, tools, process",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ChatCV(): React.ReactElement {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [activeModel, setActiveModel] = useState("groq");
  const [booted, setBooted] = useState(false);
  const [bootLine, setBootLine] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Boot sequence
  useEffect(() => {
    if (bootLine < WELCOME_META.length) {
      const timer = setTimeout(() => setBootLine((n) => n + 1), bootLine === 0 ? 600 : 60);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setBooted(true), 400);
    return () => clearTimeout(timer);
  }, [bootLine]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking, bootLine]);

  useEffect(() => {
    if (booted) inputRef.current?.focus();
  }, [booted]);

  const streamWords = async (id: string, text: string): Promise<void> => {
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 18 + Math.random() * 22));
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
      // silent fallback
    }

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

  const model = MODELS.find((m) => m.id === activeModel) ?? MODELS[0];

  return (
    <main className="h-screen flex flex-col bg-background overflow-hidden">

      {/* Header — Gogaa style */}
      <header className="shrink-0 border-b border-card-border bg-card/50">
        {/* Title bar — mimics Gogaa's top bar */}
        <div className="flex items-center gap-3 px-4 md:px-6 py-2.5 border-b border-card-border/50">
          <div className="flex gap-1.5">
            <a href="/" className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors" title="Back to portfolio" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-small font-mono text-muted/50">
              🔒 gogaa.dev / agent / portfolio-chat
            </span>
          </div>
          <span className="text-caption font-mono text-accent-status flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-status animate-pulse" />
            Running
          </span>
        </div>

        {/* Info row: logo + session info + model selector + book */}
        <div className="flex items-center justify-between px-4 md:px-6 py-2.5">
          <div className="flex items-center gap-3">
            {/* Gogaa G logo */}
            <div className="w-8 h-8 rounded-full bg-accent-status flex items-center justify-center shrink-0">
              <span className="text-background font-bold text-sm">G</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-foreground">Gogaa</span>
                <span className="text-caption font-mono text-muted/40">· {model.label}</span>
              </div>
              <span className="text-caption font-mono text-muted/40">portfolio agent mode · scoped to Ahtesham&apos;s work</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model selector pills */}
            <div className="hidden md:flex items-center gap-1 bg-card/50 border border-card-border rounded-lg p-0.5">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveModel(m.id)}
                  className={`px-2.5 py-1 rounded-md text-small font-mono transition-all ${
                    activeModel === m.id
                      ? `text-foreground bg-card-hover border border-card-border`
                      : "text-muted/40 hover:text-muted/70"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <a
              href="https://ahtesham.dev.wadwarehouse.com/book"
              target="_blank"
              rel="noopener noreferrer"
              className="text-small font-mono px-3 py-1.5 rounded-md bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 transition-all"
            >
              book a call
            </a>
          </div>
        </div>
      </header>

      {/* Chat body — terminal style */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono text-sm"
      >
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-4">

          {/* Boot sequence — Gogaa branding */}
          <div className="mb-4">
            {/* Logo */}
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-accent-status flex items-center justify-center shrink-0 shadow-lg shadow-accent-status/20">
                <span className="text-background font-bold text-xl">G</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  <span className="text-accent-status">gogaa</span>
                </h2>
                <p className="text-small font-mono text-muted/50">AI coding agent · open source</p>
              </div>
            </div>

            {/* Meta lines — type in one by one */}
            <div className="text-small md:text-small font-mono leading-[1.6] pl-1">
              {WELCOME_META.slice(0, bootLine).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={i < 2 ? "text-accent-status/60" : "text-muted/50"}
                >
                  {line || "\u00a0"}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Profile card — shows after boot */}
          <AnimatePresence>
            {booted && messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl bg-card/80 border border-card-border p-4 md:p-5"
              >
                <div className="flex items-start gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/ahtesham.jpg"
                    alt="Ahtesham Ahmad"
                    className="w-14 h-14 rounded-xl border border-accent/25 object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-foreground font-semibold font-sans text-base">Ahtesham Ahmad</p>
                    <p className="text-muted/60 text-xs">AI Engineer · Open to opportunities</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {["Multi-Agent Systems", "Production AI", "Developer Tooling", "TypeScript", "React", "Supabase"].map((t) => (
                        <span key={t} className="px-2 py-0.5 text-caption bg-accent/5 text-accent/70 rounded border border-accent/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-card-border/50 text-xs text-muted/60 font-sans leading-relaxed">
                  I&apos;m a portfolio agent scoped to Ahtesham&apos;s work. Ask me about his rate, stack,
                  availability, the tools he built, or how you&apos;d work together.
                </div>

                <div className="mt-3 text-caption text-muted/40">
                  What I can help with:
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {[
                    "Ask about his skills & stack",
                    "Get a rough project estimate",
                    "Check if he's a good fit",
                    "Learn about his tools (Gogaa, CodeLens)",
                    "See his availability & rate",
                    "Send him a direct message",
                  ].map((item, i) => (
                    <div key={i} className="text-small text-muted/50 flex items-center gap-1.5">
                      <span className="text-accent/40">{i + 1}.</span> {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Starter chips */}
          {booted && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {starters.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="text-small px-3 py-1.5 rounded-lg border border-card-border bg-card/60 hover:border-accent/40 hover:bg-accent/10 hover:text-accent transition-all font-sans"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}

          {/* Messages */}
          {messages.map((m) => (
            <ChatMessage key={m.id} msg={m} />
          ))}

          {isThinking && <ThinkingIndicator model={model.label} />}
        </div>
      </div>

      {/* Input — terminal style */}
      <form
        onSubmit={onSubmit}
        className="shrink-0 border-t border-card-border bg-card/30"
      >
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <span className="text-accent font-mono text-sm shrink-0">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ask me anything about Ahtesham..."
            className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-muted/30"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="shrink-0 px-3 py-1.5 bg-accent text-background text-xs font-mono font-medium rounded-md hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            send ↵
          </button>
        </div>
        <div className="max-w-3xl mx-auto px-4 md:px-6 pb-2 flex items-center justify-between">
          <p className="text-caption font-mono text-muted/25">
            gogaa-cli v1.2.1 · portfolio agent mode · {model.label} via {model.provider}
          </p>
          <p className="text-caption font-mono text-muted/25">
            {messages.filter((m) => m.role === "user").length} / 20 messages
          </p>
        </div>
      </form>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Chat message                                                       */
/* ------------------------------------------------------------------ */

function ChatMessage({ msg }: { msg: Message }): React.ReactElement {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isUser ? (
        <div className="flex items-start gap-3 justify-end">
          <div className="max-w-[80%] px-4 py-2.5 rounded-xl rounded-br-sm bg-accent/15 border border-accent/20 text-sm font-sans text-foreground/90">
            {msg.content}
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="shrink-0 mt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ahtesham.jpg"
              alt="Ahtesham"
              className="w-8 h-8 rounded-full border border-card-border object-cover"
            />
          </div>
          <div className="min-w-0 max-w-[85%]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-caption font-mono text-accent/70">shami.ai</span>
              <span className="text-caption font-mono text-muted/30">agent</span>
            </div>
            <div className="px-4 py-3 rounded-xl rounded-tl-sm bg-card border border-card-border text-sm font-sans text-foreground/85 leading-relaxed">
              <p className="whitespace-pre-wrap">
                {msg.content}
                {msg.streaming && (
                  <span className="inline-block w-[2px] h-[14px] bg-accent ml-0.5 translate-y-[2px] animate-pulse" />
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Thinking indicator                                                 */
/* ------------------------------------------------------------------ */

function ThinkingIndicator({ model }: { model: string }): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3"
    >
      <div className="shrink-0 mt-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ahtesham.jpg"
          alt="Ahtesham"
          className="w-8 h-8 rounded-full border border-card-border object-cover"
        />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-caption font-mono text-accent/70">shami.ai</span>
          <span className="text-caption font-mono text-muted/30">thinking via {model}</span>
        </div>
        <div className="px-4 py-3 rounded-xl rounded-tl-sm bg-card border border-card-border flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
              className="w-2 h-2 rounded-full bg-accent/60"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
