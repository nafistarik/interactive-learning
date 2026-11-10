/**
 * Python code the theory demos run (brief Part 5). Each demo turns its controls into code with
 * these pure builders, records it with the real frame recorder, and draws the recorded frames.
 * Builders accept only validated numbers and fixed choices, so no user text reaches Python.
 */

/** Formats a number as a Python literal. */
function literal(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error(`Not a finite number: ${value}`);
  }
  return String(value);
}

/** Formats a shape as a Python tuple: `(3,)` or `(3, 2)`. */
export function shapeLiteral(shape: number[]): string {
  return shape.length === 1 ? `(${shape[0]},)` : `(${shape.join(", ")})`;
}

/**
 * Lesson 01: an array from the values the learner typed.
 *
 * @param values - The element values.
 * @returns Code defining `a`.
 */
export function editArrayCode(values: number[]): string {
  return `import numpy as np\na = np.array([${values.map(literal).join(", ")}])`;
}

/** Lesson 02: the dimensions to choose from. */
export const DIMENSION_CHOICES = {
  1: "np.arange(1, 5)",
  2: "np.arange(1, 7).reshape(2, 3)",
  3: "np.arange(1, 13).reshape(2, 2, 3)",
} as const;

/**
 * Lesson 02: an array with 1, 2 or 3 dimensions.
 *
 * @param ndim - The number of dimensions.
 * @returns Code defining `a`.
 */
export function dimensionsCode(ndim: keyof typeof DIMENSION_CHOICES): string {
  return `import numpy as np\na = ${DIMENSION_CHOICES[ndim]}`;
}

/** Lesson 03: structures to pick, each a Python literal. */
export const SHAPE_CHOICES = [
  { id: "vector", label: "A list of 4 numbers", literal: "[3, 1, 4, 1]" },
  { id: "row", label: "One row of 3", literal: "[[7, 8, 9]]" },
  { id: "column", label: "One column of 3", literal: "[[7], [8], [9]]" },
  { id: "table23", label: "A table, 2 rows × 3 columns", literal: "[[1, 2, 3], [4, 5, 6]]" },
  { id: "table32", label: "A table, 3 rows × 2 columns", literal: "[[1, 2], [3, 4], [5, 6]]" },
  { id: "stack", label: "Two stacked 2 × 2 tables", literal: "[[[1, 2], [3, 4]], [[5, 6], [7, 8]]]" },
] as const;

/**
 * Lesson 03: an array from a chosen structure.
 *
 * @param id - The chosen structure.
 * @returns Code defining `x`.
 */
export function shapePickerCode(id: (typeof SHAPE_CHOICES)[number]["id"]): string {
  const choice = SHAPE_CHOICES.find((item) => item.id === id) ?? SHAPE_CHOICES[0];
  return `import numpy as np\nx = np.array(${choice.literal})`;
}

/** Lesson 04: size of the array the learner indexes. */
export const INDEX_ROWS = 4;
export const INDEX_COLS = 5;

/** Lesson 04: the kinds of selection. */
export type Selection =
  | { kind: "element"; row: number; col: number }
  | { kind: "row"; row: number }
  | { kind: "column"; col: number }
  | { kind: "slice"; rowStart: number; rowStop: number; colStart: number; colStop: number };

/**
 * The index expression for a selection, as the learner would write it.
 *
 * @param selection - What to select.
 * @returns The expression inside `a[...]`.
 */
export function selectionExpression(selection: Selection): string {
  switch (selection.kind) {
    case "element":
      return `${literal(selection.row)}, ${literal(selection.col)}`;
    case "row":
      return literal(selection.row);
    case "column":
      return `:, ${literal(selection.col)}`;
    case "slice":
      return `${literal(selection.rowStart)}:${literal(selection.rowStop)}, ${literal(selection.colStart)}:${literal(selection.colStop)}`;
  }
}

