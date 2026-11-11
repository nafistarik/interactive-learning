import type { Exercise } from "@/features/validation/types";

/** Shared setup for Exercise 35: sine data and a seeded 8-unit network (lesson 01). */
const LOOP_PRELUDE = [
  "import numpy as np",
  "rng = np.random.default_rng(0)",
  "x = np.linspace(-3, 3, 20).reshape(-1, 1)",
  "y = np.sin(x)",
  "x_plot = x.ravel()",
  "y_plot = y.ravel()",
  "n = len(x)",
  "W1 = rng.normal(0, 0.5, size=(1, 8))",
  "b1 = np.zeros(8)",
  "W2 = rng.normal(0, 0.5, size=(8, 1))",
  "b2 = np.zeros(1)",
  "lr = 0.1",
  "steps = 1000",
].join("\n");

/** Hidden setup for Exercise 35: another curve, seed, width, learning rate and length. */
const LOOP_HIDDEN = [
  "import numpy as np",
  "rng = np.random.default_rng(3)",
  "x = np.linspace(-2, 2, 15).reshape(-1, 1)",
  "y = x * x * x / 4 - x",
  "x_plot = x.ravel()",
  "y_plot = y.ravel()",
  "n = len(x)",
  "W1 = rng.normal(0, 0.5, size=(1, 4))",
  "b1 = np.zeros(4)",
  "W2 = rng.normal(0, 0.5, size=(4, 1))",
  "b2 = np.zeros(1)",
  "lr = 0.05",
  "steps = 400",
].join("\n");

const LOOP_FORWARD = [
  "losses = []",
  "",
  "for step in range(steps):",
  "    H = np.tanh(x @ W1 + b1)",
  "    out = H @ W2 + b2",
  "    pred = out.ravel()",
  "    err = out - y",
  "    loss = np.mean(err * err)",
  "    losses.append(loss)",
].join("\n");

const LOOP_TODO = [
  "    # Backward pass: dout, then dW2, db2, dH, dZ1, dW1 and db1.",
  "    # Update: move W1, b1, W2 and b2 against their gradients, scaled by lr.",
].join("\n");

const LOOP_BACKWARD = [
  "    dout = 2 * err / n",
  "    dW2 = H.T @ dout",
  "    db2 = dout.sum(axis=0)",
  "    dH = dout @ W2.T",
  "    dZ1 = dH * (1 - H * H)",
  "    dW1 = x.T @ dZ1",
  "    db1 = dZ1.sum(axis=0)",
  "    W1 -= lr * dW1",
  "    b1 -= lr * db1",
  "    W2 -= lr * dW2",
  "    b2 -= lr * db2",
].join("\n");

const LOOP_PRINT = "\nprint(round(float(losses[0]), 4), round(float(losses[-1]), 4))";

const LOOP_STARTER = `${LOOP_FORWARD}\n${LOOP_TODO}\n${LOOP_PRINT}`;
const LOOP_SOLUTION = `${LOOP_FORWARD}\n${LOOP_BACKWARD}\n${LOOP_PRINT}`;

/** Shared setup for Exercise 36: data, width, learning rate and steps; the start is the bug (lesson 02). */
const INIT_PRELUDE = [
  "import numpy as np",
  "rng = np.random.default_rng(0)",
  "x = np.linspace(-3, 3, 20).reshape(-1, 1)",
  "y = np.sin(x)",
  "x_plot = x.ravel()",
  "y_plot = y.ravel()",
  "n = len(x)",
  "hidden = 8",
  "lr = 0.1",
  "steps = 1000",
].join("\n");

/** Hidden setup for Exercise 36: a bump, another seed and length. */
const INIT_HIDDEN = [
  "import numpy as np",
  "rng = np.random.default_rng(5)",
  "x = np.linspace(-2.5, 2.5, 16).reshape(-1, 1)",
  "y = 2 * np.exp(-x * x) - 1",
  "x_plot = x.ravel()",
  "y_plot = y.ravel()",
  "n = len(x)",
  "hidden = 8",
  "lr = 0.1",
  "steps = 800",
].join("\n");

/** Exercise 36's code with the starting weights as placeholders: the bug is only there. */
const initCode = (w1: string, w2: string) =>
  [
    `W1 = ${w1}`,
    "b1 = np.zeros(hidden)",
    `W2 = ${w2}`,
    "b2 = np.zeros(1)",
    "losses = []",
    "",
    "for step in range(steps):",
    "    H = np.tanh(x @ W1 + b1)",
    "    out = H @ W2 + b2",
    "    pred = out.ravel()",
    "    err = out - y",
    "    loss = np.mean(err * err)",
    "    losses.append(loss)",
    "    dout = 2 * err / n",
    "    dW2 = H.T @ dout",
    "    db2 = dout.sum(axis=0)",
    "    dH = dout @ W2.T",
    "    dZ1 = dH * (1 - H * H)",
    "    dW1 = x.T @ dZ1",
    "    db1 = dZ1.sum(axis=0)",
    "    W1 -= lr * dW1",
    "    b1 -= lr * db1",
    "    W2 -= lr * dW2",
    "    b2 -= lr * db2",
    "",
    'print("last loss:", round(float(losses[-1]), 4))',
    'print("hidden weights:", W1.round(3))',
  ].join("\n");

