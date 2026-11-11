import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "A layer is a group of neurons that read the same inputs. Put their weights side by side in a weight matrix `W`, and one line, `X @ W + b`, computes every neuron on every example.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What a layer and a weight matrix are",
      blocks: [
        {
          kind: "note",
          text: "A layer is a group of `k` neurons that all read the same inputs. Each neuron has its own weights and its own bias, and they all use the same activation function.",
        },
        {
          kind: "note",
          text: "The weight matrix `W` of a layer holds the weights of its neurons side by side: column `j` is the weight vector of neuron `j`. With `d` inputs and `k` neurons, `W` has shape `(d, k)` and the bias `b` has shape `(k,)`.",
        },
        {
          kind: "text",
          text: "The layer's sums are `Z = X @ W + b`, and its outputs are the activation of `Z`, for example `A = np.maximum(0, Z)`.",
        },
      ],
    },
    {
      title: "Why one matrix product instead of k neurons",
      blocks: [
        {
          kind: "text",
          text: "You could compute each neuron alone, `X @ W[:, j] + b[j]`, in a loop over `j`. One `@` computes all of them for all examples in one fast step, as in the linear layer of Module 0.2.",
        },
        {
          kind: "text",
          text: "The code also stays the same size whatever the number of neurons: a layer of 3 neurons and a layer of 300 are both `X @ W + b`.",
        },
      ],
    },
    {
      title: "Each column is one neuron",
      blocks: [
        {
          kind: "text",
          text: "Cell `(i, j)` of `X @ W` is row `i` of `X`, one example, dotted with column `j` of `W`, one neuron. So column `j` of `Z` holds neuron `j`'s sum for every example.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1.0, 2.0], [3.0, -1.0]])",
            "W = np.array([[1.0, 0.0, -1.0], [0.5, 1.0, 2.0]])",
            "b = np.array([0.0, -1.0, 0.5])",
            "Z = X @ W + b",
            "print(Z.shape)",
            "print(Z.tolist())",
            "print((X @ W[:, 0] + b[0]).tolist())",
          ].join("\n"),
          output: ["(2, 3)", "[[2.0, 1.0, 3.5], [2.5, -2.0, -4.5]]", "[2.0, 2.5]"].join("\n"),
        },
        {
          kind: "text",
          text: "Neuron 0 alone gives `[2.0, 2.5]`, which is column 0 of `Z`. The layer gives 2 examples times 3 neurons: shape `(2, 3)`.",
        },
      ],
    },
    {
      title: "The shapes of a layer",
      blocks: [
        {
          kind: "list",
          items: [
            "`X` has shape `(n, d)`: `n` examples with `d` inputs each.",
            "`W` has shape `(d, k)`: one row per input, one column per neuron.",
            "`b` has shape `(k,)`: one bias per neuron, broadcast across the rows.",
            "`Z = X @ W + b` and its activation `A` have shape `(n, k)`: one row per example, one column per neuron.",
          ],
        },
        {
          kind: "note",
          text: "The rows of `W` must match the columns of `X`. If `X` has 2 columns and `W` has 3 rows, `X @ W` raises a `ValueError`.",
        },
      ],
    },
    {
      title: "A practical example: a ReLU layer",
      blocks: [
        {
          kind: "text",
          text: "Add ReLU to the layer above. Each neuron now outputs its sum when it is positive and 0 otherwise.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1.0, 2.0], [3.0, -1.0]])",
            "W = np.array([[1.0, 0.0, -1.0], [0.5, 1.0, 2.0]])",
            "b = np.array([0.0, -1.0, 0.5])",
            "Z = X @ W + b",
            "A = np.maximum(0, Z)",
            "print(A.tolist())",
            "print((A > 0).sum(axis=0).tolist())",
          ].join("\n"),
          output: ["[[2.0, 1.0, 3.5], [2.5, 0.0, 0.0]]", "[2, 1, 1]"].join("\n"),
        },
        {
          kind: "text",
          text: "For the second example, neurons 1 and 2 output 0. The last line counts, per neuron, how many examples gave a positive output: neuron 0 is active for both.",
        },
      ],
    },
    {
      title: "Try it: a layer of k neurons",
      blocks: [
        {
          kind: "text",
          text: "Change the number of neurons and watch each output cell come from one row of `X` times one column of `W`. Pick 3 rows to see the shape check fail.",
        },
        {
          kind: "playground",
          demo: {
            title: "A layer: Z = X @ W + b",
            controls: [
              { type: "number", name: "k", label: "Neurons k", min: 1, max: 4, initial: 3 },
              {
                type: "select",
                name: "rows",
                label: "Rows of W",
                options: [
                  { label: "2 (one per input)", value: "2" },
                  { label: "3 (does not match X)", value: "3" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "X = np.array([[1, 2], [3, -1], [0, 1]])",
              "W = np.arange({{rows}} * {{k}}).reshape(({{rows}}, {{k}})) - {{k}}",
              "b = np.arange({{k}})",
              "Z = X @ W + b",
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
            "A layer is `k` neurons reading the same inputs; its weight matrix `W` has one column per neuron.",
            "`Z = X @ W + b`, then an activation such as `np.maximum(0, Z)`.",
            "`(n, d) @ (d, k)` gives `(n, k)`: one row per example, one column per neuron.",
            "Column `j` of the output is what neuron `j` alone would compute.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "neural-networks-03-q1",
      question: "A layer has 4 inputs and 6 neurons. What is the shape of its weight matrix `W`?",
      options: ["`(6, 4)`", "`(4, 6)`", "`(4,)`", "`(6,)`"],
      answer: 1,
      explanation: "One row per input and one column per neuron: `(d, k) = (4, 6)`.",
    },
    {
      id: "neural-networks-03-q2",
      question: "`X` has shape `(10, 4)` and `W` has shape `(4, 6)`. What is the shape of `X @ W + b`?",
      options: ["`(10, 6)`", "`(10, 4)`", "`(4, 6)`", "`(6,)`"],
      answer: 0,
      explanation: "One row per example and one column per neuron.",
    },
    {
      id: "neural-networks-03-q3",
      question: "What does column `j` of `X @ W + b` hold?",
      options: [
        "All neurons' outputs for example `j`",
        "The weights of neuron `j`",
        "Neuron `j`'s sum for every example",
      ],
      answer: 2,
      explanation: "Column `j` comes from column `j` of `W`, the weights of neuron `j`.",
    },
  ],
};
