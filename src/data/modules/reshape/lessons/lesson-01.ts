import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "Give the same elements a new shape with `reshape`. The total number of elements must stay the same, and `-1` lets NumPy work out one size for you.",
  estimatedMinutes: 14,
  sections: [
    {
      title: "What reshape does",
      blocks: [
        {
          kind: "text",
          text: "To reshape an array is to give it a new shape while keeping the same elements. Twelve numbers can be one row of 12, a grid of 3 rows and 4 columns, or 6 rows of 2.",
        },
        {
          kind: "text",
          text: "`a.reshape(3, 4)` returns the elements of `a` arranged in 3 rows and 4 columns. `a` itself keeps its shape.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "a = np.arange(12)",
            "m = a.reshape(3, 4)",
            "print(a.shape)",
            "print(m)",
            "print(m.shape)",
          ].join("\n"),
          output: ["(12,)", "[[ 0  1  2  3]", " [ 4  5  6  7]", " [ 8  9 10 11]]", "(3, 4)"].join("\n"),
        },
      ],
    },
    {
      title: "Why change a shape",
      blocks: [
        {
          kind: "text",
          text: "Data often arrives in one long row: readings from a sensor, pixels of an image, or values read from a file. To work with it as a table, you give it rows and columns.",
        },
        {
          kind: "text",
          text: "Many NumPy operations and machine learning tools also expect a particular shape, such as one row per example. Reshape is how you get there without copying values by hand.",
        },
      ],
    },
    {
      title: "Row-major order and matching sizes",
      blocks: [
        {
          kind: "note",
          text: "Row-major order means reading an array row by row, left to right, like text on a page. NumPy reads the elements in this order and fills the new shape in the same order.",
        },
        {
          kind: "text",
          text: "So the first row of the result takes the first elements, the next row takes the next ones, and so on. The order of the elements never changes, only where the rows break.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "a = np.arange(12)",
            "print(a.reshape(2, 6))",
            "print(a.reshape(6, 2))",
          ].join("\n"),
          output: [
            "[[ 0  1  2  3  4  5]",
            " [ 6  7  8  9 10 11]]",
            "[[ 0  1]",
            " [ 2  3]",
            " [ 4  5]",
            " [ 6  7]",
            " [ 8  9]",
            " [10 11]]",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "The new shape must hold exactly as many elements as the old one. 12 elements fit `(3, 4)` or `(2, 6)`, because 3 × 4 and 2 × 6 are both 12.",
        },
        {
          kind: "note",
          text: "`a.reshape(5, 2)` on 12 elements raises `ValueError: cannot reshape array of size 12 into shape (5,2)`, because 5 × 2 is only 10. NumPy never drops or invents elements.",
        },
      ],
    },
    {
      title: "Letting NumPy compute a size with -1",
      blocks: [
        {
          kind: "text",
          text: "Write `-1` for one of the sizes and NumPy computes it from the total. `a.reshape(-1, 2)` means: 2 columns, and as many rows as needed.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "a = np.arange(1, 9)",
            "print(a.reshape(-1, 2).shape)",
            "print(a.reshape(2, -1))",
          ].join("\n"),
          output: ["(4, 2)", "[[1 2 3 4]", " [5 6 7 8]]"].join("\n"),
        },
        {
          kind: "text",
          text: "Only one size can be `-1`, and the others must divide the total evenly. This is useful when the number of rows depends on the data but the number of columns is fixed.",
        },
        {
          kind: "text",
          text: "To go back to 1D, use `ravel()`, `flatten()` or `reshape(-1)`. All three read the elements in row-major order.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "m = np.array([[1, 2, 3], [4, 5, 6]])",
            "print(m.ravel())",
            "print(m.flatten())",
            "print(m.reshape(-1))",
          ].join("\n"),
          output: ["[1 2 3 4 5 6]", "[1 2 3 4 5 6]", "[1 2 3 4 5 6]"].join("\n"),
        },
        {
          kind: "note",
          text: "`flatten()` always makes a copy. `ravel()` and `reshape` avoid a copy when they can, so they are often faster; the values you see are the same.",
        },
      ],
    },
    {
      title: "Practical example: months into quarters",
      blocks: [
        {
          kind: "text",
          text: "Twelve monthly sales figures become a table with one row per quarter and three months per row.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "sales = np.array([3, 5, 4, 6, 7, 5, 8, 9, 7, 6, 4, 5])",
            "quarters = sales.reshape(4, 3)",
            "print(quarters)",
            "print(quarters[2])",
          ].join("\n"),
          output: ["[[3 5 4]", " [6 7 5]", " [8 9 7]", " [6 4 5]]", "[8 9 7]"].join("\n"),
        },
        {
          kind: "text",
          text: "Pick a target shape and follow each element from its place in `a` to its place in the result. One shape does not fit; see what NumPy says about it.",
        },
        {
          kind: "playground",
          demo: {
            title: "Reshape 12 elements",
            controls: [
              {
                type: "select",
                name: "shape",
                label: "New shape",
                options: [
                  { label: "(3, 4)", value: "3, 4" },
                  { label: "(2, 6)", value: "2, 6" },
                  { label: "(6, 2)", value: "6, 2" },
                  { label: "(-1, 3)", value: "-1, 3" },
                  { label: "(4, -1)", value: "4, -1" },
                  { label: "(12,)", value: "12" },
                  { label: "(5, 2)", value: "5, 2" },
                ],
              },
            ],
            template: ["import numpy as np", "a = np.arange(12)", "r = a.reshape({{shape}})"].join("\n"),
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
            "`reshape` gives the same elements a new shape; the original array keeps its shape.",
            "Elements are read and filled in row-major order, row by row.",
            "The total number of elements must stay the same, or NumPy raises a `ValueError`.",
            "`-1` lets NumPy compute one size from the others.",
            "`ravel()`, `flatten()` and `reshape(-1)` turn an array back into 1D.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "reshape-01-q1",
      question: "An array has 12 elements. Which shape can it NOT be reshaped into?",
      options: ["(4, 3)", "(2, 2, 3)", "(5, 2)", "(12, 1)"],
      answer: 2,
      explanation: "5 × 2 is 10, not 12, and reshape must keep every element.",
    },
    {
      id: "reshape-01-q2",
      question: "What is the shape of `np.arange(10).reshape(-1, 5)`?",
      options: ["(2, 5)", "(5, 2)", "(10, 5)"],
      answer: 0,
      explanation: "With 5 columns, 10 elements need 2 rows, so `-1` becomes 2.",
    },
    {
      id: "reshape-01-q3",
      question: "What is the first row of `np.arange(6).reshape(2, 3)`?",
      options: ["[0 2 4]", "[0 1]", "[0 3]", "[0 1 2]"],
      answer: 3,
      explanation: "Row-major order fills the first row with the first three elements.",
    },
  ],
};
