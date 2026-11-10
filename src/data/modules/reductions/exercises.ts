import type { Exercise } from "@/features/validation/types";

/** Setup for Exercise 08: daily sales (rows) of three shops (columns), lesson 02. */
const COLUMN_PRELUDE = [
  "import numpy as np",
  "sales = np.array([[4, 10, 3], [6, 12, 5], [8, 8, 7], [2, 14, 1]])",
].join("\n");

/** Hidden setup for Exercise 08: other values and shape, so a hard-coded answer fails. */
const COLUMN_HIDDEN = [
  "import numpy as np",
  "sales = np.array([[1.5, 20.0], [2.5, 40.0], [5.0, 0.0]])",
].join("\n");

/** Setup for Exercise 09: a square array, so the missing keepdims gives wrong values silently. */
const CENTER_PRELUDE = [
  "import numpy as np",
  "X = np.array([[1.0, 2.0, 6.0], [4.0, 4.0, 10.0], [0.0, 3.0, 3.0]])",
].join("\n");

/** Hidden setup for Exercise 09: a (2, 4) array, where the bug is a broadcasting error. */
const CENTER_HIDDEN = [
  "import numpy as np",
  "X = np.array([[2.0, -1.0, 0.5, 4.5], [10.0, 20.0, 30.0, 40.0]])",
].join("\n");

/** Setup for Exercise 10: four examples with three features on different scales, lesson 04. */
const STANDARDIZE_PRELUDE = [
  "import numpy as np",
  "X = np.array([[1.0, 200.0, 0.5], [2.0, 400.0, 1.5], [3.0, 300.0, 1.0], [6.0, 100.0, 1.0]])",
].join("\n");

/** Hidden setup for Exercise 10: other values and shape; no column is constant. */
const STANDARDIZE_HIDDEN = [
  "import numpy as np",
  "X = np.array([[10.0, -2.0], [20.0, 0.0], [15.0, 4.0], [5.0, 1.0], [30.0, 2.0]])",
].join("\n");

/** Starter of the Exercise 09 bug hunt: the row means lose their axis, so they do not broadcast per row. */
const CENTER_STARTER = [
  "# Subtract each row's mean from that row.",
  "row_means = X.mean(axis=1)",
  "centered = X - row_means",
].join("\n");

/** Exercises of Module 0.3 (R2 brief). */
export const REDUCTIONS_EXERCISES: readonly Exercise[] = [
  {
    id: "ex08",
    lessonId: "02",
    title: "The mean of each column",
    objective: "Compute the average sales of each shop and store it in col_means.",
    problem:
      "sales is given above the editor: one row per day and one column per shop. Compute col_means, the mean of each column, with one value per shop.",
    starterCode: "# Compute the mean of each column of sales. Store it in col_means.\n",
    prelude: COLUMN_PRELUDE,
    hint: "The axis you name is the one that disappears. To keep one value per column, collapse the rows: axis=0.",
    runs: [
      { prelude: COLUMN_PRELUDE, reference: COLUMN_PRELUDE },
      { prelude: COLUMN_HIDDEN, reference: COLUMN_HIDDEN },
    ],
    checks: [{ kind: "result", name: "col_means", expression: "sales.mean(axis=0)" }],
    solution: "col_means = sales.mean(axis=0)",
  },
  {
    id: "ex09",
    lessonId: "03",
    type: "bug-hunt",
    title: "Centering rows that do not line up",
    objective: "Fix the code so that centered holds each row of X minus that row's mean.",
    problem:
      "X is given above the editor. The code should subtract each row's mean from that row, so that every row of centered averages 0. It runs on this X, but the values are wrong, and on other shapes it fails. Find and fix the bug.",
    starterCode: CENTER_STARTER,
    prelude: CENTER_PRELUDE,
    hint: "Print row_means.shape. For each row mean to stretch across its own row, it needs shape (rows, 1): add keepdims=True.",
    runs: [
      { prelude: CENTER_PRELUDE, reference: CENTER_PRELUDE },
      { prelude: CENTER_HIDDEN, reference: CENTER_HIDDEN },
    ],
    checks: [{ kind: "result", name: "centered", expression: "X - X.mean(axis=1, keepdims=True)" }],
    solution: ["row_means = X.mean(axis=1, keepdims=True)", "centered = X - row_means"].join("\n"),
  },
  {
    id: "ex10",
    lessonId: "04",
    title: "Standardize the features",
    objective: "Standardize each column of X and store the result in Z, without a Python loop.",
    problem:
      "X is given above the editor: one row per example and one column per feature. Compute Z, where each column has its mean subtracted and is divided by its standard deviation. Use array operations, not a loop.",
    starterCode: "# Standardize each column of X. Store the result in Z.\n",
    prelude: STANDARDIZE_PRELUDE,
    hint: "Compute the column means and standard deviations with axis=0, then (X - mean) / std. Both broadcast across the rows.",
    runs: [
      { prelude: STANDARDIZE_PRELUDE, reference: STANDARDIZE_PRELUDE },
      { prelude: STANDARDIZE_HIDDEN, reference: STANDARDIZE_HIDDEN },
    ],
    checks: [
      { kind: "no-loop" },
      { kind: "result", name: "Z", expression: "(X - X.mean(axis=0)) / X.std(axis=0)" },
    ],
    solution: "Z = (X - X.mean(axis=0)) / X.std(axis=0)",
  },
];
