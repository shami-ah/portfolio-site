/**
 * CodeLens Demo Scanner API
 *
 * Runs ~20 hardcoded patterns (extracted from the real CodeLens universal
 * pattern library) against a code snippet. Returns findings with line
 * numbers, severity, and CWE references.
 *
 * POST /api/codelens
 * Body: { code: string, language: string }
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DemoPattern {
  id: string;
  name: string;
  severity: "critical" | "warning" | "info";
  regex: RegExp;
  message: string;
  cwe?: string;
}

interface DemoFinding {
  line: number;
  severity: "critical" | "warning" | "info";
  name: string;
  message: string;
  pattern: string;
  cwe?: string;
}

interface ScanResponse {
  findings: DemoFinding[];
  scanTime: number;
  patternsChecked: number;
}

interface ScanRequest {
  code: string;
  language: string;
}

// ---------------------------------------------------------------------------
// Patterns — extracted from CodeLens src/patterns/universal/patterns.ts
// ---------------------------------------------------------------------------

const DEMO_PATTERNS: DemoPattern[] = [
  // U14 — XSS via innerHTML / dangerouslySetInnerHTML
  {
    id: "U14",
    name: "Cross-Site Scripting (XSS)",
    severity: "critical",
    regex: /innerHTML|dangerouslySetInnerHTML|document\.write/,
    message:
      "Use DOMPurify.sanitize() before inserting HTML. Prefer textContent over innerHTML. XSS allows session hijacking and arbitrary code execution in the user's browser.",
    cwe: "CWE-79",
  },
  // U12 — SQL Injection via string interpolation
  {
    id: "U12",
    name: "SQL Injection via String Interpolation",
    severity: "critical",
    regex: /\$\{.*\}.*(?:SELECT|INSERT|UPDATE|DELETE)|\.raw\(.*\$\{/,
    message:
      "Use parameterized queries or prepared statements. Never interpolate user input into SQL strings.",
    cwe: "CWE-89",
  },
  // U15 — eval / dynamic code execution
  {
    id: "U15",
    name: "Eval / Dynamic Code Execution",
    severity: "critical",
    regex: /\beval\(|new Function\(/,
    message:
      "Never use eval() or new Function() with user input. Use JSON.parse() for data, structured alternatives for logic.",
    cwe: "CWE-94",
  },
  // U5 — Hardcoded credentials
  {
    id: "U5",
    name: "Hardcoded Credentials",
    severity: "critical",
    regex: /(?:password|api_key|apiKey)\s*=\s*['"][^'"]{4,}['"]/,
    message:
      "Use environment variables or a secret manager. Never hardcode credentials, API keys, or private keys in source code.",
    cwe: "CWE-798",
  },
  // U5g — Stripe live secret key
  {
    id: "U5g",
    name: "Stripe Live Secret Key",
    severity: "critical",
    regex: /sk_live_[0-9a-zA-Z]{24,}/,
    message:
      "Use environment variables for Stripe keys. Rotate exposed key immediately at dashboard.stripe.com/apikeys.",
    cwe: "CWE-798",
  },
  // U2 — Empty catch blocks
  {
    id: "U2",
    name: "Empty Catch Blocks",
    severity: "critical",
    regex: /\.catch\s*\(.*=>\s*\{\s*\}\)|catch\s*\(.*\)\s*\{\s*\}/,
    message:
      "Log the error, re-throw it, or handle it explicitly. Never silently swallow errors.",
    cwe: "CWE-755",
  },
  // U6 — Missing error handling on fetch / async
  {
    id: "U6",
    name: "Missing Error Handling on Async Operations",
    severity: "warning",
    regex: /await\s+fetch\s*\([^)]*\)(?!\s*\.catch)/,
    message:
      "Wrap async operations in try/catch or chain .catch(). Unhandled rejections crash Node.js processes.",
  },
  // Token in localStorage
  {
    id: "U5-LS",
    name: "Sensitive Token in localStorage",
    severity: "critical",
    regex: /localStorage\.setItem\s*\(\s*['"](?:token|auth|session|jwt|apiKey|api_key|password|secret)['"]/i,
    message:
      "localStorage is accessible to any JS on the page, including XSS payloads. Use httpOnly cookies for auth tokens.",
    cwe: "CWE-922",
  },
  // U13 — Command injection
  {
    id: "U13",
    name: "Command Injection",
    severity: "critical",
    regex: /exec\(.*\$\{|exec\(.*\+|os\.system\(.*f"/,
    message:
      "Use parameterized command execution (execFile, not exec). Never pass user input to shell commands.",
    cwe: "CWE-78",
  },
  // U9 — Prototype pollution
  {
    id: "U9",
    name: "Prototype Pollution",
    severity: "critical",
    regex: /Object\.assign\(.*req\.body|__proto__|constructor\[/,
    message:
      "Validate input with schema (zod/joi) before spreading. Use Object.create(null) for dictionaries.",
    cwe: "CWE-1321",
  },
  // U19 — Insecure randomness
  {
    id: "U19",
    name: "Insecure Randomness for Security Values",
    severity: "critical",
    regex: /Math\.random\(\)/,
    message:
      "Use crypto.randomUUID() or crypto.getRandomValues() for tokens and session IDs. Math.random() is not cryptographically secure.",
    cwe: "CWE-330",
  },
  // U4 — Console.log with sensitive data
  {
    id: "U4",
    name: "Console.log with Sensitive Data",
    severity: "critical",
    regex: /console\.log.*(?:password|token|secret|key|credential)/i,
    message:
      "Never log full request bodies, headers, or objects that may contain secrets.",
    cwe: "CWE-532",
  },
  // U3 — TODO/FIXME in production
  {
    id: "U3",
    name: "TODO/FIXME/HACK Comments",
    severity: "warning",
    regex: /\b(?:TODO|FIXME|HACK|XXX|TEMP|WORKAROUND)\b/,
    message:
      "Resolve the TODO or create a tracking issue. Remove HACK/TEMP comments and implement proper solutions.",
  },
  // U8 — ReDoS
  {
    id: "U8",
    name: "Regex Denial of Service (ReDoS)",
    severity: "critical",
    regex: /new RegExp\(.*[+*].*[+*]/,
    message:
      "Avoid nested quantifiers ((a+)+). Limit input length before applying regex. Use linear-time regex engines for user input.",
    cwe: "CWE-1333",
  },
  // U23 — Silent fallback return
  {
    id: "U23",
    name: "Silent Fallback Return on Error",
    severity: "critical",
    regex: /catch\s*\([^)]*\)\s*\{\s*return\s+(?:null|undefined|\[\]|\{\}|false|''|""|0)\s*;?\s*\}/,
    message:
      "Log the error before returning a fallback, or propagate it. Silent fallback returns hide real failures.",
    cwe: "CWE-755",
  },
  // U17 — Unbounded resource allocation
  {
    id: "U17",
    name: "Unbounded Resource Allocation",
    severity: "warning",
    regex: /while\s*\(true\)|for\s*\(\s*;\s*;\s*\)/,
    message:
      "Add timeouts to infinite loops. Set max payload sizes on API endpoints.",
    cwe: "CWE-770",
  },
  // U10 — Open redirect
  {
    id: "U10",
    name: "Open Redirect",
    severity: "critical",
    regex: /window\.location\s*=\s*(?:req|params|query|searchParams)/,
    message:
      "Validate redirect URLs against an allowlist of domains. Attacker-controlled redirects enable phishing.",
    cwe: "CWE-601",
  },
  // Unchecked response status
  {
    id: "U6-STATUS",
    name: "Unchecked Fetch Response Status",
    severity: "warning",
    regex: /await\s+(?:\w+\.)?json\(\)\s*(?:;|\n)(?!.*\.ok|.*\.status|.*res\.ok)/,
    message:
      "Check response.ok or response.status before parsing JSON. A 4xx/5xx response still resolves the promise.",
  },
  // U18 — Race condition check-then-act
  {
    id: "U18",
    name: "Race Condition in Check-Then-Act",
    severity: "critical",
    regex: /if.*await.*\{[^}]*await/,
    message:
      "Use atomic operations (UPDATE ... WHERE ... RETURNING). Never read-check-write with async gaps.",
    cwe: "CWE-362",
  },
  // U38 — Insecure deserialization
  {
    id: "U38",
    name: "Insecure Deserialization",
    severity: "critical",
    regex: /pickle\.loads?\(|yaml\.load\((?!.*SafeLoader)/,
    message:
      "Use yaml.safe_load() for YAML, schema validation after JSON.parse for untrusted input. Never use pickle on untrusted data.",
    cwe: "CWE-502",
  },
];

// ---------------------------------------------------------------------------
// Scanner
// ---------------------------------------------------------------------------

function scanSnippet(code: string): ScanResponse {
  const start = performance.now();
  const lines = code.split("\n");
  const findings: DemoFinding[] = [];

  for (const pattern of DEMO_PATTERNS) {
    for (let i = 0; i < lines.length; i++) {
      if (pattern.regex.test(lines[i])) {
        findings.push({
          line: i + 1,
          severity: pattern.severity,
          name: pattern.name,
          message: pattern.message,
          pattern: pattern.id,
          ...(pattern.cwe ? { cwe: pattern.cwe } : {}),
        });
      }
    }
  }

  // Deduplicate: same pattern + same line
  const seen = new Set<string>();
  const deduped = findings.filter((f) => {
    const key = `${f.pattern}:${f.line}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    findings: deduped,
    scanTime: Math.round((performance.now() - start) * 100) / 100,
    patternsChecked: DEMO_PATTERNS.length,
  };
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as ScanRequest;

    if (!body.code || typeof body.code !== "string") {
      return Response.json(
        { error: "Missing or invalid `code` field" },
        { status: 400 },
      );
    }

    if (body.code.length > 5000) {
      return Response.json(
        { error: "Code exceeds 5 000 character limit" },
        { status: 400 },
      );
    }

    const result = scanSnippet(body.code);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}
