import type { Exercise } from "@/features/validation/types";

/** Shared setup for Exercise 17: data and a line that is too flat (lesson 02). */
const GRADIENT_PRELUDE = [
  "import numpy as np",
  "x = np.array([1.0, 2.0, 3.0, 4.0])",
  "y = np.array([3.0, 5.0, 7.0, 9.0])",
  "w = 0.5",
  "b = 0.0",
].join("\n");

/** Hidden setup for Exercise 17: other values and length, so a hard-coded answer fails. */
const GRADIENT_HIDDEN = [
  "import numpy as np",
  "x = np.array([0.5, -1.0, 2.0, 1.5, 3.0])",
  "y = np.array([1.0, -2.5, 4.0, 2.0, 6.5])",
  "w = 1.5",
  "b = 0.5",
].join("\n");

const GRADIENT_SOLUTION = [
  "y_hat = w * x + b",
  "error = y_hat - y",
  "dw = np.mean(2 * error * x)",
  "db = np.mean(2 * error)",
].join("\n");

/** Shared setup for Exercise 18: data, learning rate and number of steps (lesson 03). */
const TRAIN_PRELUDE = [
  "import numpy as np",
  "x = np.array([0.5, 1.0, 1.5, 2.0, 2.5, 3.0])",
  "y = np.array([0.7, 1.9, 3.3, 5.1, 6.6, 7.9])",
  "lr = 0.1",
  "steps = 300",
].join("\n");

/** Hidden setup for Exercise 18: other data, learning rate and steps. */
const TRAIN_HIDDEN = [
  "import numpy as np",
  "x = np.array([1.0, 2.0, 3.0, 4.0])",
  "y = np.array([1.5, 2.1, 2.4, 3.1])",
  "lr = 0.05",
  "steps = 600",
].join("\n");

/** The training loop of lesson 03, run after a prelude: the reference of Exercise 18. */
const TRAIN_LOOP = [
  "w = 0.0",
  "b = 0.0",
  "losses = []",
  "for step in range(steps):",
  "    pred = w * x + b",
  "    error = pred - y",
  "    loss = np.mean(error * error)",
  "    losses.append(loss)",
  "    dw = np.mean(2 * error * x)",
  "    db = np.mean(2 * error)",
  "    w -= lr * dw",
  "    b -= lr * db",
].join("\n");

const TRAIN_STARTER = [
  "w = 0.0",
  "b = 0.0",
  "losses = []",
  "",
  "for step in range(steps):",
  "    pred = w * x + b",
  "    error = pred - y",
  "    loss = np.mean(error * error)",
  "    # Record the loss of this step in losses.",
  "    # Compute dw and db, the gradient of the loss.",
  "    # Move w and b one step against the gradient, scaled by lr.",
  "",
  "print(w, b)",
].join("\n");

/** Shared setup for Exercise 19: centred data and a fixed number of steps (lesson 04). */
const DIVERGE_PRELUDE = [
  "import numpy as np",
  "x = np.array([-2.0, -1.0, 0.0, 1.0, 2.0])",
  "y = np.array([1.1, 2.3, 4.0, 5.7, 6.9])",
  "steps = 100",
].join("\n");

/** Hidden setup for Exercise 19: other data. */
const DIVERGE_HIDDEN = [
  "import numpy as np",
  "x = np.array([-1.5, -0.5, 0.5, 1.5])",
  "y = np.array([3.2, 2.1, 0.8, -0.2])",
  "steps = 100",
].join("\n");

/** Exercise 19's loop with a learning rate placeholder: the bug is only in lr. */
const divergeLoop = (lr: string) =>
  [
    "w = 0.0",
    "b = 0.0",
    `lr = ${lr}`,
    "losses = []",
    "",
    "for step in range(steps):",
    "    pred = w * x + b",
    "    error = pred - y",
    "    losses.append(np.mean(error * error))",
    "    dw = np.mean(2 * error * x)",
    "    db = np.mean(2 * error)",
    "    w -= lr * dw",
    "    b -= lr * db",
    "",
    'print("first loss:", round(float(losses[0]), 3))',
    'print("last loss:", float(losses[-1]))',
  ].join("\n");

/** Converged reference for Exercise 19: a safe learning rate and many more steps. */
const DIVERGE_REFERENCE = [
  "w = 0.0",
  "b = 0.0",
  "for step in range(1000):",
  "    error = w * x + b - y",
  "    w -= 0.1 * np.mean(2 * error * x)",
  "    b -= 0.1 * np.mean(2 * error)",
].join("\n");

