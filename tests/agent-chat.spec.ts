
import { expect, test, type Page } from "@playwright/test";

async function prepare(page: Page): Promise<string[]> {
  const errors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;

    const text = msg.text();

    if (text.includes("Failed to load resource")) return;

    if (
      text.includes("<path> attribute d: Expected moveto path command") &&
      text.includes('"undefined"')
    ) {
      return;
    }

    errors.push(text);
  });

  page.on("pageerror", (err) => errors.push(err.message));

  await page.addInitScript(() => {
    localStorage.setItem("boot-ever-seen", "1");
    sessionStorage.setItem("visitor-intent-dismissed", "1");

    if (sessionStorage.getItem("agent-chat-test-cleaned") !== "1") {
      localStorage.removeItem("portfolio-chat-history");
      sessionStorage.setItem("agent-chat-test-cleaned", "1");
    }

    sessionStorage.setItem("boot-complete", "1");
  });

  return errors;
}

async function openAgentEntry(page: Page): Promise<void> {
  const openButton = page.getByRole("button", {
    name: /^Open agent/,
  }).first();

  await expect(openButton).toBeVisible({ timeout: 10_000 });
  await openButton.click();
}

test("agent bar and chat act as one unified flow", async ({ page }) => {
  const errors = await prepare(page);

  const chatPayloads: Array<{ message?: string; query?: string }> = [];

  await page.route("**/api/chat", async (route) => {
    const payload = route.request().postDataJSON() as {
      message?: string;
      query?: string;
    };

    chatPayloads.push(payload);
    expect(payload.message?.trim()).toBeTruthy();

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        answer:
          "Yes. Python project work is in scope when the goal is clear. Book a call to scope timeline, risks, and delivery shape.",
        actions: [
          {
            label: "Book a 15-min call",
            href: "https://ahtesham.dev.wadwarehouse.com/book",
          },
        ],
      }),
    });
  });

  await page.goto("/");
  await openAgentEntry(page);

  const bar = page.locator('[data-agent-bar="fixed"]');
  await expect(bar).toBeVisible();

  const box = await bar.boundingBox();
  const viewport = page.viewportSize();

  expect(box).not.toBeNull();

  if (box && viewport) {
    expect(box.width).toBeLessThanOrEqual(
      Math.min(340, viewport.width - 32),
    );
    expect(box.x).toBeGreaterThanOrEqual(16);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width - 16);
  }

  await page.getByLabel("Open chat").first().click();

  const chatPanel = page.locator('[data-chat-panel="open"]');

  await expect(page.getByText("Ahtesham Agent")).toBeVisible();
  await expect(page.getByText("scoped to his work")).toBeVisible();
  await expect(
    chatPanel.locator("button", {
      hasText: /Llama|Claude|GPT|Nemotron/i,
    }),
  ).toHaveCount(0);
  await expect(chatPanel.getByText(/response style/i)).toHaveCount(0);
  await expect(page.getByPlaceholder("reply in chat...")).toBeVisible();

  await page.getByLabel("Close chat").first().click();
  await expect(page.getByText("Ahtesham Agent")).toBeHidden();

  await page.getByLabel("Open chat").first().click();
  await expect(page.getByText("Ahtesham Agent")).toBeVisible();

  await page
    .getByPlaceholder("reply in chat...")
    .fill("I have a Python project, can you handle it?");

  await page.keyboard.press("Enter");

  await expect(
    page.getByText("I have a Python project, can you handle it?"),
  ).toBeVisible();

  await expect(
    page.getByText(/Python|scope|project|call/i).first(),
  ).toBeVisible();

  expect(chatPayloads).toHaveLength(1);

  await page.reload();
  await openAgentEntry(page);

  await page.getByLabel("Open chat").first().click();

  await expect(
    page.getByText("I have a Python project, can you handle it?"),
  ).toBeVisible();

  await expect(page.getByText("Ahtesham Agent")).toBeVisible();

  expect(errors).toEqual([]);
});

test("agent bar remains usable on mobile", async ({ page }) => {
  const errors = await prepare(page);

  await page.goto("/");
  await openAgentEntry(page);

  const bar = page.locator('[data-agent-bar="fixed"]');
  await expect(bar).toBeVisible();

  const box = await bar.boundingBox();
  const viewport = page.viewportSize();

  expect(box).not.toBeNull();

  if (box && viewport) {
    expect(box.width).toBeLessThanOrEqual(
      Math.min(340, viewport.width - 32),
    );
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  }

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

   const agentInput = page
    .locator('[data-agent-bar="fixed"]')
    .locator("input");

  await agentInput.fill("open gogaa");
  await expect(agentInput).toBeVisible();
  await agentInput.press("Enter");

 const projectDialog = page.getByRole("dialog");

await expect(projectDialog).toBeVisible({ timeout: 10000 });

await expect(
  projectDialog.getByText("Gogaa CLI — Details", { exact: true }),
).toBeVisible();

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

test("first-time visitor chat flow preserves history and badge across scroll", async ({
  page,
}) => {
  const errors = await prepare(page);
  const seen: string[] = [];

  await page.route("**/api/chat", async (route) => {
    const payload = route.request().postDataJSON() as {
      message?: string;
      history?: Array<{ role: string; content: string }>;
    };

    seen.push(payload.message ?? "");

    const answer =
      seen.length === 1
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

  await page
    .getByPlaceholder("reply in chat...")
    .fill("tell me more about gogaa");

  await page.keyboard.press("Enter");

  await expect(
    page.getByText(/open-source AI coding agent with 11 providers/i),
  ).toBeVisible();

  await page
    .getByPlaceholder("reply in chat...")
    .fill("what about timeline?");

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
