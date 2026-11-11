import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "A straight line cannot follow a sine curve, however long it trains. A hidden layer of `tanh` units can: each unit adds one S-shaped bend, and training places the bends.",
  estimatedMinutes: 18,
  sections: [
    {
      title: "What a non-linear curve is",
      blocks: [
        {
          kind: "text",
          text: "A line `w * x + b` has the same slope everywhere. A non-linear curve, like `y = np.sin(x)`, rises, turns and falls: its slope changes along `x`.",
        },
        {
          kind: "text",
          text: "The best line through 20 points of the sine curve on `[-3, 3]` still misses most of them. Train one with the Phase 1 loop and measure its loss.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.linspace(-3, 3, 20).reshape(-1, 1)",
            "y = np.sin(x)",
            "w, b = 0.0, 0.0",
            "for step in range(500):",
            "    err = w * x + b - y",
            "    w -= 0.1 * np.mean(2 * err * x)",
            "    b -= 0.1 * np.mean(2 * err)",
            "err = w * x + b - y",
            "print(round(float(w), 3), round(float(b), 3))",
            "print(round(float(np.mean(err * err)), 4))",
          ].join("\n"),
          output: ["0.301 0.0", "0.1965"].join("\n"),
        },
        {
          kind: "text",
          text: "`0.1965` is the lowest loss any line reaches on these points. More steps cannot help: the model itself is too simple.",
        },
      ],
    },
    {
      title: "Why a hidden layer can bend",
      blocks: [
        {
          kind: "text",
          text: "A hidden unit is one column of `W1` and `b1`. It computes `tanh(w * x + b)`, an S-shaped step: `w` sets how steep it is and `b` where along `x` it happens.",
        },
        {
          kind: "text",
          text: "The output `H @ W2 + b2` adds the units up, each scaled by its weight in `W2`. Two steps in opposite directions make a bump; more units make more bends.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([[-2.0], [-1.0], [0.0], [1.0], [2.0]])",
            "W1 = np.array([[2.0, 2.0]])",
            "b1 = np.array([2.0, -2.0])",
            "H = np.tanh(x @ W1 + b1)",
            "print(H.round(2))",
            "W2 = np.array([[1.0], [-1.0]])",
            "print((H @ W2).ravel().round(2))",
          ].join("\n"),
          output: ["[[-0.96 -1.  ]", " [ 0.   -1.  ]", " [ 0.96 -0.96]", " [ 1.    0.  ]", " [ 1.    0.96]]", "[0.04 1.   1.93 1.   0.04]"].join(
            "\n",
          ),
        },
        {
          kind: "text",
          text: "The first unit steps up near `x = -1`, the second near `x = 1`. Subtracting the second from the first gives a bump. Training finds such weights by itself.",
        },
      ],
    },
    {
      title: "More hidden units, more bends",
      blocks: [
        {
          kind: "note",
          text: "The number of hidden units is the number of columns of `W1`. It is a choice you make before training, like the learning rate.",
        },
        {
          kind: "text",
          text: "Train the network of lesson 01 on the sine points with 1, 2, 4 and 8 hidden units, each for 1000 steps with `lr = 0.1`, and compare the final losses with the line's `0.1965`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.linspace(-3, 3, 20).reshape(-1, 1)",
            "y = np.sin(x)",
            "n = len(x)",
            "",
            "def train(hidden, lr=0.1, steps=1000):",
            "    rng = np.random.default_rng(0)",
            "    W1 = rng.normal(0, 0.5, size=(1, hidden))",
            "    b1 = np.zeros(hidden)",
            "    W2 = rng.normal(0, 0.5, size=(hidden, 1))",
            "    b2 = np.zeros(1)",
            "    for step in range(steps):",
            "        H = np.tanh(x @ W1 + b1)",
            "        out = H @ W2 + b2",
            "        err = out - y",
            "        dout = 2 * err / n",
            "        dZ1 = (dout @ W2.T) * (1 - H * H)",
            "        W2 -= lr * (H.T @ dout)",
            "        b2 -= lr * dout.sum(axis=0)",
            "        W1 -= lr * (x.T @ dZ1)",
            "        b1 -= lr * dZ1.sum(axis=0)",
            "    return round(float(np.mean(err * err)), 4)",
            "",
            "for hidden in [1, 2, 4, 8]:",
            "    print(hidden, train(hidden))",
          ].join("\n"),
          output: ["1 0.0637", "2 0.0239", "4 0.0136", "8 0.0079"].join("\n"),
        },
        {
          kind: "text",
          text: "One unit already beats the line, because one S-shape follows the sine better than a straight line. Each extra unit adds a bend and lowers the loss further.",
        },
      ],
    },
    {
      title: "Try it: fit a curve",
      blocks: [
        {
          kind: "text",
          text: "Choose a curve and a number of hidden units, then scrub through the training to watch the prediction bend into shape. Try 1 unit on the bump: a single S-shape cannot go up and come back down.",
        },
        {
          kind: "playground",
          demo: {
            title: "Fitting a curve with hidden units",
            controls: [
              {
                type: "select",
                name: "curve",
                label: "Curve",
                options: [
                  { label: "sine", value: "np.sin(x)" },
                  { label: "bump", value: "np.exp(-x * x)" },
                  { label: "V shape", value: "np.abs(x) - 1" },
                ],
              },
              { type: "number", name: "hidden", label: "Hidden units", min: 1, max: 16, initial: 8 },
            ],
            template: [
              "import numpy as np",
              "rng = np.random.default_rng(0)",
              "x = np.linspace(-3, 3, 20).reshape(-1, 1)",
              "y = {{curve}}",
              "x_plot = x.ravel()",
              "y_plot = y.ravel()",
              "n = len(x)",
              "W1 = rng.normal(0, 0.5, size=(1, {{hidden}}))",
              "b1 = np.zeros({{hidden}})",
              "W2 = rng.normal(0, 0.5, size=({{hidden}}, 1))",
              "b2 = np.zeros(1)",
              "lr = 0.1",
              "for step in range(1000):",
              "    H = np.tanh(x @ W1 + b1)",
              "    out = H @ W2 + b2",
              "    pred = out.ravel()",
              "    err = out - y",
              "    loss = np.mean(err * err)",
              "    dout = 2 * err / n",
              "    dZ1 = (dout @ W2.T) * (1 - H * H)",
              "    W2 -= lr * (H.T @ dout)",
              "    b2 -= lr * dout.sum(axis=0)",
              "    W1 -= lr * (x.T @ dZ1)",
              "    b1 -= lr * dZ1.sum(axis=0)",
            ].join("\n"),
            chart: { kind: "fit", x: "x_plot", y: "y_plot", prediction: "pred" },
          },
        },
        {
          kind: "note",
          text: "With few units, the loss on the bump or the V shape can stay flat for hundreds of steps, sometimes for all 1000 (try 4 units on the V shape). With zero biases every unit starts centred at `x = 0`, and these curves are symmetric around `x = 0`, so the biases get little or no push to move the bends apart.",
        },
      ],
    },
    {
      title: "Recap",
      blocks: [
        {
          kind: "list",
          items: [
            "A line has one slope everywhere; no amount of training lets it follow a sine curve.",
            "Each `tanh` hidden unit is an S-shaped step placed by its weight and bias.",
            "The output adds the units scaled by `W2`, so several units can make bumps and turns.",
            "The number of hidden units is a choice made before training; more units allow more bends.",
            "The fit chart shows the recorded predictions bending into shape as the loop runs.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "training-networks-03-q1",
      question: "A line trained for 500 steps on the sine points ends at loss `0.1965`. What does training it for 5000 steps give?",
      options: [
        "A loss close to `0`",
        "About the same loss: the best line cannot follow the curve",
        "A loss that grows",
      ],
      answer: 1,
      explanation: "The line had already reached its best fit; the limit is the model, not the number of steps.",
    },
    {
      id: "training-networks-03-q2",
      question: "What does one `tanh` hidden unit contribute to the output, as a function of `x`?",
      options: ["A straight line", "A parabola", "An S-shaped step, scaled by its weight in `W2`", "A constant"],
      answer: 2,
      explanation: "The unit computes `tanh(w * x + b)`, and the output layer scales it and adds it to the others.",
    },
    {
      id: "training-networks-03-q3",
      question: "Why can a network with 1 hidden unit not fit a bump?",
      options: [
        "Because one S-shape only goes one way; a bump needs a step up and a step down",
        "Because the learning rate is too small",
        "Because the bump has negative values",
      ],
      answer: 0,
      explanation: "Two units in opposite directions make a bump; one unit can only rise or only fall.",
    },
  ],
};
