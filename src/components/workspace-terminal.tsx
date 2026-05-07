"use client";

import { useState, useRef, useEffect } from "react";

interface TermLine {
  type: "input" | "output";
  text: string;
}

const COMMANDS: Record<string, string> = {
  help: `Available commands:
  help       — show this message
  about      — who am I
  skills     — my tech stack
  projects   — what I've built
  status     — live system status
  contact    — how to reach me
  clear      — clear terminal`,

  about: `Ahtesham Ahmad · AI Engineer

AI engineer building production AI systems end-to-end.
Multi-agent architectures with human approval gates,
AI-powered SaaS from schema to polished UI,
and the open-source tooling to build them right.

Currently: Lead AI Developer @ More Life Hospitality GmbH
Building: OpenEvent (100+ clients live)
Tools: Gogaa CLI, CodeLens, Rasad`,

  skills: `// skills.json
{
  "ai":       ["Claude", "GPT-4", "Groq", "pgvector", "RAG", "Agents"],
  "frontend": ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"],
  "backend":  ["Node.js", "Python", "FastAPI", "Supabase", "PostgreSQL", "Stripe"],
  "infra":    ["Docker", "Linux", "GitHub Actions", "Cloudflare", "Traefik"],
  "tools":    ["CodeLens (code review)", "Gogaa CLI (coding agent)", "Rasad (analytics)"]
}`,

  projects: `Flagship systems:
  ▸ OpenEvent     — AI email processing for hospitality (100+ clients live)
  ▸ CodeLens      — AI code review engine (~430 patterns, 9 stacks)
  ▸ Gogaa CLI     — Open-source coding agent (1,418 tests)
  ▸ Rasad         — Dev analytics & session insights

Other work:
  ▸ Command Center, RAG Pipeline, VQA Agent, Dev Environment
  ▸ 250+ production projects globally
  ▸ 40+ long-term client relationships`,

  status: `SYSTEM STATUS — all services operational

  openevent      ● LIVE    100+ clients, 150+ events
  gogaa-cli      ● BETA    v0.10.0, 1,418 tests passing
  codelens       ● BETA    v0.3.5, ~430 patterns armed
  rasad          ● ALPHA   analytics engine running
  portfolio      ● ONLINE  command center active
  wadwarehouse   ● ONLINE  server healthy`,

  contact: `// contact.yaml
name:         "Ahtesham Ahmad"
email:        shami8024@gmail.com
github:       github.com/shami-ah
linkedin:     linkedin.com/in/muhammad-ahtesham-ahmad
upwork:       rising talent · 100% job success
availability: full-time & 90-day engagements

→ Book a call: ahtesham.dev.wadwarehouse.com/book`,
};

export function WorkspaceTerminal(): React.ReactElement {
  const [lines, setLines] = useState<TermLine[]>([
    { type: "output", text: "Welcome to Shami's Command Center" },
    { type: "output", text: 'Type "help" for available commands.' },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newLines: TermLine[] = [
      ...lines,
      { type: "input", text: `$ ${cmd}` },
    ];

    if (cmd === "clear") {
      setLines([]);
      setInput("");
      return;
    }

    const response = COMMANDS[cmd];
    if (response) {
      newLines.push({ type: "output", text: response });
    } else {
      newLines.push({ type: "output", text: `command not found: ${cmd}. Type "help" for available commands.` });
    }
    newLines.push({ type: "output", text: "" });

    setLines(newLines);
    setInput("");
  };

  return (
    <div
      className="flex flex-col h-full bg-card/80 rounded-xl border border-card-border overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-card-border bg-card/50 shrink-0">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[10px] font-mono text-muted/60 ml-2">shami@command-center ~ terminal</span>
      </div>

      {/* Output area */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-[12px] md:text-[13px] leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className={line.type === "input" ? "text-accent" : "text-muted/70"}>
            {line.text.split("\n").map((l, j) => (
              <div key={j} className="min-h-[1.4em]">{l || "\u00a0"}</div>
            ))}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-card-border bg-card/30 shrink-0">
        <span className="text-accent text-[13px] font-mono">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type a command..."
          className="flex-1 bg-transparent text-[13px] font-mono text-foreground placeholder:text-muted/30 outline-none"
          autoFocus
        />
      </form>
    </div>
  );
}
