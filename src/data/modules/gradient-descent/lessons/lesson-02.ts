import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "For mean squared error the slopes have a short formula: `dw = np.mean(2 * (y_hat - y) * x)` and `db = np.mean(2 * (y_hat - y))`. Compute both for all points at once, and check them against the numeric slope.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What the gradient formula is",
      blocks: [
        {
          kind: "text",
          text: "For the model `y_hat = w * x + b` and the MSE loss, the slope for `w` is `np.mean(2 * (y_hat - y) * x)` and the slope for `b` is `np.mean(2 * (y_hat - y))`.",
        },
        {
          kind: "note",
          text: "We call these slopes `dw` and `db`: the change in the loss per unit change of `w`, and of `b`. Together, `(dw, db)` is the gradient of the loss.",
        },
      ],
    },
    {
      title: "Why use a formula instead of nudging",
      blocks: [
        {
          kind: "text",
          text: "The numeric slope needs two loss computations per parameter. A model with a thousand weights would need two thousand passes over the data for one gradient.",
        },
        {
          kind: "text",
          text: "The formula gives every slope from one pass: compute the errors once, then one mean per parameter. It is also exact, with no `h` to choose.",
        },
      ],
    },
    {
      title: "Where the formula comes from",
      blocks: [
        {
          kind: "text",
          text: "Take one point with error `e = y_hat - y`; its loss is `e * e`. Nudge `w` by a small `h`: the prediction moves by `h * x`, so the error becomes `e + h * x`.",
        },
        {
          kind: "text",
          text: "The squared error becomes `e*e + 2*e*h*x + (h*x)*(h*x)`. For a tiny `h` the last term is negligible, so the loss grew by about `2 * e * h * x`, and per unit of `h` that is `2 * e * x`.",
        },
        {
          kind: "text",
          text: "The MSE is the mean over all points, so its slope is the mean of `2 * e * x`. Nudging `b` moves every prediction by `h` instead of `h * x`, so its slope is the mean of `2 * e`.",
        },
        {
          kind: "list",
          items: [
            "A point whose prediction is too high (`e > 0`) pushes the slope up: lowering the parameter would help it.",
            "Points with a large `x` count more in `dw`, because changing `w` moves their prediction more.",
            "Every point counts the same in `db`, because changing `b` moves every prediction by the same amount.",
          ],
        },
      ],
    },
    {
      title: "Computing dw and db for all points at once",
      blocks: [
        {
          kind: "text",
          text: "With arrays, the formula is one line per parameter and no loop. Here `w = 1` and `b = 1`, the same point as in the last lesson.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
            "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
            "w, b = 1.0, 1.0",
            "",
            "y_hat = w * x + b",
            "error = y_hat - y",
            "dw = np.mean(2 * error * x)",
            "db = np.mean(2 * error)",
            "print(np.round(error, 3))",
            "print(round(float(dw), 3), round(float(db), 3))",
          ].join("\n"),
          output: ["[-0.1 -0.8 -2.  -3.2 -3.9]", "-12.0 -4.0"].join("\n"),
        },
        {
          kind: "text",
          text: "Every prediction is too low, so both slopes are negative: both `w` and `b` should grow. These are the values the numeric slopes gave in lesson 01.",
        },
        {
          kind: "text",
          text: "Checking a formula against the numeric slope is a habit worth keeping: if the two disagree, the formula or the code has a bug.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
            "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
            "w, b, h = 1.0, 1.0, 0.001",
            "",
            "def loss(w, b):",
            "    error = w * x + b - y",
            "    return np.mean(error ** 2)",
            "",
            "error = w * x + b - y",
            "dw = np.mean(2 * error * x)",
            "numeric = (loss(w + h, b) - loss(w - h, b)) / (2 * h)",
            "print(round(float(dw), 6), round(float(numeric), 6))",
            "print(bool(np.isclose(dw, numeric)))",
          ].join("\n"),
          output: ["-12.0 -12.0", "True"].join("\n"),
        },
      ],
    },
    {
      title: "Many features: X.T @ (2 * error) / n",
      blocks: [
        {
          kind: "text",
          text: "With several features, `X` has shape `(n, d)` and `w` has shape `(d,)`. Each weight gets the same formula with its own column: `np.mean(2 * error * X[:, j])`.",
        },
        {
          kind: "text",
          text: "All `d` of those means at once are `X.T @ (2 * error) / n`: row `j` of `X.T` is column `j` of `X`, and the dot product sums `2 * error` times that column.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[0.0, 1.0], [1.0, 0.0], [2.0, 1.0], [3.0, 0.0], [4.0, 1.0]])",
            "y = np.array([2.0, 3.0, 6.0, 7.0, 10.0])",
            "w = np.array([1.0, 1.0])",
            "b = 0.0",
            "n = len(y)",
            "",
            "error = X @ w + b - y",
            "dw = X.T @ (2 * error) / n",
            "db = np.mean(2 * error)",
            "print(dw.shape)",
            "print(np.round(dw, 3), round(float(db), 3))",
            "print(np.round(np.mean(2 * error * X[:, 0]), 3))",
          ].join("\n"),
          output: ["(2,)", "[-16.   -3.6] -6.0", "-16.0"].join("\n"),
        },
        {
          kind: "text",
          text: "`dw` has the shape of `w`, one slope per weight, and its first value matches the one-column formula. `db` stays a single number because `b` is one number.",
        },
      ],
    },
    {
      title: "Try it: the gradient at different lines",
      blocks: [
        {
          kind: "text",
          text: "Pick a value of `w` and follow the steps from errors to `dw`. Compare the sign of `dw` for a line that is too flat, the best line and a line that is too steep.",
        },
        {
          kind: "playground",
          demo: {
            title: "From errors to dw",
            controls: [
              {
                type: "select",
                name: "w",
                label: "w",
                options: [
                  { label: "1.0 (too flat)", value: "1.0" },
                  { label: "2.0 (best)", value: "2.0" },
                  { label: "3.0 (too steep)", value: "3.0" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
              "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
              "w = {{w}}",
              "b = 1.0",
              "y_hat = w * x + b",
              "error = y_hat - y",
              "db = np.mean(2 * error)",
              "dw = np.mean(2 * error * x)",
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
            "For MSE with `y_hat = w * x + b`: `dw = np.mean(2 * (y_hat - y) * x)` and `db = np.mean(2 * (y_hat - y))`.",
            "Both come from one pass over the data, with array operations and no loop.",
            "Check a gradient formula against the numeric slope; they should agree.",
            "With a feature matrix, `dw = X.T @ (2 * error) / n` has one slope per weight.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "gradient-descent-02-q1",
      question: "`error = y_hat - y`. Which line computes the slope of the MSE for `b`?",
      options: [
        "`db = np.mean(2 * error * x)`",
        "`db = np.mean(2 * error)`",
        "`db = np.mean(error * error)`",
      ],
      answer: 1,
      explanation: "Changing `b` moves every prediction by the same amount, so its slope is the mean of `2 * error`.",
    },
    {
      id: "gradient-descent-02-q2",
      question: "Every prediction is above its target. What are the signs of `dw` and `db` when all `x` are positive?",
      options: ["Both negative", "`dw` negative, `db` positive", "Both 0", "Both positive"],
      answer: 3,
      explanation: "Every error is positive, and so is every `x`, so both means are positive: lower `w` and `b`.",
    },
    {
      id: "gradient-descent-02-q3",
      question: "`X` has shape `(100, 3)`. What is the shape of `X.T @ (2 * error) / 100`?",
      options: ["`(3,)`", "`(100,)`", "`(100, 3)`", "`()`"],
      answer: 0,
      explanation: "`(3, 100) @ (100,)` gives `(3,)`: one slope per weight.",
    },
  ],
};
