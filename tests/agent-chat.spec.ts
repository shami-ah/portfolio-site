import { expect, test, type Page } from "@playwright/test";

async function prepare(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (text.includes("Failed to load resource")) return;
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
  await page.locator(".agent-emoji-body").click({ force: true });

  const bar = page.locator('[data-agent-bar="hero"]');
  await expect(bar).toBeVisible();

  const box = await bar.boundingBox();
  const viewport = page.viewportSize();
  expect(box?.width).toBeLessThanOrEqual(470);
  if (box && viewport) expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(6);

  await page.getByLabel("Open chat").first().click();
  await expect(page.getByText("Ahtesham Agent")).toBeVisible();
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
  await page.locator(".agent-emoji-body").click({ force: true });
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
  await page.locator(".agent-emoji-body").click({ force: true });

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
