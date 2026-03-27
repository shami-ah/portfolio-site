"use client";

import { useRef } from "react";

const ACCENT = "#3b82f6";

export function VisualCV(): React.ReactElement {
  const cvRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    window.print();
  };

  return (
    <>
      {/* Download button - hidden in print */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={handleDownload}
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <polyline points="9 15 12 18 15 15" />
          </svg>
          Download PDF
        </button>
        <a
          href="/"
          className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
        >
          ← Portfolio
        </a>
      </div>

      {/* CV Content - optimized for both screen and print */}
      <div
        ref={cvRef}
        className="max-w-[850px] mx-auto bg-white text-zinc-900 print:max-w-none print:mx-0 min-h-screen"
      >
        {/* Header */}
        <header className="px-10 pt-10 pb-6 border-b-2" style={{ borderColor: ACCENT }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Ahtesham Ahmad</h1>
              <p className="text-lg font-medium mt-1" style={{ color: ACCENT }}>AI Automation Architect</p>
              <p className="text-sm text-zinc-500 mt-2 max-w-md">
                I build AI systems that run businesses — designing production architectures where agents classify, orchestrate, execute, and learn.
              </p>
            </div>
            <div className="text-right text-xs text-zinc-500 space-y-1 min-w-[180px]">
              <p>📧 iamshami1996@gmail.com</p>
              <p>🔗 <a href="https://linkedin.com/in/muhammad-ahtesham-ahmad-a153801b5" className="underline" style={{ color: ACCENT }}>linkedin.com/in/ahtesham</a></p>
              <p>💻 <a href="https://github.com/shami-ah" className="underline" style={{ color: ACCENT }}>github.com/shami-ah</a></p>
              <p>🌐 <a href="https://portfolio-site-alpha.pages.dev" className="underline" style={{ color: ACCENT }}>portfolio-site-alpha.pages.dev</a></p>
              <p>📍 Islamabad, Pakistan · Remote</p>
            </div>
          </div>

          {/* Architecture flow bar */}
          <div className="mt-5 flex items-center gap-1 text-[10px] font-mono">
            {["Ingest", "Classify", "Orchestrate", "Review", "Execute", "Observe"].map((step, i) => (
              <span key={step} className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded text-white text-[10px]" style={{ background: ACCENT }}>
                  {step}
                </span>
                {i < 5 && <span className="text-zinc-300">→</span>}
              </span>
            ))}
          </div>
        </header>

        <div className="px-10 py-6 grid grid-cols-[1fr_220px] gap-8 print:gap-6">
          {/* Left Column - Main Content */}
          <div className="space-y-5">
            {/* Experience */}
            <Section title="Experience">
              <Role
                title="Lead AI Developer"
                company="MORE LIFE Hospitality GmbH"
                period="Sep 2025 — Present"
                location="Zurich, Switzerland · Remote"
                items={[
                  "Architected end-to-end AI orchestration for event management: email → classification → task extraction → workflow execution → auto-approval",
                  "Built production Supabase Edge Functions for LLM calls, entity extraction, and workflow triggers processing real revenue",
                  "Designed multi-agent system with planner/worker/validator pattern, human-in-the-loop approval gates",
                  "Implemented Stripe payment integration, RLS policies, and compliance auditing",
                  "Tech: React, TypeScript, Supabase, Stripe, Claude API, GitHub Actions",
                ]}
              />
              <Role
                title="Director IT & R&D"
                company="Rouelite"
                period="2022 — 2024"
                location="Remote"
                items={[
                  "Led 10-person engineering team building custom CRM and business automation platform",
                  "Designed system architecture for customer lifecycle management serving 500+ daily users",
                  "Implemented agile workflows (JIRA, Git) reducing delivery cycles by 40%",
                ]}
              />
              <Role
                title="AI Engineer & Full-Stack Developer"
                company="Freelance (Upwork / Fiverr)"
                period="2019 — Present"
                location="Remote · Global clients"
                items={[
                  "250+ projects delivered across AI, full-stack development, and automation — 100% Job Success on Upwork",
                  "Built RAG pipelines, prompt engineering systems, and AI-powered workflows for international clients",
                  "Worked with Outlier, Translated, RWS on LLM evaluation, RLHF, and prompt engineering research",
                ]}
              />
            </Section>

            {/* Key Projects */}
            <Section title="Key Projects">
              <Project
                name="CodeLens"
                label="Open Source · github.com/shami-ah/codelens"
                description="Universal AI code review engine — 154 patterns, security taint tracking (source→sink with CWE/OWASP), PR risk scoring (1-10), code explanation via persistent index. Zero runtime dependencies, <1s reviews. Works with Claude Code, Codex, Gemini, Cursor."
              />
              <Project
                name="OpenEvent"
                label="Production SaaS"
                description="AI-powered event management platform processing real revenue. AI orchestration pipeline: email threads → entity extraction → task classification → workflow execution → auto-approval with human gates. React + TypeScript + Supabase + Stripe."
              />
              <Project
                name="Shami Command Center"
                label="Developer Tool"
                description="Unified dev command center with Claude API, Google Gemini, Supabase, Gmail/Calendar integration. PWA with push notifications."
              />
            </Section>

            {/* Education */}
            <Section title="Education">
              <div className="flex justify-between items-baseline">
                <div>
                  <p className="font-semibold text-sm">Bachelor of Engineering — Electrical & Electronics</p>
                  <p className="text-xs text-zinc-500">Sukkur IBA University</p>
                </div>
                <p className="text-xs text-zinc-400 whitespace-nowrap">2017 — 2020 · Grade A</p>
              </div>
            </Section>
          </div>

          {/* Right Column - Skills & Extras */}
          <div className="space-y-5 border-l border-zinc-100 pl-6 print:pl-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { n: "250+", l: "Projects" },
                { n: "5+", l: "Years" },
                { n: "100%", l: "Job Success" },
                { n: "<1s", l: "Code Review" },
              ].map((s) => (
                <div key={s.l} className="text-center p-2 rounded-lg bg-zinc-50">
                  <p className="text-lg font-bold" style={{ color: ACCENT }}>{s.n}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{s.l}</p>
                </div>
              ))}
            </div>

            <SkillGroup title="AI & ML" skills={["Claude API", "OpenAI", "LangChain", "RAG", "Prompt Engineering", "RLHF/SFT", "Multi-Agent Systems", "Taint Analysis"]} />
            <SkillGroup title="Full Stack" skills={["TypeScript", "React", "Next.js", "Node.js", "Python", "Tailwind", "Supabase", "PostgreSQL"]} />
            <SkillGroup title="Infrastructure" skills={["GitHub Actions", "Docker", "Cloudflare", "Hostinger VPS", "Stripe", "n8n", "Playwright"]} />
            <SkillGroup title="Process" skills={["System Design", "Agile/Scrum", "Code Review", "CI/CD", "Git Workflows", "Technical Writing"]} />

            {/* Certifications */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">Certifications</p>
              <div className="space-y-1.5 text-xs text-zinc-600">
                <p>Generative AI & LLMs — IBM</p>
                <p>Project Management — Google</p>
                <p>Gen AI for PMs — PMI</p>
              </div>
            </div>

            {/* Languages */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">Languages</p>
              <div className="space-y-1 text-xs text-zinc-600">
                <p>English — Professional</p>
                <p>German — Basic</p>
                <p>Urdu — Native</p>
              </div>
            </div>

            {/* Building Next */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">Building Next</p>
              <div className="space-y-1.5 text-xs text-zinc-600">
                <p>🔬 CodeLens v0.3 — AST integration</p>
                <p>🤖 AI Agent Orchestrator</p>
                <p>📊 LLM Observability Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            background: white !important;
            color: #18181b !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:max-w-none {
            max-width: none !important;
          }
          .print\\:mx-0 {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .print\\:gap-6 {
            gap: 1.5rem !important;
          }
          .print\\:pl-4 {
            padding-left: 1rem !important;
          }
        }
      `}</style>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }): React.ReactElement {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider pb-1.5 mb-3 border-b" style={{ color: ACCENT, borderColor: `${ACCENT}30` }}>
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Role({ title, company, period, location, items }: {
  title: string; company: string; period: string; location: string; items: string[];
}): React.ReactElement {
  return (
    <div>
      <div className="flex justify-between items-baseline">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-zinc-400 whitespace-nowrap">{period}</p>
      </div>
      <p className="text-xs text-zinc-500">{company} · {location}</p>
      <ul className="mt-1.5 space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-zinc-600 pl-3 relative before:content-['▸'] before:absolute before:left-0 before:text-zinc-300 before:text-[10px]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Project({ name, label, description }: {
  name: string; label: string; description: string;
}): React.ReactElement {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <p className="font-semibold text-sm">{name}</p>
        <span className="text-[10px] px-1.5 py-0.5 rounded text-white" style={{ background: ACCENT }}>{label}</span>
      </div>
      <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{description}</p>
    </div>
  );
}

function SkillGroup({ title, skills }: { title: string; skills: string[] }): React.ReactElement {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">{title}</p>
      <div className="flex flex-wrap gap-1">
        {skills.map((skill) => (
          <span key={skill} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-50 text-zinc-600 border border-zinc-100">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
