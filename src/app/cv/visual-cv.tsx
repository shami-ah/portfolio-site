"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const ACCENT = "#3b82f6";
const AMBER = "#f59e0b";

// Counter animation hook
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const count = useCounter(value);
  return <>{count}{suffix}</>;
}

// Architecture flow node
function FlowNode({ label, delay, isLast }: { label: string; delay: number; isLast?: boolean }) {
  return (
    <motion.div
      className="flex items-center gap-1"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
    >
      <motion.span
        className="px-2.5 py-1 rounded-md text-xs font-mono font-medium border backdrop-blur-sm"
        style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}15`, color: ACCENT }}
        whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${ACCENT}40` }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
      {!isLast && (
        <motion.span
          className="text-zinc-600 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.3 }}
        >→</motion.span>
      )}
    </motion.div>
  );
}

// Skill bar with glow
function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex justify-between text-xs mb-1">
        <span className="text-zinc-300 group-hover:text-white transition-colors">{name}</span>
        <span className="text-zinc-500 font-mono">{level}%</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}cc)`, boxShadow: `0 0 10px ${ACCENT}40` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

// Timeline dot with pulse
function TimelineDot({ active }: { active?: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      <div className={`w-3 h-3 rounded-full border-2 ${active ? "border-blue-500 bg-blue-500/30" : "border-zinc-600 bg-zinc-800"}`} />
      {active && (
        <motion.div
          className="absolute w-3 h-3 rounded-full border border-blue-500/50"
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
}

export function VisualCV(): React.ReactElement {
  const handleDownload = () => window.print();

  const flowSteps = ["Ingest", "Classify", "Orchestrate", "Review", "Execute", "Observe"];

  return (
    <>
      {/* Floating controls */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <motion.button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-500/90 hover:bg-blue-500 text-white rounded-lg text-sm font-medium backdrop-blur-sm border border-blue-400/30 flex items-center gap-2 shadow-lg shadow-blue-500/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><polyline points="9 15 12 18 15 15" /></svg>
          PDF
        </motion.button>
        <a href="/" className="px-4 py-2 bg-zinc-800/90 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium backdrop-blur-sm border border-zinc-700/50">← Back</a>
      </div>

      {/* Screen version - dark, animated */}
      <div className="print:hidden min-h-screen bg-[#09090b] text-white overflow-hidden">
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-16">
          {/* Header */}
          <motion.header
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <motion.p
                  className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >Curriculum Vitae</motion.p>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  Ahtesham
                  <span className="block" style={{ color: ACCENT }}>Ahmad</span>
                </h1>
                <motion.p
                  className="text-lg text-zinc-400 mt-3 font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >AI Automation Architect</motion.p>
                <motion.p
                  className="text-sm text-zinc-500 mt-4 max-w-md leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >5+ years shipping production AI systems — from multi-agent orchestration and RAG pipelines to full-stack SaaS. I design architectures where AI agents classify, execute, and learn while humans stay in control.</motion.p>
              </div>
              <motion.div
                className="text-sm text-zinc-500 space-y-1.5 font-mono"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p>iamshami1996@gmail.com</p>
                <p className="text-blue-400">github.com/shami-ah</p>
                <p className="text-blue-400">linkedin.com/in/ahtesham</p>
                <p className="text-blue-400">portfolio-site-alpha.pages.dev</p>
                <p>Islamabad, PK · Remote</p>
              </motion.div>
            </div>

            {/* Architecture flow - animated */}
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {flowSteps.map((step, i) => (
                <FlowNode key={step} label={step} delay={0.8 + i * 0.15} isLast={i === flowSteps.length - 1} />
              ))}
            </motion.div>

            {/* Divider line with glow */}
            <motion.div
              className="mt-8 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            />
          </motion.header>

          {/* Stats row */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {[
              { n: 250, s: "+", l: "Projects Delivered" },
              { n: 5, s: "+", l: "Years Experience" },
              { n: 100, s: "%", l: "Upwork Job Success" },
              { n: 154, s: "", l: "CodeLens Patterns" },
            ].map((stat, i) => (
              <motion.div
                key={stat.l}
                className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm text-center group hover:border-blue-500/30 transition-colors"
                whileHover={{ y: -4, boxShadow: `0 8px 30px ${ACCENT}10` }}
              >
                <p className="text-3xl font-bold font-mono" style={{ color: i === 3 ? AMBER : ACCENT }}>
                  <AnimatedCounter value={stat.n} suffix={stat.s} />
                </p>
                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{stat.l}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-[1fr_300px] gap-12">
            {/* Left - Experience & Projects */}
            <div className="space-y-12">
              {/* Experience */}
              <Section title="Experience" icon="▸">
                <TimelineRole active title="Lead AI Developer" company="MORE LIFE Hospitality GmbH" period="Sep 2025 — Present" location="Zurich · Remote" items={[
                  "Architected AI orchestration: email → classification → task extraction → workflow execution → auto-approval",
                  "Built Supabase Edge Functions for LLM calls, entity extraction, and workflow triggers",
                  "Designed multi-agent system with planner/worker/validator pattern + human-in-the-loop approval",
                  "Shipped React frontend: Task Inbox, Workflow Runner, Approval Flows, Marketing Hub, Admin Dashboard",
                  "React + TypeScript + Supabase + Stripe + Claude API + GitHub Actions",
                ]} />
                <TimelineRole title="Director IT & R&D" company="Rouelite Techno Pvt. Ltd." period="2022 — 2024" location="Remote" items={[
                  "Led 10-person team building custom CRM and business automation",
                  "Designed system architecture serving 500+ daily users",
                  "Introduced AI into daily operations, reducing manual data entry by 70%",
                  "Replaced 3 legacy spreadsheet processes with React + Supabase internal tools",
                  "Implemented agile workflows reducing delivery cycles by 40%",
                ]} />
                <TimelineRole title="AI Engineer & Full-Stack Dev" company="Freelance · Upwork / Fiverr" period="2019 — Present" location="Remote · Global" items={[
                  "250+ projects — RAG pipelines, prompt engineering, AI workflows, analytics dashboards",
                  "100% Job Success on Upwork · 40+ returning long-term clients",
                  "500+ RLHF/SFT evaluation sessions on frontier models (Outlier, RWS, Translated)",
                ]} />
              </Section>

              {/* Key Projects */}
              <Section title="Key Projects" icon="◆">
                <ProjectCard name="CodeLens" tag="Open Source" tagColor={ACCENT} description="154-pattern AI code review engine with security taint tracking, PR risk scoring, and code explanation. Zero deps, <1s reviews." link="github.com/shami-ah/codelens" />
                <ProjectCard name="OpenEvent" tag="Production SaaS" tagColor={AMBER} description="AI-powered event management processing real revenue. Multi-agent orchestration: email → entity extraction → workflow → auto-approval." />
                <ProjectCard name="Command Center" tag="Developer Tool" tagColor="#10b981" description="Unified dev interface with Claude API, Google Gemini, Supabase, Gmail/Calendar integration. PWA with push notifications." link="github.com/shami-ah/shami-command-center" />
                <ProjectCard name="Gluten-Free Deals & Dining" tag="Cross-Platform" tagColor="#8b5cf6" description="React Native + Next.js app. LLM-generated 200+ search queries, concurrent scraping from 40+ retailers, GPS restaurant finder, AI recipe generation." />
                <ProjectCard name="RAG Pipeline" tag="AI Infrastructure" tagColor="#ec4899" description="Domain-specific Q&A system with Pinecone vector search, LangChain chunking, GPT-4 answer generation. Sub-second retrieval from thousands of document chunks." link="github.com/shami-ah/rag-gpt-pinecone" />
              </Section>

              {/* Education */}
              <Section title="Education" icon="◈">
                <motion.div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <p className="font-semibold text-sm">B.Eng — Electrical & Electronics Engineering</p>
                      <p className="text-xs text-zinc-500">Sukkur IBA University</p>
                    </div>
                    <p className="text-xs text-zinc-600 font-mono">2017 — 2020 · Grade A</p>
                  </div>
                </motion.div>
              </Section>
            </div>

            {/* Right - Skills & Meta */}
            <div className="space-y-8">
              {/* Skills with animated bars */}
              <Section title="AI & ML" icon="⚡">
                {["Claude API", "OpenAI / LangChain", "RAG Pipelines", "Multi-Agent Systems", "Prompt Engineering", "Taint Analysis"].map((s, i) => (
                  <SkillBar key={s} name={s} level={90 - i * 5} delay={i * 0.05} />
                ))}
              </Section>

              <Section title="Full Stack" icon="⚙">
                {["TypeScript / React", "Next.js", "Supabase / PostgreSQL", "Node.js / Python", "Tailwind / Framer"].map((s, i) => (
                  <SkillBar key={s} name={s} level={92 - i * 4} delay={i * 0.05} />
                ))}
              </Section>

              <Section title="Infrastructure" icon="☁">
                {["GitHub Actions / CI", "Docker / Cloudflare", "Stripe Integration", "Playwright / n8n"].map((s, i) => (
                  <SkillBar key={s} name={s} level={88 - i * 5} delay={i * 0.05} />
                ))}
              </Section>

              <Section title="Process" icon="▹">
                {["Architecture-First Development", "Team Leadership (3-10 people)", "Client-Facing Comms & SOWs", "Code Review Systems (CodeLens)"].map((s, i) => (
                  <SkillBar key={s} name={s} level={90 - i * 5} delay={i * 0.05} />
                ))}
              </Section>

              {/* Certifications */}
              <Section title="Certifications" icon="🎓">
                <div className="space-y-2 text-xs">
                  {["Generative AI & LLMs — IBM", "Project Management — Google", "Gen AI for PMs — PMI"].map((cert, i) => (
                    <motion.p key={cert} className="text-zinc-400 pl-3 border-l border-zinc-800" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>{cert}</motion.p>
                  ))}
                </div>
              </Section>

              {/* Languages */}
              <Section title="Languages" icon="🌐">
                <div className="flex gap-2 flex-wrap">
                  {[{ l: "English", v: "Professional" }, { l: "Urdu", v: "Native" }, { l: "Pashtu", v: "Native" }, { l: "Sindhi", v: "Conversational" }, { l: "Arabic", v: "Conversational" }].map((lang) => (
                    <span key={lang.l} className="text-xs px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">{lang.l} · {lang.v}</span>
                  ))}
                </div>
              </Section>

              {/* Building Next */}
              <Section title="Building Next" icon="🚀">
                <div className="space-y-2">
                  {[
                    { icon: "🔬", name: "CodeLens v0.3", status: "Next", color: ACCENT },
                    { icon: "🤖", name: "AI Agent Orchestrator", status: "Designing", color: AMBER },
                    { icon: "📊", name: "LLM Observability", status: "Planned", color: "#10b981" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.name}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ borderColor: `${item.color}40` }}
                    >
                      <span>{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-zinc-300">{item.name}</p>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono" style={{ color: item.color, border: `1px solid ${item.color}40` }}>{item.status}</span>
                    </motion.div>
                  ))}
                </div>
              </Section>
            </div>
          </div>

          {/* Footer */}
          <motion.footer
            className="mt-16 pt-6 border-t border-zinc-800 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
<p className="text-xs text-zinc-600 font-mono">&nbsp;</p>
          </motion.footer>
        </div>
      </div>

      {/* Print version - clean, white, professional */}
      <div className="hidden print:block bg-white text-zinc-900 max-w-none">
        <div className="px-10 pt-8 pb-4 border-b-2" style={{ borderColor: ACCENT }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Ahtesham Ahmad</h1>
              <p className="text-sm font-medium" style={{ color: ACCENT }}>AI Automation Architect</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">5+ years shipping production AI — multi-agent orchestration, RAG pipelines, and full-stack SaaS. I design architectures where agents classify, execute, and learn while humans stay in control.</p>
            </div>
            <div className="text-right text-[10px] text-zinc-500 space-y-0.5">
              <p>iamshami1996@gmail.com</p>
              <p>github.com/shami-ah</p>
              <p>portfolio-site-alpha.pages.dev</p>
              <p>linkedin.com/in/ahtesham</p>
              <p>Islamabad, PK · Remote</p>
            </div>
          </div>
          <div className="mt-3 flex gap-1 text-[9px] font-mono">
            {flowSteps.map((s, i) => (<span key={s}><span className="px-1.5 py-0.5 rounded text-white" style={{ background: ACCENT }}>{s}</span>{i < 5 ? " → " : ""}</span>))}
          </div>
        </div>
        <div className="px-10 py-4 grid grid-cols-[1fr_200px] gap-6 text-[11px]">
          <div className="space-y-3">
            <PrintSection title="Experience">
              <PrintRole title="Lead AI Developer" co="MORE LIFE Hospitality GmbH" period="Sep 2025 — Present" items={["AI orchestration: email → classification → task → workflow → auto-approval", "Supabase Edge Functions, Stripe, Claude API, GitHub Actions", "Multi-agent: planner/worker/validator + human-in-the-loop", "Shipped frontend: Task Inbox, Workflow Runner, Marketing Hub, Admin Dashboard"]} />
              <PrintRole title="Director IT & R&D" co="Rouelite Techno Pvt. Ltd." period="2022 — 2024" items={["Led 10-person team, custom CRM, 500+ daily users", "AI integration reduced manual data entry by 70%", "Replaced 3 legacy spreadsheets with React + Supabase tools", "Agile workflows, 40% faster delivery cycles"]} />
              <PrintRole title="AI Engineer & Full-Stack" co="Freelance (Upwork/Fiverr)" period="2019 — Present" items={["250+ projects, 100% Job Success, 40+ returning clients", "500+ RLHF/SFT evaluation sessions (Outlier, RWS, Translated)", "RAG pipelines, prompt engineering, analytics dashboards"]} />
            </PrintSection>
            <PrintSection title="Key Projects">
              <p><strong>CodeLens</strong> (Open Source) — 154-pattern AI code review, taint tracking, PR risk scoring. Zero deps. github.com/shami-ah/codelens</p>
              <p><strong>OpenEvent</strong> (Production SaaS) — AI event management, multi-agent orchestration, Stripe payments</p>
              <p><strong>Command Center</strong> — Unified dev interface, Claude API + Gemini + Supabase + Gmail/Calendar</p>
              <p><strong>Gluten-Free Deals</strong> (Cross-Platform) — React Native + Next.js, LLM scraping from 40+ retailers, GPS restaurant finder</p>
              <p><strong>RAG Pipeline</strong> (AI Infra) — Pinecone + LangChain + GPT-4, sub-second retrieval from thousands of chunks</p>
            </PrintSection>
            <PrintSection title="Education">
              <p><strong>B.Eng Electrical & Electronics</strong> — Sukkur IBA University (2017-2020, Grade A)</p>
            </PrintSection>
          </div>
          <div className="space-y-3 border-l border-zinc-200 pl-4">
            <PrintSection title="Stats"><p>250+ Projects · 5+ Years · 100% Job Success · 154 Patterns</p></PrintSection>
            <PrintSection title="AI & ML"><p>Claude API, OpenAI, LangChain, RAG, Multi-Agent, Prompt Engineering, RLHF, Taint Analysis</p></PrintSection>
            <PrintSection title="Full Stack"><p>TypeScript, React, Next.js, Node.js, Python, Supabase, PostgreSQL, Tailwind</p></PrintSection>
            <PrintSection title="Infrastructure"><p>GitHub Actions, Docker, Cloudflare, Stripe, Playwright, n8n</p></PrintSection>
            <PrintSection title="Process"><p>Architecture-first dev, team leadership (3-10), client comms & SOWs, CodeLens code review</p></PrintSection>
            <PrintSection title="Certs"><p>Gen AI & LLMs (IBM) · PM (Google) · Gen AI for PMs (PMI)</p></PrintSection>
            <PrintSection title="Languages"><p>English (Professional) · Urdu (Native) · Pashtu (Native) · Sindhi (Conversational) · Arabic (Conversational)</p></PrintSection>
            <PrintSection title="Building Next"><p>CodeLens v0.3 (AST) · AI Agent Orchestrator · LLM Observability</p></PrintSection>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { background: white !important; color: #18181b !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
      `}</style>
    </>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
        <span style={{ color: ACCENT }}>{icon}</span> {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}

