import { expect, test } from "@playwright/test";

import { AVAILABLE_MODULES } from "../src/data/curriculum";

/* Every lesson on a phone in the light theme: nothing may scroll sideways, demos included. */
const LESSONS = AVAILABLE_MODULES.flatMap((mod) => mod.lessons.map((lesson) => `/learn/${mod.slug}/lesson/${lesson.id}`));

test.describe("phone: no lesson scrolls sideways", () => {
  test.use({ viewport: { width: 375, height: 812 }, colorScheme: "light" });
  for (const path of LESSONS) {
    test(path, async ({ page }) => {
      test.setTimeout(120_000);
      await page.goto(path);
      await page.locator("section[aria-label^='Interactive demo'] figure").first().waitFor({ timeout: 90_000 }).catch(() => undefined);
      await page.waitForTimeout(1000);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
    });
  }
});
