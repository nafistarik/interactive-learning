import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "Softmax turns each row of scores into attention weights: positive numbers that add up to 1. `weights[i, j]` then says how much token `i` looks at token `j`.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What softmax does to a row of scores",
      blocks: [
        {
          kind: "text",
          text: "Softmax takes a row of numbers, applies `np.exp` to each one, then divides each by the row's total. `np.exp` makes every value positive and larger scores much larger; the division makes the row add up to 1.",
        },
        {
          kind: "note",
          text: "The attention weights are the softmax of the scaled scores, one row per token. Each weight is a share between 0 and 1, and the shares of one row add up to 1.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "s = np.array([1.0, 2.0, 3.0])",
            "e = np.exp(s)",
            "w = e / e.sum()",
            "print(np.round(w, 3).tolist())",
            "print(np.round(w.sum(), 3))",
          ].join("\n"),
          output: ["[0.09, 0.245, 0.665]", "1.0"].join("\n"),
        },
      ],
    },
    {
      title: "Why subtract the row maximum first",
      blocks: [
        {
          kind: "text",
          text: "`np.exp(1000.0)` is too large for a float and gives `inf`, and `inf / inf` is `nan`. Large scores would break the weights.",
        },
        {
          kind: "text",
          text: "Subtracting the row's largest score first makes the largest exponent 0, so nothing overflows. The weights do not change, because `np.exp(s - m)` is `np.exp(s) / np.exp(m)` and the `np.exp(m)` cancels in the division.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "s = np.array([1.0, 2.0, 3.0])",
            "e = np.exp(s - s.max())",
            "print(np.round(e / e.sum(), 3).tolist())",
            "big = s + 1000",
            "e = np.exp(big - big.max())",
            "print(np.round(e / e.sum(), 3).tolist())",
          ].join("\n"),
          output: ["[0.09, 0.245, 0.665]", "[0.09, 0.245, 0.665]"].join("\n"),
        },
      ],
    },
    {
      title: "Row by row with axis=1 and keepdims=True",
      blocks: [
        {
          kind: "text",
          text: "`scores` has shape `(n, n)` and each row belongs to one query, so the maximum and the total are taken along `axis=1`. `keepdims=True` keeps them as a column of shape `(n, 1)`, which broadcasts across each row.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "scores = np.array([[0.0, 2.0, 0.0, 0.0], [0.0, 0.0, 2.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 4.0, 0.0, 0.0]]) / np.sqrt(2)",
            "e = np.exp(scores - scores.max(axis=1, keepdims=True))",
            "weights = e / e.sum(axis=1, keepdims=True)",
            "print(np.round(weights, 3).tolist())",
            "print(np.round(weights.sum(axis=1), 3).tolist())",
          ].join("\n"),
          output: [
            "[[0.141, 0.578, 0.141, 0.141], [0.141, 0.141, 0.578, 0.141], [0.25, 0.25, 0.25, 0.25], [0.05, 0.849, 0.05, 0.05]]",
            "[1.0, 1.0, 1.0, 1.0]",
          ].join("\n"),
        },
        {
          kind: "note",
          text: "Without `keepdims=True`, `e.sum(axis=1)` has shape `(n,)` and broadcasting lines it up with the columns: column `j` is divided by row `j`'s total. On a square matrix this runs without an error and gives wrong weights.",
        },
      ],
    },
    {
      title: "A practical example: reading the weights",
      blocks: [
        {
          kind: "text",
          text: "`weights[i, j]` is how much token `i` looks at token `j`. In the sentence \"the cat sat, it\", read one row per token.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            'tokens = ["the", "cat", "sat", "it"]',
            "scores = np.array([[0.0, 2.0, 0.0, 0.0], [0.0, 0.0, 2.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 4.0, 0.0, 0.0]]) / np.sqrt(2)",
            "e = np.exp(scores - scores.max(axis=1, keepdims=True))",
            "weights = e / e.sum(axis=1, keepdims=True)",
            "print(tokens[3], np.round(weights[3], 3).tolist())",
            "print(tokens[2], np.round(weights[2], 3).tolist())",
          ].join("\n"),
          output: ["it [0.05, 0.849, 0.05, 0.05]", "sat [0.25, 0.25, 0.25, 0.25]"].join("\n"),
        },
        {
          kind: "text",
          text: "`it` puts 0.849 of its attention on `cat`. `sat` has a query that matches nothing, so its scores are equal and its weights spread evenly.",
        },
      ],
    },
    {
      title: "Try it: sharper and flatter weights",
      blocks: [
        {
          kind: "text",
          text: "Multiply the scores by a larger number and watch each row's largest weight grow; at 0 every row is even. Then normalize over `axis=0` and see that the columns, not the rows, add up to 1.",
        },
        {
          kind: "playground",
          demo: {
            title: "Softmax of the scores, row by row",
            controls: [
              { type: "number", name: "size", label: "Multiply scores by", min: 0, max: 5, initial: 1 },
              {
                type: "select",
                name: "axis",
                label: "Normalize over",
                options: [
                  { label: "rows (axis=1)", value: "1" },
                  { label: "columns (axis=0, wrong)", value: "0" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "base = np.array([[0.0, 1.0, 0.0, 0.0], [0.0, 0.0, 1.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 2.0, 0.0, 0.0]])",
              "scores = base * {{size}}",
              "e = np.exp(scores - scores.max(axis=1, keepdims=True))",
              "weights = e / e.sum(axis={{axis}}, keepdims=True)",
            ].join("\n"),
            chart: {
              kind: "heatmap",
              matrix: "weights",
              rowLabels: ["the", "cat", "sat", "it"],
              colLabels: ["the", "cat", "sat", "it"],
            },
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
            "Softmax: `np.exp` of each score, divided by the row's total; every row of weights adds up to 1.",
            "Subtract the row maximum first: the weights stay the same and `np.exp` cannot overflow.",
            "Use `axis=1, keepdims=True` for both the maximum and the total, so each row is handled on its own.",
            "`weights[i, j]` is how much token `i` looks at token `j`; a query that matches nothing spreads evenly.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "attention-03-q1",
      question: "What does every row of the attention weights add up to?",
      options: ["0", "1", "`n`, the number of tokens", "It depends on the scores"],
      answer: 1,
      explanation: "Softmax divides each row by its own total, so each row adds up to 1.",
    },
    {
      id: "attention-03-q2",
      question: "Why subtract `scores.max(axis=1, keepdims=True)` before `np.exp`?",
      options: [
        "To make the weights smaller",
        "To keep `np.exp` from overflowing; the weights stay the same",
        "To make the rows add up to 1",
      ],
      answer: 1,
      explanation: "The shift cancels in the division, and the largest exponent becomes 0.",
    },
    {
      id: "attention-03-q3",
      question: "`scores` has shape `(4, 4)`. What goes wrong with `e / e.sum(axis=1)`?",
      options: [
        "Nothing, it is the same as with `keepdims=True`",
        "It raises a shape error",
        "The `(4,)` totals line up with the columns, so column `j` is divided by row `j`'s total",
      ],
      answer: 2,
      explanation: "Broadcasting matches a `(4,)` array with the last axis; `keepdims=True` keeps a `(4, 1)` column instead.",
    },
    {
      id: "attention-03-q4",
      question: "`weights[3, 1]` is 0.849. What does it mean?",
      options: [
        "Token 3 gives 0.849 of its attention to token 1",
        "Token 1 gives 0.849 of its attention to token 3",
        "The score of token 3 is 0.849",
      ],
      answer: 0,
      explanation: "Row `i` belongs to the token that is looking; column `j` to the token it looks at.",
    },
  ],
};
