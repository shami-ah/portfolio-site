"use client";

import { ArrowRight } from "lucide-react";
import type { ProjectData } from "@/data/projects";
import { Eyebrow, Reveal } from "./primitives";

/* ------------------------------------------------------------------ */
/*  Smaller projects, all visible at once (plain lens).                */
/* ------------------------------------------------------------------ */

export function SideProjects({
  projects,
  onOpen,
}: {
  projects: ProjectData[];
  onOpen: (project: ProjectData) => void;
}): React.ReactElement {
  return (
    <div className="px-5 md:px-10 lg:pl-28 lg:pr-16 py-16 md:py-28 border-t border-card-border/60">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <Eyebrow className="mb-3">More work</Eyebrow>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl leading-[1.08] tracking-tight mb-8 md:mb-12">
            Smaller builds that are also in daily use.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5">
          {projects.map((project, i) => (
            <Reveal
              key={project.slug}
              delay={Math.min(i * 0.06, 0.24)}
              className={i < 2 ? "lg:col-span-3" : "lg:col-span-2"}
            >
              <button
                type="button"
                onClick={() => onOpen(project)}
                className="group h-full w-full text-left cursor-pointer rounded-2xl border border-card-border bg-card/70 p-6 md:p-7 flex flex-col hover:border-accent/40 hover:bg-card transition-colors duration-300"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{project.type}</span>
                <span className="mt-3 font-heading font-semibold text-xl md:text-2xl leading-tight text-foreground">
                  {project.title}
                </span>
                <span className="mt-3 text-sm md:text-base text-foreground/70 leading-relaxed">
                  {project.plainSummary ?? project.cardSummary ?? project.subtitle}
                </span>
                <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm text-foreground/55 group-hover:text-accent transition-colors">
                  See details
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
