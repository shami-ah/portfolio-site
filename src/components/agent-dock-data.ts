import { projects } from "@/data/projects";
import { FLAGSHIP_STORIES } from "@/data/stories";

/* ------------------------------------------------------------------ */
/*  What the docked agent shows for the part of the page in view:      */
/*  a title, one line of orientation, and the routes that make sense   */
/*  from there.                                                        */
/* ------------------------------------------------------------------ */

export type DockRoute =
  | { label: string; kind: "scroll"; target: string }
  | { label: string; kind: "link"; href: string; external?: boolean }
  | { label: string; kind: "cv" }
  | { label: string; kind: "expand"; slug: string; view: "mockup" | "diagram" };

export interface DockContext {
  /** Short label shown on the collapsed dock. */
  title: string;
  /** One line under the title. */
  info: string;
  routes: DockRoute[];
}

const BOOK_URL = "https://ahtesham.dev.wadwarehouse.com/book";

const FLAGSHIP_ORDER = ["openevent", "codelens", "gogaa-cli", "rasad"];

const flagships = FLAGSHIP_ORDER.flatMap((slug) => {
  const project = projects.find((p) => p.slug === slug);
  return project ? [project] : [];
});

const SECTION_CONTEXT: Record<string, DockContext> = {
  hero: {
    title: "Hi, I'm his agent",
    info: "I can show you around or answer questions about Ahtesham.",
    routes: [
      { label: "See the work", kind: "scroll", target: "projects" },
      { label: "Experience", kind: "scroll", target: "log" },
      { label: "View CV", kind: "cv" },
      { label: "Get in touch", kind: "scroll", target: "contact" },
    ],
  },
  projects: {
    title: "The work",
    info: "Four products, then five smaller builds. Jump to any of them.",
    routes: flagships.map((p) => ({ label: p.title, kind: "scroll" as const, target: `project-${p.slug}` })),
  },
  log: {
    title: "Experience",
    info: "Three roles, each told by its biggest result.",
    routes: [
      { label: "His writing", kind: "scroll", target: "writing" },
      { label: "Full career story", kind: "link", href: "/journey" },
      { label: "View CV", kind: "cv" },
      { label: "Get in touch", kind: "scroll", target: "contact" },
    ],
  },
  contact: {
    title: "Let's talk",
    info: "He is available now for full-time or contract work.",
    routes: [
      { label: "Book a 15-min call", kind: "link", href: BOOK_URL, external: true },
      { label: "Send an email", kind: "link", href: "mailto:shami8024@gmail.com" },
      { label: "View CV", kind: "cv" },
      { label: "Back to the work", kind: "scroll", target: "projects" },
    ],
  },
};

function chapterContext(slug: string): DockContext | null {
  const index = flagships.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  const project = flagships[index];
  const next = flagships[index + 1];
  const story = FLAGSHIP_STORIES[slug];

  const routes: DockRoute[] = [{ label: "Read the full story", kind: "expand", slug, view: "mockup" }];
  if (project.live) routes.push({ label: "Try the live demo", kind: "link", href: project.live, external: true });
  routes.push({ label: "How it's built", kind: "expand", slug, view: "diagram" });
  routes.push(
    next
      ? { label: `Next: ${next.title}`, kind: "scroll", target: `project-${next.slug}` }
      : { label: "Next: experience", kind: "scroll", target: "log" },
  );

  return {
    title: `${project.title} · ${index + 1} of ${flagships.length}`,
    info: story?.audience ?? project.subtitle,
    routes,
  };
}

export function getDockContext(section: string, chapter: string | null): DockContext {
  if (section === "projects" && chapter) {
    const ctx = chapterContext(chapter);
    if (ctx) return ctx;
  }
  return SECTION_CONTEXT[section] ?? SECTION_CONTEXT.hero;
}
