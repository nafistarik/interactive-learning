import type { PyodideInterface } from "pyodide";
import { beforeAll, describe, expect, it } from "vitest";

import type { ExecutionFrame, OperationStep } from "@/features/execution/frames";
import { installRecorder, recordFrames } from "@/lib/python/record-frames";

import { loadTestPyodide } from "./load-test-pyodide";

/* R2 engine: matmul, reduce, reshape/transpose and comparison steps, recorded in Pyodide. */
describe("recording R2 operations", () => {
  let pyodide: PyodideInterface;

  beforeAll(async () => {
    pyodide = await loadTestPyodide();
    installRecorder(pyodide);
  }, 180_000);

  /** The last frame of a recording. */
  function last(code: string): ExecutionFrame {
    const outcome = recordFrames(pyodide, code);
    if (!outcome.ok) {
      throw new Error(outcome.error);
    }
    return outcome.frames[outcome.frames.length - 1];
  }

  /** The steps of the last frame, by kind. */
  function kinds(code: string): string[] {
    return last(code).operations.map((step) => step.kind);
  }

  function only<K extends OperationStep["kind"]>(step: OperationStep, kind: K): Extract<OperationStep, { kind: K }> {
    if (step.kind !== kind) {
      throw new Error(`expected ${kind}, got ${step.kind}`);
    }
    return step as Extract<OperationStep, { kind: K }>;
  }

  const SETUP = "import numpy as np\nX = np.array([[1, 2], [3, 4], [5, 6]])\nW = np.array([[1, 0], [0, 2]])\n";

  it("records X @ W with operands, names and the real result", () => {
    const frame = last(`${SETUP}Z = X @ W`);
    expect(frame.operationType).toBe("operation");
    const step = only(frame.operations[0], "matmul");
    expect(step.leftName).toBe("X");
    expect(step.rightName).toBe("W");
    expect(step.result?.shape).toEqual([3, 2]);
    expect(step.result?.values).toEqual([1, 4, 3, 8, 5, 12]);
  });

  it.each(["np.dot(X, W)", "X.dot(W)", "np.matmul(X, W)"])("records %s as a matmul step", (expression) => {
    const step = only(last(`${SETUP}Z = ${expression}`).operations[0], "matmul");
    expect(step.result?.values).toEqual([1, 4, 3, 8, 5, 12]);
  });

  it("records the operand shapes when the inner sizes do not match", () => {
    const frame = last(`${SETUP}Z = X @ X`);
    expect(frame.status).toBe("error");
    expect(frame.error?.operandShapes).toEqual([[3, 2], [3, 2]]);
    expect(only(frame.operations[0], "matmul").result).toBeUndefined();
  });

  it("records X @ W + b as matmul then binary", () => {
    expect(kinds(`${SETUP}b = np.array([1, 1])\nZ = X @ W + b`)).toEqual(["matmul", "binary"]);
  });

  it.each([
    ["X.sum(axis=0)", 0, [9, 12]],
    ["np.sum(X, axis=1)", 1, [3, 7, 11]],
    ["X.mean(0)", 0, [3, 4]],
    ["np.max(X, axis=-1)", -1, [2, 4, 6]],
  ])("records %s as a reduce step on axis %s", (expression, axis, values) => {
    const step = only(last(`${SETUP}r = ${expression}`).operations[0], "reduce");
    expect(step.inputName).toBe("X");
    expect(step.axis).toBe(axis);
    expect(step.result?.values).toEqual(values);
  });

  it("records a whole-array reduction and keepdims", () => {
    const whole = only(last(`${SETUP}t = X.sum()`).operations[0], "reduce");
    expect(whole.axis).toBeNull();
    expect(whole.result?.shape).toEqual([]);
    const kept = only(last(`${SETUP}m = X.mean(axis=1, keepdims=True)`).operations[0], "reduce");
    expect(kept.keepdims).toBe(true);
    expect(kept.result?.shape).toEqual([3, 1]);
  });

  it("records the operation inside the call first: np.sum(X * 2, axis=1)", () => {
    expect(kinds(`${SETUP}r = np.sum(X * 2, axis=1)`)).toEqual(["binary", "reduce"]);
  });

  it("records an axis that does not exist as a failed reduce step", () => {
    const frame = last(`${SETUP}r = X.sum(axis=2)`);
    expect(frame.status).toBe("error");
    expect(frame.error?.type).toBe("AxisError");
    expect(only(frame.operations[0], "reduce").result).toBeUndefined();
  });

  it.each(["X.reshape(2, 3)", "X.reshape((2, 3))", "np.reshape(X, (2, 3))", "X.reshape(-1, 3)"])(
    "records %s as a reshape step",
    (expression) => {
      const step = only(last(`${SETUP}R = ${expression}`).operations[0], "reshape");
      expect(step.fn).toBe("reshape");
      expect(step.result?.shape).toEqual([2, 3]);
      expect(step.result?.values).toEqual([1, 2, 3, 4, 5, 6]);
    },
  );

  it("records the requested shape when a reshape fails", () => {
    const frame = last(`${SETUP}R = X.reshape(4, 2)`);
    expect(frame.status).toBe("error");
    expect(only(frame.operations[0], "reshape").requested).toEqual([4, 2]);
  });

  it.each(["X.T", "np.transpose(X)", "X.transpose()"])("records %s as a transpose", (expression) => {
    const step = only(last(`${SETUP}T = ${expression}`).operations[0], "reshape");
    expect(step.fn).toBe("transpose");
    expect(step.result?.shape).toEqual([2, 3]);
    expect(step.result?.values).toEqual([1, 3, 5, 2, 4, 6]);
  });

  it("records a chain in order: X.reshape(2, 3).T", () => {
    const steps = last(`${SETUP}T = X.reshape(2, 3).T`).operations;
    expect(steps.map((step) => step.kind === "reshape" && step.fn)).toEqual(["reshape", "transpose"]);
  });

  it("records a comparison as a binary step with a boolean result", () => {
    const step = only(last(`${SETUP}mask = X > 3`).operations[0], "binary");
    expect(step.operator).toBe(">");
    expect(step.result?.values).toEqual([false, false, false, true, true, true]);
  });

  it("evaluates every part of a recorded call exactly once", () => {
    const code = [
      "import numpy as np",
      "calls = []",
      "def make():",
      "    calls.append(1)",
      "    return np.array([[1, 2], [3, 4]])",
      "r = np.sum(make(), axis=0)",
      "s = make().T",
      "n = len(calls)",
    ].join("\n");
    const frame = last(code);
    expect(frame.variables.find((variable) => variable.name === "n")?.repr).toBe("2");
  });

  it("calls anything else normally, once", () => {
    const frame = last("import numpy as np\nx = [3, 1, 2]\nx.sort()\ny = np.zeros(3).tolist()");
    expect(frame.status).toBe("success");
    expect(frame.operations).toEqual([]);
  });
});
