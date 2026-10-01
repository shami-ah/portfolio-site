# Living Portfolio Architecture

This is the implementation blueprint for converting the current portfolio into an agent-directed living stage without throwing away the existing craft.

The goal is not to add another mock page. The goal is to preserve the current portfolio's exact identity and change the interaction grammar.

## North Star

The visitor should not feel:

- "I am scrolling a portfolio."
- "I am opening project cards."
- "I am asking a chatbot questions."
- "I am reading a resume website."

The visitor should feel:

- "This portfolio is alive."
- "The agent is guiding the experience."
- "Every object understands what I touched."
- "The projects demonstrate themselves."
- "The interface is easy, but I have not seen this representation before."

Core rule:

```txt
The current portfolio remains the source.
The living stage becomes the interaction layer.
```

## Non-Negotiables

These existing pieces must stay recognizable:

- `TerminalBoot`
- `BootParticles`
- `ConfigHero` particle/word reveal
- `AgentEmoji` with real face states and moods
- `StageSpeechBubble`
- agent mood constellation
- agent morph-to-bar behavior
- `AgentBar` command parser, chips, processing output
- `ChatWidget`
- `Projects` data, project copy, metrics, diagrams, mockups
- `ProjectModal` content
- `DecisionTree`
- `ArchitectureDiagram`
- `CodeLensTryIt`
- `SkillsModal` / `NeuralMap`
- `CVDrawer`
- `ExperienceAndWriting`
- `Journey`
- `Uses`
- `Writing`
- `Footer` / contact deploy panel

Anything that replaces these with generic UI is the wrong direction.

## New Mental Model

Current model:

```txt
boot -> hero -> scroll -> projects -> modal -> experience -> contact
```

Target model:

```txt
boot -> hero assembled -> agent settles -> active stage
  -> visitor touches living object
  -> same stage morphs into proof
  -> agent guides next object
  -> deep content appears as layers, not page departures
```

The old page still exists for SEO, accessibility, and fallback. The primary experience is state-driven.

## Stage Architecture

Introduce a home-level stage coordinator:

```ts
type StageMode =
  | "intro"
  | "idle"
  | "project:openevent"
  | "project:codelens"
  | "project:gogaa-cli"
  | "project:rasad"
  | "project:command-center"
  | "project:gluten-free"
  | "project:dev-env"
  | "project:agent-orchestrator"
  | "project:agent-system"
  | "career"
  | "skills"
  | "cv"
  | "journey"
  | "uses"
  | "writing"
  | "contact"
  | "chat";
```

The coordinator owns:

- active mode
- active project
- active project layer
- visitor intent memory
- agent mood
- agent speech
- whether chat is a sidecar, full panel, or closed
- whether the fallback scroll page is visible

This should live above current homepage sections, not inside any single project component.

## Layout Principle

The first viewport should remain visually close to the current homepage:

- same top-left `> ahtesham.dev`
- same dark grid / grain
- same boot particle reveal
- same hero typography and copy from `ConfigHero`
- same real agent emoji face and speech bubble
- same current terminal/code-preview language
- same sidebar signal language

But the terminal/code preview becomes the primary living object.

```txt
hero text
  +
real agent emoji
  +
terminal preview
  =
living stage
```

No separate dashboard rail.
No generic cards.
No project grid as the first interaction.

## Boot And Intro

Current components:

- `TerminalBoot`
- `BootParticles`
- `AgentRevealParticles`
- `ConfigHero`
- `AgentBar`

New role:

The boot sequence assembles the world, not just reveals text.

Sequence:

1. `TerminalBoot` starts exactly as today.
2. `BootParticles` write hero title and description.
3. Particles also converge into the real `AgentEmoji`.
4. The agent settles in the hero stage.
5. The terminal/code preview appears below as a dormant object.
6. Four small living signals orbit or attach to the terminal:
   - OpenEvent email signal
   - CodeLens PR signal
   - Gogaa terminal signal
   - Rasad observatory signal
7. Agent speech:

```txt
"I assembled the proof. Touch the terminal."
```

Important:

- Do not add an instruction-heavy tutorial.
- The next action should be obvious through motion: terminal pulse, agent gaze, particles.
- Returning visitors can skip boot but should still see the living stage.

