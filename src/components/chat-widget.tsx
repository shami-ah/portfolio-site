"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Maximize2, Send, Calendar, FileText, ArrowRight } from "lucide-react";
import { findAnswer, starters } from "@/lib/kb";
import type { KbAction } from "@/lib/kb";
import { openCvDrawer } from "@/components/cv-drawer";
import { AgentEmoji } from "@/components/agent-bar";
import { useTilt } from "@/lib/use-tilt";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  actions?: KbAction[];
}

type WidgetState = "closed" | "open" | "minimized";

const MODELS = [
  { id: "groq", label: "Llama 3.3", provider: "Groq" },
  { id: "claude", label: "Claude 4", provider: "Anthropic" },
  { id: "gpt4", label: "GPT-4o", provider: "OpenAI" },
  { id: "nvidia", label: "Nemotron", provider: "NVIDIA" },
] as const;

const BOOK_URL = "https://ahtesham.dev.wadwarehouse.com/book";

const FALLBACK =
  "That's outside what I know about Ahtesham's work right now. Try asking about his rate, stack, availability, tools, or how he works with clients.";

/* ------------------------------------------------------------------ */
/*  Rich text — clickable URLs and emails                              */
/* ------------------------------------------------------------------ */

const URL_REGEX =
  /(https?:\/\/\S+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?:linkedin|github)\.com\/\S+)/g;

