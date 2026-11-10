import type { Exercise } from "@/features/validation/types";

/** Setup for Exercise 14: exam scores from hours studied and hours slept (lesson 02). */
const PREDICT_PRELUDE = [
  "import numpy as np",
  "X = np.array([[2.0, 7.0], [4.0, 6.0], [6.0, 8.0], [8.0, 5.0]])",
  "w = np.array([5.0, 2.0])",
  "b = 30.0",
].join("\n");

/** Hidden setup for Exercise 14: 3 examples with 3 features, so a hard-coded answer fails. */
const PREDICT_HIDDEN = [
  "import numpy as np",
  "X = np.array([[1.0, 0.0, 2.0], [0.5, 4.0, 1.0], [2.0, 2.0, 2.0]])",
  "w = np.array([1.5, -1.0, 0.5])",
  "b = -2.0",
].join("\n");

/** Setup for Exercise 15: targets and predictions of some model (lesson 03). */
const MSE_PRELUDE = [
  "import numpy as np",
  "y = np.array([3.0, 5.0, 7.0, 9.0])",
  "y_hat = np.array([2.5, 5.0, 8.0, 8.5])",
].join("\n");

/** Hidden setup for Exercise 15: other values and length. */
const MSE_HIDDEN = [
  "import numpy as np",
  "y = np.array([1.0, -2.0, 0.5, 4.0, 3.0, 0.0])",
  "y_hat = np.array([1.5, -1.0, 0.5, 2.0, 3.5, -0.5])",
].join("\n");

/** Setup for Exercise 16: km walked after x hours; the line goes through 0, so b = 0 (lesson 04). */
const SEARCH_PRELUDE = [
  "import numpy as np",
  "x = np.array([0.5, 1.0, 1.5, 2.0, 2.5])",
  "y = np.array([2.4, 5.1, 7.4, 10.2, 12.4])",
  "b = 0.0",
  "candidates = np.linspace(3, 7, 41)",
].join("\n");

/** Hidden setup for Exercise 16: other data, a negative slope and other candidates. */
const SEARCH_HIDDEN = [
  "import numpy as np",
  "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0])",
  "y = np.array([-1.4, -3.1, -4.4, -6.2, -7.4, -9.1])",
  "b = 0.0",
  "candidates = np.linspace(-3, 1, 81)",
].join("\n");

/** Expected values for Exercise 16, computed without the learner's loop. */
const SEARCH_EXPECTED = [
  "losses = [np.mean((w * x + b - y) ** 2) for w in candidates]",
  "best_w = candidates[int(np.argmin(losses))]",
].join("\n");

const SEARCH_STARTER = [
  "losses = []",
  "best_w = None",
  "best_loss = None",
  "",
  "for w in candidates:",
  "    pred = w * x + b",
  "    # Compute loss, the mean squared error of pred against y, and append it to losses.",
  "    # When loss is lower than best_loss (or best_loss is still None), keep w in best_w.",
].join("\n");

/** Exercises of Module 1.1 (R3 brief): three builds. */
export const LINEAR_REGRESSION_EXERCISES: readonly Exercise[] = [
  {
    id: "ex14",
    lessonId: "02",
    title: "Predictions with X @ w + b",
    objective: "Compute the model's predictions y_hat = X @ w + b for every example at once.",
    problem:
      "X holds one example per row (hours studied, hours slept), w holds one weight per feature and b is the bias. Compute y_hat, the predicted exam score of every example.",
    starterCode: "# Compute y_hat: one prediction per row of X.\n",
    prelude: PREDICT_PRELUDE,
    hint: "X @ w gives the weighted sum of the features for every row. Then add b; it broadcasts to every prediction.",
    runs: [
      { prelude: PREDICT_PRELUDE, reference: PREDICT_PRELUDE },
      { prelude: PREDICT_HIDDEN, reference: PREDICT_HIDDEN },
    ],
    checks: [{ kind: "result", name: "y_hat", expression: "X @ w + b" }],
    solution: "y_hat = X @ w + b",
  },
  {
    id: "ex15",
    lessonId: "03",
    title: "Mean squared error",
    objective: "Compute the mean squared error of the predictions y_hat against the targets y.",
    problem:
      "y holds the targets and y_hat a model's predictions. Compute mse, the mean of the squared residuals y_hat - y, without a Python loop.",
    starterCode: "# Compute mse: the mean of the squared residuals.\n",
    prelude: MSE_PRELUDE,
    hint: "First the residuals y_hat - y, then square them with ** 2, then np.mean. It fits in one line.",
    runs: [
      { prelude: MSE_PRELUDE, reference: MSE_PRELUDE },
      { prelude: MSE_HIDDEN, reference: MSE_HIDDEN },
    ],
    checks: [{ kind: "no-loop" }, { kind: "result", name: "mse", expression: "np.mean((y_hat - y) ** 2)" }],
    solution: "mse = np.mean((y_hat - y) ** 2)",
  },
  {
    id: "ex16",
    lessonId: "04",
    title: "Practical application: fit a line by search",
    objective: "Try every candidate w, record its loss in losses, and keep the one with the lowest loss in best_w.",
    problem:
      "x holds hours walked and y the km covered. The model is pred = w * x + b with b = 0. Loop over candidates: compute pred and its mean squared error loss, append the loss to losses, and keep the w with the lowest loss in best_w.",
    starterCode: SEARCH_STARTER,
    prelude: SEARCH_PRELUDE,
    hint: "Inside the loop: loss = np.mean((pred - y) ** 2), then losses.append(loss). Compare loss with best_loss, and when it is lower, set best_loss = loss and best_w = w.",
    chart: { kind: "fit", x: "x", y: "y", prediction: "pred" },
    runs: [
      { prelude: SEARCH_PRELUDE, reference: `${SEARCH_PRELUDE}\n${SEARCH_EXPECTED}` },
      { prelude: SEARCH_HIDDEN, reference: `${SEARCH_HIDDEN}\n${SEARCH_EXPECTED}` },
    ],
    checks: [
      { kind: "result", name: "losses", expression: "losses" },
      { kind: "result", name: "best_w", expression: "best_w", tolerance: 1e-6 },
    ],
    solution: [
      "losses = []",
      "best_w = None",
      "best_loss = None",
      "",
      "for w in candidates:",
      "    pred = w * x + b",
      "    loss = np.mean((pred - y) ** 2)",
      "    losses.append(loss)",
      "    if best_loss is None or loss < best_loss:",
      "        best_loss = loss",
      "        best_w = w",
    ].join("\n"),
  },
];
