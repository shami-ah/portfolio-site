"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { useStatus } from "@/lib/use-status";

export type ContentType =
  | "projects"
  | "skills"
  | "testimonials"
  | "experience"
  | "about"
  | "openevent";

const titles: Record<ContentType, { label: string; sub: string; icon: string }> = {
  projects: { label: "Projects", sub: "9 case studies · click any for the full story", icon: "🗂" },
  skills: { label: "Stack", sub: "Patterns and tech behind the systems", icon: "🧠" },
  testimonials: { label: "What clients say", sub: "In their own words", icon: "💬" },
  experience: { label: "Experience", sub: "Where I've shipped production systems", icon: "⚡" },
  about: { label: "About", sub: "The producer vs. consumer distinction", icon: "ℹ" },
  openevent: { label: "OpenEvent · before vs after", sub: "Real production metrics", icon: "📊" },
};

interface Props {
  type: ContentType;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export function AgentContent({ type, onClose, onNavigate }: Props): React.ReactElement {
  const t = titles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative pointer-events-auto rounded-2xl bg-card/95 backdrop-blur-md border border-accent/40 shadow-2xl shadow-accent/20 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 md:px-5 py-3 border-b border-accent/15 bg-background/40">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent/80">
            agent · showing {t.label.toLowerCase()}
          </p>
          <p className="text-[10px] md:text-[11px] text-muted/60 truncate">
            {t.sub}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const id =
              type === "projects"
                ? "projects"
                : type === "skills"
                  ? "skills"
                  : type === "testimonials"
                    ? "testimonials"
                    : type === "experience"
                      ? "experience"
                      : type === "about"
                        ? "about"
                        : null;
            if (id) onNavigate(id);
          }}
          className="hidden sm:inline text-[10px] font-mono text-muted/50 hover:text-accent transition-colors px-2 py-1 rounded border border-card-border hover:border-accent/30"
        >
          open on page ↓
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-7 h-7 rounded-full border border-card-border hover:border-accent/40 flex items-center justify-center text-muted hover:text-foreground transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="max-h-[70vh] overflow-y-auto p-4 md:p-5">
        {type === "projects" && <ProjectsPanel />}
        {type === "skills" && <SkillsPanel />}
        {type === "testimonials" && <TestimonialsPanel />}
        {type === "experience" && <ExperiencePanel />}
        {type === "about" && <AboutPanel />}
        {type === "openevent" && <OpenEventPanel />}
      </div>
    </motion.div>
  );
}

/* ---------------------------- Panels ------------------------------- */

function ProjectsPanel(): React.ReactElement {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {projects.map((p) => (
        <a
          key={p.slug}
          href={`/projects/${p.slug}`}
          className="group p-3 md:p-4 rounded-lg bg-background/40 border border-card-border hover:border-accent/40 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <span className="text-[9px] md:text-[10px] font-mono px-1.5 py-0.5 rounded border border-accent/20 bg-accent/5 text-accent/80">
              {p.type}
            </span>
            {p.live && (
              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-green-400/80">
                <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                live
              </span>
            )}
          </div>
          <p className="text-sm md:text-base font-bold group-hover:text-accent transition-colors">
            {p.title}
          </p>
          <p className="text-[11px] md:text-xs text-muted/70 line-clamp-2 mt-1 leading-relaxed">
            {p.impact}
          </p>
        </a>
      ))}
    </div>
  );
}

