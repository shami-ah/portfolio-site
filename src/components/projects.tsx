"use client";

import { useState } from "react";
import { projects, type ProjectData } from "@/data/projects";
import { FadeUp } from "./motion";
import { ProjectModal } from "./project-modal";

function ProjectCard({
  project,
  featured = false,
  index = 0,
  onOpen,
}: {
  project: ProjectData;
  featured?: boolean;
  index?: number;
  onOpen: (p: ProjectData) => void;
}): React.ReactElement {
  return (
    <FadeUp delay={index * 0.05}>
      <button
        type="button"
        onClick={() => onOpen(project)}
        className={`group w-full h-full text-left rounded-xl bg-card border transition-all duration-300 overflow-hidden relative ${
          featured
            ? "p-5 md:p-6 border-accent/15 hover:border-accent/50"
            : "p-4 md:p-5 border-card-border hover:border-accent/30"
        } hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5`}
      >
        {/* Glow line on hover */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex items-center justify-between mb-3 md:mb-4">
          <span
            className={`px-2.5 py-1 text-[10px] md:text-xs font-mono rounded border ${
              featured
                ? "bg-accent/10 text-accent border-accent/20"
                : "bg-card-hover text-muted/80 border-card-border"
            }`}
          >
            {project.type}
          </span>
          <div className="flex items-center gap-2">
            {project.live && !project.github && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-green-400/80">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            )}
            <span className="text-[10px] md:text-xs text-muted/50 group-hover:text-accent transition-colors font-mono hidden md:inline">
              Quick view →
            </span>
            <span className="text-[10px] text-muted/50 group-hover:text-accent transition-colors font-mono md:hidden">
              View →
            </span>
          </div>
        </div>

        <h3
          className={`font-bold mb-1 group-hover:text-accent transition-colors ${
            featured ? "text-lg md:text-2xl" : "text-base md:text-lg"
          }`}
        >
          {project.title}
        </h3>

        {featured && (
          <p className="text-xs md:text-sm text-muted mb-3">
            {project.subtitle}
          </p>
        )}

        <p
          className={`text-muted/80 leading-relaxed ${
            featured ? "text-xs md:text-sm line-clamp-3 mb-4 md:mb-5" : "text-xs line-clamp-2 mb-3"
          }`}
        >
          {project.impact}
        </p>

        <div className="flex flex-wrap gap-1">
          {project.stack.slice(0, featured ? 5 : 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[9px] md:text-[10px] font-mono bg-card-hover text-muted/70 rounded border border-card-border"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > (featured ? 5 : 3) && (
            <span className="px-2 py-0.5 text-[9px] md:text-[10px] font-mono text-muted/50">
              +{project.stack.length - (featured ? 5 : 3)}
            </span>
          )}
        </div>
      </button>
    </FadeUp>
  );
}

export function Projects(): React.ReactElement {
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);

  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            Case Studies
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Systems I&apos;ve shipped.
          </h2>
          <p className="text-sm md:text-base text-muted mb-10 md:mb-16 max-w-xl">
            Click any project for a quick overview with architecture, results,
            and key decisions. Each one links to a full case study for the
            deep dive.
          </p>
        </FadeUp>

        {/* Featured projects */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          {featured.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              featured
              index={i}
              onOpen={setActiveProject}
            />
          ))}
        </div>

        {/* Other projects */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {others.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              onOpen={setActiveProject}
            />
          ))}
        </div>
      </div>

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}