const INIT_SOLUTION = initCode("rng.normal(0, 0.5, size=(1, hidden))", "rng.normal(0, 0.5, size=(hidden, 1))");

/** Shared setup for Exercise 37: only the data and a seeded generator (lesson 03). */
const CURVE_PRELUDE = [
  "import numpy as np",
  "rng = np.random.default_rng(0)",
  "x = np.linspace(-3, 3, 20).reshape(-1, 1)",
  "y = np.sin(x)",
  "x_plot = x.ravel()",
  "y_plot = y.ravel()",
  "n = len(x)",
].join("\n");

/** Hidden setup for Exercise 37: another curve and seed, so the same code must fit it too. */
const CURVE_HIDDEN = [
  "import numpy as np",
  "rng = np.random.default_rng(1)",
  "x = np.linspace(-3, 3, 20).reshape(-1, 1)",
  "y = np.cos(x)",
  "x_plot = x.ravel()",
  "y_plot = y.ravel()",
  "n = len(x)",
].join("\n");

const CURVE_STARTER = [
  "# A straight line: out = x @ w + b. Replace it with a network that has",
  "# a hidden layer of tanh units, and train that instead.",
  "w = np.zeros((1, 1))",
  "b = np.zeros(1)",
  "lr = 0.1",
  "losses = []",
  "",
  "for step in range(1000):",
  "    out = x @ w + b",
  "    pred = out.ravel()",
  "    err = out - y",
  "    losses.append(np.mean(err * err))",
  "    dout = 2 * err / n",
  "    w -= lr * (x.T @ dout)",
  "    b -= lr * dout.sum(axis=0)",
  "",
  "final_loss = losses[-1]",
  "print(round(float(final_loss), 4))",
].join("\n");

const CURVE_SOLUTION = [
  "hidden = 8",
  "W1 = rng.normal(0, 0.5, size=(1, hidden))",
  "b1 = np.zeros(hidden)",
  "W2 = rng.normal(0, 0.5, size=(hidden, 1))",
  "b2 = np.zeros(1)",
  "lr = 0.1",
  "losses = []",
  "",
  "for step in range(1000):",
  "    H = np.tanh(x @ W1 + b1)",
  "    out = H @ W2 + b2",
  "    pred = out.ravel()",
  "    err = out - y",
  "    losses.append(np.mean(err * err))",
  "    dout = 2 * err / n",
  "    dZ1 = (dout @ W2.T) * (1 - H * H)",
  "    W2 -= lr * (H.T @ dout)",
  "    b2 -= lr * dout.sum(axis=0)",
  "    W1 -= lr * (x.T @ dZ1)",
  "    b1 -= lr * dZ1.sum(axis=0)",
  "",
  "final_loss = losses[-1]",
  "print(round(float(final_loss), 4))",
].join("\n");

/** The loss bound of Exercise 37: the best line reaches 0.1965 on the sine points. */
const CURVE_BOUND = "0.02";

