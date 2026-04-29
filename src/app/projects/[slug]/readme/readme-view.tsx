"use client";

import { type ProjectData } from "@/data/projects";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FadeUp } from "@/components/motion";

export function ReadmeView({
  project,
  readme,
}: {
  project: ProjectData;
  readme: string;
}): React.ReactElement {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-card-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href={`/projects/${project.slug}`}
            className="text-sm text-muted hover:text-accent transition-colors flex items-center gap-2"
          >
            <span>&larr;</span> Back to {project.title}
          </a>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-mono rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-400">
              Private Repository
            </span>
            <span className="text-sm font-mono text-accent">{project.type}</span>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="flex items-center gap-3 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
            </div>
            <p className="text-lg text-muted mb-6">{project.subtitle}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.stack.slice(0, 8).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-xs font-mono bg-accent/5 text-accent/80 rounded-md border border-accent/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* README content */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <FadeUp delay={0.1}>
            <div className="rounded-xl border border-card-border bg-card/50 overflow-hidden">
              {/* File header bar */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-card-border bg-card/80">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="text-sm font-mono text-muted">README.md</span>
              </div>

              {/* Markdown body */}
              <div className="p-6 md:p-8 prose prose-invert prose-sm md:prose-base max-w-none
                prose-headings:text-foreground prose-headings:font-bold prose-headings:border-b prose-headings:border-card-border prose-headings:pb-2 prose-headings:mb-4
                prose-h1:text-2xl prose-h1:mt-0
                prose-h2:text-xl prose-h2:mt-8
                prose-h3:text-lg prose-h3:mt-6 prose-h3:border-0
                prose-p:text-muted prose-p:leading-relaxed
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-card-border prose-pre:rounded-lg
                prose-li:text-muted
                prose-blockquote:border-accent/40 prose-blockquote:text-muted prose-blockquote:italic
                prose-img:rounded-lg prose-img:border prose-img:border-card-border
                prose-table:text-sm prose-th:text-foreground prose-td:text-muted prose-tr:border-card-border
              ">
                {readme ? (
                  <Markdown remarkPlugins={[remarkGfm]}>{readme}</Markdown>
                ) : (
                  <p className="text-muted italic">README not available at this time.</p>
                )}
              </div>
            </div>
          </FadeUp>

          {/* Footer note */}
          <FadeUp delay={0.2}>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted/60">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Source code is private. This page shows the project README only.</span>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
