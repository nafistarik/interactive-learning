import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "A residual connection adds a sublayer's input to its output: `x + sublayer(x)`. The original signal passes through unchanged, and the gradient gets a direct path back.",
  estimatedMinutes: 14,
  sections: [
    {
      title: "What a residual connection is",
      blocks: [
        {
          kind: "text",
          text: "A sublayer is one step inside a transformer block, such as attention or the feed-forward layer of lesson 04. A residual connection, also called a skip connection, adds the sublayer's input back to its output: `out = x + sublayer(x)`.",
        },
        {
          kind: "text",
          text: "The sublayer no longer has to produce the whole new value. It only computes a change, which is added to `x`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([[1.0, 2.0], [3.0, -1.0]])",
            "W = np.array([[0.5, 0.0], [0.0, -0.5]])",
            "sub = x @ W",
            "out = x + sub",
            "print(sub.tolist())",
            "print(out.tolist())",
          ].join("\n"),
          output: ["[[0.5, -1.0], [1.5, 0.5]]", "[[1.5, 1.0], [4.5, -0.5]]"].join("\n"),
        },
      ],
    },
    {
      title: "Why add the input back",
      blocks: [
        {
          kind: "text",
          text: "A sublayer can lose information. Below, ReLU turns the whole first row to 0, so without the residual connection token 0 would be all zeros; with it, token 0 keeps its values.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([[1.0, -2.0], [-0.5, -1.0]])",
            "W = np.array([[-1.0, 0.0], [0.0, 1.0]])",
            "sub = np.maximum(0, x @ W)",
            "print(sub.tolist())",
            "print((x + sub).tolist())",
          ].join("\n"),
          output: ["[[0.0, 0.0], [0.5, 0.0]]", "[[1.0, -2.0], [0.0, -1.0]]"].join("\n"),
        },
        {
          kind: "text",
          text: "It also helps training. In Phase 2, backpropagation multiplied the local slopes along the path, so many small slopes in a row made the gradient vanish. The slope of `x + f(x)` with respect to `x` is `1 + f'(x)`, which stays near 1 even when `f'(x)` is small.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "slopes = np.array([0.1, 0.1, 0.1, 0.1, 0.1])",
            "print(np.round(np.prod(slopes), 6))",
            "print(np.round(np.prod(1 + slopes), 3))",
          ].join("\n"),
          output: ["1e-05", "1.611"].join("\n"),
        },
        {
          kind: "text",
          text: "Five layers with slope 0.1 each shrink the gradient to 0.00001. With a residual connection around each layer, the factors are 1.1 and the gradient keeps its size.",
        },
      ],
    },
    {
      title: "The shapes must match",
      blocks: [
        {
          kind: "text",
          text: "`x + sublayer(x)` is an element-wise sum, so the sublayer must return the shape of its input, `(n, d_model)`. This is why attention and the feed-forward layer both end with `d_model` columns.",
        },
        {
          kind: "note",
          text: "With `x` of shape `(3, 4)` and `W` of shape `(4, 3)`, `x @ W` has shape `(3, 3)`, and `x + x @ W` stops with `ValueError: operands could not be broadcast together with shapes (3,4) (3,3)`.",
        },
      ],
    },
    {
      title: "A practical example: a residual around attention",
      blocks: [
        {
          kind: "text",
          text: "Self-attention from Module 3.2 returns one row per token, with the width of `x`, so it can be wrapped directly. Each token's output is its own vector plus what it read from the other tokens.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "def self_attention(x):",
            "    scores = x @ x.T / np.sqrt(x.shape[1])",
            "    e = np.exp(scores - scores.max(axis=-1, keepdims=True))",
            "    weights = e / e.sum(axis=-1, keepdims=True)",
            "    return weights @ x",
            "x = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]])",
            "h = x + self_attention(x)",
            "print(self_attention(x).shape, h.shape)",
            "print(np.round(h, 3).tolist())",
          ].join("\n"),
          output: ["(3, 2) (3, 2)", "[[1.802, 0.599], [0.599, 1.802], [1.752, 1.752]]"].join("\n"),
        },
      ],
    },
    {
      title: "Try it: a residual around a linear sublayer",
      blocks: [
        {
          kind: "text",
          text: "Pick the sublayer's weights `W` and watch `x + x @ W`. With zero weights the output equals `x`; with a `(4, 3)` matrix the shapes no longer match.",
        },
        {
          kind: "playground",
          demo: {
            title: "x + sublayer(x)",
            controls: [
              {
                type: "select",
                name: "W",
                label: "Sublayer weights W",
                options: [
                  { label: "zeros (the sublayer adds nothing)", value: "np.zeros((4, 4))" },
                  { label: "0.5 times the identity", value: "np.eye(4) * 0.5" },
                  { label: "shape (4, 3) (shapes do not match)", value: "np.ones((4, 3))" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "x = np.array([[1.0, 0.0, 2.0, -1.0], [0.5, 1.0, -1.0, 0.0], [0.0, -0.5, 1.0, 1.0]])",
              "W = {{W}}",
              "out = x + x @ W",
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
            "A residual connection computes `x + sublayer(x)`: the sublayer adds a change to its input.",
            "The input passes through unchanged, so a sublayer cannot erase it.",
            "The slope of `x + f(x)` is `1 + f'(x)`, so gradients keep a direct path back through many layers.",
            "The sublayer must return the shape of `x`, `(n, d_model)`, or the sum fails.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "transformer-block-02-q1",
      question: "What does a residual connection around `sublayer` compute?",
      options: ["`sublayer(x)`", "`x + sublayer(x)`", "`x * sublayer(x)`", "`sublayer(x) - x`"],
      answer: 1,
      explanation: "The input is added back to the sublayer's output.",
    },
    {
      id: "transformer-block-02-q2",
      question: "`x` has shape `(5, 8)`. Which sublayer output can be added in a residual connection?",
      options: ["`(5, 4)`", "`(8, 5)`", "`(5, 8)`", "`(5,)`"],
      answer: 2,
      explanation: "The sum is element-wise, so the output must have the shape of `x`.",
    },
    {
      id: "transformer-block-02-q3",
      question: "A sublayer's weights are all 0, so `sublayer(x)` is all zeros. What is `x + sublayer(x)`?",
      options: ["All zeros", "`x`", "`2 * x`"],
      answer: 1,
      explanation: "Adding zeros leaves `x` unchanged: the residual connection keeps the original signal.",
    },
    {
      id: "transformer-block-02-q4",
      question: "Why do residual connections help gradients in deep networks?",
      options: [
        "The slope of `x + f(x)` is `1 + f'(x)`, so it does not shrink towards 0 when `f'(x)` is small",
        "They remove the need for backpropagation",
        "They make every slope exactly 0",
      ],
      answer: 0,
      explanation: "The 1 gives the gradient a direct path, so multiplying many slopes does not make it vanish.",
    },
  ],
};