/**
 * Lesson 04: selects from a 4 × 5 array. `mask` marks the selected cells, computed by NumPy
 * with the same index expression, so the highlight is exactly what NumPy selects.
 *
 * @param selection - What to select.
 * @returns Code defining `a`, `selected` and `mask`.
 */
export function indexingCode(selection: Selection): string {
  const expression = selectionExpression(selection);
  return [
    "import numpy as np",
    `a = np.arange(${INDEX_ROWS * INDEX_COLS}).reshape(${INDEX_ROWS}, ${INDEX_COLS})`,
    `selected = a[${expression}]`,
    "mask = np.zeros(a.shape, dtype=int)",
    `mask[${expression}] = 1`,
  ].join("\n");
}

/** Lesson 05: number of elements timed. */
export const TIMING_SIZE = 100_000;

/**
 * Lesson 05: times the same computation as a Python loop and as one NumPy operation, in the
 * learner's browser. Floats avoid int32 overflow in Pyodide. Prints loop ms, then NumPy ms.
 */
export const TIMING_CODE = [
  "import time",
  "import numpy as np",
  `data = np.arange(${TIMING_SIZE}, dtype=np.float64)`,
  "start = time.perf_counter()",
  "looped = [x * 2 + 1 for x in data.tolist()]",
  "loop_ms = (time.perf_counter() - start) * 1000",
  "start = time.perf_counter()",
  "vectorized = data * 2 + 1",
  "numpy_ms = (time.perf_counter() - start) * 1000",
  "assert np.allclose(looped, vectorized)",
  "print(loop_ms)",
  "print(numpy_ms)",
].join("\n");

/**
 * Reads the two timings TIMING_CODE prints.
 *
 * @param stdout - The printed output.
 * @returns Loop and NumPy milliseconds, or `null` if the output is not two numbers.
 */
export function parseTimings(stdout: string): { loopMs: number; numpyMs: number } | null {
  const [loop, numpy] = stdout.trim().split("\n").map(Number);
  return Number.isFinite(loop) && Number.isFinite(numpy) ? { loopMs: loop, numpyMs: numpy } : null;
}

/** Lesson 06: the operators the learner can pick. */
export const ELEMENTWISE_OPERATORS = ["+", "-", "*", "/"] as const;

/**
 * Lesson 06: two arrays combined element by element.
 *
 * @param a - Values of `a`.
 * @param b - Values of `b`.
 * @param operator - The operator.
 * @returns Code defining `a`, `b` and `c`.
 */
export function elementwiseCode(
  a: number[],
  b: number[],
  operator: (typeof ELEMENTWISE_OPERATORS)[number],
): string {
  return [
    "import numpy as np",
    `a = np.array([${a.map(literal).join(", ")}])`,
    `b = np.array([${b.map(literal).join(", ")}])`,
    `c = a ${operator} b`,
  ].join("\n");
}

/**
 * Lesson 07: multiplies two arrays of the chosen shapes, so NumPy decides whether they
 * broadcast.
 *
 * @param left - Shape of `a`.
 * @param right - Shape of `b`.
 * @returns Code defining `a`, `b` and `c` (the last line fails when they do not broadcast).
 */
export function broadcastShapesCode(left: number[], right: number[]): string {
  const size = (shape: number[]) => shape.reduce((product, axis) => product * axis, 1);
  return [
    "import numpy as np",
    `a = np.arange(1, ${size(left) + 1}).reshape(${shapeLiteral(left)})`,
    `b = np.arange(1, ${size(right) + 1}).reshape(${shapeLiteral(right)}) * 10`,
    "c = a * b",
  ].join("\n");
}

/** Lesson 08: the code stepped through. */
export const XWB_CODE = [
  "import numpy as np",
  "",
  "X = np.array([",
  "    [1.0, 2.0],",
  "    [3.0, 4.0],",
  "    [5.0, 6.0]",
  "])",
  "w = np.array([0.5, -1.0])",
  "b = np.array([10.0, 20.0])",
  "",
  "out = X * w + b",
].join("\n");
