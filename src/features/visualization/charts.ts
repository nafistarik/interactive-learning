import type { LoopRecord, WatchedValue } from "@/features/execution/frames";

/**
 * A fit chart declared by lesson data or an exercise (R3): data points from the final `x`
 * and `y`, and the model's recorded `prediction` array at the selected loop iteration.
 */
export interface FitChartSpec {
  kind: "fit";
  x: string;
  y: string;
  prediction: string;
}

/** One point of a series. */
export interface ChartPoint {
  x: number;
  y: number;
}

/**
 * The number a watched value holds, or `null` for arrays and NaN/infinity.
 *
 * @param value - A watched value.
 * @returns The number, or `null`.
 */
export function watchedNumber(value: WatchedValue | undefined): number | null {
  if (!value || !("number" in value) || typeof value.number !== "number") {
    return null;
  }
  return value.number;
}

/**
 * The flat numbers of a watched array, or `null` for numbers, truncated or non-numeric arrays.
 *
 * @param value - A watched value.
 * @returns The numbers, or `null`.
 */
export function watchedArray(value: WatchedValue | undefined): number[] | null {
  if (!value || !("array" in value) || value.array.truncated || !Array.isArray(value.array.values)) {
    return null;
  }
  const flat = value.array.values.flat(3);
  return flat.every((item): item is number => typeof item === "number") ? flat : null;
}

/**
 * The series of one watched number across the recorded iterations.
 *
 * @param loop - The loop record.
 * @param name - The watched name.
 * @returns Points (iteration, value), skipping iterations where it was not a finite number.
 */
export function numberSeries(loop: LoopRecord, name: string): ChartPoint[] {
  return loop.iterations.flatMap((item) => {
    const value = watchedNumber(item.values[name]);
    return value === null ? [] : [{ x: item.iteration, y: value }];
  });
}

/**
 * Watched names that are numbers in most iterations: the ones to draw as line charts.
 *
 * @param loop - The loop record.
 * @returns The names, in watch order.
 */
export function numericWatched(loop: LoopRecord): string[] {
  return loop.watched.filter((name) => numberSeries(loop, name).length >= Math.max(2, loop.iterations.length / 2));
}

/**
 * A "nice" axis range around values, with a little padding; flat data gets a unit range.
 *
 * @param values - The values.
 * @returns `[min, max]`.
 */
export function axisRange(values: number[]): [number, number] {
  if (values.length === 0) {
    return [0, 1];
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) {
    return [min - 1, max + 1];
  }
  const pad = (max - min) * 0.06;
  // Values that never go below zero (a loss, a count) keep an axis that starts at zero.
  return [min >= 0 ? Math.max(0, min - pad) : min - pad, max + pad];
}

/**
 * Short text for a chart value: up to 4 significant digits, no exponent for ordinary sizes.
 *
 * @param value - The value.
 * @returns Its label.
 */
export function formatChartValue(value: number): string {
  if (value === 0) {
    return "0";
  }
  const magnitude = Math.abs(value);
  if (magnitude >= 1e5 || magnitude < 1e-3) {
    return value.toExponential(2);
  }
  return String(Number(value.toPrecision(4)));
}
