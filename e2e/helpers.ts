import { expect, type Page } from "@playwright/test";

/** Pyodide and NumPy come from the CDN on first use; allow for a slow network. */
export const PYTHON_READY_MS = 90_000;

/**
 * Opens a lesson's Practice view and waits until Python and NumPy are ready.
 *
 * @param page - The page.
 * @param lessonId - Two-digit lesson id.
 */
export async function openPractice(page: Page, lessonId: string): Promise<void> {
  await page.goto(`/learn/arrays/lesson/${lessonId}`);
  await page.getByRole("tab", { name: "practice" }).click();
  await expect(page.locator("#panel-practice").getByText("Python and NumPy ready.")).toBeVisible({ timeout: PYTHON_READY_MS });
}

/**
 * Replaces the editor content the way a learner pasting code would. Monaco auto-indents
 * after a line ending in `[` or `:`, so pass code whose lines need no indentation.
 *
 * @param page - The page.
 * @param code - The new code.
 */
export async function setCode(page: Page, code: string): Promise<void> {
  const editor = page.locator(".monaco-editor").first();
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Delete");
  await page.keyboard.insertText(code);
  // The editor reports the change; wait until the text is in the model.
  await expect(editor).toContainText(code.split("\n").filter(Boolean).at(-1)!.trim().slice(0, 12));
}

/** The arena's output panel. */
export function output(page: Page) {
  return page.locator("#panel-practice pre[aria-live]");
}

/** The exercise feedback line after Check solution. */
export function verdict(page: Page) {
  return page.locator("#panel-practice section[aria-label=Exercise] [role=status]");
}

/** A button inside the Practice view by its visible name. */
export function practiceButton(page: Page, name: string) {
  return page.locator("#panel-practice").getByRole("button", { name, exact: true });
}
