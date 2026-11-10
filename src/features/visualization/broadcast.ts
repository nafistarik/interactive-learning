import type { ArraySnapshot, OperationStep, Values } from "@/features/execution/frames";

/** How one pair of dimensions (compared from the right) was judged. */
export interface DimensionCheck {
  /** Position counted from the right: 0 is the last axis. */
  fromRight: number;
  /** Size on the left operand, or `null` when that operand has no such axis. */
  left: number | null;
  /** Size on the right operand, or `null` when that operand has no such axis. */
  right: number | null;
  ok: boolean;
  /** Size of this axis in the result, or `null` when the pair failed. */
  result: number | null;
}

/** The outcome of comparing two shapes with the broadcasting rules. */
export interface BroadcastAnalysis {
  compatible: boolean;
  /** Shape of the result, or `null` when the shapes do not broadcast. */
  resultShape: number[] | null;
  /** One check per axis, from the right. */
  checks: DimensionCheck[];
  /** The check that failed first, from the right, or `null` when all passed. */
  failedAt: DimensionCheck | null;
}

/**
 * Compares two shapes with NumPy's broadcasting rules. Axes are compared from the right. Two
 * sizes are compatible when they are equal or one of them is 1. A missing leading axis counts
 * as 1.
 *
 * @param left - Shape of the left operand.
 * @param right - Shape of the right operand.
 * @returns Whether they broadcast, the result shape, and each axis check.
 */
export function analyseBroadcast(left: number[], right: number[]): BroadcastAnalysis {
  const axes = Math.max(left.length, right.length);
  const checks: DimensionCheck[] = [];

  for (let fromRight = 0; fromRight < axes; fromRight++) {
    const leftSize = left[left.length - 1 - fromRight] ?? null;
    const rightSize = right[right.length - 1 - fromRight] ?? null;
    let ok: boolean;
    let result: number | null;

    if (leftSize === null || rightSize === null) {
      ok = true;
      result = leftSize ?? rightSize;
    } else if (leftSize === rightSize) {
      ok = true;
      result = leftSize;
    } else if (leftSize === 1) {
      ok = true;
      result = rightSize;
    } else if (rightSize === 1) {
      ok = true;
      result = leftSize;
    } else {
      ok = false;
      result = null;
    }

    checks.push({ fromRight, left: leftSize, right: rightSize, ok, result });
  }

  const failedAt = checks.find((check) => !check.ok) ?? null;
  const compatible = failedAt === null;
  const resultShape = compatible
    ? checks
        .map((check) => check.result)
        .filter((size): size is number => size !== null)
        .reverse()
    : null;

  return { compatible, resultShape, checks, failedAt };
}

/**
 * Stretches a flat row-major array to a larger shape, the way broadcasting does: an axis of
 * size 1 repeats along its axis. Used to show the smaller operand expanded.
 *
 * @param values - The flat values of the source array (row-major).
 * @param source - The source shape.
 * @param target - The shape to stretch to. It must broadcast from `source`.
 * @returns The expanded values, row-major over `target`.
 */
export function expandValues(values: number[], source: number[], target: number[]): number[] {
  const total = target.reduce((product, size) => product * size, 1);
  const sourceStrides = stridesOf(source);
  const offset = target.length - source.length;
  const expanded: number[] = [];

  for (let flat = 0; flat < total; flat++) {
    let remainder = flat;
    const index = new Array<number>(target.length);
    for (let axis = target.length - 1; axis >= 0; axis--) {
      index[axis] = remainder % target[axis];
      remainder = Math.floor(remainder / target[axis]);
    }

    let sourceIndex = 0;
    for (let axis = 0; axis < source.length; axis++) {
      const along = source[axis] === 1 ? 0 : index[axis + offset];
      sourceIndex += along * sourceStrides[axis];
    }
    expanded.push(values[sourceIndex]);
  }

  return expanded;
}

/**
 * Row-major strides of a shape: how far the flat index moves per step along each axis.
 *
 * @param shape - The shape.
 * @returns The stride of each axis.
 */
function stridesOf(shape: number[]): number[] {
  const strides = new Array<number>(shape.length);
  let stride = 1;
  for (let axis = shape.length - 1; axis >= 0; axis--) {
    strides[axis] = stride;
    stride *= shape[axis];
  }
  return strides;
}

/** One stage of the animation of a frame. */
export interface AnimationStage {
  /** Which operation of the frame this stage shows, or `-1` for a frame with no operations. */
  operation: number;
  /** `operands` shows the inputs, `align` the shape comparison, `result` the output. */
  phase: "operands" | "align" | "result" | "show";
}

/**
 * The ordered stages a frame plays through. Arithmetic, matrix products and reductions have
 * three stages (operands, the rule that applies, result); a reshape or transpose has two. A
 * frame without recorded operations has one stage.
 *
 * @param operations - The recorded sub-steps of the frame.
 * @returns The stages in play order.
 */
export function buildStages(operations: OperationStep[]): AnimationStage[] {
  if (operations.length === 0) {
    return [{ operation: -1, phase: "show" }];
  }
  return operations.flatMap((step, operation) =>
    (step.kind === "reshape" || step.kind === "ufunc" ? (["operands", "result"] as const) : (["operands", "align", "result"] as const)).map(
      (phase) => ({ operation, phase }),
    ),
  );
}

/**
 * Flat numeric values of a snapshot, or `null` when the snapshot is truncated or not numeric.
 * Broadcasting cannot be expanded from a partial array, so the view skips it in that case.
 *
 * @param snapshot - The array snapshot.
 * @returns The numbers, or `null`.
 */
export function numericValues(snapshot: ArraySnapshot): number[] | null {
  if (snapshot.truncated || !Array.isArray(snapshot.values)) {
    return null;
  }
  const values: number[] = [];
  for (const value of snapshot.values) {
    if (typeof value !== "number") {
      return null;
    }
    values.push(value);
  }
  return values;
}

/**
 * Rows of a snapshot for display: one row for 1D, one row per line for 2D, and one block of
 * rows per layer for 3D. Higher ranks are flattened into the last axis.
 *
 * @param snapshot - The array snapshot.
 * @returns Layers of rows, each row a list of values. `shown` holds the sizes actually drawn.
 */
export function gridLayers(snapshot: ArraySnapshot): { layers: Values[][][]; shown: number[] } {
  const values = Array.isArray(snapshot.values) ? snapshot.values : [];
  const shape = snapshot.shape;
  if (shape.length === 0) {
    return { layers: [[[values[0] ?? "-"]]], shown: [] };
  }
  if (shape.length === 1) {
    return { layers: [[values]], shown: [values.length] };
  }

  const cols = shape[shape.length - 1];
  const rowsTotal = shape[shape.length - 2];
  const layerCount = shape.slice(0, -2).reduce((product, size) => product * size, 1);
  const layers: Values[][][] = [];

  for (let layer = 0; layer < layerCount; layer++) {
    const rows: Values[][] = [];
    for (let row = 0; row < rowsTotal; row++) {
      const start = (layer * rowsTotal + row) * cols;
      rows.push(values.slice(start, start + cols));
    }
    layers.push(rows);
  }
  return { layers, shown: shape };
}
