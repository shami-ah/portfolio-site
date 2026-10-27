"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CalendarCheck,
  Check,
  ChevronRight,
  CircleDot,
  Code2,
  FileCode2,
  FileText,
  GitPullRequest,
  Mail,
  Network,
  Radar,
  ScanLine,
  Send,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

type Scene = "boot" | "systems" | "compiler" | "skills" | "dossier" | "contact";
type SystemId = "openevent" | "codelens" | "gogaa" | "rasad";
type RoleLens = "ai-lead" | "founder" | "devtools" | "architect";

const ease = [0.22, 1, 0.36, 1] as const;

const systems: Record<SystemId, {
  title: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  signal: string;
  line: string;
  accent: string;
}> = {
  openevent: {
    title: "OpenEvent",
    label: "email machine",
    icon: Mail,
    signal: "100+ clients",
    line: "Messy client emails become approved operations.",
    accent: "text-amber-300",
  },
  codelens: {
    title: "CodeLens",
    label: "PR scanner",
    icon: GitPullRequest,
    signal: "470 patterns",
    line: "Production bugs attach to exact lines before review.",
    accent: "text-sky-300",
  },
  gogaa: {
    title: "Gogaa",
    label: "terminal failover",
    icon: Terminal,
    signal: "11 providers",
    line: "Provider failure becomes a routing event, not a work stoppage.",
    accent: "text-emerald-300",
  },
  rasad: {
    title: "Rasad",
    label: "session radar",
    icon: Radar,
    signal: "656 sessions",
    line: "AI work turns into replayable evidence.",
    accent: "text-violet-300",
  },
};

const sceneCopy: Record<Scene, { eyebrow: string; title: string; agent: string }> = {
  boot: {
    eyebrow: "assembly preview",
    title: "The current boot becomes a world-building sequence.",
    agent: "I write the intro, then leave proof objects behind. The visitor does not hunt for sections.",
  },
  systems: {
    eyebrow: "living systems",
    title: "Projects stop being cards. They become machines the visitor can touch.",
    agent: "Move across the artifacts. I wake the system, narrate one idea, and let the proof run.",
  },
  compiler: {
    eyebrow: "career compiler",
    title: "Experience rearranges around the visitor's intent.",
    agent: "A recruiter, founder, and engineer should not see the same emphasis.",
  },
  skills: {
    eyebrow: "skill constellation",
    title: "Skills light up as consequences of systems, not badges.",
    agent: "When a project runs, its stack fires. The visitor understands what each tool did.",
  },
  dossier: {
    eyebrow: "generated dossier",
    title: "The CV becomes a profile compiled from behavior.",
    agent: "After enough inspection, I generate the most relevant version of the proof.",
  },
  contact: {
    eyebrow: "contact signal",
    title: "Contact appears as an earned conclusion, not a footer.",
    agent: "When there is enough signal, I recommend the next action.",
  },
};

