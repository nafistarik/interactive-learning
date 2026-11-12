import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "Attention starts by giving every token three vectors: a query, a key and a value. Each is the token's embedding times a weight matrix, so all of them come from three matrix products.",
  estimatedMinutes: 14,
  sections: [
    {
      title: "What queries, keys and values are",
      blocks: [
        {
          kind: "text",
          text: "Attention is a way for each token to build a new vector from the vectors of all the tokens in its text, taking more from the tokens that matter to it. To decide what matters, each token gets three new vectors from its embedding.",
        },
        {
          kind: "list",
          items: [
            "The query says what the token is looking for.",
            "The key says what the token offers, so that queries can match it.",
            "The value is the content the token hands over to the tokens that pick it.",
          ],
        },
        {
          kind: "note",
          text: "A projection multiplies a vector by a weight matrix to get a new vector, here of length `d_k`. The query, key and value are three projections of the same embedding, with three matrices `Wq`, `Wk` and `Wv`.",
        },
      ],
    },
    {
      title: "Why one embedding gets three roles",
      blocks: [
        {
          kind: "text",
          text: "What a token looks for is not the same as what it offers. In \"the cat sat, it\", the word `it` looks for a noun, but `it` is not the noun the other words want.",
        },
        {
          kind: "text",
          text: "Three separate matrices let each role be set on its own. In a trained transformer, `Wq`, `Wk` and `Wv` are learned like the layer weights of Module 2.1; in this module you set them by hand to see what each one does.",
        },
      ],
    },
    {
      title: "From X to Q, K and V with one matrix product each",
      blocks: [
        {
          kind: "text",
          text: "Stack the embeddings of `n` tokens in `X`, shape `(n, d)`: one row per token, as `E[ids]` gave you in Module 3.1. Each weight matrix has shape `(d, d_k)`.",
        },
        {
          kind: "text",
          text: "`Q = X @ Wq` has shape `(n, d_k)`: row `i` is the query of token `i`. `K = X @ Wk` and `V = X @ Wv` work the same way.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 2.0]])",
            "Wq = np.array([[0.0, 2.0], [0.0, 0.0], [2.0, 0.0]])",
            "Q = X @ Wq",
            "print(X.shape, Wq.shape, Q.shape)",
            "print(Q.tolist())",
          ].join("\n"),
          output: ["(4, 3) (3, 2) (4, 2)", "[[2.0, 0.0], [0.0, 2.0], [0.0, 0.0], [4.0, 0.0]]"].join("\n"),
        },
        {
          kind: "text",
          text: "One product computes every token's query at once. A single token's query is its row of `X` times the same matrix.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 2.0]])",
            "Wq = np.array([[0.0, 2.0], [0.0, 0.0], [2.0, 0.0]])",
            "Q = X @ Wq",
            "print((X[3] @ Wq).tolist())",
            "print(np.array_equal(X[3] @ Wq, Q[3]))",
          ].join("\n"),
          output: ["[4.0, 0.0]", "True"].join("\n"),
        },
      ],
    },
    {
      title: "A practical example: queries for \"the cat sat, it\"",
      blocks: [
        {
          kind: "text",
          text: "Here are four tokens with hand-made embeddings of three features: is a noun, is a verb, looks for a noun. `it` looks for a noun more strongly than `the`, so its third feature is 2.",
        },
        {
          kind: "list",
          items: [
            "`Wq` builds queries with two numbers: \"wants a noun\" from the third feature, and \"wants a verb\" from the first, because a noun looks for its verb.",
            "`Wk` builds keys with two numbers: \"is a noun\" and \"is a verb\".",
            "`Wv` copies the noun and verb features as the content to hand over.",
          ],
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            'vocab = {"the": 0, "cat": 1, "sat": 2, "it": 3}',
            "E = np.array([[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 2.0]])",
            'ids = np.array([vocab[t] for t in ["the", "cat", "sat", "it"]])',
            "X = E[ids]",
            "Wq = np.array([[0.0, 2.0], [0.0, 0.0], [2.0, 0.0]])",
            "Wk = np.array([[1.0, 0.0], [0.0, 1.0], [0.0, 0.0]])",
            "Wv = np.array([[1.0, 0.0], [0.0, 1.0], [0.0, 0.0]])",
            "print((X @ Wq).tolist())",
            "print((X @ Wk).tolist())",
            "print((X @ Wv).tolist())",
          ].join("\n"),
          output: [
            "[[2.0, 0.0], [0.0, 2.0], [0.0, 0.0], [4.0, 0.0]]",
            "[[0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [0.0, 0.0]]",
            "[[0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [0.0, 0.0]]",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "Read the rows: `the` and `it` want a noun, `cat` wants a verb, and `sat` wants nothing. Only `cat` has a noun key and only `sat` has a verb key.",
        },
      ],
    },
    {
      title: "Try it: one embedding, three projections",
      blocks: [
        {
          kind: "text",
          text: "Pick a weight matrix and watch `X @ W` turn the four embeddings into queries, keys or values. The last option uses `Wk.T`, shape `(2, 3)`, which does not fit after `X`.",
        },
        {
          kind: "playground",
          demo: {
            title: "Project X with Wq, Wk or Wv",
            controls: [
              {
                type: "select",
                name: "W",
                label: "Weight matrix",
                options: [
                  { label: "Wq (queries)", value: "Wq" },
                  { label: "Wk (keys)", value: "Wk" },
                  { label: "Wv (values)", value: "Wv" },
                  { label: "Wk.T (wrong shape)", value: "Wk.T" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "X = np.array([[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 2.0]])",
              "Wq = np.array([[0.0, 2.0], [0.0, 0.0], [2.0, 0.0]])",
              "Wk = np.array([[1.0, 0.0], [0.0, 1.0], [0.0, 0.0]])",
              "Wv = np.array([[1.0, 0.0], [0.0, 1.0], [0.0, 0.0]])",
              "P = X @ {{W}}",
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
            "A query says what a token looks for, a key what it offers, a value what it hands over.",
            "`X` holds one embedding per row, shape `(n, d)`; `Wq`, `Wk` and `Wv` have shape `(d, d_k)`.",
            "`Q = X @ Wq`, `K = X @ Wk` and `V = X @ Wv` each have shape `(n, d_k)`, one row per token.",
            "In a trained model the three matrices are learned; here they are set by hand.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "attention-01-q1",
      question: "`X` has shape `(6, 8)` and `Wk` has shape `(8, 4)`. What is the shape of `K = X @ Wk`?",
      options: ["`(8, 4)`", "`(6, 4)`", "`(6, 8)`", "`(4, 6)`"],
      answer: 1,
      explanation: "One key per token: 6 rows, each of length `d_k = 4`.",
    },
    {
      id: "attention-01-q2",
      question: "Which vector says what a token is looking for?",
      options: ["Its key", "Its value", "Its query"],
      answer: 2,
      explanation: "The query asks; keys answer; values carry the content that is handed over.",
    },
    {
      id: "attention-01-q3",
      question: "Why does attention use three weight matrices instead of the embedding alone?",
      options: [
        "So that what a token looks for can differ from what it offers and what it hands over",
        "Because embeddings cannot be multiplied by matrices",
        "To make the vectors longer",
      ],
      answer: 0,
      explanation: "Each matrix sets one role, so a token like `it` can look for a noun without being one.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "X = np.array([[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 2.0]])",
    "Wq = np.array([[0.0, 2.0], [0.0, 0.0], [2.0, 0.0]])",
    "Wk = np.array([[1.0, 0.0], [0.0, 1.0], [0.0, 0.0]])",
    "Q = X @ Wq",
    "K = X @ Wk",
    "print(Q)",
    "print(K)",
    "",
    "# Try: change Wq so that sat (row 2) wants a noun too. Which row of Q changes?",
  ].join("\n"),
};
