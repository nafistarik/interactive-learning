import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "The slope of the loss tells you how much the loss changes when you nudge a parameter. Measure it with two loss values, and use its sign to decide which way to move.",
  estimatedMinutes: 14,
  sections: [
    {
      title: "What a slope of the loss is",
      blocks: [
        {
          kind: "text",
          text: "Fix the data and `b`, and the loss depends only on `w`. The slope at a value of `w` is how much the loss changes per unit of `w` when you nudge `w` a little.",
        },
        {
          kind: "note",
          text: "Slope: the change in the loss divided by the small change in the parameter that caused it. A negative slope means the loss goes down as `w` grows; a positive slope means it goes up.",
        },
      ],
    },
    {
      title: "Why guessing is not enough",
      blocks: [
        {
          kind: "text",
          text: "In the last module you fitted a line by trying many values of `w` and keeping the best. That needs a loss for every candidate, and with several parameters the number of candidates multiplies.",
        },
        {
          kind: "text",
          text: "The slope gives a direction instead: it says, from where you stand, whether a larger or a smaller `w` lowers the loss. Gradient descent follows that direction step by step.",
        },
      ],
    },
    {
      title: "The loss as a function of w",
      blocks: [
        {
          kind: "text",
          text: "Here `b` is fixed at 1 and `loss(w)` computes the mean squared error for one value of `w`. The loss is smallest at `w = 2` and grows on both sides, like a bowl.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
            "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
            "b = 1.0",
            "",
            "def loss(w):",
            "    error = w * x + b - y",
            "    return np.mean(error ** 2)",
            "",
            "for w in [1.0, 1.5, 2.0, 2.5, 3.0]:",
            "    print(w, round(float(loss(w)), 3))",
          ].join("\n"),
          output: ["1.0 6.02", "1.5 1.52", "2.0 0.02", "2.5 1.52", "3.0 6.02"].join("\n"),
        },
      ],
    },
    {
      title: "Nudge and measure: the numeric slope",
      blocks: [
        {
          kind: "text",
          text: "To measure the slope at `w`, compute the loss a tiny step `h` to the right and to the left, and divide the difference by the distance `2 * h` between them.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
            "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
            "b = 1.0",
            "",
            "def loss(w):",
            "    error = w * x + b - y",
            "    return np.mean(error ** 2)",
            "",
            "h = 0.001",
            "for w in [1.0, 1.9, 3.0]:",
            "    slope = (loss(w + h) - loss(w - h)) / (2 * h)",
            "    print(w, round(float(slope), 3))",
          ].join("\n"),
          output: ["1.0 -12.0", "1.9 -1.2", "3.0 12.0"].join("\n"),
        },
        {
          kind: "list",
          items: [
            "At `w = 1.0` the slope is negative: a larger `w` lowers the loss, so move right.",
            "At `w = 3.0` the slope is positive: a larger `w` raises the loss, so move left.",
            "Near the bottom, at `w = 1.9`, the slope is close to 0: the loss is almost flat there.",
          ],
        },
        {
          kind: "note",
          text: "The rule: move `w` against the sign of the slope. A steep slope also means you are far from the bottom.",
        },
      ],
    },
    {
      title: "One slope per parameter: the gradient",
      blocks: [
        {
          kind: "text",
          text: "The model has two parameters, so the loss has two slopes: one for `w` with `b` held still, one for `b` with `w` held still. Together they are the gradient.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
            "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
            "",
            "def loss(w, b):",
            "    error = w * x + b - y",
            "    return np.mean(error ** 2)",
            "",
            "w, b, h = 1.0, 1.0, 0.001",
            "slope_w = (loss(w + h, b) - loss(w - h, b)) / (2 * h)",
            "slope_b = (loss(w, b + h) - loss(w, b - h)) / (2 * h)",
            "print(round(float(slope_w), 3), round(float(slope_b), 3))",
            "print(round(float(loss(w, b)), 3))",
            "w = w - 0.05 * slope_w",
            "b = b - 0.05 * slope_b",
            "print(round(w, 3), round(b, 3))",
            "print(round(float(loss(w, b)), 3))",
          ].join("\n"),
          output: ["-12.0 -4.0", "6.02", "1.6 1.2", "0.7"].join("\n"),
        },
        {
          kind: "text",
          text: "Both slopes are negative, so both parameters grow. One small step against the gradient took the loss from `6.02` to `0.7`.",
        },
      ],
    },
    {
      title: "Try it: slide w across the bowl",
      blocks: [
        {
          kind: "text",
          text: "The loop moves `w` from 0 to 4 and records the loss and the numeric slope at each value. Scrub through the iterations and find where the slope changes sign; then pick another `h` and compare.",
        },
        {
          kind: "playground",
          demo: {
            title: "Loss and slope as w changes",
            controls: [
              {
                type: "select",
                name: "h",
                label: "Nudge h",
                options: [
                  { label: "0.001", value: "0.001" },
                  { label: "0.01", value: "0.01" },
                  { label: "0.1", value: "0.1" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
              "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
              "b = 1.0",
              "h = {{h}}",
              "for w in np.linspace(0.0, 4.0, 21):",
              "    error = w * x + b - y",
              "    loss = np.mean(error * error)",
              "    error_right = (w + h) * x + b - y",
              "    error_left = (w - h) * x + b - y",
              "    slope = (np.mean(error_right * error_right) - np.mean(error_left * error_left)) / (2 * h)",
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
            "The slope of the loss is how much the loss changes per unit change of a parameter.",
            "Numeric slope: `(loss(w + h) - loss(w - h)) / (2 * h)` with a small `h`.",
            "Negative slope: increase the parameter. Positive slope: decrease it. Near 0: you are near the bottom.",
            "The gradient is one slope per parameter, here one for `w` and one for `b`.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "gradient-descent-01-q1",
      question: "The slope of the loss at the current `w` is `-8`. Which way should `w` move to lower the loss?",
      options: ["Make `w` smaller", "Make `w` larger", "Leave `w` as it is"],
      answer: 1,
      explanation: "A negative slope means the loss falls as `w` grows, so move against the sign: increase `w`.",
    },
    {
      id: "gradient-descent-01-q2",
      question: "Which expression measures the slope of `loss` at `w` with a small `h`?",
      options: [
        "`loss(w + h) - loss(w - h)`",
        "`(loss(w) + loss(h)) / 2`",
        "`(loss(w + h) - loss(w - h)) / (2 * h)`",
        "`loss(w) / w`",
      ],
      answer: 2,
      explanation: "Divide the change in the loss by the distance `2 * h` between the two points.",
    },
    {
      id: "gradient-descent-01-q3",
      question: "What does a slope close to 0 tell you?",
      options: [
        "The loss is almost flat here, so you are near the bottom",
        "The loss is 0",
        "The learning has failed",
      ],
      answer: 0,
      explanation: "A slope near 0 means nudging the parameter barely changes the loss, which happens at the bottom of the bowl.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])",
    "y = np.array([1.1, 2.8, 5.0, 7.2, 8.9])",
    "b = 1.0",
    "",
    "def loss(w):",
    "    error = w * x + b - y",
    "    return np.mean(error ** 2)",
    "",
    "# Measure the slope at a few values of w. Where does it change sign?",
    "h = 0.001",
    "w = 1.5",
    "slope = (loss(w + h) - loss(w - h)) / (2 * h)",
    "print(slope)",
    "",
  ].join("\n"),
};
