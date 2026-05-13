export interface SkillNode {
  id: string;
  label: string;
  group: "ai" | "frontend" | "backend" | "infra" | "tools";
  level: number; // 1-5, affects node size
}

export interface SkillEdge {
  from: string;
  to: string;
}

export const skillNodes: SkillNode[] = [
  // AI / ML
  { id: "claude", label: "Claude", group: "ai", level: 5 },
  { id: "openai", label: "OpenAI", group: "ai", level: 5 },
  { id: "groq", label: "Groq", group: "ai", level: 4 },
  { id: "pgvector", label: "pgvector", group: "ai", level: 4 },
  { id: "langchain", label: "LangChain", group: "ai", level: 3 },
  { id: "rag", label: "RAG", group: "ai", level: 5 },
  { id: "agents", label: "Agents", group: "ai", level: 5 },

  // Frontend
  { id: "react", label: "React", group: "frontend", level: 5 },
  { id: "nextjs", label: "Next.js", group: "frontend", level: 5 },
  { id: "typescript", label: "TypeScript", group: "frontend", level: 5 },
  { id: "tailwind", label: "Tailwind", group: "frontend", level: 5 },
  { id: "framer", label: "Framer Motion", group: "frontend", level: 4 },

  // Backend
  { id: "nodejs", label: "Node.js", group: "backend", level: 5 },
  { id: "python", label: "Python", group: "backend", level: 4 },
  { id: "fastapi", label: "FastAPI", group: "backend", level: 3 },
  { id: "supabase", label: "Supabase", group: "backend", level: 5 },
  { id: "postgres", label: "PostgreSQL", group: "backend", level: 5 },
  { id: "stripe", label: "Stripe", group: "backend", level: 4 },

  // Infra
  { id: "docker", label: "Docker", group: "infra", level: 4 },
  { id: "linux", label: "Linux", group: "infra", level: 4 },
  { id: "github-actions", label: "GitHub Actions", group: "infra", level: 4 },
  { id: "cloudflare", label: "Cloudflare", group: "infra", level: 3 },
  { id: "traefik", label: "Traefik", group: "infra", level: 3 },

  // Tools I built
  { id: "codelens", label: "CodeLens", group: "tools", level: 5 },
  { id: "gogaa", label: "Gogaa CLI", group: "tools", level: 5 },
  { id: "rasad", label: "Rasad", group: "tools", level: 4 },
];

export const skillEdges: SkillEdge[] = [
  // AI cluster
  { from: "claude", to: "agents" },
  { from: "openai", to: "agents" },
  { from: "openai", to: "rag" },
  { from: "groq", to: "agents" },
  { from: "pgvector", to: "rag" },
  { from: "pgvector", to: "postgres" },
  { from: "langchain", to: "rag" },
  { from: "langchain", to: "agents" },

  // Frontend cluster
  { from: "react", to: "nextjs" },
  { from: "react", to: "typescript" },
  { from: "react", to: "tailwind" },
  { from: "react", to: "framer" },
  { from: "nextjs", to: "typescript" },

  // Backend cluster
  { from: "nodejs", to: "typescript" },
  { from: "python", to: "fastapi" },
  { from: "supabase", to: "postgres" },
  { from: "supabase", to: "pgvector" },
  { from: "stripe", to: "supabase" },

  // Infra
  { from: "docker", to: "linux" },
  { from: "docker", to: "traefik" },
  { from: "github-actions", to: "docker" },
  { from: "cloudflare", to: "nextjs" },

  // Tools connect to their stacks
  { from: "codelens", to: "typescript" },
  { from: "codelens", to: "agents" },
  { from: "gogaa", to: "typescript" },
  { from: "gogaa", to: "claude" },
  { from: "rasad", to: "typescript" },
  { from: "rasad", to: "react" },

  // Cross-cluster bridges
  { from: "agents", to: "supabase" },
  { from: "nextjs", to: "supabase" },
  { from: "nextjs", to: "nodejs" },
];

export const groupColors: Record<SkillNode["group"], string> = {
  ai: "#f59558",      // accent
  frontend: "#7dd3fc", // accent-secondary
  backend: "#34d399",  // emerald
  infra: "#a78bfa",    // violet
  tools: "#a07868",    // leather accent
};
