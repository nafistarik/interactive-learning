import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "Layer normalization rescales each token's row to mean 0 and standard deviation 1, then scales it by `gamma` and shifts it by `beta`. It keeps the values of every row on the same scale, layer after layer.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What layer normalization is",
      blocks: [
        {
          kind: "text",
          text: "Layer normalization works on each row, one token's vector, separately. It subtracts the row's mean and divides by the row's standard deviation, so the row ends with mean 0 and standard deviation 1.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([[2.0, 4.0, 6.0, 8.0]])",
            "mean = x.mean(axis=-1, keepdims=True)",
            "std = x.std(axis=-1, keepdims=True)",
            "print(mean.tolist(), np.round(std, 3).tolist())",
            "print(np.round((x - mean) / std, 3).tolist())",
          ].join("\n"),
          output: ["[[5.0]] [[2.236]]", "[[-1.342, -0.447, 0.447, 1.342]]"].join("\n"),
        },
        {
          kind: "text",
          text: "Then it multiplies by `gamma` and adds `beta`, two vectors of length `d_model` that the model learns. They let the model choose another scale and centre for each column when that helps.",
        },
      ],
    },
    {
      title: "Why normalize each row",
      blocks: [
        {
          kind: "text",
          text: "Each residual connection adds to `x`, so after several sublayers the values in a row can grow or drift. Layer normalization brings every row back to the same scale, so the next sublayer always gets inputs of a similar size, which keeps training stable.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([[1.0, 2.0, 3.0], [100.0, 200.0, 300.0]])",
            "normed = (x - x.mean(axis=-1, keepdims=True)) / np.sqrt(x.var(axis=-1, keepdims=True) + 1e-5)",
            "print(np.round(normed, 3).tolist())",
          ].join("\n"),
          output: "[[-1.225, 0.0, 1.225], [-1.225, 0.0, 1.225]]",
        },
        {
          kind: "text",
          text: "The second row is 100 times larger, yet both rows end with the same values: only the pattern within each row is kept.",
        },
      ],
    },
    {
      title: "Per row: axis=-1 and keepdims=True",
      blocks: [
        {
          kind: "text",
          text: "`axis=-1` means the last axis, the columns of one row. `keepdims=True` keeps the mean as a column of shape `(n, 1)`, so it broadcasts across its own row when subtracted.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.arange(12.0).reshape(3, 4)",
            "print(x.mean(axis=-1).shape)",
            "print(x.mean(axis=-1, keepdims=True).shape)",
            "print((x - x.mean(axis=-1, keepdims=True)).tolist())",
          ].join("\n"),
          output: [
            "(3,)",
            "(3, 1)",
            "[[-1.5, -0.5, 0.5, 1.5], [-1.5, -0.5, 0.5, 1.5], [-1.5, -0.5, 0.5, 1.5]]",
          ].join("\n"),
        },
        {
          kind: "list",
          items: [
            "The variance is `x.var(axis=-1, keepdims=True)`, the mean of the squared distances from the row mean; the standard deviation is its square root.",
            "`eps` is a small number, such as `1e-5`, added to the variance before the square root, so a row whose values are all equal does not divide by 0.",
            "The full formula: `(x - mean) / np.sqrt(var + eps) * gamma + beta`.",
          ],
        },
        {
          kind: "note",
          text: "`axis=0` would average each column over all tokens instead, mixing tokens together. The code still runs, but the rows no longer have mean 0.",
        },
      ],
    },
    {
      title: "A practical example: a layer_norm function",
      blocks: [
        {
          kind: "text",
          text: "With `gamma` all ones and `beta` all zeros, each row ends with mean 0 and standard deviation close to 1. Other values of `gamma` and `beta` rescale and shift each column.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "def layer_norm(x, gamma, beta, eps=1e-5):",
            "    mean = x.mean(axis=-1, keepdims=True)",
            "    var = x.var(axis=-1, keepdims=True)",
            "    return (x - mean) / np.sqrt(var + eps) * gamma + beta",
            "x = np.array([[1.0, 3.0, 5.0, 7.0], [2.0, -2.0, 4.0, 0.0]])",
            "z = layer_norm(x, np.ones(4), np.zeros(4))",
            "print(np.round(z, 3).tolist())",
            "print(np.round(z.mean(axis=-1), 3).tolist())",
            "print(np.round(z.std(axis=-1), 3).tolist())",
            "out = layer_norm(x, np.array([2.0, 2.0, 1.0, 1.0]), np.array([0.0, 0.0, 0.5, 0.5]))",
            "print(np.round(out, 3).tolist())",
          ].join("\n"),
          output: [
            "[[-1.342, -0.447, 0.447, 1.342], [0.447, -1.342, 1.342, -0.447]]",
            "[0.0, 0.0]",
            "[1.0, 1.0]",
            "[[-2.683, -0.894, 0.947, 1.842], [0.894, -2.683, 1.842, 0.053]]",
          ].join("\n"),
        },
      ],
    },
    {
      title: "Try it: normalize over rows or columns",
      blocks: [
        {
          kind: "text",
          text: "Pick the axis and watch which cells each mean collapses. With `axis=-1` every row of `normed` has the same pattern; with `axis=0` each column is normalized over the tokens instead.",
        },
        {
          kind: "playground",
          demo: {
            title: "Layer normalization step by step",
            controls: [
              {
                type: "select",
                name: "axis",
                label: "axis",
                options: [
                  { label: "-1 (each row: layer norm)", value: "-1" },
                  { label: "0 (each column: a bug)", value: "0" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "x = np.array([[1.0, 2.0, 3.0, 6.0], [10.0, 20.0, 30.0, 60.0], [-1.0, 0.0, 1.0, 0.0]])",
              "m = x.mean(axis={{axis}}, keepdims=True)",
              "d = x - m",
              "v = (d * d).mean(axis={{axis}}, keepdims=True)",
              "normed = d / np.sqrt(v + 1e-5)",
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
            "Layer normalization normalizes each row: `(x - mean) / np.sqrt(var + eps)`.",
            "Use `axis=-1` and `keepdims=True` so each row's mean and variance broadcast across that row.",
            "Then `* gamma + beta` lets the model learn a scale and shift for each column.",
            "Every row ends on the same scale, whatever its size before, which keeps training stable.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "transformer-block-03-q1",
      question: "`x` has shape `(3, 4)`. What is the shape of `x.mean(axis=-1, keepdims=True)`?",
      options: ["`(3,)`", "`(3, 1)`", "`(1, 4)`", "`(4,)`"],
      answer: 1,
      explanation: "`axis=-1` collapses the 4 columns; `keepdims=True` keeps that axis with length 1.",
    },
    {
      id: "transformer-block-03-q2",
      question: "After layer normalization with `gamma` all ones and `beta` all zeros, what holds for each row?",
      options: [
        "Mean 0 and standard deviation about 1",
        "Values between 0 and 1",
        "Sum 1",
        "Each column has mean 0",
      ],
      answer: 0,
      explanation: "Subtracting the row mean and dividing by the row's standard deviation gives mean 0 and standard deviation 1.",
    },
    {
      id: "transformer-block-03-q3",
      question: "Why is `eps` added to the variance?",
      options: [
        "To avoid dividing by 0 when all values of a row are equal",
        "To make the mean exactly 0",
        "To learn the scale of each column",
      ],
      answer: 0,
      explanation: "A constant row has variance 0; `eps` keeps the square root above 0.",
    },
    {
      id: "transformer-block-03-q4",
      question: "What goes wrong with `x.mean(axis=0, keepdims=True)` in layer normalization?",
      options: [
        "It raises an error",
        "It averages each column over all tokens, so the rows do not end with mean 0",
        "Nothing; it gives the same result",
      ],
      answer: 1,
      explanation: "The code runs, but it normalizes across tokens instead of within each token's row.",
    },
  ],
};
