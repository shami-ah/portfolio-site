"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Finding {
  line: number;
  severity: "critical" | "warning" | "info";
  name: string;
  message: string;
  pattern: string;
  cwe?: string;
}

interface ScanResult {
  findings: Finding[];
  scanTime: number;
  patternsChecked: number;
}

// ---------------------------------------------------------------------------
// Default sample code with intentional bugs
// ---------------------------------------------------------------------------

const SAMPLE_CODE = `async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`)
  const data = await res.json()
  localStorage.setItem("token", data.token)
  return data
}

function render(input) {
  el.innerHTML = input // user input
}`;

// ---------------------------------------------------------------------------
// Severity helpers
// ---------------------------------------------------------------------------

const severityBadge: Record<Finding["severity"], { bg: string; text: string; label: string }> = {
  critical: { bg: "bg-red-500/15 border-red-500/30", text: "text-red-400", label: "CRITICAL" },
  warning: { bg: "bg-yellow-500/10 border-yellow-500/25", text: "text-yellow-400", label: "WARNING" },
  info: { bg: "bg-blue-500/10 border-blue-500/25", text: "text-blue-400", label: "INFO" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CodeLensTryIt(): React.ReactElement {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/codelens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "typescript" }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? `Request failed (${res.status})`);
        return;
      }

      const data = (await res.json()) as ScanResult;
      setResult(data);
    } catch {
      setError("Network error — could not reach scanner.");
    } finally {
      setLoading(false);
    }
  }, [code]);

  const critCount = result?.findings.filter((f) => f.severity === "critical").length ?? 0;
  const warnCount = result?.findings.filter((f) => f.severity === "warning").length ?? 0;
  const infoCount = result?.findings.filter((f) => f.severity === "info").length ?? 0;

  // Line numbers for the textarea
  const lineCount = code.split("\n").length;

  return (
    <div>
      <p className="text-caption md:text-xs font-mono text-accent/80 uppercase tracking-[0.2em] mb-3">
        Try it — paste your code
        <span className="text-muted/40 normal-case tracking-normal ml-2">
          ~{result?.patternsChecked ?? 20} patterns (demo)
        </span>
      </p>

      {/* Editor area */}
      <div className="rounded-xl bg-background/50 border border-card-border overflow-hidden">
        <div className="flex">
          {/* Line numbers */}
          <div
            className="select-none py-3 pl-3 pr-2 text-right font-mono text-caption text-muted/30 leading-[1.625] border-r border-card-border/40 shrink-0"
            aria-hidden="true"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code textarea */}
          <textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value.slice(0, 5000));
              setResult(null);
            }}
            spellCheck={false}
            className="flex-1 bg-transparent text-foreground/90 font-mono text-xs md:text-sm leading-[1.625] p-3 resize-none outline-none min-h-[180px] placeholder:text-muted/30"
            placeholder="Paste code here..."
            rows={Math.max(lineCount, 8)}
          />
        </div>

        {/* Character count */}
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-card-border/40">
          <span className="text-caption font-mono text-muted/30">
            {code.length} / 5000 chars
          </span>
          <button
            type="button"
            onClick={scan}
            disabled={loading || code.trim().length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-mono font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-accent to-accent/80 text-white hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scanning...
              </>
            ) : (
              <>Scan with CodeLens</>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono">
          {error}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            className="mt-4"
          >
            {/* Summary bar */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {critCount > 0 && (
                <span className="px-2 py-0.5 rounded text-caption font-mono bg-red-500/15 border border-red-500/30 text-red-400">
                  {critCount} critical
                </span>
              )}
              {warnCount > 0 && (
                <span className="px-2 py-0.5 rounded text-caption font-mono bg-yellow-500/10 border border-yellow-500/25 text-yellow-400">
                  {warnCount} warning{warnCount > 1 ? "s" : ""}
                </span>
              )}
              {infoCount > 0 && (
                <span className="px-2 py-0.5 rounded text-caption font-mono bg-blue-500/10 border border-blue-500/25 text-blue-400">
                  {infoCount} info
                </span>
              )}
              {result.findings.length === 0 && (
                <span className="px-2 py-0.5 rounded text-caption font-mono bg-green-500/10 border border-green-500/30 text-green-400">
                  No findings
                </span>
              )}
              <span className="text-caption font-mono text-muted/40 ml-auto">
                {result.scanTime}ms
              </span>
            </div>

            {/* Findings list */}
            {result.findings.length > 0 && (
              <ul className="space-y-2">
                {result.findings.map((f, i) => {
                  const badge = severityBadge[f.severity];
                  return (
                    <motion.li
                      key={`${f.pattern}-${f.line}-${i}`}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                      className="p-3 rounded-lg bg-background/50 border border-card-border"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-caption font-mono border ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-xs md:text-sm font-mono text-foreground/80">
                          {f.name}
                        </span>
                        <span className="text-caption font-mono text-muted/40 ml-auto">
                          line {f.line}
                          {f.cwe && (
                            <span className="ml-2 text-muted/30">{f.cwe}</span>
                          )}
                        </span>
                      </div>
                      <p className="text-caption md:text-xs text-muted leading-relaxed">
                        {f.message}
                      </p>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
