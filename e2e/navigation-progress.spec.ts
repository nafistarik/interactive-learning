import { expect, test } from "@playwright/test";

import { AVAILABLE_MODULES } from "../src/data/curriculum";

/** Lessons across every open module, as the dashboard counts them. */
const LESSONS = AVAILABLE_MODULES.reduce((sum, mod) => sum + mod.lessons.length, 0);

/* Brief Part 4 and 15: routes, links, 404, knowledge check, XP, reset. */

test("every lesson opens, and previous/next walk the module in order", async ({ page }) => {
  await page.goto("/learn/arrays/lesson/01");
  for (let lesson = 1; lesson <= 8; lesson++) {
    const id = String(lesson).padStart(2, "0");
    await expect(page).toHaveURL(new RegExp(`/lesson/${id}$`));
    await expect(page.getByText(`Lesson ${id} of 8`)).toBeVisible();
    if (lesson < 8) {
      await page.getByRole("link", { name: /^Next lesson/ }).click();
    }
  }
  await page.getByRole("link", { name: /^Previous lesson/ }).click();
  await expect(page).toHaveURL(/\/lesson\/07$/);
});

test("an unknown lesson is a real 404", async ({ page }) => {
  const response = await page.goto("/learn/arrays/lesson/09");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("dashboard and overview link to the module and lessons", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Machine Learning")).toBeVisible();
  await page.getByRole("link", { name: /Arrays, Vectorization & Broadcasting/ }).click();
  await expect(page).toHaveURL(/\/learn\/arrays$/);
  await page.getByRole("link", { name: /Array Indexing/ }).click();
  await expect(page).toHaveURL(/\/lesson\/04$/);
  await page.goto("/");
  await page.getByRole("link", { name: "Continue learning" }).click();
  await expect(page).toHaveURL(/\/lesson\/04$/);
});

test("passing lesson 01's check completes it, gives 50 XP, and reset clears it", async ({ page }) => {
  await page.goto("/learn/arrays/lesson/01");
  const check = page.locator("section", { has: page.getByRole("heading", { name: "Knowledge check" }) });
  const questions = check.locator("fieldset");
  const count = await questions.count();
  // Try each option until the feedback says it is right (retries are allowed).
  for (let index = 0; index < count; index++) {
    const question = questions.nth(index);
    const options = question.getByRole("radio");
    for (let option = 0; option < (await options.count()); option++) {
      await options.nth(option).check();
      if (await question.getByText(/^Right\./).isVisible()) {
        break;
      }
    }
  }
  await expect(check.getByText("Passed. Every answer is right.")).toBeVisible();
  await expect(page.getByLabel("Lesson progress")).toContainText("Completed");

  await page.goto("/progress");
  await expect(page.locator("dl").first()).toContainText("50");

  await page.getByRole("button", { name: "Reset progress" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Cancel" }).click();
  await expect(page.locator("dl").first()).toContainText("50");

  await page.getByRole("button", { name: "Reset progress" }).click();
  await dialog.getByRole("button", { name: "Reset progress" }).click();
  await expect(page.locator("dl dd").first()).toHaveText("0");
  await page.reload();
  await expect(page.locator("dl dd").first()).toHaveText("0");
});

test("a corrupt saved progress starts fresh instead of crashing", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("vlp:progress:v1", "{not json"));
  await page.reload();
  await expect(page.getByLabel("Your progress")).toContainText(`0 / ${LESSONS}`);
});

test("MVP 1 progress is migrated to v2 and kept", async ({ page }) => {
  await page.goto("/");
  // Wait until the page has read (and saved) its progress, so it cannot overwrite the v1 value.
  await expect(page.getByLabel("Your progress")).toContainText(`0 / ${LESSONS}`);
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem(
      "vlp:progress:v1",
      JSON.stringify({
        version: 1,
        currentLesson: "06",
        completedLessons: ["01"],
        passedChecks: ["01"],
        exercises: { ex02: { passed: true, attempts: 1, hintUsed: false, stars: 3 } },
      }),
    );
  });
  await page.reload();
  const summary = page.getByLabel("Your progress");
  await expect(summary).toContainText("150");
  await expect(summary).toContainText(`1 / ${LESSONS}`);
  await page.getByRole("link", { name: "Continue learning" }).click();
  await expect(page).toHaveURL(/\/learn\/arrays\/lesson\/06$/);
  await expect(page.getByLabel("Lesson progress")).toContainText("Passed ★★★");
  const saved = await page.evaluate(() => localStorage.getItem("vlp:progress:v2"));
  expect(saved).toContain("arrays/01");
});
