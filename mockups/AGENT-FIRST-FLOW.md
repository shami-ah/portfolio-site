# Agent-First Portfolio — Complete Interaction Flow

## Architecture Summary

**Before:** Agent is an overlay on a template layout (Hero | Stats | Projects | Experience | Contact)
**After:** Agent IS the layout. 3 content sections + footer contact state. Every interaction flows through the agent.

**Sections:** Agent Hero → Projects → Career → Footer (connect)
**Removed:** MissionStats section, ConfigContact section (both merged into other elements)
**Preserved:** Every animation, particle system, palette, texture, and component — just rewired.

---

## Phase 0: Boot Sequence (UNCHANGED)

**Component:** `terminal-boot.tsx` — zero changes needed

```
FIRST VISIT:
  0ms    → Overlay appears, typing starts: "$ shami init --mode=command-center"
  ~600ms → Check cascade begins (one every ~300ms):
           ✓ detecting visitor → scanning
           ✓ referrer: linkedin.com → classified
           ✓ intent: likely_hiring → conf 0.87
           ✓ optimizing for: decision_maker → layout ready
           ✓ 100+ clients live → openevent
           ✓ ready → personalized for you
  ~2400ms → Exit animation:
           Terminal shrinks → gold circle → green bubble
           → bubble flies to agent button position
           → agent-button-ready event fires
           → boot-particles event fires

  Events dispatched:
    "boot-complete"      @ 800ms  → hero starts revealing
    "agent-button-ready" @ 1400ms → agent interface appears
    "boot-particles"     @ 1750ms → 40-particle burst

RETURNING VISIT:
  localStorage("boot-ever-seen") === "1"
  → Skip entirely, instant hero reveal
```

**What changes:** The `agent-button-ready` event currently makes the floating dot appear. Now it triggers the hero agent interface reveal instead. Same event, different target.

---

## Phase 1: Agent Hero Reveal

**Replaces:** `config-hero.tsx` (left/right split) + `mission-stats.tsx` (stats grid)
**New behavior:** Agent IS the hero. Centered. No split layout.

```
AFTER BOOT COMPLETES ("boot-complete" event):

  +0ms      → Top bar fades in (name + "building: gogaa v1.3.0")
  +200ms    → "● agent online" greeting (green, mono)
  +400ms    → Title streams word-by-word:
               "I'm [Ahtesham]. I ship AI systems that don't break."
               (StreamingWords component — PRESERVED, same blur→reveal animation)
  +600ms    → Subtitle fades in:
               "50+ production systems shipped. 5 years building full-stack + AI.
                Currently available for the right team."
               (Stats are NOW INLINE TEXT, not a separate grid section)
  +800ms    → Agent interface slides up:
               ┌─────────────────────────────────────────┐
               │ ● │ ask me anything — projects, stack... │
               │   try: projects · skills · hire me       │
               └─────────────────────────────────────────┘
  +800ms    → Suggestion chips appear below:
               [whoami] [Projects] [Skills] [Rate] [How I ship] [View CV]
  +1200ms   → Scroll hint fades in at bottom: "scroll to explore ↓"
  +1750ms   → BootParticles fire (40 particles, 6 waves)
               Targets: greeting, title, subtitle, agent input, chips
               (Same particle system — just retarget wave selectors)

RETURNING VISIT (boot skipped):
  Everything appears instantly (immediate=true flag, same as current)
```

**Key animation preservation:**
- `StreamingWords` — exact same component, same blur(3px)→blur(0px) per word
- `BootParticles` — same 40-particle burst, 6 waves, theme-palette colors
- Ambient orbs — same `filter: blur(80px)` background gradients
- `CursorGlow` — still tracks mouse across viewport

**What's removed from hero:**
- Left/right grid split → centered single-column
- `HeroAboutCard` as static element → now an agent response (see Phase 2)
- `TiltCard` wrapper on about card → tilt moves to agent response card
- Parallax scroll transforms on orbs → KEEP, they still work centered

