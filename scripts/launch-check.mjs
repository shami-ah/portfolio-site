import { spawn, spawnSync } from "node:child_process";

const prodUrl = process.env.PORTFOLIO_PROD_URL ?? "https://ahtesham.dev.wadwarehouse.com";
const localUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

function run(command, args, options = {}) {
  console.log(`\n> ${[command, ...args].join(" ")}`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: { ...process.env, ...options.env },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function canReach(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2_000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function waitFor(url, timeoutMs = 45_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await canReach(url)) return true;
    await new Promise((resolve) => setTimeout(resolve, 800));
  }
  return false;
}

async function productionSmoke() {
  console.log(`\n> production smoke ${prodUrl}`);
  const health = await fetch(`${prodUrl}/api/health`, { signal: AbortSignal.timeout(8_000) });
  if (!health.ok) throw new Error(`production health failed: ${health.status}`);
  const healthJson = await health.json();
  if (!healthJson.groqConfigured) throw new Error("production health says GROQ is not configured");

  const prompts = [
    "tell me more about gogaa",
    "which stack do you use?",
    "can you handle a Python project?",
    "what about timeline?",
  ];

  let history = [];
  for (const message of prompts) {
    const res = await fetch(`${prodUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`production chat failed for "${message}": ${res.status}`);
    const data = await res.json();
    const answer = String(data.answer ?? "");
    if (answer.length < 20) throw new Error(`production answer too short for "${message}"`);
    if (/please type a question/i.test(answer)) throw new Error(`production empty-message bug returned for "${message}"`);
    if (/temporarily unavailable|temporarily offline/i.test(answer)) throw new Error(`production fallback returned for "${message}"`);
    history = [...history, { role: "user", content: message }, { role: "assistant", content: answer }].slice(-8);
    console.log(`  ok ${message}`);
  }
}

run("npm", ["run", "lint"]);
run("npm", ["run", "build"]);
run("npm", ["run", "test:chat-eval"]);

let devServer;
if (!(await canReach(localUrl))) {
  console.log(`\n> starting dev server for browser QA at ${localUrl}`);
  devServer = spawn("npm", ["run", "dev"], { stdio: "inherit", env: process.env });
  const ready = await waitFor(localUrl);
  if (!ready) {
    devServer.kill("SIGTERM");
    throw new Error(`local dev server did not become ready at ${localUrl}`);
  }
}

try {
  run("npm", ["run", "test:agent-chat"], { env: { PLAYWRIGHT_BASE_URL: localUrl } });
  await productionSmoke();
} finally {
  if (devServer) devServer.kill("SIGTERM");
}

console.log("\nlaunch check passed");
