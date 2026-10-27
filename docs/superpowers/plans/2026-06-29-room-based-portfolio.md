# Room-Based Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the scroll-based portfolio layout with a room-based, curtain-pull navigation system where a hanging SVG character lets visitors pull down to reveal the next section, while preserving all existing features (boot sequence, agent bar, chat widget, project modals, CV drawer, skills modal).

**Architecture:** The current `page.tsx` renders sections vertically with scroll. The new design renders one "room" at a time inside a fixed viewport. A global `CurtainPullAgent` component provides the navigation — dragging a character down pulls the next room into view like a curtain. All existing overlay components (AgentBar, ChatWidget, CVDrawer, SkillsModal, ProjectModal) remain mounted globally. The existing `ConfigHero` is replaced with a new `HomeRoom` that preserves the streaming text, particle reveals, and agent portal mount.

**Tech Stack:** Next.js 16, React 18, TypeScript, Framer Motion, Tailwind CSS, Lucide icons

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| **Modify** | `src/app/page.tsx` | Replace scroll layout with room-based `PortfolioStage` |
| **Create** | `src/components/portfolio-stage.tsx` | Main orchestrator — room state, transitions, mounts overlays |
| **Create** | `src/components/rooms/home-room.tsx` | Hero content with streaming text + agent portal mount |
| **Create** | `src/components/rooms/projects-room.tsx` | Flagship rail + side reel (from mockup) |
| **Create** | `src/components/rooms/experience-room.tsx` | Git-graph dual-branch layout |
| **Create** | `src/components/rooms/skills-room.tsx` | NeuralMap embed + CV button |
| **Create** | `src/components/rooms/contact-room.tsx` | Deploy pipeline + back-to-top |
| **Create** | `src/components/curtain-pull-agent.tsx` | SVG character + wire + curtain pull navigation |
| **Create** | `src/components/floating-agent.tsx` | Persistent small agent emoji per room |
| **Create** | `src/components/room-shell.tsx` | Shared room wrapper with transition variants |
| **Create** | `src/components/signal-rail.tsx` | Left sidebar pipeline nav (escape hatch) |
| **Create** | `src/components/atmosphere.tsx` | Background gradients per room |
| **Keep** | `src/components/terminal-boot.tsx` | Boot sequence (unchanged) |
| **Keep** | `src/components/top-bar.tsx` | Top bar (unchanged) |
| **Keep** | `src/components/agent-bar.tsx` | Agent bar with hero portal (unchanged) |
| **Keep** | `src/components/chat-widget.tsx` | Chat widget (unchanged) |
| **Keep** | `src/components/cv-drawer.tsx` | CV drawer (unchanged) |
| **Keep** | `src/components/skills-modal.tsx` | Skills modal (unchanged) |
| **Keep** | `src/components/project-modal.tsx` | Project modal (unchanged) |
| **Keep** | `src/components/neural-map.tsx` | Neural map visualization (unchanged) |
| **Keep** | `src/components/boot-particles.tsx` | Boot particles (unchanged) |
| **Keep** | `src/components/agent-reveal-particles.tsx` | Agent reveal particles (unchanged) |
| **Keep** | `src/components/welcome-back.tsx` | Welcome back (unchanged) |
| **Retire** | `src/components/config-hero.tsx` | Replaced by `home-room.tsx` |
| **Retire** | `src/components/projects.tsx` | Replaced by `projects-room.tsx` |
| **Retire** | `src/components/experience-writing.tsx` | Replaced by `experience-room.tsx` |
| **Retire** | `src/components/footer.tsx` | Replaced by `contact-room.tsx` |
| **Retire** | `src/components/sidebar-nav.tsx` | Replaced by `signal-rail.tsx` |
| **Retire** | `src/components/director-stage-mock.tsx` | Mockup file — no longer needed after implementation |

---

## Task Breakdown

### Task 1: Create shared room infrastructure

**Files:**
- Create: `src/components/room-shell.tsx`
- Create: `src/components/atmosphere.tsx`
- Create: `src/components/signal-rail.tsx`

These are small, isolated components extracted from the mockup. They have no dependencies on room content.

- [ ] **Step 1: Create `room-shell.tsx`**

Extract from `director-stage-mock.tsx` lines ~570-592. This is the motion wrapper that handles room enter/exit animations.