---

## Phase 2: Agent Interactions (Hero Viewport)

The agent input in the hero is the SAME command system from `agent-bar.tsx`. Not a new thing — same commands, same fuzzy matching, same processing pipeline UI.

### Interaction: "whoami" (About Card)

```
User types "whoami" or clicks [whoami] chip

  +0ms    → Agent processes (same pipeline steps UI):
             shami.agent
             ├─ parse("whoami") ✓ 8ms
             ├─ classify_intent → identity_query ✓ 3ms
             └─ retrieve_context → identity_card ✓ 12ms

  +400ms  → About card slides in below agent input (not beside it):
             ┌─────────────────────────────────────────┐
             │ ● ● ●  shami.agent — whoami             │
             ├─────────────────────────────────────────┤
             │ $ whoami                                 │
             │   [A] Ahtesham Ahmad                    │
             │       Full-Stack + AI Engineer           │
             │ $ cat location                           │
             │   Islamabad, PK · remote-first           │
             │ $ echo $LANGUAGES                        │
             │   EN, UR, PS, SD, AR                     │
             │ $ cat interests.txt                      │
             │   Snooker, cricket, history, technology  │
             │ $ cat superpower.txt                     │
             │   Picks up anything fast                 │
             │ $ cat philosophy.md                      │
             │   Build the tool when none exists █      │
             └─────────────────────────────────────────┘

  Lines reveal one-by-one (~120ms stagger) — same animation as
  current HeroAboutCard's visibleLines state machine.
  Cursor blinks on last line (same 0.6s blink animation).
  TiltCard wrapper preserved (mouse → 3D tilt on the card).
```

**Why this is better:** Visitors DISCOVER your identity by interacting with the agent. It's not wallpaper — it's a response to a question. More memorable, more aligned with the "agent portfolio" concept.

### Interaction: "projects" → Scroll Navigation

```
User types "projects" or clicks [Projects] chip

  +0ms    → Processing pipeline appears:
             shami.agent
             ├─ parse("projects") ✓ 12ms
             ├─ classify_intent → navigation ✓ 3ms
             ├─ resolve_section → #projects ✓ 1ms
             └─ scroll_to(projects) ✓ 18ms

  +600ms  → Response text: "Scrolling to projects — 4 flagship systems..."
  +800ms  → AgentRevealParticles fire:
             Particles fly FROM agent interface → TO #projects section
             Projects section has blur filter during transit
             Section deblurs as particles arrive (~30-50 particles)
             (EXACT same component — just source changes from dot to input area)

  +800ms  → Smooth scroll begins to #projects
  +1100ms → Scroll settles (onScrollSettled, 300ms stability check)
             → Section fully deblurred
             → Sidebar wire fills to "projects" node
             → Agent input relocates to fixed bottom bar (pill form)
```

### Interaction: "skills" → Neural Map Modal

```
User types "skills" or clicks [Skills] chip

  → Processing pipeline (same steps)
  → SkillsModal opens (27-node neural graph — UNCHANGED)
  → Same modal, same animation, same component
```

### Interaction: "cv" → CV Drawer

```
User clicks [View CV] chip

  → Processing pipeline
  → openCvDrawer() fires (same function)
  → Right-side drawer slides in with blur backdrop
  → A4 iframe at 794px — UNCHANGED
```

### Interaction: "build" / "How I ship" → Build Popup

```
User clicks [How I ship] chip

  → Processing pipeline
  → BuildPopup renders (6-step centered overlay — UNCHANGED):
     Product → Architect → Spec → Scaffold → Review → Ship
     Each step reveals at 650ms intervals
```

### Interaction: "hire" / "rate" / free text → Chat Route

