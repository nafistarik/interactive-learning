import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "Multi-head attention splits each token's vector into smaller slices, runs attention on each slice separately, and joins the results. Each slice, a head, can learn its own pattern of which tokens to read.",
  estimatedMinutes: 18,
  sections: [
    {
      title: "What a head is",
      blocks: [
        {
          kind: "text",
          text: "Each token is a row of `d_model` numbers; `d_model` is the width of the model. A head is one attention computation on a slice of those columns, of width `d_k`.",
        },
        {
          kind: "text",
          text: "Multi-head attention uses `h` heads side by side, with `d_model = h * d_k`. With `d_model = 4` and `h = 2`, head 0 reads columns 0 and 1 of `Q`, `K` and `V`, and head 1 reads columns 2 and 3.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "Q = np.array([[1.0, 0.0, 0.0, 1.0], [0.0, 1.0, 1.0, 0.0], [1.0, 1.0, 0.0, 0.0]])",
            "print(Q.shape)",
            "print(Q[:, 0:2].tolist())",
            "print(Q[:, 2:4].tolist())",
          ].join("\n"),
          output: [
            "(3, 4)",
            "[[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]",
            "[[0.0, 1.0], [1.0, 0.0], [0.0, 0.0]]",
          ].join("\n"),
        },
      ],
    },
    {
      title: "Why use several heads",
      blocks: [
        {
          kind: "text",
          text: "One head gives each token one row of attention weights, so it can only mix the other tokens in one way. With several heads, each token gets one row of weights per head.",
        },
        {
          kind: "text",
          text: "Because each head has its own slice of the columns, the heads can score the same tokens differently: in a trained model, one head may follow the previous token while another follows tokens with a similar meaning.",
        },
        {
          kind: "note",
          text: "The heads do not cost more than one wide head: `h` heads of width `d_k` together cover the same `d_model` columns.",
        },
      ],
    },
    {
      title: "Splitting into heads with reshape and transpose",
      blocks: [
        {
          kind: "text",
          text: "Slicing works for two heads, but one reshape splits them all at once. `Q.reshape(n, h, d_k)` cuts each row of `n` tokens into `h` pieces of width `d_k`.",
        },
        {
          kind: "text",
          text: "`.transpose(1, 0, 2)` then swaps the first two axes, giving shape `(h, n, d_k)`: one `(n, d_k)` matrix per head. `Qh[0]` is head 0, the same values as `Q[:, 0:2]`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "n, h, d_k = 3, 2, 2",
            "Q = np.arange(12).reshape(n, h * d_k)",
            "Qh = Q.reshape(n, h, d_k).transpose(1, 0, 2)",
            "print(Q.tolist())",
            "print(Qh.shape)",
            "print(Qh[0].tolist())",
            "print(Qh[1].tolist())",
          ].join("\n"),
          output: [
            "[[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]]",
            "(2, 3, 2)",
            "[[0, 1], [4, 5], [8, 9]]",
            "[[2, 3], [6, 7], [10, 11]]",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "`@` on 3D arrays multiplies matching matrices along the first axis. For the scores, `Kh.transpose(0, 2, 1)` turns each head's `K` into its transpose, and `Qh @ Kh.transpose(0, 2, 1)` gives one `(n, n)` score matrix per head.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "n, h, d_k = 3, 2, 2",
            "Qh = np.ones((h, n, d_k))",
            "Kh = np.ones((h, n, d_k))",
            "scores = Qh @ Kh.transpose(0, 2, 1)",
            "print(Kh.transpose(0, 2, 1).shape)",
            "print(scores.shape)",
          ].join("\n"),
          output: ["(2, 2, 3)", "(2, 3, 3)"].join("\n"),
        },
      ],
    },
    {
      title: "A practical example: two heads from start to end",
      blocks: [
        {
          kind: "text",
          text: "Here `Q`, `K` and `V` are all `X` itself, to keep the example short; in a model each comes from `X` times its own weight matrix, as in Module 3.2. After attention, `.transpose(1, 0, 2)` and `.reshape(n, h * d_k)` put the heads back side by side.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "def softmax_rows(s):",
            "    e = np.exp(s - s.max(axis=-1, keepdims=True))",
            "    return e / e.sum(axis=-1, keepdims=True)",
            "n, h, d_k = 3, 2, 2",
            "X = np.array([[2.0, 0.0, 0.0, 1.0], [0.0, 2.0, 1.0, 0.0], [2.0, 2.0, 0.0, 0.0]])",
            "Xh = X.reshape(n, h, d_k).transpose(1, 0, 2)",
            "weights = softmax_rows(Xh @ Xh.transpose(0, 2, 1) / np.sqrt(d_k))",
            "heads = weights @ Xh",
            "out = heads.transpose(1, 0, 2).reshape(n, h * d_k)",
            "print(np.round(weights[0], 2).tolist())",
            "print(np.round(weights[1], 2).tolist())",
            "print(out.shape)",
            "print(np.round(out, 2).tolist())",
          ].join("\n"),
          output: [
            "[[0.49, 0.03, 0.49], [0.03, 0.49, 0.49], [0.05, 0.05, 0.89]]",
            "[[0.5, 0.25, 0.25], [0.25, 0.5, 0.25], [0.33, 0.33, 0.33]]",
            "(3, 4)",
            "[[1.94, 1.03, 0.25, 0.5], [1.03, 1.94, 0.5, 0.25], [1.89, 1.89, 0.33, 0.33]]",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "The two heads read the same tokens differently. In head 0, token 2 puts 0.89 of its weight on itself; in head 1, it spreads its weight evenly over all three tokens.",
        },
        {
          kind: "note",
          text: "A full model also multiplies the joined heads by one more weight matrix, often called `W_O`, so the heads can be mixed. It keeps the shape `(n, d_model)`, so it is left out here.",
        },
      ],
    },
    {
      title: "Try it: attention weights of each head",
      blocks: [
        {
          kind: "text",
          text: "Pick a head and compare its attention weights with those of one head over all four columns. Each row of the heatmap is one token's weights, and each row sums to 1.",
        },
        {
          kind: "playground",
          demo: {
            title: "Attention weights per head",
            controls: [
              {
                type: "select",
                name: "scores",
                label: "Scores from",
                options: [
                  { label: "head 0 (columns 0-1)", value: "Xh[0] @ Xh[0].T / np.sqrt(2)" },
                  { label: "head 1 (columns 2-3)", value: "Xh[1] @ Xh[1].T / np.sqrt(2)" },
                  { label: "one head over all 4 columns", value: "X @ X.T / np.sqrt(4)" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "X = np.array([[2.0, 0.0, 0.0, 1.0], [0.0, 2.0, 1.0, 0.0], [2.0, 2.0, 0.0, 0.0]])",
              "Xh = X.reshape(3, 2, 2).transpose(1, 0, 2)",
              "scores = {{scores}}",
              "e = np.exp(scores - scores.max(axis=-1, keepdims=True))",
              "weights = e / e.sum(axis=-1, keepdims=True)",
            ].join("\n"),
            chart: {
              kind: "heatmap",
              matrix: "weights",
              rowLabels: ["token 0", "token 1", "token 2"],
              colLabels: ["token 0", "token 1", "token 2"],
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
            "A head is one attention computation on a slice of `d_k` columns; `h` heads cover `d_model = h * d_k` columns.",
            "`X.reshape(n, h, d_k).transpose(1, 0, 2)` gives shape `(h, n, d_k)`: one matrix per head.",
            "`@` on 3D arrays runs one matrix product per head, so all heads are computed at once.",
            "`.transpose(1, 0, 2).reshape(n, h * d_k)` joins the heads back into shape `(n, d_model)`.",
            "Each head has its own weights, so different heads can attend to different tokens.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "transformer-block-01-q1",
      question: "`X` has shape `(4, 8)` and there are `h = 2` heads. What is the shape of `X.reshape(4, 2, 4).transpose(1, 0, 2)`?",
      options: ["`(4, 2, 4)`", "`(2, 4, 4)`", "`(2, 8)`", "`(8, 4)`"],
      answer: 1,
      explanation: "The transpose moves the head axis first: `(h, n, d_k)` is `(2, 4, 4)`.",
    },
    {
      id: "transformer-block-01-q2",
      question: "With `d_model = 4` and `h = 2`, which columns does head 1 read?",
      options: ["Columns 0 and 1", "Columns 2 and 3", "All four columns", "Columns 1 and 3"],
      answer: 1,
      explanation: "The reshape cuts each row into consecutive pieces of `d_k = 2` columns; head 1 gets the second piece.",
    },
    {
      id: "transformer-block-01-q3",
      question: "Why does a transformer use several heads instead of one?",
      options: [
        "Each head can learn a different pattern of which tokens to attend to",
        "Several heads make the output wider than `d_model`",
        "Several heads remove the need for softmax",
      ],
      answer: 0,
      explanation: "Each head has its own row of weights per token, so the heads can mix the tokens in different ways.",
    },
    {
      id: "transformer-block-01-q4",
      question: "The heads' outputs have shape `(2, 3, 2)` (`h`, `n`, `d_k`). Which line joins them into shape `(3, 4)` with each token's heads side by side?",
      options: [
        "`heads.reshape(3, 4)`",
        "`heads.transpose(1, 0, 2).reshape(3, 4)`",
        "`heads.sum(axis=0)`",
      ],
      answer: 1,
      explanation: "The token axis must come first before the reshape; reshaping `(2, 3, 2)` directly would mix rows of different tokens.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "# Two heads of width 2 on 3 tokens.",
    "X = np.array([[2.0, 0.0, 0.0, 1.0], [0.0, 2.0, 1.0, 0.0], [2.0, 2.0, 0.0, 0.0]])",
    "Xh = X.reshape(3, 2, 2).transpose(1, 0, 2)",
    "print(Xh.shape)",
    "",
    "# Compute the scores of both heads at once, then try joining Xh back to shape (3, 4).",
    "",
  ].join("\n"),
};