## Agent Behavior

The agent is the current agent, not a simplified icon.

Current components:

- `AgentEmoji`
- `StageSpeechBubble`
- `AgentBar`
- `BuildPopup`
- `WhoamiPopup`
- `ChatWidget`

### Agent States

```txt
hidden
assembling
idle-stage
looking-at-object
guiding
processing-command
bar-open
chat-sidecar
scene-commentary
```

### Idle Stage

Use current large emoji with moods and speech bubble.

The speech bubble rotates contextual prompts, but should be shorter than today:

```txt
"touch the terminal"
"try breaking a provider"
"approve the AI plan"
"scan the PR"
"scrub the session"
```

### Looking At Object

When visitor hovers/touches a living object:

- agent mood changes based on object
- face looks/reacts if feasible
- particles travel from agent to object
- speech bubble gives one short line

Examples:

```txt
OpenEvent: "This one needs trust, not blind automation."
CodeLens: "The bug is already visible if you know where to look."
Gogaa: "Break the provider. The work should continue."
Rasad: "Scrub it. AI work leaves a trail."
```

### Morph-To-Bar

Keep the existing agent morph-to-bar behavior for explicit commands and text input.

The bar is not primary navigation anymore. It becomes:

- "ask about this scene"
- "jump to another mode"
- "open chat"
- "open CV"
- "show skills"

### Chat

Chat remains as a deeper sidecar, not the main experience.

Rules:

- Chat opens with current scene context.
- If active project is OpenEvent, the chat starter is about OpenEvent.
- If active layer is architecture, chat starts with architecture context.
- If visitor asks a free-form question from the agent bar, route to `ChatWidget`.
- Chat should visually attach to the stage, not feel like an unrelated widget.

Example contextual query:

```txt
Walk me through OpenEvent: problem, architecture, tradeoffs, metrics, and what I should ask Ahtesham in an interview.
```

## Project Stage System

Current components:

- `Projects`
- `ProjectMockup`
- `ProjectModal`
- `ExpandModal`
- `ProjectDetailsContent`
- `ArchitectureDiagram`
- `DecisionTree`
- `AccessRequestModal`
- `CodeLensTryIt`

New role:

Projects are no longer first presented as cards or scroll panels. Each project is a stage mode.

Existing project content remains available as layers:

```txt
living demo layer
architecture layer
decision layer
impact layer
features layer
technical decisions layer
results layer
ask-agent sidecar
access gate layer
```

Modal content becomes "stage layers" instead of centered popups.

## Flagship Projects

### OpenEvent

Current content:

- 100+ clients
- 150+ events
- email ingestion
- AI intent classification
- entity extraction
- pgvector context
- human approval
- workflow engine
- calendar / Stripe / CRM / email
- decision tree: full automation vs approval gate

Living representation:

```txt
messy email -> AI extraction -> approval gate -> execution nodes
```

Visitor actions:

- touch incoming email
- watch extraction fields appear
- choose full automation or approval gate
- approve the plan
- see calendar, Stripe, CRM, email reply light up

Agent behavior:

```txt
"I don't let AI touch money without a human gate."
```

Layer mapping:

- `DecisionTree` becomes the choice before approval.
- `ArchitectureDiagram` appears as the pipeline behind the active machine.
- measured impact appears after approval.
- `ProjectDetailsContent` becomes expandable proof drawers inside the stage.

Exit / next:

- agent suggests CodeLens:

```txt
"Want to see how I keep changes from breaking? Scan a PR."
```

### CodeLens

Current content:

- 470 patterns
- 860+ PRs
- sub-second review
- local-first
- taint tracking
- risk score
- gap analysis vs Greptile
- `CodeLensTryIt`

Living representation:

```txt
PR file -> scanner line -> finding attaches to exact code -> patch -> risk score drops
```

Visitor actions:

- run scan
- inspect finding
- patch finding
- view pattern source
- try custom snippet through `CodeLensTryIt`

Agent behavior:

```txt
"Patterns first. AI second. Your code stays local."
```

Layer mapping:

- `CodeLensTryIt` becomes part of the live stage, not hidden in modal.
- architecture layer shows diff -> parser -> index -> patterns -> taint -> AI probes -> risk.
- results layer shows speed, size, coverage.

