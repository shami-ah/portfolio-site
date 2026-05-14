/* ── Agent Dispatch — Two-Tier Resolver ──
 * Tier 1: Local keyword match (instant, <5ms)
 * Tier 2: AI-powered via /api/agent (200-800ms)
 */

import {
  type AgentCommand,
  commands,
  fuzzyMatch,
} from "@/components/agent-commands";
import { findAnswer, type KbEntry } from "@/lib/kb";

// ── Types ──

export interface LiveStep {
  name: string;
  status: "pending" | "running" | "done";
  elapsedMs?: number;
}

export interface AgentAction {
  type: "scroll" | "popup" | "drawer" | "external";
  target: string;
  label: string;
}

export type DispatchMode = "quick" | "conversational";

export interface DispatchResult {
  mode: DispatchMode;
  /** For quick mode — the matched command */
  command?: AgentCommand;
  /** For conversational mode — the AI response text */
  response?: string;
  /** Action buttons to render below the response */
  actions?: AgentAction[];
  /** If AI recognized a command intent, its name */
  recognizedCommand?: string;
}

// ── Tier 1: Local Match ──

export function localMatch(query: string): AgentCommand | null {
  const q = query.toLowerCase().trim();

  // Exact keyword match
  const exact = commands.find((c) => c.keyword === q);
  if (exact) return exact;

  // Fuzzy match via PROJECT_KEYWORDS
  const fuzzy = fuzzyMatch(q, commands);
  if (fuzzy && fuzzy.score >= 2) return fuzzy.command;

  return null;
}

// ── Tier 2: AI Call ──

export interface AiResponse {
  intent: { command: string | null; confidence: number };
  response: string;
  actions: AgentAction[];
}

export async function callAgent(
  query: string,
  history: { role: "user" | "assistant"; content: string }[],
  section: string,
  model: string,
): Promise<AiResponse> {
  // In production (Cloudflare), /api/agent hits Pages Functions on same origin.
  // In dev, the API server runs on port 3001 (Docker/Node).
  const isDev = typeof window !== "undefined" && window.location.port === "3000";
  const base = isDev ? "http://localhost:3001" : "";

  const res = await fetch(`${base}/api/agent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, history, section, model }),
  });

  if (!res.ok) {
    throw new Error(`Agent API: ${res.status}`);
  }

  return (await res.json()) as AiResponse;
}

// ── Dispatch: Two-Tier Resolution ──

export async function dispatch(
  query: string,
  history: { role: "user" | "assistant"; content: string }[],
  section: string,
  model: string,
  onStepUpdate?: (steps: LiveStep[]) => void,
): Promise<DispatchResult> {
  // ── Tier 1: Local Match (instant) ──
  const local = localMatch(query);
  if (local) {
    return { mode: "quick", command: local };
  }

  // ── Tier 2: AI-Powered ──
  const steps: LiveStep[] = [
    { name: "local_match", status: "done", elapsedMs: 2 },
    { name: "classify_intent", status: "running" },
    { name: "generate_response", status: "pending" },
  ];
  onStepUpdate?.(structuredClone(steps));

  const t0 = performance.now();

  try {
    // Start the AI call
    const classifyStart = performance.now();
    const aiResult = await callAgent(query, history, section, model);
    const classifyMs = Math.round(performance.now() - classifyStart);

    // Update: classify done
    steps[1] = { name: "classify_intent", status: "done", elapsedMs: classifyMs };

    // If AI recognized a command with high confidence, use local command
    if (aiResult.intent.command && aiResult.intent.confidence > 0.8) {
      const cmd = commands.find((c) => c.keyword === aiResult.intent.command);
      if (cmd) {
        steps[2] = { name: "generate_response", status: "done", elapsedMs: 0 };
        onStepUpdate?.(structuredClone(steps));
        return {
          mode: "quick",
          command: cmd,
          recognizedCommand: aiResult.intent.command,
        };
      }
    }

    // No command match — conversational response
    steps[2] = { name: "generate_response", status: "done", elapsedMs: classifyMs };
    onStepUpdate?.(structuredClone(steps));

    return {
      mode: "conversational",
      response: aiResult.response,
      actions: aiResult.actions,
    };
  } catch {
    // Fallback to local KB if API fails
    const kbResult = findAnswer(query);
    steps[1] = { name: "classify_intent", status: "done", elapsedMs: Math.round(performance.now() - t0) };
    steps[2] = { name: "generate_response", status: "done", elapsedMs: 0 };
    onStepUpdate?.(structuredClone(steps));

    if (kbResult) {
      const actions: AgentAction[] = (kbResult.actions ?? []).map((a) => ({
        type: a.href ? "external" as const : "popup" as const,
        target: a.href ?? a.event ?? "",
        label: a.label,
      }));
      return {
        mode: "conversational",
        response: kbResult.response,
        actions,
      };
    }

    return {
      mode: "conversational",
      response: "Ahtesham works across AI, full-stack, and automation. Try asking about his projects, rate, or availability.",
      actions: [],
    };
  }
}
