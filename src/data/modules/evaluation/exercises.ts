import type { Exercise } from "@/features/validation/types";

/** Setup for Exercise 23: 8 examples with 2 features, a fixed shuffled order (lesson 01). */
const SPLIT_PRELUDE = [
  "import numpy as np",
  "X = np.array([[1, 10], [2, 20], [3, 30], [4, 40], [5, 50], [6, 60], [7, 70], [8, 80]])",
  "y = np.array([0, 0, 0, 0, 1, 1, 1, 1])",
  "order = np.array([5, 2, 7, 0, 3, 6, 1, 4])",
  "n_train = 6",
].join("\n");

/** Hidden setup for Exercise 23: 10 examples with 3 features and another split size. */
const SPLIT_HIDDEN = [
  "import numpy as np",
  "X = np.arange(30).reshape(10, 3)",
  "y = np.array([1, 0, 1, 1, 0, 0, 1, 0, 1, 0])",
  "order = np.array([9, 3, 0, 6, 2, 8, 5, 1, 7, 4])",
  "n_train = 7",
].join("\n");

/** Setup for Exercise 24: 12 true labels and predictions (lesson 02). */
const COUNTS_PRELUDE = [
  "import numpy as np",
  "y = np.array([1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0])",
  "pred = np.array([1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0])",
].join("\n");

/** Hidden setup for Exercise 24: imbalanced labels of another length. */
const COUNTS_HIDDEN = [
  "import numpy as np",
  "y = np.array([0, 0, 0, 1, 0, 0, 0, 0])",
  "pred = np.array([0, 1, 0, 1, 0, 0, 0, 1])",
].join("\n");

/** Setup for Exercise 25: the lesson 04 data, a learning rate and a step count. */
const FIT_PRELUDE = [
  "import numpy as np",
  "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0])",
  "y = np.array([3.1, 4.9, 7.2, 8.8, 11.1, 13.0, 14.8, 17.1])",
  "lr = 0.02",
  "steps = 3000",
].join("\n");

/** Hidden setup for Exercise 25: a falling line on 7 other points. */
const FIT_HIDDEN = [
  "import numpy as np",
  "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0])",
  "y = np.array([10.2, 8.9, 7.1, 6.2, 3.8, 3.1, 0.9])",
  "lr = 0.02",
  "steps = 3000",
].join("\n");

/** Reference for Exercise 25: scikit-learn's exact least-squares fit on the same data. */
const SKLEARN_FIT = [
  "from sklearn.linear_model import LinearRegression",
  "model = LinearRegression().fit(x.reshape(-1, 1), y)",
].join("\n");

