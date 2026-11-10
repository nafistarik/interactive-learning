import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "Log loss scores probabilities against labels: it is small when the model is right and sure, and large when the model is sure and wrong.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "Log loss, one example at a time",
      blocks: [
        {
          kind: "text",
          text: "A loss is one number that says how wrong the predictions are, like the mean squared error of Module 1.1. Log loss, also called binary cross-entropy, is the loss used for probabilities.",
        },
        {
          kind: "list",
          items: [
            "When the label is 1, the loss of one example is `-np.log(p)`: small when `p` is close to 1.",
            "When the label is 0, it is `-np.log(1 - p)`: small when `p` is close to 0.",
          ],
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "p = np.array([0.99, 0.9, 0.5, 0.1, 0.01])",
            "print(np.round(-np.log(p), 3))",
          ].join("\n"),
          output: "[0.01  0.105 0.693 2.303 4.605]",
        },
        {
          kind: "text",
          text: "These are the losses of five predictions for an example whose label is 1. `np.log` is the natural logarithm; it is negative for numbers below 1, so the minus sign makes the loss positive.",
        },
      ],
    },
    {
      title: "Why not mean squared error",
      blocks: [
        {
          kind: "text",
          text: "With a probability, a squared error can never be more than 1, even for a confident wrong answer. Log loss keeps growing as the model becomes more sure of the wrong label.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "y = 1.0",
            "p = 0.01",
            "print(np.round(np.square(y - p), 3))",
            "print(np.round(-np.log(p), 3))",
          ].join("\n"),
          output: ["0.98", "4.605"].join("\n"),
        },
        {
          kind: "text",
          text: "Here the label is 1 and the model says 0.01. Squared error is already close to its limit of 1; log loss is 4.605 and keeps growing as `p` moves closer to 0. Combined with the sigmoid, log loss also gives the simple gradient you will use in lesson 04.",
        },
      ],
    },
    {
      title: "One formula for both labels",
      blocks: [
        {
          kind: "text",
          text: "Because `y` is 0 or 1, the two cases fit in one expression: `y * np.log(p) + (1 - y) * np.log(1 - p)`. When `y` is 1 the second term is multiplied by 0; when `y` is 0 the first one is.",
        },
        {
          kind: "note",
          text: "Log loss over all examples: `loss = -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))`. Note the minus sign in front, and `np.log(1 - p)`, not `np.log(1 - y)`.",
        },
      ],
    },
    {
      title: "A practical example: good and bad predictions",
      blocks: [
        {
          kind: "text",
          text: "Four examples with labels `[1, 0, 1, 0]`. Compare a model that leans the right way with one that leans the wrong way.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "y = np.array([1, 0, 1, 0])",
            "p_good = np.array([0.9, 0.2, 0.8, 0.1])",
            "p_bad = np.array([0.4, 0.7, 0.3, 0.6])",
            "loss_good = -np.mean(y * np.log(p_good) + (1 - y) * np.log(1 - p_good))",
            "loss_bad = -np.mean(y * np.log(p_bad) + (1 - y) * np.log(1 - p_bad))",
            "print(np.round(loss_good, 3))",
            "print(np.round(loss_bad, 3))",
          ].join("\n"),
          output: ["0.164", "1.06"].join("\n"),
        },
        {
          kind: "text",
          text: "Lower is better. A model that answers 0.5 for everything scores `-np.log(0.5)`, about 0.693, so `p_bad` does worse than not knowing at all.",
        },
      ],
    },
    {
      title: "Clipping p to avoid log(0)",
      blocks: [
        {
          kind: "text",
          text: "`np.log(0)` is minus infinity. If a probability is exactly 0 or 1, for example after rounding, the loss becomes infinite or `nan` (not a number).",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "y = np.array([1, 0, 1])",
            "p = np.array([0.9, 1.0, 0.8])",
            "p = np.clip(p, 1e-7, 1 - 1e-7)",
            "loss = -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))",
            "print(np.round(loss, 3))",
          ].join("\n"),
          output: "5.482",
        },
        {
          kind: "text",
          text: "`np.clip` keeps every value between `1e-7` and `1 - 1e-7`. The second example, label 0 with `p = 1.0`, still gets a large loss, but a finite one.",
        },
      ],
    },
    {
      title: "Try it: what a confident mistake costs",
      blocks: [
        {
          kind: "text",
          text: "The labels are `[1, 1, 0, 0]`. Pick a set of predictions and step through `np.log`, the per-example losses and the mean. Compare one confident mistake with predictions that are all unsure.",
        },
        {
          kind: "playground",
          demo: {
            title: "Log loss of predictions p",
            controls: [
              {
                type: "select",
                name: "p",
                label: "Predictions p",
                options: [
                  { label: "mostly right", value: "[0.9, 0.8, 0.2, 0.1]" },
                  { label: "unsure, all 0.5", value: "[0.5, 0.5, 0.5, 0.5]" },
                  { label: "one confident mistake", value: "[0.9, 0.8, 0.2, 0.99]" },
                  { label: "all wrong", value: "[0.1, 0.2, 0.8, 0.9]" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "y = np.array([1, 1, 0, 0])",
              "p = np.array({{p}})",
              "per_example = -(y * np.log(p) + (1 - y) * np.log(1 - p))",
              "loss = np.mean(per_example)",
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
            "Log loss: `-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))`.",
            "It is small when the model is sure and right, and grows without limit when it is sure and wrong.",
            "Mean squared error caps a wrong probability at 1, so it punishes confident mistakes too little.",
            "Clip `p` with `np.clip(p, 1e-7, 1 - 1e-7)` so `np.log` never sees 0.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "logistic-regression-03-q1",
      question: "The label is 1. Which prediction has the largest log loss?",
      options: ["`p = 0.9`", "`p = 0.5`", "`p = 0.05`"],
      answer: 2,
      explanation: "The loss is `-np.log(p)`, which grows as `p` moves toward 0.",
    },
    {
      id: "logistic-regression-03-q2",
      question: "The label is 0. Which term of the log loss counts for this example?",
      options: ["`np.log(1 - p)`", "`np.log(p)`", "Both equally"],
      answer: 0,
      explanation: "With `y = 0`, `y * np.log(p)` is 0 and `(1 - y) * np.log(1 - p)` remains.",
    },
    {
      id: "logistic-regression-03-q3",
      question: "Why is `p` clipped before taking `np.log`?",
      options: [
        "To make the loss smaller",
        "Because `np.log(0)` is minus infinity",
        "Because `np.log` only works on integers",
      ],
      answer: 1,
      explanation: "A probability of exactly 0 or 1 would make the loss infinite or `nan`.",
    },
  ],
};
