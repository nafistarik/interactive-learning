import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "Compute every gradient of a single tanh neuron with MSE by the chain rule: run the forward pass, then walk back from the loss one local gradient at a time, each a NumPy one-liner.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What gradients by hand means",
      blocks: [
        {
          kind: "text",
          text: "Take one neuron from Module 2.1: `z = x @ w + b`, `pred = np.tanh(z)`, and the squared error `loss = (pred - y) ** 2`. We want `dw` and `db`, the slopes of the loss for the weights and the bias.",
        },
        {
          kind: "note",
          text: "The backward pass computes these slopes in reverse order of the forward pass: from the loss to `pred`, to `z`, to `w` and `b`. At each step the upstream gradient (the slope of the loss for this step's output) is multiplied by the step's local gradient.",
        },
      ],
    },
    {
      title: "Why go backwards",
      blocks: [
        {
          kind: "text",
          text: "Every path from a weight to the loss goes through `z`, `pred` and the error. Going backwards computes the shared part `dz` once and reuses it for `w` and `b`.",
        },
        {
          kind: "text",
          text: "In a network with many layers the shared part is most of the work, so the backward pass costs on the order of one forward pass, not one forward pass per weight.",
        },
      ],
    },
    {
      title: "The local gradient of each step",
      blocks: [
        {
          kind: "list",
          items: [
            "`loss = (pred - y) ** 2`: the slope for `pred` is `2 * (pred - y)`.",
            "`pred = np.tanh(z)`: the slope for `z` is `1 - pred * pred`.",
            "`z = x @ w + b`: nudging `w[i]` moves `z` by `x[i]` per unit, so the slope for `w` is `x`; nudging `b` moves `z` by the same amount, so the slope for `b` is `1`.",
          ],
        },
        {
          kind: "text",
          text: "The slope of `tanh` is a known result; you do not have to derive it. A numeric slope confirms it at any point.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "z, h = 0.5, 0.001",
            "numeric = (np.tanh(z + h) - np.tanh(z - h)) / (2 * h)",
            "formula = 1 - np.tanh(z) * np.tanh(z)",
            "print(round(float(numeric), 4), round(float(formula), 4))",
          ].join("\n"),
          output: "0.7864 0.7864",
        },
      ],
    },
    {
      title: "One example, forward then backward",
      blocks: [
        {
          kind: "text",
          text: "First the forward pass, keeping every intermediate value: the backward pass needs them.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([1.0, 2.0])",
            "w = np.array([0.5, -0.25])",
            "b = 0.1",
            "y = 1.0",
            "z = x @ w + b",
            "pred = np.tanh(z)",
            "loss = (pred - y) ** 2",
            "print(round(float(z), 4), round(float(pred), 4), round(float(loss), 4))",
          ].join("\n"),
          output: "0.1 0.0997 0.8106",
        },
        {
          kind: "text",
          text: "Then the backward pass, one chain-rule step per line. `dz` is the upstream gradient times the local gradient of `tanh`; `dw` and `db` reuse it.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([1.0, 2.0])",
            "w = np.array([0.5, -0.25])",
            "b = 0.1",
            "y = 1.0",
            "z = x @ w + b",
            "pred = np.tanh(z)",
            "",
            "dloss_dpred = 2 * (pred - y)",
            "dpred_dz = 1 - pred * pred",
            "dz = dloss_dpred * dpred_dz",
            "dw = dz * x",
            "db = dz",
            "print(round(float(dloss_dpred), 4), round(float(dpred_dz), 4), round(float(dz), 4))",
            "print(np.round(dw, 4), round(float(db), 4))",
          ].join("\n"),
          output: ["-1.8007 0.9901 -1.7828", "[-1.7828 -3.5656] -1.7828"].join("\n"),
        },
        {
          kind: "text",
          text: "The prediction is far below the target, so `dz` is negative and so are both slopes: raising `w` and `b` would lower the loss. `dw` has the shape of `w`.",
        },
      ],
    },
    {
      title: "A batch: the mean adds 1 / n",
      blocks: [
        {
          kind: "text",
          text: "With `n` examples in the rows of `X`, the loss is `np.mean((pred - y) ** 2)`. The mean divides by `n`, so the slope for each prediction is `2 * (pred - y) / n`.",
        },
        {
          kind: "text",
          text: "Every example contributes to `dw` through its own row of `X`: the sum of `dz[i] * X[i]` over the rows is `X.T @ dz`. The bias gets the sum of `dz`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1.0, 2.0], [0.5, -1.0], [-1.5, 0.5]])",
            "y = np.array([1.0, 0.0, -0.5])",
            "w = np.array([0.5, -0.25])",
            "b = 0.1",
            "n = len(y)",
            "",
            "pred = np.tanh(X @ w + b)",
            "dpred = 2 * (pred - y) / n",
            "dz = dpred * (1 - pred * pred)",
            "dw = X.T @ dz",
            "db = dz.sum()",
            "print(dz.shape, dw.shape)",
            "print(np.round(dw, 4), round(float(db), 4))",
          ].join("\n"),
          output: ["(3,) (2,)", "[-0.3803 -1.4721] -0.3972"].join("\n"),
        },
      ],
    },
    {
      title: "Try it: change the target",
      blocks: [
        {
          kind: "text",
          text: "Pick a target `y` and step through the chain from `dloss_dpred` to `dw`. Watch the sign of `dz` follow the sign of `pred - y`.",
        },
        {
          kind: "playground",
          demo: {
            title: "Backward through one neuron",
            controls: [
              {
                type: "select",
                name: "y",
                label: "target y",
                options: [
                  { label: "1.0 (prediction too low)", value: "1.0" },
                  { label: "0.1 (close)", value: "0.1" },
                  { label: "-1.0 (prediction too high)", value: "-1.0" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "x = np.array([1.0, 2.0])",
              "w = np.array([0.5, -0.25])",
              "b = 0.1",
              "y = {{y}}",
              "z = x @ w + b",
              "pred = np.tanh(z)",
              "dloss_dpred = 2 * (pred - y)",
              "dpred_dz = 1 - pred * pred",
              "dz = dloss_dpred * dpred_dz",
              "db = dz",
              "dw = dz * x",
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
            "Run the forward pass and keep `z` and `pred`; the backward pass uses them.",
            "MSE: `dpred = 2 * (pred - y) / n`. tanh: `dz = dpred * (1 - pred * pred)`.",
            "`z = X @ w + b`: `dw = X.T @ dz` and `db = dz.sum()`.",
            "Each gradient has the shape of the value it belongs to.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "backpropagation-02-q1",
      question: "`pred = np.tanh(z)` and `dpred` is the upstream gradient. Which line gives `dz`?",
      options: [
        "`dz = dpred * (1 - pred * pred)`",
        "`dz = dpred + (1 - pred * pred)`",
        "`dz = 1 - pred * pred`",
        "`dz = dpred * pred`",
      ],
      answer: 0,
      explanation: "The chain rule multiplies the upstream gradient by the local gradient of `tanh`, `1 - pred * pred`.",
    },
    {
      id: "backpropagation-02-q2",
      question: "Why does the slope of `np.mean((pred - y) ** 2)` for each prediction have a `/ n`?",
      options: [
        "Because `tanh` divides by `n`",
        "Because the mean divides the sum of squared errors by `n`",
        "To keep the gradient small",
      ],
      answer: 1,
      explanation: "Each squared error enters the loss divided by `n`, so its slope is divided by `n` too.",
    },
    {
      id: "backpropagation-02-q3",
      question: "`X` has shape `(5, 3)` and `dz` has shape `(5,)`. What is the shape of `X.T @ dz`?",
      options: ["`(5,)`", "`(3,)`", "`(5, 3)`", "`()`"],
      answer: 1,
      explanation: "`(3, 5) @ (5,)` gives `(3,)`: one slope per weight, the shape of `w`.",
    },
  ],
};