/** Exercises of Module 1.2 (R3 brief): two builds and one bug hunt. */
export const GRADIENT_DESCENT_EXERCISES: readonly Exercise[] = [
  {
    id: "ex17",
    lessonId: "02",
    title: "The gradient of the loss",
    objective: "Compute dw and db, the slopes of the MSE loss for w and b, without a loop.",
    problem:
      "x, y, w and b are given above the editor. The model is y_hat = w * x + b and the loss is the mean squared error. Compute dw, the slope of the loss for w, and db, the slope for b, with array operations.",
    starterCode: [
      "# Compute the predictions and their errors, then the gradient:",
      "# dw = mean of 2 * error * x, db = mean of 2 * error",
      "",
    ].join("\n"),
    prelude: GRADIENT_PRELUDE,
    hint: "First error = w * x + b - y. Then dw = np.mean(2 * error * x) and db = np.mean(2 * error).",
    runs: [
      { prelude: GRADIENT_PRELUDE, reference: `${GRADIENT_PRELUDE}\n${GRADIENT_SOLUTION}` },
      { prelude: GRADIENT_HIDDEN, reference: `${GRADIENT_HIDDEN}\n${GRADIENT_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "dw", expression: "dw" },
      { kind: "result", name: "db", expression: "db" },
      { kind: "no-loop" },
    ],
    solution: GRADIENT_SOLUTION,
  },
  {
    id: "ex18",
    lessonId: "03",
    title: "Complete the training loop",
    objective: "Finish the loop so that it records the loss and moves w and b down the gradient at every step.",
    problem:
      "x, y, the learning rate lr and the number of steps are given above the editor. The loop already predicts and measures the loss. Inside it, append loss to losses, compute dw and db, and update w and b with lr, so that w and b end near the best line.",
    starterCode: TRAIN_STARTER,
    prelude: TRAIN_PRELUDE,
    hint: "Inside the loop: losses.append(loss), dw = np.mean(2 * error * x), db = np.mean(2 * error), then w -= lr * dw and b -= lr * db.",
    chart: { kind: "fit", x: "x", y: "y", prediction: "pred" },
    runs: [
      { prelude: TRAIN_PRELUDE, reference: `${TRAIN_PRELUDE}\n${TRAIN_LOOP}` },
      { prelude: TRAIN_HIDDEN, reference: `${TRAIN_HIDDEN}\n${TRAIN_LOOP}` },
    ],
    checks: [
      { kind: "result", name: "w", expression: "w", tolerance: 0.001 },
      { kind: "result", name: "b", expression: "b", tolerance: 0.001 },
      { kind: "result", name: "pred", expression: "pred", tolerance: 0.01 },
      {
        kind: "assert",
        expression: "len(losses) == steps",
        message: "losses should hold one loss per step: append loss inside the loop.",
      },
      {
        kind: "assert",
        expression: "losses[-1] < losses[0]",
        message: "The loss should go down: the last recorded loss must be below the first.",
      },
    ],
    solution: TRAIN_STARTER.replace(
      [
        "    # Record the loss of this step in losses.",
        "    # Compute dw and db, the gradient of the loss.",
        "    # Move w and b one step against the gradient, scaled by lr.",
      ].join("\n"),
      [
        "    losses.append(loss)",
        "    dw = np.mean(2 * error * x)",
        "    db = np.mean(2 * error)",
        "    w -= lr * dw",
        "    b -= lr * db",
      ].join("\n"),
    ),
  },
  {
    id: "ex19",
    lessonId: "04",
    type: "bug-hunt",
    title: "Bug hunt: the loss explodes",
    objective: "Fix the training loop so that the loss goes down and w and b converge to the best line.",
    problem:
      "This loop should fit a line to x and y in the given number of steps, but the printed last loss is huge: training diverges. The gradient and the update are correct. Find the setting that makes every step overshoot and fix it.",
    starterCode: divergeLoop("0.6"),
    prelude: DIVERGE_PRELUDE,
    hint: "The learning rate is too large, so every step jumps past the bottom. Try a value about ten times smaller, such as 0.05 or 0.1.",
    chart: { kind: "fit", x: "x", y: "y", prediction: "pred" },
    runs: [
      { prelude: DIVERGE_PRELUDE, reference: `${DIVERGE_PRELUDE}\n${DIVERGE_REFERENCE}` },
      { prelude: DIVERGE_HIDDEN, reference: `${DIVERGE_HIDDEN}\n${DIVERGE_REFERENCE}` },
    ],
    checks: [
      { kind: "result", name: "w", expression: "w", tolerance: 0.01 },
      { kind: "result", name: "b", expression: "b", tolerance: 0.01 },
      {
        kind: "assert",
        expression: "losses[-1] < 0.05",
        message: "The last loss should be small (below 0.05): training has not converged yet.",
      },
    ],
    solution: divergeLoop("0.1"),
  },
];
