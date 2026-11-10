import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "Put matrix multiplication and broadcasting together in `X @ W + b`, the linear layer at the heart of linear models and neural networks.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "The parts of X @ W + b",
      blocks: [
        {
          kind: "text",
          text: "A linear layer turns each example's features into one or more outputs. Each output is a weighted sum of the features plus a constant.",
        },
        {
          kind: "list",
          items: [
            "`X`, the inputs, shape `(examples, features)`: one row per example, one column per feature.",
            "`W`, the weight matrix, shape `(features, outputs)`: column `j` holds the weights of output `j`.",
            "`b`, the bias, shape `(outputs,)`: one number added to each output, whatever the inputs are.",
          ],
        },
        {
          kind: "text",
          text: "The result has shape `(examples, outputs)`: one row per example, one value per output.",
        },
      ],
    },
    {
      title: "Why machine learning uses it",
      blocks: [
        {
          kind: "text",
          text: "Linear regression is this layer with one output. Every layer of a neural network starts with it, followed by a simple function applied element by element.",
        },
        {
          kind: "text",
          text: "Learning a model means finding good values for `W` and `b`. The same line then computes every output of every example at once.",
        },
      ],
    },
    {
      title: "Why * is not enough",
      blocks: [
        {
          kind: "text",
          text: "In Module 0.1 you computed `X * w + b`. `*` is element-wise: it weights each feature but never adds the features together.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1, 2], [3, 4]])",
            "w = np.array([10, 1])",
            "print(X * w)",
            "print(X @ w)",
          ].join("\n"),
          output: ["[[10  2]", " [30  4]]", "[12 34]"].join("\n"),
        },
        {
          kind: "text",
          text: "`X * w` keeps one value per feature. `X @ w` adds each row's weighted features into one value per example, which is what a prediction needs.",
        },
      ],
    },
    {
      title: "Step by step: X @ W, then + b",
      blocks: [
        {
          kind: "text",
          text: "`@` comes before `+`, as multiplication does in ordinary math. So `X @ W + b` means `(X @ W) + b`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1, 2, 3], [4, 5, 6]])",
            "W = np.array([[1, 0], [0, 1], [1, -1]])",
            "b = np.array([10, 20])",
            "Z = X @ W",
            "print(Z)",
            "out = Z + b",
            "print(out)",
            "print(X.shape, W.shape, b.shape, out.shape)",
          ].join("\n"),
          output: ["[[ 4 -1]", " [10 -1]]", "[[14 19]", " [20 19]]", "(2, 3) (3, 2) (2,) (2, 2)"].join(
            "\n",
          ),
        },
        {
          kind: "text",
          text: "`X @ W` is `(2, 3) @ (3, 2) -> (2, 2)`. Then `b`, shape `(2,)`, broadcasts across the rows: each output gets its own bias.",
        },
      ],
    },
    {
      title: "A practical example: predicting house prices",
      blocks: [
        {
          kind: "text",
          text: "Each house has two features: its size in hundreds of square meters and its age in decades. One output, the price in hundreds of thousands, so `W` has one column.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1.2, 1], [0.8, 3], [2.0, 1]])",
            "W = np.array([[3.0], [-0.5]])",
            "b = np.array([1.0])",
            "prices = X @ W + b",
            "print(prices.shape)",
            "print(prices)",
          ].join("\n"),
          output: ["(3, 1)", "[[4.1]", " [1.9]", " [6.5]]"].join("\n"),
        },
        {
          kind: "text",
          text: "The first house: `1.2*3.0 + 1*(-0.5) + 1.0 = 4.1`. Size raises the price, age lowers it.",
        },
      ],
    },
    {
      title: "Checking shapes before you compute",
      blocks: [
        {
          kind: "list",
          items: [
            "`W` needs one row per feature: `W.shape[0]` must equal `X.shape[1]`.",
            "`b` needs one value per output: its length must equal `W.shape[1]`.",
          ],
        },
        {
          kind: "note",
          text: "If `X` is `(2, 3)` and `W` is `(2, 2)`, `X @ W` raises a `ValueError` because the inner sizes 3 and 2 differ. `W` was probably built for inputs with 2 features.",
        },
      ],
    },
    {
      title: "Try it: a linear layer",
      blocks: [
        {
          kind: "text",
          text: "`X` has 3 examples with 2 features. Pick a weight matrix and a bias, and watch `X @ W` form cell by cell before `b` is added. Try the options marked as not fitting to see which step fails.",
        },
        {
          kind: "playground",
          demo: {
            title: "Linear layer X @ W + b",
            controls: [
              {
                type: "select",
                name: "W",
                label: "Weights W",
                options: [
                  { label: "(2, 2), keeps each feature", value: "np.array([[1, 0], [0, 1]])" },
                  { label: "(2, 2), sum and difference", value: "np.array([[1, 1], [1, -1]])" },
                  { label: "(2, 2), halves", value: "np.array([[0.5, 0], [0.5, 1]])" },
                  { label: "(3, 2), does not fit", value: "np.array([[1, 0], [0, 1], [1, 1]])" },
                ],
              },
              {
                type: "select",
                name: "b",
                label: "Bias b",
                options: [
                  { label: "[0, 0]", value: "np.array([0, 0])" },
                  { label: "[10, 20]", value: "np.array([10, 20])" },
                  { label: "[1, 2, 3], does not fit", value: "np.array([1, 2, 3])" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "X = np.array([[1, 2], [3, 4], [5, 6]])",
              "W = {{W}}",
              "b = {{b}}",
              "out = X @ W + b",
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
            "A linear layer is `X @ W + b`: weighted sums of the features, plus a bias per output.",
            "`(examples, features) @ (features, outputs) -> (examples, outputs)`.",
            "`b` has one value per output and broadcasts across the rows.",
            "`X * w` only weights features; `X @ W` weights them and adds them up.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "matmul-04-q1",
      question: "`X` is `(100, 4)` and `W` is `(4, 3)`. What is the shape of `X @ W + b`?",
      options: ["(100, 4)", "(4, 3)", "(100, 3)", "(3,)"],
      answer: 2,
      explanation: "`(100, 4) @ (4, 3) -> (100, 3)`, and adding `b` keeps that shape.",
    },
    {
      id: "matmul-04-q2",
      question: "In that layer, what shape should `b` have?",
      options: ["(3,)", "(4,)", "(100,)"],
      answer: 0,
      explanation: "One bias per output, and there are 3 outputs.",
    },
    {
      id: "matmul-04-q3",
      question: "Which part of `X @ W + b` is computed first?",
      options: ["`W + b`", "`X @ W`", "Both at the same time"],
      answer: 1,
      explanation: "`@` comes before `+`, like multiplication.",
    },
    {
      id: "matmul-04-q4",
      question: "Why does a linear layer use `X @ W` rather than `X * W`?",
      options: [
        "`@` adds each example's weighted features together; `*` keeps them separate",
        "`*` is slower but gives the same result",
        "`*` only works on vectors",
      ],
      answer: 0,
      explanation: "`*` is element-wise; `@` computes the weighted sums.",
    },
  ],
};
