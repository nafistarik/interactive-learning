import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "Every array has a shape: the length of each of its axes. Learn to read `shape`, `ndim` and `size`, and to build an array of a chosen shape.",
  estimatedMinutes: 12,
  sections: [
    {
      title: "What shape, ndim and size tell you",
      blocks: [
        {
          kind: "text",
          text: "The shape of an array lists the length of each axis. NumPy gives it as a tuple: Python's fixed, ordered group of values, written in parentheses like `(2, 3)`.",
        },
        {
          kind: "list",
          items: [
            "`shape`: the length of every axis, such as `(2, 3)`.",
            "`ndim`: the number of axes, which equals `len(shape)`.",
            "`size`: the total number of elements, the product of the numbers in the shape.",
          ],
        },
      ],
    },
    {
      title: "Rows and columns in a shape",
      blocks: [
        {
          kind: "text",
          text: "For a 2D array the shape reads `(rows, columns)`. The first number is the length of axis 0, the rows; the second is the length of axis 1, the columns.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "m = np.array([[1, 2, 3], [4, 5, 6]])",
            "print(m.shape)",
            "print(m.ndim)",
            "print(m.size)",
          ].join("\n"),
          output: ["(2, 3)", "2", "6"].join("\n"),
        },
        {
          kind: "text",
          text: "This array has 2 rows and 3 columns, so 2 axes and 2 × 3 = 6 elements.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "v = np.array([7, 8, 9])",
            "print(v.shape)",
            "print(len(v.shape))",
          ].join("\n"),
          output: ["(3,)", "1"].join("\n"),
        },
        {
          kind: "note",
          text: "A 1D shape has one number and a trailing comma, such as `(3,)`. The comma is how Python writes a tuple with a single item.",
        },
        {
          kind: "text",
          text: "A 3D shape such as `(2, 3, 4)` reads as 2 layers, each with 3 rows and 4 columns.",
        },
      ],
    },
    {
      title: "Why shape is the first thing to check",
      blocks: [
        {
          kind: "text",
          text: "Many NumPy errors are shape errors: two arrays whose shapes do not fit together. Printing `.shape` is the quickest way to see what you are holding.",
        },
        {
          kind: "text",
          text: "In later lessons, the shapes of two arrays decide whether they can be combined, and how.",
        },
      ],
    },
    {
      title: "Building an array with a chosen shape",
      blocks: [
        {
          kind: "text",
          text: "`np.arange(n)` makes the numbers 0 to n - 1 as a 1D array. `np.arange(start, stop)` starts at `start` and stops just before `stop`.",
        },
        {
          kind: "text",
          text: "`reshape` arranges the same elements, in the same order, into a new shape. The new shape must hold exactly as many elements.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "a = np.arange(6)",
            "print(a.shape)",
            "m = a.reshape((2, 3))",
            "print(m)",
            "print(m.shape)",
          ].join("\n"),
          output: ["(6,)", "[[0 1 2]", " [3 4 5]]", "(2, 3)"].join("\n"),
        },
        {
          kind: "note",
          text: "Reshaping 6 elements into `(4, 2)` fails, because 4 × 2 = 8 and the sizes must match.",
        },
        {
          kind: "text",
          text: "Pick a structure and see its shape, number of dimensions and size.",
        },
        { kind: "demo", demo: "shape-picker" },
      ],
    },
    {
      title: "Recap",
      blocks: [
        {
          kind: "list",
          items: [
            "`shape` is a tuple with the length of each axis; for 2D it is `(rows, columns)`.",
            "`ndim` is the number of axes and `size` the total number of elements.",
            "A 1D shape is written with a trailing comma, like `(4,)`.",
            "`reshape` changes the shape without changing the elements or their order.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "03-q1",
      question: "What is the shape of an array with 3 rows and 2 columns?",
      options: ["(2, 3)", "(3, 2)", "(6,)", "(3,)"],
      answer: 1,
      explanation: "A 2D shape lists rows first, then columns.",
    },
    {
      id: "03-q2",
      question: "An array has shape `(2, 3, 4)`. What is its `size`?",
      options: ["9", "3", "24"],
      answer: 2,
      explanation: "`size` is the product of the shape: 2 × 3 × 4 = 24.",
    },
    {
      id: "03-q3",
      question: "Why does `np.array([5, 6, 7, 8]).shape` show `(4,)` with a comma?",
      options: [
        "It is a tuple with one item",
        "The array has a hidden second axis",
        "The comma means the array is empty",
      ],
      answer: 0,
      explanation: "Python writes a one-item tuple with a trailing comma.",
    },
    {
      id: "03-q4",
      question: "What does `ndim` count?",
      options: ["The number of elements", "The number of axes", "The number of rows"],
      answer: 1,
      explanation: "`ndim` is the number of axes, the same as `len(shape)`.",
    },
  ],
};
