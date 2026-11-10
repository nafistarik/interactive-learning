import type { Values } from "@/features/execution/frames";

/**
 * Pure rules behind the R2 views: the matrix-product shape rule, which input cells a
 * reduction collapses into each result cell, and where each element of a transpose comes
 * from. They explain recorded data; they never stand in for a result NumPy computed.
 */

/** How a matrix product's shapes were judged. */
export interface MatmulAnalysis {
  compatible: boolean;
  /** The two sizes that must match: left's last axis and right's contracted axis. */
  inner: [number, number] | null;
  resultShape: number[] | null;
  /** Plain-language reason, for the view. */
  reason: string;
}

/**
 * Applies NumPy's `@` shape rule for 1D and 2D operands: the last axis of the left must
 * equal the first axis of a 1D right, or the second-to-last axis of a 2D right.
 *
 * @param left - Shape of the left operand.
 * @param right - Shape of the right operand.
 * @returns The verdict, the compared sizes and the result shape.
 */
export function analyseMatmul(left: number[], right: number[]): MatmulAnalysis {
  if (left.length === 0 || right.length === 0) {
    return { compatible: false, inner: null, resultShape: null, reason: "@ needs arrays, not single numbers." };
  }
  if (left.length > 2 || right.length > 2) {
    const inner: [number, number] = [left[left.length - 1], right[Math.max(right.length - 2, 0)]];
    return {
      compatible: inner[0] === inner[1],
      inner,
      resultShape: null,
      reason: "With more than two axes, @ multiplies the last two axes and broadcasts the rest.",
    };
  }
  const k = left[left.length - 1];
  const kRight = right.length === 1 ? right[0] : right[0];
  const inner: [number, number] = [k, kRight];
  if (k !== kRight) {
    return {
      compatible: false,
      inner,
      resultShape: null,
      reason: `The left has ${k} column${k === 1 ? "" : "s"} but the right has ${kRight} row${kRight === 1 ? "" : "s"}. Each dot product needs them to match.`,
    };
  }
  const resultShape = [...left.slice(0, -1), ...right.slice(1)];
  return {
    compatible: true,
    inner,
    resultShape,
    reason: `The inner sizes match (${k} and ${kRight}), so each result value is a dot product of ${k} pairs.`,
  };
}

/**
 * For each input cell (row-major), the result cell it is reduced into.
 *
 * @param shape - The input shape.
 * @param axis - The reduced axis, or `null` for the whole array.
 * @returns One result index per input cell, or `null` when the axis does not exist.
 */
export function reductionGroups(shape: number[], axis: number | null): number[] | null {
  const size = shape.reduce((product, n) => product * n, 1);
  if (axis === null) {
    return new Array<number>(size).fill(0);
  }
  const resolved = axis < 0 ? axis + shape.length : axis;
  if (resolved < 0 || resolved >= shape.length) {
    return null;
  }
  const kept = shape.filter((_, index) => index !== resolved);
  const groups: number[] = [];
  for (let flat = 0; flat < size; flat++) {
    const coords = unravel(flat, shape);
    const keptCoords = coords.filter((_, index) => index !== resolved);
    groups.push(ravel(keptCoords, kept));
  }
  return groups;
}

/**
 * For each result cell of a transpose (row-major), the input cell it came from.
 *
 * @param inputShape - The input shape.
 * @returns One input index per result cell.
 */
export function transposeSources(inputShape: number[]): number[] {
  const outputShape = [...inputShape].reverse();
  const size = inputShape.reduce((product, n) => product * n, 1);
  const sources: number[] = [];
  for (let flat = 0; flat < size; flat++) {
    sources.push(ravel(unravel(flat, outputShape).reverse(), inputShape));
  }
  return sources;
}

/**
 * Why a reshape failed, from the recorded sizes.
 *
 * @param inputShape - Shape of the array being reshaped.
 * @param requested - The shape asked for, if it could be read.
 * @returns A plain-language explanation.
 */
export function explainReshape(inputShape: number[], requested: number[] | null): string {
  const size = inputShape.reduce((product, n) => product * n, 1);
  if (!requested) {
    return `The array has ${size} elements; the new shape must hold exactly ${size}.`;
  }
  const known = requested.filter((n) => n !== -1);
  const knownProduct = known.reduce((product, n) => product * n, 1);
  if (requested.includes(-1)) {
    return `-1 asks NumPy to work out one size, but ${size} elements cannot be split evenly by ${knownProduct}.`;
  }
  return `The array has ${size} elements, but shape (${requested.join(", ")}) holds ${knownProduct}. A reshape must keep every element.`;
}

/**
 * Formats a recorded value for a cell: booleans as Python prints them (`True`/`False`),
 * whole numbers as they are, other numbers to 4 significant digits so cells stay readable
 * (the variable inspector keeps the full value).
 *
 * @param value - One element of a snapshot.
 * @returns Its text.
 */
export function formatValue(value: Values): string {
  if (typeof value === "boolean") {
    return value ? "True" : "False";
  }
  if (typeof value === "number" && !Number.isInteger(value)) {
    return String(Number(value.toPrecision(4)));
  }
  return String(value);
}

/** Row-major coordinates of a flat index. */
function unravel(flat: number, shape: number[]): number[] {
  const coords = new Array<number>(shape.length).fill(0);
  let rest = flat;
  for (let axis = shape.length - 1; axis >= 0; axis--) {
    coords[axis] = rest % shape[axis];
    rest = Math.floor(rest / shape[axis]);
  }
  return coords;
}

/** Row-major flat index of coordinates. */
function ravel(coords: number[], shape: number[]): number {
  return coords.reduce((flat, coord, axis) => flat * shape[axis] + coord, 0);
}
