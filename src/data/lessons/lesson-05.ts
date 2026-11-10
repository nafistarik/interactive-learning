import type { LessonContent } from "@/features/content/types";

export const LESSON_05: LessonContent = {
  lessonId: "05",
  summary:
    "Replace Python loops with whole-array operations. See why this vectorized style is shorter and usually much faster.",
  estimatedMinutes: 12,
  sections: [
    {
      title: "What vectorization means",
      blocks: [
        {
          kind: "text",
          text: "Vectorization means writing one operation for a whole array, instead of looping over its elements one by one.",
        },
        {
          kind: "text",
          text: "A loop still runs, but inside NumPy, in compiled code written in the C language, not in Python.",
        },
      ],
    },
    {
      title: "Why Python loops are slow for numbers",
      blocks: [
        {
          kind: "text",
          text: "In a Python loop every step is interpreted: Python fetches the value, checks its type, does the arithmetic and creates a new object for the result. With 100,000 elements, that work repeats 100,000 times.",
        },
        {
          kind: "text",
          text: "A NumPy array stores raw numbers of one type side by side in memory. Its operations run a tight compiled loop over that memory, without the per-element checks.",
        },
      ],
    },
    {
      title: "The same task, as a loop and as one expression",
      blocks: [
        {
          kind: "code",
          code: [
            "import numpy as np",
            "values = [1, 2, 3, 4, 5]",
            "doubled = []",
            "for v in values:",
            "    doubled.append(v * 2)",
            "print(doubled)",
            "a = np.array(values)",
            "print(a * 2)",
          ].join("\n"),
          output: ["[2, 4, 6, 8, 10]", "[ 2  4  6  8 10]"].join("\n"),
        },
        {
          kind: "text",
          text: "Both produce the same numbers. The vectorized version is one line and says what it computes, not how to step through the data.",
        },
        {
          kind: "text",
          text: "NumPy also has vectorized functions that summarize a whole array, such as `sum`, `max` and `mean` (the average).",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "a = np.array([3, 8, 1, 9, 4])",
            "print(a.sum())",
            "print(a.max())",
            "print(a.mean())",
            "print(a ** 2)",
          ].join("\n"),
          output: ["25", "9", "5.0", "[ 9 64  1 81 16]"].join("\n"),
        },
      ],
    },
    {
      title: "Measuring the difference in your browser",
      blocks: [
        {
          kind: "text",
          text: "How much faster the vectorized version is depends on your machine, the browser, the operation and the array size. For a handful of elements the difference is negligible; it grows with the number of elements.",
        },
        {
          kind: "text",
          text: "Run the comparison a few times and see how long each version takes on about 100,000 elements.",
        },
        { kind: "demo", demo: "vectorization-timing" },
        {
          kind: "note",
          text: "Here Python runs on WebAssembly inside your browser, so timings differ from a desktop Python install and from one run to the next. Compare the two versions with each other, not with numbers from elsewhere.",
        },
      ],
    },
    {
      title: "Recap",
      blocks: [
        {
          kind: "list",
          items: [
            "Vectorization replaces a Python loop with one operation on the whole array.",
            "The work still loops, but in compiled code over raw numbers.",
            "Vectorized code is shorter and, for large arrays, usually much faster.",
            "The exact speed-up depends on the machine and the operation, so measure it rather than assume it.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "05-q1",
      question: "What does vectorization mean in NumPy?",
      options: [
        "Applying one operation to a whole array instead of looping in Python",
        "Turning a list into a list of strings",
        "Running Python code on a graphics card",
      ],
      answer: 0,
      explanation: "A vectorized operation acts on every element at once, with the loop inside NumPy.",
    },
    {
      id: "05-q2",
      question: "Why is a NumPy operation usually faster than a Python loop over the same numbers?",
      options: [
        "NumPy skips some of the elements",
        "It loops in compiled code over raw numbers, without per-element Python work",
        "Python loops are limited to 1,000 steps",
      ],
      answer: 1,
      explanation: "The per-element interpreting and type checking of a Python loop is avoided.",
    },
    {
      id: "05-q3",
      question: "Which statement about the speed-up is accurate?",
      options: [
        "It is always exactly 100 times",
        "It only appears for arrays with fewer than 10 elements",
        "It depends on the machine, the operation and the array size",
      ],
      answer: 2,
      explanation: "Speed-ups vary, so they are measured on your machine, not promised.",
    },
    {
      id: "05-q4",
      question: "What does `np.array([1, 2, 3]) ** 2` give?",
      options: ["[1 4 9]", "[2 4 6]", "[1 2 3 1 2 3]"],
      answer: 0,
      explanation: "`** 2` squares every element.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "values = list(range(10))",
    "squares = []",
    "for v in values:",
    "    squares.append(v * v)",
    "print(squares)",
    "",
    "a = np.array(values)",
    "print(a * a)",
    "",
    "# Try: rewrite another loop, such as adding 1 to every value, as one NumPy expression.",
  ].join("\n"),
};