```tsx
"use client";

import { motion, type Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function RoomShell({
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
```

- [ ] **Step 2: Create `atmosphere.tsx`**

Extract from mockup. Background gradient layer that changes per room.

```tsx
"use client";

import { motion } from "framer-motion";

// Re-export the flagship config colors for Projects room
export const flagshipColors: Record<string, string> = {
  openevent: "from-rose-500/20 via-red-300/10 to-green-400/10",
  codelens: "from-amber-400/18 via-sky-300/10 to-green-400/10",
  "gogaa-cli": "from-green-400/18 via-cyan-300/10 to-violet-400/10",
  rasad: "from-violet-400/20 via-fuchsia-300/10 to-green-400/10",
};

export function Atmosphere({
  room,
  projectSlug,
}: {
  room: string;
  projectSlug?: string;
}): React.ReactElement {
  const color =
    room === "projects" && projectSlug
      ? flagshipColors[projectSlug] ?? "from-accent/[0.08] via-transparent to-green-400/[0.045]"
      : "from-accent/[0.08] via-transparent to-green-400/[0.045]";

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <motion.div
        key={`${room}-${projectSlug}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`absolute inset-0 bg-gradient-to-br ${color}`}
      />
      <motion.div
        className="absolute left-1/2 top-[-20rem] h-[56rem] w-[56rem] -translate-x-1/2 rounded-full bg-accent/[0.055] blur-3xl"
        animate={{ x: [-30, 30, -30], scale: [0.94, 1.05, 0.94] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Create `signal-rail.tsx`**

Extract from mockup lines ~601-660. The left sidebar pipeline nav. Copy the exact `SignalRail` function from the mockup, adjusting imports. This component receives `room` and `setRoom` props.

Reference: `director-stage-mock.tsx` `SignalRail` function — copy it exactly, add proper imports for `Bot, BriefcaseBusiness, GitCommit, Network, Send` from lucide-react.

- [ ] **Step 4: Verify build**

```bash
cd /Users/shami/Work/portfolio-site && npx next build 2>&1 | tail -5
```

Expected: Build passes (new files aren't imported yet, but must be valid TS).

- [ ] **Step 5: Commit**

```bash
git add src/components/room-shell.tsx src/components/atmosphere.tsx src/components/signal-rail.tsx
git commit -m "feat: add shared room infrastructure (shell, atmosphere, signal rail)"
```

---

### Task 2: Create the curtain-pull navigation and floating agent

**Files:**
- Create: `src/components/curtain-pull-agent.tsx`
- Create: `src/components/floating-agent.tsx`

- [ ] **Step 1: Create `curtain-pull-agent.tsx`**

Extract the `CurtainPullAgent`, `CharacterSVG`, and `NextRoomPreview` from `director-stage-mock.tsx`. This is the core innovation — the SVG character hanging from a wire that pulls a curtain down to reveal the next room.

Key pieces to extract:
- `CharacterSVG` component (the one-hand-on-wire pointing character)
- `CurtainPullAgent` component with all the drag/curtain/wire logic
- `NextRoomPreview` component showing the next room's title

Export `CurtainPullAgent` as default. It needs props: `room: Room`, `onNext: () => void`, `nextRoomContent: React.ReactNode`.

Define and export the `Room` type and `roomOrder` array from this file so other components can import them:
```tsx
export type Room = "home" | "projects" | "experience" | "toolbelt" | "contact";
export const roomOrder: Room[] = ["home", "projects", "experience", "toolbelt", "contact"];
```

- [ ] **Step 2: Create `floating-agent.tsx`**

Extract the `FloatingAgent` component from the mockup. Small breathing emoji in bottom-right, contextual messages per room, opens chat on click. Hidden on `home` room.

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentEmoji } from "@/components/agent-visuals";
import type { Room } from "@/components/curtain-pull-agent";

const roomMessages: Record<Room, string> = {
  home: "",
  projects: "want details on any project?",
  experience: "curious about a role? ask me",
  toolbelt: "need my CV? just ask",
  contact: "ready to connect? let's talk",
};

export function FloatingAgent({ room }: { room: Room }): React.ReactElement {
  const [hovered, setHovered] = useState(false);

  if (room === "home") return <div className="hidden" />;

  return (
    <div className="fixed bottom-6 right-6 z-[55] flex items-end gap-2">
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-2 max-w-[200px] rounded-xl border border-green-400/20 bg-card/95 px-3 py-2 font-mono text-[11px] leading-relaxed text-green-300 shadow-[0_0_24px_rgba(74,222,128,0.1)] backdrop-blur-xl"
          >
            {roomMessages[room]}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("open-chat-widget"))}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative grid h-12 w-12 place-items-center rounded-full border border-green-400/30 bg-card/90 shadow-[0_0_30px_rgba(74,222,128,0.15)] backdrop-blur-xl transition hover:border-green-400/50"
        aria-label="Open agent chat"
      >
        <motion.span
          className="absolute inset-[-4px] rounded-full border border-green-400/10"
          animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-background bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
        <AgentEmoji size={28} mood="default" />
      </motion.button>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npx next build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/components/curtain-pull-agent.tsx src/components/floating-agent.tsx
git commit -m "feat: add curtain-pull navigation and floating agent"
```

---

### Task 3: Create the Home room

**Files:**
- Create: `src/components/rooms/home-room.tsx`

This is the most critical room. It must preserve the existing hero experience: streaming text reveals driven by boot particles, the `#hero-agent-mount` portal for `AgentBar`, stats strip, and the agent emoji dock.

- [ ] **Step 1: Create `src/components/rooms/home-room.tsx`**

Port the content from `config-hero.tsx` into a room component. Key requirements:
- Keep `StreamingWords` component (copy from `config-hero.tsx` lines 16-99)
- Keep `TITLE_SEGMENTS` and `DESC_SEGMENTS` data
- Keep the `hero-reveal` / `boot-complete` / `replay-intro` event listeners for particle-driven reveals
- Keep the `#hero-agent-mount` div so `AgentBar` can portal into it
- Keep the `hero-fully-written` event dispatch
- Keep the chat/agent overlay fade logic
- Remove scroll-based parallax transforms (no scrolling in room system)
- Keep the `HeroAgentDock` from the mockup (the agent emoji with mood buttons + "open the agent" button) — include it below the agent mount
- Use `useStatus()` for dynamic stats

The component receives no props — all state is internal.

Reference files:
- `config-hero.tsx` (streaming text, events, agent mount)
- `director-stage-mock.tsx` `HomeRoom` + `HeroAgentDock` functions

- [ ] **Step 2: Verify the agent portal mount point exists**

Ensure the rendered output includes:
```tsx
<motion.div id="hero-agent-mount" data-hero="agent" ... className="... min-h-[255px] md:min-h-[315px] ..." />
```

This is required for `AgentBar` to portal its content into the hero.

- [ ] **Step 3: Verify build**

```bash
npx next build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/components/rooms/home-room.tsx
git commit -m "feat: add home room with streaming hero + agent portal"
```

---

### Task 4: Create Projects, Experience, Skills, and Contact rooms

**Files:**
- Create: `src/components/rooms/projects-room.tsx`
- Create: `src/components/rooms/experience-room.tsx`
- Create: `src/components/rooms/skills-room.tsx`
- Create: `src/components/rooms/contact-room.tsx`

Each room is a direct extraction from `director-stage-mock.tsx`. They are self-contained — they receive data props and render content.

- [ ] **Step 1: Create `projects-room.tsx`**

Extract the `ProjectsRoom` function from the mockup (~lines 780-1028). It receives:
- `flagships`, `activeIndex`, `setActiveIndex` — flagship project carousel
- `solved`, `solve` — gesture tracking
- `otherProjects`, `otherIndex`, `setOtherIndex` — side reel
- `openProject` — opens ProjectModal

Imports needed: `AgentEmoji` from agent-visuals, `ProjectMockup` from project-mockup, `Check` from lucide-react, `motion/AnimatePresence` from framer-motion, project data types.

Include the `flagshipConfig` data (mockup kinds, moods, colors, why/action text).

- [ ] **Step 2: Create `experience-room.tsx`**

Extract the git-graph `ExperienceRoom` from the mockup (~lines 899-1004). Two-column layout: career branch (green) left, writing branch (amber) right, merge bar at bottom.

Receives: `articles` from `getFeaturedArticles()`.

Include the `roles` data array (hash, branch, company, title, period, body).

- [ ] **Step 3: Create `skills-room.tsx`**

Extract the `ToolbeltRoom` from the mockup. Embeds `NeuralMap`, has "expand" button (dispatches `show-skills-modal` event) and "open CV" button (calls `openCvDrawer()`).

Imports: `NeuralMap`, `openCvDrawer`, `FileText`/`Network` from lucide.

- [ ] **Step 4: Create `contact-room.tsx`**

Extract `ContactRoom` from mockup (~lines 1100-1143). Deploy pipeline with press-to-launch agent, "back to top" button.

Receives: `onGoTop: () => void`.

- [ ] **Step 5: Verify build**

```bash
npx next build 2>&1 | tail -5
```

- [ ] **Step 6: Commit**

```bash
git add src/components/rooms/
git commit -m "feat: add projects, experience, skills, and contact rooms"
```

---

### Task 5: Create the main PortfolioStage orchestrator

**Files:**
- Create: `src/components/portfolio-stage.tsx`

This is the main component that ties everything together. It manages room state and renders all rooms + overlays.

- [ ] **Step 1: Create `portfolio-stage.tsx`**

This component:
1. Manages `room` state and transition direction
2. Renders `Atmosphere`, `SignalRail`, `CurtainPullAgent`, `FloatingAgent`
3. Renders rooms inside `AnimatePresence` with `RoomShell` wrappers
4. Mounts all global overlays: `ChatWidget`, `CVDrawer`, `SkillsModal`, `ProjectModal`
5. Does NOT mount `TerminalBoot`, `TopBar`, `AgentBar`, `BootParticles`, `AgentRevealParticles`, `WelcomeBack` — those stay in `page.tsx`

State it manages:
- `room: Room` — current room
- `transitionDir: 1 | -1` — animation direction
- `activeFlagship: number` — which project is selected
- `gestureDone: GestureState` — which projects were revealed
- `otherIndex: number` — side reel index
- `modalProject: ProjectData | null` — open project modal

Provides `goRoom`, `goNext` callbacks.

Key: Room URL params support — read `?room=projects` on mount.

- [ ] **Step 2: Verify build**

```bash
npx next build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/portfolio-stage.tsx
git commit -m "feat: add PortfolioStage orchestrator"
```

---

### Task 6: Wire up page.tsx and verify

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update `page.tsx`**

Replace the scroll-based layout with:

```tsx
import { TopBar } from "@/components/top-bar";
import { TerminalBoot } from "@/components/terminal-boot";
import { AgentBar } from "@/components/agent-bar";
import { BootParticles } from "@/components/boot-particles";
import { AgentRevealParticles } from "@/components/agent-reveal-particles";
import { WelcomeBack } from "@/components/welcome-back";
import { PortfolioStage } from "@/components/portfolio-stage";

export default function Home(): React.ReactElement {
  return (
    <main id="main-content">
      <WelcomeBack />
      <TerminalBoot />
      <TopBar />
      <PortfolioStage />
      <AgentBar />
      <BootParticles />
      <AgentRevealParticles />
    </main>
  );
}
```

Removed: `ConfigHero`, `SidebarNav`, `Projects`, `ExperienceAndWriting`, `Footer`, `CursorGlow`, `HomeHashScroll`, scroll-based `div` wrappers, `cv-auto` classes.

Kept: `TerminalBoot` (boot sequence), `TopBar` (logo + top buttons), `AgentBar` (agent with hero portal), `BootParticles` + `AgentRevealParticles` (particle system), `WelcomeBack`.

- [ ] **Step 2: Full build**

```bash
npx next build 2>&1 | tail -20
```

Expected: Build passes with no type errors.

- [ ] **Step 3: Manual verification**

Open `http://localhost:3477` in browser. Verify:
1. Boot sequence plays on first visit
2. Hero text streams in, agent materializes
3. Agent bar works in hero (slash commands, suggestions)
4. Curtain-pull character appears top-right
5. Pulling character down reveals next room preview + transitions
6. SignalRail on left lets you skip rooms
7. Projects room: flagship slider + side reel + project modal opens
8. Experience room: git-graph with career + writing branches
9. Skills room: NeuralMap renders, expand opens skills modal, CV button opens drawer
10. Contact room: deploy pipeline + back-to-top
11. Floating agent appears on all rooms except home, shows contextual message on hover
12. Chat widget opens from floating agent click
13. Theme toggle works
14. Reboot button replays intro

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire room-based portfolio as main page"
```

---

### Task 7: Mobile responsiveness pass

**Files:**
- Modify: `src/components/curtain-pull-agent.tsx`
- Modify: `src/components/rooms/projects-room.tsx`
- Modify: `src/components/rooms/experience-room.tsx`
- Modify: `src/components/signal-rail.tsx`

- [ ] **Step 1: Curtain pull — touch support**

The Framer Motion `drag` already supports touch. Verify it works on mobile viewport (375x812). If the character is too small on mobile, increase its tap target to 56x56 minimum. Add `touch-action: none` to the draggable element to prevent browser scroll interference.

- [ ] **Step 2: Signal rail — hide on mobile**

Already hidden via `hidden md:block`. Verify. On mobile, the curtain pull is the only navigation.

- [ ] **Step 3: Projects room — stack on mobile**

The `xl:grid-cols-[minmax(0,1fr)_390px]` grid already stacks. Verify the flagship slider works on touch. Ensure content scrolls within the room on mobile (`overflow-y-auto` on mobile in `RoomShell`).

- [ ] **Step 4: Experience room — stack on mobile**

The `md:grid-cols-2` already stacks to single column on mobile. Verify.

- [ ] **Step 5: Test on 375px viewport**

Resize browser to 375x812. Navigate through all rooms. Verify no horizontal overflow, all content reachable, touch drag works.

- [ ] **Step 6: Commit**

```bash
git add -u
git commit -m "fix: mobile responsiveness for room navigation"
```

---

### Task 8: Clean up retired components

**Files:**
- Modify: `src/components/config-hero.tsx` — add deprecation comment, keep file (may be referenced)
- Modify: `src/components/sidebar-nav.tsx` — add deprecation comment
- Remove: `src/components/director-stage-mock.tsx` — mockup no longer needed
- Remove: `src/app/director-stage/` — mockup route no longer needed

- [ ] **Step 1: Remove mockup files**

```bash
rm src/components/director-stage-mock.tsx
rm -rf src/app/director-stage/
```

- [ ] **Step 2: Add deprecation comments to retired components**

Don't delete `config-hero.tsx`, `projects.tsx`, `experience-writing.tsx`, `footer.tsx`, `sidebar-nav.tsx` yet — they may be imported elsewhere or useful as reference. Add a comment at the top of each:

```tsx
// DEPRECATED: Replaced by room-based layout. See src/components/rooms/
```

- [ ] **Step 3: Verify build still passes**

```bash
npx next build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add -u
git commit -m "chore: remove mockup, deprecate retired scroll-layout components"
```

---

### Task 9: Polish pass — animations and micro-interactions

**Files:**
- Modify: Various room files

This is the "top 1%" pass. The concepts are in place; now polish the details.

- [ ] **Step 1: Curtain pull spring tuning**

Test the curtain animation with different spring configs. The commit animation should feel weighty — like pulling a real curtain. Try `stiffness: 180, damping: 24` for a slightly slower, more satisfying settle.

- [ ] **Step 2: Room transition timing**

Each room should fade/slide slightly differently to feel alive:
- Home → Projects: slide down (curtain)
- Projects → Experience: slide down
- Experience → Skills: slide down
- Skills → Contact: slide down
- Any backward nav via SignalRail: slide up

Verify the `transitionDir` logic handles this correctly.

- [ ] **Step 3: Character idle improvements**

The SVG character should have more life when idle:
- Gentle sway on the wire (already exists)
- Occasional blink (animate eye circles opacity briefly)
- Pointing arm subtle movement (already exists)

- [ ] **Step 4: Floating agent entrance animation**

When entering a new room, the floating agent should pop in with a slight delay (300ms after room transition completes) so it doesn't compete with the room animation.

- [ ] **Step 5: Test all transitions end-to-end**

Navigate through all 5 rooms forward, then back via SignalRail, then forward again. Every transition should feel smooth with no jank.

- [ ] **Step 6: Commit**

```bash
git add -u
git commit -m "polish: tune animations and micro-interactions"
```
