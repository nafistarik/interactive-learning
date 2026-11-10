import type { PyodideInterface } from "pyodide";
import { beforeAll, describe, expect, it } from "vitest";

import type { ExecutionFrame, VariableSnapshot } from "@/features/execution/frames";
import {
  broadcastShapesCode,
  dimensionsCode,
  editArrayCode,
  elementwiseCode,
  indexingCode,
  parseTimings,
  selectionExpression,
  shapePickerCode,
  TIMING_CODE,
  XWB_CODE,
} from "@/features/demos/demo-code";
import { installRecorder, recordFrames } from "@/lib/python/record-frames";
import { runPython } from "@/lib/python/run-python";

import { loadTestPyodide } from "../../lib/python/load-test-pyodide";

describe("demo code builders", () => {
  it("rejects values that are not finite numbers", () => {
    expect(() => editArrayCode([1, Number.NaN])).toThrow();
  });

  it("writes index expressions the way a learner would", () => {
    expect(selectionExpression({ kind: "element", row: 1, col: 2 })).toBe("1, 2");
    expect(selectionExpression({ kind: "column", col: 3 })).toBe(":, 3");
    expect(selectionExpression({ kind: "slice", rowStart: 0, rowStop: 2, colStart: 1, colStop: 4 })).toBe("0:2, 1:4");
  });

  it("parses the two timings and refuses anything else", () => {
    expect(parseTimings("12.5\n0.25")).toEqual({ loopMs: 12.5, numpyMs: 0.25 });
    expect(parseTimings("oops")).toBeNull();
  });
});

/* Every demo's code goes through the real recorder, as in the browser. */
describe("demo code runs in Pyodide", () => {
  let pyodide: PyodideInterface;

  beforeAll(async () => {
    pyodide = await loadTestPyodide();
    installRecorder(pyodide);
  }, 180_000);

  function last(code: string): ExecutionFrame {
    const outcome = recordFrames(pyodide, code);
    if (!outcome.ok) {
      throw new Error(outcome.error);
    }
    return outcome.frames[outcome.frames.length - 1];
  }

  function variable(frame: ExecutionFrame, name: string): VariableSnapshot {
    const found = frame.variables.find((item) => item.name === name);
    if (!found) {
      throw new Error(`no variable ${name}`);
    }
    return found;
  }

  it("lesson 01 records the typed values", () => {
    const frame = last(editArrayCode([4, 2.5, -1]));
    expect(variable(frame, "a").array).toMatchObject({ shape: [3], values: [4, 2.5, -1] });
  });

  it.each([
    [1, [4]],
    [2, [2, 3]],
    [3, [2, 2, 3]],
  ] as const)("lesson 02 builds a %iD array", (ndim, shape) => {
    expect(variable(last(dimensionsCode(ndim)), "a").array?.shape).toEqual(shape);
  });

  it("lesson 03 shows a column as shape (3, 1)", () => {
    expect(variable(last(shapePickerCode("column")), "x").array?.shape).toEqual([3, 1]);
  });

  it("lesson 04 marks exactly the cells NumPy selects", () => {
    const frame = last(indexingCode({ kind: "slice", rowStart: 1, rowStop: 3, colStart: 2, colStop: 4 }));
    expect(variable(frame, "selected").array).toMatchObject({ shape: [2, 2], values: [7, 8, 12, 13] });
    const mask = variable(frame, "mask").array?.values as number[];
    expect(mask.flat().reduce((sum, value) => sum + value, 0)).toBe(4);
    expect(mask.flat()[7]).toBe(1);
  });

  it("lesson 05 prints two timings", async () => {
    const result = await runPython(pyodide, TIMING_CODE);
    expect(result.ok).toBe(true);
    expect(result.ok && parseTimings(result.stdout)).not.toBeNull();
  });

  it("lesson 06 records the element-wise step", () => {
    const frame = last(elementwiseCode([1, 2, 3], [4, 5, 6], "*"));
    expect(frame.operations).toHaveLength(1);
    expect(frame.operations[0].result?.values).toEqual([4, 10, 18]);
  });

  it("lesson 07 records the failing shapes when they do not broadcast", () => {
    const frame = last(broadcastShapesCode([3, 2], [3]));
    expect(frame.status).toBe("error");
    expect(frame.error?.operandShapes).toEqual([[3, 2], [3]]);
  });

  it("lesson 07 broadcasts compatible shapes", () => {
    const frame = last(broadcastShapesCode([2, 3], [3]));
    expect(frame.operations[0].result?.shape).toEqual([2, 3]);
  });

  it("lesson 08 records X * w then (X * w) + b", () => {
    const frame = last(XWB_CODE);
    expect(frame.operations.map((step) => step.operator)).toEqual(["*", "+"]);
    expect(frame.operations[1].result?.values).toEqual([10.5, 18, 11.5, 16, 12.5, 14]);
  });
});
