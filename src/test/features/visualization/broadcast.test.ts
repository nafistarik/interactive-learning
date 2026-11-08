import { describe, expect, it } from "vitest";

import type { ArraySnapshot, ExecutionFrame, OperationStep } from "@/features/execution/frames";
import {
  analyseBroadcast,
  buildStages,
  expandValues,
  gridLayers,
  numericValues,
} from "@/features/visualization/broadcast";
import { findOperandDefinitions } from "@/features/visualization/definitions";

describe("analyseBroadcast", () => {
  it("broadcasts (3, 2) with (2,) to (3, 2), right-aligned (Part 9)", () => {
    const analysis = analyseBroadcast([3, 2], [2]);

    expect(analysis.compatible).toBe(true);
    expect(analysis.resultShape).toEqual([3, 2]);
    expect(analysis.checks.map((check) => [check.left, check.right])).toEqual([
      [2, 2],
      [3, null],
    ]);
  });

  it("fails at the trailing axis for (3, 2) with (3,), the Part 9 error", () => {
    const analysis = analyseBroadcast([3, 2], [3]);

    expect(analysis.compatible).toBe(false);
    expect(analysis.resultShape).toBeNull();
    expect(analysis.failedAt).toMatchObject({ fromRight: 0, left: 2, right: 3 });
  });

  it("stretches a size-1 axis", () => {
    expect(analyseBroadcast([4, 1], [1, 5]).resultShape).toEqual([4, 5]);
  });

  it("treats a scalar as broadcasting to any shape", () => {
    expect(analyseBroadcast([2, 2], []).resultShape).toEqual([2, 2]);
  });

  it("fails when two equal-rank axes differ and neither is 1", () => {
    expect(analyseBroadcast([2, 3], [4, 3]).resultShape).toBeNull();
    expect(analyseBroadcast([2, 3], [2, 4]).compatible).toBe(false);
  });
});

describe("expandValues", () => {
  it("repeats a row across rows, as the Part 9 expansion does", () => {
    // w = [2, 3] (shape (2,)) stretched to (3, 2)
    expect(expandValues([2, 3], [2], [3, 2])).toEqual([2, 3, 2, 3, 2, 3]);
  });

  it("repeats a column across columns", () => {
    // [[1], [2]] (shape (2, 1)) stretched to (2, 3)
    expect(expandValues([1, 2], [2, 1], [2, 3])).toEqual([1, 1, 1, 2, 2, 2]);
  });
});

describe("buildStages", () => {
  const step: OperationStep = {
    operator: "*",
    left: { shape: [1], dtype: "int64", values: [1], truncated: false },
    right: { shape: [1], dtype: "int64", values: [1], truncated: false },
    leftName: "a",
    rightName: "b",
  };

  it("gives a frame without arithmetic one stage", () => {
    expect(buildStages([])).toEqual([{ operation: -1, phase: "show" }]);
  });

  it("plays operands, alignment and result for each arithmetic step", () => {
    expect(buildStages([step, step]).map((stage) => stage.phase)).toEqual([
      "operands",
      "align",
      "result",
      "operands",
      "align",
      "result",
    ]);
  });
});

describe("gridLayers", () => {
  const snapshot = (shape: number[], values: number[]): ArraySnapshot => ({
    shape,
    dtype: "int64",
    values,
    truncated: false,
  });

  it("draws a 3 by 2 array as three rows of two", () => {
    const { layers } = gridLayers(snapshot([3, 2], [1, 2, 3, 4, 5, 6]));

    expect(layers).toEqual([
      [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
    ]);
  });

  it("draws a 3D array as stacked 2D layers", () => {
    const { layers } = gridLayers(snapshot([2, 1, 2], [1, 2, 3, 4]));

    expect(layers).toEqual([
      [[1, 2]],
      [[3, 4]],
    ]);
  });
});

describe("numericValues", () => {
  it("returns numbers for a complete numeric snapshot", () => {
    expect(numericValues({ shape: [2], dtype: "int64", values: [1, 2], truncated: false })).toEqual([1, 2]);
  });

  it("returns null for a truncated or non-numeric snapshot", () => {
    expect(numericValues({ shape: [2], dtype: "int64", values: [1, 2], truncated: true })).toBeNull();
    expect(numericValues({ shape: [1], dtype: "str", values: ["a"], truncated: false })).toBeNull();
  });
});

describe("findOperandDefinitions", () => {
  /** A minimal successful frame that assigned `target` on the given lines. */
  function assignFrame(index: number, target: string, startLine: number, endLine: number): ExecutionFrame {
    return {
      index,
      startLine,
      endLine,
      source: "",
      operationType: "assign",
      targetName: target,
      operations: [],
      variables: [],
      stdout: "",
      status: "success",
    };
  }

  it("finds the latest assignment of each operand before the failing frame", () => {
    const frames = [
      assignFrame(0, "X", 3, 7),
      assignFrame(1, "w", 9, 9),
      assignFrame(2, "w", 12, 12),
      assignFrame(3, "out", 14, 14),
    ];

    const found = findOperandDefinitions(frames, 3, ["X", "w"]);

    expect(found.map((item) => [item.name, item.frame.startLine])).toEqual([
      ["X", 3],
      ["w", 12],
    ]);
  });

  it("skips names that are not plain variables and names never assigned", () => {
    const frames = [assignFrame(0, "X", 3, 7)];

    expect(findOperandDefinitions(frames, 1, [null, "missing", "X"]).map((item) => item.name)).toEqual(["X"]);
  });
});
