import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "With several features, a linear model gives each feature its own weight. `X @ w + b` then predicts every example in one line.",
  estimatedMinutes: 14,
  sections: [
    {
      title: "What a model with several features is",
      blocks: [
        {
          kind: "text",
          text: "Real predictions use more than one input. A taxi fare depends on the distance and also on the minutes spent waiting in traffic.",
        },
        {
          kind: "text",
          text: "A linear model with several features multiplies each feature by its own weight, adds the results up, and adds the bias. For two features: `y_hat = w[0] * x[0] + w[1] * x[1] + b`.",
        },
        {
          kind: "note",
          text: "The weighted sum of the features is the dot product `x @ w` from Module 0.2. So one prediction is `x @ w + b`.",
        },
      ],
    },
    {
      title: "Why X @ w + b is the standard form",
      blocks: [
        {
          kind: "text",
          text: "Data with many examples is stored as a matrix `X`: one row per example, one column per feature. Its shape is `(n, d)`, for `n` examples and `d` features.",
        },
        {
          kind: "text",
          text: "`X @ w` takes the dot product of every row with `w`, so `X @ w + b` predicts all `n` examples at once, with no loop. The same line works for 2 features or 200.",
        },
      ],
    },
    {
      title: "The shapes: (n, d) @ (d,) + b gives (n,)",
      blocks: [
        {
          kind: "list",
          items: [
            "`X` has shape `(n, d)`: `n` examples with `d` features each.",
            "`w` has shape `(d,)`: one weight per feature, so per column of `X`.",
            "`b` is one number; broadcasting adds it to every prediction.",
            "`y_hat = X @ w + b` has shape `(n,)`: one prediction per example, the same shape as the targets `y`.",
          ],
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1.0, 2.0], [2.0, 0.0], [3.0, 5.0], [4.0, 1.0]])",
            "w = np.array([2.5, 0.5])",
            "b = 3.0",
            "print(X.shape, w.shape)",
            "y_hat = X @ w + b",
            "print(y_hat)",
            "print(y_hat.shape)",
          ].join("\n"),
          output: ["(4, 2) (2,)", "[ 6.5  8.  13.  13.5]", "(4,)"].join("\n"),
        },
        {
          kind: "note",
          text: "If `w` has 3 values while `X` has 2 columns, `X @ w` raises a `ValueError`: every feature needs exactly one weight.",
        },
      ],
    },
    {
      title: "A practical example: fares from distance and waiting time",
      blocks: [
        {
          kind: "text",
          text: "Each row of `X` above is one ride: distance in km, then minutes waiting. The weights say 2.5 per km and 0.5 per minute, on top of a base fare of 3.0.",
        },
        {
          kind: "text",
          text: "One row gives one prediction. Ride 2 is 3 km with 5 minutes waiting, and the formula by hand gives the same number as `X @ w + b`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1.0, 2.0], [2.0, 0.0], [3.0, 5.0], [4.0, 1.0]])",
            "w = np.array([2.5, 0.5])",
            "b = 3.0",
            "print(X[2] @ w + b)",
            "print(2.5 * 3.0 + 0.5 * 5.0 + 3.0)",
          ].join("\n"),
          output: ["13.0", "13.0"].join("\n"),
        },
        {
          kind: "text",
          text: "The one-feature line from Lesson 01 is the case `d = 1`: a one-column `X` and a one-value `w` give the same predictions as `w * x + b`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])",
            "X = x.reshape(5, 1)",
            "w = np.array([2.5])",
            "print((X @ w + 3.0).tolist())",
            "print((2.5 * x + 3.0).tolist())",
          ].join("\n"),
          output: ["[5.5, 8.0, 10.5, 13.0, 15.5]", "[5.5, 8.0, 10.5, 13.0, 15.5]"].join("\n"),
        },
      ],
    },
    {
      title: "Try it: weights for each feature",
      blocks: [
        {
          kind: "text",
          text: "Pick a weight vector and a bias, and watch each row become one prediction. Pick the three-weight vector to see the shape check fail.",
        },
        {
          kind: "playground",
          demo: {
            title: "Predictions X @ w + b",
            controls: [
              {
                type: "select",
                name: "w",
                label: "Weights w",
                options: [
                  { label: "[2.5, 0.5]", value: "np.array([2.5, 0.5])" },
                  { label: "[1.0, 0.0] (distance only)", value: "np.array([1.0, 0.0])" },
                  { label: "[0.0, 1.0] (waiting only)", value: "np.array([0.0, 1.0])" },
                  { label: "[2.5, 0.5, 1.0] (wrong length)", value: "np.array([2.5, 0.5, 1.0])" },
                ],
              },
              { type: "number", name: "b", label: "Bias b", min: 0, max: 5, initial: 3 },
            ],
            template: [
              "import numpy as np",
              "X = np.array([[1.0, 2.0], [2.0, 0.0], [3.0, 5.0], [4.0, 1.0]])",
              "w = {{w}}",
              "b = {{b}}",
              "y_hat = X @ w + b",
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
            "With several features, each feature gets its own weight; one prediction is `x @ w + b`.",
            "Stack the examples as rows of `X`, shape `(n, d)`, to predict them all with `X @ w + b`.",
            "`(n, d) @ (d,) + b` gives `(n,)`: one prediction per example.",
            "`w` needs exactly one weight per column of `X`, or `@` raises a `ValueError`.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "linear-regression-02-q1",
      question: "`X` has shape `(100, 3)` and `w` has shape `(3,)`. What is the shape of `X @ w + b`?",
      options: ["(3,)", "(100, 3)", "(100,)", "(3, 100)"],
      answer: 2,
      explanation: "One prediction per example: 100 rows give 100 values.",
    },
    {
      id: "linear-regression-02-q2",
      question: "In `X @ w + b`, what does one row of `X` hold?",
      options: [
        "The features of one example",
        "One feature for every example",
        "The weights of the model",
      ],
      answer: 0,
      explanation: "Rows are examples and columns are features.",
    },
    {
      id: "linear-regression-02-q3",
      question: "What is `X @ w + b` for `X = [[1, 2]]`, `w = [3, 1]` and `b = 4`?",
      options: ["[9]", "[10]", "[7]"],
      answer: 0,
      explanation: "`1*3 + 2*1 + 4 = 9`.",
    },
    {
      id: "linear-regression-02-q4",
      question: "`X` has 4 columns. How many values must `w` have?",
      options: ["One per row of `X`", "4", "Any number"],
      answer: 1,
      explanation: "Each feature, so each column, needs its own weight.",
    },
  ],
};
