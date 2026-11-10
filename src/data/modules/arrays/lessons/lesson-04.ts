import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "Pick out single elements, whole rows, whole columns and ranges of an array using indexes and slices.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What indexing and slicing are",
      blocks: [
        {
          kind: "text",
          text: "Indexing means picking elements by their position. A slice picks a range of positions at once.",
        },
        {
          kind: "text",
          text: "A 1D array takes one index, as a list does. A 2D array takes one index per axis, separated by a comma: `m[row, column]`.",
        },
      ],
    },
    {
      title: "Why you index arrays",
      blocks: [
        {
          kind: "text",
          text: "Real data is usually a table: each row is one record and each column one measurement. You often need one value, one record or one measurement across all records.",
        },
        {
          kind: "text",
          text: "Indexing gives you each of these in a single expression, without a loop.",
        },
      ],
    },
    {
      title: "Picking one element",
      blocks: [
        {
          kind: "code",
          code: [
            "import numpy as np",
            "m = np.array([[10, 11, 12], [20, 21, 22], [30, 31, 32]])",
            "print(m[0, 0])",
            "print(m[1, 2])",
            "print(m[-1, 0])",
          ].join("\n"),
          output: ["10", "22", "30"].join("\n"),
        },
        {
          kind: "note",
          text: "`m[1, 2]` means row 1, column 2. Counting starts at 0, so that is the second row and the third column. Negative indexes count from the end.",
        },
      ],
    },
    {
      title: "Rows, columns and slices",
      blocks: [
        {
          kind: "text",
          text: "A colon `:` on its own means every position along that axis. So `m[1, :]` is all of row 1, and `m[:, 2]` is all of column 2.",
        },
        {
          kind: "text",
          text: "A slice `start:stop` takes positions from `start` up to, but not including, `stop`. Leaving out `start` begins at 0; leaving out `stop` runs to the end.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "m = np.array([[10, 11, 12], [20, 21, 22], [30, 31, 32]])",
            "print(m[1, :])",
            "print(m[:, 2])",
            "print(m[0:2, 1:3])",
          ].join("\n"),
          output: ["[20 21 22]", "[12 22 32]", "[[11 12]", " [21 22]]"].join("\n"),
        },
        {
          kind: "text",
          text: "A column comes back as a 1D array, printed on one line. Its values still run from the top row to the bottom row.",
        },
        {
          kind: "text",
          text: "A third number, `start:stop:step`, sets the step between positions.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "a = np.arange(10)",
            "print(a[2:5])",
            "print(a[:3])",
            "print(a[7:])",
            "print(a[::2])",
          ].join("\n"),
          output: ["[2 3 4]", "[0 1 2]", "[7 8 9]", "[0 2 4 6 8]"].join("\n"),
        },
        {
          kind: "note",
          text: "A slice of a NumPy array is a view: it shares memory with the original, so changing the slice changes the original. Call `.copy()` when you need an independent array.",
        },
        {
          kind: "text",
          text: "Choose an index or a slice and see which cells it selects.",
        },
        { kind: "demo", demo: "indexing" },
      ],
    },
    {
      title: "Recap",
      blocks: [
        {
          kind: "list",
          items: [
            "`m[row, column]` picks one element of a 2D array.",
            "`:` alone selects a whole axis: `m[r, :]` is a row and `m[:, c]` is a column.",
            "`start:stop` includes `start` and excludes `stop`; `::step` skips positions.",
            "Slices are views of the original array; use `.copy()` for an independent one.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "04-q1",
      question: "With `m = np.array([[1, 2], [3, 4]])`, what is `m[1, 0]`?",
      options: ["1", "2", "3", "4"],
      answer: 2,
      explanation: "Row 1 is `[3, 4]`, and column 0 of that row is 3.",
    },
    {
      id: "04-q2",
      question: "What does `m[:, 0]` select from a 2D array?",
      options: ["The first row", "The first column", "Only the first element"],
      answer: 1,
      explanation: "`:` takes every row, and `0` takes column 0 from each.",
    },
    {
      id: "04-q3",
      question: "Which positions does `a[2:5]` select from a 1D array?",
      options: ["2, 3 and 4", "2, 3, 4 and 5", "3, 4 and 5"],
      answer: 0,
      explanation: "A slice includes its start and stops just before its stop.",
    },
    {
      id: "04-q4",
      question: "You run `s = a[0:3]` and then `s[0] = 99`. What happens to `a`?",
      options: [
        "Nothing, because `s` is a copy",
        "`a[0]` becomes 99 too, because the slice is a view",
        "Python raises an error",
      ],
      answer: 1,
      explanation: "A slice shares memory with the original array.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "m = np.arange(12).reshape((3, 4))",
    "print(m)",
    "print(m[1, 2])",
    "print(m[:, 0])",
    "",
    "# Try: print row 2, the last column, or the slice m[0:2, 1:3].",
  ].join("\n"),
};
