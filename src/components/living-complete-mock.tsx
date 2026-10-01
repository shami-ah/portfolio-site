"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Calendar,
  Check,
  ChevronRight,
  Code2,
  FileText,
  GitPullRequest,
  Layers,
  Mail,
  Map,
  MessageSquare,
  Network,
  Radar,
  Send,
  Sparkles,
  Terminal,
  Wrench,
} from "lucide-react";
import { AgentEmoji, type EmojiMood } from "@/components/agent-visuals";
import { ProjectMockup, type MockupKind } from "@/components/project-mockup";
import { DecisionTree } from "@/components/decision-tree";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { NeuralMap } from "@/components/neural-map";
import { projects, type ProjectData } from "@/data/projects";
import { diagrams } from "@/data/diagrams";
import { BUILD_STEPS } from "@/components/agent-visuals";

type Mode = "home" | "project" | "ecosystem" | "career" | "skills" | "cv" | "chat" | "journey" | "uses" | "writing" | "contact";
type Layer = "demo" | "architecture" | "decision" | "impact" | "details";

const flagshipMockups: Partial<Record<string, MockupKind>> = {
  openevent: "openevent",
  codelens: "codelens",
  "gogaa-cli": "gogaa",
  rasad: "rasad",
};

const modeLabels: Record<Mode, string> = {
  home: "home stage",
  project: "project stage",
  ecosystem: "all systems",
  career: "career compiler",
  skills: "skills constellation",
  cv: "CV dossier",
  chat: "chat sidecar",
  journey: "principle chamber",
  uses: "workbench mode",
  writing: "thought trail",
  contact: "deploy signal",
};

const modes = Object.keys(modeLabels) as Mode[];
const layers: Layer[] = ["demo", "architecture", "decision", "impact", "details"];

const projectMoods: Record<string, EmojiMood> = {
  openevent: "proud",
  codelens: "curious",
  "gogaa-cli": "surprised",
  rasad: "default",
};

const ease = [0.22, 1, 0.36, 1] as const;

export function LivingCompleteMock(): React.ReactElement {
  const [mode, setMode] = useState<Mode>("home");
  const [activeSlug, setActiveSlug] = useState("openevent");
  const [layer, setLayer] = useState<Layer>("demo");
  const [approved, setApproved] = useState(false);
  const [lens, setLens] = useState<"ai-lead" | "devtools" | "founder" | "architect">("devtools");

  const activeProject = useMemo(
    () => projects.find((project) => project.slug === activeSlug) ?? projects[0],
    [activeSlug],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextMode = params.get("mode");
    const nextProject = params.get("project");
    const nextLayer = params.get("layer");
    if (nextMode && modes.includes(nextMode as Mode)) setMode(nextMode as Mode);
    if (nextProject && projects.some((project) => project.slug === nextProject)) setActiveSlug(nextProject);
    if (nextLayer && layers.includes(nextLayer as Layer)) setLayer(nextLayer as Layer);
  }, []);

  const mood: EmojiMood = mode === "project"
    ? projectMoods[activeProject.slug] ?? "curious"
    : mode === "contact"
      ? "waving"
      : mode === "chat"
        ? "curious"
        : "default";

  const openProject = (slug: string): void => {
    setActiveSlug(slug);
    setLayer("demo");
    setMode("project");
  };

  return (
    <main className="min-h-dvh overflow-hidden bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute left-1/2 top-[-20rem] h-[54rem] w-[54rem] -translate-x-1/2 rounded-full bg-accent/[0.055] blur-3xl" />
      </div>

      <div className="relative min-h-dvh px-4 py-4 md:px-6">
        <Header mode={mode} />
        <StageRail mode={mode} setMode={setMode} />

        <section className="mx-auto flex min-h-[calc(100dvh-76px)] max-w-7xl flex-col pt-8 md:pl-20 md:pt-12">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_370px]">
            <HeroBlock dimmed={mode !== "home"} />
            <AgentDirector
              mode={mode}
              project={activeProject}
              layer={layer}
              mood={mood}
              setMode={setMode}
              openProject={openProject}
            />
          </div>

          <div className="relative mt-6 flex flex-1 items-center">
            <AnimatePresence mode="wait">
              {mode === "home" && (
                <HomeStage key="home" openProject={openProject} setMode={setMode} />
              )}
              {mode === "project" && (
                <ProjectStage
                  key={`${activeProject.slug}-${layer}`}
                  project={activeProject}
                  layer={layer}
                  setLayer={setLayer}
                  setMode={setMode}
                  openProject={openProject}
                  approved={approved}
                  setApproved={setApproved}
                />
              )}
              {mode === "ecosystem" && (
                <EcosystemStage key="ecosystem" openProject={openProject} />
              )}
              {mode === "career" && (
                <CareerStage key="career" lens={lens} setLens={setLens} setMode={setMode} />
              )}
              {mode === "skills" && (
                <SkillsStage key="skills" activeProject={activeProject} openProject={openProject} />
              )}
              {mode === "cv" && (
                <CvStage key="cv" activeProject={activeProject} lens={lens} setMode={setMode} />
              )}
              {mode === "chat" && (
                <ChatStage key="chat" activeProject={activeProject} layer={layer} />
              )}
              {mode === "journey" && (
                <JourneyStage key="journey" setMode={setMode} />
              )}
              {mode === "uses" && (
                <UsesStage key="uses" setMode={setMode} />
              )}
              {mode === "writing" && (
                <WritingStage key="writing" activeProject={activeProject} />
              )}
              {mode === "contact" && (
                <ContactStage key="contact" activeProject={activeProject} lens={lens} />
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
      <div className="grain-overlay" aria-hidden="true" />
    </main>
  );
}