export function LivingPortfolioMock(): React.ReactElement {
  const [scene, setScene] = useState<Scene>("systems");
  const [activeSystem, setActiveSystem] = useState<SystemId>("openevent");
  const [roleLens, setRoleLens] = useState<RoleLens>("devtools");
  const [approved, setApproved] = useState(false);
  const [provider, setProvider] = useState<"claude" | "gpt" | "groq">("groq");
  const [replayStep, setReplayStep] = useState(3);

  const active = systems[activeSystem];
  const ActiveIcon = active.icon;

  const signal = useMemo(() => {
    if (scene === "systems") return `${active.title} awakened`;
    if (scene === "compiler") return `${roleLens.replace("-", " ")} lens`;
    if (scene === "skills") return `${active.title} stack firing`;
    if (scene === "dossier") return "profile compiled";
    if (scene === "contact") return "high-intent visit";
    return "boot assembly";
  }, [active.title, roleLens, scene]);

  return (
    <main className="min-h-dvh overflow-hidden bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none opacity-[0.18]" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </div>

      <div className="relative min-h-dvh px-4 py-4 md:px-6 md:py-5">
        <MockTopBar signal={signal} />

        <div className="mt-5 grid min-h-[calc(100dvh-96px)] grid-cols-1 gap-4">
          <SceneRail active={scene} onChange={setScene} />

          <section className="relative overflow-hidden rounded-lg border border-card-border bg-card/40">
            <SceneHeader scene={scene} />
            <AnimatePresence mode="wait">
              {scene === "boot" && (
                <BootAssembly key="boot" onWake={() => setScene("systems")} />
              )}
              {scene === "systems" && (
                <SystemStage
                  key="systems"
                  activeSystem={activeSystem}
                  setActiveSystem={setActiveSystem}
                  approved={approved}
                  setApproved={setApproved}
                  provider={provider}
                  setProvider={setProvider}
                  replayStep={replayStep}
                  setReplayStep={setReplayStep}
                />
              )}
              {scene === "compiler" && (
                <CareerCompiler key="compiler" roleLens={roleLens} setRoleLens={setRoleLens} />
              )}
              {scene === "skills" && (
                <SkillConstellation key="skills" activeSystem={activeSystem} setActiveSystem={setActiveSystem} />
              )}
              {scene === "dossier" && (
                <DossierScene key="dossier" activeSystem={activeSystem} roleLens={roleLens} />
              )}
              {scene === "contact" && (
                <ContactSignal key="contact" />
              )}
            </AnimatePresence>
          </section>

          <AgentConductor scene={scene} activeSystem={activeSystem} roleLens={roleLens} onScene={setScene} />
        </div>
      </div>

      <div className="grain-overlay" aria-hidden="true" />
    </main>
  );
}

function MockTopBar({ signal }: { signal: string }): React.ReactElement {
  return (
    <header className="relative z-20 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 font-mono text-small">
        <span className="text-accent">&gt;</span>
        <span className="font-semibold">ahtesham</span>
        <span className="text-muted/60">.dev</span>
        <span className="hidden text-muted/30 sm:inline">| living mock</span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-card-border bg-card/70 px-3 py-2 font-mono text-caption text-muted/80">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-status opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-status" />
        </span>
        {signal}
      </div>
    </header>
  );
}

