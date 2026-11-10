import type { Exercise } from "@/features/validation/types";

/** Starter code of the Part 9 broadcasting scenario (lesson 07, Exercise 03). */
export const BROADCASTING_STARTER = [
  "import numpy as np",
  "",
  "X = np.array([",
  "    [1, 2],",
  "    [3, 4],",
  "    [5, 6]",
  "])",
  "",
  "w = np.array([2, 3])",
  "",
  "out = X * w",
].join("\n");

/** Shared setup for Exercise 02: two vectors of the same length (lesson 06). */
const ELEMENTWISE_PRELUDE = [
  "import numpy as np",
  "a = np.array([1, 2, 3])",
  "b = np.array([4, 5, 6])",
].join("\n");

/** Hidden setup for Exercise 02: different values, so a hard-coded answer fails. */
const ELEMENTWISE_HIDDEN = [
  "import numpy as np",
  "a = np.array([7, -2, 0.5])",
  "b = np.array([3, 3, 8])",
].join("\n");

/** Shared setup for Exercise 04: X * w + b with the bias as a vector (lesson 08). */
const PRACTICAL_PRELUDE = [
  "import numpy as np",
  "X = np.array([[1, 2], [3, 4], [5, 6]])",
  "w = np.array([2, 3])",
  "b = np.array([1, -1])",
].join("\n");

/** Hidden setup for Exercise 04: different values and shapes that still broadcast. */
const PRACTICAL_HIDDEN = [
  "import numpy as np",
  "X = np.array([[0.5, 1.5], [2, -1], [4, 3]])",
  "w = np.array([-1, 2])",
  "b = np.array([10, 20])",
].join("\n");

/**
 * Exercises of the MVP (brief Part 10). The brief does not name the arrays of Exercise 01, so
 * the arrays below are a design decision: a 1D array, a 3 by 2 matrix and a 2 by 2 by 2 array.
 */
export const ARRAYS_EXERCISES: readonly Exercise[] = [
  {
    id: "ex01",
    lessonId: "03",
    title: "Array shapes",
    objective: "Create three arrays and store the shape of each one.",
    problem:
      "Create a = [1, 2, 3, 4] as a 1D array. Create b as a 2D array with 3 rows and 2 columns holding 1 to 6 in order. Create c as a 3D array of shape (2, 2, 2) holding 1 to 8 in order. Then store their shapes in a_shape, b_shape and c_shape.",
    starterCode:
      "import numpy as np\n\n# Create a, b and c, then store their shapes in a_shape, b_shape and c_shape.\n",
    prelude: "",
    hint: "A list of lists makes a 2D array. np.arange(1, 9).reshape((2, 2, 2)) makes the 3D one. .shape gives the shape as a tuple.",
    runs: [{ prelude: "", reference: "import numpy as np" }],
    checks: [
      { kind: "result", name: "a", expression: "np.array([1, 2, 3, 4])" },
      { kind: "result", name: "b", expression: "np.array([[1, 2], [3, 4], [5, 6]])" },
      { kind: "result", name: "c", expression: "np.arange(1, 9).reshape((2, 2, 2))" },
      { kind: "result", name: "a_shape", expression: "(4,)" },
      { kind: "result", name: "b_shape", expression: "(3, 2)" },
      { kind: "result", name: "c_shape", expression: "(2, 2, 2)" },
    ],
    solution: [
      "import numpy as np",
      "a = np.array([1, 2, 3, 4])",
      "b = np.array([[1, 2], [3, 4], [5, 6]])",
      "c = np.arange(1, 9).reshape((2, 2, 2))",
      "a_shape = a.shape",
      "b_shape = b.shape",
      "c_shape = c.shape",
    ].join("\n"),
  },
  {
    id: "ex02",
    lessonId: "06",
    title: "Element-wise multiplication",
    objective: "Multiply a and b element by element and store the result in result.",
    problem: "a and b are given above the editor. Compute result, the element-wise product of a and b.",
    starterCode: "# Multiply a and b element by element. Store the result in result.\n",
    prelude: ELEMENTWISE_PRELUDE,
    hint: "The * operator on two NumPy arrays of the same shape multiplies them element by element.",
    runs: [
      { prelude: ELEMENTWISE_PRELUDE, reference: ELEMENTWISE_PRELUDE },
      { prelude: ELEMENTWISE_HIDDEN, reference: ELEMENTWISE_HIDDEN },
    ],
    checks: [{ kind: "result", name: "result", expression: "a * b" }],
    solution: "result = a * b",
  },
  {
    id: "ex03",
    lessonId: "07",
    title: "Broadcasting: multiply each column by its weight",
    objective: "Compute out = X * w with broadcasting, and keep X and w as they were.",
    problem: "Multiply each column of matrix X by the corresponding weight in w.",
    starterCode: BROADCASTING_STARTER,
    prelude: "",
    hint: "Try changing w to three values and running it. Read the error, then restore w.",
    runs: [
      {
        prelude: "",
        reference: [
          "import numpy as np",
          "X = np.array([[1, 2], [3, 4], [5, 6]])",
          "w = np.array([2, 3])",
        ].join("\n"),
      },
    ],
    checks: [
      { kind: "result", name: "out", expression: "X * w" },
      { kind: "unchanged", name: "X", expression: "X" },
      { kind: "unchanged", name: "w", expression: "w" },
    ],
    solution: BROADCASTING_STARTER,
  },
  {
    id: "ex04",
    lessonId: "08",
    title: "Practical application: X * w + b",
    objective: "Compute out = X * w + b, where the bias b is added to every row.",
    problem: "X, w and b are given above the editor. Compute out = X * w + b.",
    starterCode: "# Compute out = X * w + b. Store the result in out.\n",
    prelude: PRACTICAL_PRELUDE,
    hint: "Compute X * w first. Then add b; it broadcasts across the rows.",
    runs: [
      { prelude: PRACTICAL_PRELUDE, reference: PRACTICAL_PRELUDE },
      { prelude: PRACTICAL_HIDDEN, reference: PRACTICAL_HIDDEN },
    ],
    checks: [{ kind: "result", name: "out", expression: "X * w + b" }],
    solution: "out = X * w + b",
  },
];
