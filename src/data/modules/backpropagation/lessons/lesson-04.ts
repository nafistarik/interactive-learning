import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "The backward pass of a dense layer `Z = X @ W + b` is three lines: `dW = X.T @ dZ`, `db = dZ.sum(axis=0)` and `dX = dZ @ W.T`. ReLU's backward is a mask, `dZ = dA * (Z > 0)`.",
  estimatedMinutes: 17,
  sections: [
    {
      title: "What a layer's backward pass is",
      blocks: [
        {
          kind: "text",
          text: "A layer from Module 2.1 computes `Z = X @ W + b` for a batch: `X` is `(n, d)`, `W` is `(d, m)`, `b` is `(m,)` and `Z` is `(n, m)`.",
        },
        {
          kind: "note",
          text: "Its backward pass receives the upstream gradient `dZ`, the slope of the loss for every entry of `Z`, with the shape of `Z`. It returns `dW` and `db` to update the layer, and `dX` to pass on to the layer before it.",
        },
      ],
    },
    {
      title: "Why layer by layer",
      blocks: [
        {
          kind: "text",
          text: "Each layer only needs its own local rule. The last layer turns the loss gradient into `dX`, which is the upstream gradient of the layer before it, and so on back to the input.",
        },
        {
          kind: "text",
          text: "So a network of any depth needs just two backward rules here: one for the dense layer and one for the activation.",
        },
      ],
    },
    {
      title: "Three formulas, checked by shape",
      blocks: [
        {
          kind: "list",
          items: [
            "`dW = X.T @ dZ`: like `X.T @ dz` for one neuron, now with one column per output unit.",
            "`db = dZ.sum(axis=0)`: `b` is added to every row of `Z`, so its gradient sums over the rows.",
            "`dX = dZ @ W.T`: each input feeds every output unit through one row of `W`.",
          ],
        },
        {
          kind: "text",
          text: "Every gradient has the shape of the value it belongs to. If you forget a formula, the shapes leave only one way to combine `X`, `W` and `dZ`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.ones((4, 3))",
            "W = np.ones((3, 2))",
            "b = np.zeros(2)",
            "Z = X @ W + b",
            "dZ = np.ones_like(Z)",
            "dW = X.T @ dZ",
            "db = dZ.sum(axis=0)",
            "dX = dZ @ W.T",
            "print(Z.shape, dZ.shape)",
            "print(W.shape, dW.shape)",
            "print(b.shape, db.shape)",
            "print(X.shape, dX.shape)",
          ].join("\n"),
          output: ["(4, 2) (4, 2)", "(3, 2) (3, 2)", "(2,) (2,)", "(4, 3) (4, 3)"].join("\n"),
        },
      ],
    },
    {
      title: "ReLU's backward is a mask",
      blocks: [
        {
          kind: "text",
          text: "`A = np.maximum(0, Z)` passes positive values unchanged (slope 1) and turns the rest into 0 (slope 0). Its local gradient is `Z > 0`, a mask of `True` and `False`.",
        },
        {
          kind: "text",
          text: "Multiplying by the mask keeps the upstream gradient `dA` where the unit was active and zeroes it elsewhere: `dZ = dA * (Z > 0)`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "Z = np.array([[1.5, -0.5], [-2.0, 0.25]])",
            "A = np.maximum(0, Z)",
            "dA = np.array([[1.0, 2.0], [3.0, 4.0]])",
            "dZ = dA * (Z > 0)",
            "print(A.tolist())",
            "print((Z > 0).tolist())",
            "print(dZ.tolist())",
          ].join("\n"),
          output: ["[[1.5, 0.0], [0.0, 0.25]]", "[[True, False], [False, True]]", "[[1.0, 0.0], [0.0, 4.0]]"].join(
            "\n",
          ),
        },
      ],
    },
    {
      title: "A layer's gradients with numbers",
      blocks: [
        {
          kind: "text",
          text: "With a given `dZ`, the three formulas are three lines. `db` adds the two rows of `dZ`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1.0, 2.0], [3.0, -1.0]])",
            "W = np.array([[0.5, -1.0], [0.25, 2.0]])",
            "dZ = np.array([[1.0, 0.5], [-1.0, 2.0]])",
            "dW = X.T @ dZ",
            "db = dZ.sum(axis=0)",
            "dX = dZ @ W.T",
            "print(dW.tolist())",
            "print(db.tolist())",
            "print(dX.tolist())",
          ].join("\n"),
          output: ["[[-2.0, 6.5], [3.0, -1.0]]", "[0.0, 2.5]", "[[0.0, 1.25], [-2.5, 3.75]]"].join("\n"),
        },
        {
          kind: "text",
          text: "A gradient check from lesson 03 confirms the formula on one entry. Here the loss is the MSE of `Z` against targets `Y`, so `dZ = 2 * (Z - Y) / Z.size`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1.0, 2.0], [3.0, -1.0], [0.5, 0.5]])",
            "W = np.array([[0.5, -1.0], [0.25, 2.0]])",
            "b = np.array([0.1, -0.2])",
            "Y = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]])",
            "",
            "def loss(W):",
            "    Z = X @ W + b",
            "    return np.mean((Z - Y) ** 2)",
            "",
            "Z = X @ W + b",
            "dZ = 2 * (Z - Y) / Z.size",
            "dW = X.T @ dZ",
            "",
            "h = 1e-5",
            "W_plus = W.copy()",
            "W_plus[0, 1] += h",
            "W_minus = W.copy()",
            "W_minus[0, 1] -= h",
            "numeric = (loss(W_plus) - loss(W_minus)) / (2 * h)",
            "print(round(float(dW[0, 1]), 4), round(float(numeric), 4))",
            "print(bool(np.isclose(dW[0, 1], numeric)))",
          ].join("\n"),
          output: ["-5.3833 -5.3833", "True"].join("\n"),
        },
      ],
    },
    {
      title: "Try it: pick a gradient",
      blocks: [
        {
          kind: "text",
          text: "Pick a formula and a batch size and watch which cells combine; `db` shows the rows of `dZ` collapsing into one. The last option forgets the transpose: the shapes do not line up.",
        },
        {
          kind: "playground",
          demo: {
            title: "Gradients of Z = X @ W + b",
            controls: [
              {
                type: "select",
                name: "grad",
                label: "gradient",
                options: [
                  { label: "dW = X.T @ dZ", value: "dW = X.T @ dZ" },
                  { label: "db = dZ.sum(axis=0)", value: "db = dZ.sum(axis=0)" },
                  { label: "dX = dZ @ W.T", value: "dX = dZ @ W.T" },
                  { label: "dX = dZ @ W (no transpose)", value: "dX = dZ @ W" },
                ],
              },
              { type: "number", name: "rows", label: "rows n", min: 2, max: 5, initial: 3 },
            ],
            template: [
              "import numpy as np",
              "X = np.arange({{rows}} * 3).reshape({{rows}}, 3) * 0.5",
              "W = np.array([[1.0, -0.5], [0.5, 0.25], [-1.0, 2.0]])",
              "dZ = np.arange({{rows}} * 2).reshape({{rows}}, 2) - 1.0",
              "{{grad}}",
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
            "For `Z = X @ W + b`: `dW = X.T @ dZ`, `db = dZ.sum(axis=0)`, `dX = dZ @ W.T`.",
            "Each gradient has the shape of its value: `dW` like `W`, `db` like `b`, `dX` like `X`.",
            "ReLU backward: `dZ = dA * (Z > 0)`, using `Z` from the forward pass.",
            "`dX` is the upstream gradient of the layer before, so layers chain backwards.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "backpropagation-04-q1",
      question: "`X` is `(8, 4)`, `W` is `(4, 3)` and `dZ` is `(8, 3)`. Which expression gives `dW`?",
      options: ["`X.T @ dZ`", "`dZ @ X.T`", "`X @ dZ`", "`dZ.T @ X`"],
      answer: 0,
      explanation: "`(4, 8) @ (8, 3)` gives `(4, 3)`, the shape of `W`. `dZ.T @ X` is `(3, 4)`, the transpose.",
    },
    {
      id: "backpropagation-04-q2",
      question: "Why is `db` the sum of `dZ` over axis 0?",
      options: [
        "`b` is added to every row of `Z`, so every row's gradient reaches it",
        "To make `db` a scalar",
        "Because `b` starts at zero",
      ],
      answer: 0,
      explanation: "One `b[j]` affects `Z[i, j]` in every row `i`, so its slope adds up the column `dZ[:, j]`.",
    },
    {
      id: "backpropagation-04-q3",
      question: "`Z = [[2.0, -1.0]]` and `dA = [[0.5, 0.5]]`. What is `dZ` after ReLU?",
      options: ["`[[0.5, 0.5]]`", "`[[0.5, 0.0]]`", "`[[0.0, 0.5]]`", "`[[1.0, -0.5]]`"],
      answer: 1,
      explanation: "The mask `Z > 0` is `[[True, False]]`, so only the first gradient passes.",
    },
  ],
};
