import type { Exercise } from "@/features/validation/types";

/** Visible setup for Exercise 20: scores of six examples, one of them exactly 0 (lesson 02). */
const SCORES_PRELUDE = ["import numpy as np", "z = np.array([-3.0, -1.0, 0.0, 0.5, 2.0, 4.0])"].join("\n");

/** Hidden setup for Exercise 20: other scores and a (3, 2) shape, so a hard-coded answer fails. */
const SCORES_HIDDEN = ["import numpy as np", "z = np.array([[-2.0, 0.0], [1.5, -0.5], [3.0, -4.0]])"].join("\n");

/** Visible setup for Exercise 21: labels and the model's probabilities (lesson 03). */
const LOSS_PRELUDE = [
  "import numpy as np",
  "y = np.array([1, 0, 1, 1, 0])",
  "p = np.array([0.9, 0.2, 0.7, 0.6, 0.1])",
].join("\n");

/** Hidden setup for Exercise 21: other labels and probabilities. */
const LOSS_HIDDEN = [
  "import numpy as np",
  "y = np.array([0, 1, 0, 1, 1, 0])",
  "p = np.array([0.3, 0.8, 0.4, 0.95, 0.55, 0.05])",
].join("\n");

/** Starter code of Exercise 21: the second term takes the log of 1 - y instead of 1 - p. */
const LOSS_STARTER = [
  "# Log loss of the probabilities p for the labels y.",
  "loss = -np.mean(y * np.log(p) + (1 - y) * np.log(1 - y))",
  "print(loss)",
].join("\n");

/** Visible setup for Exercise 22: hours studied and pass (1) or fail (0), lesson 04. */
const TRAIN_PRELUDE = [
  "import numpy as np",
  "x = np.array([0.5, 1.0, 1.5, 2.0, 3.0, 3.5, 4.0, 4.5])",
  "y = np.array([0, 0, 0, 0, 1, 1, 1, 1])",
  "lr = 1.0",
  "steps = 100",
].join("\n");

/** Hidden setup for Exercise 22: other data that overlaps (no line separates it), lr and steps. */
const TRAIN_HIDDEN = [
  "import numpy as np",
  "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0])",
  "y = np.array([0, 0, 0, 1, 0, 1, 1])",
  "lr = 0.5",
  "steps = 300",
].join("\n");

/** A reference training loop for Exercise 22, run after a setup. */
const TRAIN_REFERENCE = [
  "w = 0.0",
  "b = 0.0",
  "losses = []",
  "for step in range(steps):",
  "    p = 1 / (1 + np.exp(-(w * x + b)))",
  "    losses.append(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)))",
  "    w -= lr * np.mean((p - y) * x)",
  "    b -= lr * np.mean(p - y)",
].join("\n");

/** Starter code of Exercise 22: the loop runs, but every line that learns is a placeholder. */
const TRAIN_STARTER = [
  "w = 0.0",
  "b = 0.0",
  "losses = []",
  "for step in range(steps):",
  "    z = w * x + b",
  "    p = z  # replace with the sigmoid of z",
  "    loss = 0.0  # replace with the log loss of p",
  "    losses.append(loss)",
  "    dw = 0.0  # replace with the gradient for w",
  "    db = 0.0  # replace with the gradient for b",
  "    w -= lr * dw",
  "    b -= lr * db",
].join("\n");

