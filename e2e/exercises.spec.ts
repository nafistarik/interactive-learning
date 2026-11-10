import { expect, test } from "@playwright/test";

import { openPractice, practiceButton, setCode, verdict } from "./helpers";

/* Brief Part 10 and 15: every exercise passes with a correct solution and fails usefully. */

test("Ex 01 (lesson 03): wrong shape is named, correct arrays pass", async ({ page }) => {
  await openPractice(page, "03");
  await setCode(page, "import numpy as np\na = np.array([1, 2, 3, 4])\nb = np.array([1, 2, 3, 4, 5, 6])");
  await practiceButton(page, "Check solution").click();
  await expect(verdict(page)).toContainText("Not yet");
  await expect(verdict(page)).toContainText("b");

  await setCode(
    page,
    [
      "import numpy as np",
      "a = np.array([1, 2, 3, 4])",
      "b = np.arange(1, 7).reshape(3, 2)",
      "c = np.arange(1, 9).reshape(2, 2, 2)",
      "a_shape = a.shape",
      "b_shape = b.shape",
      "c_shape = c.shape",
    ].join("\n"),
  );
  await practiceButton(page, "Check solution").click();
  await expect(verdict(page)).toContainText("Passed");
});

test("Ex 02 (lesson 06): a hard-coded answer fails, a * b passes", async ({ page }) => {
  await openPractice(page, "06");
  await setCode(page, "import numpy as np\nresult = np.array([4, 10, 18])");
  await practiceButton(page, "Check solution").click();
  await expect(verdict(page)).toContainText("wrong values");

  await setCode(page, "result = a * b");
  await practiceButton(page, "Run all").click();
  // The fixed setup runs first, so a and b are in the inspector next to result.
  const variables = page.locator("#panel-practice section[aria-label=Variables]");
  await expect(variables).toContainText("[4, 10, 18]");
  await expect(variables).toContainText("[1, 2, 3]");
  await practiceButton(page, "Check solution").click();
  await expect(verdict(page)).toContainText("Passed");
});

test("Ex 03 (lesson 07): changing X makes the check fail", async ({ page }) => {
  await openPractice(page, "07");
  await setCode(page, "import numpy as np\nX = np.array([[1, 2], [3, 4], [5, 7]])\nw = np.array([2, 3])\nout = X * w");
  await practiceButton(page, "Check solution").click();
  await expect(verdict(page)).toContainText("Not yet");
  await expect(verdict(page)).toContainText("X");
});

test("Ex 04 (lesson 08): a hard-coded answer fails, X * w + b passes", async ({ page }) => {
  await openPractice(page, "08");
  await setCode(page, "import numpy as np\nout = np.array([[3, 5], [7, 11], [11, 17]])");
  await practiceButton(page, "Check solution").click();
  await expect(verdict(page)).toContainText("wrong values");

  await setCode(page, "out = X * w + b");
  await practiceButton(page, "Check solution").click();
  await expect(verdict(page)).toContainText("Passed");
});

test("the hint opens and costs a star", async ({ page }) => {
  await openPractice(page, "06");
  await page.locator("#panel-practice").getByRole("button", { name: "Show hint" }).click();
  await expect(page.locator("#panel-practice")).toContainText("multiplies them element by element");
  await setCode(page, "result = a * b");
  await practiceButton(page, "Check solution").click();
  await expect(verdict(page)).toContainText("★★☆");
});
