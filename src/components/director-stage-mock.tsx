"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate, type Variants } from "framer-motion";
import {
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronUp,
  FileText,
  GitBranch,
  GitCommit,
  Mail,
  Network,
  Radio,
  Send,
  Zap,
} from "lucide-react";
import { AgentEmoji, type EmojiMood } from "@/components/agent-visuals";
import { ProjectMockup, type MockupKind } from "@/components/project-mockup";
import { TopBar as RealTopBar } from "@/components/top-bar";
import { AgentBar } from "@/components/agent-bar";
import { ProjectModal } from "@/components/project-modal";
import { CVDrawer, openCvDrawer } from "@/components/cv-drawer";
import { SkillsModal } from "@/components/skills-modal";
import { ChatWidget } from "@/components/chat-widget";
import { NeuralMap } from "@/components/neural-map";
import { projects, type ProjectData } from "@/data/projects";
import { getFeaturedArticles } from "@/data/writing";

type Room = "home" | "projects" | "experience" | "toolbelt" | "contact";
type FlagshipSlug = "openevent" | "codelens" | "gogaa-cli" | "rasad";
type GestureState = Record<FlagshipSlug, boolean>;

const ease = [0.22, 1, 0.36, 1] as const;

const roomOrder: Room[] = ["home", "projects", "experience", "toolbelt", "contact"];

const roomNav: { id: Room; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }[] = [
  { id: "home", label: "Home", icon: Bot },
  { id: "projects", label: "Projects", icon: BriefcaseBusiness },
  { id: "experience", label: "Experience", icon: GitCommit },
  { id: "toolbelt", label: "Skills CV Chat", icon: Network },
  { id: "contact", label: "Contact", icon: Send },
];

const flagshipConfig: Record<
  FlagshipSlug,
  {
    mockup: MockupKind;
    mood: EmojiMood;
    color: string;
    why: string;
    action: string;
  }
> = {
  openevent: {
    mockup: "openevent",
    mood: "proud",
    color: "from-rose-500/20 via-red-300/10 to-green-400/10",
    why: "It lets busy event teams move from messy inboxes to approved bookings without trusting AI blindly.",
    action: "I hold the approval stamp so people stay in control.",
  },
  codelens: {
    mockup: "codelens",
    mood: "curious",
    color: "from-amber-400/18 via-sky-300/10 to-green-400/10",
    why: "It catches the kind of bugs teams usually miss, quickly, and without sending code away.",
    action: "I sweep the review light across the pull request.",
  },
  "gogaa-cli": {
    mockup: "gogaa",
    mood: "surprised",
    color: "from-green-400/18 via-cyan-300/10 to-violet-400/10",
    why: "It keeps AI coding work moving even when one model or provider fails.",
    action: "I switch tracks until the work keeps flowing.",
  },
  rasad: {
    mockup: "rasad",
    mood: "default",
    color: "from-violet-400/20 via-fuchsia-300/10 to-green-400/10",
    why: "It turns AI coding sessions from a black box into something you can replay, inspect, and improve.",
    action: "I lift the glass so the hidden actions become visible.",
  },
};

const flagshipSlugs: FlagshipSlug[] = ["openevent", "codelens", "gogaa-cli", "rasad"];

const roles = [
  {
    hash: "f4a9c2d",
    branch: "HEAD -> present",
    company: "More Life Hospitality GmbH",
    title: "Lead AI Developer",
    period: "Sep 2025 - Present",
    body: "Own OpenEvent roadmap and delivery: pgvector, Stripe, AI workflows, human approval gates.",
  },
  {
    hash: "b1e7a3f",
    branch: "leadership",
    company: "Rouelite Techno Pvt. Ltd.",
    title: "Director of IT & R&D",
    period: "2022 - 2024",
    body: "Led 6 engineers, introduced AI into operations, and rebuilt CRM workflows from first principles.",
  },
  {
    hash: "a0d1e9c",
    branch: "origin/agency",
    company: "Wadware House",
    title: "Co-Founder & AI Engineer",
    period: "2023 - Present",
    body: "Client acquisition, project scoping, architecture, AI automation, delivery, support.",
  },
];

/* ─── SVG CHARACTER ─── consistent style across all rooms ─── */

const G = "rgba(74,222,128,";
const B = "rgba(16,17,22,";
const S = "rgba(173,172,166,";

