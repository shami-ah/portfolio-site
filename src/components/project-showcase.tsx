"use client";

import { motion } from "framer-motion";
import type { ProjectData } from "@/data/projects";
import { ProjectMockup, type MockupKind } from "./project-mockup";

interface Props {
  project: ProjectData;
  mockup: MockupKind;
  /** If true, mockup is on the right (reversed layout) */
  flip?: boolean;
  onOpen: (p: ProjectData) => void;
  index?: number;
}

export function ProjectShowcase({
  project,
  mockup,
  flip = false,
  onOpen,
  index = 0,
}: Props): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`grid md:grid-cols-2 gap-6 md:gap-10 items-center ${
        flip ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Mockup side */}
      <ProjectMockup kind={mockup} />

      {/* Content side */}
      <div className="space-y-4 md:space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 text-[10px] md:text-xs font-mono rounded border border-accent/20 bg-accent/5 text-accent/90">
            {project.type}
          </span>
          {project.live && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] md:text-xs font-mono rounded border border-green-500/30 bg-green-500/10 text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              live
            </span>
          )}
        </div>

        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
          {project.title}
        </h3>

        <p className="text-sm md:text-base text-muted leading-relaxed line-clamp-5">
          {project.impact}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.stack.slice(0, 6).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[10px] font-mono bg-card-hover/60 text-muted/70 rounded border border-card-border"
            >
              {t}
            </span>
          ))}
          {project.stack.length > 6 && (
            <span className="px-2 py-0.5 text-[10px] font-mono text-muted/50">
              +{project.stack.length - 6}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-accent text-white font-medium rounded-lg hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 transition-all"
          >
            Open
          </button>
          <a
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
          >
            Read case study
            <span>→</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
