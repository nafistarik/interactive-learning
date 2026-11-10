import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "Some questions have a yes or no answer. Write the answers as labels 0 and 1, and see why the scores of a linear model are not yet probabilities.",
  estimatedMinutes: 12,
  sections: [
    {
      title: "Classification: predicting a yes or no",
      blocks: [
        {
          kind: "text",
          text: "In Module 1.1 the model predicted a number, such as a price. Classification predicts a category instead: did the student pass, is the email spam, is the tumor malignant.",
        },
        {
          kind: "note",
          text: "A label is the right answer for one example. With two categories (binary classification), the label is `1` for yes and `0` for no.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "hours = np.array([0.5, 1.0, 1.5, 2.0, 3.0, 3.5, 4.0, 4.5])",
            "passed = np.array([0, 0, 0, 0, 1, 1, 1, 1])",
            "print(passed)",
            "print(np.mean(passed))",
          ].join("\n"),
          output: ["[0 0 0 0 1 1 1 1]", "0.5"].join("\n"),
        },
        {
          kind: "text",
          text: "`hours` is the feature: how long each of eight students studied. `passed` holds their labels. Because the labels are 0 and 1, their mean is the fraction of yes answers.",
        },
      ],
    },
    {
      title: "Why the answer should be a probability",
      blocks: [
        {
          kind: "text",
          text: "A probability is a number from 0 to 1 that says how likely something is: 0 means never, 1 means certain, 0.5 means even odds.",
        },
        {
          kind: "text",
          text: "A model that outputs a probability tells you how sure it is. \"0.95 likely to pass\" and \"0.55 likely to pass\" both lean yes, but you would act on them differently.",
        },
      ],
    },
    {
      title: "Scores from a linear model",
      blocks: [
        {
          kind: "text",
          text: "Start with the model you already know. For each example it computes a score `z = X @ w + b`: a weighted sum of the features plus a bias. With one feature this is `z = w * x + b`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1.0, 8.0], [3.0, 6.0], [4.0, 7.0]])",
            "w = np.array([0.8, 0.2])",
            "b = -3.0",
            "z = X @ w + b",
            "print(z.shape)",
            "print(np.round(z, 3))",
          ].join("\n"),
          output: ["(3,)", "[-0.6  0.6  1.6]"].join("\n"),
        },
        {
          kind: "text",
          text: "One score per example. A higher score should mean \"more likely yes\", but the scores can be any number, negative or above 1.",
        },
      ],
    },
    {
      title: "A practical example: a line through pass and fail",
      blocks: [
        {
          kind: "text",
          text: "Use the scores of a line directly as answers for the students, and look at the range of values it gives.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "hours = np.array([0.5, 1.0, 1.5, 2.0, 3.0, 3.5, 4.0, 4.5])",
            "w = 0.5",
            "b = -1.0",
            "z = w * hours + b",
            "print(z)",
            "print(z.min(), z.max())",
          ].join("\n"),
          output: ["[-0.75 -0.5  -0.25  0.    0.5   0.75  1.    1.25]", "-0.75 1.25"].join("\n"),
        },
        {
          kind: "text",
          text: "`-0.75` and `1.25` cannot be probabilities. Any line with a slope keeps rising, so for enough hours it passes 1 and for few enough it drops below 0.",
        },
        {
          kind: "note",
          text: "The fix, in the next lesson: keep the score `z`, then pass it through a function that squeezes every number into the range 0 to 1.",
        },
      ],
    },
    {
      title: "Try it: scores of a line",
      blocks: [
        {
          kind: "text",
          text: "Pick a slope and a bias and watch the scores form. Look for scores below 0 or above 1: every option with a slope produces some.",
        },
        {
          kind: "playground",
          demo: {
            title: "Scores z = w * hours + b",
            controls: [
              {
                type: "select",
                name: "w",
                label: "Slope w",
                options: [
                  { label: "0.5", value: "0.5" },
                  { label: "1.0", value: "1.0" },
                  { label: "2.0", value: "2.0" },
                ],
              },
              {
                type: "select",
                name: "b",
                label: "Bias b",
                options: [
                  { label: "-1.0", value: "-1.0" },
                  { label: "-2.5", value: "-2.5" },
                  { label: "-5.0", value: "-5.0" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "hours = np.array([0.5, 1.0, 1.5, 2.0, 3.0, 3.5, 4.0, 4.5])",
              "w = {{w}}",
              "b = {{b}}",
              "z = w * hours + b",
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
            "Classification predicts a category; binary classification uses labels `1` (yes) and `0` (no).",
            "A probability is a number from 0 to 1 that says how likely the answer is yes.",
            "A linear model gives each example a score `z = X @ w + b`.",
            "Scores can be any number, so they are not probabilities yet.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "logistic-regression-01-q1",
      question: "Which of these is a classification problem?",
      options: [
        "Predicting the price of a house",
        "Predicting whether an email is spam",
        "Predicting tomorrow's temperature",
      ],
      answer: 1,
      explanation: "Spam or not spam is a category; the other two predict numbers.",
    },
    {
      id: "logistic-regression-01-q2",
      question: "The labels are `np.array([1, 0, 0, 1, 1])`. What does `np.mean(labels)` give?",
      options: ["0.6", "0.4", "3"],
      answer: 0,
      explanation: "Three of the five labels are 1, so the mean is 3 / 5 = 0.6.",
    },
    {
      id: "logistic-regression-01-q3",
      question: "Why can't the score `z = w * x + b` be used as a probability?",
      options: [
        "It is always negative",
        "It needs a matrix, not a vector",
        "It can be below 0 or above 1",
      ],
      answer: 2,
      explanation: "A probability must lie between 0 and 1; a sloped line leaves that range.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "# Hours studied and whether each student passed (1) or not (0).",
    "hours = np.array([0.5, 1.0, 1.5, 2.0, 3.0, 3.5, 4.0, 4.5])",
    "passed = np.array([0, 0, 0, 0, 1, 1, 1, 1])",
    "",
    "w = 0.5",
    "b = -1.0",
    "z = w * hours + b",
    "print(z)",
    "",
    "# Try: change w and b, then add a student who studied 10 hours. Is the score still below 1?",
  ].join("\n"),
};