```
User types "hire me" or "what's your rate"

  → Fuzzy matching scores against PROJECT_KEYWORDS
  → If matched to "rate" or "hire":
    Processing pipeline → "Routing to chat agent..."
  → Flying-to-chat animation:
    Green orb flies from agent interface → chat widget (bottom-right)
    Same spring physics, same glow, same 1s duration
  → Chat widget opens with pre-filled context
  → RAG knowledge base serves the answer (UNCHANGED)

  For unmatched free text (score < 2):
  → Routes directly to chat with the query
```

---

## Phase 3: Scrolling Past Hero → Fixed Agent Bar

When the user scrolls past ~70% of the hero viewport:

```
HERO AGENT → FIXED BOTTOM BAR TRANSITION:

  The centered hero agent interface doesn't scroll away and leave nothing.
  Instead, it morphs into a compact fixed pill at the bottom:

  ┌──────────────────────────────────┐
  │ ● agent │ ask anything...        │
  └──────────────────────────────────┘

  This IS the current agent-bar.tsx, just triggered differently:
  - Before: appears after boot, always a floating dot
  - After: appears when scrolling past hero, starts as pill with input

  The pill has the same section-aware behavior:
  - Projects section → blue dot, "ask about any project..."
  - Career section → purple dot, "ask about experience..."
  - Footer/connect → gold dot, "rate, availability, or just say hi..."

  Same suggestion chips appear above the pill when expanded.
  Same processing pipeline UI.
  Same methodology chips per project.
```

**Sidebar wire nav:** UNCHANGED. Still tracks scroll position. But the section IDs update:

```
BEFORE:                    AFTER:
hero      → About          hero      → Agent (or keep "About")
mission   → Impact         [REMOVED]
projects  → Work           projects  → Work
log       → Career         log       → Career
contact   → Connect        [REMOVED — merged into footer]

Wire nav goes from 5 nodes to 3 (or 4 if footer counts).
Bezier paths recalculated for fewer nodes — more spread, bigger gaps.
Wire fill animation is smoother with fewer segments.
```

---

## Phase 4: Projects Section

**Component:** `projects.tsx` — minimal changes

```
SCROLL INTO PROJECTS:

  Agent context label appears:
    ● agent.context → projects
    (Small mono text, green dot — shows the agent is "aware" of where you are)

  Section title: "What I've shipped"
  Subtitle: "Each system runs in production. Each solved a problem nobody else was solving."

  SCROLLYTELLING (UNCHANGED):
    4 flagship projects as sticky cards:
    - OpenEvent (LIVE · 100+ teams · 150+ events · saves ~90 min/day)
    - CodeLens  (PRIVATE · 430 patterns · 9 stacks)
    - Gogaa CLI (OSS · 1,418 tests · 11 providers)
    - Rasad     (PUBLISHED · npm: rasad-ai@1.0.0)

    Same sticky scroll behavior.
    Same project-modal.tsx for details.
    Same project-mockup.tsx browser frames.
    Same access-request-modal.tsx for gated projects.
    Same architecture-diagram.tsx SVG renders.

  KEY CHANGE: Stats that were in MissionStats are now INLINE in project tags:
    Before: Separate "100+" card in stats grid
    After:  "LIVE · 100+ teams · 150+ events" badge on OpenEvent card

  AGENT BAR (fixed pill at bottom):
    Shifts to blue dot, placeholder: "ask about any project..."
    Chips update: [Rate] [How I ship] [Chat] [See career →]

    When a project modal opens:
      → Methodology chips replace section chips:
        OpenEvent:  "Why human-in-the-loop?" · "Why this architecture?" · "How was this shipped?"
        CodeLens:   "Why patterns over AI?" · "Why build your own?"
        Gogaa CLI:  "Why 11 providers?" · "Why build from scratch?"
        Rasad:      "Why local-first?" · "Why unified observatory?"
      → These trigger processing pipeline → detailed methodology responses
      → ALL UNCHANGED from current agent-bar.tsx
```

**Side projects:** Same grid below flagships (Deep Agents, Morning Briefing, n8n, Gogaa Web, Infrastructure).

---

## Phase 5: Career Section

