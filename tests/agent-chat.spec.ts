import { expect, test, type Page } from "@playwright/test";

async function prepare(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (text.includes("Failed to load resource")) return;
    if (text.includes("<path> attribute d: Expected moveto path command") && text.includes('"undefined"')) return;
    errors.push(text);
  });
  page.on("pageerror", (err) => errors.push(err.message));
  await page.addInitScript(() => {
    localStorage.setItem("boot-ever-seen", "1");
    if (sessionStorage.getItem("agent-chat-test-cleaned") !== "1") {
      localStorage.removeItem("portfolio-chat-history");
      sessionStorage.setItem("agent-chat-test-cleaned", "1");
    }
    sessionStorage.setItem("boot-complete", "1");
  });
  return errors;
}

async function openAgentEntry(page: Page): Promise<void> {
  try {
    await page.locator(".agent-emoji-body").first().click({ force: true, timeout: 3_000 });
    return;
  } catch {
    await page.locator('[data-agent-pill="fixed"]').first().click({ force: true, timeout: 8_000 });
  }
}

test("agent bar and chat act as one unified flow", async ({ page }) => {
  const errors = await prepare(page);
  const chatPayloads: Array<{ message?: string; query?: string }> = [];
  await page.route("**/api/chat", async (route) => {
    const payload = route.request().postDataJSON() as { message?: string; query?: string };
    chatPayloads.push(payload);
    expect(payload.message?.trim()).toBeTruthy();
    expect(payload.query?.trim()).toBeTruthy();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        answer: "Yes. Python project work is in scope when the goal is clear. Book a call to scope timeline, risks, and delivery shape.",
        actions: [{ label: "Book a 15-min call", href: "https://ahtesham.dev.wadwarehouse.com/book" }],
      }),
    });
  });
  await page.goto("/");
  await openAgentEntry(page);

  const bar = page.locator('[data-agent-bar="hero"]');
  await expect(bar).toBeVisible();

  const box = await bar.boundingBox();
  const viewport = page.viewportSize();
  expect(box?.width).toBeLessThanOrEqual(470);
  if (box && viewport) expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(6);

  await page.getByLabel("Open chat").first().click();
  const chatPanel = page.locator('[data-chat-panel="open"]');
  await expect(page.getByText("Ahtesham Agent")).toBeVisible();
  await expect(page.getByText("scoped to his work")).toBeVisible();
  await expect(chatPanel.locator("button", { hasText: /Llama|Claude|GPT|Nemotron/i })).toHaveCount(0);
  await expect(chatPanel.getByText(/response style/i)).toHaveCount(0);
  await expect(page.getByPlaceholder("reply in chat...")).toBeVisible();

  await page.getByLabel("Open chat").first().click();
  await expect(page.getByText("Ahtesham Agent")).toBeHidden();
  await page.getByLabel("Open chat").first().click();
  await expect(page.getByText("Ahtesham Agent")).toBeVisible();

  await page.getByPlaceholder("reply in chat...").fill("I have a Python project, can you handle it?");
  await page.keyboard.press("Enter");
  await expect(page.getByText("I have a Python project, can you handle it?")).toBeVisible();
  await expect(page.getByText(/Python|scope|project|call/i).first()).toBeVisible();
  expect(chatPayloads).toHaveLength(1);

  await page.reload();
  await openAgentEntry(page);
  await page.getByLabel("Open chat").first().click();
  await expect(page.getByText("I have a Python project, can you handle it?")).toBeVisible();

  await page.getByLabel("Close chat").click();
  await page.keyboard.press("Escape");
  await expect(page.getByText("Ahtesham Agent")).toBeHidden();

  expect(errors).toEqual([]);
});

test("agent bar remains centered and usable on mobile", async ({ page }) => {
  const errors = await prepare(page);
  await page.goto("/");
  await openAgentEntry(page);

  const bar = page.locator('[data-agent-bar="hero"]');
  await expect(bar).toBeVisible();

  const box = await bar.boundingBox();
  const viewport = page.viewportSize();
  expect(box?.width).toBeLessThanOrEqual((viewport?.width ?? 390) - 32);
  if (box && viewport) expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(5);

  await page.getByLabel("Open chat").first().click();
  await expect(page.getByText("Ahtesham Agent")).toBeVisible();
  await expect(page.getByPlaceholder("reply in chat...")).toBeVisible();

  expect(errors).toEqual([]);
});

test("project name queries open the exact project details", async ({ page }) => {
  const errors = await prepare(page);
  const chatRequests: string[] = [];
  await page.route("**/api/chat", async (route) => {
    chatRequests.push(route.request().postData() ?? "");
    await route.abort();
  });

  await page.goto("/");
  await openAgentEntry(page);
  await page.getByPlaceholder("ask anything about Ahtesham's work...").fill("tell me more about gogaa");
  await page.keyboard.press("Enter");

  await expect(page.getByRole("dialog").getByText("Gogaa CLI — Details")).toBeVisible({ timeout: 8000 });
  await expect(page.getByText("Details").first()).toBeVisible();
  expect(chatRequests).toHaveLength(0);
  expect(errors).toEqual([]);
});

test("core routes load without browser errors", async ({ page }) => {
  for (const path of ["/", "/uses", "/writing", "/journey"]) {
    const errors = await prepare(page);
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(errors, path).toEqual([]);
  }
});

test("first-time visitor chat flow preserves history and badge across scroll", async ({ page }) => {
  const errors = await prepare(page);

  const seen: string[] = [];
  await page.route("**/api/chat", async (route) => {
    const payload = route.request().postDataJSON() as { message?: string; history?: Array<{ role: string; content: string }> };
    seen.push(payload.message ?? "");
    const answer = seen.length === 1
      ? "Gogaa is Ahtesham's open-source AI coding agent with 11 providers and 1,418 tests."
      : "Timeline usually starts with 1-3 days of discovery, then sprint-based delivery with weekly demos.";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ answer, actions: [] }),
    });
  });

  await page.goto("/");
  await openAgentEntry(page);
  await page.getByLabel("Open chat").first().click();
  await page.getByPlaceholder("reply in chat...").fill("tell me more about gogaa");
  await page.keyboard.press("Enter");
  await expect(page.getByText(/open-source AI coding agent with 11 providers/i)).toBeVisible();

  await page.getByPlaceholder("reply in chat...").fill("what about timeline?");
  await page.keyboard.press("Enter");
  await expect(page.getByText("1-3 days")).toBeVisible();
  expect(seen).toHaveLength(2);

  await page.getByLabel("Minimize chat").click();
  await expect(page.getByText("Ahtesham Agent")).toBeHidden();
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(500);
  await page.getByLabel("Open chat").first().click();
  await expect(page.getByText("tell me more about gogaa")).toBeVisible();
  await expect(page.getByText("what about timeline?")).toBeVisible();

  await page.reload();
  await openAgentEntry(page);
  await page.getByLabel("Open chat").first().click();
  await expect(page.getByText("what about timeline?")).toBeVisible();

  expect(errors).toEqual([]);
});
