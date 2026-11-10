
export const articleChunks = [
  {
    id: "article-gogaa-json-parser",
    category: "technical-article",
    project: "Gogaa CLI",
    title: "The 5-Strategy JSON Parser That Took Tool Calls from 70% to 95%",
    tags: ["JSON", "parsing", "AI agents", "TypeScript", "tool calls"],
    text: `
Ahtesham wrote an article about fixing unreliable JSON parsing
in Gogaa CLI. AI models frequently return malformed JSON because
of streaming truncation, double-escaped characters, extra
whitespace, and incomplete objects.

The original naive JSON.parse approach achieved approximately
70% tool-call parsing success.

Ahtesham implemented five progressive recovery strategies:
1. Parse the raw input using JSON.parse.
2. Trim whitespace and remove Markdown code fences.
3. Unescape double-escaped characters.
4. Reconstruct partially truncated JSON objects.
5. Extract and parse a JSON-like substring.

The parser improved tool-call success from approximately 70%
to 95%. When recovery is used, the system provides an error
recovery hint so the AI can verify potentially recovered values.

Article date: 15 April 2026.
    `.trim(),
  },

  {
    id: "article-openevent-human-approval",
    category: "technical-article",
    project: "OpenEvent",
    title: "Human-in-the-Loop Is Not a Compromise",
    tags: ["human approval", "AI architecture", "automation", "pgvector"],
    text: `
Ahtesham explains why OpenEvent uses human-in-the-loop AI
instead of fully automatic event booking and invoicing.

OpenEvent AI handles email extraction, intent classification,
entity extraction, historical context lookup using pgvector,
and action proposals.

Before anything affects money or commitments, a human reviews
the proposal and can approve, edit, or reject it.

The AI can propose booking details using historical client
context, but it does not independently commit those actions.

The article explains that event coordination contains ambiguity,
such as unclear dates, guest counts, venue restrictions, and
deposit changes. Fully automated systems can make costly mistakes.

The system saves teams roughly 1.5 hours per day by automating
tedious work while keeping humans responsible for final decisions.

Article date: 28 March 2026.
    `.trim(),
  },

  {
    id: "article-wisc-context-engineering",
    category: "technical-article",
    project: "WISC",
    title: "WISC: A Framework for AI Agent Context Engineering",
    tags: [
      "WISC",
      "Write",
      "Isolate",
      "Select",
      "Compress",
      "context engineering",
      "AI agents",
      "Claude Code",
    ],
    text: `
Ahtesham developed WISC as a four-principle framework for
managing context in AI coding assistants.

WISC stands for Write, Isolate, Select, and Compress.

Write means persisting decisions and project knowledge in files
instead of repeatedly explaining them in conversations.

Isolate means keeping one task per conversation and separating
unrelated work to prevent context contamination.

Select means loading only relevant rules, skills, and context
when they are needed.

Compress means removing generic instructions that the AI model
already understands and retaining important project-specific rules.

Ahtesham reduced always-loaded context from 72KB to 11.7KB,
an 84% reduction, while preserving capabilities.

A greeting that previously consumed 3,909 tokens was reduced
to 24 tokens through intent-based lazy context.

The article also discusses path-scoped rules, subagents,
worktrees, and lazy-loaded skills.

Article date: 22 April 2026.
    `.trim(),
  },

  {
    id: "article-wisc-definition",
    category: "technical-article",
    project: "WISC",
    title: "What Does WISC Stand For?",
    tags: [
      "WISC",
      "acronym",
      "definition",
      "Write",
      "Isolate",
      "Select",
      "Compress",
    ],
    text: `
WISC stands for Write, Isolate, Select, and Compress.

WISC is Ahtesham's four-principle framework for AI agent
context engineering.

Write means persist important decisions.
Isolate means separate unrelated tasks.
Select means load only relevant context.
Compress means remove unnecessary instructions.

The framework reduced always-loaded context from 72KB
to 11.7KB, an 84% reduction.
    `.trim(),
  },

  {
    id: "article-codelens-patterns",
    category: "technical-article",
    project: "CodeLens",
    title: "430 Hand-Crafted Bug Patterns Beat AI Review (Most of the Time)",
    tags: ["CodeLens", "security", "code review", "OWASP", "CWE"],
    text: `
Ahtesham explains how CodeLens combines deterministic bug
patterns with focused AI security reasoning.

CodeLens contains approximately 430 hand-crafted patterns
across nine technology stacks. Each pattern targets a real
production failure mode and maps to OWASP or CWE where applicable.

The deterministic scan runs in under one second and keeps
source code on the developer's machine.

A comparison against the commercial AI reviewer Greptile
identified 12 missed issues. Six could be addressed with
additional patterns, while four required semantic reasoning.

Ahtesham added focused AI security probes that ask structured
questions and require YES or NO answers with line evidence.

On the benchmark PR, coverage improved from 8% with patterns
alone, to 67% after adding patterns, and finally to 100%
with patterns plus AI probes.

The article argues that patterns handle volume while AI
handles nuanced reasoning. Neither approach is sufficient alone.

Article date: 1 May 2026.
    `.trim(),
  },

  {
    id: "article-rasad-observatory",
    category: "technical-article",
    project: "Rasad",
    title: "Why Developers Need an Observatory for Their AI Sessions",
    tags: ["Rasad", "AI observability", "SQLite", "AI costs", "privacy"],
    text: `
Ahtesham wrote about building Rasad to provide observability
for AI coding assistant sessions.

Rasad ingests session data from Claude Code, Gogaa CLI,
and Codex CLI. It stores information in a local SQLite
database and supports full-text search across more than
38,000 messages and 14,000 tool calls.

Its X-Ray view replays sessions action by action, including
file reads, edits, and bash commands, with timing and phase labels.

Session Quality grades sessions from A to F using efficiency,
self-correction, cost, and verification behavior.

Rasad also compares model costs per session and helps
developers choose suitable models for different tasks.

Everything runs locally. Session data stays on the user's
machine, with zero outbound network requests.

The article describes how Ahtesham changed his workflow
to use stronger models for complex work and cheaper models
for routine questions.

Article date: 10 April 2026.
    `.trim(),
  },
];