**Component:** `experience-writing.tsx` — minimal changes

```
SCROLL INTO CAREER:

  Agent context label:
    ● agent.context → career

  Section title: "How I got here"

  GIT LOG TIMELINE (UNCHANGED):
    HEAD → main: Full-Stack + AI Engineer — Independent (2024–present)
    a7f3c2d:     Software Developer — OpenEvent (2022–2024)
    e91b4a8:     CS Student + Freelancer (2019–2022)

    Same commit-dot styling.
    Same current/past visual distinction.
    Same responsive layout.

  AGENT BAR:
    Purple dot, placeholder: "ask about experience..."
    Chips: [View CV] [Full journey] [Rate] [Get in touch →]
```

**Writing section:** Stays in this section if it exists, or accessible via /writing route. No structural change needed.

---

## Phase 6: Footer (Contact Merged Into Agent State)

**Replaces:** `config-contact.tsx` (separate CTA section with testimonials)

```
SCROLL TO FOOTER:

  Agent context label:
    ● agent.mode → connect

  "Ready when you are."
  "Available for full-time & contract. Based in Germany, open to Gulf & remote."

  CONTACT ROW:
    [Book a 15-min call] [Email] [GitHub] [LinkedIn] [View CV]
    (Same links, same actions — just no longer a full-width CTA section)

  TESTIMONIAL STRIP (inline, rotating):
    "The AI layer saves us 90 minutes a day. Worth every cent."
    — River Soellner, CEO @ OpenEvent
    (Same 4 testimonials, same 5s rotation — just compact, not a carousel section)

  AGENT BAR:
    Gold dot, placeholder: "rate, availability, or just say hi..."
    Chips: [Rate] [View CV] [Availability] [Book a call]

  FOOTER BOTTOM:
    © 2026 Ahtesham Ahmad · system uptime: 7 years
    /uses · /journey · GitHub
```

**Why this works:** Contact isn't a "section" you scroll to — it's the natural end of the page where the agent shifts to connect mode. The agent has been offering "hire", "rate", "call" commands the ENTIRE time. The footer just makes those visible for people who scroll all the way down without using the agent.

---

## Persistent Elements (UNCHANGED Throughout)

| Element | Behavior | Changes |
|---------|----------|---------|
| **TopBar** | Fixed top, name + status, meteor animation on scroll | None |
| **SidebarNav** | SVG wire nav, scroll-driven fill, lg:flex only | Reduce from 5→3-4 nodes |
| **CursorGlow** | Mouse-following radial gradient | None |
| **ChatWidget** | Floating bottom-right, multi-model RAG | None |
| **CVDrawer** | Right-slide drawer, A4 print iframe | None |
| **SkillsModal** | 27-node neural graph overlay | None |
| **BuildPopup** | 6-step pipeline overlay | None |
| **GrainOverlay** | Fixed div, z-35, noise texture | None |
| **ThemeToggle** | Bottom-left dark/light switch | None |

---

## Event Flow Diagram

