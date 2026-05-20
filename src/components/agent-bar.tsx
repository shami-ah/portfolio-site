"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  type AgentCommand,
  commands,
  fuzzyMatch,
  SECTION_ORDER,
  SECTION_PERSONALITY,
  PROJECT_METHODOLOGY,
  SECTION_CHIPS,
  SECTION_INPUT,
} from "./agent-commands";
import {
  type EmojiMood,
  AgentEmoji,
  StageSpeechBubble,
  BuildPopup,
  WhoamiPopup,
  MOOD_POSITIONS,
} from "./agent-visuals";


// Re-export for external consumers that import from agent-bar
export { AgentEmoji } from "./agent-visuals";
export type { EmojiMood } from "./agent-visuals";


/* ------------------------------------------------------------------ */
/*  AgentBar — Button / Panel / Processing                            */
/* ------------------------------------------------------------------ */

type UIState = "hidden" | "button" | "panel" | "processing" | "responding";

/* ------------------------------------------------------------------ */
/*  Visitor memory — persists in sessionStorage                        */
/* ------------------------------------------------------------------ */
const MEMORY_KEY = "agent-visitor-memory";

interface VisitorMemory {
  sectionsViewed: string[];
  commandsUsed: string[];
  projectsOpened: string[];
  visitCount: number;
}

function loadMemory(): VisitorMemory {
  try {
    const raw = sessionStorage.getItem(MEMORY_KEY);
    if (raw) return JSON.parse(raw) as VisitorMemory;
  } catch { /* noop */ }
  return { sectionsViewed: [], commandsUsed: [], projectsOpened: [], visitCount: 0 };
}

function saveMemory(mem: VisitorMemory): void {
  try { sessionStorage.setItem(MEMORY_KEY, JSON.stringify(mem)); } catch { /* noop */ }
}

function recordSection(id: string): void {
  const mem = loadMemory();
  if (!mem.sectionsViewed.includes(id)) {
    mem.sectionsViewed.push(id);
    saveMemory(mem);
  }
}

function recordCommand(keyword: string): void {
  const mem = loadMemory();
  if (!mem.commandsUsed.includes(keyword)) {
    mem.commandsUsed.push(keyword);
    saveMemory(mem);
  }
}

function hasSeenBoot(): boolean {
  try {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("boot-complete") === "1" || localStorage.getItem("boot-ever-seen") === "1";
  } catch {
    return false;
  }
}

function loadSavedMood(): EmojiMood {
  try {
    if (typeof window === "undefined") return "default";
    return (sessionStorage.getItem("agent-mood") as EmojiMood | null) ?? "default";
  } catch {
    return "default";
  }
}

