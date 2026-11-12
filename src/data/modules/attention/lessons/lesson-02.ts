import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "An attention score is the dot product of one token's query with another token's key. `Q @ K.T` computes every score at once, and dividing by `np.sqrt(d_k)` keeps them in a range that does not grow with `d_k`.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What an attention score is",
      blocks: [
        {
          kind: "text",
          text: "The attention score of token `i` for token `j` is the dot product of query `i` with key `j`: multiply matching entries and add them. It is large when the query and the key point the same way.",
        },
        {
          kind: "text",
          text: "This is the dot product behind cosine similarity in Module 3.1, without dividing by the lengths. In the example from lesson 01, `it` wants a noun and `cat` is one, so their score is high; `sat` is not a noun, so its score is 0.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "Q = np.array([[2.0, 0.0], [0.0, 2.0], [0.0, 0.0], [4.0, 0.0]])",
            "K = np.array([[0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [0.0, 0.0]])",
            "print(np.dot(Q[3], K[1]))",
            "print(np.dot(Q[3], K[2]))",
          ].join("\n"),
          output: ["4.0", "0.0"].join("\n"),
        },
      ],
    },
    {
      title: "Every score at once with Q @ K.T",
      blocks: [
        {
          kind: "text",
          text: "`K.T` has shape `(d_k, n)`, so `Q @ K.T` has shape `(n, n)`. Entry `[i, j]` is query `i` times key `j`: row `i` holds the scores of token `i` for every token, itself included.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "Q = np.array([[2.0, 0.0], [0.0, 2.0], [0.0, 0.0], [4.0, 0.0]])",
            "K = np.array([[0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [0.0, 0.0]])",
            "scores = Q @ K.T",
            "print(scores.shape)",
            "print(scores.tolist())",
          ].join("\n"),
          output: [
            "(4, 4)",
            "[[0.0, 2.0, 0.0, 0.0], [0.0, 0.0, 2.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 4.0, 0.0, 0.0]]",
          ].join("\n"),
        },
        {
          kind: "note",
          text: "`Q @ K` without `.T` multiplies `(n, d_k)` by `(n, d_k)` and fails unless `n` equals `d_k`. `Q.T @ K` runs but gives a `(d_k, d_k)` matrix that compares features, not tokens.",
        },
      ],
    },
    {
      title: "Why divide by the square root of d_k",
      blocks: [
        {
          kind: "text",
          text: "Lesson 03 turns each row of scores into weights with exponentials. Exponentials stretch gaps: when the scores are far apart, the largest one takes almost all the weight and the others get almost none, which also makes training slow.",
        },
        {
          kind: "text",
          text: "A dot product adds `d_k` products, so its typical size grows with `d_k`. Below, many random queries and keys are compared at three lengths; the spread of the dot products roughly doubles each time `d_k` grows four times, while the scaled ones stay near 1.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "rng = np.random.default_rng(0)",
            "for d_k in [4, 16, 64]:",
            "    q = rng.normal(size=(1000, d_k))",
            "    k = rng.normal(size=(1000, d_k))",
            "    dots = (q * k).sum(axis=1)",
            "    print(d_k, np.round(dots.std(), 2), np.round((dots / np.sqrt(d_k)).std(), 2))",
          ].join("\n"),
          output: ["4 1.99 1.0", "16 3.92 0.98", "64 8.03 1.0"].join("\n"),
        },
        {
          kind: "text",
          text: "So attention divides every score by `np.sqrt(d_k)`, where `d_k` is the length of a query. The result is called the scaled scores.",
        },
      ],
    },
    {
      title: "A practical example: scaled scores for \"the cat sat, it\"",
      blocks: [
        {
          kind: "text",
          text: "Read `d_k` from the shape instead of typing it, so the same line works for any size.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "Q = np.array([[2.0, 0.0], [0.0, 2.0], [0.0, 0.0], [4.0, 0.0]])",
            "K = np.array([[0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [0.0, 0.0]])",
            "d_k = Q.shape[1]",
            "scores = Q @ K.T / np.sqrt(d_k)",
            "print(np.round(scores, 3).tolist())",
          ].join("\n"),
          output: "[[0.0, 1.414, 0.0, 0.0], [0.0, 0.0, 1.414, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 2.828, 0.0, 0.0]]",
        },
        {
          kind: "text",
          text: "Row 3 is `it`: its highest score, 2.828, is for `cat`. Row 2 is `sat`, whose query is all zeros, so all its scores are 0.",
        },
      ],
    },
    {
      title: "Try it: scores as d_k grows",
      blocks: [
        {
          kind: "text",
          text: "Increase `d_k` with and without scaling and watch the size of the scores. The queries and keys are random numbers of typical size 1.",
        },
        {
          kind: "playground",
          demo: {
            title: "Scores of random queries and keys",
            controls: [
              { type: "number", name: "d_k", label: "d_k", min: 1, max: 16, initial: 2 },
              {
                type: "select",
                name: "scale",
                label: "Divide by",
                options: [
                  { label: "np.sqrt(d_k)", value: "np.sqrt(d_k)" },
                  { label: "1 (no scaling)", value: "1" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "d_k = {{d_k}}",
              "rng = np.random.default_rng(0)",
              "Q = rng.normal(size=(4, d_k))",
              "K = rng.normal(size=(4, d_k))",
              "scores = Q @ K.T / {{scale}}",
            ].join("\n"),
            chart: {
              kind: "heatmap",
              matrix: "scores",
              rowLabels: ["q0", "q1", "q2", "q3"],
              colLabels: ["k0", "k1", "k2", "k3"],
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
            "The score of token `i` for token `j` is the dot product of query `i` and key `j`.",
            "`Q @ K.T` has shape `(n, n)`: row `i` holds token `i`'s scores for every token.",
            "Dot products grow with `d_k`; dividing by `np.sqrt(d_k)` keeps the scores near the same range.",
            "Read `d_k` as `Q.shape[1]` so the code works for any size.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "attention-02-q1",
      question: "`Q` and `K` have shape `(5, 3)`. What is the shape of `Q @ K.T`?",
      options: ["`(3, 3)`", "`(5, 3)`", "`(5, 5)`", "`(5,)`"],
      answer: 2,
      explanation: "One score for every pair of tokens: 5 queries by 5 keys.",
    },
    {
      id: "attention-02-q2",
      question: "What does `scores[2, 0]` hold?",
      options: [
        "The dot product of query 2 with key 0",
        "The dot product of query 0 with key 2",
        "The value of token 2",
      ],
      answer: 0,
      explanation: "Rows are queries and columns are keys, so `[2, 0]` is token 2 asking about token 0.",
    },
    {
      id: "attention-02-q3",
      question: "With `d_k = 16`, what are the scores divided by?",
      options: ["16", "4", "2", "Nothing"],
      answer: 1,
      explanation: "The scale is `np.sqrt(d_k)`, and the square root of 16 is 4.",
    },
    {
      id: "attention-02-q4",
      question: "Why scale the scores?",
      options: [
        "To make every score positive",
        "Large dot products make the weights too peaked: one token takes almost all the weight",
        "So that each row sums to 1",
      ],
      answer: 1,
      explanation: "Dot products grow with `d_k`; scaling keeps their gaps moderate before the exponentials of lesson 03.",
    },
  ],
};