/** Exercises of Module 2.4 (R5 brief): two builds and one bug hunt. */
export const TRAINING_NETWORKS_EXERCISES: readonly Exercise[] = [
  {
    id: "ex35",
    lessonId: "01",
    title: "Complete the training step",
    objective: "Finish the training loop: compute every gradient with the backward pass, then update all four parameters.",
    problem:
      "The data x and y, a seeded network W1, b1, W2, b2, the learning rate lr and the number of steps are given above the editor. The loop already runs the forward pass and records the loss. Inside it, add the backward pass (dout, dW2, db2, dH, dZ1, dW1, db1) and the update of W1, b1, W2 and b2, so that the network fits the curve.",
    starterCode: LOOP_STARTER,
    prelude: LOOP_PRELUDE,
    hint: "dout = 2 * err / n, dW2 = H.T @ dout, db2 = dout.sum(axis=0), dH = dout @ W2.T, dZ1 = dH * (1 - H * H), dW1 = x.T @ dZ1, db1 = dZ1.sum(axis=0). Compute all of them first, then W1 -= lr * dW1 and the same for b1, W2 and b2.",
    chart: { kind: "fit", x: "x_plot", y: "y_plot", prediction: "pred" },
    runs: [
      { prelude: LOOP_PRELUDE, reference: `${LOOP_PRELUDE}\n${LOOP_SOLUTION}` },
      { prelude: LOOP_HIDDEN, reference: `${LOOP_HIDDEN}\n${LOOP_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "W1", expression: "W1", tolerance: 0.0001 },
      { kind: "result", name: "b1", expression: "b1", tolerance: 0.0001 },
      { kind: "result", name: "W2", expression: "W2", tolerance: 0.0001 },
      { kind: "result", name: "b2", expression: "b2", tolerance: 0.0001 },
      {
        kind: "assert",
        expression: "len(losses) == steps",
        message: "losses should hold one loss per step: keep losses.append(loss) inside the loop.",
      },
      {
        kind: "assert",
        expression: "losses[-1] < losses[0]",
        message: "The loss should go down: the last recorded loss must be below the first.",
      },
    ],
    solution: LOOP_SOLUTION,
  },
  {
    id: "ex36",
    lessonId: "02",
    type: "bug-hunt",
    title: "Bug hunt: the network does not learn",
    objective: "Fix the starting weights so that the hidden units learn different things and the loss gets small.",
    problem:
      "This network should fit the curve, but after all the steps its prediction is still flat and the printed hidden weights are all equal. The data, hidden, lr and steps are given above the editor, and the loop is correct. Find what stops the gradient and fix it.",
    starterCode: initCode("np.zeros((1, hidden))", "np.zeros((hidden, 1))"),
    prelude: INIT_PRELUDE,
    hint: "With every weight at zero, every hidden unit is the same and no gradient reaches the weights. Start W1 and W2 with small random values from the seeded generator, such as rng.normal(0, 0.5, size=(1, hidden)).",
    chart: { kind: "fit", x: "x_plot", y: "y_plot", prediction: "pred" },
    runs: [
      { prelude: INIT_PRELUDE, reference: `${INIT_PRELUDE}\n${INIT_SOLUTION}` },
      { prelude: INIT_HIDDEN, reference: `${INIT_HIDDEN}\n${INIT_SOLUTION}` },
    ],
    checks: [
      { kind: "unchanged", name: "hidden", expression: "hidden" },
      { kind: "unchanged", name: "lr", expression: "lr" },
      { kind: "unchanged", name: "steps", expression: "steps" },
      {
        kind: "assert",
        expression: "np.shape(W1) == (1, hidden) and float(np.max(W1) - np.min(W1)) > 0.01",
        message: "The hidden units are still identical: every entry of W1 has the same value. Start the weights with different random values.",
      },
      {
        kind: "assert",
        expression: "len(losses) == steps and losses[-1] < 0.03",
        message: "The last loss should be below 0.03: the network has not learned the curve yet.",
      },
    ],
    solution: INIT_SOLUTION,
  },
  {
    id: "ex37",
    lessonId: "03",
    title: "Bend the line into a curve",
    objective: "Replace a straight line with a 1-hidden-layer tanh network and train it until it fits the curve.",
    problem: `x, y, n and a seeded generator rng are given above the editor. The starter trains a straight line, which cannot follow the curve. Replace it with a network (W1, b1, W2, b2 with a tanh hidden layer, initialized from rng) and train it so that final_loss, the last recorded loss, is below ${CURVE_BOUND}. Keep pred as the network's predictions, one per point.`,
    starterCode: CURVE_STARTER,
    prelude: CURVE_PRELUDE,
    hint: "Use 8 hidden units started with rng.normal(0, 0.5, ...) and zero biases, lr = 0.1 and 1000 steps. In the loop: H = np.tanh(x @ W1 + b1), out = H @ W2 + b2, then the backward pass and the update from lesson 01.",
    chart: { kind: "fit", x: "x_plot", y: "y_plot", prediction: "pred" },
    runs: [
      { prelude: CURVE_PRELUDE, reference: `${CURVE_PRELUDE}\n${CURVE_SOLUTION}` },
      { prelude: CURVE_HIDDEN, reference: `${CURVE_HIDDEN}\n${CURVE_SOLUTION}` },
    ],
    checks: [
      {
        kind: "assert",
        expression: "np.shape(pred) == np.shape(y_plot)",
        message: "pred should hold one prediction per point as a 1D array: pred = out.ravel().",
      },
      {
        kind: "assert",
        expression: `final_loss < ${CURVE_BOUND}`,
        message: `final_loss should be below ${CURVE_BOUND}. A straight line cannot get there: train a network with a hidden layer of several tanh units.`,
      },
      {
        kind: "assert",
        expression: `np.mean((pred - y_plot) ** 2) < ${CURVE_BOUND}`,
        message: "pred should be the trained network's predictions for x, close to y.",
      },
    ],
    solution: CURVE_SOLUTION,
  },
];