export function AgentBar(): React.ReactElement {
  const router = useRouter();
  const [uiState, setUiState] = useState<UIState>("hidden");
  const [input, setInput] = useState("");
  const [activeCmd, setActiveCmd] = useState<AgentCommand | null>(null);
  const [shownSteps, setShownSteps] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [showBuildPopup, setShowBuildPopup] = useState(false);
  const [showWhoami, setShowWhoami] = useState(false);
  const [buttonReady, setButtonReady] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [viewingProject, setViewingProject] = useState<string | null>(null);
  const [inHeroViewport, setInHeroViewport] = useState(true);
  const [heroAgentOpen, setHeroAgentOpen] = useState(false);
  const [morphPhase, setMorphPhase] = useState<"stage" | "morphing" | "bar">("stage");
  const [moodFacesVisible, setMoodFacesVisible] = useState(false);
  const [moodPickerOpen, setMoodPickerOpen] = useState(false);
  const [emojiHovered, setEmojiHovered] = useState(false);
  const [emojiMoodOverride, setEmojiMoodOverride] = useState<EmojiMood | null>(null);
  const [persistentMood, setPersistentMood] = useState<EmojiMood>("default");
  // Emoji position phases: "hidden" → "bottom" → "settled" (in hero mount)
  const [emojiPhase, setEmojiPhase] = useState<"hidden" | "bottom" | "settled">("hidden");
  const emojiHasSettled = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Chat message count — tracked via ChatWidget events
  const [chatMsgCount, setChatMsgCount] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPersistentMood(loadSavedMood());
      if (!hasSeenBoot()) return;
      setButtonReady(true);
      setUiState("button");
      setEmojiPhase("settled");
      emojiHasSettled.current = true;
      try { sessionStorage.setItem("emoji-settled", "1"); } catch { /* noop */ }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handler = (e: Event): void => {
      setChatMsgCount((e as CustomEvent<number>).detail ?? 0);
    };
    window.addEventListener("chat-message-count", handler);
    return () => window.removeEventListener("chat-message-count", handler);
  }, []);

  useEffect(() => {
    const onOpen = (): void => {
      setChatOpen(true);
      setUiState("panel");
      setMorphPhase("bar");
      setHeroAgentOpen(true);
      setTimeout(() => inputRef.current?.focus(), 120);
    };
    const onClose = (): void => setChatOpen(false);
    window.addEventListener("chat-overlay-open", onOpen);
    window.addEventListener("chat-overlay-close", onClose);
    return () => {
      window.removeEventListener("chat-overlay-open", onOpen);
      window.removeEventListener("chat-overlay-close", onClose);
    };
  }, []);

  // Track which section the user is currently viewing
  useEffect(() => {
    let ticking = false;
    const onScroll = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const probeY = window.scrollY + window.innerHeight * 0.5;
        let current = "hero";
        for (const id of SECTION_ORDER) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= probeY) current = id;
        }
        setActiveSection(current);
        recordSection(current);
        // Track hero viewport — keep inline agent until the hero has actually
        // cleared the bottom agent area. This avoids a visible scroll jump.
        const heroEl = document.getElementById("hero");
        if (heroEl) {
          const rect = heroEl.getBoundingClientRect();
          const wasInHero = rect.bottom > 120;
          setInHeroViewport(wasInHero);
          // Reset emoji when leaving hero — always show emoji on return
          if (!wasInHero) {
            setHeroAgentOpen(false);
            setMorphPhase("stage");
            setEmojiPhase("settled");
          }
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mood constellation — playful secondary control; main emoji click always opens agent.
  useEffect(() => {
    if (emojiPhase !== "settled" || heroAgentOpen || morphPhase !== "stage") {
      const t = setTimeout(() => {
        setMoodFacesVisible(false);
        setMoodPickerOpen(false);
      }, 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setMoodFacesVisible(emojiHovered || moodPickerOpen), 0);
    return () => clearTimeout(t);
  }, [emojiPhase, heroAgentOpen, moodPickerOpen, morphPhase, emojiHovered]);

  // When viewing a project, show methodology chips instead of section chips
  const methodologyChips = viewingProject ? PROJECT_METHODOLOGY[viewingProject] ?? [] : [];

  // Section-aware chips — always show relevant suggestions for current section
  // Never filter these out based on usage; they're contextual navigation aids
  const sectionChips = methodologyChips.length > 0
    ? []
    : (SECTION_CHIPS[activeSection] ?? SECTION_CHIPS.hero);

  const visibleChips = sectionChips.slice(0, 5);

  const inputConfig = SECTION_INPUT[activeSection] ?? SECTION_INPUT.hero;

  // Listen for build popup trigger
  useEffect(() => {
    const handler = (): void => setShowBuildPopup(true);
    window.addEventListener("show-build-popup", handler);
    return () => window.removeEventListener("show-build-popup", handler);
  }, []);

  // Listen for emoji mood changes — temporary override from easter eggs, persistent from mood chips
  useEffect(() => {
    const handler = (e: Event): void => {
      const detail = (e as CustomEvent<{ mood: string; persistent?: boolean }>).detail;
      const mood = (typeof detail === "string" ? detail : detail.mood) as EmojiMood;
      const persistent = typeof detail === "object" && detail.persistent;
      if (persistent) {
        setPersistentMood(mood);
        setEmojiMoodOverride(null);
        try { sessionStorage.setItem("agent-mood", mood); } catch { /* noop */ }
      } else {
        setEmojiMoodOverride(mood);
        setTimeout(() => setEmojiMoodOverride(null), mood === "dancing" ? 5000 : 8000);
      }
    };
    window.addEventListener("emoji-mood", handler);
    return () => window.removeEventListener("emoji-mood", handler);
  }, []);

  // Listen for whoami popup trigger
  useEffect(() => {
    const handler = (): void => setShowWhoami(true);
    window.addEventListener("show-whoami", handler);
    return () => window.removeEventListener("show-whoami", handler);
  }, []);

  // Track project modal opens for visitor memory + set viewing context
  useEffect(() => {
    const onOpen = (e: Event): void => {
      const slug = (e as CustomEvent<string>).detail;
      if (slug) {
        setViewingProject(slug);
        const m = loadMemory();
        if (!m.projectsOpened.includes(slug)) {
          m.projectsOpened.push(slug);
          saveMemory(m);
        }
      }
    };
    window.addEventListener("project-opened", onOpen);
    // Listen for modal close via body attribute change
    const obs = new MutationObserver(() => {
      if (document.body.getAttribute("data-modal-open") !== "true") {
        setViewingProject(null);
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-modal-open"] });
    return () => { window.removeEventListener("project-opened", onOpen); obs.disconnect(); };
  }, []);

  // Listen for agent-button-ready from boot animation
  useEffect(() => {
    const onReady = (): void => {
      setButtonReady(true);
      setUiState("button");
      // Emoji appears at bottom center ONLY on first boot (never again)
      if (!emojiHasSettled.current) {
        setEmojiPhase("bottom");
      }
    };
    window.addEventListener("agent-button-ready", onReady);

    // When hero is fully written by particles → emoji floats up to hero position
    const onHeroReady = (): void => {
      setTimeout(() => {
        setEmojiPhase("settled");
        emojiHasSettled.current = true;
        try { sessionStorage.setItem("emoji-settled", "1"); } catch { /* noop */ }
      }, 400);
    };
    window.addEventListener("hero-fully-written", onHeroReady);

    return () => {
      window.removeEventListener("agent-button-ready", onReady);
      window.removeEventListener("hero-fully-written", onHeroReady);
    };
  }, []);

  // Listen for replay-intro to hide button
  useEffect(() => {
    const onReplay = (): void => {
      setUiState("hidden");
      setButtonReady(false);
      setHeroAgentOpen(false);
      setMorphPhase("stage");
      setMoodFacesVisible(false);
      setMoodPickerOpen(false);
      setEmojiPhase("hidden");
      setPersistentMood("default");
      emojiHasSettled.current = false;
      try { sessionStorage.removeItem("emoji-settled"); sessionStorage.removeItem("agent-mood"); sessionStorage.removeItem("dance-tried"); } catch { /* noop */ }
    };
    window.addEventListener("replay-intro", onReplay);
    return () => window.removeEventListener("replay-intro", onReplay);
  }, []);

  const runCommand = useCallback((cmd: AgentCommand): void => {
    recordCommand(cmd.keyword);
    setActiveCmd(cmd);
    setShownSteps(0);
    setShowResponse(false);
    setUiState("processing");
    // Easter eggs: fire mood change immediately so the hero emoji reacts while processing
    if (cmd.intent === "easter_egg" && cmd.action) {
      cmd.action();
      if (cmd.keyword === "dance") {
        try { sessionStorage.setItem("dance-tried", "1"); } catch { /* noop */ }
      }
    }
  }, []);

  // Hide agent when modal is open
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setModalOpen(document.body.hasAttribute("data-modal-open"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-modal-open"] });
    return () => observer.disconnect();
  }, []);

  // Global keystroke buffer — typing anywhere triggers commands
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      // Escape closes panel from anywhere (even when input is focused)
      if (e.key === "Escape" && (uiState === "panel" || uiState === "processing" || uiState === "responding")) {
        e.preventDefault();
        setActiveCmd(null);
        setShownSteps(0);
        setShowResponse(false);
        setInput("");
        if (chatOpen) window.dispatchEvent(new CustomEvent("close-chat-widget"));
        setUiState("button");
        return;
      }

      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // "/" focuses the panel
      if (e.key === "/" && uiState !== "processing" && uiState !== "responding") {
        e.preventDefault();
        setUiState("panel");
        setTimeout(() => inputRef.current?.focus(), 100);
        return;
      }

      if (e.key.length !== 1) return;
      if (uiState === "processing" || uiState === "responding" || false /* flying-to-chat removed */) return;

      const keyBuffer = ((window as Window & { __agentKeyBuffer?: string }).__agentKeyBuffer ?? "") + e.key.toLowerCase();
      const next = keyBuffer.slice(-12);
      (window as Window & { __agentKeyBuffer?: string }).__agentKeyBuffer = next;
      const match = commands.find((c) => next.endsWith(c.keyword));
      if (match) {
        runCommand(match);
        (window as Window & { __agentKeyBuffer?: string }).__agentKeyBuffer = "";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen, uiState, runCommand]);

  // Stage the steps one-by-one during processing
  useEffect(() => {
    if (uiState !== "processing" || !activeCmd) return;
    if (shownSteps >= activeCmd.steps.length) {
      const t = setTimeout(() => {
        setShowResponse(true);
        setUiState("responding");
      }, 220);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setShownSteps((n) => n + 1),
      activeCmd.steps[shownSteps].ms + 120,
    );
    return () => clearTimeout(t);
  }, [uiState, activeCmd, shownSteps]);

  // Clean up nav timer on unmount
  useEffect(() => () => { if (navTimerRef.current) clearTimeout(navTimerRef.current); }, []);

  // After response, keep panel visible until user interacts (mouse move / click / scroll)
  // Commands with navigation actions (scroll/navigate) auto-dismiss after a brief read delay
  useEffect(() => {
    if (uiState !== "responding" || !activeCmd) return;

    // "chat" command — open ChatWidget
    if (activeCmd.keyword === "chat") {
      const chatTimer = setTimeout(() => {
        setActiveCmd(null);
        setShownSteps(0);
        setShowResponse(false);
        setUiState("button");
        window.dispatchEvent(new CustomEvent("open-chat-widget"));
      }, 1200);
      return () => clearTimeout(chatTimer);
    }

    const cmd = activeCmd;
    const hasAction = !!cmd.action || cmd.keyword === "tour";

    const dismiss = (): void => {
      setActiveCmd(null);
      setShownSteps(0);
      setShowResponse(false);
      setInput("");
      setUiState("button");
      // Fire navigation action after panel closes (skip easter eggs — already fired on submit)
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
      navTimerRef.current = setTimeout(() => {
        if (cmd.keyword === "tour") router.push("/journey");
        else if (cmd.intent !== "easter_egg") cmd.action?.();
      }, 400);
    };

    // For commands with a navigation action, auto-dismiss after 2s read time
    // For info-only commands (rate, stack, availability), wait for user interaction
    let autoTimer: ReturnType<typeof setTimeout> | undefined;
    if (hasAction) {
      autoTimer = setTimeout(dismiss, 2000);
    }

    // Always dismiss on mouse move, click, or scroll (after a 600ms grace period)
    let armed = false;
    const armTimer = setTimeout(() => { armed = true; }, 600);

    const onInteract = (): void => {
      if (!armed) return;
      dismiss();
    };

    window.addEventListener("mousemove", onInteract, { once: true });
    window.addEventListener("click", onInteract, { once: true });
    window.addEventListener("scroll", onInteract, { once: true, passive: true });

    return () => {
      clearTimeout(armTimer);
      if (autoTimer) clearTimeout(autoTimer);
      window.removeEventListener("mousemove", onInteract);
      window.removeEventListener("click", onInteract);
      window.removeEventListener("scroll", onInteract);
    };
  }, [uiState, activeCmd, router]);

  // Reappear as button after being hidden (post-command)
  useEffect(() => {
    if (uiState !== "hidden" || !buttonReady) return;
    const t = setTimeout(() => setUiState("button"), 3000);
    return () => clearTimeout(t);
  }, [uiState, buttonReady]);

  useEffect(() => {
    if (!inHeroViewport) return;
    if (uiState === "processing" || uiState === "responding") {
      window.dispatchEvent(new CustomEvent("agent-overlay-open"));
      return () => {
        window.dispatchEvent(new CustomEvent("agent-overlay-close"));
      };
    }
  }, [inHeroViewport, uiState]);

  useEffect(() => {
    const focusMountShouldExist =
      (!inHeroViewport && (uiState === "panel" || uiState === "processing" || uiState === "responding")) ||
      (inHeroViewport && morphPhase === "bar" && (uiState === "button" || uiState === "panel" || uiState === "processing" || uiState === "responding"));

    if (!focusMountShouldExist) return;
    const frame = requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("agent-focus-mount-ready"));
    });
    return () => cancelAnimationFrame(frame);
  }, [chatOpen, inHeroViewport, morphPhase, uiState]);

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const raw = input.trim();
    const q = raw.toLowerCase();
    if (!q) return;

    if (chatOpen) {
      handleAiQuery(raw);
      return;
    }

    // 0. Project-context queries — "why", "how", "architecture" map to methodology chips
    if (viewingProject && methodologyChips.length > 0) {
      const contextKeywords: Record<string, number> = {
        why: 0, "why this": 0, "why not": 0, reason: 0,
        how: 2, "how did": 2, ship: 2, process: 2, shipped: 2,
        architecture: 1, arch: 1, design: 1, "why this architecture": 1,
      };
      for (const [kw, idx] of Object.entries(contextKeywords)) {
        if (q.includes(kw) && methodologyChips[idx]) {
          runCommand(methodologyChips[idx].command);
          return;
        }
      }
    }

    // 1. Exact keyword match — instant
    const exact = commands.find((c) => c.keyword === q);
    if (exact) { runCommand(exact); return; }
    // 1.5 Project-name mention — route to the exact case study before generic "tell me more" chat intent.
    const projectMention = commands.find((c) =>
      c.intent === "project_detail" && (
        q.includes(c.keyword)
        || (c.keyword === "openevent" && q.includes("open event"))
        || (c.keyword === "codelens" && q.includes("code lens"))
        || (c.keyword === "gogaa" && q.includes("gogaa cli"))
      ),
    );
    if (projectMention) { runCommand(projectMention); return; }
    // 2. Fuzzy intent match — instant
    const fuzzy = fuzzyMatch(q, commands);
    if (fuzzy) { runCommand(fuzzy.command); return; }
    // 3. Free-text → AI dispatch (tier 2)
    handleAiQuery(raw);
  };

  const handleAiQuery = (query: string): void => {
    setInput("");
    // Route free-text queries to ChatWidget
    window.dispatchEvent(new CustomEvent("chat-with-query", { detail: query }));
    setUiState("panel");
    setMorphPhase("bar");
    setHeroAgentOpen(true);
  };

  const onChipClick = (command: string): void => {
    const match = commands.find((c) => c.keyword === command);
    if (match) runCommand(match);
  };

  if (uiState === "hidden" || modalOpen) return <></>;

  const totalMs = activeCmd?.steps.reduce((s, x) => s + x.ms, 0) ?? 0;

  // Hero portal mount point
  const heroMount = typeof document !== "undefined" ? document.getElementById("hero-agent-mount") : null;

  // When in hero viewport, the agent panel renders inline in the hero via portal.
  // The button state is skipped — we go straight to panel appearance in the hero.
  // When scrolled past hero, it renders as the fixed bottom pill/panel.
  const isHeroInline = inHeroViewport && heroMount;

  // In hero viewport, auto-show panel if button state (agent is always "open" in hero)
  const effectiveUiState = isHeroInline && uiState === "button" ? "panel" : uiState;

  // ── Shared processing/response area (used by both hero and fixed modes) ──
  const processingContent = (
    <AnimatePresence>
      {(effectiveUiState === "processing" || effectiveUiState === "responding") && activeCmd && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl bg-card/95 backdrop-blur-xl border border-card-border overflow-hidden"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
        >
          <div className="px-4 py-3 font-mono text-small space-y-1">
            <p className="text-caption font-mono text-accent uppercase tracking-wider mb-2">
              shami.agent
            </p>
            <p className="text-foreground/80">
              <span className="text-accent">&#10095; parse</span>
              <span className="text-muted/60">(&ldquo;</span>
              <span className="text-foreground">{activeCmd.keyword}</span>
              <span className="text-muted/60">&rdquo;)</span>
            </p>
            {activeCmd.steps.slice(0, shownSteps).map((s, i) => {
              const isLast = i === activeCmd.steps.length - 1;
              return (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-baseline gap-2"
                >
                  <span className="text-muted/40">{isLast ? "└─" : "├─"}</span>
                  <span className="text-foreground/80">{s.name}</span>
                  <span className="text-green-400 ml-auto shrink-0">&#10003;</span>
                  <span className="text-muted/40 text-caption tabular-nums">{s.ms}ms</span>
                </motion.div>
              );
            })}
            <AnimatePresence>
              {showResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="pt-2 mt-2 border-t border-card-border/60"
                >
                  <p className="text-foreground leading-relaxed">
                    <span className="text-accent">&#10095; response</span>
                    <span className="text-muted/60">:</span>{" "}
                    <span>{activeCmd.response}</span>
                  </p>
                  <p className="text-caption text-muted/40 mt-1 tabular-nums">
                    completed in {totalMs}ms
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── Morph handlers (plain functions, not hooks) ──
  const handleEmojiClick = (): void => {
    if (emojiMoodOverride === "dancing") return;
    setMorphPhase("morphing");
    setTimeout(() => {
      setMorphPhase("bar");
      setHeroAgentOpen(true);
      setTimeout(() => inputRef.current?.focus(), 200);
    }, 400);
  };

  const handleCloseBar = (): void => {
    setHeroAgentOpen(false);
    setMorphPhase("stage");
    setActiveCmd(null);
    setShownSteps(0);
    setShowResponse(false);
    setInput("");
    if (chatOpen) window.dispatchEvent(new CustomEvent("close-chat-widget"));
  };

  const handleChatToggle = (): void => {
    window.dispatchEvent(new CustomEvent(chatOpen ? "close-chat-widget" : "open-chat-widget"));
  };

  // ── Shared suggestion chips ──
  const chipsContent = (
    <AnimatePresence>
      {effectiveUiState === "panel" && !activeCmd && !chatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center gap-1 md:gap-1.5 flex-wrap px-1 md:px-2"
        >
          {methodologyChips.length > 0
            ? methodologyChips.map((mc, i) => (
                <motion.button
                  key={mc.command.keyword}
                  type="button"
                  onClick={() => runCommand(mc.command)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                  className="px-2 py-1 md:px-3 md:py-1.5 rounded-full glass text-[10px] md:text-small font-mono text-green-400/70 border-green-500/20 hover:text-green-400 hover:border-green-500/40 hover:bg-green-500/5 transition-all cursor-pointer"
                >
                  {mc.label}
                </motion.button>
              ))
            : visibleChips.map((chip, i) => (
                <motion.button
                  key={chip.command}
                  type="button"
                  onClick={() => onChipClick(chip.command)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                  className="px-2 py-1 md:px-3 md:py-1.5 rounded-full glass text-[10px] md:text-small font-mono text-muted/70 hover:text-accent hover:border-accent/30 transition-all cursor-pointer"
                >
                  {chip.label}
                </motion.button>
              ))
          }
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── Hero inline content — Agent Stage (closed) or Input Bar (open) ──
  const heroContent = (
    <div className="w-full mx-auto">
      <AnimatePresence mode="wait">
        {morphPhase !== "bar" ? (
          /* ═══ AGENT STAGE — emoji + scanner + speech bubble ═══ */
          <motion.div
            key="agent-stage"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center justify-center gap-5 md:gap-6 mx-auto"
          >
            {/* Character zone — centered signature object, never shifts */}
            <div
              className="relative w-[170px] h-[190px] md:w-[260px] md:h-[260px] flex items-center justify-center shrink-0 overflow-visible"
              onMouseEnter={() => setEmojiHovered(true)}
              onMouseLeave={() => {
                setEmojiHovered(false);
                setMoodPickerOpen(false);
              }}
            >
              {/* Mood constellation */}
              <AnimatePresence>
                {moodFacesVisible && morphPhase === "stage" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 pointer-events-none scale-[0.65] md:scale-100 origin-center"
                  >
                    {MOOD_POSITIONS.map((mp, i) => (
                      <motion.button key={mp.mood} type="button" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (mp.mood === "dancing") {
                            window.dispatchEvent(new CustomEvent("emoji-mood", { detail: "dancing" }));
                          } else {
                            window.dispatchEvent(new CustomEvent("emoji-mood", { detail: { mood: mp.mood, persistent: true } }));
                          }
                          setMoodPickerOpen(false);
                        }}
                        className="mood-face absolute w-[34px] h-[34px] md:w-[36px] md:h-[36px] rounded-full flex items-center justify-center cursor-pointer pointer-events-auto opacity-80 transition-all duration-300 group hover:scale-[1.25] hover:opacity-100 hover:z-20 border border-accent/20 shadow-md backdrop-blur-xl"
                        style={{ ...mp.style }}
                        aria-label={mp.label}
                      >
                        <AgentEmoji size={16} mood={mp.mood} />
                        <span className="absolute top-1/2 -translate-y-1/2 right-[calc(100%+8px)] font-mono text-[8px] text-accent-status/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{mp.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {/* The emoji character */}
              <div
                className="relative z-10 cursor-pointer"
                onClick={handleEmojiClick}
              >
                {/* Badge */}
                <div className="agent-badge absolute -top-6 md:-top-9 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-0.5 md:px-4 md:py-1.5 rounded-full font-mono text-[8px] md:text-[11px] text-accent-status whitespace-nowrap bg-card/90 border border-accent-status/15 backdrop-blur-xl shadow-sm"
                >
                  <span className="agent-badge-dot w-1 h-1 md:w-[5px] md:h-[5px] rounded-full bg-accent-status animate-pulse" />
                  agent online
                </div>
                {/* Hover outer ring */}
                <div className={`absolute -inset-[10px] rounded-full border border-accent-status/[0.08] pointer-events-none transition-all duration-500 ${emojiHovered ? "opacity-100 border-accent-status/20" : "opacity-0"}`} />
                {/* Emoji body */}
                <motion.div
                  className="agent-emoji-body relative w-[88px] h-[88px] md:w-[160px] md:h-[160px] rounded-full flex items-center justify-center border border-accent/25 shadow-xl"
                  style={{
                    animation: "asymmetric-float 5s ease-in-out infinite, agent-stage-glow 3s ease-in-out infinite",
                  }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={`absolute top-[8%] left-[15%] w-[35%] h-[25%] rounded-full pointer-events-none transition-opacity ${emojiHovered ? "opacity-100" : "opacity-50"}`}
                    style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.04), transparent)" }} />
                  <div className="scale-[0.72] md:scale-100 origin-center">
                    <AnimatePresence mode="wait">
                      {emojiMoodOverride === "dancing" ? (
                        <motion.div key="dance" initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.3, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                          <AgentEmoji size={104} mood="dancing" />
                        </motion.div>
                      ) : (
                        <motion.div key="face" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
                          <AgentEmoji size={112} hovered={emojiHovered} mood={emojiMoodOverride ?? persistentMood} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
                <button
                  type="button"
                  aria-label="Choose agent mood"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMoodPickerOpen((open) => !open);
                  }}
                  className="md:hidden absolute -bottom-1 -left-1 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-accent-status/20 bg-card/90 text-accent-status shadow-md backdrop-blur-xl transition-transform active:scale-95"
                >
                  <AgentEmoji size={13} mood={persistentMood} />
                </button>
              </div>
            </div>
            {/* Speech panel — one centered message surface */}
            <div className="w-full shrink-0">
              <StageSpeechBubble visible={morphPhase === "stage"} emojiHovered={emojiHovered} />
            </div>
          </motion.div>
        ) : (
          /* ═══ INPUT BAR ═══ */
          <motion.div
            key="agent-input"
            initial={{ opacity: 0, scale: 0.7, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.7, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-[calc(100vw-3rem)] md:max-w-[460px] mx-auto"
          >
            <div
              id="agent-focus-mount"
              className="absolute bottom-full left-1/2 mb-3 w-full max-h-[300px] md:max-h-[400px] -translate-x-1/2 overflow-y-auto"
            >
              {processingContent}
            </div>
            <form
              onSubmit={onSubmit}
              data-agent-bar="hero"
              className="card-gradient-border card-glow rounded-2xl bg-card/95 backdrop-blur-xl border border-card-border hover:border-transparent transition-colors duration-300"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px var(--card-border)" }}
            >
              <div className="flex items-center gap-2 md:gap-3 px-3 py-3 md:px-5 md:py-4">
                {/* Chat trigger — emoji dot with green indicator + badge */}
                <button
                  type="button"
                  onClick={handleChatToggle}
                  className="relative w-8 h-8 md:w-9 md:h-9 rounded-full glass border border-card-border hover:border-accent-status/40 hover:scale-110 transition-all shrink-0 cursor-pointer flex items-center justify-center"
                  style={{ boxShadow: "0 0 10px rgba(74,222,128,0.2), 0 0 20px rgba(74,222,128,0.08), 0 2px 8px rgba(0,0,0,0.25)" }}
                  aria-label="Open chat"
                >
                  <AgentEmoji size={20} mood={emojiMoodOverride ?? persistentMood} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-status border-[1.5px] border-card" style={{ animation: "green-pulse 2s infinite" }} />
                  {chatMsgCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] rounded-full bg-accent text-[9px] font-mono font-bold text-background flex items-center justify-center px-0.5">
                      {chatMsgCount}
                    </span>
                  )}
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={chatOpen ? "reply in chat..." : "ask anything about Ahtesham's work..."}
                  disabled={effectiveUiState === "processing" || effectiveUiState === "responding"}
                  className="flex-1 min-w-0 bg-transparent outline-none font-mono text-[11px] md:text-sm placeholder:text-muted/40 text-foreground disabled:opacity-50"
                />
                <button type="button" onClick={handleCloseBar} className="p-1.5 rounded-lg text-muted/40 hover:text-foreground/70 hover:bg-foreground/5 transition-colors shrink-0 cursor-pointer" aria-label="Close agent bar">
                  <X size={14} />
                </button>
              </div>
            </form>
            <div className="mt-4">
              {chipsContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ── Fixed bottom panel content (❯ prompt style) ──
  const fixedPanelContent = (
    <div className="relative">
      <div
        id="agent-focus-mount"
        className="absolute bottom-full left-1/2 mb-3 w-full max-h-[300px] md:max-h-[400px] -translate-x-1/2 overflow-y-auto"
      >
        {processingContent}
      </div>
      {chipsContent}
      <form
        onSubmit={onSubmit}
        data-agent-bar="fixed"
        className="card-gradient-border card-glow rounded-xl bg-card/95 backdrop-blur-xl border border-card-border hover:border-transparent transition-colors duration-300"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px var(--card-border)" }}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 md:px-4 md:py-3">
          <button
            type="button"
            onClick={handleChatToggle}
            className="relative w-7 h-7 md:w-8 md:h-8 rounded-full glass border border-card-border hover:border-accent-status/40 hover:scale-110 transition-all shrink-0 cursor-pointer flex items-center justify-center"
            style={{ boxShadow: "0 0 10px rgba(74,222,128,0.16), 0 2px 8px rgba(0,0,0,0.22)" }}
            aria-label="Open chat"
          >
            <AgentEmoji size={18} mood={emojiMoodOverride ?? persistentMood} />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent-status border-[1.5px] border-card" style={{ animation: "green-pulse 2s infinite" }} />
            {chatMsgCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] rounded-full bg-accent text-[8px] font-mono font-bold text-background flex items-center justify-center px-0.5">
                {chatMsgCount}
              </span>
            )}
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={chatOpen ? "reply in chat..." : (viewingProject ? `ask about this project...` : inputConfig.placeholder)}
            disabled={effectiveUiState === "processing" || effectiveUiState === "responding"}
            className="flex-1 min-w-0 bg-transparent outline-none font-mono text-[11px] md:text-small placeholder:text-muted/35 text-foreground disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => {
              setActiveCmd(null);
              setShownSteps(0);
              setShowResponse(false);
              setInput("");
              if (chatOpen) window.dispatchEvent(new CustomEvent("close-chat-widget"));
              setUiState("button");
            }}
            aria-label="Close agent panel"
            className="text-muted/40 hover:text-foreground shrink-0 transition-colors cursor-pointer ml-1"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      {/* ── Emoji at fixed bottom center (born from boot bubble, throws particles) ── */}
      <AnimatePresence>
        {emojiPhase === "bottom" && inHeroViewport && (
          <motion.div
            key="emoji-bottom"
            className="fixed z-[45] bottom-8 left-1/2"
            initial={{ opacity: 0, scale: 0, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%" }}
            exit={{
              opacity: 0,
              scale: 0.5,
              y: -350,
              x: "-50%",
              transition: { duration: 1, ease: [0.4, 0, 0.2, 1] },
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                className="relative w-16 h-16 rounded-full bg-gradient-to-br from-card-border to-card border border-accent-status/20 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(74,222,128,0.3), 0 0 20px rgba(74,222,128,0.15)",
                    "0 0 0 14px rgba(74,222,128,0), 0 0 35px rgba(160,120,104,0.25)",
                    "0 0 0 0 rgba(74,222,128,0.3), 0 0 20px rgba(74,222,128,0.15)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <AgentEmoji size={40} />
              </motion.div>
              <motion.p
                className="font-mono text-caption text-accent-status/70"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                writing your story...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero inline agent (portal into hero section — emoji settled or agent open) ── */}
      {isHeroInline && emojiPhase === "settled" && (effectiveUiState === "panel" || effectiveUiState === "processing" || effectiveUiState === "responding") && heroMount &&
        ReactDOM.createPortal(heroContent, heroMount)
      }

      {/* ── Fixed bottom agent (when scrolled past hero, hidden when chat active) ── */}
      {!isHeroInline && (
        <>
          {/* Agent pill bar (button state — shows label + input) */}
          <AnimatePresence>
            {uiState === "button" && buttonReady && (
              <div className="fixed z-[100] bottom-5 left-1/2 -translate-x-1/2">
                {(() => {
                  const p = SECTION_PERSONALITY[activeSection] ?? SECTION_PERSONALITY.hero;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      data-agent-pill="fixed"
                      className="flex items-center gap-2 md:gap-3 card-gradient-border rounded-full bg-card/95 backdrop-blur-xl border border-card-border px-3 py-1.5 md:px-4 md:py-2.5 cursor-pointer w-[220px] md:w-[240px] max-w-[calc(100vw-2rem)] hover:border-transparent transition-colors duration-300"
                      style={{
                        boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 12px ${p.glowColor}`,
                      }}
                      onClick={() => {
                        setUiState("panel");
                        setTimeout(() => inputRef.current?.focus(), 150);
                      }}
                    >
	                      <motion.div
	                        className="relative w-7 h-7 md:w-9 md:h-9 rounded-full glass border border-card-border flex items-center justify-center shrink-0"
	                        style={{ boxShadow: "0 0 10px rgba(74,222,128,0.14), 0 2px 8px rgba(0,0,0,0.22)" }}
	                        key={activeSection}
	                        initial={{ scale: 0.8 }}
	                        animate={{ scale: 1 }}
	                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
	                      >
	                        <AgentEmoji size={24} mood={emojiMoodOverride ?? (activeSection === "projects" ? "curious" : activeSection === "log" ? "proud" : activeSection === "contact" ? "waving" : persistentMood)} />
	                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-accent-status border-[1.5px] border-card" style={{ animation: "green-pulse 2s infinite" }} />
	                        {chatMsgCount > 0 && (
	                          <span className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] rounded-full bg-accent text-[8px] font-mono font-bold text-background flex items-center justify-center px-0.5">
	                            {chatMsgCount}
	                          </span>
	                        )}
	                      </motion.div>
                      <span className="flex-1 font-mono text-[11px] md:text-small text-muted/25 bg-foreground/[0.03] rounded-full px-3 py-0.5 md:px-4 md:py-1 truncate">
                        {inputConfig.placeholder}
                      </span>
                    </motion.div>
                  );
                })()}
              </div>
            )}
          </AnimatePresence>

          {/* Panel (expanded command bar — fixed bottom) */}
          <AnimatePresence>
            {(uiState === "panel" || uiState === "processing" || uiState === "responding") && (
              <div className="fixed z-[100] bottom-5 left-1/2 -translate-x-1/2 w-[280px] md:w-[calc(100vw-1.5rem)] max-w-[440px]">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {fixedPanelContent}
              </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Build pipeline popup */}
      <AnimatePresence>
        {showBuildPopup && (
          <BuildPopup onDone={() => setShowBuildPopup(false)} />
        )}
      </AnimatePresence>

      {/* Whoami popup */}
      <AnimatePresence>
        {showWhoami && (
          <WhoamiPopup onDone={() => setShowWhoami(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
