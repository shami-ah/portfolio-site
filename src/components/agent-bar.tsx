"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
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
import { useSoundFX } from "@/lib/use-sound-fx";
import { VisitorIntentPrompt, isIntentPromptDismissed } from "./visitor-intent-prompt";
import { getDockContext, type DockRoute } from "./agent-dock-data";
import { openCvDrawer } from "./cv-drawer";
import {
  type EmojiMood,
  AgentEmoji,
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
  const { play: playSoundFX } = useSoundFX();
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
  // Flagship chapter currently in view — lets the dock speak about one project at a time
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [moodPickerOpen, setMoodPickerOpen] = useState(false);
  const [emojiMoodOverride, setEmojiMoodOverride] = useState<EmojiMood | null>(null);
  const [persistentMood, setPersistentMood] = useState<EmojiMood>("default");
  // Emoji position phases: "hidden" → "bottom" (born after the intro replay) → "settled" (docked)
  const [emojiPhase, setEmojiPhase] = useState<"hidden" | "bottom" | "settled">("hidden");
  const emojiHasSettled = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const prevUiStateRef = useRef<UIState>("hidden");

  // Play sound when agent starts responding
  useEffect(() => {
    if (uiState === "responding" && prevUiStateRef.current !== "responding") {
      playSoundFX("agent-respond");
    }
    prevUiStateRef.current = uiState;
  }, [uiState, playSoundFX]);

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
          const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
          if (el && top <= probeY) current = id;
        }
        setActiveSection(current);
        recordSection(current);
        let chapter: string | null = null;
        if (current === "projects") {
          for (const el of document.querySelectorAll<HTMLElement>('[id^="project-"]')) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
              chapter = el.id.replace("project-", "");
            }
          }
        }
        setActiveChapter(chapter);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // When viewing a project, show methodology chips instead of section chips
  const methodologyChips = viewingProject ? PROJECT_METHODOLOGY[viewingProject] ?? [] : [];

  // Section-aware chips — always show relevant suggestions for current section
  // Never filter these out based on usage; they're contextual navigation aids
  const sectionChips = methodologyChips.length > 0
    ? []
    : (SECTION_CHIPS[activeSection] ?? SECTION_CHIPS.hero);

  const visibleChips = sectionChips.slice(0, 5);

  const inputConfig = SECTION_INPUT[activeSection] ?? SECTION_INPUT.hero;

  // First visit: the agent asks who the visitor is instead of cycling its usual messages
  const [showIntentPrompt, setShowIntentPrompt] = useState(false);
  const closeIntentPrompt = useCallback((): void => setShowIntentPrompt(false), []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const answered = localStorage.getItem("visitor-intent") !== null;
        if (!answered && !isIntentPromptDismissed()) setShowIntentPrompt(true);
      } catch {
        // storage unavailable — keep the regular bubble
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

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

  // ChatWidget portals into the dock's focus mount — tell it whenever the mount appears
  useEffect(() => {
    if (uiState !== "panel" && uiState !== "processing" && uiState !== "responding") return;
    const frame = requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("agent-focus-mount-ready"));
    });
    return () => cancelAnimationFrame(frame);
  }, [chatOpen, uiState]);

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
  };

  const onChipClick = (command: string): void => {
    const match = commands.find((c) => c.keyword === command);
    if (match) runCommand(match);
  };

  if (uiState === "hidden" || modalOpen) return <></>;

  const totalMs = activeCmd?.steps.reduce((s, x) => s + x.ms, 0) ?? 0;

  const dock = getDockContext(activeSection, activeChapter);
  const sectionMood: EmojiMood =
    emojiMoodOverride ??
    (activeSection === "projects" ? "curious" : activeSection === "log" ? "proud" : activeSection === "contact" ? "waving" : persistentMood);
  const personality = SECTION_PERSONALITY[activeSection] ?? SECTION_PERSONALITY.hero;
  const isOpen = uiState === "panel" || uiState === "processing" || uiState === "responding";
  const isBusy = uiState === "processing" || uiState === "responding";

  const closePanel = (): void => {
    setActiveCmd(null);
    setShownSteps(0);
    setShowResponse(false);
    setInput("");
    setMoodPickerOpen(false);
    if (chatOpen) window.dispatchEvent(new CustomEvent("close-chat-widget"));
    setUiState("button");
  };

  const handleChatToggle = (): void => {
    window.dispatchEvent(new CustomEvent(chatOpen ? "close-chat-widget" : "open-chat-widget"));
  };

  const followRoute = (route: DockRoute): void => {
    closePanel();
    if (route.kind === "scroll") {
      document.getElementById(route.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (route.kind === "cv") {
      openCvDrawer();
    } else if (route.kind === "expand") {
      window.dispatchEvent(new CustomEvent("open-project-detail", { detail: { slug: route.slug, kind: route.view } }));
    } else if (route.external || route.href.startsWith("mailto:")) {
      window.open(route.href, route.external ? "_blank" : "_self", "noopener");
    } else {
      router.push(route.href);
    }
  };

  // ── Command trace + response (shown above the dock while a command runs) ──
  const processingContent = (
    <AnimatePresence>
      {isBusy && activeCmd && (
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

  const askChips = methodologyChips.length > 0
    ? methodologyChips.map((mc) => ({ key: mc.command.keyword, label: mc.label, run: () => runCommand(mc.command) }))
    : visibleChips.map((chip) => ({ key: chip.command, label: chip.label, run: () => onChipClick(chip.command) }));

  const DOCK_LABEL = "font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45 mb-2";

  return (
    <>
      {/* ── Emoji born at bottom centre after the intro replay, then travels to the dock ── */}
      <AnimatePresence>
        {emojiPhase === "bottom" && (
          <motion.div
            key="emoji-bottom"
            className="fixed z-[45] bottom-8 left-1/2"
            initial={{ opacity: 0, scale: 0, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%" }}
            exit={{
              opacity: 0,
              scale: 0.6,
              x: "calc(50vw - 90px)",
              y: 12,
              transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
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

      {/* ── The dock: bottom-right, one home for the agent on every section ── */}
      {emojiPhase !== "bottom" && (
        <div className="fixed z-[100] bottom-4 right-4 md:bottom-5 md:right-5 flex flex-col items-end gap-3 w-[min(380px,calc(100vw-2rem))] pointer-events-none">
          {/* Collapsed: first-visit question sits above the dock */}
          <AnimatePresence>
            {!isOpen && showIntentPrompt && buttonReady && (
              <motion.div
                key="intent"
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto w-full rounded-2xl border border-card-border bg-card/95 backdrop-blur-xl p-4"
                style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.35)" }}
              >
                <VisitorIntentPrompt onDone={closeIntentPrompt} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded panel */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="panel"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "bottom right" }}
                className="pointer-events-auto relative w-full"
              >
                <div
                  id="agent-focus-mount"
                  className={`absolute bottom-full right-0 mb-3 w-full max-h-[300px] md:max-h-[400px] overflow-y-auto ${
                    chatOpen ? "rounded-2xl border border-card-border bg-card/95 backdrop-blur-xl p-2 shadow-[0_16px_48px_rgba(0,0,0,0.4)]" : ""
                  }`}
                >
                  {processingContent}
                </div>

                <div
                  className="card-gradient-border rounded-2xl bg-card/95 backdrop-blur-xl border border-card-border overflow-hidden"
                  style={{ boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 18px ${personality.glowColor.replace("0.4", "0.12")}` }}
                >
                  {/* Header: who is talking, where you are */}
                  <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                    <button
                      type="button"
                      onClick={() => setMoodPickerOpen((open) => !open)}
                      aria-label="Choose agent mood"
                      aria-expanded={moodPickerOpen}
                      className="relative w-11 h-11 rounded-full border border-accent-status/30 bg-accent-status/[0.07] flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform"
                    >
                      <AgentEmoji size={30} mood={sectionMood} />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-status border-[1.5px] border-card" style={{ animation: "green-pulse 2s infinite" }} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={dock.title}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-sm font-semibold text-foreground truncate">{dock.title}</p>
                          <p className="text-xs text-foreground/60 leading-snug">{dock.info}</p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <button
                      type="button"
                      onClick={closePanel}
                      aria-label="Close agent"
                      className="self-start p-1.5 -mr-1 rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
                    >
                      <X size={15} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Mood picker — same moods as before, now one tidy row */}
                  <AnimatePresence initial={false}>
                    {moodPickerOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2 px-4 pb-3">
                          {MOOD_POSITIONS.map((mp) => (
                            <button
                              key={mp.mood}
                              type="button"
                              title={mp.label}
                              aria-label={mp.label}
                              onClick={() => {
                                window.dispatchEvent(
                                  new CustomEvent("emoji-mood", {
                                    detail: mp.mood === "dancing" ? "dancing" : { mood: mp.mood, persistent: true },
                                  }),
                                );
                                setMoodPickerOpen(false);
                              }}
                              className="w-9 h-9 rounded-full border border-card-border bg-background/40 flex items-center justify-center cursor-pointer hover:border-accent-status/50 hover:scale-110 transition-all"
                            >
                              <AgentEmoji size={18} mood={mp.mood} />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Routes and questions for this part of the page */}
                  {!activeCmd && !chatOpen && (
                    <div className="px-4 pb-3 space-y-3.5 border-t border-card-border/60 pt-3.5">
                      <div>
                        <p className={DOCK_LABEL}>Go to</p>
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.div
                            key={dock.title}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-2 gap-1.5"
                          >
                            {dock.routes.map((route) => (
                              <button
                                key={route.label}
                                type="button"
                                onClick={() => followRoute(route)}
                                className="text-left px-3 py-2 rounded-lg border border-card-border bg-background/40 text-xs text-foreground/80 hover:border-accent/50 hover:text-foreground hover:bg-accent/[0.06] transition-colors cursor-pointer truncate"
                              >
                                {route.label}
                              </button>
                            ))}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      {askChips.length > 0 && (
                        <div>
                          <p className={DOCK_LABEL}>Ask me</p>
                          <div className="flex flex-wrap gap-1.5">
                            {askChips.map((chip) => (
                              <button
                                key={chip.key}
                                type="button"
                                onClick={chip.run}
                                className="px-2.5 py-1 rounded-full border border-card-border text-[11px] text-foreground/65 hover:text-accent hover:border-accent/40 transition-colors cursor-pointer"
                              >
                                {chip.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Input */}
                  <form onSubmit={onSubmit} data-agent-bar="fixed" className="border-t border-card-border/60">
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <button
                        type="button"
                        onClick={handleChatToggle}
                        aria-label={chatOpen ? "Close chat" : "Open chat"}
                        className="relative w-8 h-8 rounded-full border border-card-border flex items-center justify-center shrink-0 cursor-pointer text-foreground/60 hover:text-accent-status hover:border-accent-status/40 transition-colors"
                      >
                        <MessageSquare size={14} strokeWidth={1.75} />
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
                        placeholder={chatOpen ? "reply in chat..." : (viewingProject ? "ask about this project..." : inputConfig.placeholder)}
                        disabled={isBusy}
                        className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-foreground/35 text-foreground disabled:opacity-50"
                      />
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed dock — morphs with the section in view */}
          <AnimatePresence>
            {uiState === "button" && buttonReady && (
              <motion.button
                key="dock"
                type="button"
                layout
                data-agent-pill="fixed"
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], layout: { type: "spring", stiffness: 380, damping: 32 } }}
                onClick={() => {
                  setUiState("panel");
                  setTimeout(() => inputRef.current?.focus(), 150);
                }}
                aria-label={`Open agent. ${dock.title}`}
                className="pointer-events-auto flex items-center gap-2.5 card-gradient-border rounded-full bg-card/95 backdrop-blur-xl border border-card-border pl-1.5 pr-4 py-1.5 cursor-pointer hover:border-transparent transition-colors duration-300 max-w-full"
                style={{ boxShadow: `0 6px 24px rgba(0,0,0,0.35), 0 0 14px ${personality.glowColor.replace("0.4", "0.22")}` }}
              >
                <motion.span
                  key={activeSection}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="relative w-10 h-10 rounded-full border border-accent-status/30 bg-accent-status/[0.07] flex items-center justify-center shrink-0"
                >
                  <AgentEmoji size={26} mood={sectionMood} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-status border-[1.5px] border-card" style={{ animation: "green-pulse 2s infinite" }} />
                  {chatMsgCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] rounded-full bg-accent text-[8px] font-mono font-bold text-background flex items-center justify-center px-0.5">
                      {chatMsgCount}
                    </span>
                  )}
                </motion.span>
                <span className="min-w-0 text-left overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={dock.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="block"
                    >
                      <span className="block text-[13px] font-semibold text-foreground leading-tight truncate">{dock.title}</span>
                      <span className="block text-[11px] text-foreground/55 leading-tight truncate">
                        {dock.routes.length} routes · ask me anything
                      </span>
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
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
