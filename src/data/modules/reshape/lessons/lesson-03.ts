import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "Compare an array with a value to get an array of `True` and `False`, then use it as a mask to keep only the elements you want.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "Comparisons give boolean arrays",
      blocks: [
        {
          kind: "note",
          text: "A boolean is a value that is either `True` or `False`. A boolean array holds one of these per element, and its dtype is `bool`.",
        },
        {
          kind: "text",
          text: "The comparison operators `>`, `>=`, `<`, `<=`, `==` and `!=` work element by element, like `+` and `*`. Comparing an array with a number checks every element against it.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "scores = np.array([55, 78, 92, 40, 67])",
            "passed = scores >= 60",
            "print(passed)",
            "print(passed.dtype)",
          ].join("\n"),
          output: ["[False  True  True False  True]", "bool"].join("\n"),
        },
        {
          kind: "text",
          text: "Two arrays of the same shape compare position by position, and broadcasting applies as it does for arithmetic.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "a = np.array([1, 5, 3])",
            "b = np.array([2, 5, 1])",
            "print(a == b)",
            "print(a > b)",
          ].join("\n"),
          output: ["[False  True False]", "[False False  True]"].join("\n"),
        },
      ],
    },
    {
      title: "Why masks are useful",
      blocks: [
        {
          kind: "text",
          text: "Real data questions are often filters: the scores above a pass mark, the days warmer than 30 degrees, the samples with a missing value.",
        },
        {
          kind: "text",
          text: "A boolean array answers that question for every element at once. Used as an index, it pulls out the matching elements, with no loop and no `if`.",
        },
      ],
    },
    {
      title: "Selecting with a[mask]",
      blocks: [
        {
          kind: "note",
          text: "A mask is a boolean array used to pick elements: `True` means keep, `False` means skip. Here it has the same shape as the array it selects from; the next lesson uses a shorter mask to pick whole rows.",
        },
        {
          kind: "text",
          text: "`scores[mask]` returns a new 1D array with the elements where the mask is `True`, in their original order.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "scores = np.array([55, 78, 92, 40, 67])",
            "mask = scores >= 60",
            "print(scores[mask])",
            "print(scores[scores < 50])",
            "m = np.array([[1, 4], [6, 2]])",
            "print(m[m > 3])",
          ].join("\n"),
          output: ["[78 92 67]", "[40]", "[4 6]"].join("\n"),
        },
        {
          kind: "text",
          text: "A mask on a 2D array also gives a 1D result, because the kept elements no longer form a full grid.",
        },
      ],
    },
    {
      title: "Combining conditions and np.where",
      blocks: [
        {
          kind: "text",
          text: "Combine masks with `&` (both true), `|` (either true) and `~` (not). Put each comparison in parentheses.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "scores = np.array([55, 78, 92, 40, 67])",
            "middle = (scores >= 60) & (scores < 90)",
            "print(middle)",
            "print(scores[middle])",
            "print(scores[(scores < 50) | (scores > 90)])",
            "print(scores[~middle])",
          ].join("\n"),
          output: ["[False  True False False  True]", "[78 67]", "[92 40]", "[55 92 40]"].join("\n"),
        },
        {
          kind: "note",
          text: "Without parentheses, `scores >= 60 & scores < 90` is read as `scores >= (60 & scores) < 90` and fails. Python's `and` and `or` also fail on arrays with a `ValueError` about the truth value being ambiguous.",
        },
        {
          kind: "text",
          text: "`np.where(mask, x, y)` keeps the shape and picks from `x` where the mask is `True` and from `y` where it is `False`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "scores = np.array([55, 78, 92, 40, 67])",
            "print(np.where(scores >= 60, 1, 0))",
            "print(np.where(scores >= 60, scores, 0))",
          ].join("\n"),
          output: ["[0 1 1 0 1]", "[ 0 78 92  0 67]"].join("\n"),
        },
      ],
    },
    {
      title: "Try it: build a mask",
      blocks: [
        {
          kind: "text",
          text: "Pick a comparison and a threshold. The elements that come out `True` are the ones `scores[mask]` would keep.",
        },
        {
          kind: "playground",
          demo: {
            title: "Compare scores with a threshold",
            controls: [
              {
                type: "select",
                name: "op",
                label: "Comparison",
                options: [
                  { label: ">", value: ">" },
                  { label: ">=", value: ">=" },
                  { label: "<", value: "<" },
                  { label: "==", value: "==" },
                  { label: "!=", value: "!=" },
                ],
              },
              { type: "number", name: "t", label: "Threshold", min: 0, max: 100, initial: 60 },
            ],
            template: [
              "import numpy as np",
              "scores = np.array([55, 78, 92, 40, 67, 85])",
              "mask = scores {{op}} {{t}}",
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
            "Comparisons work element by element and return a boolean array.",
            "A mask is a boolean array used as an index: `a[mask]` keeps the `True` positions.",
            "The result of `a[mask]` is 1D, in the original order.",
            "Combine masks with `&`, `|` and `~`, with parentheses around each comparison.",
            "`np.where(mask, x, y)` chooses between two values and keeps the shape.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "reshape-03-q1",
      question: "What does `np.array([3, 8, 1]) > 2` give?",
      options: ["[8]", "[ True  True False]", "[3 8]", "True"],
      answer: 1,
      explanation: "The comparison checks each element and returns one boolean per element.",
    },
    {
      id: "reshape-03-q2",
      question: "`a = np.array([4, 9, 2, 7])`. What is `a[a > 5]`?",
      options: ["[False  True False  True]", "[4 2]", "[9 7]"],
      answer: 2,
      explanation: "The mask is `True` at 9 and 7, so those elements are kept.",
    },
    {
      id: "reshape-03-q3",
      question: "Which expression keeps the values of `a` between 10 and 20?",
      options: [
        "a[a > 10 and a < 20]",
        "a[a > 10 & a < 20]",
        "a[(a > 10) | (a < 20)]",
        "a[(a > 10) & (a < 20)]",
      ],
      answer: 3,
      explanation: "`&` combines masks element by element, and each comparison needs parentheses.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "temps = np.array([28, 31, 25, 33, 30, 35, 27])",
    "hot = temps > 30",
    "print(hot)",
    "print(temps[hot])",
    "",
    "# Try: the days from 26 to 30, the number of hot days with hot.sum(),",
    "# or np.where(hot, 'hot', 'ok').",
  ].join("\n"),
};
