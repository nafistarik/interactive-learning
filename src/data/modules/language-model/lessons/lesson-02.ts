import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "A bigram model counts how often each token follows each other token, then turns every row of counts into a probability distribution.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What a bigram model is",
      blocks: [
        {
          kind: "note",
          text: "A bigram is a pair of neighbouring tokens, such as `(the, cat)`. A bigram model predicts the next token from the current token alone, using how often each pair appeared in the training text.",
        },
        {
          kind: "text",
          text: "It is the smallest possible language model. It forgets everything before the current token, so after `on the` it only knows `the`.",
        },
      ],
    },
    {
      title: "Why start with counting",
      blocks: [
        {
          kind: "text",
          text: "Counting needs no training loop: one pass over the pairs gives the whole model. The result is a matrix you can read row by row.",
        },
        {
          kind: "text",
          text: "A transformer language model outputs the same thing, one probability distribution over the vocabulary per position, so the bigram matrix is a baseline to compare it with.",
        },
      ],
    },
    {
      title: "Counting pairs into a (V, V) matrix",
      blocks: [
        {
          kind: "text",
          text: "With a vocabulary of `V` tokens, the counts form a `(V, V)` matrix. Row `i` is the current token and column `j` the next token, so `counts[i, j]` is how often `j` followed `i`.",
        },
        {
          kind: "text",
          text: "`np.add.at(counts, (cur, nxt), 1)` adds 1 at `counts[cur[k], nxt[k]]` for every pair `k`. The corpus below is `the cat sat on the mat . the dog sat on the rug .`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "ids = np.array([0, 1, 2, 3, 0, 4, 7, 0, 5, 2, 3, 0, 6, 7])",
            "V = 8",
            "counts = np.zeros((V, V), dtype=int)",
            "np.add.at(counts, (ids[:-1], ids[1:]), 1)",
            "print(counts[0])",
            "print(counts[2])",
            "print(counts.sum())",
          ].join("\n"),
          output: ["[0 1 0 0 1 1 1 0]", "[0 0 0 2 0 0 0 0]", "13"].join("\n"),
        },
        {
          kind: "text",
          text: "Row 0 (`the`) has a 1 under `cat`, `mat`, `dog` and `rug`. Row 2 (`sat`) has a 2 under `on`. The 14 tokens give 13 pairs in total.",
        },
        {
          kind: "note",
          text: "`counts[cur, nxt] += 1` looks the same but counts a repeated pair only once: NumPy writes each index once. `np.add.at` adds once per pair.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "ids = np.array([0, 1, 2, 3, 0, 4, 7, 0, 5, 2, 3, 0, 6, 7])",
            "a = np.zeros((8, 8), dtype=int)",
            "np.add.at(a, (ids[:-1], ids[1:]), 1)",
            "b = np.zeros((8, 8), dtype=int)",
            "b[ids[:-1], ids[1:]] += 1",
            "print(int(a[2, 3]), int(b[2, 3]))",
          ].join("\n"),
          output: "2 1",
        },
      ],
    },
    {
      title: "From counts to probabilities",
      blocks: [
        {
          kind: "text",
          text: "Dividing each row by its sum turns it into a probability distribution. `counts.sum(axis=1, keepdims=True)` has shape `(V, 1)`, so it broadcasts across the columns.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "ids = np.array([0, 1, 2, 3, 0, 4, 7, 0, 5, 2, 3, 0, 6, 7])",
            "counts = np.zeros((8, 8))",
            "np.add.at(counts, (ids[:-1], ids[1:]), 1)",
            "P = counts / counts.sum(axis=1, keepdims=True)",
            "print(P[0].tolist())",
            "print(P[2].tolist())",
            "print(P.sum(axis=1))",
          ].join("\n"),
          output: [
            "[0.0, 0.25, 0.0, 0.0, 0.25, 0.25, 0.25, 0.0]",
            "[0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0]",
            "[1. 1. 1. 1. 1. 1. 1. 1.]",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "Reading a row: `P[0]` says that after `the`, the model expects `cat`, `mat`, `dog` or `rug` with probability `0.25` each. `P[2]` says `sat` is always followed by `on`.",
        },
      ],
    },
    {
      title: "A practical example: rows that were never seen",
      blocks: [
        {
          kind: "text",
          text: "A token that never appears as a current token has a row of zeros. Dividing `0 / 0` gives `nan`, so that row is not a distribution.",
        },
        {
          kind: "note",
          text: "Add-one smoothing adds 1 to every count before dividing. Every row then has a positive sum, and pairs never seen get a small probability instead of 0.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "ids = np.array([0, 1, 2, 3, 0, 4, 7])",
            "counts = np.zeros((8, 8))",
            "np.add.at(counts, (ids[:-1], ids[1:]), 1)",
            "print(counts.sum(axis=1))",
            "smoothed = counts + 1",
            "P = smoothed / smoothed.sum(axis=1, keepdims=True)",
            "print(np.round(P[0], 3))",
            "print(np.round(P[7], 3))",
            "print(np.allclose(P.sum(axis=1), 1))",
          ].join("\n"),
          output: [
            "[2. 1. 1. 1. 1. 0. 0. 0.]",
            "[0.1 0.2 0.1 0.1 0.2 0.1 0.1 0.1]",
            "[0.125 0.125 0.125 0.125 0.125 0.125 0.125 0.125]",
            "True",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "In `the cat sat on the mat .`, the last three tokens never start a pair. With smoothing, row 7 (`.`) becomes uniform: `1 / 8 = 0.125` for every token.",
        },
      ],
    },
    {
      title: "Try it: smoothing the bigram matrix",
      blocks: [
        {
          kind: "text",
          text: "The heatmap shows `P` for the 14-token corpus, rows are the current word and columns the next word. Change the number added to every count and watch the rows flatten.",
        },
        {
          kind: "playground",
          demo: {
            title: "Bigram probabilities",
            controls: [
              {
                type: "select",
                name: "k",
                label: "Added to every count",
                options: [
                  { label: "0 (raw counts)", value: "0" },
                  { label: "1 (add-one smoothing)", value: "1" },
                  { label: "5 (heavy smoothing)", value: "5" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "ids = np.array([0, 1, 2, 3, 0, 4, 7, 0, 5, 2, 3, 0, 6, 7])",
              "V = 8",
              "counts = np.zeros((V, V))",
              "np.add.at(counts, (ids[:-1], ids[1:]), 1)",
              "smoothed = counts + {{k}}",
              "P = smoothed / smoothed.sum(axis=1, keepdims=True)",
            ].join("\n"),
            chart: {
              kind: "heatmap",
              matrix: "P",
              rowLabels: ["the", "cat", "sat", "on", "mat", "dog", "rug", "."],
              colLabels: ["the", "cat", "sat", "on", "mat", "dog", "rug", "."],
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
            "A bigram model predicts the next token from the current token only.",
            "`counts[i, j]` is how often token `j` followed token `i`; `np.add.at(counts, (cur, nxt), 1)` fills it.",
            "`counts / counts.sum(axis=1, keepdims=True)` turns each row into a probability distribution.",
            "Add-one smoothing (`counts + 1`) removes zero rows and gives unseen pairs a small probability.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "language-model-02-q1",
      question: "In the bigram matrix `P`, what does `P[3, 0]` mean?",
      options: [
        "The probability that token 3 follows token 0",
        "The probability that token 0 follows token 3",
        "How many times token 3 appears",
      ],
      answer: 1,
      explanation: "Rows are the current token and columns the next token.",
    },
    {
      id: "language-model-02-q2",
      question: "Why is `keepdims=True` needed in `counts / counts.sum(axis=1, keepdims=True)`?",
      options: [
        "So the `(V, 1)` row sums divide each row, not each column",
        "So the result stays an integer array",
        "It is not needed; the result is the same without it",
      ],
      answer: 0,
      explanation: "Without it the sums have shape `(V,)` and broadcast across rows, dividing column `j` by the sum of row `j`.",
    },
    {
      id: "language-model-02-q3",
      question: "A row of counts is `[0, 0, 0, 0]`. What does add-one smoothing turn it into?",
      options: ["[0, 0, 0, 0]", "[0.25, 0.25, 0.25, 0.25]", "[1, 1, 1, 1]"],
      answer: 1,
      explanation: "Each count becomes 1, and dividing by the row sum 4 gives `0.25` each.",
    },
  ],
};
