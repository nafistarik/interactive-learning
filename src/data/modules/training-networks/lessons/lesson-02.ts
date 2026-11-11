import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "Where the weights start decides whether the hidden units can learn different things. Start them small, random and seeded, then pick a learning rate the way you did in Phase 1.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What initialization is",
      blocks: [
        {
          kind: "text",
          text: "Initialization is the choice of starting values for the parameters before the first step. Training only moves them from there, so a bad start can stop a network from ever learning.",
        },
        {
          kind: "note",
          text: "`rng = np.random.default_rng(0)` makes a random generator with the seed `0`. The same seed gives the same numbers on every run, so a training result can be repeated exactly.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "rng = np.random.default_rng(0)",
            "print(rng.normal(0, 0.5, size=(1, 4)).round(3))",
            "rng = np.random.default_rng(0)",
            "print(rng.normal(0, 0.5, size=(1, 4)).round(3))",
            "print(rng.normal(0, 0.5, size=(1, 4)).round(3))",
          ].join("\n"),
          output: ["[[ 0.063 -0.066  0.32   0.052]]", "[[ 0.063 -0.066  0.32   0.052]]", "[[-0.268  0.181  0.652  0.474]]"].join(
            "\n",
          ),
        },
        {
          kind: "text",
          text: "`rng.normal(0, 0.5, size=...)` draws values around `0` with a spread of `0.5`. Re-creating the generator repeats the draws; drawing again from the same one gives new values.",
        },
      ],
    },
    {
      title: "Why not start every weight at zero",
      blocks: [
        {
          kind: "text",
          text: "If every weight is `0`, every hidden unit outputs `0` and `dW2 = H.T @ dout` is `0`; `dH = dout @ W2.T` is `0` too. No gradient reaches any weight, so nothing but `b2` can move.",
        },
        {
          kind: "text",
          text: "If every weight starts at the same non-zero value, the hidden units compute the same thing and get the same gradient. They stay copies of each other forever, so 4 units act like 1. This is called the symmetry problem.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.linspace(-3, 3, 20).reshape(-1, 1)",
            "y = np.sin(x)",
            "n = len(x)",
            "",
            "def train(W1, W2, lr=0.1, steps=1000):",
            "    b1 = np.zeros(W1.shape[1])",
            "    b2 = np.zeros(1)",
            "    for step in range(steps):",
            "        H = np.tanh(x @ W1 + b1)",
            "        out = H @ W2 + b2",
            "        err = out - y",
            "        dout = 2 * err / n",
            "        dZ1 = (dout @ W2.T) * (1 - H * H)",
            "        W2 = W2 - lr * (H.T @ dout)",
            "        b2 = b2 - lr * dout.sum(axis=0)",
            "        W1 = W1 - lr * (x.T @ dZ1)",
            "        b1 = b1 - lr * dZ1.sum(axis=0)",
            "    return W1, round(float(np.mean(err * err)), 4)",
            "",
            "W1, loss = train(np.zeros((1, 4)), np.zeros((4, 1)))",
            'print("zeros:", W1, loss)',
            "W1, loss = train(np.full((1, 4), 0.5), np.full((4, 1), 0.5))",
            'print("all 0.5:", W1.round(3), loss)',
            "rng = np.random.default_rng(0)",
            "W1, loss = train(rng.normal(0, 0.5, size=(1, 4)), rng.normal(0, 0.5, size=(4, 1)))",
            'print("random:", W1.round(3), loss)',
          ].join("\n"),
          output: [
            "zeros: [[0. 0. 0. 0.]] 0.4974",
            "all 0.5: [[1.488 1.488 1.488 1.488]] 0.0662",
            "random: [[ 0.217 -0.217  0.963 -0.217]] 0.0136",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "After 1000 steps the zero start has not moved at all. The `0.5` start learned, but its four weights are still equal. Only the random start lets the units take different weights, and it reaches the lowest loss.",
        },
      ],
    },
    {
      title: "Small and different",
      blocks: [
        {
          kind: "list",
          items: [
            "Different: random values break the symmetry, so each unit gets its own gradient and learns its own bend.",
            "Small: `tanh` is flat for large inputs, and its slope `1 - H * H` is then close to `0`, so a unit that starts saturated learns slowly.",
            "Seeded: a fixed seed makes the start, and so the whole run, repeatable.",
          ],
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "z = np.array([0.5, 2.0, 5.0])",
            "H = np.tanh(z)",
            "print(H.round(4).tolist())",
            "print((1 - H * H).round(4).tolist())",
          ].join("\n"),
          output: ["[0.4621, 0.964, 0.9999]", "[0.7864, 0.0707, 0.0002]"].join("\n"),
        },
        {
          kind: "text",
          text: "At `z = 5` the slope is `0.0002`: almost no gradient passes through that unit. Starting weights around `0.5` keep `x @ W1 + b1` in the range where `tanh` still bends.",
        },
      ],
    },
    {
      title: "The learning rate, again",
      blocks: [
        {
          kind: "text",
          text: "The learning rate behaves as in Phase 1: too small and the loss falls slowly, too large and the steps overshoot. Here the same network trains with three rates; the losses are after 100, 300 and 1000 steps.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.linspace(-3, 3, 20).reshape(-1, 1)",
            "y = np.sin(x)",
            "n = len(x)",
            "",
            "def losses_for(lr, steps=1000):",
            "    rng = np.random.default_rng(0)",
            "    W1 = rng.normal(0, 0.5, size=(1, 8))",
            "    b1 = np.zeros(8)",
            "    W2 = rng.normal(0, 0.5, size=(8, 1))",
            "    b2 = np.zeros(1)",
            "    losses = []",
            "    for step in range(steps):",
            "        H = np.tanh(x @ W1 + b1)",
            "        out = H @ W2 + b2",
            "        err = out - y",
            "        losses.append(float(np.mean(err * err)))",
            "        dout = 2 * err / n",
            "        dZ1 = (dout @ W2.T) * (1 - H * H)",
            "        W2 -= lr * (H.T @ dout)",
            "        b2 -= lr * dout.sum(axis=0)",
            "        W1 -= lr * (x.T @ dZ1)",
            "        b1 -= lr * dZ1.sum(axis=0)",
            "    return [round(losses[i], 4) for i in [100, 300, 999]]",
            "",
            "for lr in [0.01, 0.1, 0.3]:",
            "    print(lr, losses_for(lr))",
          ].join("\n"),
          output: ["0.01 [0.1007, 0.0508, 0.0251]", "0.1 [0.0248, 0.0155, 0.0079]", "0.3 [0.0194, 0.038, 0.0556]"].join("\n"),
        },
        {
          kind: "text",
          text: "`0.01` is still improving after 1000 steps. `0.3` is fastest at first, then the loss climbs back up because its steps are too large. `0.1` ends lowest.",
        },
        {
          kind: "note",
          text: "Each output adds up one term per hidden unit, so a wider layer takes bigger steps with the same `lr`. A rate that works for 8 units can blow up for 32.",
        },
      ],
    },
    {
      title: "Try it: starting weights and learning rate",
      blocks: [
        {
          kind: "text",
          text: "Pick how `W1` and `W2` start and a learning rate, then scrub through the training. With zeros the prediction stays flat; with `0.5` everywhere it stays one S-shape, like a single unit; with `lr = 0.5` the loss blows up.",
        },
        {
          kind: "playground",
          demo: {
            title: "Initialization and learning rate",
            controls: [
              {
                type: "select",
                name: "init",
                label: "Starting weights",
                options: [
                  { label: "small random", value: "rng.normal(0, 0.5, size=(1, 8))" },
                  { label: "all zero", value: "np.zeros((1, 8))" },
                  { label: "all 0.5", value: "np.full((1, 8), 0.5)" },
                ],
              },
              {
                type: "select",
                name: "lr",
                label: "Learning rate",
                options: [
                  { label: "0.1", value: "0.1" },
                  { label: "0.01 (small)", value: "0.01" },
                  { label: "0.5 (too large)", value: "0.5" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "rng = np.random.default_rng(0)",
              "x = np.linspace(-3, 3, 20).reshape(-1, 1)",
              "y = np.sin(x)",
              "x_plot = x.ravel()",
              "y_plot = y.ravel()",
              "n = len(x)",
              "W1 = {{init}}",
              "W2 = {{init}}.reshape(8, 1)",
              "b1 = np.zeros(8)",
              "b2 = np.zeros(1)",
              "lr = {{lr}}",
              "for step in range(600):",
              "    H = np.tanh(x @ W1 + b1)",
              "    out = H @ W2 + b2",
              "    pred = out.ravel()",
              "    err = out - y",
              "    loss = np.mean(err * err)",
              "    dout = 2 * err / n",
              "    dW2 = H.T @ dout",
              "    db2 = dout.sum(axis=0)",
              "    dZ1 = (dout @ W2.T) * (1 - H * H)",
              "    dW1 = x.T @ dZ1",
              "    db1 = dZ1.sum(axis=0)",
              "    W1 -= lr * dW1",
              "    b1 -= lr * db1",
              "    W2 -= lr * dW2",
              "    b2 -= lr * db2",
            ].join("\n"),
            chart: { kind: "fit", x: "x_plot", y: "y_plot", prediction: "pred" },
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
            "Initialization sets the parameters before the first step.",
            "All-zero weights pass no gradient to the weights; equal weights keep the hidden units identical (symmetry).",
            "Start weights small and random, from a seeded `np.random.default_rng(0)`, so runs repeat exactly.",
            "Large inputs saturate `tanh`, and its slope `1 - H * H` then almost stops learning.",
            "Pick `lr` from the loss curve: too small crawls, too large overshoots or blows up.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "training-networks-02-q1",
      question: "Every weight of the network starts at `0`. What happens during training?",
      options: [
        "The hidden units learn different bends",
        "No gradient reaches the weights, so the prediction stays flat",
        "The loss becomes `nan`",
        "Training works but is slower",
      ],
      answer: 1,
      explanation: "With `H = 0` and `W2 = 0`, both `dW2 = H.T @ dout` and `dH = dout @ W2.T` are zero; only `b2` can move.",
    },
    {
      id: "training-networks-02-q2",
      question: "Every weight starts at `0.5`. Why does a network with 8 hidden units fit like one with 1?",
      options: [
        "Equal units get equal gradients, so they stay copies of each other",
        "`0.5` is too large for `tanh`",
        "The biases are zero",
      ],
      answer: 0,
      explanation: "Nothing tells the units apart, so every update moves them the same way: the symmetry is never broken.",
    },
    {
      id: "training-networks-02-q3",
      question: "Why use `np.random.default_rng(0)` instead of an unseeded generator?",
      options: [
        "Seeded numbers are smaller",
        "It makes the network train faster",
        "The same seed gives the same starting weights, so the run can be repeated",
      ],
      answer: 2,
      explanation: "A seeded generator draws the same numbers every time, so the whole training is deterministic.",
    },
    {
      id: "training-networks-02-q4",
      question: "The loss falls for a while, then climbs back up and keeps bouncing. What do you try first?",
      options: ["A larger learning rate", "A smaller learning rate", "More hidden units", "Starting weights at zero"],
      answer: 1,
      explanation: "A loss that overshoots and rises again is the sign of steps that are too large.",
    },
  ],
};
