import type { Exercise } from "@/features/validation/types";

/** Shared setup for Exercise 29: a batch for one tanh neuron (lesson 02). */
const NEURON_PRELUDE = [
  "import numpy as np",
  "X = np.array([[1.0, 2.0], [0.5, -1.0], [-1.5, 0.5], [2.0, 0.0]])",
  "y = np.array([1.0, 0.0, -0.5, 0.5])",
  "w = np.array([0.3, -0.2])",
  "b = 0.1",
].join("\n");

/** Hidden setup for Exercise 29: other values, batch size and number of features. */
const NEURON_HIDDEN = [
  "import numpy as np",
  "X = np.array([[0.5, 1.0, -1.0], [1.5, -0.5, 0.0], [-1.0, 2.0, 0.5], [0.0, 0.5, 1.5], [1.0, 1.0, -0.5]])",
  "y = np.array([0.5, -1.0, 0.8, 0.2, 0.0])",
  "w = np.array([-0.4, 0.6, 0.25])",
  "b = -0.2",
].join("\n");

/** The backward pass of one tanh neuron with MSE over a batch. */
const NEURON_SOLUTION = [
  "n = len(y)",
  "pred = np.tanh(X @ w + b)",
  "dpred = 2 * (pred - y) / n",
  "dz = dpred * (1 - pred * pred)",
  "dw = X.T @ dz",
  "db = dz.sum()",
].join("\n");

/** Exercise 30's gradient check; `dpred` is the line with the bug. */
const gradientCheck = (dpred: string) =>
  [
    "def loss(w, b):",
    "    pred = np.tanh(X @ w + b)",
    "    return np.mean((pred - y) ** 2)",
    "",
    "# Analytic gradient (the backward pass)",
    "n = len(y)",
    "pred = np.tanh(X @ w + b)",
    `dpred = ${dpred}`,
    "dz = dpred * (1 - pred * pred)",
    "dw = X.T @ dz",
    "db = dz.sum()",
    "",
    "# Numeric gradient (central differences), one parameter at a time",
    "h = 1e-5",
    "num_dw = np.zeros_like(w)",
    "for i in range(len(w)):",
    "    w_plus = w.copy()",
    "    w_plus[i] += h",
    "    w_minus = w.copy()",
    "    w_minus[i] -= h",
    "    num_dw[i] = (loss(w_plus, b) - loss(w_minus, b)) / (2 * h)",
    "num_db = (loss(w, b + h) - loss(w, b - h)) / (2 * h)",
    "",
    "analytic = np.append(dw, db)",
    "numeric = np.append(num_dw, num_db)",
    "rel_error = np.linalg.norm(analytic - numeric) / (np.linalg.norm(analytic) + np.linalg.norm(numeric))",
    'print("analytic:", np.round(analytic, 4))',
    'print("numeric: ", np.round(numeric, 4))',
    'print("relative error:", rel_error)',
  ].join("\n");

/** Shared setup for Exercise 31: one dense layer with ReLU and its upstream gradient (lesson 04). */
const LAYER_PRELUDE = [
  "import numpy as np",
  "X = np.array([[1.0, -2.0, 0.5], [0.0, 1.0, -1.0], [2.0, 0.5, 1.5], [-1.0, -0.5, 2.0]])",
  "W = np.array([[0.5, -0.3], [0.2, 0.8], [-0.6, 0.1]])",
  "b = np.array([0.1, -0.2])",
  "dA = np.array([[1.0, -0.5], [0.5, 2.0], [-1.0, 1.0], [0.25, -0.75]])",
].join("\n");

/** Hidden setup for Exercise 31: other shapes, (3, 2) inputs into 4 units. */
const LAYER_HIDDEN = [
  "import numpy as np",
  "X = np.array([[0.5, -1.0], [1.5, 2.0], [-2.0, 0.5]])",
  "W = np.array([[1.0, -0.5, 0.3, -0.8], [0.4, 0.6, -1.2, 0.2]])",
  "b = np.array([0.05, -0.1, 0.2, 0.3])",
  "dA = np.array([[0.5, 1.0, -1.5, 2.0], [-0.25, 0.75, 1.0, -1.0], [1.5, -2.0, 0.5, 0.5]])",
].join("\n");

const LAYER_SOLUTION = [
  "Z = X @ W + b",
  "A = np.maximum(0, Z)",
  "dZ = dA * (Z > 0)",
  "dW = X.T @ dZ",
  "db = dZ.sum(axis=0)",
  "dX = dZ @ W.T",
].join("\n");

