"use client";

import { projects } from "@/data/projects";
import { FadeUp } from "./motion";

export function Projects(): React.ReactElement {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            Case Studies
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Systems I&apos;ve shipped.
          </h2>
          <p className="text-muted mb-16 max-w-xl">
            Each project links to a full case study with architecture decisions,
            technical deep-dives, and results.
          </p>
        </FadeUp>

        {/* Featured projects */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {featured.map((project, i) => (
            <FadeUp key={project.slug} delay={i * 0.05}>
              <a
                href={`/projects/${project.slug}`}
                className="group block p-6 rounded-xl bg-card border border-accent/15 hover:border-accent/40 transition-all duration-300 h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 text-xs font-mono bg-accent/10 text-accent rounded border border-accent/20">
                    {project.type}
                  </span>
                  <span className="text-xs text-muted group-hover:text-accent transition-colors">
                    Read case study &rarr;
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-1 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted mb-4">{project.subtitle}</p>
                <p className="text-sm text-muted/80 leading-relaxed mb-5 line-clamp-4">
                  {project.impact}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-mono bg-card-hover text-muted/70 rounded border border-card-border"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 5 && (
                    <span className="px-2 py-0.5 text-[10px] font-mono text-muted/50">
                      +{project.stack.length - 5}
                    </span>
                  )}
                </div>
              </a>
            </FadeUp>
          ))}
        </div>

        {/* Other projects */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {others.map((project, i) => (
            <FadeUp key={project.slug} delay={i * 0.05}>
              <a
                href={`/projects/${project.slug}`}
                className="group block p-5 rounded-xl bg-card border border-card-border hover:border-accent/20 transition-all duration-300 h-full"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 text-[10px] font-mono text-muted/60 bg-card-hover rounded border border-card-border">
                    {project.type}
                  </span>
                  {project.live && !project.github && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-green-400/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
                      Live
                    </span>
                  )}
                  {project.github && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-muted/30 group-hover:text-accent/60 transition-colors"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  )}
                </div>

                <h3 className="font-bold mb-1 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed line-clamp-3">
                  {project.impact}
                </p>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
