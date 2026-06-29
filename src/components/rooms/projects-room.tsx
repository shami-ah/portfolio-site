"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { AgentEmoji } from "@/components/agent-visuals";
import { ProjectMockup, type MockupKind } from "@/components/project-mockup";
import type { ProjectData } from "@/data/projects";
import type { EmojiMood } from "@/components/agent-visuals";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type FlagshipSlug = "openevent" | "codelens" | "gogaa-cli" | "rasad";
export type GestureState = Record<FlagshipSlug, boolean>;

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

export const flagshipSlugs: FlagshipSlug[] = [
  "openevent",
  "codelens",
  "gogaa-cli",
  "rasad",
];

export const flagshipConfig: Record<
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

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ease = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/*  ProjectsRoom                                                       */
/* ------------------------------------------------------------------ */

export function ProjectsRoom({
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
  const other = otherProjects[otherIndex] ?? otherProjects[0];
  const metricList =
    project.measuredImpact?.highlights ??
    project.results
      .slice(0, 3)
      .map((result) => ({
        n: result.split(" ")[0],
        l: result.split(" ").slice(1).join(" "),
      }));

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
          <p className="font-mono text-caption uppercase tracking-[0.28em] text-accent">
            project reel
          </p>
          <h2 className="mt-1 text-2xl font-bold md:text-3xl">Projects</h2>
        </div>
      </div>

      <div className="grid gap-4 md:min-h-0 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="grid overflow-hidden rounded-2xl border border-card-border bg-card/35 backdrop-blur-md md:min-h-0 md:grid-rows-[112px_minmax(0,1fr)]">
          <div className="border-b border-card-border bg-background/35 px-4 py-3 md:px-7">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-caption uppercase tracking-[0.24em] text-muted/55">
                  4 flagship stops
                </p>
                <p className="mt-1 max-w-[280px] text-small text-muted md:max-w-none">
                  Slide the agent across the rail. Each stop changes the case.
                </p>
              </div>
              <p className="font-mono text-small text-accent">
                {activeIndex + 1} / {flagships.length}
              </p>
            </div>

            <div className="relative mx-auto mt-8 h-1 w-[calc(100%-8rem)] max-w-[520px] rounded-full bg-muted/15 md:w-full">
              <motion.div
                className="absolute -top-9 z-10 flex flex-col items-center"
                animate={{
                  left: `${(activeIndex / Math.max(1, flagships.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.35, ease }}
                style={{ x: "-50%" }}
              >
                <motion.button
                  type="button"
                  drag="x"
                  dragConstraints={{ left: -48, right: 48 }}
                  dragElastic={0.18}
                  onDragEnd={(_, info) => slideToNextStop(info.offset.x)}
                  onClick={() =>
                    chooseFlagship((activeIndex + 1) % flagships.length)
                  }
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
                    index === activeIndex
                      ? "bg-accent shadow-[0_0_18px_rgba(74,222,128,0.7)]"
                      : solved[item.slug as FlagshipSlug]
                        ? "bg-green-300/70"
                        : "bg-muted/30"
                  }`}
                  style={{
                    left: `${(index / Math.max(1, flagships.length - 1)) * 100}%`,
                  }}
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
                <p className="font-mono text-caption uppercase tracking-[0.24em] text-accent">
                  {project.type}
                </p>
                <h3 className="mt-3 text-4xl font-bold leading-tight md:text-6xl">
                  {project.title}
                </h3>
                <p className="mt-4 max-w-[300px] text-base leading-relaxed text-muted md:max-w-xl md:text-lg">
                  {project.oneLiner ?? project.cardSummary ?? project.impact}
                </p>
                <p className="mt-3 max-w-[300px] text-small leading-relaxed text-muted/75 md:max-w-xl">
                  {config.why}
                </p>

                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3 md:gap-3">
                  {metricList.slice(0, 3).map((metric) => (
                    <div
                      key={`${metric.n}-${metric.l}`}
                      className="min-h-[86px] rounded-xl border border-card-border bg-background/40 p-3 md:min-h-[92px] md:p-4"
                    >
                      <p className="text-xl font-bold text-foreground md:text-2xl">
                        {metric.n}
                      </p>
                      <p className="mt-1 font-mono text-[10px] leading-tight text-muted/55 md:text-caption">
                        {metric.l}
                      </p>
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
                  <p className="text-small leading-relaxed text-muted">
                    {config.action}
                  </p>
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
            <p className="font-mono text-caption uppercase tracking-[0.24em] text-muted/55">
              side reel · 5 projects
            </p>
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
                <span className="block font-mono text-small text-green-300">
                  deal me another
                </span>
                <span className="text-caption text-muted">
                  Tap or drag to flip through the smaller projects.
                </span>
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
                <p className="font-mono text-caption text-accent">
                  {other.type}
                </p>
                <h3 className="mt-2 text-2xl font-bold leading-tight">
                  {other.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {other.cardSummary ?? other.impact}
                </p>
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
