import { describe, expect, it } from "vitest";

import {
  analyseMatmul,
  explainReshape,
  formatValue,
  reductionGroups,
  transposeSources,
} from "@/features/visualization/operations";

describe("analyseMatmul", () => {
  it.each([
    [[3, 2], [2, 4], [3, 4]],
    [[3, 2], [2], [3]],
    [[2], [2, 5], [5]],
    [[4], [4], []],
  ])("%j @ %j gives %j", (left, right, result) => {
    expect(analyseMatmul(left, right)).toMatchObject({ compatible: true, resultShape: result });
  });

  it("explains an inner-size mismatch with the two sizes", () => {
    const analysis = analyseMatmul([3, 2], [3, 1]);
    expect(analysis.compatible).toBe(false);
    expect(analysis.inner).toEqual([2, 3]);
    expect(analysis.reason).toContain("2 columns");
    expect(analysis.reason).toContain("3 rows");
  });
});

describe("reductionGroups", () => {
  it("axis 0 of a 2 × 3 array groups by column", () => {
    expect(reductionGroups([2, 3], 0)).toEqual([0, 1, 2, 0, 1, 2]);
  });

  it("axis 1 of a 2 × 3 array groups by row", () => {
    expect(reductionGroups([2, 3], 1)).toEqual([0, 0, 0, 1, 1, 1]);
  });

  it("a negative axis counts from the end", () => {
    expect(reductionGroups([2, 3], -1)).toEqual(reductionGroups([2, 3], 1));
  });

  it("no axis collapses everything into one value", () => {
    expect(reductionGroups([2, 2], null)).toEqual([0, 0, 0, 0]);
  });

  it("an axis that does not exist has no groups", () => {
    expect(reductionGroups([2, 3], 2)).toBeNull();
  });

  it("works for 3D", () => {
    expect(reductionGroups([2, 1, 2], 0)).toEqual([0, 1, 0, 1]);
  });
});

describe("transposeSources", () => {
  it("maps each result cell of a 2 × 3 transpose to its input cell", () => {
    // input [[0, 1, 2], [3, 4, 5]] → result [[0, 3], [1, 4], [2, 5]]
    expect(transposeSources([2, 3])).toEqual([0, 3, 1, 4, 2, 5]);
  });

  it("leaves a 1D array in place", () => {
    expect(transposeSources([3])).toEqual([0, 1, 2]);
  });
});

describe("explainReshape", () => {
  it("compares the element counts", () => {
    expect(explainReshape([2, 3], [4, 2])).toContain("6 elements");
    expect(explainReshape([2, 3], [4, 2])).toContain("holds 8");
  });

  it("explains -1 that cannot divide evenly", () => {
    expect(explainReshape([7], [2, -1])).toContain("-1");
  });
});

describe("formatValue", () => {
  it("prints booleans the Python way", () => {
    expect(formatValue(true)).toBe("True");
    expect(formatValue(false)).toBe("False");
    expect(formatValue(2.5)).toBe("2.5");
  });

  it("keeps whole numbers and shortens long floats to 4 significant digits", () => {
    expect(formatValue(12)).toBe("12");
    expect(formatValue(2.91873128773767)).toBe("2.919");
    expect(formatValue(0.00253301)).toBe("0.002533");
  });
});
