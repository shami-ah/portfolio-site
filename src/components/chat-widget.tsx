"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Maximize2, Send } from "lucide-react";
import { findAnswer, starters } from "@/lib/kb";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

type WidgetState = "closed" | "open" | "minimized";

const MODELS = [
  { id: "groq", label: "Llama 3.3", provider: "Groq" },
  { id: "claude", label: "Claude 4", provider: "Anthropic" },
  { id: "gpt4", label: "GPT-4o", provider: "OpenAI" },
  { id: "nvidia", label: "Nemotron", provider: "NVIDIA" },
] as const;

const FALLBACK =
  "Hmm, that's outside what I know well. Ahtesham would answer it better on a call. Try rephrasing — I know about rate, stack, availability, his tools, and how he works with clients.";

/* ------------------------------------------------------------------ */
/*  Panel spring + overlay                                             */
/* ------------------------------------------------------------------ */

const panelVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const minimizedVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
  exit: { opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.15 } },
};

/* ------------------------------------------------------------------ */
/*  ChatWidget                                                         */
/* ------------------------------------------------------------------ */

export function ChatWidget(): React.ReactElement {
  const [state, setState] = useState<WidgetState>("closed");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [activeModel, setActiveModel] = useState("groq");
  const [showTrigger, setShowTrigger] = useState(false);
  const [triggerGlow, setTriggerGlow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Delay trigger appearance so it doesn't compete with page load
  useEffect(() => {
    const timer = setTimeout(() => setShowTrigger(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Listen for agent flying-to-chat event — add glow pulse before opening
  useEffect(() => {
    const handler = (): void => {
      setTriggerGlow(true);
      setTimeout(() => setTriggerGlow(false), 600);
    };
    window.addEventListener("agent-flying-to-chat", handler);
    return () => window.removeEventListener("agent-flying-to-chat", handler);
  }, []);

  // Listen for custom event from other components (e.g. agent-bar)
  useEffect(() => {
    const handler = (): void => setState("open");
    window.addEventListener("open-chat-widget", handler);
    return () => window.removeEventListener("open-chat-widget", handler);
  }, []);

  // Notify agent bar when chat closes
  useEffect(() => {
    if (state === "closed" || state === "minimized") {
      window.dispatchEvent(new CustomEvent("close-chat-widget"));
    }
  }, [state]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  // Focus input when panel opens
  useEffect(() => {
    if (state === "open") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [state]);

  /* ── Streaming ── */

  const streamWords = useCallback(
    async (id: string, text: string): Promise<void> => {
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
    },
    [],
  );

  const streamAnswer = useCallback(
    async (query: string): Promise<void> => {
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
        // silent fallback to KB
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
    },
    [streamWords],
  );

  const send = useCallback(
    (q: string): void => {
      const query = q.trim();
      if (!query) return;
      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, role: "user", content: query },
      ]);
      setInput("");
      void streamAnswer(query);
    },
    [streamAnswer],
  );

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    send(input);
  };

  const msgCount = messages.filter((m) => m.role === "user").length;
  const model = MODELS.find((m) => m.id === activeModel) ?? MODELS[0];

  /* ── Render ── */

  return (
    <>
      {/* ── Floating trigger button ── */}
      <AnimatePresence>
        {showTrigger && state === "closed" && (
          <motion.button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("open-chat-widget"));
              setState("open");
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed bottom-5 right-5 z-40 group flex items-center justify-center cursor-pointer rounded-full w-[42px] h-[42px] bg-accent/20 border border-accent/20 hover:bg-accent/30 hover:border-accent/40 backdrop-blur-sm transition-all duration-300 ${triggerGlow ? "ring-2 ring-accent-status/60 shadow-[0_0_20px_rgba(74,222,128,0.3)]" : "shadow-lg hover:shadow-xl hover:shadow-accent/15"}`}
          >
            <span className="font-mono text-xs font-bold text-accent shrink-0">&gt;_</span>

            {/* Label — appears on hover to the left */}
            <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl glass text-small font-mono text-foreground whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
              Chat with my AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Minimized bar ── */}
      <AnimatePresence>
        {state === "minimized" && (
          <motion.button
            type="button"
            onClick={() => setState("open")}
            variants={minimizedVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card/70 backdrop-blur-2xl border border-card-border shadow-[0_15px_40px_rgba(0,0,0,0.25),0_0_20px_rgba(212,168,83,0.03)] cursor-pointer hover:border-accent/30 transition-colors group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ahtesham.jpg"
              alt="Ahtesham"
              className="w-6 h-6 rounded-full border border-card-border object-cover"
            />
            <span className="font-mono text-small text-foreground/80">
              Chat with Shami&apos;s AI
            </span>
            {msgCount > 0 && (
              <span className="text-caption font-mono text-accent/60">
                {msgCount} msg{msgCount !== 1 ? "s" : ""}
              </span>
            )}
            <Maximize2
              size={13}
              className="text-muted/40 group-hover:text-accent/60 transition-colors ml-1"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {state === "open" && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[min(560px,calc(100vh-7rem))] flex flex-col rounded-2xl bg-card/80 backdrop-blur-2xl border border-card-border/60 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.35),0_0_40px_rgba(212,168,83,0.04)] hover:border-accent/20 hover:shadow-[0_25px_60px_rgba(0,0,0,0.4),0_0_50px_rgba(212,168,83,0.06)] transition-[border-color,box-shadow] duration-300"
          >
            {/* ── Header ── */}
            <div className="shrink-0 border-b border-card-border/40 bg-card/30">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/ahtesham.jpg"
                    alt="Ahtesham"
                    className="w-8 h-8 rounded-full border border-accent/20 object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        shami.ai
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-status animate-pulse" />
                    </div>
                    <span className="text-caption font-mono text-muted/50">
                      portfolio agent · {model.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setState("minimized")}
                    className="p-1.5 rounded-lg text-muted/40 hover:text-foreground/70 hover:bg-card-hover transition-colors"
                    title="Minimize"
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setState("closed")}
                    className="p-1.5 rounded-lg text-muted/40 hover:text-foreground/70 hover:bg-card-hover transition-colors"
                    title="Close"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Model selector pills */}
              <div className="flex items-center gap-0.5 px-4 pb-2">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveModel(m.id)}
                    className={`px-1.5 py-px rounded text-[9px] leading-[16px] font-mono transition-all cursor-pointer ${
                      activeModel === m.id
                        ? "text-foreground/80 bg-card-hover border border-card-border"
                        : "text-muted/30 hover:text-muted/60 border border-transparent"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Body ── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            >
              {/* Welcome card — only when no messages */}
              {messages.length === 0 && (
                <div className="space-y-3">
                  {/* Compact profile */}
                  <div className="rounded-xl bg-background/50 border border-card-border/60 p-3.5">
                    <div className="flex items-center gap-3 mb-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/ahtesham.jpg"
                        alt="Ahtesham Ahmad"
                        className="w-10 h-10 rounded-xl border border-accent/20 object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-foreground font-semibold font-sans text-sm">
                          Ahtesham Ahmad
                        </p>
                        <p className="text-muted/60 text-caption">
                          AI Engineer · Open to opportunities
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {[
                        "Multi-Agent Systems",
                        "TypeScript",
                        "React",
                        "Supabase",
                      ].map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 text-caption bg-accent/5 text-accent/70 rounded border border-accent/15"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2.5 text-caption text-muted/50 font-sans leading-relaxed">
                      Ask me about his rate, stack, availability, tools, or how
                      you&apos;d work together.
                    </p>
                  </div>

                  {/* Starter chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {starters.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="text-caption px-2.5 py-1.5 rounded-lg border border-card-border bg-background/40 hover:border-accent/30 hover:bg-accent/5 hover:text-accent transition-all font-sans cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map((m) => (
                <WidgetMessage key={m.id} msg={m} />
              ))}

              {/* Thinking */}
              {isThinking && <WidgetThinking />}
            </div>

            {/* ── Input ── */}
            <form
              onSubmit={onSubmit}
              className="shrink-0 border-t border-card-border/40 bg-card/20"
            >
              <div className="flex items-center gap-2 px-3 py-2.5">
                <span className="text-accent font-mono text-sm shrink-0">
                  $
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-muted/30 min-w-0"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="shrink-0 p-1.5 rounded-lg text-accent hover:bg-accent/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                  title="Send"
                >
                  <Send size={14} />
                </button>
              </div>
              <div className="px-3 pb-2 flex items-center justify-between">
                <span className="text-caption font-mono text-muted/20">
                  {model.label} via {model.provider}
                </span>
                <span className="text-caption font-mono text-muted/20">
                  {msgCount}/20
                </span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Message bubble                                                     */
/* ------------------------------------------------------------------ */

function WidgetMessage({ msg }: { msg: Message }): React.ReactElement {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {isUser ? (
        <div className="flex justify-end">
          <div className="max-w-[85%] px-3 py-2 rounded-xl rounded-br-sm bg-accent/15 border border-accent/15 text-small font-sans text-foreground/80 leading-relaxed">
            {msg.content}
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ahtesham.jpg"
            alt="Ahtesham"
            className="w-6 h-6 rounded-full border border-card-border object-cover shrink-0 mt-0.5"
          />
          <div className="min-w-0 max-w-[88%]">
            <div className="px-3 py-2 rounded-xl rounded-tl-sm bg-background/60 border border-card-border/60 text-small font-sans text-foreground/80 leading-relaxed">
              <p className="whitespace-pre-wrap">
                {msg.content}
                {msg.streaming && (
                  <span className="inline-block w-[2px] h-[12px] bg-accent ml-0.5 translate-y-[1px] animate-pulse" />
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
/*  Thinking dots                                                      */
/* ------------------------------------------------------------------ */

function WidgetThinking(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/ahtesham.jpg"
        alt="Ahtesham"
        className="w-6 h-6 rounded-full border border-card-border object-cover shrink-0 mt-0.5"
      />
      <div className="px-3 py-2.5 rounded-xl rounded-tl-sm bg-background/60 border border-card-border/60 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            className="w-1.5 h-1.5 rounded-full bg-accent/50"
          />
        ))}
      </div>
    </motion.div>
  );
}
