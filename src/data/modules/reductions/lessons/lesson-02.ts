import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "Reduce along one axis instead of the whole array: `axis=0` gives one result per column, `axis=1` one result per row.",
  estimatedMinutes: 14,
  sections: [
    {
      title: "What an axis is",
      blocks: [
        {
          kind: "text",
          text: "An axis is one of the directions of an array, numbered from 0. Each axis matches one entry of the shape.",
        },
        {
          kind: "text",
          text: "In a 2D array of shape `(2, 3)`, axis 0 runs down the rows and has length 2. Axis 1 runs across the columns and has length 3.",
        },
      ],
    },
    {
      title: "Why reduce along an axis",
      blocks: [
        {
          kind: "text",
          text: "Data for machine learning is usually a 2D array: one row per example and one column per feature. A feature is one measured property, such as age or price.",
        },
        {
          kind: "text",
          text: "You often want one number per feature, such as its average, or one number per example, such as its total. A single number for the whole table mixes them all up.",
        },
      ],
    },
    {
      title: "axis=0 and axis=1",
      blocks: [
        {
          kind: "text",
          text: "Pass `axis` to a reduction to collapse only that direction. `axis=0` works down the rows and leaves one result per column; `axis=1` works across the columns and leaves one result per row.",
        },
        {
          kind: "note",
          text: "The rule to remember: the axis you name is the one that disappears. Shape `(2, 3)` with `axis=0` becomes `(3,)`; with `axis=1` it becomes `(2,)`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "a = np.array([[1, 2, 3], [4, 5, 6]])",
            "print(a.sum(axis=0))",
            "print(a.sum(axis=1))",
            "print(a.sum(axis=0).shape)",
            "print(a.sum(axis=1).shape)",
          ].join("\n"),
          output: ["[5 7 9]", "[ 6 15]", "(3,)", "(2,)"].join("\n"),
        },
        {
          kind: "text",
          text: "`[5 7 9]` is 1 + 4, 2 + 5 and 3 + 6: each column added up. `[ 6 15]` is 1 + 2 + 3 and 4 + 5 + 6: each row added up.",
        },
        {
          kind: "note",
          text: "A 2D array has only axes 0 and 1. `a.sum(axis=2)` raises an `AxisError`, saying axis 2 is out of bounds for an array of dimension 2.",
        },
      ],
    },
    {
      title: "Practical example: students and tests",
      blocks: [
        {
          kind: "text",
          text: "Each row holds one student's scores, and each column one test. The mean along axis 0 is the average of each test; along axis 1 it is the average of each student.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "scores = np.array([[70, 80, 90], [60, 75, 90], [80, 85, 90]])",
            "print(scores.mean(axis=0))",
            "print(scores.mean(axis=1))",
            "print(scores.max(axis=0))",
          ].join("\n"),
          output: ["[70. 80. 90.]", "[80. 75. 85.]", "[80 85 90]"].join("\n"),
        },
        {
          kind: "text",
          text: "Switch the reduction, the axis and the number of rows, and watch which cells collapse into each result, including what axis 2 does.",
        },
        {
          kind: "playground",
          demo: {
            title: "Reduce along an axis",
            controls: [
              {
                type: "select",
                name: "fn",
                label: "Reduction",
                options: [
                  { label: "sum", value: "sum" },
                  { label: "mean", value: "mean" },
                  { label: "max", value: "max" },
                ],
              },
              {
                type: "select",
                name: "axis",
                label: "Axis",
                options: [
                  { label: "0", value: "0" },
                  { label: "1", value: "1" },
                  { label: "None", value: "None" },
                  { label: "2", value: "2" },
                ],
              },
              { type: "number", name: "rows", label: "Rows", min: 2, max: 4, initial: 2 },
            ],
            template: [
              "import numpy as np",
              "X = np.arange(1, {{rows}} * 3 + 1).reshape({{rows}}, 3)",
              "r = X.{{fn}}(axis={{axis}})",
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
            "An axis is one direction of an array; a 2D array has axes 0 and 1.",
            "`axis=0` reduces down the rows and gives one result per column.",
            "`axis=1` reduces across the columns and gives one result per row.",
            "The axis you name is the one that disappears from the shape.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "reductions-02-q1",
      question: "`X` has shape `(5, 3)`. What is the shape of `X.mean(axis=0)`?",
      options: ["(5,)", "(3,)", "(5, 3)", "()"],
      answer: 1,
      explanation: "Axis 0, of length 5, disappears and the 3 columns remain.",
    },
    {
      id: "reductions-02-q2",
      question: "What is `np.array([[1, 2], [3, 4]]).sum(axis=1)`?",
      options: ["[4 6]", "10", "[3 7]"],
      answer: 2,
      explanation: "`axis=1` adds across each row: 1 + 2 and 3 + 4.",
    },
    {
      id: "reductions-02-q3",
      question: "Rows are examples and columns are features. Which call gives the average of each feature?",
      options: ["X.mean(axis=1)", "X.mean()", "X.mean(axis=2)", "X.mean(axis=0)"],
      answer: 3,
      explanation: "`axis=0` collapses the rows, leaving one mean per column, which is one per feature.",
    },
  ],
};
