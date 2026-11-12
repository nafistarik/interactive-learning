import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "A causal mask hides every later token from attention. Setting the future scores to `-inf` before the row softmax gives them weight 0, so the weights become lower-triangular.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What a causal mask is",
      blocks: [
        {
          kind: "text",
          text: "In Module 3.2, every token's row of attention weights spreads over all tokens of the sequence, including the ones after it.",
        },
        {
          kind: "note",
          text: "A causal mask is an `(n, n)` matrix that marks, for each token (row), the positions after it (columns to the right of the diagonal). Attention must give those positions zero weight.",
        },
        {
          kind: "code",
          code: ["import numpy as np", "mask = np.triu(np.ones((4, 4)), k=1)", "print(mask)"].join("\n"),
          output: ["[[0. 1. 1. 1.]", " [0. 0. 1. 1.]", " [0. 0. 0. 1.]", " [0. 0. 0. 0.]]"].join("\n"),
        },
        {
          kind: "text",
          text: "`np.triu(a, k=1)` keeps the values above the diagonal and sets the rest to 0. A 1 at `mask[i, j]` means token `j` comes after token `i`, so `i` must not see it.",
        },
      ],
    },
    {
      title: "Why a token must not see the future",
      blocks: [
        {
          kind: "text",
          text: "A transformer language model predicts the next token at every position at once. If position `i` could attend to position `i + 1`, it could copy the answer instead of predicting it.",
        },
        {
          kind: "text",
          text: "When generating text, the future tokens do not exist yet. The mask makes training work the same way generation does: each position uses only itself and the tokens before it.",
        },
      ],
    },
    {
      title: "Masking scores with -inf",
      blocks: [
        {
          kind: "text",
          text: "The mask is applied to the scores, before the softmax. `np.where(mask == 1, -np.inf, scores)` takes `-np.inf` where the mask is 1 and the score everywhere else.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "scores = np.array([[1.0, 2.0, 0.5], [0.0, 1.0, 3.0], [2.0, 1.0, 0.0]])",
            "mask = np.triu(np.ones((3, 3)), k=1)",
            "masked = np.where(mask == 1, -np.inf, scores)",
            "print(masked)",
          ].join("\n"),
          output: ["[[  1. -inf -inf]", " [  0.   1. -inf]", " [  2.   1.   0.]]"].join("\n"),
        },
        {
          kind: "text",
          text: "`np.exp(-np.inf)` is `0.0`, so after the softmax every masked position has weight exactly 0. The diagonal is never masked, so each row keeps at least one finite score.",
        },
      ],
    },
    {
      title: "A practical example: causal attention weights",
      blocks: [
        {
          kind: "text",
          text: "The row softmax is the stable one from Module 3.2: subtract the row max, take `np.exp`, divide by the row sum.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "scores = np.array([[1.0, 2.0, 0.5], [0.0, 1.0, 3.0], [2.0, 1.0, 0.0]])",
            "mask = np.triu(np.ones((3, 3)), k=1)",
            "masked = np.where(mask == 1, -np.inf, scores)",
            "e = np.exp(masked - masked.max(axis=1, keepdims=True))",
            "weights = e / e.sum(axis=1, keepdims=True)",
            "print(np.round(weights, 3))",
            "print(np.allclose(np.triu(weights, k=1), 0))",
          ].join("\n"),
          output: [
            "[[1.    0.    0.   ]",
            " [0.269 0.731 0.   ]",
            " [0.665 0.245 0.09 ]]",
            "True",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "The weights are lower-triangular: every value above the diagonal is 0. The first token can only attend to itself, so its weight on itself is 1.",
        },
        {
          kind: "text",
          text: "With all scores equal, each token spreads its weight evenly over itself and the tokens before it.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "scores = np.zeros((4, 4))",
            "mask = np.triu(np.ones((4, 4)), k=1)",
            "masked = np.where(mask == 1, -np.inf, scores)",
            "e = np.exp(masked - masked.max(axis=1, keepdims=True))",
            "weights = e / e.sum(axis=1, keepdims=True)",
            "print(np.round(weights, 3))",
          ].join("\n"),
          output: [
            "[[1.    0.    0.    0.   ]",
            " [0.5   0.5   0.    0.   ]",
            " [0.333 0.333 0.333 0.   ]",
            " [0.25  0.25  0.25  0.25 ]]",
          ].join("\n"),
        },
      ],
    },
    {
      title: "Try it: attention with and without the mask",
      blocks: [
        {
          kind: "text",
          text: "The heatmap shows the attention weights for the six tokens of `the cat sat on the mat`. Switch the mask off to see weight above the diagonal, and pick equal scores to see the even split.",
        },
        {
          kind: "playground",
          demo: {
            title: "Causal attention weights",
            controls: [
              {
                type: "select",
                name: "masking",
                label: "Mask",
                options: [
                  { label: "causal (hide the future)", value: "np.where(mask == 1, -np.inf, scores)" },
                  { label: "none (see every token)", value: "scores" },
                ],
              },
              {
                type: "select",
                name: "scores",
                label: "Scores",
                options: [
                  { label: "random (seed 0)", value: "np.round(np.random.default_rng(0).normal(size=(6, 6)), 1)" },
                  { label: "all equal", value: "np.zeros((6, 6))" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "scores = {{scores}}",
              "mask = np.triu(np.ones((6, 6)), k=1)",
              "masked = {{masking}}",
              "e = np.exp(masked - masked.max(axis=1, keepdims=True))",
              "weights = e / e.sum(axis=1, keepdims=True)",
            ].join("\n"),
            chart: {
              kind: "heatmap",
              matrix: "weights",
              rowLabels: ["the", "cat", "sat", "on", "the", "mat"],
              colLabels: ["the", "cat", "sat", "on", "the", "mat"],
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
            "A causal mask stops each token from attending to the tokens after it.",
            "`np.triu(np.ones((n, n)), k=1)` marks the future: 1 above the diagonal, 0 elsewhere.",
            "`np.where(mask == 1, -np.inf, scores)` before the softmax gives the future weight 0.",
            "Causal attention weights are lower-triangular and each row still sums to 1.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "language-model-04-q1",
      question: "For a sequence of 5 tokens, which positions can token 2 attend to with a causal mask?",
      options: ["0, 1 and 2", "2, 3 and 4", "All five"],
      answer: 0,
      explanation: "A token sees itself and the tokens before it, never the ones after.",
    },
    {
      id: "language-model-04-q2",
      question: "Why are masked scores set to `-np.inf` rather than 0?",
      options: [
        "Because `np.exp(-np.inf)` is 0, so the softmax gives those positions zero weight",
        "Because 0 would make the row sum to more than 1",
        "Because `np.triu` needs negative values",
      ],
      answer: 0,
      explanation: "A score of 0 still gives `np.exp(0) = 1`, a positive weight.",
    },
    {
      id: "language-model-04-q3",
      question: "What is the first row of causal attention weights, for any scores?",
      options: [
        "Equal weights over all tokens",
        "1 on the first token and 0 elsewhere",
        "All zeros",
      ],
      answer: 1,
      explanation: "The first token can only attend to itself, so the softmax gives it all the weight.",
    },
  ],
};
