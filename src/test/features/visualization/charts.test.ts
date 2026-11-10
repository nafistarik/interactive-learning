import { describe, expect, it } from "vitest";

import type { LoopRecord } from "@/features/execution/frames";
import { axisRange, formatChartValue, numberSeries, numericWatched, watchedArray } from "@/features/visualization/charts";

const LOOP: LoopRecord = {
  watched: ["i", "loss", "pred", "label"],
  total: 3,
  sampled: false,
  iterations: [0, 1, 2].map((iteration) => ({
    iteration,
    values: {
      i: { number: iteration },
      loss: { number: iteration === 1 ? "NaN" : 10 - iteration },
      pred: { array: { shape: [2], dtype: "float64", values: [iteration, iteration * 2], truncated: false } },
    },
  })),
};

describe("loop chart data", () => {
  it("reads a number series, skipping NaN", () => {
    expect(numberSeries(LOOP, "loss")).toEqual([
      { x: 0, y: 10 },
      { x: 2, y: 8 },
    ]);
  });

  it("charts only names that are numbers in most iterations", () => {
    expect(numericWatched(LOOP)).toEqual(["i", "loss"]);
  });

  it("reads a watched array as numbers", () => {
    expect(watchedArray(LOOP.iterations[2].values.pred)).toEqual([2, 4]);
    expect(watchedArray(LOOP.iterations[2].values.i)).toBeNull();
  });
});

describe("axis helpers", () => {
  it("pads a range and widens a flat one", () => {
    expect(axisRange([0, 10])).toEqual([0, 10.6]);
    expect(axisRange([-10, 0])).toEqual([-10.6, 0.6]);
    expect(axisRange([3, 3])).toEqual([2, 4]);
  });

  it("formats values briefly", () => {
    expect(formatChartValue(0.123456)).toBe("0.1235");
    expect(formatChartValue(1234567)).toBe("1.23e+6");
    expect(formatChartValue(0)).toBe("0");
  });
});
