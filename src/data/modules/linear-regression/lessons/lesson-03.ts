import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "A residual is how far one prediction is from its target. The mean squared error turns all residuals into one number that says how wrong a model is.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What a residual and a loss are",
      blocks: [
        {
          kind: "text",
          text: "A residual is the error of one prediction: `y_hat - y`. It is positive when the model guesses too high and negative when it guesses too low.",
        },
        {
          kind: "text",
          text: "A loss is a single number that measures how wrong all the predictions are together. Lower is better; a loss of 0 means every prediction is exact.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "y = np.array([5.4, 8.1, 10.4, 13.2, 15.6])",
            "y_hat = np.array([5.5, 8.0, 10.5, 13.0, 15.5])",
            "r = y_hat - y",
            "print(np.round(r, 3))",
          ].join("\n"),
          output: "[ 0.1 -0.1  0.1 -0.2 -0.1]",
        },
      ],
    },
    {
      title: "Why a model needs one number for its error",
      blocks: [
        {
          kind: "text",
          text: "Five residuals are hard to compare between two models: one model may be better on some rides and worse on others. One number makes the comparison simple.",
        },
        {
          kind: "text",
          text: "With a loss, finding a good model becomes a clear task: choose the parameters `w` and `b` that make the loss as small as possible.",
        },
      ],
    },
    {
      title: "Mean squared error, step by step",
      blocks: [
        {
          kind: "text",
          text: "The average of the residuals is a poor loss, because positive and negative errors cancel. Below, both predictions are wrong by 2, yet the average residual is 0.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "y = np.array([3.0, 5.0])",
            "y_hat = np.array([5.0, 3.0])",
            "print(y_hat - y)",
            "print(np.mean(y_hat - y))",
            "print(np.mean((y_hat - y) ** 2))",
          ].join("\n"),
          output: ["[ 2. -2.]", "0.0", "4.0"].join("\n"),
        },
        {
          kind: "text",
          text: "Squaring makes every residual positive, so errors can no longer cancel. It also makes large errors count much more than small ones: an error of 2 adds 4, an error of 0.1 adds only 0.01.",
        },
        {
          kind: "list",
          items: [
            "Residuals: `r = y_hat - y`.",
            "Squared residuals: `r ** 2`, the same as `r * r` or `np.square(r)`.",
            "Mean squared error (MSE): their average, `np.mean((y_hat - y) ** 2)`.",
          ],
        },
        {
          kind: "note",
          text: "MSE is in squared units: for fares, squared currency. What matters here is that a lower MSE means predictions closer to the targets.",
        },
      ],
    },
    {
      title: "A practical example: comparing two fare models",
      blocks: [
        {
          kind: "text",
          text: "Two models predict the taxi fares from Lesson 01: `w = 2.5, b = 3.0` and `w = 2.0, b = 4.0`. The MSE of each says which fits better.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])",
            "y = np.array([5.4, 8.1, 10.4, 13.2, 15.6])",
            "y_hat_a = 2.5 * x + 3.0",
            "y_hat_b = 2.0 * x + 4.0",
            "print(np.round(np.mean((y_hat_a - y) ** 2), 3))",
            "print(np.round(np.mean((y_hat_b - y) ** 2), 3))",
          ].join("\n"),
          output: ["0.016", "0.906"].join("\n"),
        },
        {
          kind: "text",
          text: "The first model has the lower loss, so its line is closer to the data. The second is close on short rides but too low on long ones, and squaring makes those big errors dominate.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])",
            "y = np.array([5.4, 8.1, 10.4, 13.2, 15.6])",
            "r = 2.0 * x + 4.0 - y",
            "print(np.round(r, 3))",
            "print(np.round(r ** 2, 3))",
          ].join("\n"),
          output: ["[ 0.6 -0.1 -0.4 -1.2 -1.6]", "[0.36 0.01 0.16 1.44 2.56]"].join("\n"),
        },
      ],
    },
    {
      title: "Try it: find the lowest loss",
      blocks: [
        {
          kind: "text",
          text: "Change `w` and `b` and watch the residuals, their squares and the mean. Look for the values that make `loss` smallest.",
        },
        {
          kind: "playground",
          demo: {
            title: "Mean squared error of a line",
            controls: [
              { type: "number", name: "w10", label: "w × 10", min: 0, max: 50, initial: 20 },
              { type: "number", name: "b10", label: "b × 10", min: 0, max: 60, initial: 40 },
            ],
            template: [
              "import numpy as np",
              "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])",
              "y = np.array([5.4, 8.1, 10.4, 13.2, 15.6])",
              "w = {{w10}} / 10",
              "b = {{b10}} / 10",
              "y_hat = w * x + b",
              "loss = np.mean(np.square(y_hat - y))",
            ].join("\n"),
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
            "A residual is `y_hat - y`, the error of one prediction.",
            "A loss is one number for how wrong all predictions are; lower is better.",
            "Squaring stops positive and negative errors from cancelling, and weights big errors more.",
            "Mean squared error is `np.mean((y_hat - y) ** 2)`.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "linear-regression-03-q1",
      question: "What is the MSE for `y = [1, 2]` and `y_hat = [2, 4]`?",
      options: ["1.5", "2.5", "5.0", "3.0"],
      answer: 1,
      explanation: "Residuals `[1, 2]`, squares `[1, 4]`, mean `2.5`.",
    },
    {
      id: "linear-regression-03-q2",
      question: "Why is the mean of the residuals a poor loss?",
      options: [
        "It is too slow to compute",
        "It is always negative",
        "Positive and negative errors cancel out",
      ],
      answer: 2,
      explanation: "A model that is too high on one example and too low on another can average to 0.",
    },
    {
      id: "linear-regression-03-q3",
      question: "Model A has MSE `0.4` and model B has MSE `1.2` on the same data. Which fits better?",
      options: ["Model A", "Model B", "They fit equally well"],
      answer: 0,
      explanation: "A lower loss means predictions closer to the targets.",
    },
  ],
};
