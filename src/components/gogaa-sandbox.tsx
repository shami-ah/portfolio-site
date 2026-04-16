"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Line {
  id: string;
  kind: "user" | "info" | "ok" | "warn" | "tool" | "stream";
  text: string;
}

interface SandboxCommand {
  output: Line[];
}

const commands: Record<string, SandboxCommand> = {
  help: {
    output: [
      { id: "h1", kind: "info", text: "Available commands:" },
      { id: "h2", kind: "tool", text: "  /help           — this help" },
      { id: "h3", kind: "tool", text: "  /model          — list available models" },
      { id: "h4", kind: "tool", text: "  /commit         — LLM-generated commit from staged diff" },
      { id: "h5", kind: "tool", text: "  /plugins        — open plugin marketplace" },
      { id: "h6", kind: "tool", text: "  /sessions       — list WAL-persisted sessions" },
      { id: "h7", kind: "tool", text: "  explain <file>  — ask the agent to explain a file" },
      { id: "h8", kind: "tool", text: "  add a jwt guard — edit flow with SEARCH/REPLACE" },
    ],
  },
  "/model": {
    output: [
      { id: "m1", kind: "info", text: "❯ 11 providers available, auto-fallback on rate-limits:" },
      { id: "m2", kind: "ok", text: "  ●  claude-sonnet-4-6        (current · Anthropic)" },
      { id: "m3", kind: "tool", text: "  ○  gpt-5                    (OpenAI)" },
      { id: "m4", kind: "tool", text: "  ○  gemini-2.5-pro           (Google)" },
      { id: "m5", kind: "tool", text: "  ○  minimax-m2.7             (direct · ~90% cheaper)" },
      { id: "m6", kind: "tool", text: "  ○  groq/llama-3.3-70b       (free tier)" },
      { id: "m7", kind: "tool", text: "  ○  deepseek-v3, codestral, +5 more" },
    ],
  },
  "/commit": {
    output: [
      { id: "c1", kind: "info", text: "❯ reading staged diff..." },
      { id: "c2", kind: "ok", text: "✓ 3 files · 127 lines changed" },
      { id: "c3", kind: "info", text: "❯ calling model for commit message..." },
      { id: "c4", kind: "stream", text: "" },
      { id: "c5", kind: "ok", text: '✓ commit: "feat: jwt auth middleware with refresh token rotation"' },
      { id: "c6", kind: "tool", text: "  trailer: Co-Authored-By: Claude Sonnet 4.6 (via gogaa)" },
    ],
  },
  "/plugins": {
    output: [
      { id: "p1", kind: "info", text: "❯ plugin marketplace" },
      { id: "p2", kind: "tool", text: "  [Discover]  [Installed]  [Marketplaces]  [Errors]" },
      { id: "p3", kind: "ok", text: "  ✓ sentry-integration  v0.3.1  installed" },
      { id: "p4", kind: "ok", text: "  ✓ linear-tasks       v0.2.0  installed" },
      { id: "p5", kind: "tool", text: "  ○ slack-notify       v0.1.4  available" },
      { id: "p6", kind: "tool", text: "  ○ claude-memory      v0.5.0  available" },
    ],
  },
  "/sessions": {
    output: [
      { id: "s1", kind: "info", text: "❯ WAL-persisted sessions (last 5):" },
      { id: "s2", kind: "tool", text: "  2026-04-17 14:22  · 42 turns · $0.21 · auth-refactor" },
      { id: "s3", kind: "tool", text: "  2026-04-17 11:08  · 17 turns · $0.09 · test-fixes" },
      { id: "s4", kind: "tool", text: "  2026-04-16 22:45  · 89 turns · $0.48 · openevent-migration" },
      { id: "s5", kind: "info", text: "→ /resume <id>  to continue any session" },
    ],
  },
  "explain src/auth.ts": {
    output: [
      { id: "e1", kind: "info", text: "❯ indexing repo..." },
      { id: "e2", kind: "ok", text: "✓ call graph built · 212 symbols · 847 edges" },
      { id: "e3", kind: "info", text: "❯ analyzing src/auth.ts..." },
      { id: "e4", kind: "stream", text: "" },
      { id: "e5", kind: "ok", text: "summary:" },
      { id: "e6", kind: "tool", text: "  exports: signToken, verifyToken, refreshSession, middleware" },
      { id: "e7", kind: "tool", text: "  called by: 14 routes in src/api/" },
      { id: "e8", kind: "tool", text: "  reaches sinks: jwt.sign (safe), db.users.update (taint-checked)" },
      { id: "e9", kind: "warn", text: "  ⚠ no tests reference refreshSession — consider adding" },
    ],
  },
  "add a jwt guard": {
    output: [
      { id: "j1", kind: "info", text: "❯ classifying intent... code_task" },
      { id: "j2", kind: "info", text: "❯ scanning repo map for auth-related files..." },
      { id: "j3", kind: "ok", text: "✓ matched: src/middleware/auth.ts" },
      { id: "j4", kind: "info", text: "❯ generating SEARCH/REPLACE edit block..." },
      { id: "j5", kind: "stream", text: "" },
      { id: "j6", kind: "tool", text: "  src/middleware/auth.ts" },
      { id: "j7", kind: "tool", text: "  <<<<<<< SEARCH" },
      { id: "j8", kind: "tool", text: "  export function middleware(req, res, next) {" },
      { id: "j9", kind: "tool", text: "  =======" },
      { id: "j10", kind: "tool", text: "  export function middleware(req, res, next) {" },
      { id: "j11", kind: "tool", text: "    const token = req.headers.authorization?.slice(7);" },
      { id: "j12", kind: "tool", text: "    if (!token) return res.status(401).json({ error: 'missing_token' });" },
      { id: "j13", kind: "tool", text: "  >>>>>>> REPLACE" },
      { id: "j14", kind: "ok", text: "✓ applied. auto-running lint + tests..." },
      { id: "j15", kind: "ok", text: "✓ lint passed · 187 tests passed · no regressions" },
    ],
  },
};

