import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "Swap rows and columns with `.T`, and turn a 1D array into a column with `reshape(-1, 1)`. Both fix shapes that do not line up for `@` or broadcasting.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What a transpose is",
      blocks: [
        {
          kind: "text",
          text: "The transpose of a matrix swaps its rows and columns: the first row becomes the first column, the second row the second column, and so on.",
        },
        {
          kind: "text",
          text: "In NumPy you write `m.T`. A matrix of shape `(2, 3)` becomes one of shape `(3, 2)`. The element at row `i`, column `j` moves to row `j`, column `i`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "m = np.array([[1, 2, 3], [4, 5, 6]])",
            "print(m.shape)",
            "print(m.T)",
            "print(m.T.shape)",
          ].join("\n"),
          output: ["(2, 3)", "[[1 4]", " [2 5]", " [3 6]]", "(3, 2)"].join("\n"),
        },
        {
          kind: "note",
          text: "Transpose is not reshape. `m.reshape(3, 2)` keeps row-major order and gives `[[1 2] [3 4] [5 6]]`; `m.T` gives `[[1 4] [2 5] [3 6]]`. Same shape, different arrangement.",
        },
      ],
    },
    {
      title: "Why shapes need flipping",
      blocks: [
        {
          kind: "text",
          text: "Data does not always come stored the way an operation needs it. Weights might be stored one row per output when the formula needs one column per output.",
        },
        {
          kind: "text",
          text: "Matrix multiplication from Module 0.2 is strict: `(m, k) @ (k, n)` gives `(m, n)`, and the two inner sizes must match. When they do not, a transpose of one operand often fixes it.",
        },
      ],
    },
    {
      title: "Transposing for @",
      blocks: [
        {
          kind: "text",
          text: "Here `X` holds 3 samples with 2 features, shape `(3, 2)`. `W` holds 4 outputs, each a row of 2 weights, shape `(4, 2)`.",
        },
        {
          kind: "text",
          text: "`X @ W` fails, because the inner sizes are 2 and 4. `W.T` has shape `(2, 4)`, so `X @ W.T` is `(3, 2) @ (2, 4)` and gives `(3, 4)`: one row per sample, one column per output.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1, 2], [3, 4], [5, 6]])",
            "W = np.array([[1, 0], [0, 1], [1, 1], [2, 0]])",
            "out = X @ W.T",
            "print(out.shape)",
            "print(out)",
          ].join("\n"),
          output: ["(3, 4)", "[[ 1  2  3  2]", " [ 3  4  7  6]", " [ 5  6 11 10]]"].join("\n"),
        },
        {
          kind: "note",
          text: "`X @ W` here raises a `ValueError` that mentions a mismatch in the core dimension. Read the two shapes, find the sizes that should match, and transpose the operand that has them the wrong way round.",
        },
      ],
    },
    {
      title: "Turning a 1D array into a column",
      blocks: [
        {
          kind: "text",
          text: "A 1D array has only one axis, so `.T` leaves it unchanged. To make a column, reshape it to one value per row with `reshape(-1, 1)`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "v = np.array([1, 2, 3])",
            "print(v.T.shape)",
            "col = v.reshape(-1, 1)",
            "print(col)",
            "print(col.shape)",
          ].join("\n"),
          output: ["(3,)", "[[1]", " [2]", " [3]]", "(3, 1)"].join("\n"),
        },
        {
          kind: "text",
          text: "A column is what broadcasting needs to apply one value per row. `X * s` with `X` of shape `(3, 2)` and `s` of shape `(3,)` fails, but a column of shape `(3, 1)` stretches across the columns.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1, 2], [3, 4], [5, 6]])",
            "s = np.array([10, 20, 30])",
            "print(X * s.reshape(-1, 1))",
          ].join("\n"),
          output: ["[[ 10  20]", " [ 60  80]", " [150 180]]"].join("\n"),
        },
      ],
    },
    {
      title: "Try it: transpose and @",
      blocks: [
        {
          kind: "text",
          text: "Pick an expression. Watch `.T` swap rows and columns, then see which products line up and which one fails.",
        },
        {
          kind: "playground",
          demo: {
            title: "Transpose to make @ fit",
            controls: [
              {
                type: "select",
                name: "expr",
                label: "Expression",
                options: [
                  { label: "a.T", value: "a.T" },
                  { label: "a @ b", value: "a @ b" },
                  { label: "a @ b.T", value: "a @ b.T" },
                  { label: "a.T @ b", value: "a.T @ b" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "a = np.array([[1, 2, 3], [4, 5, 6]])",
              "b = np.array([[1, 0, 1], [0, 1, 0]])",
              "r = {{expr}}",
            ].join("\n"),
          },
        },
      ],
    },
    {
      title: "Recap",
      blocks: [
        {
          kind: "list",
          items: [
            "`.T` swaps rows and columns: shape `(m, n)` becomes `(n, m)`.",
            "Transpose is different from reshape, even when the shapes match.",
            "For `(m, k) @ (k, n)` the inner sizes must match; transposing one operand often fixes a mismatch.",
            "`.T` does nothing to a 1D array; `reshape(-1, 1)` makes it a column.",
            "A column of shape `(n, 1)` broadcasts one value across each row.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "reshape-02-q1",
      question: "`m` has shape `(4, 2)`. What is the shape of `m.T`?",
      options: ["(4, 2)", "(2, 4)", "(8,)"],
      answer: 1,
      explanation: "A transpose swaps the two sizes.",
    },
    {
      id: "reshape-02-q2",
      question: "`A` is `(3, 5)` and `B` is `(2, 5)`. Which product works?",
      options: ["A @ B", "A.T @ B", "B @ A", "A @ B.T"],
      answer: 3,
      explanation: "`B.T` is `(5, 2)`, so `(3, 5) @ (5, 2)` gives `(3, 2)`.",
    },
    {
      id: "reshape-02-q3",
      question: "`v = np.array([1, 2, 3])`. What is `v.T.shape`?",
      options: ["(3,)", "(3, 1)", "(1, 3)"],
      answer: 0,
      explanation: "A 1D array has one axis, so there is nothing to swap; use `reshape(-1, 1)` for a column.",
    },
  ],
};