function Header({ mode }: { mode: Mode }): React.ReactElement {
  return (
    <header className="relative z-40 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 font-mono text-small">
        <span className="text-accent">&gt;</span>
        <span className="font-semibold">ahtesham</span>
        <span className="text-muted/60">.dev</span>
        <span className="hidden text-muted/35 md:inline">| complete living mock</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden rounded-lg border border-card-border bg-card/50 px-3 py-2 font-mono text-caption text-muted/70 md:inline-flex">
          {modeLabels[mode]}
        </span>
        <span className="inline-flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 font-mono text-caption text-green-300">
          <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
          agent-directed
        </span>
      </div>
    </header>
  );
}

function StageRail({ mode, setMode }: { mode: Mode; setMode: (mode: Mode) => void }): React.ReactElement {
  const items: { mode: Mode; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
    { mode: "home", icon: Bot, label: "home" },
    { mode: "project", icon: Layers, label: "project" },
    { mode: "ecosystem", icon: Network, label: "all systems" },
    { mode: "career", icon: BriefcaseBusiness, label: "career" },
    { mode: "skills", icon: Sparkles, label: "skills" },
    { mode: "cv", icon: FileText, label: "cv" },
    { mode: "chat", icon: MessageSquare, label: "chat" },
    { mode: "journey", icon: Map, label: "journey" },
    { mode: "uses", icon: Wrench, label: "uses" },
    { mode: "writing", icon: BookOpen, label: "writing" },
    { mode: "contact", icon: Send, label: "contact" },
  ];

  return (
    <nav className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
      <div className="absolute bottom-0 top-0 w-px bg-gradient-to-b from-transparent via-card-border to-transparent" />
      {items.map((item) => {
        const Icon = item.icon;
        const active = mode === item.mode;
        return (
          <button
            key={item.mode}
            type="button"
            onClick={() => setMode(item.mode)}
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg border transition ${
              active
                ? "border-accent/40 bg-accent/15 text-accent"
                : "border-transparent bg-background/35 text-muted/35 hover:text-muted"
            }`}
            aria-label={item.label}
          >
            <Icon size={15} />
            {active && <span className="absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-accent-status shadow-[0_0_14px_rgba(74,222,128,0.85)]" />}
          </button>
        );
      })}
    </nav>
  );
}

function HeroBlock({ dimmed }: { dimmed: boolean }): React.ReactElement {
  return (
    <motion.div
      animate={{
        opacity: dimmed ? 0.22 : 1,
        y: dimmed ? -10 : 0,
        filter: dimmed ? "blur(2.5px)" : "blur(0px)",
      }}
      transition={{ duration: 0.35, ease }}
    >
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-500/25 bg-green-500/10 px-3 py-1.5 font-mono text-caption text-green-300">
        <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
        Open to opportunities
      </div>
      <h1 className="max-w-4xl text-balance text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
        I&apos;m <span className="text-accent">Ahtesham.</span>
        <br />
        I ship <span className="text-gradient">AI products</span>{" "}that don&apos;t break.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
        OpenEvent runs with 100+ clients. CodeLens reviews PRs in under a second. Gogaa keeps coding work moving across 11 providers. I design the architecture, build the product, and own delivery.
      </p>
      <div className="mt-5 flex flex-wrap gap-5 font-mono text-caption text-muted/60">
        <span><strong className="text-foreground">50+</strong> systems shipped</span>
        <span><strong className="text-foreground">10</strong> showcased</span>
        <span><strong className="text-foreground">5+</strong> years building</span>
      </div>
    </motion.div>
  );
}

function AgentDirector({
  mode,
  project,
  layer,
  mood,
  setMode,
  openProject,
}: {
  mode: Mode;
  project: ProjectData;
  layer: Layer;
  mood: EmojiMood;
  setMode: (mode: Mode) => void;
  openProject: (slug: string) => void;
}): React.ReactElement {
  const line = getAgentLine(mode, project, layer);
  return (
    <aside className="relative z-30 rounded-xl border border-card-border bg-card/45 p-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <motion.div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-green-400/25 bg-green-400/[0.045] shadow-[0_0_56px_rgba(74,222,128,0.13)]"
          animate={{ scale: [1, 1.035, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <AgentEmoji size={54} mood={mood} />
        </motion.div>
        <div>
          <p className="font-mono text-caption text-green-300">agent online</p>
          <p className="mt-1 text-small leading-relaxed text-muted">{line}</p>
        </div>
      </div>

      <div className="mt-4 border-l border-accent/30 pl-4">
        <p className="font-mono text-caption uppercase tracking-wider text-accent">what this mock proves</p>
        <p className="mt-1 text-small leading-relaxed text-foreground/80">
          The real agent stays. Chat becomes contextual. Existing modals become stage layers.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setMode("chat")} className="rounded-lg border border-accent/25 bg-accent/10 px-3 py-2 font-mono text-caption text-accent">
          ask about scene
        </button>
        <button type="button" onClick={() => setMode("cv")} className="rounded-lg border border-card-border bg-background/45 px-3 py-2 font-mono text-caption text-muted hover:text-foreground">
          compile CV
        </button>
        <button type="button" onClick={() => setMode("skills")} className="rounded-lg border border-card-border bg-background/45 px-3 py-2 font-mono text-caption text-muted hover:text-foreground">
          show skills
        </button>
        <button type="button" onClick={() => openProject("openevent")} className="rounded-lg border border-card-border bg-background/45 px-3 py-2 font-mono text-caption text-muted hover:text-foreground">
          start proof
        </button>
      </div>
    </aside>
  );
}

function getAgentLine(mode: Mode, project: ProjectData, layer: Layer): string {
  if (mode === "home") return "I assembled the proof. Touch the terminal or choose a living signal.";
  if (mode === "project") return `${project.title}: ${layer} layer. I keep you in the same stage instead of opening a disconnected modal.`;
  if (mode === "ecosystem") return "All projects become a deployment constellation. Flagships are full machines; smaller builds are compact proof signals.";
  if (mode === "career") return "Experience compiles around intent. The same facts rearrange for recruiter, founder, or engineer.";
  if (mode === "skills") return "Skills light up as parts of systems, not badges.";
  if (mode === "cv") return "The CV starts as a generated dossier, then opens the full drawer when needed.";
  if (mode === "chat") return "Chat is a contextual sidecar. It knows the current project and layer.";
  if (mode === "journey") return "Journey becomes the principle chamber behind the work.";
  if (mode === "uses") return "Uses becomes a workbench mode, still backed by the existing /uses page.";
  if (mode === "writing") return "Writing becomes a thought trail selected by active proof.";
  return "The contact panel appears after enough signal, not as a passive footer.";
}

function HomeStage({ openProject, setMode }: { openProject: (slug: string) => void; setMode: (mode: Mode) => void }): React.ReactElement {
  return (
    <StageShell>
      <button
        type="button"
        onMouseEnter={() => undefined}
        onClick={() => openProject("openevent")}
        className="group block w-full overflow-hidden rounded-xl border border-card-border bg-[#111218]/90 text-left shadow-2xl shadow-background/40 transition hover:border-accent/35"
      >
        <TerminalHeader title="portfolio.stage.ts" right="touch to wake" />
        <div className="relative min-h-[310px] p-5 font-mono text-small leading-7 md:p-6">
          <motion.div className="absolute inset-x-0 top-20 h-10 bg-accent/5" animate={{ opacity: [0.25, 0.8, 0.25] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
          <p className="text-muted/45">1&nbsp;&nbsp;// current terminal/code preview becomes the living stage</p>
          <p><span className="text-accent">export const</span> portfolio = createLivingStage(&#123;</p>
          <p className="pl-6">agent: <span className="text-green-300">&quot;real AgentEmoji + AgentBar&quot;</span>,</p>
          <p className="pl-6">navigation: <span className="text-green-300">&quot;touch objects, not scroll sections&quot;</span>,</p>
          <p className="pl-6">projects: <span className="text-green-300">systems.demonstrate()</span>,</p>
          <p className="pl-6">modals: <span className="text-green-300">stage.layers()</span>,</p>
          <p>&#125;)</p>
          <div className="mt-6 grid gap-2 md:grid-cols-4">
            {[
              ["OpenEvent", "email -> approval"],
              ["CodeLens", "PR -> scan"],
              ["Gogaa", "provider -> fallback"],
              ["Rasad", "session -> replay"],
            ].map(([name, detail]) => (
              <span key={name} className="rounded-lg border border-card-border bg-background/35 px-3 py-2">
                <span className="block text-foreground">{name}</span>
                <span className="text-caption text-muted/55">{detail}</span>
              </span>
            ))}
          </div>
          <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between border-t border-card-border pt-4 font-mono text-caption text-muted/60">
            <span className="text-accent-status">● agent attached</span>
            <span className="group-hover:text-accent">click terminal to enter OpenEvent</span>
          </div>
        </div>
      </button>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <StageAction label="All systems constellation" onClick={() => setMode("ecosystem")} />
        <StageAction label="Career compiler" onClick={() => setMode("career")} />
        <StageAction label="Deploy signal" onClick={() => setMode("contact")} />
      </div>
    </StageShell>
  );
}

function ProjectStage({
  project,
  layer,
  setLayer,
  setMode,
  openProject,
  approved,
  setApproved,
}: {
  project: ProjectData;
  layer: Layer;
  setLayer: (layer: Layer) => void;
  setMode: (mode: Mode) => void;
  openProject: (slug: string) => void;
  approved: boolean;
  setApproved: (value: boolean) => void;
}): React.ReactElement {
  const mockup = flagshipMockups[project.slug];
  return (
    <StageShell>
      <div className="overflow-hidden rounded-xl border border-card-border bg-[#101116]/92 shadow-2xl shadow-background/40">
        <TerminalHeader title={`${project.slug}.stage.live`} right="modal content -> stage layers" />
        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-4 border-b border-card-border pb-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-mono text-caption uppercase tracking-[0.26em] text-accent">{project.type}</p>
              <h2 className="mt-2 text-3xl font-bold md:text-5xl">{project.title}</h2>
              <p className="mt-3 max-w-2xl text-small leading-relaxed text-muted">{project.oneLiner ?? project.impact}</p>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              {(["demo", "architecture", "decision", "impact", "details"] as Layer[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLayer(item)}
                  className={`rounded-lg border px-3 py-2 font-mono text-caption transition ${
                    layer === item ? "border-accent/35 bg-accent/10 text-accent" : "border-card-border bg-background/40 text-muted"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[390px]">
            {layer === "demo" && (
              <ProjectDemo project={project} mockup={mockup} approved={approved} setApproved={setApproved} />
            )}
            {layer === "architecture" && (
              <div className="max-h-[470px] overflow-auto">
                {diagrams[project.slug] ? (
                  <ArchitectureDiagram chart={diagrams[project.slug]} title={`${project.title} Architecture`} />
                ) : (
                  <FallbackArchitecture project={project} />
                )}
              </div>
            )}
            {layer === "decision" && (
              <div className="mt-5">
                {project.decision ? (
                  <DecisionTree decision={project.decision} />
                ) : (
                  <StageNote title="No formal decision tree yet" text="This project would use a compact choice interaction: visitor picks a tradeoff, then the stage reveals what Ahtesham chose and why." />
                )}
              </div>
            )}
            {layer === "impact" && (
              <ImpactLayer project={project} />
            )}
            {layer === "details" && (
              <DetailsLayer project={project} />
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-card-border pt-4 md:flex-row md:items-center md:justify-between">
            <ProjectSwitcher activeSlug={project.slug} openProject={openProject} />
            <div className="flex gap-2">
              <button type="button" onClick={() => setMode("chat")} className="rounded-lg border border-accent/25 bg-accent/10 px-3 py-2 font-mono text-caption text-accent">
                ask agent
              </button>
              <button type="button" onClick={() => setMode("skills")} className="rounded-lg border border-card-border bg-background/40 px-3 py-2 font-mono text-caption text-muted">
                skill trace
              </button>
            </div>
          </div>
        </div>
      </div>
    </StageShell>
  );
}

function ProjectDemo({
  project,
  mockup,
  approved,
  setApproved,
}: {
  project: ProjectData;
  mockup?: MockupKind;
  approved: boolean;
  setApproved: (value: boolean) => void;
}): React.ReactElement {
  if (project.slug === "openevent") {
    return (
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-xl border border-card-border bg-background/40 p-4">
          <p className="font-mono text-caption uppercase tracking-wider text-muted/50">incoming email</p>
          <p className="mt-4 text-base leading-relaxed text-foreground/85">
            Need a venue for 120 guests next Friday. Split invoice 60/40, vegetarian menu, and a soft hold until Monday.
          </p>
          <button
            type="button"
            onClick={() => setApproved(!approved)}
            className={`mt-5 inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 font-mono text-small ${
              approved ? "border-green-400/35 bg-green-400/10 text-green-300" : "border-accent/35 bg-accent/10 text-accent"
            }`}
          >
            {approved ? <Check size={15} /> : <Calendar size={15} />}
            {approved ? "approved -> execution lit" : "approve AI plan"}
          </button>
        </div>
        <div className="rounded-xl border border-card-border bg-background/40 p-4">
          <p className="font-mono text-caption uppercase tracking-wider text-muted/50">AI extracted plan</p>
          <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-small">
            {["120 guests", "next Friday", "60/40 invoice", "veg menu", "soft hold", "human gate"].map((item) => (
              <span key={item} className="border border-accent/20 bg-accent/[0.055] px-3 py-2 text-accent/85">{item}</span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 font-mono text-caption">
            {["calendar", "invoice", "CRM", "reply"].map((item) => (
              <span key={item} className={`border px-2 py-2 text-center ${approved ? "border-green-400/25 bg-green-400/10 text-green-300" : "border-card-border text-muted/35"}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (project.slug === "codelens") {
    return (
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <ProjectMockup kind="codelens" />
        <div className="rounded-xl border border-card-border bg-background/40 p-4">
          <p className="font-mono text-caption uppercase tracking-wider text-sky-300">interaction</p>
          <p className="mt-3 text-small leading-relaxed text-muted">
            Run scan {"->"} finding attaches inline {"->"} patch {"->"} risk score falls. CodeLensTryIt becomes a layer in this same stage.
          </p>
          <div className="mt-4 space-y-2 font-mono text-caption">
            {["470 patterns loaded", "CWE-79 detected", "risk score 5 -> 2", "code stays local"].map((item) => (
              <p key={item} className="border border-card-border bg-card/40 px-3 py-2">{item}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (project.slug === "gogaa-cli") {
    return (
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <ProjectMockup kind="gogaa" />
        <div className="rounded-xl border border-card-border bg-background/40 p-4">
          <p className="font-mono text-caption uppercase tracking-wider text-green-300">provider failover</p>
          {["Claude timeout", "GPT rate limit", "Groq streaming", "1,418 tests pass"].map((item, index) => (
            <p key={item} className={`mt-3 border px-3 py-2 font-mono text-caption ${index >= 2 ? "border-green-400/25 bg-green-400/10 text-green-300" : "border-card-border text-muted"}`}>{item}</p>
          ))}
        </div>
      </div>
    );
  }

  if (project.slug === "rasad") {
    return (
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <ProjectMockup kind="rasad" />
        <div className="rounded-xl border border-card-border bg-background/40 p-4">
          <p className="font-mono text-caption uppercase tracking-wider text-violet-300">session replay</p>
          <div className="mt-4 grid grid-cols-4 gap-2 font-mono text-caption">
            {["prompt", "read", "edit", "test", "fail", "retry", "pass", "grade"].map((item, index) => (
              <span key={item} className={`border px-2 py-2 text-center ${index < 7 ? "border-violet-300/25 bg-violet-400/10 text-violet-200" : "border-green-400/25 bg-green-400/10 text-green-300"}`}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <OtherProjectDemo project={project} />;
}

function OtherProjectDemo({ project }: { project: ProjectData }): React.ReactElement {
  const verbs: Record<string, string[]> = {
    "command-center": ["services connect", "action queue fills", "AI triage drafts", "operator approves"],
    "gluten-free": ["location/query enters", "retailers searched", "restaurants mapped", "recipe generated"],
    "dev-env": ["blank machine", "SSH/tmux/Tailscale", "packages install", "ready in minutes"],
    "agent-orchestrator": ["task enters", "planner routes", "workers execute", "result merges"],
    "agent-system": ["5 agents wake", "tools called", "sources checked", "answer merged"],
  };
  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
      <div className="rounded-xl border border-card-border bg-background/40 p-5">
        <p className="font-mono text-caption uppercase tracking-wider text-accent">living form</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {(verbs[project.slug] ?? project.architecture.slice(0, 4)).map((item, index, arr) => (
            <span key={item} className="inline-flex items-center gap-2">
              <span className="border border-accent/20 bg-accent/[0.055] px-3 py-2 font-mono text-caption text-accent/85">{item}</span>
              {index < arr.length - 1 && <ArrowRight size={14} className="text-muted/35" />}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-card-border bg-background/40 p-5">
        <p className="font-mono text-caption uppercase tracking-wider text-muted/50">why it exists</p>
        <p className="mt-3 text-small leading-relaxed text-muted">{project.cardSummary ?? project.impact}</p>
      </div>
    </div>
  );
}

function FallbackArchitecture({ project }: { project: ProjectData }): React.ReactElement {
  return (
    <div className="mt-5 rounded-xl border border-card-border bg-background/40 p-5">
      <p className="font-mono text-caption uppercase tracking-wider text-accent">architecture nodes</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {project.architecture.map((item, index) => (
          <span key={item} className="inline-flex items-center gap-2">
            <span className="border border-card-border bg-card/45 px-3 py-2 font-mono text-caption text-muted">{item}</span>
            {index < project.architecture.length - 1 && <ChevronRight size={14} className="text-muted/30" />}
          </span>
        ))}
      </div>
    </div>
  );
}

function ImpactLayer({ project }: { project: ProjectData }): React.ReactElement {
  const impact = project.measuredImpact;
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-3">
      {impact ? (
        <>
          <Metric label="before" value={`${impact.before.value}${impact.before.unit}`} text={impact.before.context} muted />
          <Metric label="after" value={`${impact.after.value}${impact.after.unit}`} text={impact.after.context} />
          <div className="rounded-xl border border-card-border bg-background/40 p-4">
            <p className="font-mono text-caption uppercase tracking-wider text-accent">proof pulses</p>
            <div className="mt-4 space-y-2">
              {impact.highlights.map((item) => (
                <p key={item.l} className="flex justify-between border border-card-border bg-card/40 px-3 py-2 font-mono text-caption">
                  <span className="text-foreground">{item.n}</span>
                  <span className="text-muted">{item.l}</span>
                </p>
              ))}
            </div>
          </div>
        </>
      ) : (
        project.results.slice(0, 3).map((result) => (
          <Metric key={result} label="result" value="✓" text={result} />
        ))
      )}
    </div>
  );
}

function DetailsLayer({ project }: { project: ProjectData }): React.ReactElement {
  return (
    <div className="mt-5 grid gap-4 lg:grid-cols-3">
      <DetailGroup title="features" items={project.features.slice(0, 5)} />
      <DetailGroup title="technical decisions" items={(project.techDecisions ?? []).map((item) => `${item.title}: ${item.description}`).slice(0, 4)} />
      <DetailGroup title="results" items={project.results.slice(0, 5)} />
    </div>
  );
}

function EcosystemStage({ openProject }: { openProject: (slug: string) => void }): React.ReactElement {
  return (
    <StageShell>
      <div className="rounded-xl border border-card-border bg-card/55 p-5 md:p-6">
        <p className="font-mono text-caption uppercase tracking-[0.26em] text-accent">deployment constellation</p>
        <h2 className="mt-2 text-3xl font-bold md:text-5xl">Every project becomes a living signal.</h2>
        <p className="mt-3 max-w-2xl text-small leading-relaxed text-muted">Flagships become full machines. Smaller projects become compact proof signals that expand into the same stage layers.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {projects.map((project, index) => (
            <button
              key={project.slug}
              type="button"
              onClick={() => openProject(project.slug)}
              className="group relative min-h-36 overflow-hidden rounded-xl border border-card-border bg-background/35 p-4 text-left transition hover:border-accent/35"
            >
              <span className="font-mono text-caption text-muted/45">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-bold group-hover:text-accent">{project.title}</h3>
              <p className="mt-2 line-clamp-2 text-small leading-relaxed text-muted">{project.cardSummary ?? project.impact}</p>
              <span className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-accent-status opacity-50 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>
    </StageShell>
  );
}

function CareerStage({
  lens,
  setLens,
  setMode,
}: {
  lens: "ai-lead" | "devtools" | "founder" | "architect";
  setLens: (lens: "ai-lead" | "devtools" | "founder" | "architect") => void;
  setMode: (mode: Mode) => void;
}): React.ReactElement {
  const data = {
    "ai-lead": ["More Life / OpenEvent", "AI roadmap ownership", "100+ clients", "approval-gated automation"],
    devtools: ["CodeLens", "Gogaa CLI", "Rasad", "local-first AI tooling"],
    founder: ["Wadware House", "client acquisition", "scope to delivery", "40+ returning clients"],
    architect: ["workflow engines", "pgvector/RAG", "system boundaries", "feature-flag rollout"],
  };
  return (
    <StageShell>
      <div className="rounded-xl border border-card-border bg-card/55 p-5 md:p-6">
        <p className="font-mono text-caption uppercase tracking-[0.26em] text-accent">career compiler</p>
        <h2 className="mt-2 text-3xl font-bold md:text-5xl">Experience rearranges around intent.</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {(Object.keys(data) as (keyof typeof data)[]).map((item) => (
            <button key={item} type="button" onClick={() => setLens(item)} className={`rounded-lg border px-3 py-2 font-mono text-caption ${lens === item ? "border-accent/35 bg-accent/10 text-accent" : "border-card-border bg-background/40 text-muted"}`}>
              {item}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {data[lens].map((item, index) => (
            <div key={item} className="border-l border-accent/30 bg-background/35 p-4">
              <p className="font-mono text-caption text-muted/45">0{index + 1}</p>
              <p className="mt-3 text-lg font-semibold">{item}</p>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setMode("cv")} className="mt-5 rounded-lg border border-accent/25 bg-accent/10 px-4 py-2.5 font-mono text-small text-accent">
          generate dossier from this lens
        </button>
      </div>
    </StageShell>
  );
}

function SkillsStage({ activeProject, openProject }: { activeProject: ProjectData; openProject: (slug: string) => void }): React.ReactElement {
  return (
    <StageShell>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="h-[560px] overflow-hidden rounded-xl border border-card-border bg-card/55">
          <div className="border-b border-card-border px-4 py-3 font-mono text-caption text-muted/60">
            neural-map — contextual skills for {activeProject.title}
          </div>
          <NeuralMap />
        </div>
        <div className="rounded-xl border border-card-border bg-card/55 p-5">
          <p className="font-mono text-caption uppercase tracking-[0.26em] text-accent">skill trace</p>
          <p className="mt-3 text-small leading-relaxed text-muted">In implementation, this graph highlights the nodes used by the active project instead of opening as an isolated modal.</p>
          <div className="mt-5 space-y-2">
            {projects.slice(0, 4).map((project) => (
              <button key={project.slug} type="button" onClick={() => openProject(project.slug)} className="flex w-full items-center justify-between rounded-lg border border-card-border bg-background/40 px-3 py-2 font-mono text-caption text-muted hover:text-accent">
                {project.title}
                <ArrowRight size={13} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </StageShell>
  );
}

function CvStage({ activeProject, lens, setMode }: { activeProject: ProjectData; lens: string; setMode: (mode: Mode) => void }): React.ReactElement {
  return (
    <StageShell>
      <div className="rounded-xl border border-card-border bg-card/55 p-5 md:p-6">
        <p className="font-mono text-caption uppercase tracking-[0.26em] text-accent">generated dossier</p>
        <h2 className="mt-2 text-3xl font-bold md:text-5xl">CV starts as a relevant brief.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-card-border bg-background/40 p-5">
            <p className="font-mono text-caption text-muted/55">visitor inspected</p>
            <p className="mt-2 text-2xl font-bold">{activeProject.title}</p>
          </div>
          <div className="rounded-xl border border-card-border bg-background/40 p-5">
            <p className="font-mono text-caption text-muted/55">compiled lens</p>
            <p className="mt-2 text-2xl font-bold">{lens}</p>
          </div>
        </div>
        <div className="mt-5 rounded-xl border border-accent/20 bg-accent/[0.055] p-5">
          <p className="font-mono text-caption text-accent">then full CVDrawer opens</p>
          <p className="mt-2 text-small leading-relaxed text-muted">The drawer content stays intact. The agent first frames the right proof, then offers full CV, print version, and contact.</p>
        </div>
        <button type="button" onClick={() => setMode("contact")} className="mt-5 rounded-lg border border-accent/25 bg-accent/10 px-4 py-2.5 font-mono text-small text-accent">
          continue to deploy signal
        </button>
      </div>
    </StageShell>
  );
}

function ChatStage({ activeProject, layer }: { activeProject: ProjectData; layer: Layer }): React.ReactElement {
  return (
    <StageShell>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="rounded-xl border border-card-border bg-card/55 p-5">
          <p className="font-mono text-caption uppercase tracking-[0.26em] text-accent">current scene context</p>
          <h2 className="mt-2 text-3xl font-bold">{activeProject.title} / {layer}</h2>
          <p className="mt-3 max-w-2xl text-small leading-relaxed text-muted">Chat is not the primary navigation. It opens as a sidecar with this context already loaded.</p>
          <div className="mt-5 rounded-xl border border-card-border bg-background/40 p-4 font-mono text-small text-muted">
            Walk me through {activeProject.title}: problem, architecture, tradeoffs, metrics, and what I should ask Ahtesham in an interview.
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-card-border bg-[#111218]/95">
          <div className="flex items-center justify-between border-b border-card-border px-4 py-3">
            <span className="font-mono text-caption text-green-300">chat sidecar</span>
            <MessageSquare size={15} className="text-accent" />
          </div>
          <div className="space-y-3 p-4 text-small">
            <p className="rounded-xl border border-card-border bg-background/45 p-3 text-muted">Ask about the active scene...</p>
            <p className="rounded-xl border border-accent/20 bg-accent/[0.055] p-3 text-foreground/85">I have {activeProject.title} and its {layer} layer loaded. I can answer without making you repeat context.</p>
          </div>
        </div>
      </div>
    </StageShell>
  );
}

function JourneyStage({ setMode }: { setMode: (mode: Mode) => void }): React.ReactElement {
  const principles = ["Human-in-the-loop", "Architect first", "Strict boundaries", "Tool producer", "One task per session", "Feature flags"];
  return (
    <StageShell>
      <div className="rounded-xl border border-card-border bg-card/55 p-5 md:p-6">
        <p className="font-mono text-caption uppercase tracking-[0.26em] text-accent">principle chamber</p>
        <h2 className="mt-2 text-3xl font-bold md:text-5xl">The `/journey` page becomes the why behind the stage.</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {principles.map((item) => (
            <span key={item} className="rounded-xl border border-card-border bg-background/40 p-4 font-mono text-small text-muted">{item}</span>
          ))}
        </div>
        <button type="button" onClick={() => setMode("uses")} className="mt-5 rounded-lg border border-accent/25 bg-accent/10 px-4 py-2.5 font-mono text-small text-accent">
          open workbench mode
        </button>
      </div>
    </StageShell>
  );
}

function UsesStage({ setMode }: { setMode: (mode: Mode) => void }): React.ReactElement {
  return (
    <StageShell>
      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="rounded-xl border border-card-border bg-card/55 p-4 font-mono text-caption text-muted">
          {["README.md", "ecosystem.ts", "wisc.ts", "stack.yaml", "workflow.yaml", "environment.yaml", "philosophy.md"].map((file) => (
            <p key={file} className="border-b border-card-border/40 py-2">{file}</p>
          ))}
        </div>
        <div className="rounded-xl border border-card-border bg-[#111218]/95 p-5 font-mono text-small leading-7">
          <p className="text-muted/45"># workflow.yaml</p>
          {BUILD_STEPS.map((step, index) => (
            <p key={step.label}><span className="text-muted/35">{index + 1}.</span> <span className="text-accent">{step.label}</span>: <span className="text-muted">{step.detail}</span></p>
          ))}
          <button type="button" onClick={() => setMode("writing")} className="mt-5 rounded-lg border border-accent/25 bg-accent/10 px-4 py-2.5 font-mono text-caption text-accent">
            view thought trail
          </button>
        </div>
      </div>
    </StageShell>
  );
}

function WritingStage({ activeProject }: { activeProject: ProjectData }): React.ReactElement {
  return (
    <StageShell>
      <div className="rounded-xl border border-card-border bg-card/55 p-5 md:p-6">
        <p className="font-mono text-caption uppercase tracking-[0.26em] text-accent">thought trail</p>
        <h2 className="mt-2 text-3xl font-bold md:text-5xl">Writing appears by relevance, not as a separate archive first.</h2>
        <p className="mt-3 text-small leading-relaxed text-muted">Active proof: {activeProject.title}. The stage would surface writing related to this system, then link to `/writing` for the full archive.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {["Architecture notes", "AI systems lessons", "Devtools field notes"].map((item) => (
            <span key={item} className="rounded-xl border border-card-border bg-background/40 p-4 font-mono text-small text-muted">{item}</span>
          ))}
        </div>
      </div>
    </StageShell>
  );
}

function ContactStage({ activeProject, lens }: { activeProject: ProjectData; lens: string }): React.ReactElement {
  return (
    <StageShell>
      <div className="rounded-xl border border-card-border bg-card/55 p-5 md:p-6">
        <p className="font-mono text-caption uppercase tracking-[0.26em] text-green-300">signal acquired</p>
        <h2 className="mt-2 text-4xl font-bold md:text-6xl">Deploy <span className="text-gradient">me.</span></h2>
        <p className="mt-3 font-mono text-small text-muted">one engineer, full ownership, zero handoffs</p>
        <div className="mt-6 rounded-xl border border-card-border bg-background/40 p-5">
          <p className="text-small leading-relaxed text-muted">You inspected <span className="text-foreground">{activeProject.title}</span> and compiled the <span className="text-foreground">{lens}</span> lens. The contact panel appears as the agent's conclusion, using your current deploy language.</p>
          <div className="mt-5 grid gap-2 md:grid-cols-3">
            {["Book 15-min call", "Open full CV", "Ask final question"].map((item) => (
              <button key={item} type="button" className="rounded-lg border border-accent/25 bg-accent/10 px-4 py-3 font-mono text-small text-accent">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </StageShell>
  );
}

function StageShell({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.985 }}
      transition={{ duration: 0.38, ease }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

function TerminalHeader({ title, right }: { title: string; right?: string }): React.ReactElement {
  return (
    <div className="flex items-center gap-2 border-b border-card-border bg-background/40 px-4 py-3">
      <span className="h-3 w-3 rounded-full bg-red-500/65" />
      <span className="h-3 w-3 rounded-full bg-yellow-500/65" />
      <span className="h-3 w-3 rounded-full bg-green-500/65" />
      <span className="ml-3 font-mono text-caption text-muted/60">{title}</span>
      {right && <span className="ml-auto font-mono text-caption text-accent">{right}</span>}
    </div>
  );
}

function ProjectSwitcher({ activeSlug, openProject }: { activeSlug: string; openProject: (slug: string) => void }): React.ReactElement {
  return (
    <div className="flex flex-wrap gap-1.5">
      {projects.map((project) => (
        <button
          key={project.slug}
          type="button"
          onClick={() => openProject(project.slug)}
          className={`rounded-full border px-2.5 py-1.5 font-mono text-caption ${
            activeSlug === project.slug ? "border-accent/35 bg-accent/10 text-accent" : "border-card-border bg-background/40 text-muted"
          }`}
        >
          {project.title}
        </button>
      ))}
    </div>
  );
}

function StageAction({ label, onClick }: { label: string; onClick: () => void }): React.ReactElement {
  return (
    <button type="button" onClick={onClick} className="rounded-xl border border-card-border bg-card/45 px-4 py-3 text-left font-mono text-small text-muted transition hover:border-accent/35 hover:text-accent">
      {label}
    </button>
  );
}

function StageNote({ title, text }: { title: string; text: string }): React.ReactElement {
  return (
    <div className="rounded-xl border border-card-border bg-background/40 p-5">
      <p className="font-mono text-caption uppercase tracking-wider text-accent">{title}</p>
      <p className="mt-3 text-small leading-relaxed text-muted">{text}</p>
    </div>
  );
}

function Metric({ label, value, text, muted = false }: { label: string; value: string; text: string; muted?: boolean }): React.ReactElement {
  return (
    <div className={`rounded-xl border p-5 ${muted ? "border-card-border bg-background/40" : "border-accent/20 bg-accent/[0.055]"}`}>
      <p className="font-mono text-caption uppercase tracking-wider text-muted/55">{label}</p>
      <p className={`mt-3 font-mono text-4xl font-bold ${muted ? "text-muted" : "text-accent"}`}>{value}</p>
      <p className="mt-3 text-small leading-relaxed text-muted">{text}</p>
    </div>
  );
}

function DetailGroup({ title, items }: { title: string; items: string[] }): React.ReactElement {
  return (
    <div className="rounded-xl border border-card-border bg-background/40 p-4">
      <p className="font-mono text-caption uppercase tracking-wider text-accent">{title}</p>
      <div className="mt-3 space-y-2">
        {(items.length > 0 ? items : ["This layer reuses existing project data when available."]).map((item) => (
          <p key={item} className="border-b border-card-border/40 pb-2 text-small leading-relaxed text-muted last:border-b-0">{item}</p>
        ))}
      </div>
    </div>
  );
}