Exit / next:

```txt
"Now break a model provider and see if work stops."
```

### Gogaa CLI

Current content:

- 11 providers
- auto fallback
- 1,400+ tests
- Claude Code UI parity
- React Ink TUI
- session/WAL persistence
- plugins, scheduler, parallel agents

Living representation:

```txt
terminal prompt -> provider graph -> failure -> fallback -> streaming continues -> tests pass
```

Visitor actions:

- select provider to fail
- watch fallback path animate
- trigger a tool call
- inspect session persistence
- open plugin/scheduler/parallel-agent sublayers

Agent behavior:

```txt
"The provider is a variable, not the product."
```

Layer mapping:

- `ProjectMockup` terminal remains the base.
- architecture layer shows provider manager, tool registry, router, session, TUI.
- measured proof shows tests, providers, lock-in zero.

Exit / next:

```txt
"Now watch the work leave a trail."
```

### Rasad

Current content:

- 656 sessions
- A-F grading
- 38K messages
- 14K tool calls
- local-first
- zero outbound
- replay / observability

Living representation:

```txt
AI session timeline -> tool calls -> files touched -> tokens/cost -> grade -> replay
```

Visitor actions:

- scrub session
- hover tool call
- inspect file touch
- toggle cost / quality / timeline view
- see local-first boundary

Agent behavior:

```txt
"AI work should be observable before it is trusted."
```

Layer mapping:

- current Rasad mockup becomes replay shell.
- results layer shows session count, tool calls, local-first proof.
- architecture layer shows session parsers and local store.

Exit / next:

```txt
"You have seen the systems. Compile the person behind them."
```

## Other Projects

Other projects should not become a carousel of cards first. They become a compact "deployment constellation" unlocked after the flagships.

Current projects:

- `command-center`
- `gluten-free`
- `dev-env`
- `agent-orchestrator`
- `agent-system`

### Command Center

Living representation:

```txt
control surface -> connected services -> action logs -> deployment status
```

Use for:

- showing operational thinking
- connecting portfolio tracking, APIs, calendar, notifications

### Gluten-Free

Living representation:

```txt
location/query -> retailer data -> recipes/restaurants -> recommendation map
```

Use for:

- consumer AI UX
- data aggregation
- mobile/cross-platform proof

### Dev Env

Living representation:

```txt
blank machine -> package install -> SSH/tmux/Tailscale -> ready environment
```

Use for:

- infrastructure discipline
- reproducible setup
- portable development

### Agent Orchestrator

Living representation:

```txt
request -> route planner -> agents -> tools -> response
```

Use for:

- multi-agent orchestration proof
- task routing

### Agent System

Living representation:

```txt
5-agent graph -> one task -> tool calls -> merged answer
```

Use for:

- showing HuggingFace/Groq/Tavily/GitHub API integration

## Skills

Current components:

- `SkillsModal`
- `NeuralMap`
- `skillNodes`
- `skillEdges`

New role:

Skills become context-sensitive, not a standalone modal first.

Rules:

- When OpenEvent stage is active, light up Supabase, pgvector, Stripe, OpenAI, workflow engine.
- When CodeLens is active, light up TypeScript AST, taint tracking, Docker, GitHub Actions, CWE/pattern mining.
- When Gogaa is active, light up React Ink, provider routing, WAL, streaming, tests.
- When Rasad is active, light up SQLite/local storage, session parser, token ledger, replay, local API.

Agent line:

```txt
"These are not badges. These are the parts firing behind the system."
```

Fallback:

- `SkillsModal` still opens from command `skills`.
- In living stage, it opens as a full-stage constellation layer.

## CV

Current component:

- `CVDrawer`

New role:

CV becomes a generated dossier mode.

Flow:

1. Visitor explores systems.
2. Stage records which systems/lenses they inspected.
3. Agent compiles a dossier.
4. Visitor can open full `CVDrawer`.
5. Print/download remains unchanged.

Example:

```txt
Visitor inspected: CodeLens + Gogaa + Rasad
Likely angle: AI devtools / systems engineer
Relevant proof:
- local-first review engine
- provider-fallback coding agent
- AI observability platform
```

