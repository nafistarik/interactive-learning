import { expect, test } from "@playwright/test";

import { AVAILABLE_MODULES } from "../src/data/curriculum";

import { openPractice, practiceButton, setCodeExact, verdict } from "./helpers";

/* Every available module after 0.1 (covered in detail elsewhere): pages, demos, exercises. */
const NEW_MODULES = AVAILABLE_MODULES.filter((mod) => mod.slug !== "arrays");

for (const mod of NEW_MODULES) {
  test.describe(`Module ${mod.number} ${mod.title}`, () => {
    test("overview and every lesson open; the first playground draws from a real run", async ({ page }) => {
      await page.goto(`/learn/${mod.slug}`);
      await expect(page.getByRole("heading", { name: mod.title })).toBeVisible();
      for (const lesson of mod.lessons) {
        await page.goto(`/learn/${mod.slug}/lesson/${lesson.id}`);
        await expect(page.getByRole("heading", { name: lesson.title, level: 1 })).toBeVisible();
      }
      await page.goto(`/learn/${mod.slug}/lesson/01`);
      const demo = page.locator("section[aria-label^='Interactive demo']").first();
      await expect(demo.locator("figure").first()).toBeVisible({ timeout: 90_000 });
    });

    for (const exercise of mod.exercises) {
      test(`${exercise.id}: the starter fails and the solution passes`, async ({ page }) => {
        await openPractice(page, `${exercise.lessonId}`.padStart(2, "0"), mod.slug);
        if (exercise.type === "bug-hunt") {
          await expect(page.locator("#panel-practice")).toContainText("Bug hunt");
        }
        await practiceButton(page, "Check solution").click();
        await expect(verdict(page)).toContainText("Not yet");

        await setCodeExact(page, exercise.solution);
        await practiceButton(page, "Check solution").click();
        await expect(verdict(page)).toContainText("Passed");
        await expect(page.getByLabel("Lesson progress")).toContainText("Passed");
      });
    }
  });
}

test("the dashboard lists every available module with a link", async ({ page }) => {
  await page.goto("/");
  for (const mod of AVAILABLE_MODULES) {
    await expect(page.getByRole("link", { name: new RegExp(mod.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) })).toBeVisible();
  }
});