/** Exercises of Module 2.2 (R5 brief): two builds and one bug hunt. */
export const BACKPROPAGATION_EXERCISES: readonly Exercise[] = [
  {
    id: "ex29",
    lessonId: "02",
    title: "Gradients of one neuron",
    objective: "Compute dw and db for a tanh neuron with the MSE loss over a batch, by the chain rule and without a loop.",
    problem:
      "X (one example per row), y, w and b are given above the editor. The neuron predicts pred = np.tanh(X @ w + b) and the loss is np.mean((pred - y) ** 2). Compute dw, the slope of the loss for w (shape of w), and db, the slope for b (a single number).",
    starterCode: [
      "pred = np.tanh(X @ w + b)",
      "loss = np.mean((pred - y) ** 2)",
      "",
      "# Backward pass, one chain-rule step per line:",
      "# dpred: slope of the loss for each prediction (the mean divides by n)",
      "# dz: times the local gradient of tanh, 1 - pred * pred",
      "# dw and db: z = X @ w + b, so dw sums dz times each row of X; db sums dz",
      "",
    ].join("\n"),
    prelude: NEURON_PRELUDE,
    hint: "dpred = 2 * (pred - y) / len(y), then dz = dpred * (1 - pred * pred), dw = X.T @ dz and db = dz.sum().",
    runs: [
      { prelude: NEURON_PRELUDE, reference: `${NEURON_PRELUDE}\n${NEURON_SOLUTION}` },
      { prelude: NEURON_HIDDEN, reference: `${NEURON_HIDDEN}\n${NEURON_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "dw", expression: "dw", tolerance: 1e-6 },
      { kind: "result", name: "db", expression: "db", tolerance: 1e-6 },
      { kind: "no-loop" },
    ],
    solution: NEURON_SOLUTION,
  },
  {
    id: "ex30",
    lessonId: "03",
    type: "bug-hunt",
    title: "Bug hunt: the gradient check fails",
    objective: "Fix the backward pass so that the analytic gradient matches the numeric one.",
    problem:
      "This script computes the gradient of a tanh neuron's MSE loss by the chain rule, then checks it with central differences. The relative error is large, so the analytic gradient is wrong. The loss and the numeric gradient are correct: find the bug in the backward pass and fix it so that rel_error drops below 1e-6.",
    starterCode: gradientCheck("2 * (pred - y)"),
    prelude: NEURON_PRELUDE,
    hint: "Divide each analytic value by the numeric one: they are all off by the same factor, the number of examples. Which step of the loss divides by n?",
    runs: [
      { prelude: NEURON_PRELUDE, reference: `${NEURON_PRELUDE}\n${NEURON_SOLUTION}` },
      { prelude: NEURON_HIDDEN, reference: `${NEURON_HIDDEN}\n${NEURON_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "dw", expression: "dw", tolerance: 1e-6 },
      { kind: "result", name: "db", expression: "db", tolerance: 1e-6 },
      {
        kind: "assert",
        expression: "rel_error < 1e-6",
        message: "The relative error should be below 1e-6: the analytic gradient still differs from the numeric one.",
      },
    ],
    solution: gradientCheck("2 * (pred - y) / n"),
  },
  {
    id: "ex31",
    lessonId: "04",
    title: "Backward through a dense layer and ReLU",
    objective: "Compute dZ, dW, db and dX for A = np.maximum(0, X @ W + b), given the upstream gradient dA.",
    problem:
      "X, W, b and dA are given above the editor; dA is the slope of the loss for A, with the shape of A. The forward pass is Z = X @ W + b, then A = np.maximum(0, Z). Compute dZ through ReLU, then dW, db and dX through the layer. Each gradient must have the shape of its value.",
    starterCode: [
      "Z = X @ W + b",
      "A = np.maximum(0, Z)",
      "",
      "# Backward pass:",
      "# dZ: through ReLU (slope 1 where Z > 0, 0 elsewhere)",
      "# dW, db, dX: through Z = X @ W + b",
      "",
    ].join("\n"),
    prelude: LAYER_PRELUDE,
    hint: "dZ = dA * (Z > 0), dW = X.T @ dZ, db = dZ.sum(axis=0) and dX = dZ @ W.T. Check each shape against W, b and X.",
    runs: [
      { prelude: LAYER_PRELUDE, reference: `${LAYER_PRELUDE}\n${LAYER_SOLUTION}` },
      { prelude: LAYER_HIDDEN, reference: `${LAYER_HIDDEN}\n${LAYER_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "dZ", expression: "dZ", tolerance: 1e-6 },
      { kind: "result", name: "dW", expression: "dW", tolerance: 1e-6 },
      { kind: "result", name: "db", expression: "db", tolerance: 1e-6 },
      { kind: "result", name: "dX", expression: "dX", tolerance: 1e-6 },
      { kind: "no-loop" },
    ],
    solution: LAYER_SOLUTION,
  },
];