const suggestions = ["/help", "/model", "/commit", "/plugins", "/sessions", "explain src/auth.ts", "add a jwt guard"];

export function GogaaSandbox(): React.ReactElement {
  const [lines, setLines] = useState<Line[]>([
    { id: "boot-1", kind: "info", text: "gogaa v0.9.1 · 11 providers loaded · 1,418 tests passed" },
    { id: "boot-2", kind: "ok", text: "✓ ready. try `/help` or click a suggestion below." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines]);

  const run = async (raw: string): Promise<void> => {
    const cmd = raw.trim();
    if (!cmd || busy) return;
    setBusy(true);
    setInput("");

    // Echo user input
    setLines((l) => [...l, { id: `u-${Date.now()}`, kind: "user", text: cmd }]);

    // Look up
    const match = commands[cmd.toLowerCase()] ?? commands[cmd];
    const output = match?.output;

    if (!output) {
      await new Promise((r) => setTimeout(r, 300));
      setLines((l) => [
        ...l,
        {
          id: `err-${Date.now()}`,
          kind: "warn",
          text: `no fake output wired for "${cmd}". try a suggestion.`,
        },
      ]);
      setBusy(false);
      return;
    }

    // Stream each line in
    for (const line of output) {
      await new Promise((r) => setTimeout(r, 180 + Math.random() * 120));
      setLines((l) => [...l, { ...line, id: `${line.id}-${Date.now()}` }]);
    }
    setBusy(false);
  };

  const lineClass = (k: Line["kind"]): string => {
    switch (k) {
      case "user":
        return "text-accent";
      case "ok":
        return "text-green-400";
      case "warn":
        return "text-amber-400";
      case "info":
        return "text-foreground/80";
      case "tool":
        return "text-muted/70";
      case "stream":
        return "text-accent/50";
      default:
        return "text-muted";
    }
  };

  return (
    <div className="rounded-xl border border-accent/25 bg-card/70 backdrop-blur-md shadow-xl shadow-accent/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 md:px-4 py-2 border-b border-card-border bg-card/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <p className="text-[10px] font-mono text-muted/60 ml-2">
            gogaa — live demo (sandboxed)
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[9px] font-mono text-green-400/70">
          <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
          interactive
        </span>
      </div>

      {/* Output */}
      <div
        ref={scrollRef}
        className="p-3 md:p-4 font-mono text-[11px] md:text-[12px] leading-[1.65] h-[280px] md:h-[340px] overflow-y-auto"
      >
        {lines.map((l) => (
          <motion.p
            key={l.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className={`${lineClass(l.kind)} whitespace-pre-wrap break-words`}
          >
            {l.kind === "user" && <span className="text-accent mr-2">❯</span>}
            {l.text}
          </motion.p>
        ))}
        {busy && (
          <p className="text-muted/40 inline-flex items-center gap-1">
            <span className="animate-pulse">.</span>
            <span className="animate-pulse" style={{ animationDelay: "0.15s" }}>.</span>
            <span className="animate-pulse" style={{ animationDelay: "0.3s" }}>.</span>
          </p>
        )}
      </div>

      {/* Suggestions */}
      <div className="px-3 md:px-4 py-2 border-t border-card-border bg-background/30 flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => run(s)}
            disabled={busy}
            className="text-[10px] md:text-[11px] font-mono px-2 py-1 rounded border border-card-border bg-card/60 text-muted/80 hover:text-accent hover:border-accent/40 hover:bg-accent/10 transition-all disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run(input);
        }}
        className="flex items-center gap-2 px-3 md:px-4 py-2.5 border-t border-card-border"
      >
        <span className="text-accent font-mono text-sm">❯</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
          placeholder="type a command or click a suggestion…"
          className="flex-1 bg-transparent outline-none font-mono text-[12px] md:text-[13px] placeholder:text-muted/40 text-foreground"
        />
      </form>
    </div>
  );
}
