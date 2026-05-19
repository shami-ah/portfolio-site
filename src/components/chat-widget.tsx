"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Calendar, FileText, ArrowRight } from "lucide-react";
import { findAnswer, starters } from "@/lib/kb";
import type { KbAction } from "@/lib/kb";
import { openCvDrawer } from "@/components/cv-drawer";

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

type WidgetState = "closed" | "open";

const BOOK_URL = "https://ahtesham.dev.wadwarehouse.com/book";

const FALLBACK =
  "That's outside what I know about Ahtesham's work right now. Try asking about his rate, stack, availability, tools, or how he works with clients.";

const CHAT_STORAGE_KEY = "portfolio-chat-history";
const CHAT_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const CHAT_MESSAGE_LIMIT = 20;
const LIMIT_MESSAGE =
  "This chat has reached its 20-message limit for this visit. You can still book a call or refresh the conversation later.";

function loadChatHistory(): Message[] {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [];
    const { messages, timestamp } = JSON.parse(raw) as { messages: Message[]; timestamp: number };
    if (Date.now() - timestamp > CHAT_MAX_AGE) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      return [];
    }
    return messages.map((m) => ({ ...m, streaming: false }));
  } catch {
    return [];
  }
}

function saveChatHistory(messages: Message[]): void {
  try {
    if (typeof localStorage === "undefined") return;
    const safeMessages = messages.map((m) => ({ ...m, streaming: false }));
    if (safeMessages.length === 0) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      return;
    }
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ messages: safeMessages, timestamp: Date.now() }));
  } catch {
    // ignore storage quota/private mode failures
  }
}

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
      const seed = (i + 1) * 9301;
      const rand = (offset: number): number => {
        const x = Math.sin(seed + offset) * 10000;
        return x - Math.floor(x);
      };
      result.push({
        id: i,
        x: 10 + rand(1) * 80,  // % from left
        y: 10 + rand(2) * 80,  // % from top
        size: 1.5 + rand(3) * 2.5,
        duration: 6 + rand(4) * 8,
        delay: rand(5) * 4,
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

function buildContextualQuery(query: string, messages: Message[]): string {
  const lower = query.toLowerCase();
  const mentionsSpecificProject = /\b(openevent|open event|codelens|code lens|gogaa|rasad|command center|gluten-free|portable dev|orchestrator)\b/.test(lower);
  if (mentionsSpecificProject) return query;

  const needsContext =
    /\b(it|that|this|those|them|same|there)\b/.test(lower)
    || /\b(can you handle|can you do|what about|how about)\b/.test(lower);

  if (!needsContext) return query;

  const previousUser = [...messages].reverse().find((m) => m.role === "user")?.content;
  if (!previousUser) return query;

  const previousAssistant = [...messages].reverse().find((m) => m.role === "assistant" && m.content.trim())?.content;
  if (!previousAssistant) return `${previousUser}\nFollow-up: ${query}`;

  return `Previous user question: ${previousUser}\nPrevious answer: ${previousAssistant.slice(0, 500)}\nFollow-up: ${query}`;
}

function toSentences(answer: string): string[] {
  return answer
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function applyModelVoice(answer: string, model: string): string {
  const sentences = toSentences(answer);
  if (sentences.length === 0) return answer;

  if (model === "claude") {
    return `Concise read: ${answer}\n\nFit check: scope, constraints, timeline, and production risk decide the next move.`;
  }

  if (model === "gpt4") {
    if (sentences.length === 1) return `Structured answer:\n- ${sentences[0]}`;
    return `Structured answer:\n${sentences.slice(0, 4).map((s) => `- ${s}`).join("\n")}`;
  }

  if (model === "nvidia") {
    return `${answer}\n\nSystems lens: confirm inputs, outputs, integration points, failure modes, and deployment constraints before implementation.`;
  }

  return answer;
}

/* ------------------------------------------------------------------ */
/*  ChatWidget                                                         */
/* ------------------------------------------------------------------ */

export function ChatWidget(): React.ReactElement {
  const [state, setState] = useState<WidgetState>("closed");
  const [messages, setMessages] = useState<Message[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showFallbackChips, setShowFallbackChips] = useState(false);
  const [mountRevision, setMountRevision] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pendingQueriesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setMessages(loadChatHistory());
    setHistoryLoaded(true);
  }, []);

  useEffect(() => {
    if (!historyLoaded) return;
    saveChatHistory(messages);
  }, [historyLoaded, messages]);

  useEffect(() => {
    const onOpen = (): void => setState("open");
    const onClose = (): void => setState("closed");
    const onMountReady = (): void => setMountRevision((n) => n + 1);
    window.addEventListener("open-chat-widget", onOpen);
    window.addEventListener("hide-chat-widget", onClose);
    window.addEventListener("close-chat-widget", onClose);
    window.addEventListener("agent-focus-mount-ready", onMountReady);
    return () => {
      window.removeEventListener("open-chat-widget", onOpen);
      window.removeEventListener("hide-chat-widget", onClose);
      window.removeEventListener("close-chat-widget", onClose);
      window.removeEventListener("agent-focus-mount-ready", onMountReady);
    };
  }, []);

  // Accept pre-filled query from agent bar → open + auto-send (ref avoids declaration order issue)
  const sendRef = useRef<(q: string) => void>(() => {});

  useEffect(() => {
    if (state === "closed") {
      window.dispatchEvent(new CustomEvent("chat-overlay-close"));
    } else {
      window.dispatchEvent(new CustomEvent("chat-widget-active"));
      window.dispatchEvent(new CustomEvent("chat-overlay-open"));
    }
  }, [state]);

  useEffect(() => {
    if (state !== "open") return;
    const timers = [
      window.setTimeout(() => setMountRevision((n) => n + 1), 0),
      window.setTimeout(() => setMountRevision((n) => n + 1), 80),
      window.setTimeout(() => setMountRevision((n) => n + 1), 240),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [state]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking, showFallbackChips]);

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

      const contextualQuery = buildContextualQuery(query, messages);
      const entry = findAnswer(query) ?? findAnswer(contextualQuery);
      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: query,
            query,
            history,
            model: "groq",
          }),
        });
        if (res.ok) {
          const data = await res.json() as { answer?: string; actions?: KbAction[] };
          if (data.answer?.trim()) {
            answer = data.answer.trim();
            actions = data.actions ?? entry?.actions;
          }
        }
      } catch {
        // Local KB fallback keeps the portfolio assistant reliable offline.
      }

      if (!answer) {
        if (entry) {
          answer = applyModelVoice(entry.response, "groq");
          actions = entry.actions;
        } else {
          answer = applyModelVoice(FALLBACK, "groq");
          setShowFallbackChips(true);
        }
      }

      setIsThinking(false);
      setMessages((prev) => [...prev, { id, role: "assistant", content: "", streaming: true, actions }]);
      await streamWords(id, answer);
      pendingQueriesRef.current.delete(query.toLowerCase());
    },
    [streamWords, messages],
  );

  const send = useCallback(
    (q: string): void => {
      const query = q.trim();
      if (!query) return;
      const userCount = messages.filter((m) => m.role === "user").length + pendingQueriesRef.current.size;
      if (userCount >= CHAT_MESSAGE_LIMIT) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === "chat-limit")) return prev;
          return [
            ...prev,
            {
              id: "chat-limit",
              role: "assistant",
              content: LIMIT_MESSAGE,
              actions: [{ label: "Book a 15-min call", href: BOOK_URL }],
            },
          ];
        });
        return;
      }
      const key = query.toLowerCase();
      if (pendingQueriesRef.current.has(key)) return;
      pendingQueriesRef.current.add(key);
      setShowFallbackChips(false);
      setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", content: query }]);
      void streamAnswer(query);
    },
    [streamAnswer, messages],
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

  const msgCount = messages.filter((m) => m.role === "user").length;
  // Broadcast message count to agent bar badge
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("chat-message-count", { detail: msgCount }));
  }, [msgCount]);

  const panel = (
    <AnimatePresence>
      {state === "open" && (
        <div className="w-full">
            <motion.div
              data-chat-panel="open"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full flex flex-col rounded-xl overflow-hidden card-gradient-border pointer-events-auto"
              style={{
                maxHeight: "min(400px, calc(100vh - 12rem))",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              {/* Glass background layer — opaque on mobile, translucent on desktop */}
              <div className="absolute inset-0 bg-card md:bg-card/80 backdrop-blur-2xl rounded-xl" />

            {/* Ambient floating motes */}
            <AmbientMotes />

            {/* ── Header ── */}
            <div className="relative z-10 shrink-0 border-b border-card-border/30">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/ahtesham.jpg" alt="Ahtesham" className="w-8 h-8 rounded-full border border-accent/20 object-cover" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-status border-2 border-card animate-pulse" />
                  </div>
                  <div className="min-w-0 text-left leading-tight">
                    <span className="block font-mono text-[13px] font-semibold text-foreground tracking-normal truncate">Ahtesham Agent</span>
                    <p className="text-[10px] leading-4 font-mono text-muted/50 truncate">portfolio intelligence · scoped to his work</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setState("closed")} className="p-1.5 rounded-lg text-muted/40 hover:text-foreground/70 hover:bg-foreground/5 transition-colors" aria-label="Minimize chat">
                    <Minus size={14} />
                  </button>
                  <button type="button" onClick={() => setState("closed")} className="p-1.5 rounded-lg text-muted/40 hover:text-foreground/70 hover:bg-foreground/5 transition-colors" aria-label="Close chat">
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Body ── */}
            <div
              ref={scrollRef}
              className={`relative z-10 flex-1 px-3 py-3 ${messages.length === 0 ? "overflow-hidden" : "overflow-y-auto space-y-3"}`}
            >
              {/* Welcome card */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-2"
                >
                  <div className="rounded-xl bg-background/40 border border-card-border/40 p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2.5 mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/ahtesham.jpg" alt="Ahtesham Ahmad" className="w-8 h-8 rounded-lg border border-accent/20 object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-foreground font-semibold font-sans text-[13px] leading-tight">Ahtesham Ahmad</p>
                        <p className="text-muted/60 text-caption">AI Engineer · Open to opportunities</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 overflow-hidden">
                      {["Multi-Agent Systems", "TypeScript", "React", "Supabase"].map((t) => (
                        <span key={t} className="px-1.5 py-px text-[10px] leading-4 bg-accent/5 text-accent/70 rounded border border-accent/15">{t}</span>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] text-muted/50 font-sans leading-snug">
                      Ask me about his rate, stack, availability, tools, or how you&apos;d work together.
                    </p>
                    <a
                      href={BOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[11px] font-mono hover:bg-accent/15 hover:border-accent/35 transition-all"
                    >
                      <Calendar size={12} />
                      Book a 15-min call
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {starters.slice(0, 3).map((s, i) => (
                      <motion.button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                        className="text-[10px] leading-4 px-2 py-1 rounded-lg border border-card-border/60 bg-background/30 hover:border-accent/30 hover:bg-accent/5 hover:text-accent transition-all font-sans cursor-pointer"
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

            <div className="relative z-10 shrink-0 border-t border-card-border/30 px-3 py-2 flex items-center justify-between">
              <span className="text-caption font-mono text-muted/25">Ahtesham portfolio context</span>
              <span className="text-caption font-mono text-muted/25">{Math.min(msgCount, CHAT_MESSAGE_LIMIT)}/{CHAT_MESSAGE_LIMIT}</span>
            </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const agentMount = typeof document !== "undefined" ? document.getElementById("agent-focus-mount") : null;
  void mountRevision;
  if (agentMount) return ReactDOM.createPortal(panel, agentMount);
  return <></>;
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