/** The character SVG — same guy, one hand on wire, pointing forward. Used on Home wire. */
function CharacterSVG({ excited }: { excited?: boolean }): React.ReactElement {
  return (
    <svg width="90" height="100" viewBox="0 0 90 100" fill="none" aria-hidden="true">
      <path d="M38 18C34 10 38 2 42 0" stroke={`${G}0.7)`} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="42" cy="2" r="3" fill={`${G}0.9)`} />
      <circle cx="42" cy="28" r="14" fill={`${B}0.98)`} stroke={`${G}0.4)`} strokeWidth="1.5" />
      <circle cx="38" cy="26" r="2" fill={`${G}1)`} />
      <circle cx="46" cy="26" r="2" fill={`${G}1)`} />
      {excited ? (
        <ellipse cx="42" cy="34" rx="4" ry="3" fill={`${G}0.3)`} stroke={`${G}1)`} strokeWidth="1.5" />
      ) : (
        <path d="M38 34C40 36 46 36 48 34" stroke={`${G}1)`} strokeWidth="1.8" strokeLinecap="round" />
      )}
      <rect x="34" y="44" width="16" height="22" rx="8" fill={`${B}0.98)`} stroke={`${G}0.35)`} strokeWidth="1.5" transform="rotate(5 42 55)" />
      <motion.path d="M50 50C60 48 70 42 78 38" stroke={`${G}0.65)`} strokeWidth="3.5" strokeLinecap="round"
        animate={{ d: ["M50 50C60 48 70 42 78 38", "M50 50C60 46 72 40 80 36", "M50 50C60 48 70 42 78 38"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle cx="78" cy="38" r="2.5" fill={`${G}0.8)`}
        animate={{ cx: [78, 80, 78], cy: [38, 36, 38] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <path d="M38 65L30 80" stroke={`${S}0.65)`} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M44 65L52 78" stroke={`${S}0.65)`} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M27 80H35" stroke={`${S}0.6)`} strokeWidth="3" strokeLinecap="round" />
      <path d="M50 78H58" stroke={`${S}0.6)`} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ─── CURTAIN PULL ─── character hangs from wire, pulls next room down like a curtain ─── */

const PULL_THRESHOLD = 90;
const PULL_MAX = 350;
const WIRE_REST = 56;

function CurtainPullAgent({
  room,
  onNext,
  nextRoomContent,
}: {
  room: Room;
  onNext: () => void;
  nextRoomContent: React.ReactNode;
}): React.ReactElement {
  const roomIdx = roomOrder.indexOf(room);
  const isLast = roomIdx === roomOrder.length - 1;

  const [showHint, setShowHint] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [committed, setCommitted] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pullY = useMotionValue(0);

  // Wire stretches with pull
  const wireHeight = useTransform(pullY, [0, PULL_MAX], [WIRE_REST, WIRE_REST + PULL_MAX]);
  // Curtain slides down from top: starts at -100vh, moves to 0
  const curtainY = useTransform(pullY, [0, PULL_MAX], [-100, 0]);
  // Curtain opacity
  const curtainOpacity = useTransform(pullY, [0, 40, PULL_MAX], [0, 0.6, 1]);

  useEffect(() => {
    setShowHint(false);
    setCommitted(false);
    hintTimer.current = setTimeout(() => setShowHint(true), 4000);
    return () => clearTimeout(hintTimer.current);
  }, [room]);

  const handleDrag = useCallback(
    (_: unknown, info: { offset: { y: number } }) => {
      if (committed) return;
      setIsDragging(true);
      setShowHint(false);
      const clamped = Math.max(0, Math.min(PULL_MAX, info.offset.y));
      pullY.set(clamped);
    },
    [pullY, committed],
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
      if (committed) return;
      setIsDragging(false);
      const fast = Math.abs(info.velocity.y) > 400;
      const pastThreshold = info.offset.y > PULL_THRESHOLD;

      if ((pastThreshold || fast) && !isLast) {
        // Commit — animate curtain fully down then switch rooms
        setCommitted(true);
        animate(pullY, PULL_MAX, {
          type: "spring",
          stiffness: 200,
          damping: 28,
          onComplete: () => {
            onNext();
            pullY.set(0);
            setCommitted(false);
          },
        });
      } else {
        // Snap back
        animate(pullY, 0, { type: "spring", stiffness: 400, damping: 30 });
      }
    },
    [isLast, onNext, pullY, committed],
  );

  const curtainTranslateY = useTransform(curtainY, (v) => `${v}vh`);

  if (isLast) {
    return <div className="hidden" aria-hidden="true" />;
  }

  return (
    <>
      {/* ── Curtain: next room preview slides down from top ── */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-screen overflow-hidden"
        style={{
          y: curtainTranslateY,
          opacity: curtainOpacity,
        }}
        aria-hidden={!committed}
      >
        {/* Curtain visual — frosted glass + glow */}
        <div className="absolute inset-0 bg-background/[0.97] backdrop-blur-xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(74,222,128,0.14),transparent_50%)]" />
        {/* Bottom edge glow — the "fold" of the curtain */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-green-400/40 shadow-[0_0_30px_rgba(74,222,128,0.4)]" />
        {/* Next room content preview */}
        <div className="relative h-full overflow-hidden px-5 pt-16 md:px-8 md:pl-28 md:pt-20">
          {nextRoomContent}
        </div>
      </motion.div>

      {/* ── Wire + Character ── */}
      <div className="fixed top-0 right-[200px] z-[65]" style={{ width: 200 }}>
        {/* Wire line from top edge to character */}
        <motion.div
          className="absolute top-0 w-px"
          style={{ left: 45, height: wireHeight }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-green-400/60 via-green-400/40 to-green-400/25 shadow-[0_0_12px_rgba(74,222,128,0.3)]" />
          {/* Energy pulse flows down */}
          {!isDragging && !committed && (
            <motion.div
              className="absolute left-0 top-0 h-10 w-px bg-gradient-to-b from-transparent via-green-300 to-transparent"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }}
            />
          )}
          {/* Curtain attachment line — connects wire to curtain edge */}
          {(isDragging || committed) && (
            <div className="absolute bottom-0 left-[-20px] right-[-20px] h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
          )}
        </motion.div>

        {/* Draggable character */}
        <motion.div
          drag={committed ? false : "y"}
          dragConstraints={{ top: 0, bottom: PULL_MAX }}
          dragElastic={0.06}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="absolute cursor-grab active:cursor-grabbing"
          style={{ left: 0, top: WIRE_REST - 10, y: pullY }}
          role="button"
          tabIndex={0}
          aria-label={`Pull down to go to ${roomOrder[roomIdx + 1]}`}
        >
          {/* Character with idle sway */}
          <motion.div
            animate={isDragging || committed ? {} : { y: [-1, 2, -1], rotate: [-1, 1, -1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <CharacterSVG excited={isDragging || committed} />
          </motion.div>

          {/* Hint bubble */}
          <AnimatePresence>
            {showHint && !isDragging && !committed && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-wide text-accent"
              >
                {/* Thought bubble dots */}
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-[2px]">
                  <span className="h-1 w-1 rounded-full bg-accent/40" />
                  <span className="h-[3px] w-[3px] rounded-full bg-accent/30" />
                </span>
                <span className="rounded-full border border-accent/20 bg-card/90 px-2.5 py-1 shadow-[0_0_12px_rgba(74,222,128,0.06)] backdrop-blur-xl">
                  pull me ↓
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

/* ─── FLOATING AGENT ─── persistent on every room, opens chat ─── */

const roomMessages: Record<Room, string> = {
  home: "ask me anything about Ahtesham",
  projects: "want details on any project?",
  experience: "curious about a role? ask me",
  toolbelt: "need my CV? just ask",
  contact: "ready to connect? let's talk",
};

function FloatingAgent({ room }: { room: Room }): React.ReactElement {
  const [hovered, setHovered] = useState(false);
  const msg = roomMessages[room];

  // Don't show on home — hero already has the agent dock
  if (room === "home") return <div className="hidden" />;

  return (
    <div className="fixed bottom-6 right-6 z-[55] flex items-end gap-2">
      {/* Speech bubble */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-2 max-w-[200px] rounded-xl border border-green-400/20 bg-card/95 px-3 py-2 font-mono text-[11px] leading-relaxed text-green-300 shadow-[0_0_24px_rgba(74,222,128,0.1)] backdrop-blur-xl"
          >
            {msg}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Agent button */}
      <motion.button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("open-chat-widget"))}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative grid h-12 w-12 place-items-center rounded-full border border-green-400/30 bg-card/90 shadow-[0_0_30px_rgba(74,222,128,0.15)] backdrop-blur-xl transition hover:border-green-400/50"
        aria-label="Open agent chat"
      >
        {/* Breathing pulse */}
        <motion.span
          className="absolute inset-[-4px] rounded-full border border-green-400/10"
          animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        {/* Online dot */}
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-background bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
        <AgentEmoji size={28} mood="default" />
      </motion.button>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */

export function DirectorStageMock(): React.ReactElement {
  const [room, setRoom] = useState<Room>("home");
  const [activeFlagship, setActiveFlagship] = useState(0);
  const [gestureDone, setGestureDone] = useState<GestureState>({
    openevent: false,
    codelens: false,
    "gogaa-cli": false,
    rasad: false,
  });
  const [otherIndex, setOtherIndex] = useState(0);
  const [modalProject, setModalProject] = useState<ProjectData | null>(null);
  const [transitionDir, setTransitionDir] = useState<1 | -1>(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("scene") ?? params.get("room");
    if (roomNav.some((item) => item.id === next)) setRoom(next as Room);
  }, []);

  const flagships = useMemo(
    () => flagshipSlugs.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean) as ProjectData[],
    [],
  );
  const otherProjects = useMemo(
    () => projects.filter((project) => !flagshipSlugs.includes(project.slug as FlagshipSlug)),
    [],
  );
  const featuredArticles = useMemo(() => getFeaturedArticles(), []);

  const activeProject = flagships[activeFlagship] ?? flagships[0];
  const activeSlug = activeProject.slug as FlagshipSlug;

  const goRoom = useCallback((next: Room): void => {
    const currentIdx = roomOrder.indexOf(room);
    const nextIdx = roomOrder.indexOf(next);
    setTransitionDir(nextIdx > currentIdx ? 1 : -1);
    setRoom(next);
  }, [room]);

  const goNext = useCallback((): void => {
    const idx = roomOrder.indexOf(room);
    if (idx < roomOrder.length - 1) {
      setTransitionDir(1);
      setRoom(roomOrder[idx + 1]);
    }
  }, [room]);

  const solve = (slug: FlagshipSlug): void => setGestureDone((prev) => ({ ...prev, [slug]: true }));
  const allProjects = useMemo(() => [...flagships, ...otherProjects], [flagships, otherProjects]);
  const navigateModal = (dir: 1 | -1): void => {
    setModalProject((current) => {
      if (!current) return current;
      const index = allProjects.findIndex((project) => project.slug === current.slug);
      if (index < 0) return current;
      return allProjects[(index + dir + allProjects.length) % allProjects.length];
    });
  };

  // Room transition variants — slide from direction of navigation
  const roomVariants = {
    initial: { opacity: 0, y: transitionDir * 60 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: transitionDir * -60 },
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-background text-foreground">
      <Atmosphere room={room} slug={activeSlug} />
      <RealTopBar />
      <SignalRail room={room} setRoom={goRoom} />
      <CurtainPullAgent room={room} onNext={goNext} nextRoomContent={<NextRoomPreview room={room} />} />

      <AnimatePresence mode="wait" custom={transitionDir}>
        {room === "home" && (
          <RoomShell key="home" variants={roomVariants}>
            <HomeRoom />
          </RoomShell>
        )}
        {room === "projects" && (
          <RoomShell key="projects" variants={roomVariants}>
            <ProjectsRoom
              flagships={flagships}
              activeIndex={activeFlagship}
              setActiveIndex={setActiveFlagship}
              solved={gestureDone}
              solve={solve}
              otherProjects={otherProjects}
              otherIndex={otherIndex}
              setOtherIndex={setOtherIndex}
              openProject={setModalProject}
            />
          </RoomShell>
        )}
        {room === "experience" && (
          <RoomShell key="experience" variants={roomVariants}>
            <ExperienceRoom articles={featuredArticles} />
          </RoomShell>
        )}
        {room === "toolbelt" && (
          <RoomShell key="toolbelt" variants={roomVariants}>
            <ToolbeltRoom />
          </RoomShell>
        )}
        {room === "contact" && (
          <RoomShell key="contact" variants={roomVariants}>
            <ContactRoom onGoTop={() => goRoom("home")} />
          </RoomShell>
        )}
      </AnimatePresence>

      <FloatingAgent room={room} />
      <ChatWidget />
      <CVDrawer />
      <SkillsModal />
      <ProjectModal project={modalProject} onClose={() => setModalProject(null)} onNavigate={navigateModal} />
      <div className="grain-overlay" aria-hidden="true" />
    </main>
  );
}

/* ─── SHARED COMPONENTS ─── */

function Atmosphere({ room, slug }: { room: Room; slug: FlagshipSlug }): React.ReactElement {
  const color = room === "projects" ? flagshipConfig[slug].color : "from-accent/[0.08] via-transparent to-green-400/[0.045]";
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <motion.div key={`${room}-${slug}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`absolute inset-0 bg-gradient-to-br ${color}`} />
      <motion.div
        className="absolute left-1/2 top-[-20rem] h-[56rem] w-[56rem] -translate-x-1/2 rounded-full bg-accent/[0.055] blur-3xl"
        animate={{ x: [-30, 30, -30], scale: [0.94, 1.05, 0.94] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function SignalRail({ room, setRoom }: { room: Room; setRoom: (room: Room) => void }): React.ReactElement {
  const nodes = roomNav.map((item, index) => ({
    ...item,
    x: index % 2 === 0 ? 2 : 16,
    y: index * 70,
  }));
  const activeIndex = nodes.findIndex((item) => item.id === room);

  return (
    <nav
      aria-label="Pipeline navigation"
      className="absolute left-3 top-1/2 z-50 hidden -translate-y-1/2 font-mono md:block"
      style={{ width: 56, height: 320 }}
    >
      <svg className="absolute inset-0 pointer-events-none overflow-visible" viewBox="0 0 56 320" fill="none">
        {nodes.slice(0, -1).map((item, index) => {
          const next = nodes[index + 1];
          const path = `M ${item.x + 19} ${item.y + 19} Q 32 ${(item.y + next.y) / 2 + 19} ${next.x + 19} ${next.y + 19}`;
          const done = index < activeIndex;
          return (
            <path
              key={item.id}
              d={path}
              stroke={done ? "rgba(74,222,128,0.55)" : "var(--wire-stroke)"}
              strokeWidth={done ? 1.5 : 1}
              strokeDasharray={done ? undefined : "6 4"}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      {nodes.map((item, index) => {
        const Icon = item.icon;
        const active = room === item.id;
        const done = index < activeIndex;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setRoom(item.id)}
            aria-label={item.label}
            className="group absolute flex items-center justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              left: item.x,
              top: item.y,
              width: active ? 46 : 38,
              height: active ? 46 : 38,
              marginLeft: active ? -4 : 0,
              marginTop: active ? -4 : 0,
              borderRadius: 14,
              background: active ? "var(--accent-glow)" : "transparent",
              boxShadow: active ? "0 4px 24px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
              border: active ? "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" : "1px solid transparent",
            }}
          >
            {active && <span className="absolute inset-0 rounded-[14px] border border-accent/30 animate-[pulse-expand_2.5s_ease-out_infinite]" />}
            <Icon
              size={active ? 20 : 15}
              strokeWidth={active ? 2 : 1.5}
              className={active ? "text-accent drop-shadow-[0_0_6px_rgba(160,120,104,0.5)]" : done ? "text-accent-status/70" : "text-muted/25 group-hover:text-muted/50"}
            />
            <span className="absolute left-full ml-3 rounded-lg border border-card-border/50 bg-card/90 px-2.5 py-1 text-[10px] text-foreground/80 opacity-0 shadow-lg backdrop-blur-xl transition-all duration-200 group-hover:opacity-100">
              {item.label}
            </span>
          </button>
        );
      })}
      <style>{`
        @keyframes pulse-expand {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </nav>
  );
}

function RoomShell({
  children,
  className = "",
  variants,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}): React.ReactElement {
  return (
    <motion.section
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.45, ease }}
      className={`absolute inset-0 z-10 overflow-y-auto overflow-x-hidden px-5 pb-24 pt-16 md:overflow-hidden md:px-8 md:pb-6 md:pl-28 md:pt-20 ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ─── ROOMS ─── */

/** Preview content shown inside the curtain as it's being pulled */
function NextRoomPreview({ room }: { room: Room }): React.ReactElement {
  const nextIdx = roomOrder.indexOf(room) + 1;
  const nextRoom = roomOrder[nextIdx];
  const labels: Record<Room, { tag: string; title: string; desc: string }> = {
    home: { tag: "", title: "", desc: "" },
    projects: { tag: "what I've shipped", title: "Projects", desc: "Four flagship builds with clean proof and full case files." },
    experience: { tag: "work history + thinking", title: "Experience + Writing", desc: "Career proof and written thinking, side by side." },
    toolbelt: { tag: "choose what to inspect", title: "Skills + CV + Chat", desc: "Skills map, downloadable CV, and a live agent." },
    contact: { tag: "deploy pipeline", title: "Deploy me.", desc: "One engineer, full ownership, zero handoffs." },
  };
  if (!nextRoom) return <></>;
  const { tag, title, desc } = labels[nextRoom];
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <p className="font-mono text-caption uppercase tracking-[0.28em] text-accent">{tag}</p>
      <h2 className="mt-4 text-5xl font-bold md:text-7xl">{title}</h2>
      <p className="mx-auto mt-5 max-w-2xl text-muted md:text-lg">{desc}</p>
    </div>
  );
}

function HomeRoom(): React.ReactElement {
  return (
    <div className="relative h-full">
      <div className="mx-auto flex h-full max-w-5xl flex-col items-center justify-center text-center">
        <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
          I&apos;m <span className="text-accent">Ahtesham.</span> I ship <span className="text-gradient">AI</span>
          <br />
          <span className="text-gradient">products</span>{" "}that don&apos;t
          <br />
          break.
        </h1>
        <p className="mx-auto mt-7 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
          OpenEvent runs with 100+ clients. CodeLens reviews PRs in under a second. Gogaa keeps coding work moving across 11 providers. I design the architecture, build the product, and own delivery.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-4 font-mono text-[11px] tracking-wide text-muted/60 md:gap-6 md:text-xs">
          <span><strong className="text-foreground">50+</strong> systems shipped</span>
          <span className="hidden text-muted/25 sm:inline">/</span>
          <span><strong className="text-foreground">10</strong> showcased</span>
          <span className="hidden text-muted/25 sm:inline">/</span>
          <span><strong className="text-foreground">5+</strong> years building</span>
        </div>
        <HeroAgentDock />
      </div>
    </div>
  );
}

function HeroAgentDock(): React.ReactElement {
  const moods: EmojiMood[] = ["default", "curious", "proud", "dancing"];
  const [mood, setMood] = useState<EmojiMood>("default");

  return (
    <div className="mt-6 flex flex-col items-center">
      <div className="rounded-full border border-green-400/25 bg-green-400/10 px-4 py-1.5 font-mono text-caption text-green-300">
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-green-300" />
        agent online
      </div>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("open-chat-widget"))}
        className="group relative mt-4 grid h-40 w-40 place-items-center rounded-full border border-green-400/30 bg-card/80 shadow-[0_0_70px_rgba(74,222,128,0.22)] backdrop-blur-xl md:h-48 md:w-48"
        aria-label="Open agent chat"
      >
        <motion.span
          aria-hidden
          className="absolute inset-[-14px] rounded-full border border-green-400/10"
          animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.25, 0.65, 0.25] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <AgentEmoji size={104} mood={mood} />
      </button>
      <div className="mt-2 flex items-center gap-2">
        {moods.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMood(item)}
            className={`grid h-7 w-7 place-items-center rounded-full border transition ${mood === item ? "border-green-400/40 bg-green-400/10" : "border-card-border bg-background/40 opacity-65 hover:opacity-100"}`}
            aria-label={`Set agent mood ${item}`}
          >
            <AgentEmoji size={18} mood={item} />
          </button>
        ))}
      </div>
      <div className="mt-3 h-11 w-px bg-gradient-to-b from-green-400/55 to-green-400/10" />
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("open-chat-widget"))}
        className="rounded-[1.35rem] border border-card-border bg-card/85 px-10 py-4 font-mono text-small text-muted shadow-[0_0_36px_rgba(74,222,128,0.12)] backdrop-blur-xl"
      >
        open the agent
      </button>
    </div>
  );
}

function ProjectsRoom({
  flagships,
  activeIndex,
  setActiveIndex,
  solved,
  solve,
  otherProjects,
  otherIndex,
  setOtherIndex,
  openProject,
}: {
  flagships: ProjectData[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  solved: GestureState;
  solve: (slug: FlagshipSlug) => void;
  otherProjects: ProjectData[];
  otherIndex: number;
  setOtherIndex: (index: number) => void;
  openProject: (project: ProjectData) => void;
}): React.ReactElement {
  const project = flagships[activeIndex] ?? flagships[0];
  const slug = project.slug as FlagshipSlug;
  const config = flagshipConfig[slug];
  const revealed = solved[slug];
  const other = otherProjects[otherIndex] ?? otherProjects[0];
  const metricList = project.measuredImpact?.highlights ?? project.results.slice(0, 3).map((result) => ({ n: result.split(" ")[0], l: result.split(" ").slice(1).join(" ") }));
  const chooseFlagship = (index: number): void => {
    const next = Math.max(0, Math.min(flagships.length - 1, index));
    setActiveIndex(next);
    const nextProject = flagships[next];
    if (nextProject) solve(nextProject.slug as FlagshipSlug);
  };
  const slideToNextStop = (offsetX: number): void => {
    if (offsetX > 22) chooseFlagship(activeIndex + 1);
    if (offsetX < -22) chooseFlagship(activeIndex - 1);
  };
  const dealOtherProject = (): void => {
    setOtherIndex((otherIndex + 1) % otherProjects.length);
  };

  return (
    <div className="grid h-full min-h-full grid-rows-[auto_auto] gap-3 pb-10 md:min-h-0 md:grid-rows-[auto_minmax(0,1fr)] md:pb-0">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-caption uppercase tracking-[0.28em] text-accent">project reel</p>
          <h2 className="mt-1 text-2xl font-bold md:text-3xl">Projects</h2>
        </div>
      </div>

      <div className="grid gap-4 md:min-h-0 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="grid overflow-hidden rounded-2xl border border-card-border bg-card/35 backdrop-blur-md md:min-h-0 md:grid-rows-[112px_minmax(0,1fr)]">
          <div className="border-b border-card-border bg-background/35 px-4 py-3 md:px-7">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-caption uppercase tracking-[0.24em] text-muted/55">4 flagship stops</p>
                <p className="mt-1 max-w-[280px] text-small text-muted md:max-w-none">Slide the agent across the rail. Each stop changes the case.</p>
              </div>
              <p className="font-mono text-small text-accent">{activeIndex + 1} / {flagships.length}</p>
            </div>

            <div className="relative mx-auto mt-8 h-1 w-[calc(100%-8rem)] max-w-[520px] rounded-full bg-muted/15 md:w-full">
              <motion.div
                className="absolute -top-9 z-10 flex flex-col items-center"
                animate={{ left: `${(activeIndex / Math.max(1, flagships.length - 1)) * 100}%` }}
                transition={{ duration: 0.35, ease }}
                style={{ x: "-50%" }}
              >
                <motion.button
                  type="button"
                  drag="x"
                  dragConstraints={{ left: -48, right: 48 }}
                  dragElastic={0.18}
                  onDragEnd={(_, info) => slideToNextStop(info.offset.x)}
                  onClick={() => chooseFlagship((activeIndex + 1) % flagships.length)}
                  className="grid h-14 w-14 place-items-center rounded-full border border-green-400/35 bg-background/95 shadow-[0_0_38px_rgba(74,222,128,0.2)]"
                  aria-label="Slide agent to the right to choose project"
                >
                  <AgentEmoji size={38} mood={config.mood} />
                </motion.button>
              </motion.div>
              {flagships.map((item, index) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => chooseFlagship(index)}
                  className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition ${
                    index === activeIndex ? "bg-accent shadow-[0_0_18px_rgba(74,222,128,0.7)]" : solved[item.slug as FlagshipSlug] ? "bg-green-300/70" : "bg-muted/30"
                  }`}
                  style={{ left: `${(index / Math.max(1, flagships.length - 1)) * 100}%` }}
                  aria-label={`Reveal ${item.title}`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.32, ease }}
              className="grid min-h-0 gap-5 p-5 md:p-6 lg:grid-cols-[minmax(0,0.86fr)_minmax(440px,1.14fr)]"
            >
              <div className="flex min-h-0 flex-col justify-center">
                <p className="font-mono text-caption uppercase tracking-[0.24em] text-accent">{project.type}</p>
                <h3 className="mt-3 text-4xl font-bold leading-tight md:text-6xl">{project.title}</h3>
                <p className="mt-4 max-w-[300px] text-base leading-relaxed text-muted md:max-w-xl md:text-lg">{project.oneLiner ?? project.cardSummary ?? project.impact}</p>
                <p className="mt-3 max-w-[300px] text-small leading-relaxed text-muted/75 md:max-w-xl">{config.why}</p>

                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3 md:gap-3">
                  {metricList.slice(0, 3).map((metric) => (
                    <div key={`${metric.n}-${metric.l}`} className="min-h-[86px] rounded-xl border border-card-border bg-background/40 p-3 md:min-h-[92px] md:p-4">
                      <p className="text-xl font-bold text-foreground md:text-2xl">{metric.n}</p>
                      <p className="mt-1 font-mono text-[10px] leading-tight text-muted/55 md:text-caption">{metric.l}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => openProject(project)}
                    className="rounded-xl border border-accent/25 bg-accent/10 px-4 py-3 font-mono text-small text-accent transition hover:border-accent/45"
                  >
                    open full case file
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      solve(slug);
                      openProject(project);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-card-border bg-card/35 px-4 py-3 font-mono text-small text-muted transition hover:text-foreground"
                  >
                    <AgentEmoji size={24} mood={config.mood} />
                    let agent show details
                  </button>
                </div>
              </div>

              <div className="flex min-h-0 flex-col gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-green-400/20 bg-green-400/[0.045] px-4 py-3">
                  <AgentEmoji size={34} mood={config.mood} />
                  <p className="text-small leading-relaxed text-muted">{config.action}</p>
                </div>
                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-2xl border border-card-border bg-background/30 md:min-h-0">
                  <ProjectMockup kind={config.mockup} className="absolute inset-4" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <aside className="grid gap-4 md:min-h-0">
          <div className="flex min-h-0 flex-col rounded-2xl border border-card-border bg-background/50 p-4 backdrop-blur-md">
            <p className="font-mono text-caption uppercase tracking-[0.24em] text-muted/55">side reel · 5 projects</p>
            <motion.button
              type="button"
              drag="x"
              dragConstraints={{ left: -48, right: 48 }}
              dragElastic={0.16}
              onClick={dealOtherProject}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 18) dealOtherProject();
              }}
              className="mt-4 flex items-center gap-3 rounded-xl border border-green-400/25 bg-green-400/10 p-3 text-left"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-green-400/25 bg-background/70">
                <AgentEmoji size={32} mood="curious" />
              </span>
              <span>
                <span className="block font-mono text-small text-green-300">deal me another</span>
                <span className="text-caption text-muted">Tap or drag to flip through the smaller projects.</span>
              </span>
            </motion.button>

            <AnimatePresence mode="wait">
              <motion.div
                key={other.slug}
                initial={{ opacity: 0, rotate: 2, y: 16 }}
                animate={{ opacity: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, rotate: -2, y: -16 }}
                transition={{ duration: 0.28, ease }}
                className="mt-4 flex min-h-[430px] flex-col rounded-xl border border-card-border bg-card/45 p-5 md:min-h-0 md:flex-1"
              >
                <p className="font-mono text-caption text-accent">{other.type}</p>
                <h3 className="mt-2 text-2xl font-bold leading-tight">{other.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted">{other.cardSummary ?? other.impact}</p>
                <p className="mt-5 rounded-xl border border-card-border bg-background/35 px-4 py-3 text-small leading-relaxed text-muted/75">
                  {other.results[0]}
                </p>
                <button
                  type="button"
                  onClick={() => openProject(other)}
                  className="mt-auto w-full rounded-lg border border-accent/25 bg-accent/10 px-3 py-3 font-mono text-caption text-accent"
                >
                  open full case file
                </button>
              </motion.div>
            </AnimatePresence>
            <div className="mt-4 grid grid-cols-5 gap-1.5">
              {otherProjects.map((item, index) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => setOtherIndex(index)}
                  className={`h-2 rounded-full ${index === otherIndex ? "bg-accent" : "bg-muted/20"}`}
                  aria-label={item.title}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ExperienceRoom({
  articles,
}: {
  articles: ReturnType<typeof getFeaturedArticles>;
}): React.ReactElement {
  // Interleave career and writing into a unified timeline
  type TimelineItem =
    | { kind: "career"; role: (typeof roles)[number] }
    | { kind: "writing"; article: ReturnType<typeof getFeaturedArticles>[number] };

  const timeline: TimelineItem[] = [
    { kind: "career", role: roles[0] },
    { kind: "writing", article: articles[0] },
    { kind: "career", role: roles[1] },
    { kind: "writing", article: articles[1] },
    { kind: "career", role: roles[2] },
    { kind: "writing", article: articles[2] },
  ].filter((item) => (item.kind === "writing" ? item.article : true)) as TimelineItem[];

  return (
    <div className="grid h-full min-h-full gap-2 md:min-h-0 md:grid-rows-[auto_minmax(0,1fr)]">
      <div className="flex items-center gap-4">
        <div>
          <p className="font-mono text-caption uppercase tracking-[0.28em] text-accent">git log --graph --all</p>
          <h2 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">Experience</h2>
        </div>
      </div>

      <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-card-border bg-card/35 backdrop-blur-md">
        {/* Two-column git graph */}
        <div className="grid flex-1 min-h-0 md:grid-cols-2">
          {/* Left branch — career */}
          <div className="relative flex flex-col border-r border-card-border/50 p-4 md:p-5">
            {/* Branch line */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-green-400/20" />

            <p className="font-mono text-caption text-green-400/60 mb-3">
              <GitBranch size={10} className="inline mr-1" />
              branch: career
            </p>
            <div className="flex flex-1 flex-col justify-between gap-3">
              {roles.map((role, index) => (
                <motion.div
                  key={role.hash}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3, ease }}
                  className="relative flex-1 rounded-xl border border-card-border bg-background/40 p-4"
                >
                  {/* Commit dot on divider */}
                  <div className="absolute -right-[7px] top-4 h-[9px] w-[9px] rounded-full border-[1.5px] border-green-400 bg-background shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                    <span className="rounded bg-yellow-400/10 px-1 py-0.5 text-yellow-300/80">{role.hash}</span>
                    <span className="rounded bg-green-400/10 px-1 py-0.5 text-green-300">{role.branch}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold">{role.title}</h3>
                  <p className="text-caption text-muted/50">{role.company} · {role.period}</p>
                  <p className="mt-1.5 text-small leading-relaxed text-muted">{role.body}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right branch — writing */}
          <div className="relative flex flex-col p-4 md:p-5">
            {/* Branch line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-amber-400/20" />

            <p className="font-mono text-caption text-amber-400/60 mb-3">
              <GitBranch size={10} className="inline mr-1" />
              branch: writing
            </p>
            <div className="flex flex-1 flex-col justify-between gap-3">
              {articles.slice(0, 3).map((article, index) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.15, duration: 0.3, ease }}
                  className="relative flex-1 rounded-xl border border-card-border bg-background/40 p-4"
                >
                  {/* Commit dot on divider */}
                  <div className="absolute -left-[7px] top-4 h-[9px] w-[9px] rounded-full border-[1.5px] border-amber-400 bg-background shadow-[0_0_6px_rgba(200,160,80,0.4)]" />
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                    <span className="text-amber-300/70">{article.readTime}</span>
                    <span className="text-muted/35">{article.date}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold">{article.title}</h3>
                  <p className="mt-1.5 text-small leading-relaxed text-muted line-clamp-3">{article.summary}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Merge commit bar at bottom */}
        <div className="border-t border-card-border bg-background/30 px-5 py-3 font-mono text-caption text-muted/40">
          <span className="text-green-400/60">●</span>
          <span className="mx-1">──</span>
          <span className="text-amber-400/60">●</span>
          <span className="mx-2">merge: all branches converge here</span>
          <span className="ml-auto text-muted/25">HEAD</span>
        </div>
      </div>
    </div>
  );
}

function ToolbeltRoom(): React.ReactElement {
  return (
    <div className="grid h-full min-h-full gap-2 md:min-h-0 md:grid-rows-[auto_minmax(0,1fr)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-caption uppercase tracking-[0.28em] text-accent">neural map</p>
          <h2 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">Skills + CV</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("show-skills-modal"))}
            className="flex items-center gap-2 rounded-xl border border-card-border bg-card/45 px-4 py-2.5 font-mono text-caption text-muted transition hover:text-foreground"
          >
            <Network size={13} />
            expand
          </button>
          <button
            type="button"
            onClick={() => openCvDrawer()}
            data-cv-open
            className="flex items-center gap-2 rounded-xl border border-accent/25 bg-accent/10 px-4 py-2.5 font-mono text-caption text-accent transition hover:border-accent/45"
          >
            <FileText size={13} />
            open CV
          </button>
        </div>
      </div>

      <div className="relative min-h-0 overflow-hidden rounded-2xl border border-card-border bg-card/35 backdrop-blur-md">
        <NeuralMap />
      </div>
    </div>
  );
}

function ContactRoom({ onGoTop }: { onGoTop: () => void }): React.ReactElement {
  const [launched, setLaunched] = useState(false);
  const steps = launched ? ["reviewed", "vetted", "matched", "launched"] : ["reviewed", "vetted", "matched", "deploy"];

  return (
    <div className="grid h-full min-h-full place-items-center">
      <div className="w-full max-w-5xl text-center">
        <button
          type="button"
          onClick={() => setLaunched(true)}
          className="mx-auto grid place-items-center text-center"
          aria-label="Launch contact options"
        >
          <motion.span
            animate={launched ? { y: [-8, -28, -8], scale: [1, 1.12, 1] } : { y: [-5, 5, -5] }}
            transition={{ duration: launched ? 1.1 : 2.6, repeat: launched ? 2 : Infinity, ease: "easeInOut" }}
            className="grid h-28 w-28 place-items-center rounded-full border border-green-400/25 bg-green-400/[0.045] shadow-[0_0_60px_rgba(74,222,128,0.16)]"
          >
            <AgentEmoji size={78} mood={launched ? "waving" : "default"} />
          </motion.span>
          <span className="mt-3 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 font-mono text-caption text-accent">
            {launched ? "launched" : "press me"}
          </span>
        </button>
        <p className="mt-5 font-mono text-caption uppercase tracking-[0.24em] text-green-300">deploy pipeline</p>
        <h2 className="mt-5 text-5xl font-bold md:text-7xl">Deploy me.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">one engineer, full ownership, zero handoffs</p>
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-card-border bg-card/45 p-5 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-3 font-mono text-caption md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className={`rounded-xl border p-4 ${index < 3 || launched ? "border-green-400/25 bg-green-400/10 text-green-300" : "border-accent/30 bg-accent/10 text-accent"}`}>
                {index < 3 || launched ? <Check className="mx-auto mb-2" size={16} /> : <Zap className="mx-auto mb-2" size={16} />}
                {step}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {["Email", "Schedule", "GitHub", "Resume"].map((item) => (
              <button key={item} type="button" className="inline-flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/10 px-5 py-3 font-mono text-small text-accent">
                {item === "Email" ? <Mail size={15} /> : <Radio size={15} />}
                {item}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onGoTop}
          className="mx-auto mt-8 flex items-center gap-2 rounded-full border border-card-border bg-card/45 px-5 py-3 font-mono text-caption text-muted transition hover:text-foreground"
        >
          <ChevronUp size={14} />
          back to top
        </button>
      </div>
    </div>
  );
}
