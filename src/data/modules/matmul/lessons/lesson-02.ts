import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "Multiplying a matrix by a vector takes the dot product of each row with the vector. One line gives one result per row.",
  estimatedMinutes: 14,
  sections: [
    {
      title: "What a matrix, a row and a column are",
      blocks: [
        {
          kind: "text",
          text: "A matrix is a 2D array of numbers, like the ones you built in Module 0.1. Its shape is `(rows, columns)`.",
        },
        {
          kind: "text",
          text: "A row is one horizontal line of the matrix, `X[i]`. A column is one vertical line, `X[:, j]`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1, 2, 3], [4, 5, 6]])",
            "print(X.shape)",
            "print(X[1])",
            "print(X[:, 2])",
          ].join("\n"),
          output: ["(2, 3)", "[4 5 6]", "[3 6]"].join("\n"),
        },
      ],
    },
    {
      title: "Matrix times vector: one dot product per row",
      blocks: [
        {
          kind: "text",
          text: "`X @ v` takes each row of `X` and computes its dot product with `v`. Each row gives one number, so the result is a vector with one value per row.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1, 2, 3], [4, 5, 6]])",
            "v = np.array([1, 2, 0])",
            "print(X @ v)",
            "print(int(X[0] @ v), int(X[1] @ v))",
            "print((X @ v).shape)",
          ].join("\n"),
          output: ["[ 5 14]", "5 14", "(2,)"].join("\n"),
        },
        {
          kind: "text",
          text: "Row 0 gives `1*1 + 2*2 + 3*0 = 5`, and row 1 gives `4*1 + 5*2 + 6*0 = 14`. They are the same numbers as the separate dot products.",
        },
      ],
    },
    {
      title: "Why it is useful",
      blocks: [
        {
          kind: "text",
          text: "Data often comes as a matrix where each row is one example, such as one student, and each column is one feature, such as one test score.",
        },
        {
          kind: "text",
          text: "A weight vector says how much each feature counts. `X @ w` then gives the weighted sum for every example at once, with no loop over rows.",
        },
      ],
    },
    {
      title: "The shape rule for matrix times vector",
      blocks: [
        {
          kind: "list",
          items: [
            "`X` has shape `(m, k)`: `m` rows of `k` values each.",
            "`v` must have shape `(k,)`, one value per column of `X`, so every row can be dotted with it.",
            "The result has shape `(m,)`: one number per row.",
          ],
        },
        {
          kind: "note",
          text: "If `X` has 3 columns and `v` has 2 values, `X @ v` raises a `ValueError`: the row length 3 and the vector length 2 do not match.",
        },
      ],
    },
    {
      title: "A practical example: final grades",
      blocks: [
        {
          kind: "text",
          text: "Three students took two tests. The first test counts for 40% of the grade and the second for 60%.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "scores = np.array([[80, 90], [60, 70], [100, 50]])",
            "w = np.array([0.4, 0.6])",
            "print(scores.shape, w.shape)",
            "print(scores @ w)",
          ].join("\n"),
          output: ["(3, 2) (2,)", "[86. 66. 70.]"].join("\n"),
        },
        {
          kind: "text",
          text: "Compare with `scores * w` from Module 0.1: it would weight each score but keep a `(3, 2)` array. `@` also adds each row up, giving one grade per student.",
        },
      ],
    },
    {
      title: "Try it: rows times a vector",
      blocks: [
        {
          kind: "text",
          text: "Change the number of rows and the vector, and watch each row produce one result. Pick the length-2 vector to see the size check fail.",
        },
        {
          kind: "playground",
          demo: {
            title: "Matrix times vector",
            controls: [
              { type: "number", name: "rows", label: "Rows of X", min: 1, max: 4, initial: 2 },
              {
                type: "select",
                name: "v",
                label: "Vector v",
                options: [
                  { label: "[1, 2, 0]", value: "np.array([1, 2, 0])" },
                  { label: "[1, 1, 1] (row sums)", value: "np.array([1, 1, 1])" },
                  { label: "[0, 0, 1] (last column)", value: "np.array([0, 0, 1])" },
                  { label: "[1, 1] (wrong length)", value: "np.array([1, 1])" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "X = np.arange(1, 3 * {{rows}} + 1).reshape(({{rows}}, 3))",
              "v = {{v}}",
              "y = X @ v",
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
            "A matrix is a 2D array of shape `(rows, columns)`.",
            "`X @ v` is the dot product of each row of `X` with `v`.",
            "`(m, k) @ (k,)` gives `(m,)`: the vector's length must equal the number of columns.",
            "With one example per row, `X @ w` gives a weighted sum for every example at once.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "matmul-02-q1",
      question: "`X` has shape `(4, 3)` and `v` has shape `(3,)`. What is the shape of `X @ v`?",
      options: ["(3,)", "(4, 3)", "(4,)", "(3, 4)"],
      answer: 2,
      explanation: "Each of the 4 rows gives one number.",
    },
    {
      id: "matmul-02-q2",
      question: "What is the first value of `X @ v` for `X = [[1, 2], [3, 4]]` and `v = [10, 1]`?",
      options: ["12", "13", "34"],
      answer: 0,
      explanation: "Row 0 dotted with `v`: `1*10 + 2*1 = 12`.",
    },
    {
      id: "matmul-02-q3",
      question: "`X` has shape `(5, 2)`. Which `v` works in `X @ v`?",
      options: ["A vector of length 5", "A vector of length 2", "A vector of any length"],
      answer: 1,
      explanation: "Each row has 2 values, so `v` needs one value per column.",
    },
    {
      id: "matmul-02-q4",
      question: "How does `X @ w` differ from `X * w` for a matrix `X` and a vector `w`?",
      options: [
        "They give the same result",
        "`X * w` adds each row up; `X @ w` does not",
        "`X @ w` multiplies and adds each row up; `X * w` only multiplies",
      ],
      answer: 2,
      explanation: "`*` is element-wise and keeps the shape of `X`; `@` sums each row into one number.",
    },
  ],
};
