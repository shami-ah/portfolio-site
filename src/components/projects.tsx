"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "./motion";

interface Project {
  title: string;
  subtitle: string;
  type: string;
  impact: string;
  architecture?: string;
  features: string[];
  stack: string[];
  github?: string;
  live?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: "CodeLens",
    subtitle: "Universal AI Code Review System",
    type: "Open Source (MIT)",
    impact:
      "Reviews code in <1 second with zero runtime dependencies. Beats commercial tools on speed while running 100% locally.",
    architecture:
      "Git Diff \u2192 AST-aware Parser \u2192 Persistent Codebase Index (call graph + schema graph + type graph) \u2192 Incremental Update (60ms) \u2192 5-Pass Review Engine \u2192 AI Reasoning Layer \u2192 Self-Learning Feedback Loop",
    features: [
      "5-pass hybrid review engine: deterministic patterns + AI reasoning",
      "113 patterns across 4 stacks with OWASP/CWE mapping",
      "Persistent codebase index: 62K+ edges call graph, schema graph, column registry",
      "Self-learning noise filter with TF-IDF similarity (zero deps)",
      "Dual-mode: Terminal (<1s) + AI Agent mode (Claude/Codex/Gemini/Cursor)",
      "Performance: First index 4.0s | Incremental 60ms | 7-file review 780ms",
    ],
    stack: [
      "TypeScript",
      "Regex Parsers",
      "JSON Index",
      "GitHub Actions",
      "Claude Code",
    ],
    github: "https://github.com/shami-ah/codelens",
    featured: true,
  },
  {
    title: "OpenEvent",
    subtitle: "AI-Powered Event Management Platform",
    type: "Production SaaS",
    impact:
      "Automated 80% of manual event coordination tasks, reducing team response time from hours to minutes.",
    architecture:
      "Client Email (Gmail/Outlook/IMAP) \u2192 Thread Dedup \u2192 AI Intent Classification (GPT) \u2192 Entity Extraction + pgvector \u2192 Prioritized Task Inbox \u2192 Human Review \u2192 Workflow Engine (JSON/YAML) \u2192 Execution (Calendar, Stripe, CRM) \u2192 Audit Log",
    features: [
      "Email-to-Task Automation: ingests emails, deduplicates threads, extracts intent & entities",
      "Human-in-the-loop Workflows: AI proposes actions, humans approve/edit/reject",
      "Declarative Workflow Engine: JSON/YAML with conditionals, parallel nodes, LLM tasks",
      "Contextual Enrichment: vector search for template matching and historical lookup",
      "Integrations: Calendar (Google/Outlook), Stripe invoicing, CRM sync, webhooks",
    ],
    stack: [
      "React",
      "TypeScript",
      "Supabase",
      "OpenAI",
      "pgvector",
      "Stripe",
      "Docker",
    ],
    featured: true,
  },
  {
    title: "Gluten-Free Deals & Dining",
    subtitle: "Cross-Platform Consumer App",
    type: "Web + iOS + Android",
    impact:
      "Unified experience for gluten-free shoppers: deals from 40+ retailers, nearby restaurants, AI recipe generation.",
    features: [
      "LLM-generated 200+ search queries covering 40+ retailers & 30+ brands",
      "Concurrent scraping via SerpAPI + Tavily with deduplication & scoring",
      "GPS-based restaurant finder with Google Maps integration",
      "AI recipe generation with ingredients, nutrition, and substitution tips",
    ],
    stack: [
      "React Native",
      "Next.js",
      "Python",
      "OpenAI",
      "Firebase",
      "Google Maps",
    ],
  },
  {
    title: "RAG Pipeline",
    subtitle: "Domain-Specific Question Answering",
    type: "AI Infrastructure",
    impact:
      "Scalable knowledge retrieval from unstructured content like PDFs and internal knowledge bases.",
    features: [
      "Retrieval-Augmented Generation combining vector search and LLMs",
      "Pinecone for real-time vector similarity search + OpenAI for generation",
      "Chunking and embedding pipeline with FAISS-compatible transformers",
      "Context preservation across long-form queries",
    ],
    stack: ["Python", "Pinecone", "OpenAI GPT-4", "LangChain", "Streamlit"],
    github: "https://github.com/shami-ah/rag-gpt-pinecone",
  },
  {
    title: "Multimodal VQA Agent",
    subtitle: "Visual Question Answering",
    type: "AI Research",
    impact:
      "GenAI agent that answers queries from image input using multimodal architecture.",
    features: [
      "BLIP-2 + LLM multimodal architecture for image understanding",
      "RAG components and prompt chains for contextual reasoning",
      "Real-time Streamlit interface for live testing",
    ],
    stack: ["Python", "BLIP-2", "OpenAI", "Hugging Face", "Streamlit"],
    github: "https://github.com/shami-ah/VQA_Dataset",
  },
];

function ProjectCard({ project }: { project: Project }): React.ReactElement {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
        project.featured
          ? "bg-card border-accent/20 hover:border-accent/40 md:col-span-full"
          : "bg-card border-card-border hover:border-accent/20"
      }`}
    >
      <div className="p-5 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold">{project.title}</h3>
              {project.featured && (
                <span className="px-2 py-0.5 text-xs font-mono bg-accent/10 text-accent border border-accent/20 rounded">
                  Featured
                </span>
              )}
            </div>
            <p className="text-muted text-sm">{project.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-mono bg-card-hover text-muted rounded-md border border-card-border">
              {project.type}
            </span>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors"
                aria-label="GitHub"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        <p className="text-sm text-accent/90 mb-4 font-medium">
          {project.impact}
        </p>

        {/* Architecture flow for featured projects */}
        {project.architecture && (
          <div className="mb-6 p-4 rounded-lg bg-background/50 border border-card-border">
            <p className="text-xs font-mono text-muted mb-2 uppercase tracking-wider">
              System Architecture
            </p>
            <p className="text-xs font-mono text-accent/70 leading-relaxed">
              {project.architecture}
            </p>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-muted hover:text-accent transition-colors font-mono flex items-center gap-2"
        >
          {expanded ? "Show less" : "Show details"}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            &darr;
          </motion.span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-card-border">
                <ul className="space-y-2 mb-4">
                  {project.features.map((f) => (
                    <li
                      key={f.slice(0, 30)}
                      className="text-sm text-muted flex gap-2"
                    >
                      <span className="text-accent shrink-0">&bull;</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs font-mono bg-accent/5 text-accent/80 rounded-md border border-accent/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function Projects(): React.ReactElement {
  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <p className="text-sm font-mono text-accent mb-4 uppercase tracking-wider">
            Projects
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            Systems I&apos;ve built.
            <span className="text-muted"> Not just apps.</span>
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <FadeUp key={project.title} delay={i * 0.05}>
              <ProjectCard project={project} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
