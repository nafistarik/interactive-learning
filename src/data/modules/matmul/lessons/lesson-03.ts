import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "Multiplying two matrices takes the dot product of every row of the left with every column of the right. Learn the shape rule `(m, k) @ (k, n) -> (m, n)` that decides when it works.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What matrix multiplication is",
      blocks: [
        {
          kind: "text",
          text: "`A @ B` multiplies two matrices. Each value of the result is one dot product: a row of `A` with a column of `B`.",
        },
        {
          kind: "note",
          text: "The value at row `i`, column `j` of `A @ B` is the dot product of row `i` of `A` with column `j` of `B`.",
        },
      ],
    },
    {
      title: "Why multiply two matrices",
      blocks: [
        {
          kind: "text",
          text: "In the last lesson, `X @ w` scored every row with one weight vector. Often you want several scores per example, each with its own weights.",
        },
        {
          kind: "text",
          text: "Put each weight vector in its own column of a matrix `W`. Then `X @ W` scores every example with every weight vector in one step.",
        },
      ],
    },
    {
      title: "Row i times column j",
      blocks: [
        {
          kind: "text",
          text: "Here both matrices are 2 by 2, so the result has 4 values, one for each pair of a row of `A` and a column of `B`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "A = np.array([[1, 2], [3, 4]])",
            "B = np.array([[5, 6], [7, 8]])",
            "C = A @ B",
            "print(C)",
            "print(int(A[0] @ B[:, 1]))",
          ].join("\n"),
          output: ["[[19 22]", " [43 50]]", "22"].join("\n"),
        },
        {
          kind: "text",
          text: "`C[0, 1]` is row 0 of `A`, `[1, 2]`, dotted with column 1 of `B`, `[6, 8]`: `1*6 + 2*8 = 22`.",
        },
      ],
    },
    {
      title: "The shape rule: (m, k) @ (k, n) -> (m, n)",
      blocks: [
        {
          kind: "text",
          text: "A row of `A` and a column of `B` can only be dotted if they have the same length. That gives one rule about the shapes.",
        },
        {
          kind: "list",
          items: [
            "`A` has shape `(m, k)`: each row has `k` values.",
            "`B` must have shape `(k, n)`: each column has `k` values. These two inner sizes must be equal.",
            "The result has shape `(m, n)`: one row per row of `A`, one column per column of `B`.",
          ],
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1, 2, 3], [4, 5, 6]])",
            "W = np.array([[1, 0], [0, 1], [1, 1]])",
            "print(X.shape, W.shape)",
            "print((X @ W).shape)",
            "print(X @ W)",
            "print((W @ X).shape)",
          ].join("\n"),
          output: ["(2, 3) (3, 2)", "(2, 2)", "[[ 4  5]", " [10 11]]", "(3, 3)"].join("\n"),
        },
        {
          kind: "text",
          text: "Order matters: `X @ W` is `(2, 3) @ (3, 2) -> (2, 2)`, but `W @ X` is `(3, 2) @ (2, 3) -> (3, 3)`. They are different products.",
        },
        {
          kind: "note",
          text: "`X @ X` with `X` of shape `(2, 3)` raises a `ValueError`: the inner sizes are 3 and 2. When a product fails, compare the inner sizes first.",
        },
      ],
    },
    {
      title: "Matrix times vector follows the same rule",
      blocks: [
        {
          kind: "text",
          text: "A vector on the right, shape `(k,)`, acts like a single column. `(m, k) @ (k,)` gives `(m,)`, the result of the last lesson.",
        },
        {
          kind: "text",
          text: "NumPy states the rule this way: the last axis of the left must equal the first axis of a 1D right, or the second-to-last axis of a 2D right.",
        },
      ],
    },
    {
      title: "Try it: which shapes fit",
      blocks: [
        {
          kind: "text",
          text: "`A` has shape `(2, 3)`. Pick a right matrix `B`, watch each cell of the result form as row times column, and pick the `(2, 3)` option to see the inner sizes clash.",
        },
        {
          kind: "playground",
          demo: {
            title: "Matrix multiplication shape rule",
            controls: [
              {
                type: "select",
                name: "B",
                label: "Matrix B",
                options: [
                  { label: "(3, 2)", value: "np.array([[1, 0], [0, 1], [1, 1]])" },
                  { label: "(3, 1)", value: "np.array([[1], [2], [3]])" },
                  { label: "(3, 3), ones on the diagonal", value: "np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1]])" },
                  { label: "(2, 3), does not fit", value: "np.array([[1, 0, 1], [0, 1, 0]])" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "A = np.array([[1, 2, 3], [4, 5, 6]])",
              "B = {{B}}",
              "C = A @ B",
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
            "Cell `(i, j)` of `A @ B` is row `i` of `A` dotted with column `j` of `B`.",
            "`(m, k) @ (k, n) -> (m, n)`: the inner sizes must match, the outer sizes make the result.",
            "Order matters: `A @ B` and `B @ A` are different, and one may fail.",
            "A 1D vector on the right acts as one column and the result loses that axis.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "matmul-03-q1",
      question: "What is the shape of `A @ B` when `A` is `(4, 2)` and `B` is `(2, 3)`?",
      options: ["(2, 2)", "(4, 3)", "(4, 2)", "An error"],
      answer: 1,
      explanation: "The inner sizes 2 and 2 match; the outer sizes 4 and 3 give the result.",
    },
    {
      id: "matmul-03-q2",
      question: "Which pair of shapes can be multiplied with `@`?",
      options: ["`(2, 3)` and `(2, 3)`", "`(3, 4)` and `(3, 4)`", "`(2, 3)` and `(3, 5)`"],
      answer: 2,
      explanation: "Only `(2, 3) @ (3, 5)` has equal inner sizes, 3 and 3.",
    },
    {
      id: "matmul-03-q3",
      question: "Which values make up cell `(1, 0)` of `A @ B`?",
      options: [
        "Row 1 of `A` and column 0 of `B`",
        "Row 0 of `A` and column 1 of `B`",
        "Element `(1, 0)` of `A` times element `(1, 0)` of `B`",
      ],
      answer: 0,
      explanation: "The row index comes from `A`, the column index from `B`.",
    },
    {
      id: "matmul-03-q4",
      question: "`A` is `(2, 3)` and `B` is `(3, 2)`. What are the shapes of `A @ B` and `B @ A`?",
      options: ["Both `(2, 2)`", "`(3, 3)` and `(2, 2)`", "Both `(3, 3)`", "`(2, 2)` and `(3, 3)`"],
      answer: 3,
      explanation: "The outer sizes give the result: `(2, 2)` for `A @ B`, `(3, 3)` for `B @ A`.",
    },
  ],
};
