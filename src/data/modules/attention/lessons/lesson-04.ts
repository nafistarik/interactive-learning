import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "Self-attention mixes the value vectors with the attention weights: `out = weights @ V`. Together with the three lessons before, it fits in one short function from `X` to `out`.",
  estimatedMinutes: 17,
  sections: [
    {
      title: "What self-attention computes",
      blocks: [
        {
          kind: "text",
          text: "The output of token `i` is a weighted sum of all the value vectors, using row `i` of the weights. Because each row adds up to 1, it is a weighted average.",
        },
        {
          kind: "text",
          text: "For every token at once this is `out = weights @ V`: `(n, n)` times `(n, d_k)` gives `(n, d_k)`, one new vector per token. It is called self-attention because the queries, keys and values all come from the same `X`.",
        },
      ],
    },
    {
      title: "Why the output matters",
      blocks: [
        {
          kind: "text",
          text: "An embedding describes one token alone. After attention, each token's vector also carries content from the tokens it looked at, so `it` can carry what it learned from `cat`.",
        },
        {
          kind: "text",
          text: "This is the step that lets a transformer use context. Module 3.3 builds the rest of a transformer block around it.",
        },
      ],
    },
    {
      title: "weights @ V, one row and all rows",
      blocks: [
        {
          kind: "text",
          text: "Row 3 of `out` is `weights[3] @ V`: each value row times its weight, added up. The matrix product does this for every row at once.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "weights = np.array([[0.5, 0.5, 0.0], [0.0, 1.0, 0.0], [0.25, 0.25, 0.5]])",
            "V = np.array([[1.0, 0.0], [0.0, 1.0], [2.0, 2.0]])",
            "out = weights @ V",
            "print(out.shape)",
            "print(out.tolist())",
            "print((0.25 * V[0] + 0.25 * V[1] + 0.5 * V[2]).tolist())",
          ].join("\n"),
          output: ["(3, 2)", "[[0.5, 0.5], [0.0, 1.0], [1.25, 1.25]]", "[1.25, 1.25]"].join("\n"),
        },
        {
          kind: "text",
          text: "Token 1 puts all its weight on itself, so its output is its own value. Token 0 splits its weight evenly and gets the average of two values.",
        },
      ],
    },
    {
      title: "A practical example: attention in one function",
      blocks: [
        {
          kind: "text",
          text: "Here are the four steps together: project, score and scale, softmax by rows, mix the values. The function returns the weights too, so you can read them.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "",
            "def attention(X, Wq, Wk, Wv):",
            "    Q, K, V = X @ Wq, X @ Wk, X @ Wv",
            "    scores = Q @ K.T / np.sqrt(K.shape[1])",
            "    e = np.exp(scores - scores.max(axis=1, keepdims=True))",
            "    weights = e / e.sum(axis=1, keepdims=True)",
            "    return weights @ V, weights",
            "",
            "X = np.array([[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 2.0]])",
            "Wq = np.array([[0.0, 2.0], [0.0, 0.0], [2.0, 0.0]])",
            "Wk = np.array([[1.0, 0.0], [0.0, 1.0], [0.0, 0.0]])",
            "Wv = np.array([[1.0, 0.0], [0.0, 1.0], [0.0, 0.0]])",
            "out, weights = attention(X, Wq, Wk, Wv)",
            "print(out.shape, weights.shape)",
            "print(np.round(out, 3).tolist())",
          ].join("\n"),
          output: ["(4, 2) (4, 4)", "[[0.578, 0.141], [0.141, 0.578], [0.25, 0.25], [0.849, 0.05]]"].join("\n"),
        },
        {
          kind: "text",
          text: "The values hold two features, noun and verb. The embedding of `it` had neither; its output row is `[0.849, 0.05]`, mostly the noun content of `cat`, the token it attended to.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            'tokens = ["the", "cat", "sat", "it"]',
            "weights = np.array([[0.141, 0.578, 0.141, 0.141], [0.141, 0.141, 0.578, 0.141], [0.25, 0.25, 0.25, 0.25], [0.05, 0.849, 0.05, 0.05]])",
            "for i in [0, 1, 3]:",
            "    print(tokens[i], \"looks most at\", tokens[np.argmax(weights[i])])",
          ].join("\n"),
          output: ["the looks most at cat", "cat looks most at sat", "it looks most at cat"].join("\n"),
        },
      ],
    },
    {
      title: "Try it: change what the tokens look for",
      blocks: [
        {
          kind: "text",
          text: "Pick a query matrix and run the whole attention. The heatmap shows the weights: watch the bright cells move as the queries change, and compare the rows of `out`.",
        },
        {
          kind: "playground",
          demo: {
            title: "Self-attention on \"the cat sat, it\"",
            controls: [
              {
                type: "select",
                name: "Wq",
                label: "Queries",
                options: [
                  { label: "the and it want a noun, cat wants a verb", value: "[[0.0, 2.0], [0.0, 0.0], [2.0, 0.0]]" },
                  { label: "every token wants a noun", value: "[[2.0, 0.0], [2.0, 0.0], [2.0, 0.0]]" },
                  { label: "every token wants a verb", value: "[[0.0, 2.0], [0.0, 2.0], [0.0, 2.0]]" },
                  { label: "no token wants anything", value: "[[0.0, 0.0], [0.0, 0.0], [0.0, 0.0]]" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "X = np.array([[0.0, 0.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 2.0]])",
              "Wq = np.array({{Wq}})",
              "Wk = np.array([[1.0, 0.0], [0.0, 1.0], [0.0, 0.0]])",
              "Wv = np.array([[1.0, 0.0], [0.0, 1.0], [0.0, 0.0]])",
              "Q = X @ Wq",
              "K = X @ Wk",
              "V = X @ Wv",
              "scores = Q @ K.T / np.sqrt(2)",
              "e = np.exp(scores - scores.max(axis=1, keepdims=True))",
              "weights = e / e.sum(axis=1, keepdims=True)",
              "out = weights @ V",
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
            "`out = weights @ V`: each token's output is a weighted average of the value vectors.",
            "Shapes: `X` is `(n, d)`; `Q`, `K`, `V` and `out` are `(n, d_k)`; `scores` and `weights` are `(n, n)`.",
            "Self-attention in four lines: project, score and scale, softmax by rows, mix the values.",
            "After attention, a token's vector carries content from the tokens it looked at.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "attention-04-q1",
      question: "`weights` has shape `(5, 5)` and `V` has shape `(5, 3)`. What is the shape of `weights @ V`?",
      options: ["`(5, 5)`", "`(3, 5)`", "`(5, 3)`", "`(3, 3)`"],
      answer: 2,
      explanation: "One output per token (5 rows), each of the values' length (3).",
    },
    {
      id: "attention-04-q2",
      question: "Row 0 of `weights` is `[0.0, 1.0, 0.0]`. What is row 0 of `out`?",
      options: ["`V[0]`", "`V[1]`", "The average of all values", "All zeros"],
      answer: 1,
      explanation: "All of token 0's weight is on token 1, so its output is exactly token 1's value.",
    },
    {
      id: "attention-04-q3",
      question: "Why is it called self-attention?",
      options: [
        "Each token only looks at itself",
        "The queries, keys and values all come from the same `X`",
        "It needs no weight matrices",
      ],
      answer: 1,
      explanation: "One sequence attends to itself; every token can look at every token, itself included.",
    },
  ],
};
