import type { LessonContent } from "@/features/content/types";

export const LESSON_07: LessonContent = {
  lessonId: "07",
  summary:
    "Broadcasting lets NumPy combine arrays of different shapes, such as a matrix and a single row. Learn the rules that decide when shapes fit.",
  estimatedMinutes: 18,
  sections: [
    {
      title: "What broadcasting is",
      blocks: [
        {
          kind: "text",
          text: "Broadcasting is how NumPy runs an element-wise operation on two arrays of different shapes. The smaller array is stretched to match the larger one.",
        },
        {
          kind: "text",
          text: "The stretching is virtual: NumPy makes no copy, it reuses the same values as if they were repeated.",
        },
      ],
    },
    {
      title: "Why NumPy stretches arrays for you",
      blocks: [
        {
          kind: "text",
          text: "Without broadcasting, adding one number to every element, or scaling every column, would first need a full-size array of repeated values.",
        },
        {
          kind: "text",
          text: "Broadcasting lets you write `m + 1` or `m * row` directly. The code is shorter and uses less memory.",
        },
      ],
    },
    {
      title: "Broadcasting a scalar",
      blocks: [
        {
          kind: "text",
          text: "A scalar, a single number, combined with an array is used for every element.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "m = np.array([[1, 2, 3], [4, 5, 6]])",
            "print(m + 10)",
            "print(m * 2)",
          ].join("\n"),
          output: ["[[11 12 13]", " [14 15 16]]", "[[ 2  4  6]", " [ 8 10 12]]"].join("\n"),
        },
      ],
    },
    {
      title: "The broadcasting rules",
      blocks: [
        {
          kind: "text",
          text: "NumPy decides whether two shapes fit by comparing them axis by axis, starting from the right.",
        },
        {
          kind: "list",
          items: [
            "Line the two shapes up on the right and compare the last axes first, then move left.",
            "Two sizes are compatible when they are equal, or when one of them is 1.",
            "If one shape has fewer axes, each missing axis on the left counts as 1.",
            "A size of 1 is stretched to match the other size.",
            "If any pair is incompatible, NumPy stops with the error `operands could not be broadcast together`.",
          ],
        },
        {
          kind: "text",
          text: "On each axis, the result takes the larger of the two sizes.",
        },
        {
          kind: "note",
          text: "Compatible: `(2, 3)` and `(3,)`. Compare 3 with 3: equal. Compare 2 with the missing axis, which counts as 1: compatible. The result has shape `(2, 3)`.",
        },
        {
          kind: "note",
          text: "Incompatible: `(2, 3)` and `(2,)`. Compare 3 with 2: they differ and neither is 1. `np.ones((2, 3)) + np.ones(2)` raises a `ValueError`: `operands could not be broadcast together with shapes (2,3) (2,)`.",
        },
      ],
    },
    {
      title: "Broadcasting a 1D array across rows",
      blocks: [
        {
          kind: "text",
          text: "A 1D array whose length equals the number of columns is applied to every row. Each column is combined with its own value.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "m = np.array([[1, 2, 3], [4, 5, 6]])",
            "row = np.array([1, 10, 100])",
            "print(m.shape, row.shape)",
            "print(m * row)",
          ].join("\n"),
          output: ["(2, 3) (3,)", "[[  1  20 300]", " [  4  50 600]]"].join("\n"),
        },
        {
          kind: "text",
          text: "To use one value per row instead, give the array shape `(rows, 1)`, a single column. Its size-1 axis stretches across the columns.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "m = np.array([[1, 2, 3], [4, 5, 6]])",
            "col = np.array([[10], [20]])",
            "print(col.shape)",
            "print(m + col)",
          ].join("\n"),
          output: ["(2, 1)", "[[11 12 13]", " [24 25 26]]"].join("\n"),
        },
        {
          kind: "text",
          text: "Change the two shapes and see whether they broadcast, and which rule decides it.",
        },
        { kind: "demo", demo: "broadcast-shapes" },
      ],
    },
    {
      title: "Recap",
      blocks: [
        {
          kind: "list",
          items: [
            "Broadcasting combines arrays of different shapes without copying data.",
            "Shapes are compared from the right; sizes fit when equal or when one is 1.",
            "A missing axis counts as 1; any other mismatch raises an error.",
            "A `(columns,)` array applies to every row; a `(rows, 1)` array applies to every column.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "07-q1",
      question: "When NumPy compares two shapes for broadcasting, where does it start?",
      options: ["At the leftmost axis", "At the rightmost axis", "At the longest axis"],
      answer: 1,
      explanation: "Shapes are lined up on the right and compared from the last axis.",
    },
    {
      id: "07-q2",
      question: "Do shapes `(4, 3)` and `(3,)` broadcast?",
      options: [
        "Yes, to `(4, 3)`",
        "No, because they have different numbers of axes",
        "Yes, to `(4, 3, 3)`",
      ],
      answer: 0,
      explanation: "3 matches 3, and the missing axis counts as 1, which stretches to 4.",
    },
    {
      id: "07-q3",
      question: "Do shapes `(3, 2)` and `(3,)` broadcast?",
      options: [
        "Yes, to `(3, 2)`",
        "Yes, to `(3, 3)`",
        "No, because 2 and 3 differ and neither is 1",
      ],
      answer: 2,
      explanation: "The last axes, 2 and 3, are not equal and neither is 1.",
    },
    {
      id: "07-q4",
      question: "Two sizes on the same axis are compatible when...",
      options: [
        "the first is larger than the second",
        "both are greater than 1",
        "their product is less than 100",
        "they are equal, or one of them is 1",
      ],
      answer: 3,
      explanation: "Equal sizes pair up directly, and a size of 1 stretches to fit.",
    },
  ],
};
