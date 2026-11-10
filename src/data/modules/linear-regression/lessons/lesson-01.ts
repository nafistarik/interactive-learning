import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "A model is a function that turns an input into a predicted output. The simplest one is a line, `y_hat = w * x + b`, set by two numbers.",
  estimatedMinutes: 12,
  sections: [
    {
      title: "What a model is",
      blocks: [
        {
          kind: "text",
          text: "A model is a function that takes an input and returns a guess for an output. Machine learning is about choosing that function from data.",
        },
        {
          kind: "list",
          items: [
            "A feature is an input value the model uses, called `x`, such as the distance of a taxi ride in km.",
            "A target is the true output we want to predict, called `y`, such as the fare that was paid.",
            "A prediction is the model's guess for the target, called `y_hat`.",
          ],
        },
        {
          kind: "text",
          text: "Data comes as `(x, y)` pairs: one feature value and its target for each example. Here each pair is one taxi ride.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])",
            "y = np.array([5.4, 8.1, 10.4, 13.2, 15.6])",
            "print(list(zip(x.tolist(), y.tolist())))",
          ].join("\n"),
          output: "[(1.0, 5.4), (2.0, 8.1), (3.0, 10.4), (4.0, 13.2), (5.0, 15.6)]",
        },
      ],
    },
    {
      title: "Why we want a model",
      blocks: [
        {
          kind: "text",
          text: "The data only tells us the fares of rides that already happened. A model gives a fare for any distance, including ones not in the data, such as 2.5 km.",
        },
        {
          kind: "text",
          text: "A good model's predictions are close to the targets on the data we have, so we can trust its guesses for new inputs.",
        },
      ],
    },
    {
      title: "A line as a model: y_hat = w * x + b",
      blocks: [
        {
          kind: "text",
          text: "A linear model predicts with a straight line: `y_hat = w * x + b`. Fitting such a line to data is called linear regression.",
        },
        {
          kind: "list",
          items: [
            "`w` is the weight: how much the prediction grows when `x` grows by 1. It is the slope of the line.",
            "`b` is the bias: the prediction when `x` is 0. It moves the whole line up or down.",
            "`w` and `b` are the model's parameters: the numbers we choose, while the formula stays the same.",
          ],
        },
        {
          kind: "text",
          text: "In Python the model is an ordinary function. The parameters go in with the input, and a prediction comes out.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "def predict(x, w, b):",
            "    return w * x + b",
            "",
            "print(predict(2.0, 2.5, 3.0))",
            "print(predict(4.0, 2.5, 3.0))",
          ].join("\n"),
          output: ["8.0", "13.0"].join("\n"),
        },
        {
          kind: "note",
          text: "Read `w = 2.5, b = 3.0` as a fare rule: a base fare of 3.0 plus 2.5 per km. The model is the rule; the parameters are its prices.",
        },
      ],
    },
    {
      title: "A practical example: predicting taxi fares",
      blocks: [
        {
          kind: "text",
          text: "Because `w * x + b` is array math, it predicts every ride at once. Compare the predictions with the real fares `y`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])",
            "y = np.array([5.4, 8.1, 10.4, 13.2, 15.6])",
            "w = 2.5",
            "b = 3.0",
            "y_hat = w * x + b",
            "print(y_hat)",
            "print(y)",
          ].join("\n"),
          output: ["[ 5.5  8.  10.5 13.  15.5]", "[ 5.4  8.1 10.4 13.2 15.6]"].join("\n"),
        },
        {
          kind: "text",
          text: "Other parameters give another line and other predictions. With `w = 1.0, b = 5.0` the predictions are far from the fares for long rides.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])",
            "y_hat = 1.0 * x + 5.0",
            "print(y_hat)",
          ].join("\n"),
          output: "[ 6.  7.  8.  9. 10.]",
        },
      ],
    },
    {
      title: "Try it: move the line",
      blocks: [
        {
          kind: "text",
          text: "Change the weight and the bias, and watch every prediction change. Try `w = 2.5` and `b = 3.0` to get close to the fares above.",
        },
        {
          kind: "playground",
          demo: {
            title: "A line y_hat = w * x + b",
            controls: [
              { type: "number", name: "w10", label: "w × 10", min: 0, max: 50, initial: 25 },
              { type: "number", name: "b10", label: "b × 10", min: -20, max: 50, initial: 30 },
            ],
            template: [
              "import numpy as np",
              "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])",
              "w = {{w10}} / 10",
              "b = {{b10}} / 10",
              "y_hat = w * x + b",
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
            "A model is a function from an input (a feature `x`) to a prediction `y_hat` of the target `y`.",
            "Data is a set of `(x, y)` pairs, one per example.",
            "A linear model is `y_hat = w * x + b`: the weight `w` is the slope, the bias `b` shifts the line.",
            "`w` and `b` are parameters: changing them changes every prediction.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "linear-regression-01-q1",
      question: "In `y_hat = w * x + b`, which names are the parameters?",
      options: ["`x` and `y_hat`", "`w` and `b`", "`x` and `b`", "Only `w`"],
      answer: 1,
      explanation: "`w` and `b` are the numbers we choose; `x` is the input and `y_hat` the output.",
    },
    {
      id: "linear-regression-01-q2",
      question: "With `w = 2.0` and `b = 1.0`, what does the model predict for `x = 3.0`?",
      options: ["6.0", "5.0", "7.0"],
      answer: 2,
      explanation: "`2.0 * 3.0 + 1.0 = 7.0`.",
    },
    {
      id: "linear-regression-01-q3",
      question: "What is the target in a dataset of taxi rides with their distance and fare?",
      options: [
        "The fare, the value we want to predict",
        "The distance, the value we know in advance",
        "The weight `w`",
      ],
      answer: 0,
      explanation: "The target is the true output; the distance is the feature.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "# Taxi rides: distance in km (x) and the fare paid (y).",
    "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])",
    "y = np.array([5.4, 8.1, 10.4, 13.2, 15.6])",
    "",
    "w = 2.5",
    "b = 3.0",
    "y_hat = w * x + b",
    "print(y_hat)",
    "",
    "# Try: other values of w and b. Which ones bring y_hat closest to y?",
  ].join("\n"),
};