function RichText({ text }: { text: string }): React.ReactElement {
  const parts = text.split(URL_REGEX);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (/^https?:\/\//.test(part)) {
          return (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">{part}</a>
          );
        }
        if (/@/.test(part) && /\./.test(part) && !/\s/.test(part)) {
          return <a key={i} href={`mailto:${part}`} className="text-accent hover:underline">{part}</a>;
        }
        if (/(?:linkedin|github)\.com\//.test(part)) {
          return (
            <a key={i} href={`https://${part}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">{part}</a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Action buttons (Book a Call, View CV, etc.)                        */
/* ------------------------------------------------------------------ */

function ActionButtons({ actions }: { actions: KbAction[] }): React.ReactElement {
  const handleAction = (action: KbAction): void => {
    if (action.href) window.open(action.href, "_blank", "noopener,noreferrer");
    if (action.event) {
      if (action.event === "open-cv-drawer") openCvDrawer();
      else if (action.event === "scroll-projects") document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.dispatchEvent(new CustomEvent(action.event));
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {actions.map((a, i) => (
        <motion.button
          key={a.label}
          type="button"
          onClick={() => handleAction(a)}
          initial={{ opacity: 0, scale: 0.9, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-caption font-mono border border-accent/20 bg-accent/5 text-accent/80 hover:bg-accent/15 hover:border-accent/40 hover:text-accent transition-all cursor-pointer"
        >
          {a.label.includes("Call") && <Calendar size={11} />}
          {a.label.includes("CV") && <FileText size={11} />}
          {!a.label.includes("Call") && !a.label.includes("CV") && <ArrowRight size={11} />}
          {a.label}
        </motion.button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ambient particles — subtle floating motes inside the chat panel    */
/* ------------------------------------------------------------------ */

interface Mote {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

function AmbientMotes(): React.ReactElement {
  const motes = useMemo<Mote[]>(() => {
    const result: Mote[] = [];
    for (let i = 0; i < 8; i++) {
      result.push({
        id: i,
        x: 10 + Math.random() * 80,  // % from left
        y: 10 + Math.random() * 80,  // % from top
        size: 1.5 + Math.random() * 2.5,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 4,
      });
    }
    return result;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {motes.map((m) => (
        <motion.div
          key={m.id}
          className="absolute rounded-full bg-accent/20"
          style={{
            width: m.size,
            height: m.size,
            left: `${m.x}%`,
            top: `${m.y}%`,
            boxShadow: `0 0 ${m.size * 3}px var(--accent-glow)`,
          }}
          animate={{
            y: [0, -20, 5, -15, 0],
            x: [0, 8, -5, 10, 0],
            opacity: [0.15, 0.4, 0.2, 0.45, 0.15],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Panel animation variants                                           */
/* ------------------------------------------------------------------ */

const panelVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.92, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 350, damping: 28 },
  },
  exit: {
    opacity: 0,
    y: 24,
    scale: 0.94,
    filter: "blur(6px)",
    transition: { duration: 0.25 },
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
  const [showFallbackChips, setShowFallbackChips] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tilt = useTilt(4); // subtle 3D tilt on the chat panel

  // No auto-show trigger — chat opens from agent bar only
  useEffect(() => {
    setShowTrigger(false);
  }, []);

  useEffect(() => {
    let glowTimer: ReturnType<typeof setTimeout>;
    const handler = (): void => {
      setTriggerGlow(true);
      glowTimer = setTimeout(() => setTriggerGlow(false), 600);
    };
    window.addEventListener("agent-flying-to-chat", handler);
    return () => {
      window.removeEventListener("agent-flying-to-chat", handler);
      clearTimeout(glowTimer);
    };
  }, []);

  const stateRef = useRef(state);
  stateRef.current = state;
  useEffect(() => {
    const onOpen = (): void => setState("open");
    const onHide = (): void => { if (stateRef.current !== "closed") setState("minimized"); };
    window.addEventListener("open-chat-widget", onOpen);
    window.addEventListener("hide-chat-widget", onHide);
    return () => {
      window.removeEventListener("open-chat-widget", onOpen);
      window.removeEventListener("hide-chat-widget", onHide);
    };
  }, []);

  // Accept pre-filled query from agent bar → open + auto-send (ref avoids declaration order issue)
  const sendRef = useRef<(q: string) => void>(() => {});

  useEffect(() => {
    if (state === "closed") {
      window.dispatchEvent(new CustomEvent("close-chat-widget"));
    } else {
      // Both "open" and "minimized" should hide the agent pill bar
      // Use a separate event name to avoid re-triggering our own open listener
      window.dispatchEvent(new CustomEvent("chat-widget-active"));
    }
  }, [state]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking, showFallbackChips]);

  useEffect(() => {
    if (state === "open") setTimeout(() => inputRef.current?.focus(), 100);
  }, [state]);

  /* ── Streaming ── */

  const streamWords = useCallback(
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
    [],
  );

  const streamAnswer = useCallback(
    async (query: string): Promise<void> => {
      setIsThinking(true);
      setShowFallbackChips(false);
      const id = `a-${Date.now()}`;
      let answer = "";
      let actions: KbAction[] | undefined;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query, model: activeModel }),
        });
        if (res.ok) {
          const data = (await res.json()) as { answer: string };
          answer = data.answer;
        }
      } catch {
        // silent fallback
      }

      if (answer) {
        const lower = answer.toLowerCase();
        if (lower.includes("book a call") || lower.includes("schedule") || lower.includes("15-min") || lower.includes("intro call")) {
          actions = [{ label: "Book a 15-min call", href: BOOK_URL }];
        }
      }

      if (!answer) {
        const entry = findAnswer(query);
        if (entry) {
          answer = entry.response;
          actions = entry.actions;
        } else {
          answer = FALLBACK;
          setShowFallbackChips(true);
        }
      }

      setIsThinking(false);
      setMessages((prev) => [...prev, { id, role: "assistant", content: "", streaming: true, actions }]);
      await streamWords(id, answer);
    },
    [streamWords, activeModel],
  );

  const send = useCallback(
    (q: string): void => {
      const query = q.trim();
      if (!query) return;
      setShowFallbackChips(false);
      setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", content: query }]);
      setInput("");
      void streamAnswer(query);
    },
    [streamAnswer],
  );

  // Keep sendRef in sync for the event listener
  sendRef.current = send;

  useEffect(() => {
    const handler = (e: Event): void => {
      const query = (e as CustomEvent<string>).detail;
      if (!query) return;
      setState("open");
      setTimeout(() => sendRef.current(query), 400);
    };
    window.addEventListener("chat-with-query", handler);
    return () => window.removeEventListener("chat-with-query", handler);
  }, []);

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    send(input);
  };

  const msgCount = messages.filter((m) => m.role === "user").length;
  const model = MODELS.find((m) => m.id === activeModel) ?? MODELS[0];

  return (
    <>
      {/* Chat trigger removed — opens from agent bar only */}

      {/* ── Minimized dot ── */}
      <AnimatePresence>
        {state === "minimized" && (
          <motion.button
            type="button"
            onClick={() => setState("open")}
            variants={minimizedVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-5 right-3 md:right-6 z-50 w-10 h-10 rounded-full glass border border-card-border shadow-[0_8px_24px_rgba(0,0,0,0.3)] cursor-pointer hover:border-accent/30 hover:scale-110 transition-all flex items-center justify-center"
          >
            <AgentEmoji size={22} />
            {msgCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-accent text-[10px] font-mono font-bold text-background flex items-center justify-center px-1">
                {msgCount}
              </span>
            )}
            {/* Running indicator dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent-status border-[1.5px] border-background" style={{ animation: "green-pulse 2s infinite" }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {state === "open" && (
          <div className="fixed bottom-5 right-3 md:right-6 z-50">
          <motion.div
            ref={tilt.ref}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            style={tilt.style}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-[calc(100vw-2rem)] sm:w-[400px] h-[min(560px,calc(100vh-7rem))] flex flex-col rounded-xl overflow-hidden card-gradient-border"
          >
            {/* Glass background layer — opaque on mobile, translucent on desktop */}
            <div className="absolute inset-0 bg-card md:bg-card/75 backdrop-blur-2xl rounded-xl" />

            {/* Ambient floating motes */}
            <AmbientMotes />

            {/* ── Header ── */}
            <div className="relative z-10 shrink-0 border-b border-card-border/30">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/ahtesham.jpg" alt="Ahtesham" className="w-8 h-8 rounded-full border border-accent/20 object-cover" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-status border-2 border-card animate-pulse" />
                  </div>
                  <div>
                    <span className="font-mono text-sm font-semibold text-foreground">shami.ai</span>
                    <p className="text-caption font-mono text-muted/50">portfolio agent · {model.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setState("minimized")} className="p-1.5 rounded-lg text-muted/40 hover:text-foreground/70 hover:bg-foreground/5 transition-colors" aria-label="Minimize chat">
                    <Minus size={14} />
                  </button>
                  <button type="button" onClick={() => setState("closed")} className="p-1.5 rounded-lg text-muted/40 hover:text-foreground/70 hover:bg-foreground/5 transition-colors" aria-label="Close chat">
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
                        ? "text-foreground/80 bg-foreground/8 border border-card-border"
                        : "text-muted/30 hover:text-muted/60 border border-transparent"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Body ── */}
            <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {/* Welcome card */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  <div className="rounded-xl bg-background/40 border border-card-border/40 p-3.5 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/ahtesham.jpg" alt="Ahtesham Ahmad" className="w-10 h-10 rounded-xl border border-accent/20 object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-foreground font-semibold font-sans text-sm">Ahtesham Ahmad</p>
                        <p className="text-muted/60 text-caption">AI Engineer · Open to opportunities</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {["Multi-Agent Systems", "TypeScript", "React", "Supabase"].map((t) => (
                        <span key={t} className="px-1.5 py-0.5 text-caption bg-accent/5 text-accent/70 rounded border border-accent/15">{t}</span>
                      ))}
                    </div>
                    <p className="mt-2.5 text-caption text-muted/50 font-sans leading-relaxed">
                      Ask me about his rate, stack, availability, tools, or how you&apos;d work together.
                    </p>
                    <a
                      href={BOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent text-caption font-mono hover:bg-accent/15 hover:border-accent/35 transition-all"
                    >
                      <Calendar size={12} />
                      Book a 15-min call
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {starters.map((s, i) => (
                      <motion.button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                        className="text-caption px-2.5 py-1.5 rounded-lg border border-card-border/60 bg-background/30 hover:border-accent/30 hover:bg-accent/5 hover:text-accent transition-all font-sans cursor-pointer"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Messages */}
              {messages.map((m) => (
                <WidgetMessage key={m.id} msg={m} />
              ))}

              {isThinking && <WidgetThinking />}

              {/* Fallback suggestion chips */}
              {showFallbackChips && !isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="space-y-2"
                >
                  <p className="text-caption text-muted/40 font-mono">Try one of these:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {starters.slice(0, 4).map((s) => (
                      <button key={s} type="button" onClick={() => send(s)}
                        className="text-caption px-2.5 py-1.5 rounded-lg border border-card-border/60 bg-background/30 hover:border-accent/30 hover:bg-accent/5 hover:text-accent transition-all font-sans cursor-pointer">
                        {s}
                      </button>
                    ))}
                  </div>
                  <a href={BOOK_URL} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-caption font-mono text-accent/60 hover:text-accent transition-colors">
                    <Calendar size={11} />
                    Or book a call to ask directly
                  </a>
                </motion.div>
              )}
            </div>

            {/* ── Input ── */}
            <form onSubmit={onSubmit} className="relative z-10 shrink-0 border-t border-card-border/30">
              <div className="flex items-center gap-2 px-3 py-2.5">
                <span className="text-accent font-mono text-sm shrink-0">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-muted/30 min-w-0"
                />
                <button type="submit" disabled={!input.trim()}
                  className="shrink-0 p-1.5 rounded-lg text-accent hover:bg-accent/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer" title="Send">
                  <Send size={14} />
                </button>
              </div>
              <div className="px-3 pb-2 flex items-center justify-between">
                <span className="text-caption font-mono text-muted/20">{model.label} via {model.provider}</span>
                <span className="text-caption font-mono text-muted/20">{msgCount}/20</span>
              </div>
            </form>
          </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Message bubble — blur-to-sharp entrance + rich text + actions      */
/* ------------------------------------------------------------------ */

function WidgetMessage({ msg }: { msg: Message }): React.ReactElement {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {isUser ? (
        <div className="flex justify-end">
          <div className="max-w-[85%] px-3 py-2 rounded-xl rounded-br-sm bg-accent/12 border border-accent/15 text-small font-sans text-foreground/80 leading-relaxed">
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
            <div className="px-3 py-2 rounded-xl rounded-tl-sm bg-background/40 border border-card-border/40 text-small font-sans text-foreground/80 leading-relaxed backdrop-blur-sm">
              <p className="whitespace-pre-wrap">
                <RichText text={msg.content} />
                {msg.streaming && (
                  <span className="inline-block w-[2px] h-[12px] bg-accent ml-0.5 translate-y-[1px] animate-pulse" />
                )}
              </p>
            </div>
            {!msg.streaming && msg.actions && msg.actions.length > 0 && (
              <ActionButtons actions={msg.actions} />
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Thinking dots — with accent glow                                   */
/* ------------------------------------------------------------------ */

function WidgetThinking(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-2"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/ahtesham.jpg" alt="Ahtesham"
        className="w-6 h-6 rounded-full border border-card-border object-cover shrink-0 mt-0.5" />
      <div className="px-3 py-2.5 rounded-xl rounded-tl-sm bg-background/40 border border-card-border/40 flex items-center gap-1.5 backdrop-blur-sm">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1, 0.8],
              boxShadow: [
                "0 0 0px var(--accent-glow)",
                "0 0 6px var(--accent-glow)",
                "0 0 0px var(--accent-glow)",
              ],
            }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            className="w-1.5 h-1.5 rounded-full bg-accent/50"
          />
        ))}
      </div>
    </motion.div>
  );
}
