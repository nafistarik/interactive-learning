import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "Train a classifier with the loop from Module 1.2: compute probabilities, the log loss and its gradient, update `w` and `b`, and measure the accuracy of the labels.",
  estimatedMinutes: 18,
  sections: [
    {
      title: "The gradient of log loss",
      blocks: [
        {
          kind: "text",
          text: "Training needs the gradient: how the loss changes when `w` or `b` changes. For log loss with the sigmoid, it has a short form.",
        },
        {
          kind: "list",
          items: [
            "`dw = X.T @ (p - y) / n`, one value per weight, where `n` is the number of examples.",
            "`db = np.mean(p - y)`.",
            "With one feature `x`, `dw` is `np.mean((p - y) * x)`.",
          ],
        },
        {
          kind: "text",
          text: "`p - y` is the error of each probability. The gradient of MSE in Module 1.2 was also built from an error, prediction minus target; here the prediction is the probability `p`.",
        },
      ],
    },
    {
      title: "Why this is the same training loop",
      blocks: [
        {
          kind: "text",
          text: "Gradient descent does not care which model it trains. Each step computes predictions, the gradient, and moves the parameters against it with `w -= lr * dw`.",
        },
        {
          kind: "text",
          text: "So logistic regression adds only two lines to the loop you know: the sigmoid for `p`, and log loss to watch the progress.",
        },
      ],
    },
    {
      title: "One step by hand",
      blocks: [
        {
          kind: "text",
          text: "Start the students' model at `w = 0` and `b = 0`. Every score is 0, so every probability is 0.5.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([0.5, 1.0, 1.5, 2.0, 3.0, 3.5, 4.0, 4.5])",
            "y = np.array([0, 0, 0, 0, 1, 1, 1, 1])",
            "w = 0.0",
            "b = 0.0",
            "p = 1 / (1 + np.exp(-(w * x + b)))",
            "print(p)",
            "dw = np.mean((p - y) * x)",
            "db = np.mean(p - y)",
            "print(np.round(dw, 3), np.round(db, 3))",
          ].join("\n"),
          output: ["[0.5 0.5 0.5 0.5 0.5 0.5 0.5 0.5]", "-0.625 0.0"].join("\n"),
        },
        {
          kind: "text",
          text: "`dw` is negative, so `w -= lr * dw` raises `w`: more hours will mean a higher probability of passing. `db` is 0 here because half the labels are 1.",
        },
      ],
    },
    {
      title: "Accuracy: how many labels are right",
      blocks: [
        {
          kind: "text",
          text: "Accuracy is the fraction of examples whose predicted label equals the true label. Compare the thresholded predictions with `y` and take the mean of the booleans.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "y = np.array([0, 0, 1, 1, 1])",
            "p = np.array([0.1, 0.6, 0.8, 0.4, 0.9])",
            "pred = (p >= 0.5).astype(int)",
            "print(pred)",
            "print(pred == y)",
            "print(np.mean(pred == y))",
          ].join("\n"),
          output: ["[0 1 1 0 1]", "[ True False  True False  True]", "0.6"].join("\n"),
        },
        {
          kind: "text",
          text: "Three of five labels are right, so the accuracy is 0.6. Log loss is what training lowers; accuracy is the number people usually ask about.",
        },
      ],
    },
    {
      title: "A practical example: training on two features",
      blocks: [
        {
          kind: "text",
          text: "Six examples with two features each. The loop uses the matrix form of the gradient and keeps every loss in a list.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[0.5, 1.0], [1.0, 0.5], [1.5, 1.5], [2.5, 2.0], [3.0, 3.5], [3.5, 2.5]])",
            "y = np.array([0, 0, 0, 1, 1, 1])",
            "n = len(y)",
            "w = np.zeros(2)",
            "b = 0.0",
            "lr = 0.5",
            "losses = []",
            "for step in range(200):",
            "    p = 1 / (1 + np.exp(-(X @ w + b)))",
            "    losses.append(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)))",
            "    w -= lr * X.T @ (p - y) / n",
            "    b -= lr * np.mean(p - y)",
            "print(np.round(losses[0], 3), np.round(losses[-1], 3))",
            "print(np.round(w, 3), np.round(b, 3))",
          ].join("\n"),
          output: ["0.693 0.099", "[2.401 0.583] -5.527"].join("\n"),
        },
        {
          kind: "text",
          text: "The loss starts at 0.693, the loss of answering 0.5 everywhere, and falls to 0.099. The first feature ends with the larger weight, so it matters more for this data.",
        },
      ],
    },
    {
      title: "Try it: watch the sigmoid sharpen",
      blocks: [
        {
          kind: "text",
          text: "Pick a learning rate and a number of steps, then scrub through the iterations. The curve of `p` starts flat at 0.5 and gets steeper as the loss falls; with a small learning rate it moves slowly.",
        },
        {
          kind: "playground",
          demo: {
            title: "Training a classifier",
            controls: [
              {
                type: "select",
                name: "lr",
                label: "Learning rate lr",
                options: [
                  { label: "0.05", value: "0.05" },
                  { label: "0.5", value: "0.5" },
                  { label: "2.0", value: "2.0" },
                ],
              },
              { type: "number", name: "steps", label: "Steps (in tens)", min: 1, max: 30, initial: 10 },
            ],
            template: [
              "import numpy as np",
              "hours = np.array([0.5, 1.0, 1.5, 2.0, 3.0, 3.5, 4.0, 4.5])",
              "passed = np.array([0, 0, 0, 0, 1, 1, 1, 1])",
              "w = 0.0",
              "b = 0.0",
              "lr = {{lr}}",
              "for step in range({{steps}} * 10):",
              "    p = 1 / (1 + np.exp(-(w * hours + b)))",
              "    loss = -np.mean(passed * np.log(p) + (1 - passed) * np.log(1 - p))",
              "    w -= lr * np.mean((p - passed) * hours)",
              "    b -= lr * np.mean(p - passed)",
            ].join("\n"),
            chart: { kind: "fit", x: "hours", y: "passed", prediction: "p" },
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
            "Gradient of log loss: `dw = X.T @ (p - y) / n` and `db = np.mean(p - y)`.",
            "The training loop is the one from Module 1.2, with `p` from the sigmoid.",
            "Log loss starts at about 0.693 when every probability is 0.5.",
            "Accuracy is `np.mean((p >= 0.5).astype(int) == y)`.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "logistic-regression-04-q1",
      question: "`X` is `(100, 3)` and `p - y` is `(100,)`. What is the shape of `X.T @ (p - y) / n`?",
      options: ["(100,)", "(3,)", "(100, 3)"],
      answer: 1,
      explanation: "`(3, 100) @ (100,) -> (3,)`: one gradient value per weight.",
    },
    {
      id: "logistic-regression-04-q2",
      question: "Every probability is above its label, so `p - y` is positive for every example. What does `b -= lr * db` do?",
      options: ["Raises `b`", "Leaves `b` unchanged", "Lowers `b`"],
      answer: 2,
      explanation: "`db = np.mean(p - y)` is positive, so subtracting it lowers `b` and every probability.",
    },
    {
      id: "logistic-regression-04-q3",
      question: "Predicted labels `[1, 0, 1, 1]`, true labels `[1, 1, 1, 0]`. What is the accuracy?",
      options: ["0.5", "0.75", "0.25"],
      answer: 0,
      explanation: "Only the first and third predictions match, so 2 / 4 = 0.5.",
    },
  ],
};
