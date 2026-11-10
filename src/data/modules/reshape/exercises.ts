import type { Exercise } from "@/features/validation/types";

/** Exercise 11 setup: 12 values (lesson 01). */
const RESHAPE_PRELUDE = ["import numpy as np", "values = np.arange(1, 13)"].join("\n");

/** Exercise 11 hidden setup: 15 values, so a hard-coded number of rows fails. */
const RESHAPE_HIDDEN = ["import numpy as np", "values = np.arange(20, 35)"].join("\n");

/** Exercise 12 setup: 3 samples with 2 features, 4 outputs stored one row each (lesson 02). */
const TRANSPOSE_PRELUDE = [
  "import numpy as np",
  "X = np.array([[1, 2], [0, 3], [4, 1]])",
  "W = np.array([[2, 1], [1, 0], [0, 1], [1, 1]])",
].join("\n");

/** Exercise 12 hidden setup: other values and shapes with the same layout. */
const TRANSPOSE_HIDDEN = [
  "import numpy as np",
  "X = np.array([[1, -1, 2], [0, 2, 1]])",
  "W = np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 1]])",
].join("\n");

/** Exercise 12 starter: the product the comment asks for, with W the wrong way round. */
const TRANSPOSE_STARTER = [
  "# Each row of X is one sample; each row of W holds the weights of one output.",
  "# out should have one row per sample and one column per output.",
  "out = X @ W",
].join("\n");

/** Exercise 13 setup: 5 samples with 2 features (lesson 04). */
const FILTER_PRELUDE = [
  "import numpy as np",
  "X = np.array([[2, 5], [-1, 3], [4, -2], [-3, -1], [0, 7]])",
].join("\n");

/** Exercise 13 hidden setup: other rows, including a first feature of exactly 0. */
const FILTER_HIDDEN = [
  "import numpy as np",
  "X = np.array([[0.5, 1], [-2, 4], [0, 3], [3.5, -1], [-0.1, 2], [7, 7]])",
].join("\n");

/** Exercises of Module 0.4 (R2 brief): one build per idea, the transpose one as a bug hunt. */
export const RESHAPE_EXERCISES: readonly Exercise[] = [
  {
    id: "ex11",
    lessonId: "01",
    title: "Reshape into rows of 3",
    objective: "Reshape a 1D array into a 2D array with 3 columns, letting NumPy compute the rows.",
    problem:
      "values is a 1D array given above the editor. Store in grid the same values as a 2D array with 3 columns and as many rows as needed. Your code must also work when values has a different length that is a multiple of 3.",
    starterCode: "# Reshape values into 3 columns. Store the result in grid.\n",
    prelude: RESHAPE_PRELUDE,
    hint: "Write -1 for the number of rows and 3 for the number of columns: NumPy computes the -1 from the length.",
    runs: [
      { prelude: RESHAPE_PRELUDE, reference: RESHAPE_PRELUDE },
      { prelude: RESHAPE_HIDDEN, reference: RESHAPE_HIDDEN },
    ],
    checks: [{ kind: "result", name: "grid", expression: "values.reshape(-1, 3)" }],
    solution: "grid = values.reshape(-1, 3)",
  },
  {
    id: "ex12",
    lessonId: "02",
    type: "bug-hunt",
    title: "Fix the matrix product",
    objective: "Make out = X times the weights work, with one row per sample and one column per output.",
    problem:
      "X holds 3 samples with 2 features, shape (3, 2). W holds the weights of 4 outputs, one row of 2 weights per output, shape (4, 2). The code should compute out with shape (3, 4), but it stops with an error. Fix the product without changing X or W.",
    starterCode: TRANSPOSE_STARTER,
    prelude: TRANSPOSE_PRELUDE,
    hint: "Run it and read the shapes in the error. For @ the last size of the left operand must equal the first size of the right one. Which operand has its rows and columns the wrong way round?",
    runs: [
      { prelude: TRANSPOSE_PRELUDE, reference: TRANSPOSE_PRELUDE },
      { prelude: TRANSPOSE_HIDDEN, reference: TRANSPOSE_HIDDEN },
    ],
    checks: [
      { kind: "result", name: "out", expression: "X @ W.T" },
      { kind: "unchanged", name: "X", expression: "X" },
      { kind: "unchanged", name: "W", expression: "W" },
    ],
    solution: TRANSPOSE_STARTER.replace("out = X @ W", "out = X @ W.T"),
  },
  {
    id: "ex13",
    lessonId: "04",
    title: "Keep the rows with a positive first feature",
    objective: "Select the rows of X whose first column is greater than 0, using a boolean mask.",
    problem:
      "X is given above the editor: one row per sample, two features per row. Store in selected the rows of X whose first feature is greater than 0, with both columns and in their original order. Use a mask, not a loop.",
    starterCode: "# Keep the rows of X whose first column is greater than 0. Store them in selected.\n",
    prelude: FILTER_PRELUDE,
    hint: "X[:, 0] is the first column. Compare it with 0 to get one boolean per row, then index X with that mask.",
    runs: [
      { prelude: FILTER_PRELUDE, reference: FILTER_PRELUDE },
      { prelude: FILTER_HIDDEN, reference: FILTER_HIDDEN },
    ],
    checks: [{ kind: "no-loop" }, { kind: "result", name: "selected", expression: "X[X[:, 0] > 0]" }],
    solution: "selected = X[X[:, 0] > 0]",
  },
];
