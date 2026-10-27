"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CalendarCheck,
  Check,
  Code2,
  FileText,
  GitPullRequest,
  Mail,
  Moon,
  Radar,
  RefreshCcw,
  ScanLine,
  Send,
  Settings,
  Terminal,
  Zap,
} from "lucide-react";

type Moment = "hero" | "touch" | "openevent" | "codelens" | "gogaa" | "rasad" | "career" | "dossier";

const momentOrder: Moment[] = ["hero", "touch", "openevent", "codelens", "gogaa", "rasad", "career", "dossier"];
const ease = [0.22, 1, 0.36, 1] as const;

const momentCopy: Record<Moment, { label: string; agent: string; hint: string }> = {
  hero: {
    label: "01 / current boot, upgraded",
    agent: "I write the hero, assemble the agent, then wake the terminal. No section hunt.",
    hint: "Click the terminal to see the first after-interaction state.",
  },
  touch: {
    label: "02 / terminal becomes the door",
    agent: "This is the key change: the existing code preview is no longer decoration. It is the object visitors touch.",
    hint: "Choose a living signal around the terminal.",
  },
  openevent: {
    label: "03 / OpenEvent after touch",
    agent: "The terminal becomes an email operations machine. The visitor learns the trust boundary by approving the plan.",
    hint: "Approve the AI plan, then continue.",
  },
  codelens: {
    label: "04 / CodeLens after touch",
    agent: "The page turns into a PR scanner. The project proves itself by finding the bug inline.",
    hint: "Run the scanner and patch the issue.",
  },
  gogaa: {
    label: "05 / Gogaa after touch",
    agent: "The visitor breaks providers. The work continues. That explains the product better than a paragraph.",
    hint: "Tap a provider failure and watch the route continue.",
  },
  rasad: {
    label: "06 / Rasad after touch",
    agent: "Instead of describing observability, the visitor scrubs an AI session.",
    hint: "Scrub the timeline.",
  },
  career: {
    label: "07 / career without timeline scrolling",
    agent: "Experience compiles around intent. Same facts, different emphasis.",
    hint: "Switch the lens.",
  },
  dossier: {
    label: "08 / contact becomes a conclusion",
    agent: "After enough interaction, I generate the brief and recommend the next action.",
    hint: "This replaces a normal footer CTA.",
  },
};

const livingSignals: { id: Moment; label: string; icon: ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "openevent", label: "email flow", icon: Mail },
  { id: "codelens", label: "PR scanner", icon: GitPullRequest },
  { id: "gogaa", label: "failover terminal", icon: Terminal },
  { id: "rasad", label: "session radar", icon: Radar },
];

