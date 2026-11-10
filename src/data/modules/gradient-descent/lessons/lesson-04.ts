import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "The learning rate decides whether training crawls, converges or blows up. See all three on the same data, and stop the loop once the loss stops improving.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What convergence is",
      blocks: [
        {
          kind: "text",
          text: "Training converges when the parameters settle and the loss stops going down. It diverges when the loss grows from step to step instead.",
        },
        {
          kind: "note",
          text: "The learning rate `lr` multiplies every step. The same data and the same loop can converge or diverge depending only on `lr`.",
        },
      ],
    },
    {
      title: "Why the learning rate matters",
      blocks: [
        {
          kind: "text",
          text: "A step that is too small wastes time: the loop needs many more iterations to reach the bottom. A step that is too large jumps past the bottom to a point where the loss is higher.",
        },
        {
          kind: "text",
          text: "There is no single right value for every problem. You pick `lr` by watching the loss curve, so knowing what each failure looks like is part of training.",
        },
      ],
    },
    {
      title: "Too small, good, too large",
      blocks: [
        {
          kind: "text",
          text: "Here the same training runs for 100 steps with three learning rates. The best possible loss on these points is `0.02`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
            "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
            "",
            "def train(lr, steps):",
            "    w, b = 0.0, 0.0",
            "    for step in range(steps):",
            "        error = w * x + b - y",
            "        w -= lr * np.mean(2 * error * x)",
            "        b -= lr * np.mean(2 * error)",
            "    error = w * x + b - y",
            "    return float(np.mean(error * error))",
            "",
            "for lr in [0.001, 0.01, 0.1]:",
            "    print(lr, round(train(lr, 100), 3))",
          ].join("\n"),
          output: ["0.001 2.26", "0.01 0.027", "0.1 0.02"].join("\n"),
        },
        {
          kind: "text",
          text: "With `0.001` the loss is still far from `0.02` after 100 steps; with `0.01` it is close; with `0.1` it has arrived. Now a learning rate that is too large:",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
            "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
            "w, b, lr = 0.0, 0.0, 0.2",
            "",
            "for step in range(5):",
            "    error = w * x + b - y",
            "    print(step, round(float(np.mean(error * error)), 1))",
            "    w -= lr * np.mean(2 * error * x)",
            "    b -= lr * np.mean(2 * error)",
          ].join("\n"),
          output: ["0 33.0", "1 93.2", "2 263.1", "3 743.1", "4 2098.8"].join("\n"),
        },
        {
          kind: "text",
          text: "Each step jumps past the bottom and lands further up the other side, so the loss roughly triples every step. Left running, it keeps growing.",
        },
        {
          kind: "note",
          text: "A diverging loss grows until the numbers no longer fit in a float: they become `inf`, then `nan` (not a number), and NumPy may warn about an overflow. When you see that, lower the learning rate first.",
        },
      ],
    },
    {
      title: "Stopping when the loss stops improving",
      blocks: [
        {
          kind: "text",
          text: "A fixed number of steps is either too few or wasteful. A common rule is to stop when one step lowers the loss by less than a small tolerance, with a maximum number of steps as a safety limit.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
            "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
            "w, b, lr = 0.0, 0.0, 0.1",
            "previous = np.inf",
            "",
            "for step in range(1000):",
            "    error = w * x + b - y",
            "    loss = np.mean(error * error)",
            "    if previous - loss < 1e-6:",
            "        break",
            "    previous = loss",
            "    w -= lr * np.mean(2 * error * x)",
            "    b -= lr * np.mean(2 * error)",
            "",
            "print(step)",
            "print(round(float(loss), 4), round(float(w), 3), round(float(b), 3))",
          ].join("\n"),
          output: ["66", "0.02 2.002 0.995"].join("\n"),
        },
        {
          kind: "text",
          text: "The loop stopped after 66 of the allowed 1000 steps, with `w` and `b` already close to 2 and 1. If the loss went up, `previous - loss` would be negative and the loop would stop as well.",
        },
      ],
    },
    {
      title: "Try it: pick a learning rate",
      blocks: [
        {
          kind: "text",
          text: "Train with each learning rate and watch the loss curve and the line. Find the one that crawls and the one where the line swings wider and wider.",
        },
        {
          kind: "playground",
          demo: {
            title: "Learning rate and convergence",
            controls: [
              {
                type: "select",
                name: "lr",
                label: "Learning rate",
                options: [
                  { label: "0.001 (too small)", value: "0.001" },
                  { label: "0.01", value: "0.01" },
                  { label: "0.1", value: "0.1" },
                  { label: "0.16 (too large)", value: "0.16" },
                ],
              },
              { type: "number", name: "steps", label: "Steps", min: 10, max: 200, initial: 60 },
            ],
            template: [
              "import numpy as np",
              "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
              "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
              "w = 0.0",
              "b = 0.0",
              "lr = {{lr}}",
              "losses = []",
              "for step in range({{steps}}):",
              "    pred = w * x + b",
              "    error = pred - y",
              "    loss = np.mean(error * error)",
              "    losses.append(loss)",
              "    w -= lr * np.mean(2 * error * x)",
              "    b -= lr * np.mean(2 * error)",
            ].join("\n"),
            chart: { kind: "fit", x: "x", y: "y", prediction: "pred" },
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
            "Too small a learning rate converges slowly; too large a learning rate makes the loss grow.",
            "A growing loss, `inf` or `nan` means: lower the learning rate.",
            "Pick `lr` by watching the loss curve: it should fall and level off.",
            "Stop when a step improves the loss by less than a tolerance, with a maximum number of steps.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "gradient-descent-04-q1",
      question: "The recorded loss is `[33.0, 93.2, 263.1, 743.1]`. What should you change first?",
      options: ["Train for more steps", "Raise the learning rate", "Lower the learning rate"],
      answer: 2,
      explanation: "A loss that grows every step means the steps overshoot, so make them smaller.",
    },
    {
      id: "gradient-descent-04-q2",
      question: "After 100 steps the loss is still falling steadily but is far from its minimum. What is the likely cause?",
      options: [
        "The learning rate is too small",
        "The learning rate is too large",
        "The gradient formula is wrong",
      ],
      answer: 0,
      explanation: "Steady but slow progress means each step is small; a larger `lr` or more steps would get there.",
    },
    {
      id: "gradient-descent-04-q3",
      question: "When does the stopping rule `previous - loss < 1e-6` end the loop?",
      options: [
        "When the loss reaches exactly 0",
        "When one step improves the loss by less than `1e-6`, or makes it worse",
        "After exactly 1000 steps",
        "When `w` stops changing sign",
      ],
      answer: 1,
      explanation: "The difference is the improvement of one step; it is small or negative once training has settled or gone wrong.",
    },
  ],
};
