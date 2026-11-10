import type { LessonContent } from "@/features/content/types";

export const LESSON_08: LessonContent = {
  lessonId: "08",
  summary:
    "Put element-wise multiplication and broadcasting together in `X * w + b`, the pattern of weighting inputs and adding a bias used throughout machine learning.",
  estimatedMinutes: 20,
  sections: [
    {
      title: "The parts of X * w + b",
      blocks: [
        {
          kind: "text",
          text: "This expression scales a table of inputs by a set of weights, then shifts the result by a bias. Each part has a name.",
        },
        {
          kind: "list",
          items: [
            "`X`, the input matrix: a 2D array where each row is one example, such as one house, and each column is one feature, such as its size or its age.",
            "`w`, the weights: a 1D array with one number per feature, saying how much that feature counts.",
            "`b`, the bias: values added after weighting to shift the result. Here it is one number per feature, a 1D array like `w`.",
          ],
        },
        {
          kind: "note",
          text: "Multiplication happens before addition, as in ordinary math, so `X * w + b` means `(X * w) + b`.",
        },
      ],
    },
    {
      title: "Where this pattern appears",
      blocks: [
        {
          kind: "text",
          text: "Weighting inputs and adding a bias is the basic step of linear models and of each layer in a neural network. Rescaling data column by column follows the same pattern.",
        },
        {
          kind: "text",
          text: "In a full model, the weighted features of each row are also added up into one prediction, using matrix multiplication (`@`). This lesson keeps every feature separate, so each step stays element-wise.",
        },
      ],
    },
    {
      title: "Step 1: multiply each column by its weight",
      blocks: [
        {
          kind: "text",
          text: "`X` has shape `(rows, features)` and `w` has shape `(features,)`. By the broadcasting rules, `w` is applied to every row, so each column of `X` is multiplied by its own weight.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1, 2, 3], [4, 5, 6]])",
            "w = np.array([10, 0, -1])",
            "print(X.shape, w.shape)",
            "print(X * w)",
          ].join("\n"),
          output: ["(2, 3) (3,)", "[[10  0 -3]", " [40  0 -6]]"].join("\n"),
        },
        {
          kind: "text",
          text: "Column 0 is multiplied by 10, column 1 by 0 and column 2 by -1. The result has the same shape as `X`.",
        },
      ],
    },
    {
      title: "Step 2: add the bias to every row",
      blocks: [
        {
          kind: "text",
          text: "`b` has shape `(features,)`, like `w`. Adding it to the `(rows, features)` result broadcasts again: `b` is added to every row.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1, 2, 3], [4, 5, 6]])",
            "w = np.array([10, 0, -1])",
            "b = np.array([1, 2, 3])",
            "scaled = X * w",
            "shifted = scaled + b",
            "print(shifted)",
            "print(shifted.shape)",
          ].join("\n"),
          output: ["[[11  2  0]", " [41  2 -3]]", "(2, 3)"].join("\n"),
        },
        {
          kind: "text",
          text: "A scalar bias works too: adding a single number such as `5` shifts every element by 5.",
        },
        {
          kind: "text",
          text: "Step through `X * w + b` and watch `X * w` appear first, then the bias added to each row.",
        },
        { kind: "demo", demo: "xwb-steps" },
      ],
    },
    {
      title: "Checking shapes before you compute",
      blocks: [
        {
          kind: "text",
          text: "Before running the expression, check that `w` and `b` each have one value per column of `X`, or are a scalar.",
        },
        {
          kind: "note",
          text: "If `X` has 2 columns and `w` has 3 values, the last axes are 2 and 3. They differ and neither is 1, so NumPy raises `operands could not be broadcast together`.",
        },
      ],
    },
    {
      title: "Recap",
      blocks: [
        {
          kind: "list",
          items: [
            "`X` holds one example per row and one feature per column.",
            "`X * w` broadcasts `w` across the rows, weighting each column.",
            "Adding `b` broadcasts again and shifts each column of every row.",
            "Every step keeps the shape of `X`, as long as `w` and `b` match its number of columns.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "08-q1",
      question: "In the input matrix `X`, what does one row usually represent?",
      options: ["One feature", "One example, such as one house", "One weight"],
      answer: 1,
      explanation: "Rows are examples; columns are features.",
    },
    {
      id: "08-q2",
      question: "`X` has shape `(4, 3)` and `w` has shape `(3,)`. What is the shape of `X * w`?",
      options: ["(3,)", "(4,)", "(4, 3)", "(3, 4)"],
      answer: 2,
      explanation: "`w` broadcasts across the 4 rows, so the result keeps the shape of `X`.",
    },
    {
      id: "08-q3",
      question: "Which part of `X * w + b` is computed first?",
      options: ["`X * w`", "`w + b`", "Both at the same time"],
      answer: 0,
      explanation: "Multiplication comes before addition.",
    },
    {
      id: "08-q4",
      question: "`X` has shape `(5, 2)`. Which `b` can be added to `X * w`?",
      options: ["An array of shape `(5,)`", "An array of shape `(2,)`", "An array of shape `(3,)`"],
      answer: 1,
      explanation: "`b` must match the last axis of `X * w`, which has size 2.",
    },
  ],
};