The existing CV content should not be rewritten. It should be filtered/framed first, then full drawer available.

## Career / Experience

Current component:

- `ExperienceAndWriting`
- role cards
- writing links

New role:

Experience becomes "career compiler", not a chronological section first.

Visitor chooses or agent infers a lens:

- AI Lead
- Founder
- DevTools Builder
- Automation Architect
- Full-stack Owner

The existing roles rearrange by relevance.

Examples:

AI Lead:

- More Life / OpenEvent first
- AI roadmap, clients, approval gates

Founder:

- Wadware House first
- client acquisition, delivery, ownership

DevTools Builder:

- CodeLens, Gogaa, Rasad first
- tooling, local-first, tests

Fallback:

- original `ExperienceAndWriting` remains accessible for complete chronological view.

## Journey

Current page:

- `/journey`
- principles
- daily workflow
- `TimeMachine`
- agent emoji principle cards

New role:

Journey becomes a "principle chamber" inside the stage.

It should not be thrown away. It becomes deeper context after the visitor sees project proof.

Trigger:

- agent command `tour`
- "why this architecture?"
- after project chain completion

Stage behavior:

- current page content can still exist at `/journey`
- living stage can preview each principle as a small interactive law
- full page remains for long-form reading

## Uses

Current page:

- `/uses`
- code-style workbench files
- stack, environment, WISC, workflow, philosophy

New role:

Uses becomes "workbench mode."

Trigger:

- agent command `stack`
- visitor inspects Gogaa/CodeLens
- "how do you work?"

Stage behavior:

- same file browser metaphor, but opened as a mode in the living stage.
- clicking `workflow.yaml` can trigger `BuildPopup`.
- clicking `wisc.ts` can show context engineering explanation.
- full `/uses` page remains for direct URL and SEO.

## Writing

Current page:

- `/writing`
- article data
- featured writing in `ExperienceAndWriting`

New role:

Writing becomes "thought trail."

Trigger:

- after career compiler
- agent command `writing`
- visitor asks "how do you think?"

Stage behavior:

- show 2-3 relevant writings based on active stage.
- OpenEvent stage surfaces writing about architecture/AI systems.
- CodeLens/Gogaa surfaces devtools writing.
- full `/writing` remains as archive.

## Contact

Current component:

- `Footer`
- deploy panel
- email/GitHub/LinkedIn/CV
- book URL

New role:

Contact becomes "deployment signal", not a footer.

Trigger:

- visitor has inspected enough proof
- agent detects hire/contact/rate intent
- command `hire`, `contact`, `call`

Stage behavior:

- use the exact deploy panel language:

```txt
Deploy me.
one engineer, full ownership, zero handoffs
```

- but frame it as agent conclusion:

```txt
"You inspected production AI, devtools, and architecture.
Recommended next action: deploy Ahtesham to your team."
```

Footer remains as fallback and direct contact surface.

## Existing Modal Mapping

### `ProjectModal`

Current:

- centered modal
- project title
- one-liner
- ask agent
- emoji commentary
- architecture
- features
- measured impact
- tech decisions
- results

New:

- becomes project stage layer system
- no full-screen popup by default
- title/one-liner already present in stage
- "ask agent" becomes chat sidecar with project context
- emoji commentary becomes agent speech
- architecture/features/results become tabs/layers within same stage

### `ExpandModal`

Current:

- expands mockup or diagram.

New:

- becomes "focus layer" in stage
- background dims but does not feel like leaving the world
- agent remains visible and contextual

### `SkillsModal`

Current:

- full modal neural map.

New:

- full-stage skill constellation
- modal fallback still exists for command compatibility

### `CVDrawer`

Current:

- drawer with full CV.

New:

- generated dossier first
- full drawer second

### `AccessRequestModal`

Current:

- request access form.

New:

- "locked proof gate"
- appears only when visitor touches private project proof
- should feel like unlocking a system, not generic form

### `BuildPopup`

Current:

- centered animated pipeline.

New:

- shipping pipeline mode
- can appear from:
  - agent command `build`
  - Journey principle
  - project "how shipped" layer
  - Uses `workflow.yaml`

## Navigation

