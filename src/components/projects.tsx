"use client";

import { useState } from "react";
import { projects, type ProjectData } from "@/data/projects";
import { FadeUp } from "./motion";
import { motion, AnimatePresence } from "framer-motion";

function ProjectCard({
  project,
  featured = false,
  index = 0,
}: {
  project: ProjectData;
  featured?: boolean;
  index?: number;
}): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);

  const archPreview = project.architecture.slice(0, 4);
  const keyResults = (project.results || []).slice(0, 2);

  return (
    <FadeUp delay={index * 0.05}>
      <div
        className={`group relative rounded-xl bg-card border transition-all duration-500 overflow-hidden ${
          featured
            ? "border-accent/15 hover:border-accent/40"
            : "border-card-border hover:border-accent/25"
        } ${isExpanded ? "border-accent/40" : ""}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Animated accent line on hover */}
        <div
          className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent transition-opacity duration-500 ${
            isExpanded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Header — always visible, tappable on mobile */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="w-full text-left p-5 md:p-6 md:pointer-events-none"
          aria-expanded={isExpanded}
        >
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
              <span
                className={`text-[10px] md:hidden font-mono transition-transform duration-300 ${
                  isExpanded ? "rotate-180 text-accent" : "text-muted/50"
                }`}
              >
                ▾
              </span>
            </div>
          </div>

          <h3
            className={`font-bold mb-1 transition-colors ${
              featured ? "text-xl md:text-2xl" : "text-base md:text-lg"
            } ${isExpanded ? "text-accent" : ""}`}
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
              featured ? "text-xs md:text-sm line-clamp-3" : "text-xs line-clamp-2"
            }`}
          >
            {project.impact}
          </p>
        </button>

        {/* Expandable preview — desktop hover OR mobile tap */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 md:px-6 pb-4 space-y-4">
                {/* Live architecture preview */}
                <div className="pt-4 border-t border-card-border/60">
                  <p className="text-[9px] font-mono text-accent/60 uppercase tracking-[0.2em] mb-2.5">
                    System Flow
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {archPreview.map((node, i) => (
                      <motion.div
                        key={node}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.08 + i * 0.07,
                          duration: 0.3,
                        }}
                        className="flex items-center gap-1.5"
                      >
                        <span className="px-2 py-1 text-[9px] md:text-[10px] font-mono bg-accent/10 text-accent/90 border border-accent/20 rounded whitespace-nowrap">
                          {node.split(/[(\n—]/)[0].trim().slice(0, 24)}
                        </span>
                        {i < archPreview.length - 1 && (
                          <span className="text-accent/40 text-[10px]">→</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Key results */}
                {keyResults.length > 0 && (
                  <div>
                    <p className="text-[9px] font-mono text-accent/60 uppercase tracking-[0.2em] mb-2">
                      Key Results
                    </p>
                    <ul className="space-y-1.5">
                      {keyResults.map((result, i) => (
                        <motion.li
                          key={result}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.15 + i * 0.08,
                            duration: 0.3,
                          }}
                          className="text-[11px] md:text-xs text-muted leading-relaxed flex gap-2"
                        >
                          <span className="text-accent/60 shrink-0">▸</span>
                          <span>{result}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech stack pills */}
                <div className="flex flex-wrap gap-1">
                  {project.stack.slice(0, featured ? 6 : 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 text-[9px] font-mono bg-card-hover text-muted/70 rounded border border-card-border"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > (featured ? 6 : 4) && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono text-muted/50">
                      +{project.stack.length - (featured ? 6 : 4)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA — always visible */}
        <a
          href={`/projects/${project.slug}`}
          className="block px-5 md:px-6 py-3 border-t border-card-border/60 text-xs text-muted hover:text-accent transition-colors flex items-center justify-between group/cta"
        >
          <span className="font-mono">Read case study</span>
          <span className="transition-transform duration-300 group-hover/cta:translate-x-1">
            →
          </span>
        </a>
      </div>
    </FadeUp>
  );
}

export function Projects(): React.ReactElement {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            Case Studies
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Systems I&apos;ve shipped.
          </h2>
          <p className="text-sm md:text-base text-muted mb-10 md:mb-16 max-w-xl">
            Hover (or tap on mobile) to see the architecture and key results.
            Click through for the full case study.
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
