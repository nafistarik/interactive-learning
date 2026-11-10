import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "Training repeats one small move: predict, measure the loss, compute the gradient, and step `w` and `b` against it. Record the loss at every step and watch the line settle on the data.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What a training loop is",
      blocks: [
        {
          kind: "text",
          text: "Gradient descent starts from any `w` and `b` and improves them in steps. One step is `w -= lr * dw` and `b -= lr * db`; the training loop repeats it many times.",
        },
        {
          kind: "note",
          text: "The learning rate `lr` is a small positive number that sets the size of each step. The minus sign moves each parameter against its slope.",
        },
      ],
    },
    {
      title: "Why repeat small steps",
      blocks: [
        {
          kind: "text",
          text: "The gradient only describes the loss near the current parameters. A small step in its direction is safe; after it, the slopes have changed, so you compute them again.",
        },
        {
          kind: "text",
          text: "Each step costs one pass over the data, however many parameters the model has. That is why the same loop trains models far larger than a line.",
        },
      ],
    },
    {
      title: "The four parts of one step",
      blocks: [
        {
          kind: "list",
          items: [
            "Predict: `pred = w * x + b`.",
            "Measure: `error = pred - y` and `loss = np.mean(error * error)`.",
            "Gradient: `dw = np.mean(2 * error * x)` and `db = np.mean(2 * error)`.",
            "Update: `w -= lr * dw` and `b -= lr * db`.",
          ],
        },
        {
          kind: "text",
          text: "Here are the first three steps, starting from `w = 0` and `b = 0` with `lr = 0.1`. The loss printed is the one before each update.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
            "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
            "w, b, lr = 0.0, 0.0, 0.1",
            "",
            "for step in range(3):",
            "    error = w * x + b - y",
            "    loss = np.mean(error * error)",
            "    dw = np.mean(2 * error * x)",
            "    db = np.mean(2 * error)",
            "    w -= lr * dw",
            "    b -= lr * db",
            "    print(step, round(float(loss), 3), round(float(w), 3), round(float(b), 3))",
          ].join("\n"),
          output: ["0 33.02 2.8 1.0", "1 3.86 1.84 0.68", "2 0.481 2.16 0.808"].join("\n"),
        },
        {
          kind: "text",
          text: "The first step overshoots `w` to `2.8`, the next one corrects it back down. The loss falls at every step because each move is against the slope.",
        },
      ],
    },
    {
      title: "Recording the losses",
      blocks: [
        {
          kind: "text",
          text: "Append the loss to a list at every step. The list is the training history: if it goes down and levels off, the loop is working.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
            "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
            "w, b, lr = 0.0, 0.0, 0.1",
            "losses = []",
            "",
            "for step in range(200):",
            "    pred = w * x + b",
            "    error = pred - y",
            "    losses.append(float(np.mean(error * error)))",
            "    w -= lr * np.mean(2 * error * x)",
            "    b -= lr * np.mean(2 * error)",
            "",
            "print(len(losses))",
            "print([round(losses[i], 3) for i in [0, 10, 50, 100, 199]])",
            "print(round(float(w), 3), round(float(b), 3))",
          ].join("\n"),
          output: ["200", "[33.02, 0.027, 0.02, 0.02, 0.02]", "2.0 1.0"].join("\n"),
        },
        {
          kind: "text",
          text: "The loss drops fast at first and then stays at `0.02`, the lowest MSE a straight line can reach on these points. The loop found `w = 2` and `b = 1` without trying a grid of values.",
        },
      ],
    },
    {
      title: "Try it: watch the line fit",
      blocks: [
        {
          kind: "text",
          text: "Run the training loop and scrub through the iterations: the chart shows the data and the line `pred` at each step, next to the loss curve. Change the starting `w` and the number of steps.",
        },
        {
          kind: "playground",
          demo: {
            title: "Training a line",
            controls: [
              {
                type: "select",
                name: "w0",
                label: "Starting w",
                options: [
                  { label: "0.0", value: "0.0" },
                  { label: "4.0", value: "4.0" },
                  { label: "-2.0", value: "-2.0" },
                ],
              },
              { type: "number", name: "steps", label: "Steps", min: 1, max: 200, initial: 60 },
            ],
            template: [
              "import numpy as np",
              "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
              "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
              "w = {{w0}}",
              "b = 0.0",
              "lr = 0.1",
              "losses = []",
              "for step in range({{steps}}):",
              "    pred = w * x + b",
              "    error = pred - y",
              "    loss = np.mean(error * error)",
              "    losses.append(loss)",
              "    dw = np.mean(2 * error * x)",
              "    db = np.mean(2 * error)",
              "    w -= lr * dw",
              "    b -= lr * db",
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
            "One step: predict, measure the loss, compute `dw` and `db`, then `w -= lr * dw` and `b -= lr * db`.",
            "The training loop repeats that step; `lr` sets the step size.",
            "Record the loss every step; a falling, levelling loss means the loop works.",
            "Gradient descent finds the best line without trying every value.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "gradient-descent-03-q1",
      question: "Which line is a correct gradient descent update for `w`?",
      options: ["`w += lr * dw`", "`w = lr * dw`", "`w -= dw / lr`", "`w -= lr * dw`"],
      answer: 3,
      explanation: "Subtracting `lr * dw` moves `w` a small step against its slope.",
    },
    {
      id: "gradient-descent-03-q2",
      question: "Why are `dw` and `db` computed again inside the loop, at every step?",
      options: [
        "Because the slopes change when `w` and `b` change",
        "Because NumPy forgets values between iterations",
        "To make the loop slower and more stable",
      ],
      answer: 0,
      explanation: "The gradient describes the loss at the current parameters, so every update needs a fresh one.",
    },
    {
      id: "gradient-descent-03-q3",
      question: "The recorded `losses` fall quickly and then stay at the same value. What does that mean?",
      options: [
        "The learning rate is far too large",
        "The parameters are close to the lowest loss the model can reach",
        "The model predicts every point exactly",
      ],
      answer: 1,
      explanation: "A loss that levels off means the steps no longer improve it: the parameters have settled near the minimum, which need not be 0.",
    },
  ],
};