function SceneRail({ active, onChange }: { active: Scene; onChange: (scene: Scene) => void }): React.ReactElement {
  const items: { id: Scene; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
    { id: "boot", icon: Sparkles, label: "Boot" },
    { id: "systems", icon: Network, label: "Systems" },
    { id: "compiler", icon: BriefcaseBusiness, label: "Compiler" },
    { id: "skills", icon: CircleDot, label: "Skills" },
    { id: "dossier", icon: FileText, label: "Dossier" },
    { id: "contact", icon: Send, label: "Signal" },
  ];
  return (
    <nav className="relative z-10 flex items-center gap-2 overflow-x-auto rounded-lg border border-card-border bg-card/40 p-2">
      {items.map((item) => {
        const Icon = item.icon;
        const selected = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`group relative flex h-12 min-w-12 items-center justify-center rounded-lg border transition-all ${
              selected
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-transparent text-muted/60 hover:border-card-border hover:bg-card-hover hover:text-foreground"
            }`}
            aria-label={item.label}
          >
            <Icon size={18} />
            <span className="pointer-events-none absolute left-1/2 top-14 z-20 hidden -translate-x-1/2 rounded-md border border-card-border bg-card px-2 py-1 font-mono text-caption text-foreground opacity-0 shadow-xl transition-opacity group-hover:opacity-100 md:block">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function SceneHeader({ scene }: { scene: Scene }): React.ReactElement {
  const copy = sceneCopy[scene];
  return (
    <div className="relative z-10 grid gap-4 border-b border-card-border px-4 py-4 md:grid-cols-[minmax(0,1fr)_360px] md:px-6">
      <div>
        <p className="font-mono text-caption uppercase tracking-[0.28em] text-accent">{copy.eyebrow}</p>
        <h1 className="mt-2 max-w-3xl text-balance text-2xl font-bold leading-tight md:text-4xl">
          {copy.title}
        </h1>
      </div>
      <div className="flex items-start gap-3 rounded-lg border border-card-border bg-background/40 p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-status/30 bg-green-500/5 text-accent-status">
          <Bot size={18} />
        </div>
        <p className="text-small leading-relaxed text-muted">
          <span className="font-mono text-caption text-accent-status">agent says</span>
          <br />
          {copy.agent}
        </p>
      </div>
    </div>
  );
}

function BootAssembly({ onWake }: { onWake: () => void }): React.ReactElement {
  const artifacts = [
    ["email stack", "OpenEvent"],
    ["pull request", "CodeLens"],
    ["terminal", "Gogaa"],
    ["radar map", "Rasad"],
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease }}
      className="relative min-h-[560px] px-5 py-8 md:px-8"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="font-mono text-caption text-accent-status">boot particles / materialize hero</div>
        <div className="mt-8 text-4xl font-bold leading-tight md:text-6xl">
          I&apos;m Ahtesham.
          <br />
          <span className="text-gradient">I ship AI products</span>
          <br />
          that don&apos;t break.
        </div>
        <div className="relative mt-10 h-44 w-full max-w-3xl">
          <motion.div
            className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent-status/30 bg-green-500/5 shadow-[0_0_60px_rgba(74,222,128,0.16)]"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Bot className="text-accent-status" size={34} />
          </motion.div>
          {artifacts.map(([label, title], index) => {
            const positions = [
              "left-[2%] top-[5%]",
              "right-[2%] top-[5%]",
              "left-[8%] bottom-[0%]",
              "right-[8%] bottom-[0%]",
            ];
            return (
              <motion.div
                key={title}
                className={`absolute ${positions[index]} w-36 rounded-lg border border-card-border bg-card/80 px-3 py-3 text-left`}
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.14, duration: 0.45, ease }}
              >
                <p className="font-mono text-caption text-muted/60">{label}</p>
                <p className="mt-1 text-small font-semibold">{title}</p>
              </motion.div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onWake}
          className="mt-8 inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2.5 font-mono text-small text-accent transition hover:bg-accent/15"
        >
          wake the living stage <ArrowRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}

function SystemStage({
  activeSystem,
  setActiveSystem,
  approved,
  setApproved,
  provider,
  setProvider,
  replayStep,
  setReplayStep,
}: {
  activeSystem: SystemId;
  setActiveSystem: (id: SystemId) => void;
  approved: boolean;
  setApproved: (value: boolean) => void;
  provider: "claude" | "gpt" | "groq";
  setProvider: (value: "claude" | "gpt" | "groq") => void;
  replayStep: number;
  setReplayStep: (value: number) => void;
}): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease }}
      className="grid gap-4 p-4 md:p-6"
    >
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {(Object.keys(systems) as SystemId[]).map((id) => (
          <ArtifactButton key={id} id={id} active={activeSystem === id} onSelect={setActiveSystem} />
        ))}
      </div>
      <div className="relative overflow-hidden rounded-lg border border-card-border bg-background/45">
        <AnimatePresence mode="wait">
          {activeSystem === "openevent" && <OpenEventMachine key="openevent" approved={approved} setApproved={setApproved} />}
          {activeSystem === "codelens" && <CodeLensMachine key="codelens" />}
          {activeSystem === "gogaa" && <GogaaMachine key="gogaa" provider={provider} setProvider={setProvider} />}
          {activeSystem === "rasad" && <RasadMachine key="rasad" replayStep={replayStep} setReplayStep={setReplayStep} />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ArtifactButton({
  id,
  active,
  onSelect,
}: {
  id: SystemId;
  active: boolean;
  onSelect: (id: SystemId) => void;
}): React.ReactElement {
  const system = systems[id];
  const Icon = system.icon;
  return (
    <button
      type="button"
      onMouseEnter={() => onSelect(id)}
      onFocus={() => onSelect(id)}
      onClick={() => onSelect(id)}
      className={`group relative min-h-24 rounded-lg border p-3 text-left transition-all ${
        active
          ? "border-accent/40 bg-accent/[0.08] shadow-[0_0_40px_rgba(160,120,104,0.09)]"
          : "border-card-border bg-card/50 hover:bg-card-hover"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`rounded-lg border border-card-border bg-background/50 p-2 ${active ? system.accent : "text-muted/70"}`}>
          <Icon size={18} />
        </div>
        <span className="font-mono text-caption text-muted/50">{system.signal}</span>
      </div>
      <p className="mt-3 font-mono text-caption uppercase tracking-wider text-muted/60">{system.label}</p>
      <h2 className="mt-1 text-base font-bold">{system.title}</h2>
      <p className="mt-1 line-clamp-1 text-small leading-snug text-muted">{system.line}</p>
      {active && <span className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-accent-status shadow-[0_0_14px_rgba(74,222,128,0.8)]" />}
    </button>
  );
}

function SceneShell({
  title,
  line,
  children,
}: {
  title: string;
  line: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.28, ease }}
      className="p-4 md:p-5"
    >
      <div className="flex flex-col gap-2 border-b border-card-border pb-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-caption uppercase tracking-[0.22em] text-accent">living project machine</p>
          <h2 className="mt-1 text-2xl font-bold md:text-3xl">{title}</h2>
        </div>
        <p className="max-w-md text-small leading-relaxed text-muted md:text-right">{line}</p>
      </div>
      {children}
    </motion.div>
  );
}

function OpenEventMachine({ approved, setApproved }: { approved: boolean; setApproved: (value: boolean) => void }): React.ReactElement {
  return (
    <SceneShell title="OpenEvent" line="The visitor processes one messy email and sees why the approval gate exists.">
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_140px_1fr]">
        <div className="rounded-lg border border-card-border bg-card/55 p-4">
          <div className="mb-3 flex items-center gap-2 font-mono text-caption text-muted/70">
            <Mail size={14} /> incoming email
          </div>
          <p className="text-small leading-relaxed text-foreground/85">
            Need a venue for 120 guests next Friday. Client wants invoice split 60/40, vegetarian menu, and a soft hold until Monday.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent"
          >
            <ArrowRight size={18} />
          </motion.div>
        </div>
        <div className="rounded-lg border border-card-border bg-card/55 p-4">
          <div className="mb-3 flex items-center gap-2 font-mono text-caption text-muted/70">
            <Sparkles size={14} /> extracted plan
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["120 guests", "next Friday", "60/40 invoice", "veg menu", "soft hold", "approval needed"].map((item) => (
              <span key={item} className="rounded-md border border-accent/20 bg-accent/[0.06] px-2 py-1.5 font-mono text-caption text-accent/85">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-card-border bg-background/50 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-caption uppercase tracking-wider text-accent">approval gate</p>
            <p className="mt-1 text-small text-muted">The portfolio teaches the architectural choice by making the visitor choose.</p>
          </div>
          <button
            type="button"
            onClick={() => setApproved(!approved)}
            className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 font-mono text-small transition ${
              approved ? "border-accent-status/40 bg-green-500/10 text-accent-status" : "border-accent/30 bg-accent/10 text-accent"
            }`}
          >
            {approved ? <Check size={15} /> : <CalendarCheck size={15} />}
            {approved ? "approved: CRM + invoice queued" : "approve AI plan"}
          </button>
        </div>
      </div>
    </SceneShell>
  );
}

function CodeLensMachine(): React.ReactElement {
  return (
    <SceneShell title="CodeLens" line="The visitor watches a bug get detected in-place, like the product is reviewing its own mock PR.">
      <div className="mt-6 overflow-hidden rounded-lg border border-card-border bg-[#090a0d] font-mono">
        <div className="flex items-center gap-2 border-b border-card-border px-4 py-3 text-caption text-muted/70">
          <GitPullRequest size={14} className="text-accent-status" />
          feat: add payment dashboard
          <span className="ml-auto">scan: 113ms</span>
        </div>
        <div className="relative p-4 text-small">
          <motion.div
            className="absolute left-0 right-0 h-8 bg-sky-400/10"
            animate={{ top: ["56px", "152px", "56px"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {[
            "const html = req.body.content;",
            "const clean = html;",
            "<div dangerouslySetInnerHTML={{ __html: clean }} />",
            "await supabase.from('payments').select('*');",
          ].map((line, index) => (
            <div key={line} className={`relative flex gap-4 py-2 ${index === 2 ? "text-amber-200" : "text-foreground/75"}`}>
              <span className="w-6 text-right text-muted/40">{17 + index}</span>
              <code>{line}</code>
              {index === 2 && <span className="ml-auto rounded-md border border-amber-300/25 bg-amber-300/10 px-2 py-0.5 text-caption text-amber-200">CWE-79</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {["2 critical findings", "470 patterns loaded", "risk score 5/10"].map((item) => (
          <div key={item} className="rounded-lg border border-card-border bg-card/55 px-4 py-3 font-mono text-small text-muted/85">
            <ScanLine className="mb-2 text-sky-300" size={16} />
            {item}
          </div>
        ))}
      </div>
    </SceneShell>
  );
}

function GogaaMachine({
  provider,
  setProvider,
}: {
  provider: "claude" | "gpt" | "groq";
  setProvider: (value: "claude" | "gpt" | "groq") => void;
}): React.ReactElement {
  const providers = [
    { id: "claude" as const, label: "Claude", state: "timeout" },
    { id: "gpt" as const, label: "GPT", state: "rate limited" },
    { id: "groq" as const, label: "Groq", state: "streaming" },
  ];
  return (
    <SceneShell title="Gogaa" line="The visitor can break providers and see work continue through automatic fallback.">
      <div className="mt-6 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="space-y-3">
          {providers.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setProvider(item.id)}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition ${
                provider === item.id ? "border-accent-status/40 bg-green-500/10" : "border-card-border bg-card/55 hover:bg-card-hover"
              }`}
            >
              <span>
                <span className="block font-semibold">{item.label}</span>
                <span className="font-mono text-caption text-muted/60">{item.state}</span>
              </span>
              <Zap className={provider === item.id ? "text-accent-status" : "text-muted/40"} size={16} />
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded-lg border border-card-border bg-[#08090b] font-mono">
          <div className="border-b border-card-border px-4 py-3 text-caption text-muted/70">gogaa · provider={provider}</div>
          <div className="space-y-2 p-4 text-small">
            <p><span className="text-accent">&gt;</span> add auth middleware to /api routes</p>
            <p className="text-red-300/80">claude: timeout after 30s</p>
            <p className="text-amber-200/80">gpt: rate limit reached</p>
            <p className="text-accent-status">groq: stream resumed</p>
            <p className="text-muted/70">Reading src/api/routes.ts...</p>
            <p className="text-accent-status">✓ Edit middleware.ts (+24 -2)</p>
            <p className="text-accent-status">✓ 1,418 tests passing</p>
          </div>
        </div>
      </div>
    </SceneShell>
  );
}

function RasadMachine({
  replayStep,
  setReplayStep,
}: {
  replayStep: number;
  setReplayStep: (value: number) => void;
}): React.ReactElement {
  const steps = ["prompt", "read", "edit", "test", "fail", "retry", "pass"];
  return (
    <SceneShell title="Rasad" line="The visitor scrubs an AI session instead of reading an observability description.">
      <div className="mt-6 rounded-lg border border-card-border bg-card/55 p-4">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="font-mono text-caption uppercase tracking-wider text-violet-300">session replay</p>
          <p className="font-mono text-caption text-muted/60">grade: B+</p>
        </div>
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          value={replayStep}
          onChange={(event) => setReplayStep(Number(event.target.value))}
          className="w-full accent-[var(--accent)]"
          aria-label="Session replay position"
        />
        <div className="mt-4 grid grid-cols-7 gap-2">
          {steps.map((step, index) => (
            <div key={step} className={`rounded-md border px-2 py-3 text-center font-mono text-caption ${index <= replayStep ? "border-violet-300/35 bg-violet-400/10 text-violet-200" : "border-card-border text-muted/45"}`}>
              {step}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {["42 tool calls", "8 files touched", "31k tokens", "zero outbound"].map((metric) => (
          <div key={metric} className="rounded-lg border border-card-border bg-background/45 px-4 py-4 font-mono text-small text-muted/85">
            {metric}
          </div>
        ))}
      </div>
    </SceneShell>
  );
}

function CareerCompiler({
  roleLens,
  setRoleLens,
}: {
  roleLens: RoleLens;
  setRoleLens: (lens: RoleLens) => void;
}): React.ReactElement {
  const lenses: { id: RoleLens; label: string; proof: string[] }[] = [
    { id: "ai-lead", label: "AI Lead", proof: ["OpenEvent roadmap", "100+ clients", "AI approval systems"] },
    { id: "founder", label: "Founder", proof: ["Wadware delivery", "client scoping", "product ownership"] },
    { id: "devtools", label: "DevTools Builder", proof: ["CodeLens", "Gogaa", "Rasad"] },
    { id: "architect", label: "Automation Architect", proof: ["workflow engines", "pgvector", "systems design"] },
  ];
  const selected = lenses.find((lens) => lens.id === roleLens) ?? lenses[2];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease }} className="p-4 md:p-6">
      <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-3">
          {lenses.map((lens) => (
            <button
              key={lens.id}
              type="button"
              onMouseEnter={() => setRoleLens(lens.id)}
              onClick={() => setRoleLens(lens.id)}
              className={`w-full rounded-lg border px-4 py-4 text-left transition ${roleLens === lens.id ? "border-accent/40 bg-accent/10" : "border-card-border bg-card/50 hover:bg-card-hover"}`}
            >
              <span className="font-semibold">{lens.label}</span>
              <span className="mt-1 block font-mono text-caption text-muted/60">compile lens</span>
            </button>
          ))}
        </div>
        <div className="rounded-lg border border-card-border bg-background/45 p-5">
          <p className="font-mono text-caption uppercase tracking-[0.25em] text-accent">compiled output</p>
          <h2 className="mt-3 text-3xl font-bold">{selected.label}</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {selected.proof.map((proof, index) => (
              <motion.div
                key={proof}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                className="rounded-lg border border-card-border bg-card/60 p-4"
              >
                <p className="font-mono text-caption text-muted/50">0{index + 1}</p>
                <p className="mt-3 text-lg font-semibold">{proof}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-accent/20 bg-accent/[0.05] p-4 text-small leading-relaxed text-muted">
            The same experience content is preserved, but it rearranges by visitor intent instead of forcing a chronological read.
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SkillConstellation({
  activeSystem,
  setActiveSystem,
}: {
  activeSystem: SystemId;
  setActiveSystem: (id: SystemId) => void;
}): React.ReactElement {
  const map: Record<SystemId, string[]> = {
    openevent: ["Supabase", "pgvector", "Stripe", "OpenAI", "workflow engine", "audit logs"],
    codelens: ["TypeScript AST", "taint tracking", "Docker", "GitHub Actions", "CWE", "pattern mining"],
    gogaa: ["React Ink", "provider routing", "WAL", "tool calls", "streaming", "tests"],
    rasad: ["SQLite", "session parser", "token ledger", "quality grade", "replay", "local API"],
  };
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease }} className="p-4 md:p-6">
      <div className="mb-5 flex flex-wrap gap-2">
        {(Object.keys(systems) as SystemId[]).map((id) => (
          <button key={id} type="button" onClick={() => setActiveSystem(id)} className={`rounded-lg border px-3 py-2 font-mono text-caption transition ${activeSystem === id ? "border-accent/40 bg-accent/10 text-accent" : "border-card-border bg-card/50 text-muted/70"}`}>
            {systems[id].title}
          </button>
        ))}
      </div>
      <div className="relative min-h-[430px] rounded-lg border border-card-border bg-background/45 p-5">
        <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-center font-mono text-small text-accent">
          {systems[activeSystem].title}
        </div>
        {map[activeSystem].map((skill, index) => {
          const angle = (index / map[activeSystem].length) * Math.PI * 2;
          const x = Math.cos(angle) * 37 + 50;
          const y = Math.sin(angle) * 32 + 50;
          return (
            <motion.div
              key={skill}
              className="absolute rounded-lg border border-card-border bg-card px-3 py-2 font-mono text-caption text-foreground shadow-xl"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.06, duration: 0.3 }}
            >
              {skill}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function DossierScene({ activeSystem, roleLens }: { activeSystem: SystemId; roleLens: RoleLens }): React.ReactElement {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease }} className="p-4 md:p-6">
      <div className="rounded-lg border border-card-border bg-background/45 p-5 md:p-6">
        <p className="font-mono text-caption uppercase tracking-[0.25em] text-accent">generated dossier</p>
        <h2 className="mt-3 text-3xl font-bold">A profile compiled from the visit.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-card-border bg-card/55 p-4">
            <p className="font-mono text-caption text-muted/60">visitor inspected</p>
            <p className="mt-2 text-xl font-semibold">{systems[activeSystem].title}</p>
          </div>
          <div className="rounded-lg border border-card-border bg-card/55 p-4">
            <p className="font-mono text-caption text-muted/60">likely interest</p>
            <p className="mt-2 text-xl font-semibold">{roleLens.replace("-", " ")}</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-accent/20 bg-accent/[0.05] p-4">
          <p className="font-mono text-caption text-accent">strongest brief</p>
          <ul className="mt-3 space-y-2 text-small text-muted">
            <li>• Production AI systems with measurable adoption.</li>
            <li>• Devtools built from real workflow pain, not demo prompts.</li>
            <li>• Architecture decisions explained through interaction.</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function ContactSignal(): React.ReactElement {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease }} className="flex min-h-[520px] items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-2xl rounded-lg border border-card-border bg-background/50 p-6 text-center">
        <p className="font-mono text-caption uppercase tracking-[0.25em] text-accent-status">signal acquired</p>
        <h2 className="mt-4 text-3xl font-bold">The agent has enough evidence.</h2>
        <p className="mx-auto mt-3 max-w-md text-small leading-relaxed text-muted">
          The visitor inspected production proof, devtools, and architecture. Contact appears as the next logical state.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {["Book call", "Open dossier", "Ask final thing"].map((action) => (
            <button key={action} type="button" className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 font-mono text-small text-accent transition hover:bg-accent/15">
              {action}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AgentConductor({
  scene,
  activeSystem,
  roleLens,
  onScene,
}: {
  scene: Scene;
  activeSystem: SystemId;
  roleLens: RoleLens;
  onScene: (scene: Scene) => void;
}): React.ReactElement {
  const active = systems[activeSystem];
  const next: Record<Scene, Scene> = {
    boot: "systems",
    systems: "compiler",
    compiler: "skills",
    skills: "dossier",
    dossier: "contact",
    contact: "systems",
  };
  return (
    <aside className="relative z-10 rounded-lg border border-card-border bg-card/55 p-4">
      <div className="flex items-center gap-3 border-b border-card-border pb-4">
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-accent-status/30 bg-green-500/5 text-accent-status"
        >
          <Bot size={26} />
        </motion.div>
        <div>
          <p className="font-mono text-caption text-accent-status">agent online</p>
          <p className="text-small font-semibold">conductor mode</p>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-card-border bg-background/45 p-4">
        <p className="font-mono text-caption uppercase tracking-wider text-muted/60">agent says</p>
        <p className="mt-2 text-small leading-relaxed text-foreground/85">{sceneCopy[scene].agent}</p>
      </div>
      <div className="mt-4 space-y-2 font-mono text-caption text-muted/70">
        <div className="flex items-center justify-between gap-3 rounded-md border border-card-border bg-background/30 px-3 py-2">
          <span>active system</span>
          <span className={active.accent}>{active.title}</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-md border border-card-border bg-background/30 px-3 py-2">
          <span>role lens</span>
          <span className="text-foreground">{roleLens.replace("-", " ")}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onScene(next[scene])}
        className="mt-5 flex w-full items-center justify-between rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 font-mono text-small text-accent transition hover:bg-accent/15"
      >
        advance scene <ChevronRight size={16} />
      </button>
      <div className="mt-5 border-t border-card-border pt-4">
        <p className="font-mono text-caption uppercase tracking-wider text-muted/50">prototype rule</p>
        <p className="mt-2 text-small leading-relaxed text-muted">
          No main scroll. No modal-first project reading. The visitor touches living objects and the agent drives the sequence.
        </p>
      </div>
    </aside>
  );
}
