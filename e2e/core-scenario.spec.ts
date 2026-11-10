import { expect, test } from "@playwright/test";

import { openPractice, output, practiceButton, verdict } from "./helpers";

/* Brief Part 9, steps 1–5, end to end with real Pyodide and NumPy. */
test("lesson 07: step, break w, read the shape error, fix, pass, keep progress", async ({ page }) => {
  await openPractice(page, "07");
  const panel = page.locator("#panel-practice");

  // Steps 1–2: step through the recorded frames.
  await practiceButton(page, "Step forward").click();
  await expect(panel.getByText(/Step 1 of 4 · lines 1 ·/)).toBeVisible();
  await practiceButton(page, "Step forward").click();
  await expect(panel.getByText(/Step 2 of 4 · lines 3–7/)).toBeVisible();
  await expect(panel.locator("figure").first()).toContainText("shape (3, 2)");
  await practiceButton(page, "Step forward").click();
  await expect(panel.locator("figure").first()).toContainText("shape (2,)");

  // Step 3: X * w with the real result.
  await practiceButton(page, "Step forward").click();
  await expect(panel.getByText(/Step 4 of 4 · lines 11/)).toBeVisible();
  const result = panel.locator("figure", { hasText: /^result/ });
  await expect(result).toContainText("shape (3, 2)", { timeout: 15_000 });
  await expect(result).toContainText("18");

  // Step back shows the earlier frame's data, not just a moved highlight.
  await practiceButton(page, "Step back").click();
  await expect(panel.getByText(/Step 3 of 4 · lines 9/)).toBeVisible();

  // Step 4: break it; the explanation comes from the recorded shapes.
  // Edit line 9 the way a learner would: put the cursor before "])" and type ", 4".
  await page.locator(".monaco-editor").first().click();
  await page.keyboard.press("ControlOrMeta+Home");
  for (let line = 1; line < 9; line++) await page.keyboard.press("ArrowDown");
  await page.keyboard.press("End");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.insertText(", 4");
  await expect(page.locator(".monaco-editor").first()).toContainText("w = np.array([2, 3, 4])");
  await practiceButton(page, "Run all").click();
  await expect(output(page)).toContainText("ValueError");
  await expect(panel.getByText(/Not compatible at axis 0 from the right: 2 and 3/)).toBeVisible({ timeout: 15_000 });
  await expect(panel.getByText("Fix the operand that does not match:")).toBeVisible();
  await expect(panel.getByText("w is defined on line 9.")).toBeVisible();

  // A broken solution does not pass.
  await practiceButton(page, "Check solution").click();
  await expect(verdict(page)).toContainText("Not yet");

  // Step 5: fix and complete.
  await practiceButton(page, "Reset code").click();
  await practiceButton(page, "Check solution").click();
  await expect(verdict(page)).toContainText("Passed");
  const progress = page.getByLabel("Lesson progress");
  await expect(progress).toContainText("Exercise");
  await expect(progress).toContainText("Passed ★★");

  // Progress survives a reload.
  await page.reload();
  await expect(page.getByLabel("Lesson progress")).toContainText("Passed ★★");
});