export function LivingHomeStoryboard({ initialMoment = "hero" }: { initialMoment?: Moment }): React.ReactElement {
  const [moment, setMoment] = useState<Moment>(initialMoment);
  const [approved, setApproved] = useState(false);
  const [patched, setPatched] = useState(false);
  const [provider, setProvider] = useState<"claude" | "gpt" | "groq">("claude");
  const [replay, setReplay] = useState(3);
  const [lens, setLens] = useState<"ai" | "devtools" | "founder">("devtools");

  const index = momentOrder.indexOf(moment);
  const copy = momentCopy[moment];

  useEffect(() => {
    const state = new URLSearchParams(window.location.search).get("state");
    if (momentOrder.includes(state as Moment)) {
      setMoment(state as Moment);
    }
  }, []);

  const next = (): void => setMoment(momentOrder[(index + 1) % momentOrder.length]);
  const prev = (): void => setMoment(momentOrder[(index - 1 + momentOrder.length) % momentOrder.length]);

  return (
    <main className="min-h-dvh overflow-hidden bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.16] bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute left-1/2 top-0 h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-accent/[0.045] blur-3xl" />
      </div>

      <div className="relative min-h-dvh px-4 py-4 md:px-6">
        <TopChrome label={copy.label} />
        <SideSignals moment={moment} onMoment={setMoment} />

        <section className="relative mx-auto flex min-h-[calc(100dvh-86px)] max-w-7xl flex-col pt-10 md:pt-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <HeroCopy dimmed={moment !== "hero" && moment !== "touch"} />
            <AgentPanel copy={copy.agent} hint={copy.hint} onNext={next} onPrev={prev} />
          </div>

          <div className="relative mt-7 flex flex-1 items-center">
            <AnimatePresence mode="wait">
              {(moment === "hero" || moment === "touch") && (
                <HomeTerminal
                  key={moment}
                  moment={moment}
                  onTouch={() => setMoment(moment === "hero" ? "touch" : "openevent")}
                  onSignal={setMoment}
                />
              )}
              {moment === "openevent" && (
                <OpenEventState key="openevent" approved={approved} onApprove={() => setApproved(true)} onNext={() => setMoment("codelens")} />
              )}
              {moment === "codelens" && (
                <CodeLensState key="codelens" patched={patched} onPatch={() => setPatched(true)} onNext={() => setMoment("gogaa")} />
              )}
              {moment === "gogaa" && (
                <GogaaState key="gogaa" provider={provider} onProvider={setProvider} onNext={() => setMoment("rasad")} />
              )}
              {moment === "rasad" && (
                <RasadState key="rasad" replay={replay} onReplay={setReplay} onNext={() => setMoment("career")} />
              )}
              {moment === "career" && (
                <CareerState key="career" lens={lens} onLens={setLens} onNext={() => setMoment("dossier")} />
              )}
              {moment === "dossier" && (
                <DossierState key="dossier" lens={lens} />
              )}
            </AnimatePresence>
          </div>

          <StoryboardScrubber moment={moment} onMoment={setMoment} />
        </section>
      </div>
      <div className="grain-overlay" aria-hidden="true" />
    </main>
  );
}

function TopChrome({ label }: { label: string }): React.ReactElement {
  return (
    <header className="relative z-30 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 font-mono text-small">
        <span className="text-accent">&gt;</span>
        <span className="font-semibold">ahtesham</span>
        <span className="text-muted/60">.dev</span>
        <span className="hidden text-muted/35 md:inline">| future home mock</span>
      </div>
      <div className="hidden items-center gap-3 md:flex">
        <span className="rounded-lg border border-card-border bg-card/50 px-3 py-2 font-mono text-caption text-muted/70">
          {label}
        </span>
        <button type="button" className="rounded-lg border border-card-border bg-card/50 p-2 text-muted/70">
          <RefreshCcw size={15} />
        </button>
        <button type="button" className="rounded-lg border border-card-border bg-card/50 p-2 text-muted/70">
          <Settings size={15} />
        </button>
        <button type="button" className="rounded-lg border border-card-border bg-card/50 p-2 text-muted/70">
          <Moon size={15} />
        </button>
      </div>
    </header>
  );
}

function SideSignals({ moment, onMoment }: { moment: Moment; onMoment: (moment: Moment) => void }): React.ReactElement {
  const items: { id: Moment; icon: ComponentType<{ size?: number }>; label: string }[] = [
    { id: "hero", icon: Bot, label: "hero" },
    { id: "openevent", icon: Mail, label: "OpenEvent" },
    { id: "codelens", icon: GitPullRequest, label: "CodeLens" },
    { id: "gogaa", icon: Terminal, label: "Gogaa" },
    { id: "rasad", icon: Radar, label: "Rasad" },
    { id: "career", icon: BriefcaseBusiness, label: "career" },
    { id: "dossier", icon: Send, label: "signal" },
  ];
  return (
    <nav className="fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex">
      <div className="absolute bottom-0 top-0 w-px bg-gradient-to-b from-transparent via-card-border to-transparent" />
      {items.map((item) => {
        const Icon = item.icon;
        const active = moment === item.id || (moment === "touch" && item.id === "hero");
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onMoment(item.id)}
            aria-label={item.label}
            className={`relative flex h-10 w-10 items-center justify-center rounded-lg border transition ${
              active ? "border-accent/40 bg-accent/15 text-accent" : "border-transparent bg-background/30 text-muted/35 hover:text-muted"
            }`}
          >
            <Icon size={15} />
            {active && <span className="absolute -bottom-3 h-1.5 w-1.5 rounded-full bg-accent-status shadow-[0_0_14px_rgba(74,222,128,0.85)]" />}
          </button>
        );
      })}
    </nav>
  );
}