function SkillsPanel(): React.ReactElement {
  const groups = [
    {
      title: "AI & Agents",
      tone: "accent",
      items: [
        "Multi-agent orchestration",
        "Human approval gates",
        "Claude Opus / Sonnet",
        "OpenAI GPT-4o, o1",
        "RAG + pgvector",
        "LangChain",
        "RLHF / SFT evaluation",
      ],
    },
    {
      title: "Full Stack",
      tone: "emerald",
      items: [
        "React, Next.js",
        "React Native (Expo)",
        "TypeScript, Python",
        "Supabase (Postgres, RLS, Edge)",
        "Stripe, Gmail, Calendar APIs",
      ],
    },
    {
      title: "Infrastructure",
      tone: "amber",
      items: [
        "GitHub Actions CI/CD",
        "Docker Compose",
        "Sentry, Grafana",
        "n8n automation",
        "Cloudflare, Vercel",
      ],
    },
    {
      title: "Process",
      tone: "purple",
      items: [
        "Architect-first · spec before code",
        "Team lead (3-8 eng)",
        "CodeLens (305 patterns)",
        "Gogaa CLI (1,418 tests)",
      ],
    },
  ];

  const toneClass: Record<string, string> = {
    accent: "bg-accent/10 text-accent/90 border-accent/20",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  };
  const titleColor: Record<string, string> = {
    accent: "text-accent",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    purple: "text-purple-400",
  };

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {groups.map((g) => (
        <div key={g.title} className="p-3 md:p-4 rounded-lg bg-background/40 border border-card-border">
          <p className={`text-sm font-bold mb-2.5 ${titleColor[g.tone]}`}>{g.title}</p>
          <div className="flex flex-wrap gap-1">
            {g.items.map((x) => (
              <span
                key={x}
                className={`px-2 py-0.5 text-[10px] font-mono rounded border ${toneClass[g.tone]}`}
              >
                {x}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TestimonialsPanel(): React.ReactElement {
  const list = [
    {
      quote:
        "Ahtesham was extremely helpful, great developer and communication skills. Will hire again.",
      name: "River Soellner",
      role: "Founder, More Life Hospitality GmbH",
      tag: "Upwork client, then offered full-time",
    },
    {
      quote:
        "A serious and helpful guy. If you're looking for a technical and competent engineer and project manager who knows how to deal with specific and in-depth topics to monitor your teams and your projects, he's well-placed to do it.",
      name: "Mouad B.",
      role: "Project Manager · France",
      tag: null,
    },
    {
      quote:
        "I had a great experience working with Ahtesham on the creation of a Basic META AI Course. Highly professional, delivered high-quality content, and adhered to the project timeline.",
      name: "Upwork Client",
      role: "Course Director · META AI Workshop",
      tag: "via Upwork",
    },
  ];
  return (
    <div className="space-y-3">
      {list.map((t) => (
        <div key={t.name} className="p-3 md:p-4 rounded-lg bg-background/40 border border-card-border">
          <p className="text-xs md:text-sm text-foreground/90 leading-relaxed mb-3 italic">
            &ldquo;{t.quote}&rdquo;
          </p>
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-card-border">
            <div>
              <p className="text-xs font-bold">{t.name}</p>
              <p className="text-[11px] text-muted/70">{t.role}</p>
            </div>
            {t.tag && (
              <span className="text-[9px] font-mono text-muted/50 border border-card-border rounded px-1.5 py-0.5">
                {t.tag}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperiencePanel(): React.ReactElement {
  const roles = [
    {
      title: "Lead AI Developer",
      company: "More Life Hospitality GmbH",
      period: "Sep 2025 — Now",
      lines: [
        "Building OpenEvent · 100+ clients · saves 1.5 hrs/day per team",
        "Supabase Edge Functions · OpenAI · pgvector · Stripe",
      ],
    },
    {
      title: "Director of IT & R&D",
      company: "Rouelite Techno Pvt. Ltd.",
      period: "2022 — 2024",
      lines: [
        "Led 10-person team · CRM for 500+ daily users",
        "Reduced manual data entry by 70%",
      ],
    },
    {
      title: "AI Engineering Consultant",
      company: "Wadware House · Global Clients",
      period: "2019 — Now",
      lines: [
        "250+ projects · 100% satisfaction · 40+ returning clients",
        "500+ RLHF/SFT sessions on frontier models",
      ],
    },
  ];
  return (
    <div className="space-y-3">
      {roles.map((r) => (
        <div key={r.title} className="p-3 md:p-4 rounded-lg bg-background/40 border border-card-border">
          <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
            <div>
              <p className="text-sm md:text-base font-bold">{r.title}</p>
              <p className="text-xs text-accent">{r.company}</p>
            </div>
            <p className="text-[10px] font-mono text-muted/60">{r.period}</p>
          </div>
          <ul className="space-y-1">
            {r.lines.map((l) => (
              <li key={l} className="flex gap-2 text-[11px] md:text-xs text-muted leading-relaxed">
                <span className="text-accent/60 shrink-0 mt-0.5">▸</span>
                {l}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function AboutPanel(): React.ReactElement {
  const { status } = useStatus();
  return (
    <div className="space-y-4">
      <p className="text-sm md:text-base text-foreground/90 leading-relaxed border-l-2 border-accent pl-4">
        Most engineers are consumers of AI tooling. I&apos;m also a builder of it. When the tools
        I needed didn&apos;t exist, I built them. A code review engine that catches bugs commercial
        tools miss. An open-source coding agent that closes every gap simultaneously.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <Stat n={`${status.portfolio.projects}+`} l="projects shipped" />
        <Stat n={`${status.portfolio.yearsBuilding}+`} l="years building" />
        <Stat n={status.gogaa.tests.toLocaleString()} l="gogaa tests passing" />
        <Stat n="<1s" l="codelens reviews" />
      </div>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }): React.ReactElement {
  return (
    <div className="p-3 rounded-lg bg-background/40 border border-card-border">
      <p className="text-2xl md:text-3xl font-bold text-accent font-mono">{n}</p>
      <p className="text-[10px] text-muted mt-0.5 uppercase tracking-wider">{l}</p>
    </div>
  );
}

function OpenEventPanel(): React.ReactElement {
  const { status } = useStatus();
  const oe = status.openevent;
  const afterMins = 15;
  const beforeMins = Math.round(oe.hoursSavedPerDay * 60);
  const savedPercent = Math.round(((beforeMins - afterMins) / beforeMins) * 100);

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="p-3 md:p-4 rounded-lg bg-card/40 border border-card-border">
          <p className="text-[10px] font-mono text-muted/60 uppercase tracking-widest mb-2">
            before
          </p>
          <p className="text-3xl font-bold text-muted font-mono mb-2">
            ~{oe.hoursSavedPerDay}<span className="text-muted/40 text-lg">hrs/day</span>
          </p>
          <p className="text-[11px] text-muted/70 leading-relaxed">
            Per team member, just reading and triaging client email.
          </p>
        </div>
        <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-accent/[0.1] via-card to-card border border-accent/30">
          <p className="text-[10px] font-mono text-accent uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> after
          </p>
          <p className="text-3xl font-bold text-accent font-mono mb-2">
            ~15<span className="text-accent/50 text-lg">min/day</span>
          </p>
          <p className="text-[11px] text-muted leading-relaxed">
            Review AI-drafted actions and approve. Done.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat n={`${oe.clients}+`} l="active clients" />
        <Stat n={`${oe.events}+`} l="events run" />
        <Stat n={`${savedPercent}%`} l="time saved" />
      </div>
    </div>
  );
}
