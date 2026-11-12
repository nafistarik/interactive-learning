import type { PyodideInterface } from "pyodide";
import { beforeAll, describe, expect, it } from "vitest";

import type { ExecutionFrame } from "@/features/execution/frames";
import { installRecorder, recordFrames } from "@/lib/python/record-frames";
import { validateExercise } from "@/lib/python/validate-exercise";

import { loadTestPyodide } from "./load-test-pyodide";

/* R3 engine: loop iterations, ufunc steps, tolerance and assert checks, in Pyodide. */
describe("recording loops and ufuncs", () => {
  let pyodide: PyodideInterface;

  beforeAll(async () => {
    pyodide = await loadTestPyodide();
    installRecorder(pyodide);
  }, 180_000);

  function frames(code: string): ExecutionFrame[] {
    const outcome = recordFrames(pyodide, code);
    if (!outcome.ok) {
      throw new Error(outcome.error);
    }
    return outcome.frames;
  }

  const TRAINING = [
    "import numpy as np",
    "x = np.array([1.0, 2.0, 3.0, 4.0])",
    "y = 2 * x + 1",
    "w, b = 0.0, 0.0",
    "losses = []",
    "for step in range(50):",
    "    pred = w * x + b",
    "    error = pred - y",
    "    loss = np.mean(error ** 2)",
    "    w -= 0.05 * np.mean(2 * error * x)",
    "    b -= 0.05 * np.mean(2 * error)",
    "    losses.append(loss)",
  ].join("\n");

  it("watches what the loop body assigns, in order", () => {
    const loop = frames(TRAINING).at(-1)?.loop;
    expect(loop?.watched).toEqual(["step", "pred", "error", "loss", "w", "b", "losses"]);
    expect(loop?.total).toBe(50);
    expect(loop?.sampled).toBe(false);
  });

  it("records real values per iteration: the loss goes down, predictions are arrays", () => {
    const iterations = frames(TRAINING).at(-1)?.loop?.iterations ?? [];
    const losses = iterations.map((item) => {
      const value = item.values.loss;
      return value && "number" in value ? Number(value.number) : Number.NaN;
    });
    expect(losses).toHaveLength(50);
    expect(losses[49]).toBeLessThan(losses[0]);
    const pred = iterations[10].values.pred;
    expect(pred && "array" in pred ? pred.array.shape : null).toEqual([4]);
    const history = iterations[49].values.losses;
    expect(history && "array" in history ? history.array.shape : null).toEqual([50]);
  });

  it("samples a long loop evenly, keeps at most 300 iterations and always the last", () => {
    const loop = frames("total = 0\nfor i in range(1000):\n    total += i").at(-1)?.loop;
    expect(loop?.total).toBe(1000);
    expect(loop?.sampled).toBe(true);
    const kept = loop?.iterations.map((item) => item.iteration) ?? [];
    expect(kept.length).toBeLessThanOrEqual(301);
    expect(kept[0]).toBe(0);
    expect(kept.at(-1)).toBe(999);
    const gaps = new Set(kept.slice(1, -1).map((value, index) => value - kept[index]));
    expect(gaps.size).toBe(1);
  });

  it("watches arrays the loop changes in place (Q[s, a] += ...)", () => {
    const loop = frames("import numpy as np\nQ = np.zeros((2, 2))\nfor step in range(3):\n    Q[step % 2, 1] += 1.0").at(-1)?.loop;
    expect(loop?.watched).toEqual(["step", "Q"]);
    const values = loop?.iterations.map((item) => {
      const value = item.values.Q;
      return value && "array" in value ? value.array.values : null;
    });
    expect(values).toEqual([
      [0, 1, 0, 0],
      [0, 1, 0, 1],
      [0, 2, 0, 1],
    ]);
  });

  it("keeps break and continue working", () => {
    const loop = frames("seen = []\nfor i in range(10):\n    if i % 2:\n        continue\n    if i > 6:\n        break\n    seen.append(i)").at(-1);
    expect(loop?.variables.find((variable) => variable.name === "seen")?.repr).toBe("[0, 2, 4, 6]");
    expect(loop?.loop?.total).toBe(9);
  });

  it("records a while loop, and keeps the iterations that ran when it fails", () => {
    const frame = frames("n = 0\nwhile True:\n    n += 1\n    if n == 3:\n        raise ValueError('stop')").at(-1);
    expect(frame?.operationType).toBe("loop");
    expect(frame?.status).toBe("error");
    expect(frame?.loop?.total).toBe(3);
  });

  it("records operations under a unary minus, including a failing @", () => {
    const ok = frames("import numpy as np\nX = np.ones((2, 2))\nw = np.ones(2)\np = 1 / (1 + np.exp(-(X @ w)))").at(-1);
    expect(ok?.operations.map((step) => step.kind)).toEqual(["matmul", "ufunc", "binary", "binary"]);
    const bad = frames("import numpy as np\nX = np.ones((2, 2))\nw = np.ones(3)\np = 1 / (1 + np.exp(-(X @ w)))").at(-1);
    expect(bad?.status).toBe("error");
    expect(bad?.operations.map((step) => step.kind)).toEqual(["matmul"]);
  });

  it("records np.sin and np.cos for positional encodings", () => {
    const frame = frames("import numpy as np\npos = np.arange(3) * 1.0\npe = np.sin(pos) + np.cos(pos)").at(-1);
    expect(frame?.operations.map((step) => (step.kind === "ufunc" ? step.fn : step.kind))).toEqual(["sin", "cos", "binary"]);
  });

  it("records np.exp as a ufunc step inside the sigmoid", () => {
    const frame = frames("import numpy as np\nz = np.array([-1.0, 0.0, 2.0])\np = 1 / (1 + np.exp(-z))").at(-1);
    expect(frame?.operations.map((step) => step.kind)).toEqual(["ufunc", "binary", "binary"]);
    const step = frame?.operations[0];
    expect(step?.kind === "ufunc" ? step.fn : null).toBe("exp");
  });

  it("checks a trained value within a tolerance, and an assertion with its message", () => {
    const runs = [{ prelude: "", reference: "import numpy as np\nw = 2.0" }];
    const checks = [
      { kind: "result" as const, name: "w", expression: "w", tolerance: 0.01 },
      { kind: "assert" as const, expression: "losses[-1] < losses[0]", message: "The loss should go down." },
    ];
    expect(validateExercise(pyodide, "w = 2.004\nlosses = [5, 1]", runs, checks)).toEqual({ passed: true, problems: [] });
    expect(validateExercise(pyodide, "w = 2.1\nlosses = [5, 1]", runs, checks).problems).toEqual(["w has the wrong values."]);
    expect(validateExercise(pyodide, "w = 2.0\nlosses = [1, 5]", runs, checks).problems).toEqual(["The loss should go down."]);
    expect(validateExercise(pyodide, "w = 2.0", runs, checks).problems[0]).toContain("The loss should go down.");
  });
});

describe("optional packages", () => {
  it("loads scikit-learn when the code imports it, and nothing for plain NumPy", async () => {
    const { loadTestPyodide: load, preparePackages } = await import("./load-test-pyodide");
    const { missingPackages } = await import("@/lib/python/packages");
    const pyodide = await load();
    expect(missingPackages(pyodide, "import numpy as np\nx = 1", new Set())).toEqual([]);
    expect(missingPackages(pyodide, "from sklearn.linear_model import LinearRegression", new Set())).toEqual(["sklearn"]);
    await preparePackages(pyodide, "import sklearn");
    expect(pyodide.runPython("import sklearn; sklearn.__version__")).toMatch(/^1\./);
  }, 300_000);
});
