import type { PyodideInterface } from "pyodide";
import { beforeAll, describe, expect, it } from "vitest";

import type { ExecutionFrame } from "@/features/execution/frames";
import { installRecorder, recordFrames } from "@/lib/python/record-frames";

import { loadTestPyodide } from "./load-test-pyodide";

/** Part 9 starter code, with the same line numbers as the editor. */
const PART_9_STARTER = [
  "import numpy as np",
  "",
  "X = np.array([",
  "    [1, 2],",
  "    [3, 4],",
  "    [5, 6]",
  "])",
  "",
  "w = np.array([2, 3])",
  "",
  "out = X * w",
].join("\n");

/** Returns the frames of a successful recording, failing the test otherwise. */
function framesOf(outcome: ReturnType<typeof recordFrames>): ExecutionFrame[] {
  if (!outcome.ok) {
    throw new Error(`expected a recording, got: ${outcome.error}`);
  }
  return outcome.frames;
}

describe("recordFrames with Pyodide and NumPy", () => {
  let pyodide: PyodideInterface;

  beforeAll(async () => {
    pyodide = await loadTestPyodide();
    installRecorder(pyodide);
  }, 180_000);

  it("records one frame per top-level statement with the editor line ranges", () => {
    const frames = framesOf(recordFrames(pyodide, PART_9_STARTER));

    expect(frames.map((frame) => [frame.operationType, frame.startLine, frame.endLine])).toEqual([
      ["import", 1, 1],
      ["assign", 3, 7],
      ["assign", 9, 9],
      ["binary-op", 11, 11],
    ]);
  });

  it("records the Part 9 product: operands, stretched shape and the real output", () => {
    const frames = framesOf(recordFrames(pyodide, PART_9_STARTER));
    const product = frames[3];

    expect(product.targetName).toBe("out");
    expect(product.status).toBe("success");
    expect(product.operations).toHaveLength(1);
    const [step] = product.operations;
    if (step.kind !== "binary") {
      throw new Error(`expected a binary step, got ${step.kind}`);
    }
    expect(step.operator).toBe("*");
    expect(step.leftName).toBe("X");
    expect(step.rightName).toBe("w");
    expect(step.left.shape).toEqual([3, 2]);
    expect(step.right.shape).toEqual([2]);
    // The integer width is Pyodide's platform default, so only the shape and values are fixed.
    expect(step.result?.shape).toEqual([3, 2]);
    expect(step.result?.values).toEqual([2, 6, 6, 12, 10, 18]);
    expect(step.result?.truncated).toBe(false);
  });

  it("keeps the variable snapshot of each frame, so stepping back shows earlier data", () => {
    const frames = framesOf(recordFrames(pyodide, PART_9_STARTER));
    const afterX = frames[1].variables.find((variable) => variable.name === "X");
    const afterOut = frames[3].variables.find((variable) => variable.name === "out");

    expect(afterX?.array?.shape).toEqual([3, 2]);
    expect(frames[1].variables.some((variable) => variable.name === "out")).toBe(false);
    expect(afterOut?.array?.values).toEqual([2, 6, 6, 12, 10, 18]);
  });

  it("stops at the broadcasting error and records the operand shapes", () => {
    const code = PART_9_STARTER.replace("np.array([2, 3])", "np.array([2, 3, 4])");
    const frames = framesOf(recordFrames(pyodide, code));
    const failed = frames[frames.length - 1];

    expect(frames).toHaveLength(4);
    expect(failed.status).toBe("error");
    expect(failed.error?.type).toBe("ValueError");
    expect(failed.error?.operandShapes).toEqual([
      [3, 2],
      [3],
    ]);
    expect(failed.operations[0].result).toBeUndefined();
  });

  it("evaluates X * w + b as ordered sub-steps, each operand once", () => {
    const code = [
      "import numpy as np",
      "X = np.array([[1, 2], [3, 4]])",
      "w = np.array([10, 100])",
      "b = np.array([1, 1])",
      "out = X * w + b",
    ].join("\n");
    const frames = framesOf(recordFrames(pyodide, code));
    const steps = frames[4].operations.map((step) => {
      if (step.kind !== "binary") {
        throw new Error(`expected a binary step, got ${step.kind}`);
      }
      return step;
    });

    expect(steps.map((step) => step.operator)).toEqual(["*", "+"]);
    expect(steps[0].result?.values).toEqual([10, 200, 30, 400]);
    expect(steps[1].left.values).toEqual([10, 200, 30, 400]);
    expect(steps[1].result?.values).toEqual([11, 201, 31, 401]);
  });

  it("records a loop as one frame with its iterations, and keeps its printed output (R3)", () => {
    const frames = framesOf(recordFrames(pyodide, "for i in range(3):\n    print(i)"));

    expect(frames).toHaveLength(1);
    expect(frames[0].operationType).toBe("loop");
    expect(frames[0].stdout).toBe("0\n1\n2\n");
    expect(frames[0].loop?.total).toBe(3);
    expect(frames[0].loop?.iterations.map((item) => item.values.i)).toEqual([{ number: 0 }, { number: 1 }, { number: 2 }]);
  });

  it("still marks a def as not visualised", () => {
    const frames = framesOf(recordFrames(pyodide, "def f(x):\n    return x"));

    expect(frames[0].operationType).toBe("not-visualised");
    expect(frames[0].note).toBeDefined();
  });

  it("records a bare expression as a REPL-style result", () => {
    const frames = framesOf(recordFrames(pyodide, "import numpy as np\nnp.arange(3)"));

    expect(frames[1].operationType).toBe("expression");
    expect(frames[1].result?.array?.values).toEqual([0, 1, 2]);
  });

  it("caps array values at 64 and says so", () => {
    const frames = framesOf(recordFrames(pyodide, "import numpy as np\nbig = np.arange(100)"));
    const big = frames[1].variables.find((variable) => variable.name === "big");

    expect(big?.array?.shape).toEqual([100]);
    expect(big?.array?.truncated).toBe(true);
    expect(big?.array?.values).toEqual(Array.from({ length: 64 }, (_, index) => index));
  });

  it("sends NaN and infinity as strings", () => {
    const frames = framesOf(
      recordFrames(pyodide, "import numpy as np\nspecial = np.array([np.nan, np.inf, -np.inf])"),
    );
    const special = frames[1].variables.find((variable) => variable.name === "special");

    expect(special?.array?.values).toEqual(["NaN", "Infinity", "-Infinity"]);
  });

  it("reports a syntax error as a single error frame", () => {
    const frames = framesOf(recordFrames(pyodide, "x = (1 +"));

    expect(frames).toHaveLength(1);
    expect(frames[0].status).toBe("error");
    expect(frames[0].error?.type).toBe("SyntaxError");
  });

  it("runs the prelude first, shows its variables, and records no prelude frames", () => {
    const frames = framesOf(
      recordFrames(pyodide, "import numpy as np\nresult = a * b", "import numpy as np\na = np.array([2, 3])\nb = np.array([4, 5])"),
    );

    expect(frames).toHaveLength(2);
    expect(frames[1].variables.map((variable) => variable.name)).toEqual(
      expect.arrayContaining(["a", "b", "result"]),
    );
  });

  it("returns a failed recording when the prelude fails", () => {
    const outcome = recordFrames(pyodide, "x = 1", "raise ValueError('bad setup')");

    expect(outcome.ok).toBe(false);
    expect(outcome.ok === false && outcome.error).toContain("bad setup");
  });

  it("starts each recording with a fresh namespace", () => {
    framesOf(recordFrames(pyodide, "secret = 42"));
    const second = framesOf(recordFrames(pyodide, "print(1)"));

    expect(second[0].variables.some((variable) => variable.name === "secret")).toBe(false);
  });
});
