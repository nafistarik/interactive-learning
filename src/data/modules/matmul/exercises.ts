import type { Exercise } from "@/features/validation/types";

/** Shared setup for Exercise 05: a (2, 3) matrix and a length-3 vector (lesson 02). */
const MATVEC_PRELUDE = [
  "import numpy as np",
  "X = np.array([[1, 2, 3], [4, 5, 6]])",
  "w = np.array([2, 0, -1])",
].join("\n");

/** Hidden setup for Exercise 05: other values and a (3, 2) shape, so a hard-coded answer fails. */
const MATVEC_HIDDEN = [
  "import numpy as np",
  "X = np.array([[0.5, 1], [2, -1], [3, 3]])",
  "w = np.array([4, 1])",
].join("\n");

/** Starter code of Exercise 06: the weight vectors were written as rows instead of columns. */
const WRONG_ORIENTATION_STARTER = [
  "import numpy as np",
  "",
  "X = np.array([",
  "    [1, 2, 3],",
  "    [4, 5, 6]",
  "])",
  "",
  "# Two weight vectors, [1, 0, 2] and [0, 1, 1], one per column of W.",
  "W = np.array([",
  "    [1, 0, 2],",
  "    [0, 1, 1]",
  "])",
  "",
  "out = X @ W",
].join("\n");

/** Shared setup for Exercise 07: a linear layer with 2 features in and 3 outputs (lesson 04). */
const LAYER_PRELUDE = [
  "import numpy as np",
  "X = np.array([[1, 2], [3, 4], [5, 6]])",
  "W = np.array([[1, 0, -1], [2, 1, 0]])",
  "b = np.array([1, 2, 3])",
].join("\n");

/** Hidden setup for Exercise 07: other values and shapes, 3 features in and 2 outputs. */
const LAYER_HIDDEN = [
  "import numpy as np",
  "X = np.array([[0.5, 1, 2], [-1, 0, 3]])",
  "W = np.array([[1, 2], [0, 1], [2, 0]])",
  "b = np.array([10, -5])",
].join("\n");

/** Exercises of Module 0.2 (R2 brief): one build, one bug hunt, one build. */
export const MATMUL_EXERCISES: readonly Exercise[] = [
  {
    id: "ex05",
    lessonId: "02",
    title: "Matrix times vector",
    objective: "Compute the dot product of each row of X with w, and store it in scores.",
    problem:
      "X and w are given above the editor. Compute scores, a vector with one value per row of X: the dot product of that row with w.",
    starterCode: "# Compute scores: each row of X dotted with w.\n",
    prelude: MATVEC_PRELUDE,
    hint: "X @ w takes the dot product of every row of X with w in one step.",
    runs: [
      { prelude: MATVEC_PRELUDE, reference: MATVEC_PRELUDE },
      { prelude: MATVEC_HIDDEN, reference: MATVEC_HIDDEN },
    ],
    checks: [{ kind: "result", name: "scores", expression: "X @ w" }],
    solution: "scores = X @ w",
  },
  {
    id: "ex06",
    lessonId: "03",
    type: "bug-hunt",
    title: "Bug hunt: weights the wrong way round",
    objective: "Fix the definition of W so that out = X @ W works, and keep X as it is.",
    problem:
      "X holds 2 examples with 3 features each. W should hold two weight vectors, [1, 0, 2] and [0, 1, 1], one per column, so that out = X @ W gives each example two scores. Running the code raises a ValueError. Fix W.",
    starterCode: WRONG_ORIENTATION_STARTER,
    prelude: "",
    hint: "Read the shapes: X is (2, 3), so W needs 3 rows. Each weight vector should run down a column of W, not along a row.",
    runs: [
      {
        prelude: "",
        reference: [
          "import numpy as np",
          "X = np.array([[1, 2, 3], [4, 5, 6]])",
          "W = np.array([[1, 0], [0, 1], [2, 1]])",
        ].join("\n"),
      },
    ],
    checks: [
      { kind: "result", name: "W", expression: "W" },
      { kind: "result", name: "out", expression: "X @ W" },
      { kind: "unchanged", name: "X", expression: "X" },
    ],
    solution: WRONG_ORIENTATION_STARTER.replace(
      "W = np.array([\n    [1, 0, 2],\n    [0, 1, 1]\n])",
      "W = np.array([\n    [1, 0],\n    [0, 1],\n    [2, 1]\n])",
    ),
  },
  {
    id: "ex07",
    lessonId: "04",
    title: "Practical application: X @ W + b",
    objective: "Compute out = X @ W + b, a linear layer with a bias for each output.",
    problem: "X, W and b are given above the editor. Compute out = X @ W + b.",
    starterCode: "# Compute out = X @ W + b. Store the result in out.\n",
    prelude: LAYER_PRELUDE,
    hint: "Use @ for the weighted sums, not *. Then add b; it broadcasts across the rows.",
    runs: [
      { prelude: LAYER_PRELUDE, reference: LAYER_PRELUDE },
      { prelude: LAYER_HIDDEN, reference: LAYER_HIDDEN },
    ],
    checks: [{ kind: "result", name: "out", expression: "X @ W + b" }],
    solution: "out = X @ W + b",
  },
];
