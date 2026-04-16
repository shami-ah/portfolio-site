"use client";

import { FadeUp } from "./motion";

interface SkillGroup {
  title: string;
  items: string[];
  tone: "accent" | "emerald" | "amber" | "purple";
  icon: React.ReactElement;
}

const toneClasses: Record<SkillGroup["tone"], {
  dot: string;
  title: string;
  border: string;
  borderHover: string;
  bg: string;
  pill: string;
  glow: string;
}> = {
  accent: {
    dot: "bg-accent",
    title: "text-accent",
    border: "border-accent/15",
    borderHover: "hover:border-accent/40",
    bg: "bg-gradient-to-br from-accent/[0.04] via-card to-card",
    pill: "bg-accent/10 text-accent/90 border-accent/20",
    glow: "shadow-accent/20",
  },
  emerald: {
    dot: "bg-emerald-400",
    title: "text-emerald-400",
    border: "border-emerald-500/15",
    borderHover: "hover:border-emerald-500/40",
    bg: "bg-gradient-to-br from-emerald-500/[0.04] via-card to-card",
    pill: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    glow: "shadow-emerald-500/20",
  },
  amber: {
    dot: "bg-amber-400",
    title: "text-amber-400",
    border: "border-amber-500/15",
    borderHover: "hover:border-amber-500/40",
    bg: "bg-gradient-to-br from-amber-500/[0.04] via-card to-card",
    pill: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    glow: "shadow-amber-500/20",
  },
  purple: {
    dot: "bg-purple-400",
    title: "text-purple-400",
    border: "border-purple-500/15",
    borderHover: "hover:border-purple-500/40",
    bg: "bg-gradient-to-br from-purple-500/[0.04] via-card to-card",
    pill: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    glow: "shadow-purple-500/20",
  },
};

const skillGroups: SkillGroup[] = [
  {
    title: "AI & Agents",
    tone: "accent",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 10v6m11-11h-6m-10 0H1m16.5-6.5l-4.24 4.24m-6.52 6.52L2.5 21.5m0-19l4.24 4.24m6.52 6.52l4.24 4.24" />
      </svg>
    ),
    items: [
      "Multi-agent orchestration",
      "Human approval gates",
      "OpenAI GPT-4o, o1",
      "Claude Opus, Sonnet",
      "RAG pipelines",
      "pgvector, Pinecone",
      "LangChain",
      "RLHF / SFT evaluation",
      "Prompt engineering",
    ],
  },
  {
    title: "Full Stack",
    tone: "emerald",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    items: [
      "React, Next.js",
      "React Native (Expo)",
      "TypeScript, Python",
      "FastAPI, Deno",
      "Supabase (Postgres, Edge, RLS)",
      "Stripe",
      "Google Calendar & Gmail APIs",
      "Redis, Firebase, pgvector",
    ],
  },
  {
    title: "Infrastructure",
    tone: "amber",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
    items: [
      "GitHub Actions CI/CD",
      "Docker Compose",
      "Containerized dev envs",
      "Sentry, Grafana",
      "Structured logging",
      "n8n automation",
      "Cloudflare, Vercel",
    ],
  },
  {
    title: "Process",
    tone: "purple",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    items: [
      "Architect-first",
      "Spec before code",
      "Team lead (3-8 eng)",
      "Cross-functional delivery",
      "SOWs & stakeholder alignment",
      "CodeLens (305 patterns, 9 stacks)",
      "Gogaa CLI (1418 tests, 11 providers)",
    ],
  },
];

export function Skills(): React.ReactElement {
  return (
    <section id="skills" className="py-20 md:py-32 bg-card/30">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            Stack
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 leading-tight">
            What I work with every week.
          </h2>
          <p className="text-sm md:text-base text-muted mb-10 md:mb-16 max-w-lg">
            Not a tool inventory. These are the patterns and technologies behind
            the systems I ship.
          </p>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {skillGroups.map((group, i) => {
            const t = toneClasses[group.tone];
            return (
              <FadeUp key={group.title} delay={i * 0.1}>
                <div
                  className={`group h-full p-5 md:p-6 rounded-xl ${t.bg} border ${t.border} ${t.borderHover} transition-all duration-500 hover:shadow-xl ${t.glow} hover:-translate-y-1 relative overflow-hidden`}
                >
                  {/* Top accent line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30 ${t.title}`}
                  />

                  <div className="flex items-center gap-2 mb-4 md:mb-5">
                    <span
                      className={`w-7 h-7 rounded-md ${t.pill} border flex items-center justify-center ${t.title}`}
                    >
                      {group.icon}
                    </span>
                    <h3 className={`font-bold text-sm md:text-base ${t.title}`}>
                      {group.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className={`px-2 py-1 text-[10px] font-mono rounded border ${t.pill}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>

        {/* Amplified "Why this matters in 2026" — key positioning */}
        <FadeUp delay={0.4}>
          <div className="mt-12 md:mt-20 relative overflow-hidden rounded-2xl border border-accent/25">
            {/* Layered gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.12] via-purple-500/[0.06] to-emerald-500/[0.08]" />
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top accent glow line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

            <div className="relative p-6 md:p-10 lg:p-12 grid md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
              <div>
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <p className="text-[10px] md:text-xs font-mono text-accent uppercase tracking-[0.25em]">
                    Why this matters in 2026
                  </p>
                </div>
                <p className="text-base md:text-xl lg:text-2xl text-foreground leading-relaxed md:leading-snug font-light">
                  Senior AI engineer demand is surging while entry-level roles
                  flatten. Companies don&apos;t need more people who write
                  code. They need people who{" "}
                  <span className="text-accent font-medium">
                    design systems, manage AI agents, and make product decisions.
                  </span>
                </p>
                <p className="text-xs md:text-sm text-muted mt-4 md:mt-5 max-w-2xl leading-relaxed">
                  That&apos;s the intersection where I operate: technical depth,
                  system architecture, and the judgment to know what to build.
                </p>
              </div>

              {/* Side stat */}
              <div className="hidden md:flex flex-col items-center justify-center px-6 py-4 rounded-xl bg-card/50 border border-accent/20 backdrop-blur-sm">
                <p className="text-4xl lg:text-5xl font-bold font-mono text-accent">
                  8×
                </p>
                <p className="text-[10px] font-mono text-muted/70 mt-1 text-center leading-tight">
                  senior AI<br />role growth<br />
                  <span className="text-muted/40">2023 → 2026</span>
                </p>
              </div>

              {/* Mobile stat bar */}
              <div className="md:hidden flex items-center gap-3 pt-4 border-t border-accent/20">
                <p className="text-3xl font-bold font-mono text-accent">8×</p>
                <p className="text-[10px] font-mono text-muted/70 leading-tight">
                  senior AI role growth
                  <br />
                  <span className="text-muted/40">2023 → 2026</span>
                </p>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
