import { loadPyodide, type PyodideInterface } from "pyodide";
import { beforeAll, describe, expect, it } from "vitest";

import { join } from "node:path";

import { PYODIDE_INDEX_URL } from "@/lib/python/pyodide-version";
import { runPython } from "@/lib/python/run-python";

/*
 * Runs real Pyodide and NumPy at the pinned version the browser uses. The first
 * load downloads NumPy, so this suite needs network access and a longer timeout.
 */
describe("runPython with Pyodide and NumPy", () => {
  let pyodide: PyodideInterface;

  beforeAll(async () => {
    // Runtime files come from the installed package (same pinned version as the CDN);
    // NumPy comes from the CDN, which is what the browser uses.
    pyodide = await loadPyodide({
      indexURL: join(process.cwd(), "node_modules", "pyodide") + "/",
      packageBaseUrl: PYODIDE_INDEX_URL,
    });
    await pyodide.loadPackage("numpy");
  }, 180_000);

  it("returns what the code printed", async () => {
    const result = await runPython(
      pyodide,
      "import numpy as np\nprint(np.array([1, 2]) * 2)",
    );

    expect(result).toEqual({ ok: true, stdout: "[2 4]" });
  });

  it("reports the NumPy broadcasting error from Part 9 step 4", async () => {
    const result = await runPython(
      pyodide,
      [
        "import numpy as np",
        "X = np.array([[1, 2], [3, 4], [5, 6]])",
        "w = np.array([2, 3, 4])",
        "out = X * w",
      ].join("\n"),
    );

    expect(result.ok).toBe(false);
    expect(result).toHaveProperty(
      "error",
      expect.stringContaining("operands could not be broadcast together with shapes (3,2) (3,)"),
    );
  });

  it("computes the Part 9 result from real NumPy", async () => {
    const result = await runPython(
      pyodide,
      [
        "import numpy as np",
        "X = np.array([[1, 2], [3, 4], [5, 6]])",
        "w = np.array([2, 3])",
        "out = X * w",
        "print(out.tolist())",
      ].join("\n"),
    );

    expect(result).toEqual({ ok: true, stdout: "[[2, 6], [6, 12], [10, 18]]" });
  });

  it("keeps the output printed before an error", async () => {
    const result = await runPython(pyodide, "print('before')\n1 / 0");

    expect(result.stdout).toBe("before");
    expect(result.ok).toBe(false);
  });
});