Do not remove all navigation. Hide traditional navigation behind agent/stage language.

Primary:

- touch terminal/living object
- agent suggestions
- side signal rail
- keyboard shortcuts

Secondary:

- agent command bar
- direct pages (`/journey`, `/uses`, `/writing`)
- fallback scroll page

No state should trap the visitor.

Every mode needs:

- close/back to stage
- ask agent
- next suggested proof
- direct link fallback

## Mobile

Desktop can be spatial. Mobile must be sequential.

Mobile model:

```txt
agent at top
one living object per screen
horizontal state deck
tap/drag interactions
bottom agent bar
```

Rules:

- no dense constellation around hero
- no tiny hover-only controls
- every hover interaction must have tap equivalent
- project stages become single-object scenes
- chat opens as sheet
- CV opens as sheet
- skills graph either simplified or opens full screen

Mobile order:

1. boot
2. hero
3. terminal touch
4. OpenEvent
5. CodeLens
6. Gogaa
7. Rasad
8. compiler
9. dossier/contact

## Accessibility And SEO

The living stage cannot be the only way to access content.

Keep:

- semantic homepage sections in DOM
- project content text available
- direct route pages
- keyboard navigation
- reduced-motion fallback
- skip to content

Reduced motion:

- replace particle travel with fades
- replace morphs with simple transitions
- keep agent speech text
- keep explicit controls

SEO:

- Current project content remains server-rendered or statically present.
- Living stage can sit above fallback content.
- Avoid hiding all meaningful text behind client-only state.

## Implementation Phases

### Phase 1: Architecture Foundation

Create:

- `LivingStageProvider`
- `useLivingStage`
- stage mode types
- visitor intent memory
- project layer types
- agent scene bridge events

No visual redesign yet.

### Phase 2: Real Hero Integration

Modify:

- `ConfigHero`
- `AgentBar`
- `BootParticles`

Goal:

- hero remains visually the same
- terminal/living object is introduced
- real `AgentEmoji` remains
- no fake bot icons

### Phase 3: Flagship Project Stages

Build stage modes for:

- OpenEvent
- CodeLens
- Gogaa
- Rasad

Reuse:

- `ProjectMockup`
- `DecisionTree`
- diagrams
- measured impact data
- project copy
- `CodeLensTryIt`

### Phase 4: Modal Migration

Convert:

- `ProjectModal` -> stage layers
- `ExpandModal` -> focus layer
- `SkillsModal` -> stage mode
- `CVDrawer` -> dossier + drawer
- `AccessRequestModal` -> locked proof gate

### Phase 5: Secondary Content Modes

Integrate:

- Career compiler
- Uses workbench
- Journey principle chamber
- Writing thought trail
- Contact deploy signal

### Phase 6: Mobile And Reduced Motion

Build:

- mobile deck
- tap-first project interactions
- bottom agent controls
- reduced motion mode

### Phase 7: Fallback Cleanup

Keep fallback content but make it feel intentional:

- "classic view"
- direct anchors
- SEO text
- no duplicate visual clutter

## Open Design Questions

1. Should the living stage fully replace scroll on desktop, or should classic scroll remain below the first viewport?
2. Should first-time visitors be forced through OpenEvent first, or allowed to choose any living signal?
3. How much should chat be visible before the visitor interacts?
4. Should project stages auto-advance, or only advance after visitor action?
5. Should the old project scrollytelling panels remain in production as fallback, or only in classic view?
6. Should `/journey`, `/uses`, `/writing` visually adopt the living stage header, or stay as independent pages?

## What Not To Build

Do not build:

- a new dashboard shell
- generic project cards
- a chatbot-first portfolio
- big command palette as primary UX
- full-screen modals as default project exploration
- fake project content that does not match `src/data/projects.ts`
- simplified agent icons instead of `AgentEmoji`
- a design that only works with hover

## Success Criteria

The new implementation is successful if:

- the first screen still feels like the current portfolio
- the agent is recognizably the current agent
- the visitor knows what to touch without instructions
- projects demonstrate themselves in the same viewport
- chat is available but not the main interaction
- every existing content surface still has a home
- mobile has a clear tap-first equivalent
- the implementation can be shipped incrementally without deleting the current portfolio

