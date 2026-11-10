import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "The sigmoid turns any score into a probability between 0 and 1. A threshold then turns each probability into a predicted label.",
  estimatedMinutes: 14,
  sections: [
    {
      title: "The sigmoid function",
      blocks: [
        {
          kind: "text",
          text: "The sigmoid is the function `1 / (1 + e^(-z))`. In NumPy it is `1 / (1 + np.exp(-z))`, where `np.exp(-z)` computes e to the power `-z` for every element.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "z = np.array([-6.0, -2.0, -1.0, 0.0, 1.0, 2.0, 6.0])",
            "p = 1 / (1 + np.exp(-z))",
            "print(np.round(p, 3))",
          ].join("\n"),
          output: "[0.002 0.119 0.269 0.5   0.731 0.881 0.998]",
        },
        {
          kind: "text",
          text: "Every output lies between 0 and 1. Logistic regression is this function applied to the scores of a linear model: `p = 1 / (1 + np.exp(-(X @ w + b)))`.",
        },
      ],
    },
    {
      title: "Why the sigmoid fits classification",
      blocks: [
        {
          kind: "text",
          text: "The model keeps everything you know: the score `z = X @ w + b` and its weights. The sigmoid only changes how the score is read, as a probability of yes.",
        },
        {
          kind: "text",
          text: "A higher score always gives a higher probability, so the order of the examples does not change. The same idea, a simple function applied to `X @ W + b`, is how neural network layers work.",
        },
      ],
    },
    {
      title: "Reading the S shape",
      blocks: [
        {
          kind: "list",
          items: [
            "At `z = 0` the output is exactly `0.5`: even odds.",
            "Large positive scores give outputs close to 1; large negative scores give outputs close to 0.",
            "The outputs approach 0 and 1 but never reach them, whatever the score.",
            "Near `z = 0` the curve is steep: a small change of score moves the probability a lot.",
          ],
        },
        {
          kind: "text",
          text: "Why it works: for a large `z`, `np.exp(-z)` is close to 0, so the result is close to `1 / 1`. For a very negative `z`, `np.exp(-z)` is huge, so the result is close to 0.",
        },
      ],
    },
    {
      title: "From probabilities to labels with a threshold",
      blocks: [
        {
          kind: "text",
          text: "A threshold is the cut-off that turns a probability into a predicted label: predict 1 when `p >= threshold`, else 0. The usual threshold is `0.5`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "p = np.array([0.2, 0.55, 0.7, 0.95])",
            "print((p >= 0.5).astype(int))",
            "print((p >= 0.8).astype(int))",
          ].join("\n"),
          output: ["[0 1 1 1]", "[0 0 0 1]"].join("\n"),
        },
        {
          kind: "text",
          text: "`p >= 0.5` gives a boolean array; `.astype(int)` turns `True` into 1 and `False` into 0. A higher threshold predicts yes only when the model is more sure.",
        },
      ],
    },
    {
      title: "A practical example: will each student pass?",
      blocks: [
        {
          kind: "text",
          text: "Take the students of lesson 01 with the weights `w = 2.0` and `b = -5.0`. Compute the scores, the probabilities and the predicted labels.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "hours = np.array([0.5, 1.0, 1.5, 2.0, 3.0, 3.5, 4.0, 4.5])",
            "z = 2.0 * hours - 5.0",
            "p = 1 / (1 + np.exp(-z))",
            "print(np.round(p, 3))",
            "pred = p >= 0.5",
            "print(pred)",
            "print(pred.astype(int))",
          ].join("\n"),
          output: [
            "[0.018 0.047 0.119 0.269 0.731 0.881 0.953 0.982]",
            "[False False False False  True  True  True  True]",
            "[0 0 0 0 1 1 1 1]",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "The score is 0 at 2.5 hours, so that is where the probability crosses 0.5. Every student who studied longer is predicted to pass, which matches the labels `[0 0 0 0 1 1 1 1]`.",
        },
      ],
    },
    {
      title: "Try it: shape the sigmoid",
      blocks: [
        {
          kind: "text",
          text: "Change the slope and the bias, then step through `np.exp`, the addition and the division. A larger slope makes the probabilities jump faster from near 0 to near 1; the bias moves where they cross 0.5.",
        },
        {
          kind: "playground",
          demo: {
            title: "Probabilities p = 1 / (1 + np.exp(-z))",
            controls: [
              { type: "number", name: "w", label: "Slope w (in halves)", min: 1, max: 8, initial: 4 },
              {
                type: "select",
                name: "b",
                label: "Bias b",
                options: [
                  { label: "-5.0", value: "-5.0" },
                  { label: "-3.0", value: "-3.0" },
                  { label: "-1.0", value: "-1.0" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "hours = np.array([0.5, 1.0, 1.5, 2.0, 3.0, 3.5, 4.0, 4.5])",
              "w = {{w}} / 2",
              "b = {{b}}",
              "z = w * hours + b",
              "p = 1 / (1 + np.exp(-z))",
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
            "The sigmoid `1 / (1 + np.exp(-z))` maps any score to a probability between 0 and 1.",
            "It gives 0.5 at `z = 0`, values near 1 for large scores and near 0 for very negative ones.",
            "Logistic regression is `p = 1 / (1 + np.exp(-(X @ w + b)))`.",
            "A threshold turns probabilities into labels: `(p >= 0.5).astype(int)`.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "logistic-regression-02-q1",
      question: "What does the sigmoid give for a score of `z = 0`?",
      options: ["0", "1", "0.5", "It depends on `w`"],
      answer: 2,
      explanation: "`np.exp(0)` is 1, so the result is `1 / (1 + 1) = 0.5`.",
    },
    {
      id: "logistic-regression-02-q2",
      question: "A score is very large and negative, like `z = -20`. What is the probability close to?",
      options: ["0", "0.5", "1"],
      answer: 0,
      explanation: "`np.exp(20)` is huge, so `1 / (1 + huge)` is close to 0.",
    },
    {
      id: "logistic-regression-02-q3",
      question: "With `p = np.array([0.3, 0.5, 0.8])`, what is `(p >= 0.5).astype(int)`?",
      options: ["`[0 0 1]`", "`[0 1 1]`", "`[1 1 1]`"],
      answer: 1,
      explanation: "0.5 is not below the threshold, so `0.5 >= 0.5` is `True` and gives 1.",
    },
    {
      id: "logistic-regression-02-q4",
      question: "Raising the threshold from 0.5 to 0.8 makes the model predict 1 …",
      options: ["for the same examples", "for more examples", "for fewer or the same examples"],
      answer: 2,
      explanation: "Only probabilities of at least 0.8 count as yes now, so no new example becomes 1.",
    },
  ],
};
