import type { LessonContent } from "@/features/content/types";

export const LESSON_06: LessonContent = {
  lessonId: "06",
  summary:
    "Add, subtract, multiply and divide two arrays position by position. The result has the same shape as the inputs.",
  estimatedMinutes: 12,
  sections: [
    {
      title: "What element-wise means",
      blocks: [
        {
          kind: "text",
          text: "An element-wise operation combines two arrays position by position: the first element with the first, the second with the second, and so on.",
        },
        {
          kind: "text",
          text: "The result has the same shape as the inputs. Each of its elements depends only on the two elements at the same position.",
        },
      ],
    },
    {
      title: "Why pairing values up is so common",
      blocks: [
        {
          kind: "text",
          text: "Many real calculations pair values: price times quantity for each item, or this month's sales minus last month's for each shop.",
        },
        {
          kind: "text",
          text: "With arrays each of these is one expression. It is also vectorized, so it runs without a Python loop.",
        },
      ],
    },
    {
      title: "The four arithmetic operators",
      blocks: [
        {
          kind: "text",
          text: "`+`, `-`, `*` and `/` all work element by element on two arrays of the same shape.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([10, 20, 30])",
            "y = np.array([2, 4, 5])",
            "print(x + y)",
            "print(x - y)",
            "print(x * y)",
            "print(x / y)",
          ].join("\n"),
          output: ["[12 24 35]", "[ 8 16 25]", "[ 20  80 150]", "[5. 5. 6.]"].join("\n"),
        },
        {
          kind: "note",
          text: "`/` always returns floats, even when every division is exact, which is why the last line shows `5.` rather than `5`. Use `//` for whole-number division.",
        },
        {
          kind: "text",
          text: "The same holds in 2D: each cell is combined with the cell at the same row and column.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "p = np.array([[1, 2], [3, 4]])",
            "q = np.array([[10, 20], [30, 40]])",
            "print(p + q)",
            "print(p * q)",
          ].join("\n"),
          output: ["[[11 22]", " [33 44]]", "[[ 10  40]", " [ 90 160]]"].join("\n"),
        },
        {
          kind: "note",
          text: "`*` between arrays is not matrix multiplication. Matrix multiplication is a different operation from linear algebra, written `@` in NumPy.",
        },
      ],
    },
    {
      title: "Practical example: cost per item",
      blocks: [
        {
          kind: "text",
          text: "Given a price and a quantity for each item, one multiplication gives the cost of each item.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "prices = np.array([2.5, 4.0, 1.25])",
            "quantities = np.array([4, 2, 8])",
            "cost = prices * quantities",
            "print(cost)",
            "print(cost.sum())",
          ].join("\n"),
          output: ["[10.  8. 10.]", "28.0"].join("\n"),
        },
        {
          kind: "note",
          text: "Arrays of different lengths, such as 3 and 4 elements, cannot be paired up, and NumPy raises an error. The next lesson shows when arrays of different shapes can still be combined.",
        },
        {
          kind: "text",
          text: "Pick an operator and watch matching elements pair up and produce the result.",
        },
        { kind: "demo", demo: "elementwise" },
      ],
    },
    {
      title: "Recap",
      blocks: [
        {
          kind: "list",
          items: [
            "Element-wise operations combine elements at the same position.",
            "`+`, `-`, `*` and `/` are all element-wise on NumPy arrays.",
            "The result has the same shape as the inputs.",
            "`/` gives floats, and `*` is not matrix multiplication.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "06-q1",
      question: "What is `np.array([1, 2, 3]) + np.array([10, 20, 30])`?",
      options: ["[11 22 33]", "[ 1  2  3 10 20 30]", "66", "[10 40 90]"],
      answer: 0,
      explanation: "`+` adds the elements at each position: 1 + 10, 2 + 20, 3 + 30.",
    },
    {
      id: "06-q2",
      question: "What does `*` do between two NumPy arrays of the same shape?",
      options: [
        "Matrix multiplication",
        "Repeats the first array",
        "Multiplies the elements at each position",
      ],
      answer: 2,
      explanation: "On arrays, `*` is element-wise; matrix multiplication is `@`.",
    },
    {
      id: "06-q3",
      question: "Two arrays both have shape `(2, 3)`. What is the shape of their element-wise sum?",
      options: ["(4, 6)", "(2, 3)", "(6,)"],
      answer: 1,
      explanation: "An element-wise result keeps the shape of its inputs.",
    },
    {
      id: "06-q4",
      question: "Why does `np.array([4, 9]) / np.array([2, 3])` print `[2. 3.]`?",
      options: [
        "`/` always produces floats",
        "The inputs were floats",
        "NumPy rounds every result",
      ],
      answer: 0,
      explanation: "True division returns floats even when the result is a whole number.",
    },
  ],
};