/** Exercises of Module 1.4 (R3 brief): three builds. */
export const EVALUATION_EXERCISES: readonly Exercise[] = [
  {
    id: "ex23",
    lessonId: "01",
    title: "Split into train and test",
    objective: "Split X and y into a training set and a test set, following a given order.",
    problem:
      "X, y, order and n_train are given above the editor. The first n_train indices of order are the training rows, the rest are the test rows. Create X_train, X_test, y_train and y_test, and keep X and y as they are.",
    starterCode: "# Use order and n_train to create X_train, X_test, y_train and y_test.\n",
    prelude: SPLIT_PRELUDE,
    hint: "order[:n_train] holds the indices of the training rows and order[n_train:] those of the test rows. Index X and y with the same indices.",
    runs: [
      { prelude: SPLIT_PRELUDE, reference: SPLIT_PRELUDE },
      { prelude: SPLIT_HIDDEN, reference: SPLIT_HIDDEN },
    ],
    checks: [
      { kind: "result", name: "X_train", expression: "X[order[:n_train]]" },
      { kind: "result", name: "X_test", expression: "X[order[n_train:]]" },
      { kind: "result", name: "y_train", expression: "y[order[:n_train]]" },
      { kind: "result", name: "y_test", expression: "y[order[n_train:]]" },
      { kind: "unchanged", name: "X", expression: "X" },
      { kind: "unchanged", name: "y", expression: "y" },
    ],
    solution: [
      "train_idx = order[:n_train]",
      "test_idx = order[n_train:]",
      "X_train, X_test = X[train_idx], X[test_idx]",
      "y_train, y_test = y[train_idx], y[test_idx]",
    ].join("\n"),
  },
  {
    id: "ex24",
    lessonId: "02",
    title: "Accuracy and the four counts",
    objective: "Compute the accuracy and the confusion matrix counts tp, fp, tn and fn, without a loop.",
    problem:
      "y holds the true labels and pred the model's predictions, both 0 or 1. Compute accuracy, the share of right predictions, and the counts tp, fp, tn and fn with boolean masks.",
    starterCode: [
      "# accuracy: the share of predictions equal to y",
      "# tp: predicted 1, truly 1    fp: predicted 1, truly 0",
      "# tn: predicted 0, truly 0    fn: predicted 0, truly 1",
      "",
    ].join("\n"),
    prelude: COUNTS_PRELUDE,
    hint: "np.mean(pred == y) is the accuracy. For a count, combine two comparisons with & and sum the mask: np.sum((pred == 1) & (y == 1)).",
    runs: [
      { prelude: COUNTS_PRELUDE, reference: COUNTS_PRELUDE },
      { prelude: COUNTS_HIDDEN, reference: COUNTS_HIDDEN },
    ],
    checks: [
      { kind: "no-loop" },
      { kind: "result", name: "accuracy", expression: "float(np.mean(pred == y))" },
      { kind: "result", name: "tp", expression: "int(np.sum((pred == 1) & (y == 1)))" },
      { kind: "result", name: "fp", expression: "int(np.sum((pred == 1) & (y == 0)))" },
      { kind: "result", name: "tn", expression: "int(np.sum((pred == 0) & (y == 0)))" },
      { kind: "result", name: "fn", expression: "int(np.sum((pred == 0) & (y == 1)))" },
      { kind: "unchanged", name: "pred", expression: "pred" },
      { kind: "unchanged", name: "y", expression: "y" },
    ],
    solution: [
      "accuracy = np.mean(pred == y)",
      "tp = np.sum((pred == 1) & (y == 1))",
      "fp = np.sum((pred == 1) & (y == 0))",
      "tn = np.sum((pred == 0) & (y == 0))",
      "fn = np.sum((pred == 0) & (y == 1))",
    ].join("\n"),
  },
  {
    id: "ex25",
    lessonId: "04",
    title: "Practical application: match scikit-learn",
    objective: "Train w and b with gradient descent so they match LinearRegression on the same data.",
    problem:
      "x, y, lr and steps are given above the editor. Starting from w = 0 and b = 0, run steps gradient descent updates of the model y_hat = w * x + b on the mean squared error, with learning rate lr. Your w and b must match scikit-learn's LinearRegression within 0.001.",
    starterCode: [
      "w = 0.0",
      "b = 0.0",
      "",
      "# Repeat steps times: compute y_hat = w * x + b, then update w and b with the MSE gradients.",
      "",
    ].join("\n"),
    prelude: FIT_PRELUDE,
    hint: "Inside a for loop over range(steps): y_hat = w * x + b, then w -= lr * 2 * np.mean((y_hat - y) * x) and b -= lr * 2 * np.mean(y_hat - y).",
    chart: { kind: "fit", x: "x", y: "y", prediction: "y_hat" },
    runs: [
      { prelude: FIT_PRELUDE, reference: `${FIT_PRELUDE}\n${SKLEARN_FIT}` },
      { prelude: FIT_HIDDEN, reference: `${FIT_HIDDEN}\n${SKLEARN_FIT}` },
    ],
    checks: [
      { kind: "result", name: "w", expression: "float(model.coef_[0])", tolerance: 0.001 },
      { kind: "result", name: "b", expression: "float(model.intercept_)", tolerance: 0.001 },
      { kind: "unchanged", name: "x", expression: "x" },
      { kind: "unchanged", name: "y", expression: "y" },
    ],
    solution: [
      "w = 0.0",
      "b = 0.0",
      "for step in range(steps):",
      "    y_hat = w * x + b",
      "    w -= lr * 2 * np.mean((y_hat - y) * x)",
      "    b -= lr * 2 * np.mean(y_hat - y)",
    ].join("\n"),
  },
];
