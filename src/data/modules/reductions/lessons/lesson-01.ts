import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "Turn a whole array into one number with `sum`, `mean`, `max`, `min` and `std`. These summaries are called reductions.",
  estimatedMinutes: 12,
  sections: [
    {
      title: "What a reduction is",
      blocks: [
        {
          kind: "text",
          text: "A reduction is an operation that combines many values into fewer values. Called on a whole array, it gives a single number.",
        },
        {
          kind: "text",
          text: "Adding up a shopping list is a reduction: many prices go in, one total comes out.",
        },
      ],
    },
    {
      title: "Why summaries are useful",
      blocks: [
        {
          kind: "text",
          text: "An array can hold thousands of values. A total, an average or the largest value tells you something about all of them at once.",
        },
        {
          kind: "text",
          text: "Machine learning relies on this all the time. The error of a model over a dataset, for example, is usually the mean of the errors on each example.",
        },
      ],
    },
    {
      title: "The five reductions",
      blocks: [
        {
          kind: "list",
          items: [
            "`sum` adds up every element.",
            "`mean` is the average: the sum divided by the number of elements.",
            "`max` and `min` give the largest and the smallest element.",
            "`std` is the standard deviation, a measure of how far the values typically are from their mean.",
          ],
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "scores = np.array([4, 8, 6, 2])",
            "print(scores.sum())",
            "print(scores.mean())",
            "print(scores.max())",
            "print(scores.min())",
          ].join("\n"),
          output: ["20", "5.0", "8", "2"].join("\n"),
        },
        {
          kind: "note",
          text: "`mean` always returns a float, even when every element is an integer, because an average is rarely a whole number.",
        },
        {
          kind: "text",
          text: "A small standard deviation means the values sit close to the mean. A large one means they are spread out.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "close = np.array([4, 5, 5, 6])",
            "spread = np.array([1, 2, 8, 9])",
            "print(close.mean(), spread.mean())",
            "print(close.std(), spread.std())",
          ].join("\n"),
          output: ["5.0 5.0", "0.7071067811865476 3.5355339059327378"].join("\n"),
        },
        {
          kind: "text",
          text: "Both arrays have the same mean, but `std` shows that the second one is spread out about five times as much.",
        },
        {
          kind: "note",
          text: "Each reduction exists as a method, `a.sum()`, and as a function, `np.sum(a)`. Both give the same result; pick whichever reads better.",
        },
      ],
    },
    {
      title: "Practical example: temperatures over two days",
      blocks: [
        {
          kind: "text",
          text: "Without further instructions, a reduction uses every element, whatever the shape. Here a 2D array of temperatures gives one hottest, coldest and average value.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "temps = np.array([[12, 15, 9], [14, 18, 16]])",
            "print(temps.max())",
            "print(temps.min())",
            "print(np.mean(temps))",
          ].join("\n"),
          output: ["18", "9", "14.0"].join("\n"),
        },
        {
          kind: "text",
          text: "Pick a reduction and a number of rows, and watch every cell of the array collapse into one result.",
        },
        {
          kind: "playground",
          demo: {
            title: "Reduce a whole array",
            controls: [
              {
                type: "select",
                name: "fn",
                label: "Reduction",
                options: [
                  { label: "sum", value: "sum" },
                  { label: "mean", value: "mean" },
                  { label: "max", value: "max" },
                  { label: "min", value: "min" },
                  { label: "std", value: "std" },
                ],
              },
              { type: "number", name: "rows", label: "Rows", min: 1, max: 4, initial: 2 },
            ],
            template: [
              "import numpy as np",
              "a = np.arange(1, {{rows}} * 3 + 1).reshape({{rows}}, 3)",
              "r = a.{{fn}}()",
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
            "A reduction combines many values into fewer; on a whole array, into one.",
            "`sum`, `mean`, `max`, `min` and `std` are the common reductions.",
            "`mean` returns a float, and `std` measures how spread out the values are.",
            "`a.sum()` and `np.sum(a)` do the same thing.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "reductions-01-q1",
      question: "What does `np.array([3, 1, 4, 2]).sum()` give?",
      options: ["4", "10", "[3 1 4 2]", "2.5"],
      answer: 1,
      explanation: "`sum` adds every element: 3 + 1 + 4 + 2 = 10.",
    },
    {
      id: "reductions-01-q2",
      question: "What is a reduction?",
      options: [
        "An operation that makes the values of an array smaller",
        "An operation that removes elements from an array",
        "An operation that combines many values into fewer values",
      ],
      answer: 2,
      explanation: "A reduction such as `sum` or `max` summarizes many values, here into one number.",
    },
    {
      id: "reductions-01-q3",
      question: "Two arrays have the same mean. The first has `std` 0.5, the second 4.0. What does that tell you?",
      options: [
        "The values of the second array are more spread out",
        "The second array has more elements",
        "The second array has a larger maximum",
        "Nothing; `std` only works on 2D arrays",
      ],
      answer: 0,
      explanation: "A larger standard deviation means the values are typically farther from their mean.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "prices = np.array([2.5, 4.0, 1.5, 6.0])",
    "",
    "print(prices.sum())",
    "print(prices.mean())",
    "print(prices.max(), prices.min())",
    "print(prices.std())",
  ].join("\n"),
};
