import { expect, test } from "@playwright/test";

import { openPractice, output, practiceButton, PYTHON_READY_MS, setCode } from "./helpers";

/* Brief Part 6.3, 12 and 15: timeout, load failure, reduced motion, layouts, keyboard, theme. */

test("an infinite loop is stopped after 10 seconds and the page stays usable", async ({ page }) => {
  test.setTimeout(120_000);
  await openPractice(page, "01");
  await setCode(page, "x = 0\nwhile True: x += 1");
  await practiceButton(page, "Run all").click();
  await expect(output(page)).toHaveText("Running…");
  // The main thread is free while the worker spins.
  await page.getByRole("tab", { name: "theory" }).click();
  await expect(page.locator("#panel-theory")).toBeVisible();
  await page.getByRole("tab", { name: "practice" }).click();
  await expect(output(page)).toContainText("Run stopped", { timeout: 20_000 });

  // The next run gets a fresh runtime.
  await setCode(page, "print(1 + 1)");
  await practiceButton(page, "Run all").click();
  await expect(output(page)).toHaveText("2", { timeout: PYTHON_READY_MS });
});

test("when Pyodide cannot load, Retry recovers once the network is back", async ({ page, context }) => {
  test.setTimeout(150_000);
  await context.route("**/cdn.jsdelivr.net/pyodide/**", (route) => route.abort());
  await page.goto("/learn/arrays/lesson/01");
  await page.getByRole("tab", { name: "practice" }).click();
  await expect(page.locator("#panel-practice").getByText("Python could not load.")).toBeVisible({ timeout: PYTHON_READY_MS });

  await context.unroute("**/cdn.jsdelivr.net/pyodide/**");
  await page.locator("#panel-practice").getByRole("button", { name: "Retry" }).click();
  await expect(page.locator("#panel-practice").getByText("Python and NumPy ready.")).toBeVisible({ timeout: PYTHON_READY_MS });
});

test("with reduced motion a step shows its end state at once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openPractice(page, "07");
  await practiceButton(page, "Run all").click();
  await expect(page.locator("#panel-practice").getByText(/stage 3 of 3/)).toBeVisible({ timeout: 2_000 });
});

test("without reduced motion the broadcast plays from the first stage", async ({ page }) => {
  await openPractice(page, "07");
  await practiceButton(page, "Run all").click();
  await expect(page.locator("#panel-practice").getByText(/stage 1 of 3/)).toBeVisible();
  await expect(page.locator("#panel-practice").getByText(/stage 3 of 3/)).toBeVisible({ timeout: 10_000 });
});

test("tablet: editor and visualization sit side by side", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await openPractice(page, "07");
  const editor = await page.locator(".monaco-editor").first().boundingBox();
  const visual = await page.getByText("Run the code to see the arrays").boundingBox();
  expect(editor && visual).toBeTruthy();
  expect(visual!.x).toBeGreaterThan(editor!.x + editor!.width - 1);
  expect(Math.abs(visual!.y - editor!.y)).toBeLessThan(80);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(768);
});

test("phone: Practice shows the notice and read-only starter code, no editor", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/learn/arrays/lesson/07");
  await page.getByRole("tab", { name: "practice" }).click();
  await expect(page.getByText("Coding works best on a larger screen.", { exact: false })).toBeVisible();
  await expect(page.getByLabel("Starter code")).toContainText("out = X * w");
  await expect(page.locator(".monaco-editor")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test("keyboard: arrow keys switch tabs and the run controls are reachable", async ({ page }) => {
  await page.goto("/learn/arrays/lesson/07");
  await page.getByRole("tab", { name: "theory" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "practice" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "practice" })).toHaveAttribute("aria-selected", "true");
  const runAll = practiceButton(page, "Run all");
  for (let presses = 0; presses < 30 && !(await runAll.evaluate((el) => el === document.activeElement)); presses++) {
    await page.keyboard.press("Tab");
  }
  await expect(runAll).toBeFocused();
});

test("theme toggle switches and is remembered", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
