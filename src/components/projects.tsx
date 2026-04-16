"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { projects, type ProjectData } from "@/data/projects";
import { FadeUp } from "./motion";
import { ProjectModal } from "./project-modal";
import { ProjectShowcase } from "./project-showcase";
import type { MockupKind } from "./project-mockup";

const SHOWCASE_SLUGS: { slug: string; mockup: MockupKind }[] = [
  { slug: "openevent", mockup: "openevent" },
  { slug: "codelens", mockup: "codelens" },
  { slug: "gogaa-cli", mockup: "gogaa" },
];

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
  const ref = useRef<HTMLButtonElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowBg = useTransform<number, string>(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(600px circle at ${x}% ${y}%, rgba(59,130,246,0.08), transparent 40%)`,
  );

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 10);
    rx.set((0.5 - py) * 10);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };
  const onMouseLeave = (): void => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <FadeUp delay={index * 0.05}>
      <motion.button
        ref={ref}
        type="button"
        onClick={() => onOpen(project)}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
        }}
        whileTap={{ scale: 0.99 }}
        className={`group w-full h-full text-left rounded-xl bg-card border transition-[border-color,box-shadow] duration-300 overflow-hidden relative ${
          featured
            ? "p-5 md:p-6 border-accent/15 hover:border-accent/50"
            : "p-4 md:p-5 border-card-border hover:border-accent/30"
        } hover:shadow-xl hover:shadow-accent/10`}
      >
        {/* Cursor-following glow */}
        <motion.div
          style={{ background: glowBg }}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        />

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
            {project.live && (
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
      </motion.button>
    </FadeUp>
  );
}

export function Projects(): React.ReactElement {
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);

  const showcasePairs = SHOWCASE_SLUGS.map(({ slug, mockup }) => ({
    project: projects.find((p) => p.slug === slug),
    mockup,
  })).filter((x): x is { project: ProjectData; mockup: MockupKind } => !!x.project);
  const showcaseSlugs = new Set(SHOWCASE_SLUGS.map((s) => s.slug));
  const others = projects.filter((p) => !showcaseSlugs.has(p.slug));

  // Gallery navigation
  const navigate = useCallback(
    (dir: 1 | -1) => {
      setActiveProject((current) => {
        if (!current) return current;
        const idx = projects.findIndex((p) => p.slug === current.slug);
        if (idx === -1) return current;
        const next = (idx + dir + projects.length) % projects.length;
        return projects[next];
      });
    },
    [],
  );

  // Listen for command palette project-open events
  useEffect(() => {
    const onOpen = (e: Event): void => {
      const ce = e as CustomEvent<string>;
      const match = projects.find((p) => p.slug === ce.detail);
      if (match) {
        document
          .getElementById("projects")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => setActiveProject(match), 400);
      }
    };
    window.addEventListener("open-project", onOpen);
    return () => window.removeEventListener("open-project", onOpen);
  }, []);

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

        {/* Showcase — flagship projects with stylized mockups */}
        <div className="space-y-16 md:space-y-24 mb-16 md:mb-24">
          {showcasePairs.map(({ project, mockup }, i) => (
            <ProjectShowcase
              key={project.slug}
              project={project}
              mockup={mockup}
              flip={i % 2 === 1}
              index={i}
              onOpen={setActiveProject}
            />
          ))}
        </div>

        {/* Other projects */}
        <div className="pt-6 md:pt-10 border-t border-card-border/50">
          <FadeUp>
            <p className="text-xs font-mono text-muted/60 uppercase tracking-wider mb-5 md:mb-6">
              more experiments &amp; tools
            </p>
          </FadeUp>
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
      </div>

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onNavigate={navigate}
      />
    </section>
  );
}
