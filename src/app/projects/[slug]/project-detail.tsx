"use client";

import { type ProjectData } from "@/data/projects";
import { diagrams } from "@/data/diagrams";
import { FadeUp, SlideIn } from "@/components/motion";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { DecisionTree } from "@/components/decision-tree";
import { GogaaSandbox } from "@/components/gogaa-sandbox";
import { motion } from "framer-motion";

export function ProjectDetail({
  project,
}: {
  project: ProjectData;
}): React.ReactElement {
  return (
    <div className="min-h-screen bg-background">
      {/* Back nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-card-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="/"
            className="text-sm text-muted hover:text-accent transition-colors flex items-center gap-2"
          >
            <span>&larr;</span> Back
          </a>
          <span className="text-sm font-mono text-accent">{project.type}</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {project.title}
            </h1>
            <p className="text-xl text-muted mb-6">{project.subtitle}</p>
            <p className="text-lg text-accent font-medium mb-8">
              {project.impact}
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-xs font-mono bg-accent/5 text-accent/80 rounded-md border border-accent/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="flex flex-wrap gap-3">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent/10 border border-accent/30 hover:border-accent/60 transition-all text-sm text-accent hover:text-foreground"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Live Demo
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-card border border-card-border hover:border-accent/30 transition-all text-sm text-muted hover:text-foreground"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View on GitHub
                </a>
              )}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Decision tree — interactive */}
      {project.decision && (
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <DecisionTree decision={project.decision} />
          </div>
        </section>
      )}

      {/* The Problem */}
      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <SlideIn direction="left">
            <p className="text-xs font-mono text-accent mb-3 uppercase tracking-wider">
              The Problem
            </p>
            <p className="text-lg text-muted leading-relaxed max-w-3xl">
              {project.problem}
            </p>
          </SlideIn>
        </div>
      </section>

      {/* Gogaa sandbox — only on gogaa-cli */}
      {project.slug === "gogaa-cli" && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <GogaaSandbox />
          </div>
        </section>
      )}

      {/* The Solution */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <SlideIn direction="right">
            <p className="text-xs font-mono text-accent mb-3 uppercase tracking-wider">
              The Solution
            </p>
            <p className="text-lg text-muted leading-relaxed max-w-3xl mb-10">
              {project.solution}
            </p>
          </SlideIn>

          <FadeUp delay={0.1}>
            <ul className="space-y-3">
              {project.features.map((f) => (
                <li key={f.slice(0, 30)} className="flex gap-3 text-muted">
                  <span className="text-accent shrink-0 mt-1 text-xs">
                    &#9654;
                  </span>
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-5xl mx-auto">
          {diagrams[project.slug] ? (
            <ArchitectureDiagram
              chart={diagrams[project.slug]}
              title="System Architecture"
            />
          ) : (
            <>
              <FadeUp>
                <p className="text-xs font-mono text-accent mb-6 uppercase tracking-wider">
                  System Architecture
                </p>
              </FadeUp>
              <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
                {project.architecture.map((step, i) => (
                  <motion.span
                    key={step}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <span className="px-3 py-2 bg-card border border-card-border rounded-lg text-accent text-xs whitespace-nowrap">
                      {step}
                    </span>
                    {i < project.architecture.length - 1 && (
                      <span className="text-muted/40">&rarr;</span>
                    )}
                  </motion.span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Technical Decisions */}
      {project.techDecisions && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <p className="text-xs font-mono text-accent mb-6 uppercase tracking-wider">
                Key Technical Decisions
              </p>
            </FadeUp>
            <div className="grid md:grid-cols-2 gap-4">
              {project.techDecisions.map((decision, i) => (
                <FadeUp key={decision.title} delay={i * 0.08}>
                  <div className="p-5 rounded-xl bg-card border border-card-border h-full">
                    <h3 className="font-bold text-sm mb-2">
                      {decision.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {decision.description}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <p className="text-xs font-mono text-accent mb-6 uppercase tracking-wider">
              Results
            </p>
          </FadeUp>
          <div className="grid sm:grid-cols-2 gap-3">
            {project.results.map((result, i) => (
              <FadeUp key={result.slice(0, 30)} delay={i * 0.05}>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-card-border">
                  <span className="text-accent mt-0.5">&#10003;</span>
                  <span className="text-sm text-muted">{result}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Footer nav */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a
            href="/#projects"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            &larr; All Projects
          </a>
          <a
            href="/#contact"
            className="text-sm px-5 py-2 bg-accent/10 text-accent border border-accent/20 rounded-lg hover:bg-accent/20 transition-all"
          >
            Work with me
          </a>
        </div>
      </section>
    </div>
  );
}