```
PAGE LOAD
  │
  ├─ First visit?
  │   YES → TerminalBoot renders
  │   │      ├─ Typing animation
  │   │      ├─ Check cascade
  │   │      ├─ Exit: shrink → gold → green bubble → fly to center
  │   │      ├─ dispatch("boot-complete") ──────→ Hero content starts revealing
  │   │      ├─ dispatch("agent-button-ready") → Agent interface appears
  │   │      └─ dispatch("boot-particles") ────→ 40 particles target hero elements
  │   │
  │   NO → Skip boot, reveal hero instantly (immediate=true)
  │
  ├─ HERO VIEWPORT (agent-first)
  │   │
  │   ├─ User types command or clicks chip
  │   │   ├─ "whoami" → About card slides in (terminal style, line-by-line)
  │   │   ├─ "projects" → Processing pipeline + AgentRevealParticles + scroll
  │   │   ├─ "skills" → SkillsModal opens
  │   │   ├─ "cv" → CVDrawer opens
  │   │   ├─ "build" → BuildPopup overlay
  │   │   ├─ "hire/rate/chat" → Flying-to-chat → ChatWidget opens
  │   │   └─ free text → Fuzzy match → route to best match or chat
  │   │
  │   └─ User scrolls down
  │       └─ Hero agent → morphs to fixed bottom pill
  │
  ├─ PROJECTS SECTION
  │   ├─ Scrollytelling (4 sticky flagships)
  │   ├─ Agent bar: blue dot, project-aware chips
  │   ├─ Project modal open → methodology chips appear
  │   └─ Side projects grid below
  │
  ├─ CAREER SECTION
  │   ├─ Git-log timeline
  │   ├─ Agent bar: purple dot, career chips
  │   └─ CV/journey accessible via agent
  │
  └─ FOOTER (connect state)
      ├─ Contact links + Book a call CTA
      ├─ Rotating testimonials (inline)
      ├─ Agent bar: gold dot, connect chips
      └─ © + /uses + /journey + GitHub
```

---

## What Gets Deleted

| Component/Section | Reason |
|---|---|
| `mission-stats.tsx` as a section | Stats inlined into hero subtitle + project card badges |
| `config-contact.tsx` as a section | Merged into footer + agent connect state |
| Hero left/right grid layout | Replaced by centered agent-first layout |
| `HeroAboutCard` as static element | Becomes agent response to "whoami" |
| Sidebar nav "mission" + "contact" nodes | Sections no longer exist as scroll targets |

## What Gets Created

| New Element | Description |
|---|---|
| Agent hero layout | Centered: greeting → title → subtitle (with inline stats) → agent input → chips |
| "whoami" response card | Same HeroAboutCard terminal, triggered by agent command |
| Agent context labels | Small "● agent.context → projects" per section |
| Footer contact block | Compact CTA + testimonial strip + footer |
| Hero→pill transition | Agent input morphs to fixed pill on scroll |

## What's Modified (Not Deleted or Created)

| Component | Change |
|---|---|
| `agent-bar.tsx` | Starts as hero input (centered), morphs to pill on scroll. Same command system. |
| `sidebar-nav.tsx` | 5 nodes → 3-4 nodes. Same wire animation, recalculated bezier paths. |
| `boot-particles.tsx` | Retarget wave selectors to new hero elements (greeting, title, input). |
| `agent-reveal-particles.tsx` | Source position changes from dot to centered input area. |
| `page.tsx` | Remove MissionStats + ConfigContact imports. Restructure section order. |
| `config-hero.tsx` | Refactor to centered layout. StreamingWords preserved. About card becomes response. |

---

## Mobile Considerations

- Sidebar nav hidden (already `lg:flex` only — no change)
- Agent hero is centered — works better on mobile than left/right split
- Agent input is full-width on mobile
- About card response stacks naturally below input
- Fixed pill bar at bottom has same mobile behavior as current agent dot
- Footer contact is already responsive (flex-wrap)

---

## Returning Visitor Flow

```
localStorage("boot-ever-seen") === "1"

  → Boot skipped entirely
  → Hero reveals instantly (immediate=true on all StreamingWords)
  → Agent interface visible immediately
  → No particles on return (boot-particles only fires from boot)
  → Everything else identical
```

---

## Keyboard Shortcuts (UNCHANGED)

- `/` → Focus agent input (works from anywhere)
- `Escape` → Close agent panel / modal
- Letter-by-letter typing → Keystroke buffer triggers commands
- `Enter` → Execute command

---

## The Soul

The portfolio's signature is: **an AI agent that IS the interface, not a widget on top of one.**

Before: "Here's my portfolio. Oh, and there's an agent button if you want to try it."
After: "You're talking to my agent. It will show you everything."

Every section the visitor sees was either navigated to by the agent, or encountered while scrolling past agent-introduced content. The agent doesn't assist — it presents.
