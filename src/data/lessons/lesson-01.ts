import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "Meet the NumPy array: an ordered block of values of one type. Create arrays, read their elements and see how they differ from Python lists.",
  estimatedMinutes: 10,
  sections: [
    {
      title: "What an array is",
      blocks: [
        {
          kind: "text",
          text: "An array is an ordered collection of values stored together under one name. Each value is called an element.",
        },
        {
          kind: "text",
          text: "NumPy, short for Numerical Python, is the library that brings arrays to Python. By convention it is imported as `np`.",
        },
        {
          kind: "note",
          text: "Every element of a NumPy array has the same type, for example all whole numbers or all decimal numbers. That shared type is the array's `dtype`, short for data type.",
        },
      ],
    },
    {
      title: "Why NumPy arrays instead of Python lists",
      blocks: [
        {
          kind: "text",
          text: "A Python list can hold anything: numbers, text, other lists, all mixed together. That flexibility means Python treats it as a general container, not as numbers.",
        },
        {
          kind: "text",
          text: "A NumPy array treats its contents as numbers. An operation such as `* 2` applies to every element at once, with no loop.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "prices = [10, 20, 30]",
            "print(prices * 2)",
            "a = np.array(prices)",
            "print(a * 2)",
          ].join("\n"),
          output: ["[10, 20, 30, 10, 20, 30]", "[20 40 60]"].join("\n"),
        },
        {
          kind: "text",
          text: "On a list, `* 2` repeats the list. On an array, it doubles each value.",
        },
        {
          kind: "list",
          items: [
            "Less code: whole-array math replaces loops.",
            "Speed: arrays store raw numbers side by side, so NumPy can process them quickly.",
            "Shared ground: data libraries such as pandas and scikit-learn work with NumPy arrays.",
          ],
        },
      ],
    },
    {
      title: "Creating arrays with np.array",
      blocks: [
        {
          kind: "text",
          text: "The most direct way to make an array is `np.array`, which takes a Python list.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "a = np.array([3, 1, 4, 1, 5])",
            "print(a)",
            "print(a.dtype)",
            "b = np.array([1.5, 2.0, 3.25])",
            "print(b)",
            "print(b.dtype)",
          ].join("\n"),
          output: ["[3 1 4 1 5]", "int32", "[1.5  2.   3.25]", "float64"].join("\n"),
        },
        {
          kind: "text",
          text: "Printed arrays have no commas, which tells them apart from lists. A trailing point, as in `2.`, marks a decimal number, called a float.",
        },
        {
          kind: "note",
          text: "`int32` means whole numbers stored in 32 bits. In this browser NumPy picks `int32`; on most desktop computers it picks `int64`. Both hold whole numbers.",
        },
        {
          kind: "text",
          text: "NumPy also has helpers for common arrays: `np.zeros(3)` gives three zeros and `np.arange(5)` gives the numbers 0 to 4.",
        },
        {
          kind: "code",
          code: ["import numpy as np", "print(np.zeros(3))", "print(np.arange(5))"].join("\n"),
          output: ["[0. 0. 0.]", "[0 1 2 3 4]"].join("\n"),
        },
      ],
    },
    {
      title: "Reading and changing elements",
      blocks: [
        {
          kind: "text",
          text: "Each element has an index: its position, counted from 0. `a[0]` is the first element and `a[-1]` is the last.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "a = np.array([10, 20, 30, 40])",
            "print(a[0])",
            "print(a[-1])",
            "a[1] = 25",
            "print(a)",
          ].join("\n"),
          output: ["10", "40", "[10 25 30 40]"].join("\n"),
        },
        {
          kind: "note",
          text: "A new value is converted to the array's dtype. Storing `2.7` in an integer array keeps only `2`.",
        },
        {
          kind: "text",
          text: "Change a value in the array below and watch the visual array update.",
        },
        { kind: "demo", demo: "edit-array" },
      ],
    },
    {
      title: "Recap",
      blocks: [
        {
          kind: "list",
          items: [
            "An array is an ordered collection of elements that all share one `dtype`.",
            "Create one from a list with `np.array([...])`, or with helpers like `np.zeros` and `np.arange`.",
            "Math on an array applies to every element; on a list, `*` repeats the list instead.",
            "`a[i]` reads or changes the element at index `i`, counting from 0.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "01-q1",
      question: "What does `print(np.array([1, 2, 3]) * 2)` print?",
      options: ["[1 2 3 1 2 3]", "[2 4 6]", "[1, 2, 3, 1, 2, 3]", "An error"],
      answer: 1,
      explanation: "On a NumPy array, `* 2` multiplies every element by 2.",
    },
    {
      id: "01-q2",
      question: "What is true of the elements of a NumPy array?",
      options: [
        "They must be whole numbers",
        "They can freely mix text and numbers",
        "They all share one data type, the `dtype`",
      ],
      answer: 2,
      explanation: "A NumPy array stores every element with the same type, its `dtype`.",
    },
    {
      id: "01-q3",
      question: "Which expression reads the first element of the array `a`?",
      options: ["`a[0]`", "`a[1]`", "`a[-1]`"],
      answer: 0,
      explanation: "Indexes count from 0, so the first element is at index 0.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "# Make an array from a list, then experiment.",
    "a = np.array([4, 8, 15, 16, 23, 42])",
    "print(a)",
    "print(a[0], a[-1])",
    "print(a * 10)",
    "",
    "# Try: change an element with a[2] = 99, then print a again.",
  ].join("\n"),
};