function HeroCopy({ dimmed }: { dimmed: boolean }): React.ReactElement {
  return (
    <motion.div
      animate={{ opacity: dimmed ? 0.32 : 1, y: dimmed ? -8 : 0, filter: dimmed ? "blur(1.5px)" : "blur(0px)" }}
      transition={{ duration: 0.35, ease }}
      className="pl-0 md:pl-20"
    >
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/25 bg-green-500/10 px-3 py-1.5 font-mono text-caption text-green-300">
        <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
        Open to opportunities
      </div>
      <h1 className="max-w-4xl text-balance text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
        I architect <span className="text-gradient">AI systems</span> and ship them to production.
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
        The new version keeps this exact hero language, but the code preview below becomes the living object visitors interact with.
      </p>
    </motion.div>
  );
}

function AgentPanel({
  copy,
  hint,
  onNext,
  onPrev,
}: {
  copy: string;
  hint: string;
  onNext: () => void;
  onPrev: () => void;
}): React.ReactElement {
  return (
    <div className="relative z-20 ml-auto w-full max-w-[360px]">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ scale: [1, 1.035, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-green-400/30 bg-green-400/5 shadow-[0_0_46px_rgba(74,222,128,0.15)]"
        >
          <Bot size={30} className="text-green-300" />
        </motion.div>
        <div className="min-w-0">
          <p className="font-mono text-caption text-green-300">agent online</p>
          <p className="mt-1 text-small leading-relaxed text-muted">{copy}</p>
        </div>
      </div>
      <div className="mt-4 border-l border-accent/30 pl-4">
        <p className="font-mono text-caption uppercase tracking-wider text-accent">interaction instruction</p>
        <p className="mt-1 text-small text-foreground/80">{hint}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={onPrev} className="rounded-lg border border-card-border bg-card/50 px-3 py-2 font-mono text-caption text-muted hover:text-foreground">
          prev state
        </button>
        <button type="button" onClick={onNext} className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 font-mono text-caption text-accent hover:bg-accent/15">
          next state
        </button>
      </div>
    </div>
  );
}

function HomeTerminal({
  moment,
  onTouch,
  onSignal,
}: {
  moment: "hero" | "touch";
  onTouch: () => void;
  onSignal: (moment: Moment) => void;
}): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.42, ease }}
      className="relative mx-auto w-full max-w-5xl md:ml-20 md:mr-auto"
    >
      <AnimatePresence>
        {moment === "touch" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute -inset-10"
          >
            {livingSignals.map((signal, index) => {
              const Icon = signal.icon;
              const positions = [
                "left-[4%] top-[-36px]",
                "right-[8%] top-[-34px]",
                "left-[16%] bottom-[-40px]",
                "right-[12%] bottom-[-40px]",
              ];
              return (
                <button
                  key={signal.id}
                  type="button"
                  onClick={() => onSignal(signal.id)}
                  className={`pointer-events-auto absolute ${positions[index]} flex items-center gap-2 rounded-full border border-card-border bg-background/85 px-3 py-2 font-mono text-caption text-muted/80 backdrop-blur transition hover:border-accent/35 hover:text-accent`}
                >
                  <Icon size={13} />
                  {signal.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={onTouch}
        onMouseEnter={() => moment === "hero" && onTouch()}
        className="group relative block w-full overflow-hidden rounded-xl border border-card-border bg-[#111218]/90 text-left shadow-2xl shadow-background/40 transition hover:border-accent/35"
      >
        <div className="flex items-center gap-2 border-b border-card-border bg-background/40 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/65" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/65" />
          <span className="h-3 w-3 rounded-full bg-green-500/65" />
          <span className="ml-3 font-mono text-caption text-muted/60">openevent.pipeline.ts</span>
          <span className="ml-auto hidden font-mono text-caption text-accent md:inline">
            {moment === "touch" ? "living signals unlocked" : "touch to wake"}
          </span>
        </div>
        <div className="relative min-h-[280px] p-6 font-mono text-small leading-7">
          <motion.div
            className="absolute inset-x-0 top-20 h-10 bg-accent/5"
            animate={{ opacity: [0.25, 0.8, 0.25] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="text-muted/45">1&nbsp;&nbsp;// this terminal becomes the portfolio</p>
          <p><span className="text-accent">export const</span> systems = [</p>
          <p className="pl-6 text-foreground/80">&quot;OpenEvent&quot;, &quot;CodeLens&quot;, &quot;Gogaa&quot;, &quot;Rasad&quot;</p>
          <p>]</p>
          <p className="mt-3"><span className="text-accent-secondary">agent</span>.<span className="text-foreground">onTouch</span>(&quot;terminal&quot;, () =&gt; &#123;</p>
          <p className="pl-6 text-green-300/80">materializeProofObject()</p>
          <p className="pl-6 text-green-300/80">replaceScrollWithInteraction()</p>
          <p>&#125;)</p>
          <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between border-t border-card-border pt-4 font-mono text-caption text-muted/60">
            <span className="text-accent-status">● agent attached</span>
            <span className="group-hover:text-accent">click / hover terminal</span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

function LivingFrame({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.985 }}
      transition={{ duration: 0.42, ease }}
      className="relative mx-auto w-full max-w-6xl md:ml-20 md:mr-auto"
    >
      <div className="overflow-hidden rounded-xl border border-card-border bg-[#101116]/92 shadow-2xl shadow-background/40">
        <div className="flex items-center gap-2 border-b border-card-border bg-background/40 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/65" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/65" />
          <span className="h-3 w-3 rounded-full bg-green-500/65" />
          <span className="ml-3 font-mono text-caption text-muted/60">{eyebrow}</span>
          <div className="ml-auto">{action}</div>
        </div>
        <div className="p-5 md:p-6">
          <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function OpenEventState({ approved, onApprove, onNext }: { approved: boolean; onApprove: () => void; onNext: () => void }): React.ReactElement {
  return (
    <LivingFrame
      eyebrow="openevent.pipeline.live"
      title="A messy client email becomes an approved operation."
      action={<button type="button" onClick={onNext} className="font-mono text-caption text-accent">next proof</button>}
    >
      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_120px_1fr]">
        <div className="min-h-40 border-l border-card-border pl-4">
          <p className="font-mono text-caption uppercase tracking-wider text-muted/55">incoming email</p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-foreground/85">
            Need a venue for 120 guests next Friday. Split invoice 60/40, vegetarian menu, soft hold until Monday.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
            <ArrowRight size={20} />
          </motion.div>
        </div>
        <div>
          <p className="font-mono text-caption uppercase tracking-wider text-muted/55">AI extracted plan</p>
          <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-small">
            {["120 guests", "next Friday", "60/40 invoice", "veg menu", "soft hold", "approval needed"].map((item) => (
              <span key={item} className="border border-accent/20 bg-accent/[0.055] px-3 py-2 text-accent/85">{item}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 border-t border-card-border pt-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-caption uppercase tracking-wider text-accent">the interaction</p>
          <p className="mt-1 text-small text-muted">Visitor clicks approve. Calendar, invoice, CRM and reply light up in the same terminal.</p>
        </div>
        <button
          type="button"
          onClick={onApprove}
          className={`inline-flex items-center gap-2 border px-4 py-2.5 font-mono text-small transition ${approved ? "border-green-400/35 bg-green-400/10 text-green-300" : "border-accent/35 bg-accent/10 text-accent"}`}
        >
          {approved ? <Check size={15} /> : <CalendarCheck size={15} />}
          {approved ? "approved -> systems executed" : "approve AI plan"}
        </button>
      </div>
      {approved && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid grid-cols-4 gap-2 font-mono text-caption text-green-300">
          {["calendar", "invoice", "CRM", "reply"].map((item) => <span key={item} className="border border-green-400/20 bg-green-400/10 px-3 py-2 text-center">{item}</span>)}
        </motion.div>
      )}
    </LivingFrame>
  );
}

function CodeLensState({ patched, onPatch, onNext }: { patched: boolean; onPatch: () => void; onNext: () => void }): React.ReactElement {
  return (
    <LivingFrame eyebrow="codelens.pr.scan" title="The project demonstrates itself by finding the bug inline." action={<button type="button" onClick={onNext} className="font-mono text-caption text-accent">next proof</button>}>
      <div className="relative mt-5 overflow-hidden border border-card-border bg-background/55 p-4 font-mono text-small">
        <motion.div className="absolute left-0 right-0 h-9 bg-sky-400/10" animate={{ top: ["62px", "150px", "62px"] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
        {[
          "const html = req.body.content;",
          "const clean = html;",
          patched ? "<div>{clean}</div>" : "<div dangerouslySetInnerHTML={{ __html: clean }} />",
          "await supabase.from('payments').select('*');",
        ].map((line, i) => (
          <div key={`${line}-${i}`} className={`relative flex gap-4 py-2 ${i === 2 && !patched ? "text-amber-200" : "text-foreground/75"}`}>
            <span className="w-8 text-right text-muted/40">{17 + i}</span>
            <code>{line}</code>
            {i === 2 && !patched && <span className="ml-auto border border-amber-300/25 bg-amber-300/10 px-2 text-caption text-amber-200">XSS · CWE-79</span>}
            {i === 2 && patched && <span className="ml-auto border border-green-400/25 bg-green-400/10 px-2 text-caption text-green-300">patched</span>}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3 border-t border-card-border pt-5 md:flex-row md:items-center md:justify-between">
        <p className="text-small text-muted">Visitor sees scanner, exact line, reason, then patches it. No case-study modal needed.</p>
        <button type="button" onClick={onPatch} className="inline-flex items-center gap-2 border border-sky-300/30 bg-sky-300/10 px-4 py-2.5 font-mono text-small text-sky-200">
          <ScanLine size={15} />
          {patched ? "risk score lowered" : "patch finding"}
        </button>
      </div>
    </LivingFrame>
  );
}

function GogaaState({ provider, onProvider, onNext }: { provider: "claude" | "gpt" | "groq"; onProvider: (provider: "claude" | "gpt" | "groq") => void; onNext: () => void }): React.ReactElement {
  const rows = [
    ["claude", "timeout", "text-red-300"],
    ["gpt", "rate limited", "text-amber-200"],
    ["groq", "streaming", "text-green-300"],
  ] as const;
  return (
    <LivingFrame eyebrow="gogaa.failover.live" title="The visitor breaks providers and the work continues." action={<button type="button" onClick={onNext} className="font-mono text-caption text-accent">next proof</button>}>
      <div className="mt-5 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-3">
          {rows.map(([id, status, color]) => (
            <button key={id} type="button" onClick={() => onProvider(id)} className={`flex w-full items-center justify-between border px-4 py-3 font-mono text-small transition ${provider === id ? "border-green-400/35 bg-green-400/10" : "border-card-border bg-background/40"}`}>
              <span>{id}</span>
              <span className={color}>{status}</span>
            </button>
          ))}
        </div>
        <div className="border border-card-border bg-background/55 p-4 font-mono text-small leading-7">
          <p><span className="text-accent">&gt;</span> add auth middleware to /api routes</p>
          <p className="text-red-300">claude: timeout after 30s</p>
          <p className="text-amber-200">gpt: rate limit reached</p>
          <p className="text-green-300">groq: stream resumed</p>
          <p className="text-muted/70">Reading src/api/routes.ts...</p>
          <p className="text-green-300">✓ Edit middleware.ts (+24 -2)</p>
          <p className="text-green-300">✓ 1,418 tests passing</p>
        </div>
      </div>
    </LivingFrame>
  );
}

function RasadState({ replay, onReplay, onNext }: { replay: number; onReplay: (value: number) => void; onNext: () => void }): React.ReactElement {
  const steps = ["prompt", "read", "edit", "test", "fail", "retry", "pass"];
  return (
    <LivingFrame eyebrow="rasad.session.replay" title="The visitor scrubs an AI session instead of reading about observability." action={<button type="button" onClick={onNext} className="font-mono text-caption text-accent">next proof</button>}>
      <div className="mt-6">
        <input className="w-full accent-[var(--accent)]" aria-label="Replay scrubber" type="range" min={0} max={steps.length - 1} value={replay} onChange={(event) => onReplay(Number(event.target.value))} />
        <div className="mt-5 grid grid-cols-7 gap-2">
          {steps.map((step, i) => (
            <span key={step} className={`border px-2 py-3 text-center font-mono text-caption ${i <= replay ? "border-violet-300/35 bg-violet-400/10 text-violet-200" : "border-card-border text-muted/45"}`}>{step}</span>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-2 md:grid-cols-4">
        {["42 tool calls", "8 files touched", "31k tokens", "grade B+"].map((metric) => <span key={metric} className="border border-card-border bg-background/45 px-4 py-3 font-mono text-small text-muted">{metric}</span>)}
      </div>
    </LivingFrame>
  );
}

function CareerState({ lens, onLens, onNext }: { lens: "ai" | "devtools" | "founder"; onLens: (lens: "ai" | "devtools" | "founder") => void; onNext: () => void }): React.ReactElement {
  const proof = {
    ai: ["OpenEvent roadmap", "100+ clients", "AI approval gates"],
    devtools: ["CodeLens", "Gogaa", "Rasad"],
    founder: ["Wadware delivery", "client scoping", "product ownership"],
  };
  return (
    <LivingFrame eyebrow="career.compile" title="Experience rearranges without becoming a job-card timeline." action={<button type="button" onClick={onNext} className="font-mono text-caption text-accent">compile dossier</button>}>
      <div className="mt-5 flex flex-wrap gap-2">
        {(["ai", "devtools", "founder"] as const).map((item) => (
          <button key={item} type="button" onClick={() => onLens(item)} className={`border px-4 py-2.5 font-mono text-small ${lens === item ? "border-accent/35 bg-accent/10 text-accent" : "border-card-border text-muted"}`}>{item} lens</button>
        ))}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {proof[lens].map((item, i) => (
          <motion.div key={item} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="border-l border-accent/30 bg-background/35 p-4">
            <p className="font-mono text-caption text-muted/45">0{i + 1}</p>
            <p className="mt-3 text-xl font-semibold">{item}</p>
          </motion.div>
        ))}
      </div>
    </LivingFrame>
  );
}

function DossierState({ lens }: { lens: "ai" | "devtools" | "founder" }): React.ReactElement {
  return (
    <LivingFrame eyebrow="visitor.signal.final" title="Contact appears as the result of the experience, not a footer.">
      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_1fr]">
        <div className="border-l border-green-400/30 bg-green-400/[0.045] p-5">
          <p className="font-mono text-caption uppercase tracking-wider text-green-300">generated brief</p>
          <p className="mt-3 text-small leading-relaxed text-muted">
            Visitor inspected production systems and selected the <span className="text-foreground">{lens}</span> lens. The agent now knows which proof to package.
          </p>
        </div>
        <div className="space-y-2 font-mono text-small">
          {["Book 15-min call", "Open generated CV", "Ask final question"].map((item) => (
            <button key={item} type="button" className="flex w-full items-center justify-between border border-accent/25 bg-accent/[0.07] px-4 py-3 text-accent">
              {item}
              <ArrowRight size={15} />
            </button>
          ))}
        </div>
      </div>
    </LivingFrame>
  );
}

function StoryboardScrubber({ moment, onMoment }: { moment: Moment; onMoment: (moment: Moment) => void }): React.ReactElement {
  return (
    <div className="relative z-20 mx-auto mt-auto flex max-w-4xl flex-wrap justify-center gap-2 pb-4 pt-6">
      {momentOrder.map((item, i) => (
        <button
          key={item}
          type="button"
          onClick={() => onMoment(item)}
          className={`h-1.5 rounded-full transition-all ${moment === item ? "w-14 bg-accent" : "w-6 bg-muted/25 hover:bg-muted/45"}`}
          aria-label={`Show state ${i + 1}`}
        />
      ))}
    </div>
  );
}