/** Exercises of Module 1.3 (R3 brief): one build, one bug hunt, one build. */
export const LOGISTIC_REGRESSION_EXERCISES: readonly Exercise[] = [
  {
    id: "ex20",
    lessonId: "02",
    title: "Probabilities and labels",
    objective: "Turn scores into probabilities p with the sigmoid, then into predicted labels with a 0.5 threshold.",
    problem:
      "The scores z are given above the editor. Compute p, the sigmoid of every score. Then compute pred_labels: 1 where p >= 0.5, else 0. Use NumPy operations on the whole array, without a loop.",
    starterCode: "# Compute p from z, then pred_labels from p.\n",
    prelude: SCORES_PRELUDE,
    hint: "The sigmoid is 1 / (1 + np.exp(-z)). For the labels, compare p with 0.5 and turn the booleans into integers with .astype(int).",
    runs: [
      { prelude: SCORES_PRELUDE, reference: SCORES_PRELUDE },
      { prelude: SCORES_HIDDEN, reference: SCORES_HIDDEN },
    ],
    checks: [
      { kind: "no-loop" },
      { kind: "result", name: "p", expression: "1 / (1 + np.exp(-z))" },
      { kind: "result", name: "pred_labels", expression: "(1 / (1 + np.exp(-z)) >= 0.5).astype(int)" },
      { kind: "unchanged", name: "z", expression: "z" },
    ],
    solution: "p = 1 / (1 + np.exp(-z))\npred_labels = (p >= 0.5).astype(int)",
  },
  {
    id: "ex21",
    lessonId: "03",
    type: "bug-hunt",
    title: "Bug hunt: a log loss of nan",
    objective: "Fix the log loss so that loss is the binary cross-entropy of p for the labels y.",
    problem:
      "y holds the labels and p the model's probabilities, given above the editor. The code should compute their log loss, but it prints nan. Find the bug and fix it; keep y and p as they are.",
    starterCode: LOSS_STARTER,
    prelude: LOSS_PRELUDE,
    hint: "Read each term: the first takes the log of the probability of yes. The second should take the log of the probability of no. Is that what it computes?",
    runs: [
      { prelude: LOSS_PRELUDE, reference: LOSS_PRELUDE },
      { prelude: LOSS_HIDDEN, reference: LOSS_HIDDEN },
    ],
    checks: [
      {
        kind: "result",
        name: "loss",
        expression: "-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))",
        tolerance: 1e-6,
      },
      { kind: "unchanged", name: "y", expression: "y" },
      { kind: "unchanged", name: "p", expression: "p" },
    ],
    solution: LOSS_STARTER.replace("np.log(1 - y))", "np.log(1 - p))"),
  },
  {
    id: "ex22",
    lessonId: "04",
    title: "Practical application: train a classifier",
    objective: "Complete the training loop so that w and b learn to separate the labels, with p holding the probabilities.",
    problem:
      "x, y (labels 0 and 1), lr and steps are given above the editor. In each iteration, set p to the sigmoid of z, loss to the log loss of p, and dw and db to its gradients. The loop appends every loss to losses; the check expects the last loss to be smaller than the first.",
    starterCode: TRAIN_STARTER,
    prelude: TRAIN_PRELUDE,
    hint: "p = 1 / (1 + np.exp(-z)). The loss is -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)). With one feature, dw = np.mean((p - y) * x) and db = np.mean(p - y).",
    chart: { kind: "fit", x: "x", y: "y", prediction: "p" },
    runs: [
      { prelude: TRAIN_PRELUDE, reference: `${TRAIN_PRELUDE}\n${TRAIN_REFERENCE}` },
      { prelude: TRAIN_HIDDEN, reference: `${TRAIN_HIDDEN}\n${TRAIN_REFERENCE}` },
    ],
    checks: [
      { kind: "result", name: "w", expression: "w", tolerance: 0.01 },
      { kind: "result", name: "b", expression: "b", tolerance: 0.01 },
      { kind: "result", name: "p", expression: "p", tolerance: 0.01 },
      {
        kind: "assert",
        expression: "losses[-1] < losses[0]",
        message: "The loss did not go down: losses[-1] should be smaller than losses[0]. Check the loss and the gradients.",
      },
      { kind: "unchanged", name: "x", expression: "x" },
      { kind: "unchanged", name: "y", expression: "y" },
    ],
    solution: TRAIN_STARTER.replace("p = z  # replace with the sigmoid of z", "p = 1 / (1 + np.exp(-z))")
      .replace("loss = 0.0  # replace with the log loss of p", "loss = -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))")
      .replace("dw = 0.0  # replace with the gradient for w", "dw = np.mean((p - y) * x)")
      .replace("db = 0.0  # replace with the gradient for b", "db = np.mean(p - y)"),
  },
];
