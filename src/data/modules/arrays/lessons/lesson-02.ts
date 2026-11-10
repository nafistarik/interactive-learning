import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "Arrays can be a line, a grid or a stack of grids. Learn what dimensions and axes are and how NumPy counts them.",
  estimatedMinutes: 12,
  sections: [
    {
      title: "What a dimension is",
      blocks: [
        {
          kind: "text",
          text: "A dimension is one direction you can move in to reach the elements. A row of numbers has one direction: left to right. A table has two: down the rows and across the columns.",
        },
        {
          kind: "note",
          text: "NumPy calls each dimension an axis. Axes are numbered from 0, and the number of axes is stored in the attribute `ndim`.",
        },
      ],
    },
    {
      title: "From a single number to stacked grids",
      blocks: [
        {
          kind: "list",
          items: [
            "0D: a single number with no direction at all. In math this is a scalar.",
            "1D: a row of values, such as `[1, 2, 3]`. In math an ordered list of numbers is a vector.",
            "2D: a grid of rows and columns, made from a list of lists. In math a grid of numbers is a matrix.",
            "3D: several 2D grids of the same size stacked like pages, made from a list of lists of lists.",
          ],
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "v = np.array([1, 2, 3])",
            "m = np.array([[1, 2, 3], [4, 5, 6]])",
            "t = np.array([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])",
            "print(v.ndim)",
            "print(m.ndim)",
            "print(t.ndim)",
          ].join("\n"),
          output: ["1", "2", "3"].join("\n"),
        },
        {
          kind: "text",
          text: "The number of nested brackets matches the number of dimensions. Every inner list at the same level must have the same length.",
        },
      ],
    },
    {
      title: "Why data comes in several dimensions",
      blocks: [
        {
          kind: "list",
          items: [
            "1D: one temperature reading per day for a week.",
            "2D: a spreadsheet, with one row per day and one column per city.",
            "3D: a colour image, with height, width and a red, green and blue value for each pixel.",
          ],
        },
        {
          kind: "text",
          text: "Knowing the number of dimensions tells you how to reach a single value: you need one index per axis.",
        },
      ],
    },
    {
      title: "Rows, columns and layers as axes",
      blocks: [
        {
          kind: "text",
          text: "In a 2D array, axis 0 runs down the rows and axis 1 runs across the columns. In a 3D array, axis 0 picks the layer, axis 1 the row and axis 2 the column.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "m = np.array([[1, 2, 3], [4, 5, 6]])",
            "print(m)",
            "t = np.array([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])",
            "print(t)",
          ].join("\n"),
          output: [
            "[[1 2 3]",
            " [4 5 6]]",
            "[[[1 2]",
            "  [3 4]]",
            "",
            " [[5 6]",
            "  [7 8]]]",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "NumPy prints a 3D array as its 2D layers, one after another, separated by a blank line.",
        },
        {
          kind: "text",
          text: "Many NumPy functions take an `axis` argument that says which direction to work along. Summing along axis 0 adds down the rows, giving one total per column.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "m = np.array([[1, 2, 3], [4, 5, 6]])",
            "print(m.sum(axis=0))",
            "print(m.sum(axis=1))",
          ].join("\n"),
          output: ["[5 7 9]", "[ 6 15]"].join("\n"),
        },
        {
          kind: "text",
          text: "Change the number of dimensions and watch how the values are arranged; a 3D array appears as stacked 2D layers.",
        },
        { kind: "demo", demo: "dimensions" },
      ],
    },
    {
      title: "Recap",
      blocks: [
        {
          kind: "list",
          items: [
            "A dimension, or axis, is one direction through the array; `ndim` counts them.",
            "A scalar has 0 dimensions, a vector 1, a matrix 2; a 3D array is a stack of matrices.",
            "In 2D, axis 0 is the rows and axis 1 the columns.",
            "Reaching one element takes one index per axis.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "02-q1",
      question: "How many dimensions does `np.array([[1, 2], [3, 4]])` have?",
      options: ["1", "2", "4"],
      answer: 1,
      explanation: "It is a list of lists, a grid of rows and columns, so it has 2 dimensions.",
    },
    {
      id: "02-q2",
      question: "What is an axis of a NumPy array?",
      options: [
        "One element of the array",
        "The largest value in the array",
        "One dimension of the array, numbered from 0",
      ],
      answer: 2,
      explanation: "NumPy uses axis as its name for a dimension, and numbers axes from 0.",
    },
    {
      id: "02-q3",
      question: "In a 2D array, which axis runs down the rows?",
      options: ["Axis 0", "Axis 1", "Axis 2"],
      answer: 0,
      explanation: "Axis 0 is the first index, which picks the row.",
    },
    {
      id: "02-q4",
      question: "What is a scalar?",
      options: [
        "A 1D array",
        "A 2D array with one row",
        "A list of lists",
        "A single number with no dimensions",
      ],
      answer: 3,
      explanation: "A scalar is one number on its own, with no axes.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "v = np.array([1, 2, 3])",
    "m = np.array([[1, 2, 3], [4, 5, 6]])",
    "print(v.ndim, m.ndim)",
    "print(m)",
    "",
    "# Try: build a 3D array from two 2x3 lists of lists and print its ndim.",
  ].join("\n"),
};