function TimelineRole({ title, company, period, location, items, active }: { title: string; company: string; period: string; location: string; items: string[]; active?: boolean }) {
  return (
    <motion.div className="flex gap-4" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
      <div className="flex flex-col items-center pt-1">
        <TimelineDot active={active} />
        <div className="flex-1 w-px bg-zinc-800 mt-2" />
      </div>
      <div className="pb-6 flex-1">
        <div className="flex justify-between items-baseline flex-wrap gap-2">
          <p className="font-semibold text-sm text-zinc-200">{title}</p>
          <p className="text-xs text-zinc-600 font-mono">{period}</p>
        </div>
        <p className="text-xs text-zinc-500">{company} · {location}</p>
        <ul className="mt-2 space-y-1">
          {items.map((item, i) => (
            <motion.li key={i} className="text-xs text-zinc-400 pl-3 relative before:content-['▸'] before:absolute before:left-0 before:text-blue-500/50 before:text-[10px]" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function ProjectCard({ name, tag, tagColor, description, link }: { name: string; tag: string; tagColor: string; description: string; link?: string }) {
  return (
    <motion.div
      className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-all group"
      whileHover={{ y: -2, boxShadow: `0 4px 20px ${tagColor}10` }}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-baseline gap-2 mb-1">
        <p className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors">{name}</p>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono" style={{ color: tagColor, border: `1px solid ${tagColor}40` }}>{tag}</span>
      </div>
      <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
      {link && <p className="text-[10px] text-blue-400/60 mt-1.5 font-mono">{link}</p>}
    </motion.div>
  );
}

function PrintSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-wider pb-0.5 mb-1 border-b" style={{ color: ACCENT, borderColor: `${ACCENT}30` }}>{title}</h3>
      <div className="space-y-0.5 text-[10px] text-zinc-600">{children}</div>
    </div>
  );
}

function PrintRole({ title, co, period, items }: { title: string; co: string; period: string; items: string[] }) {
  return (
    <div className="mb-1.5">
      <div className="flex justify-between"><span className="font-semibold">{title}</span><span className="text-zinc-400">{period}</span></div>
      <p className="text-zinc-500">{co}</p>
      <ul className="mt-0.5">{items.map((item, i) => (<li key={i} className="pl-2 relative before:content-['▸'] before:absolute before:left-0 before:text-zinc-300">{item}</li>))}</ul>
    </div>
  );
}
