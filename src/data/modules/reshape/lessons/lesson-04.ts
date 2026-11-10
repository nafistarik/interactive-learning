import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "Put reshape and masks to work on two everyday tasks: flatten a stack of small images into one row each, and keep only the rows of a table that meet a condition.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "Two common data tasks",
      blocks: [
        {
          kind: "text",
          text: "Most models expect a 2D table: one row per example, one column per feature. Images are not stored that way, so they are flattened first.",
        },
        {
          kind: "text",
          text: "Data also needs filtering: only the labelled examples, only the positive readings. A mask over the rows does that in one step.",
        },
      ],
    },
    {
      title: "Why flatten images",
      blocks: [
        {
          kind: "text",
          text: "A grayscale image is a 2D grid of brightness values. A stack of `n` images of `h` by `w` pixels has shape `(n, h, w)`.",
        },
        {
          kind: "text",
          text: "A simple model treats each pixel as one feature, so it needs shape `(n, h * w)`: each image becomes one row. `reshape(n, -1)` does this and keeps each image's pixels together, in row-major order.",
        },
      ],
    },
    {
      title: "Flattening a stack of images",
      blocks: [
        {
          kind: "text",
          text: "Here are three tiny 2×2 images. `images.reshape(3, -1)` gives one row of 4 pixels per image.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "images = np.array([",
            "    [[0, 1], [2, 3]],",
            "    [[9, 8], [7, 6]],",
            "    [[4, 4], [5, 5]],",
            "])",
            "print(images.shape)",
            "flat = images.reshape(3, -1)",
            "print(flat)",
            "print(flat.shape)",
          ].join("\n"),
          output: ["(3, 2, 2)", "[[0 1 2 3]", " [9 8 7 6]", " [4 4 5 5]]", "(3, 4)"].join("\n"),
        },
        {
          kind: "note",
          text: "`images.reshape(4, -1)` also runs, giving `(4, 3)`, but its rows mix pixels from different images. Keep the number of images as the first size and put `-1` after it.",
        },
        {
          kind: "text",
          text: "Pick a shape for the stack. Follow where each pixel lands, and find the shape that does not fit 12 pixels.",
        },
        {
          kind: "playground",
          demo: {
            title: "Flatten three 2×2 images",
            controls: [
              {
                type: "select",
                name: "shape",
                label: "New shape",
                options: [
                  { label: "(3, -1)", value: "3, -1" },
                  { label: "(-1,)", value: "-1" },
                  { label: "(4, -1)", value: "4, -1" },
                  { label: "(3, 2, 2)", value: "3, 2, 2" },
                  { label: "(3, 5)", value: "3, 5" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "images = np.array([[[0, 1], [2, 3]], [[9, 8], [7, 6]], [[4, 4], [5, 5]]])",
              "flat = images.reshape({{shape}})",
            ].join("\n"),
          },
        },
      ],
    },
    {
      title: "Selecting rows by a condition",
      blocks: [
        {
          kind: "text",
          text: "A 1D mask with one value per row selects whole rows: `X[mask]` keeps the rows where the mask is `True`, with all their columns.",
        },
        {
          kind: "text",
          text: "The mask can come from a separate array, such as labels, or from one column of `X` itself, such as `X[:, 1] > 0`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[2, 5], [-1, 3], [4, -2], [-3, -1]])",
            "y = np.array([1, 0, 1, 0])",
            "print(X[y == 1])",
            "print(X[X[:, 1] > 0])",
          ].join("\n"),
          output: ["[[ 2  5]", " [ 4 -2]]", "[[ 2  5]", " [-1  3]]"].join("\n"),
        },
        {
          kind: "text",
          text: "Both steps together: flatten the images, compute each image's mean brightness, and keep the bright ones. `np.where` turns the same mask into labels.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "images = np.array([[[0, 1], [2, 3]], [[9, 8], [7, 6]], [[4, 4], [5, 5]]])",
            "flat = images.reshape(3, -1)",
            "bright = flat.mean(axis=1) > 4",
            "print(bright)",
            "print(flat[bright])",
            "print(np.where(bright, 1, 0))",
          ].join("\n"),
          output: ["[False  True  True]", "[[9 8 7 6]", " [4 4 5 5]]", "[0 1 1]"].join("\n"),
        },
      ],
    },
    {
      title: "Recap",
      blocks: [
        {
          kind: "list",
          items: [
            "A stack of images `(n, h, w)` becomes a table `(n, h * w)` with `reshape(n, -1)`.",
            "Keep the number of examples first, so each row holds one whole example.",
            "A 1D mask with one value per row selects whole rows: `X[mask]`.",
            "Masks can come from labels or from a column, such as `X[:, 0] > 0`.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "reshape-04-q1",
      question: "`images` has shape `(10, 8, 8)`. What is the shape of `images.reshape(10, -1)`?",
      options: ["(10, 8)", "(80, 8)", "(10, 64)", "(640,)"],
      answer: 2,
      explanation: "Each image keeps its own row, and 8 × 8 = 64 pixels fill it.",
    },
    {
      id: "reshape-04-q2",
      question: "`X` has shape `(5, 3)` and `mask` is a boolean array of shape `(5,)` with 2 `True` values. What is `X[mask].shape`?",
      options: ["(2, 3)", "(2,)", "(5, 3)"],
      answer: 0,
      explanation: "A row mask keeps 2 whole rows, each with its 3 columns.",
    },
    {
      id: "reshape-04-q3",
      question: "Which expression keeps the rows of `X` whose first column is negative?",
      options: ["X[X < 0]", "X[X[:, 0] < 0]", "X[:, 0] < 0", "X[0] < 0"],
      answer: 1,
      explanation: "`X[:, 0] < 0` is one boolean per row, so `X[...]` keeps those rows.",
    },
  ],
};
