export interface Article {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  summary: string;
  tags: string[];
  featured: boolean;
  body: ArticleSection[];
}

interface ArticleSection {
  heading?: string;
  paragraphs: string[];
}

export const articles: Article[] = [
  {
    slug: "five-strategy-json-parser",
    title: "The 5-Strategy JSON Parser That Took Tool Calls from 70% to 95%",
    date: "2026-04-15",
    readTime: "6 min",
    summary:
      "Every blog post about building AI agents assumes models return valid JSON. In production, they don't. Here's the parser that fixed it.",
    tags: ["AI Agents", "TypeScript", "Production"],
    featured: true,
    body: [
      {
        paragraphs: [
          "Every tutorial about building AI agents has the same assumption baked in: the model returns valid JSON, you parse it, you call the tool. In practice, especially with streaming responses across 11 different providers, this assumption breaks constantly.",
          "I discovered this the hard way while building Gogaa CLI. Tool calls would randomly fail. Not because the model made a bad decision, but because the JSON was malformed. Truncated strings from streaming cutoffs. Double-escaped characters from models that over-sanitize their output. Extra whitespace around the JSON block. Partial objects that cut off mid-key because the response hit a token limit.",
        ],
      },
      {
        heading: "The problem nobody talks about",
        paragraphs: [
          "A single JSON.parse throws on any of these, and the tool call is lost. The agent retries, burns tokens, and often produces a worse result the second time because its context now includes a confusing error message. On real agentic sessions across multiple providers, I measured a ~70% success rate for tool call parsing with naive JSON.parse.",
          "Thirty percent of tool calls silently failing is not a minor inconvenience. It is the difference between an agent that reliably completes multi-step tasks and one that randomly falls apart.",
        ],
      },
      {
        heading: "Five strategies, progressive fallback",
        paragraphs: [
          "The parser tries five strategies in order, each progressively looser: strict JSON.parse on the raw input. Trim whitespace and strip markdown code fences, then parse. Unescape double-escaped characters (\\\\n to \\n, \\\\\" to \\\"), then parse. Attempt partial object reconstruction by finding the last complete key-value pair and closing the object. Finally, extract any JSON-like substring from the response and parse that.",
          "When a strategy partially recovers the input, it injects an error recovery hint into the tool result. The model sees something like 'Parsed with recovery: original input had trailing truncation. Please verify the file_path argument.' This gives the model enough information to retry correctly if the recovered parse was wrong, without the confusing generic error that causes hallucinated retries.",
        ],
      },
      {
        heading: "The result",
        paragraphs: [
          "Tool call success went from ~70% to ~95% on real agentic sessions. The remaining 5% are genuinely malformed outputs where the model produced something that isn't JSON at all, and those get a clear error message that leads to a clean retry.",
          "This is not glamorous work. Nobody writes conference talks about JSON parsing. But it is the kind of infrastructure that separates a demo from a tool people actually use for hours at a time. If you are building an AI agent and your tool calls occasionally fail for no apparent reason, your parser is probably the problem.",
        ],
      },
    ],
  },
  {
    slug: "human-in-the-loop-not-a-compromise",
    title: "Human-in-the-Loop Is Not a Compromise",
    date: "2026-03-28",
    readTime: "5 min",
    summary:
      "The tempting version of an AI email system is full automation. Here's why we deliberately didn't build that, and why clients trust the system because of it.",
    tags: ["AI Architecture", "Product Design", "OpenEvent"],
    featured: true,
    body: [
      {
        paragraphs: [
          "When we started building the AI layer for OpenEvent, the obvious pitch was full automation. Email arrives, AI reads it, books the calendar, sends the invoice. Zero human involvement. It sounds impressive in a demo.",
          "We deliberately did not build that. And the decision to not automate is the reason the system is now live with 100+ clients across 150+ events.",
        ],
      },
      {
        heading: "Where full automation breaks",
        paragraphs: [
          "Event coordination is full of ambiguity. A client writes 'sometime next week' and means Thursday afternoon because that is when their venue is available, but they did not say that. Another writes 'add catering for 15' but the venue contract caps food service at 12 and requires a different vendor above that threshold. A third sends 'change the deposit' with no amount specified.",
          "A slot-filling algorithm treats these as missing fields and either guesses or asks a follow-up. But the right response requires judgment. It requires knowing that this particular client always means Thursday, that the venue cap is a hard constraint, that 'change the deposit' from this sender historically means 'match what we did last time.'",
          "Full automation fails the first time the AI misreads 'sometime next week' and books the wrong slot. The client loses trust. The operations team goes back to manual processing. The whole AI investment is wasted.",
        ],
      },
      {
        heading: "The right boundary",
        paragraphs: [
          "The system we built draws a clear line: AI handles extraction, classification, and proposal. Humans approve before anything touches money or commitments.",
          "An email arrives. The AI classifies the intent (booking request, change request, inquiry). It extracts entities (dates, counts, amounts). It looks up historical context via pgvector embeddings. It proposes an action: 'Book Thursday 2pm, 15 guests, standard catering package, based on last 3 bookings from this client.' The human sees the proposal, the reasoning, and the confidence score. One click to approve, one click to edit, one click to reject.",
          "This is not a compromise. This is the correct architecture for a domain where the cost of a wrong automated action (double-booking a venue, sending a wrong invoice) far exceeds the cost of a human spending three seconds reviewing a proposal.",
        ],
      },
      {
        heading: "Trust compounds",
        paragraphs: [
          "The system now saves each team roughly 1.5 hours per day. Not by eliminating humans from the loop, but by eliminating the tedious parts: reading emails, copying data between systems, looking up client history, drafting responses. The AI does all of that. The human just makes the final call.",
          "Teams trust it because it never acts without asking. That trust is why adoption was immediate and sticky. The fully automated competitor they tried before OpenEvent booked a wrong venue on day two, and they went back to spreadsheets.",
          "If you are building AI for a domain where mistakes are expensive, think carefully about where the automation boundary should be. 'AI proposes, human approves' is not a limitation. It is a feature.",
        ],
      },
    ],
  },
  {
    slug: "wisc-context-engineering",
    title: "WISC: A Framework for AI Agent Context Engineering",
    date: "2026-04-22",
    readTime: "7 min",
    summary:
      "My Claude Code setup was burning 72KB of context before I typed a word. Here's the four-principle framework that cut it to 11.7KB without losing any capability.",
    tags: ["Context Engineering", "Claude Code", "Developer Tools"],
    featured: true,
    body: [
      {
        paragraphs: [
          "I had a well-configured Claude Code setup. 5 agents, 10 commands, 23 plugins, 7 rules. It worked great. It also loaded 72KB of system prompt on every single conversation, burning 35-40K tokens before I typed a word.",
          "On a paid tier, that is real money. More importantly, it wastes context window for every session. A greeting that should cost 24 tokens was costing 3,909. I needed a systematic way to keep every capability while dramatically reducing the always-loaded footprint.",
        ],
      },
      {
        heading: "Write: persist decisions to files, not conversation",
        paragraphs: [
          "The first principle is simple: anything the AI needs to know across sessions should be in a file, not re-explained every time. CLAUDE.md files, memory records, decision logs. Every session starts informed because the context is on disk, not in your head. This eliminates the 'let me explain the project again' overhead that makes long-running projects expensive.",
        ],
      },
      {
        heading: "Isolate: one task per conversation",
        paragraphs: [
          "Context contamination is the silent killer of AI-assisted development. A debugging session should not carry the context of a feature discussion from 30 turns ago. One task per conversation. Subagents for research that might pull in irrelevant context. Worktrees for parallel branches so agents never share git state. This keeps each conversation focused and prevents the gradual degradation that happens when context accumulates.",
        ],
      },
      {
        heading: "Select: load only what matches",
        paragraphs: [
          "This is where the biggest savings came from. Path-scoped rules only load when matching files are opened. TypeScript rules do not load when you are editing SQL. Database rules do not load when you are writing React components. Skills load their body only on invoke, not at startup. A project hook injects context only when inside a known project directory.",
          "The same principle applied in Gogaa CLI through intent-based lazy context. An intent classifier categorizes each prompt (chat, code, search, memory, skill) and loads only the matching context slices. A greeting loads 24 tokens instead of 3,909.",
        ],
      },
      {
        heading: "Compress: strip what the model already knows",
        paragraphs: [
          "Agent definitions had grown to 58KB. Most of that was generic advice: 'write clean code', 'handle errors properly', 'use meaningful variable names.' The model already knows this. Stripping generic advice and keeping only stack-specific rules, project-specific conventions, and non-obvious constraints brought agent definitions from 58KB to 5KB.",
          "Eight commands were converted to lazy-loaded skills. Same capability, but the body only loads when invoked. Rules were trimmed to essentials. The result: 72KB always-loaded context down to 11.7KB. Every capability preserved. 84% reduction.",
        ],
      },
      {
        heading: "Apply it to your own setup",
        paragraphs: [
          "WISC is not a tool. It is a design discipline. If you are using Claude Code, Cursor, or any AI coding assistant with a growing configuration, audit your context budget. Check what loads on every conversation. Ask: does the model need this right now, or only when relevant? The answer is almost always 'only when relevant.' Structure your configuration accordingly.",
        ],
      },
    ],
  },
  {
    slug: "hand-crafted-patterns-beat-ai-review",
    title: "430 Hand-Crafted Bug Patterns Beat AI Review (Most of the Time)",
    date: "2026-05-01",
    readTime: "8 min",
    summary:
      "I spent months cataloguing every category of production bug I kept seeing across client projects. The result is CodeLens, and here's what I learned about the limits of AI-only code review.",
    tags: ["Code Review", "CodeLens", "Security"],
    featured: false,
    body: [
      {
        paragraphs: [
          "Every code review tool I evaluated made the same tradeoff. Fast but shallow (regex linters that catch style issues but miss logic bugs), or deep but slow and cloud-dependent (AI tools that send your code to a third party and still miss the bugs that actually ship).",
          "The bugs that actually ship are the ones that look fine in isolation. A missing .limit() on a Supabase query that silently caps at 1000 rows. React hooks placed after a conditional return. An edge function catch block that swallows errors without alerting. SQL column shadowing in JOINs that silently resolves to the wrong table's value. Each one of these has caused a real production incident in projects I've worked on.",
        ],
      },
      {
        heading: "Why patterns work",
        paragraphs: [
          "A hand-crafted pattern for 'Supabase query without .limit()' runs in microseconds, never hallucinates, produces zero false positives when written correctly, and catches the exact bug it was designed for. An AI reviewer might catch it, might not, might flag something else instead, and will definitely cost 10-50x more in compute.",
          "Over months of reviewing production code across client projects, I built a library of ~430 patterns across 9 stacks. Every pattern maps to a real production failure mode, tagged with OWASP/CWE where applicable. The full scan runs in under a second on the developer's machine. Code never leaves the repo.",
        ],
      },
      {
        heading: "Where patterns fail",
        paragraphs: [
          "Patterns cannot reason about intent. They cannot look at an authorization check and ask 'but does this verify that the user owns the resource, or just that they are authenticated?' They cannot detect that a fallback path silently succeeds when it should propagate the error. They cannot notice that a refactor changed behavior in a way that no single line reveals.",
          "After a commercial AI reviewer (Greptile) caught 12 issues on a production PR that CodeLens missed, I ran a systematic gap analysis. Six of the twelve were fixable with new regex patterns. Four required semantic reasoning that no pattern can express. For those four, I added focused security probes: structured questions the AI must answer per-file with YES/NO and line evidence.",
        ],
      },
      {
        heading: "The hybrid approach",
        paragraphs: [
          "The right architecture is not patterns or AI. It is patterns first, then AI for what patterns cannot express. Run 430 deterministic patterns in <1 second. Build a persistent codebase index (call graph, schema graph, type graph). Then layer AI reasoning with focused probes on top.",
          "The AI phase is expensive, so it needs to be focused. Instead of 'review this code,' the probes ask specific questions: 'Does this endpoint verify resource ownership, not just authentication? YES/NO with line evidence.' Structured questions produce structured answers. The signal-to-noise ratio stays high.",
          "Coverage on the Greptile benchmark PR went from 8% (patterns alone) to 67% (new patterns) to 100% (patterns + AI probes). The patterns handle the volume. The AI handles the nuance. Neither is sufficient alone.",
        ],
      },
    ],
  },
  {
    slug: "building-ai-observatory",
    title: "Why Developers Need an Observatory for Their AI Sessions",
    date: "2026-04-10",
    readTime: "5 min",
    summary:
      "I was spending $500+/day on AI coding tools with zero visibility into what the AI was doing. So I built Rasad, and the first thing it showed me was uncomfortable.",
    tags: ["Rasad", "Observability", "AI Cost"],
    featured: false,
    body: [
      {
        paragraphs: [
          "The first time I ran Rasad on my own session history, it synced 656 sessions and showed me something uncomfortable: I had spent over $30,000 on Claude Opus in a single billing period. Not because Opus is expensive per token, but because I was using it for everything. Quick questions, file searches, simple refactors. Tasks where Haiku or Sonnet would have been identical in quality at a fraction of the cost.",
          "I had no way to know this before Rasad. The API billing dashboard shows total spend, not spend per session, per task type, or per model. There is no 'you used Opus for 47 one-line questions that cost $380 total' breakdown anywhere in Anthropic's console.",
        ],
      },
      {
        heading: "The observability gap",
        paragraphs: [
          "Every production system has monitoring. You know your API latency, error rates, database query times, memory usage. But AI coding assistants, which now account for a significant portion of engineering budgets, have zero observability.",
          "You do not know: How many tokens were burned on retries because the AI read 67 files but only changed 3. Whether context was lost mid-session causing the AI to contradict its own earlier decisions. Whether a $87 session could have been three $8 sessions with better task isolation. Which model performs best for your specific codebase and task types.",
        ],
      },
      {
        heading: "What an observatory shows you",
        paragraphs: [
          "Rasad ingests session data from Claude Code, Gogaa CLI, and Codex CLI. It builds a SQLite database with full-text search across 38K+ messages and 14K+ tool calls. The X-Ray view replays any session action-by-action: every file read, every edit, every bash command, with timing and phase labels (planning, exploring, executing, verifying, refining).",
          "Session Quality grading scores each session A-F based on efficiency, self-correction patterns, cost, and whether the AI actually verified its work. The model comparison view shows cost per session by model, so you can see that your Opus sessions average $87 while your Sonnet sessions average $4.83 with no measurable quality difference on routine tasks.",
          "Everything runs on localhost. Zero outbound network requests. Your session data, which contains your entire codebase and conversation history, never leaves your machine.",
        ],
      },
      {
        heading: "The lesson",
        paragraphs: [
          "The uncomfortable truth is that AI coding tools are not self-optimizing. They use whatever model you point them at, for whatever task you give them, with no feedback loop. An observatory gives you the feedback loop. It turns 'I think AI is helping' into 'here is exactly how much it costs, where it wastes time, and which sessions are worth it.'",
          "After two weeks with Rasad, I restructured my workflow: Opus for architecture decisions and complex debugging, Sonnet for implementation, Haiku for quick questions. Same output quality. Significantly lower cost. But I could not have made that decision without data.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured);
}
