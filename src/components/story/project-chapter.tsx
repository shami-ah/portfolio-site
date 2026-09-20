"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ProjectData } from "@/data/projects";
import type { FlagshipStory } from "@/data/stories";
import { ProjectMockup, type MockupKind } from "@/components/project-mockup";
import { AgentLine, BeforeAfter, CountUp, Eyebrow, Reveal } from "./primitives";

/* ------------------------------------------------------------------ */
/*  One flagship project told as a story (plain lens):                 */
/*  the claim → the before/after → the product and the proof.          */
/* ------------------------------------------------------------------ */

interface ChapterProps {
  project: ProjectData;
  mockup: MockupKind;
  story: FlagshipStory;
  index: number;
  total: number;
  status: string;
  statusColor: string;
  summary: string;
  metrics: { label: string; value: string }[];
  nextTitle?: string;
  nextSlug?: string;
}

export function ProjectChapter({
  project,
  mockup,
  story,
  index,
  total,
  status,
  statusColor,
  summary,
  metrics,
  nextTitle,
  nextSlug,
}: ChapterProps): React.ReactElement {
  const num = String(index + 1).padStart(2, "0");
  const impact = project.measuredImpact;

  return (
    <article
      id={`project-${project.slug}`}
      className="relative px-5 md:px-10 lg:pl-28 lg:pr-16 py-16 md:py-28 border-t border-card-border/60 scroll-mt-16"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className={impact ? "grid grid-cols-1 xl:grid-cols-[1.15fr_1fr] gap-12 xl:gap-16 items-end" : ""}>
        {/* 1 — The claim */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-5 md:mb-7">
            <Eyebrow className="!text-foreground/50">
              {num} / {String(total).padStart(2, "0")}
            </Eyebrow>
            <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] ${statusColor}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {status}
            </span>
            <Eyebrow>{story.audience}</Eyebrow>
          </div>
          <h3 className="font-heading font-bold tracking-tight text-[2.1rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl max-w-[18ch] text-balance">
            {story.headline}
          </h3>
          <p className="mt-5 md:mt-7 text-base md:text-xl text-foreground/75 leading-relaxed max-w-2xl">
            <span className="text-foreground font-semibold">{project.title}.</span> {summary}
          </p>
        </Reveal>

        {/* 2 — Before → after, narrated by the agent */}
        {impact && (
          <div className="xl:pb-2">
            <BeforeAfter
              before={{ ...impact.before, context: story.beforeContext }}
              after={{ ...impact.after, context: story.afterContext }}
            />
            <Reveal delay={0.2} className="mt-8 md:mt-10 max-w-2xl">
              <AgentLine text={story.narration.text} mood={story.narration.mood} />
            </Reveal>
          </div>
        )}
        </div>

        {/* 3 — The product and the proof */}
        <div className="mt-12 md:mt-20 grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-8 lg:gap-14 items-start">
          <Reveal>
            <button
              type="button"
              data-project-expand="mockup"
              data-project-slug={project.slug}
              aria-label={`Open the full story of ${project.title}`}
              className="group block w-full text-left cursor-pointer rounded-2xl overflow-hidden border border-card-border bg-card shadow-[0_30px_80px_rgba(0,0,0,0.35)] hover:border-accent/40 transition-colors duration-300"
            >
              <div className="max-h-[70vh] overflow-hidden">
                <ProjectMockup kind={mockup} className="shadow-none border-0 rounded-none" />
              </div>
            </button>
          </Reveal>

          <div className="flex flex-col gap-8 lg:pt-2">
            <Reveal delay={0.1}>
              <dl className="grid grid-cols-3 lg:grid-cols-1 gap-5 lg:gap-7">
                {metrics.map((m) => (
                  <div key={m.label} className="lg:border-l-2 lg:border-accent/40 lg:pl-5">
                    <dd className="font-heading font-bold text-2xl sm:text-3xl md:text-5xl leading-none text-foreground whitespace-nowrap">
                      <CountUp value={m.value} />
                    </dd>
                    <dt className="mt-2 text-xs md:text-base text-foreground/65 leading-snug">{m.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>

            {story.quote && (
              <Reveal delay={0.15}>
                <figure className="rounded-xl border border-card-border bg-card/60 p-5 md:p-6">
                  <blockquote className="text-sm md:text-base text-foreground/85 leading-relaxed">
                    &ldquo;{story.quote.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-3 text-xs md:text-sm text-foreground/55">
                    {story.quote.name}, {story.quote.role}
                  </figcaption>
                </figure>
              </Reveal>
            )}

            <Reveal delay={0.2} className="flex flex-col items-start gap-3">
              <button
                type="button"
                data-project-expand="mockup"
                data-project-slug={project.slug}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg btn-gradient font-semibold text-sm hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Read the full story
                <ArrowRight size={15} strokeWidth={1.75} />
              </button>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/60">
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-accent-status transition-colors">
                    Try the live demo <ArrowUpRight size={14} />
                  </a>
                )}
                <button
                  type="button"
                  data-project-expand="diagram"
                  data-project-slug={project.slug}
                  className="hover:text-accent transition-colors cursor-pointer"
                >
                  How it&apos;s built (for engineers)
                </button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Next step */}
        {nextTitle && nextSlug && (
          <Reveal className="mt-14 md:mt-20">
            <a
              href={`#project-${nextSlug}`}
              className="group inline-flex items-baseline gap-3 text-foreground/55 hover:text-foreground transition-colors"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Next</span>
              <span className="font-heading text-xl md:text-2xl font-semibold">{nextTitle}</span>
              <ArrowRight size={18} className="translate-y-0.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Reveal>
        )}
      </div>
    </article>
  );
}
