import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "The dot product multiplies two vectors element by element and adds the results into one number. It is the building block of every matrix product.",
  estimatedMinutes: 12,
  sections: [
    {
      title: "What a vector and a dot product are",
      blocks: [
        {
          kind: "text",
          text: "In this module, a vector is a 1D array of numbers, such as `np.array([1, 2, 3])`. Its length is its number of elements.",
        },
        {
          kind: "text",
          text: "The dot product of two vectors of the same length multiplies each pair of matching elements, then adds those products up. The result is a single number, not an array.",
        },
        {
          kind: "note",
          text: "Dot product of `[1, 2, 3]` and `[4, 5, 6]`: `1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32`.",
        },
      ],
    },
    {
      title: "Why a single number is useful",
      blocks: [
        {
          kind: "text",
          text: "A dot product is a weighted sum: one vector holds values, the other holds how much each value counts. A number that says how much something counts is called a weight.",
        },
        {
          kind: "text",
          text: "Totals of this kind are everywhere: the cost of a basket of goods, a grade made of several tests, or a model's prediction made from several features.",
        },
      ],
    },
    {
      title: "Computing it in NumPy",
      blocks: [
        {
          kind: "text",
          text: "From Module 0.1 you know `a * b`, which multiplies element by element. Adding up that result gives the dot product.",
        },
        {
          kind: "text",
          text: "NumPy does both steps at once with `np.dot(a, b)`, or with the `@` operator. All three lines below give the same number.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "a = np.array([1, 2, 3])",
            "b = np.array([4, 5, 6])",
            "print(a * b)",
            "print(int((a * b).sum()))",
            "print(int(np.dot(a, b)))",
            "print(int(a @ b))",
          ].join("\n"),
          output: ["[ 4 10 18]", "32", "32", "32"].join("\n"),
        },
        {
          kind: "text",
          text: "`a * b` is still an array of three values. `np.dot(a, b)` and `a @ b` go one step further and add them into one number.",
        },
        {
          kind: "note",
          text: "Both vectors must have the same length. `np.dot` of a length-3 and a length-2 vector raises a `ValueError`, because some elements would have no partner.",
        },
      ],
    },
    {
      title: "A practical example: the cost of a basket",
      blocks: [
        {
          kind: "text",
          text: "You buy 2 apples, 1 loaf of bread and 3 bananas. One vector holds the quantities, the other the price of each item.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "quantities = np.array([2, 1, 3])",
            "prices = np.array([1.5, 4.0, 0.5])",
            "print(quantities * prices)",
            "print(float(np.dot(quantities, prices)))",
          ].join("\n"),
          output: ["[3.  4.  1.5]", "8.5"].join("\n"),
        },
        {
          kind: "text",
          text: "The element-wise product gives the cost per item. The dot product gives the total you pay.",
        },
      ],
    },
    {
      title: "Try it: a dot product step by step",
      blocks: [
        {
          kind: "text",
          text: "Change the middle value of `a` and pick a `b`, then watch each pair multiply and add up. Pick the length-2 `b` to see why lengths must match.",
        },
        {
          kind: "playground",
          demo: {
            title: "Dot product of two vectors",
            controls: [
              { type: "number", name: "n", label: "Middle value of a", min: -3, max: 5, initial: 2 },
              {
                type: "select",
                name: "b",
                label: "Vector b",
                options: [
                  { label: "[4, 5, 6]", value: "np.array([4, 5, 6])" },
                  { label: "[1, 1, 1] (adds a up)", value: "np.array([1, 1, 1])" },
                  { label: "[0, 1, 0] (picks the middle)", value: "np.array([0, 1, 0])" },
                  { label: "[2, 3] (wrong length)", value: "np.array([2, 3])" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "a = np.array([1, {{n}}, 3])",
              "b = {{b}}",
              "d = np.dot(a, b)",
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
            "A vector is a 1D array; the dot product needs two vectors of the same length.",
            "Multiply matching elements, then add the products: the result is one number.",
            "`np.dot(a, b)` and `a @ b` compute it; `a * b` alone stops before the sum.",
            "A dot product is a weighted sum: values times how much each one counts.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "matmul-01-q1",
      question: "What is the dot product of `[1, 2]` and `[3, 4]`?",
      options: ["`[3, 8]`", "11", "10", "`[4, 6]`"],
      answer: 1,
      explanation: "`1*3 + 2*4 = 3 + 8 = 11`; the products are added into one number.",
    },
    {
      id: "matmul-01-q2",
      question: "For two vectors `a` and `b` of length 3, what does `a * b` give?",
      options: ["One number, the dot product", "An error", "An array of 3 element-wise products"],
      answer: 2,
      explanation: "`*` multiplies element by element; only `np.dot` or `@` also adds the products up.",
    },
    {
      id: "matmul-01-q3",
      question: "Which two vectors can be combined with `np.dot`?",
      options: [
        "Any two vectors with the same length",
        "Any two vectors, whatever their lengths",
        "Only vectors of length 2 or 3",
      ],
      answer: 0,
      explanation: "Every element needs a partner, so the lengths must be equal.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "a = np.array([2, 0, 1])",
    "b = np.array([3, 4, 5])",
    "print(a * b)",
    "print(np.dot(a, b))",
    "print(a @ b)",
    "",
    "# Try: a weighted grade. Scores [70, 85, 90] with weights [0.2, 0.3, 0.5].",
  ].join("\n"),
};
