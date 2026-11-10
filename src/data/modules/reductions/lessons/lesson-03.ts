import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "`keepdims=True` keeps the reduced axis with length 1, so the result broadcasts back against the original array.",
  estimatedMinutes: 14,
  sections: [
    {
      title: "What keepdims does",
      blocks: [
        {
          kind: "text",
          text: "A reduction along an axis normally removes that axis. With `keepdims=True`, the axis stays in the shape with length 1.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1, 2, 3], [4, 5, 6]])",
            "print(X.mean(axis=1).shape)",
            "print(X.mean(axis=1, keepdims=True).shape)",
            "print(X.mean(axis=1, keepdims=True))",
          ].join("\n"),
          output: ["(2,)", "(2, 1)", "[[2.]", " [5.]]"].join("\n"),
        },
        {
          kind: "text",
          text: "The values are the same row means, 2 and 5. Only the shape differs: a column of two values instead of a flat list of two.",
        },
      ],
    },
    {
      title: "Why the shape matters",
      blocks: [
        {
          kind: "text",
          text: "A common next step is to combine the result with the original array, for example to subtract each row's mean from that row. That uses broadcasting, so the shapes must fit.",
        },
        {
          kind: "text",
          text: "Broadcasting compares shapes from the right. `(2, 3)` and `(2,)` compare 3 with 2, which do not match, so `X - X.mean(axis=1)` raises a `ValueError`.",
        },
        {
          kind: "text",
          text: "`(2, 3)` and `(2, 1)` compare 3 with 1, which stretches, then 2 with 2. Each row mean is stretched across its row, exactly as intended.",
        },
        {
          kind: "note",
          text: "The bug can hide. If `X` is square, say `(3, 3)`, then `X - X.mean(axis=1)` runs without an error but subtracts each row's mean from a column instead. Use `keepdims=True` whenever you broadcast a reduction back.",
        },
      ],
    },
    {
      title: "Centering each row",
      blocks: [
        {
          kind: "text",
          text: "Subtracting the mean is called centering: afterwards the values are spread around 0. With `keepdims=True` it is one line.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1, 2, 3], [4, 5, 6]])",
            "m = X.mean(axis=1, keepdims=True)",
            "print(X - m)",
          ].join("\n"),
          output: ["[[-1.  0.  1.]", " [-1.  0.  1.]]"].join("\n"),
        },
        {
          kind: "text",
          text: "For column statistics, `axis=0` without `keepdims` gives shape `(3,)`, which already broadcasts across the rows of a `(2, 3)` array. `keepdims=True` gives `(1, 3)` and works too, so using it is never wrong.",
        },
      ],
    },
    {
      title: "Practical example: share of each row's total",
      blocks: [
        {
          kind: "text",
          text: "Each row holds one person's spending in three categories. Dividing by the row totals gives the share of each category.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "spending = np.array([[2, 3, 5], [1, 1, 2]])",
            "totals = spending.sum(axis=1, keepdims=True)",
            "print(totals.shape)",
            "print((spending / totals).tolist())",
          ].join("\n"),
          output: ["(2, 1)", "[[0.2, 0.3, 0.5], [0.25, 0.25, 0.5]]"].join("\n"),
        },
        {
          kind: "text",
          text: "Switch `keepdims` off and try 2, 3 and 4 rows: with 2 or 4 the shapes clash, and with 3 the code runs but subtracts the wrong means.",
        },
        {
          kind: "playground",
          demo: {
            title: "Broadcast a reduction back",
            controls: [
              {
                type: "select",
                name: "axis",
                label: "Axis",
                options: [
                  { label: "1 (row means)", value: "1" },
                  { label: "0 (column means)", value: "0" },
                ],
              },
              {
                type: "select",
                name: "keep",
                label: "keepdims",
                options: [
                  { label: "True", value: "True" },
                  { label: "False", value: "False" },
                ],
              },
              { type: "number", name: "rows", label: "Rows", min: 2, max: 4, initial: 2 },
            ],
            template: [
              "import numpy as np",
              "X = np.arange(1, {{rows}} * 3 + 1).reshape({{rows}}, 3)",
              "m = X.mean(axis={{axis}}, keepdims={{keep}})",
              "centered = X - m",
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
            "`keepdims=True` keeps the reduced axis with length 1.",
            "Row statistics need it to broadcast back: `(n, 1)` fits `(n, k)`, `(n,)` does not.",
            "Without it, a square array gives wrong values instead of an error.",
            "Centering, `X - X.mean(axis=1, keepdims=True)`, makes each row average 0.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "reductions-03-q1",
      question: "`X` has shape `(4, 3)`. What is the shape of `X.sum(axis=1, keepdims=True)`?",
      options: ["(4,)", "(1, 3)", "(4, 1)", "(4, 3)"],
      answer: 2,
      explanation: "Axis 1 is kept with length 1, so `(4, 3)` becomes `(4, 1)`.",
    },
    {
      id: "reductions-03-q2",
      question: "`X` has shape `(2, 5)`. What happens with `X - X.mean(axis=1)`?",
      options: [
        "It raises a ValueError: shapes (2, 5) and (2,) do not broadcast",
        "It subtracts each row's mean from that row",
        "It subtracts the mean of the whole array",
      ],
      answer: 0,
      explanation: "Compared from the right, 5 and 2 differ and neither is 1.",
    },
    {
      id: "reductions-03-q3",
      question: "Why is `X - X.mean(axis=1)` on a `(3, 3)` array dangerous?",
      options: [
        "It always raises an error",
        "It changes the shape of X",
        "It runs but subtracts the row means along the columns",
      ],
      answer: 2,
      explanation: "`(3,)` broadcasts as a row, so each row mean lands in a column instead of its own row.",
    },
  ],
};
