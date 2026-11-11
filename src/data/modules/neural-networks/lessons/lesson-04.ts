import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "A network feeds the output of one layer into the next: `h = relu(X @ W1 + b1)`, then `out = h @ W2 + b2`. The activation between them is what makes two layers more than one.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What a network and a hidden layer are",
      blocks: [
        {
          kind: "note",
          text: "A network, or neural network, is a chain of layers: the output of each layer is the input of the next. The last layer is the output layer; its result is the network's answer.",
        },
        {
          kind: "note",
          text: "A hidden layer is any layer before the output layer. Its output, often called `h`, is used only inside the network, so it is never compared with a target.",
        },
        {
          kind: "text",
          text: "With one hidden layer of ReLU neurons, the network is two lines: `h = np.maximum(0, X @ W1 + b1)` and `out = h @ W2 + b2`. The output layer here has no activation, as in linear regression.",
        },
      ],
    },
    {
      title: "Why stack layers",
      blocks: [
        {
          kind: "text",
          text: "Each hidden ReLU neuron outputs a line with one bend. The output layer adds those bent lines with its weights, as lesson 02 added two ReLUs, so the network can follow a curve.",
        },
        {
          kind: "text",
          text: "More hidden neurons give more bends to work with. Module 2.4 trains such a network on a curve that no straight line fits.",
        },
      ],
    },
    {
      title: "Shapes through the network",
      blocks: [
        {
          kind: "list",
          items: [
            "`X` is `(n, d)`: `n` examples with `d` inputs.",
            "`W1` is `(d, m)` and `b1` is `(m,)`: a hidden layer of `m` neurons, so `h` is `(n, m)`.",
            "`W2` is `(m, o)` and `b2` is `(o,)`: an output layer of `o` neurons, so `out` is `(n, o)`.",
            "The rows of `W2` must equal the number of hidden neurons, because `h` is the output layer's input.",
          ],
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1.0, 2.0], [0.0, -1.0], [3.0, 1.0], [-2.0, 0.5]])",
            "W1 = np.array([[1.0, -1.0, 0.5], [0.5, 1.0, -1.0]])",
            "b1 = np.array([0.0, 0.5, 1.0])",
            "W2 = np.array([[1.0], [-1.0], [2.0]])",
            "b2 = np.array([0.5])",
            "h = np.maximum(0, X @ W1 + b1)",
            "out = h @ W2 + b2",
            "print(X.shape, h.shape, out.shape)",
            "print(h.tolist())",
            "print(out.tolist())",
          ].join("\n"),
          output: [
            "(4, 2) (4, 3) (4, 1)",
            "[[2.0, 1.5, 0.0], [0.0, 0.0, 2.0], [3.5, 0.0, 1.5], [0.0, 3.0, 0.0]]",
            "[[1.0], [4.5], [7.0], [-2.5]]",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "4 examples with 2 inputs become 4 rows of 3 hidden values, then 4 rows of 1 output. Each step is a layer from lesson 03.",
        },
      ],
    },
    {
      title: "Without an activation, two layers collapse into one",
      blocks: [
        {
          kind: "text",
          text: "Drop the ReLU and the network is `(X @ W1 + b1) @ W2 + b2`. Multiplying out gives `X @ (W1 @ W2) + (b1 @ W2 + b2)`: a single layer with weights `W1 @ W2` and bias `b1 @ W2 + b2`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1.0, 2.0], [0.0, -1.0], [3.0, 1.0], [-2.0, 0.5]])",
            "W1 = np.array([[1.0, -1.0, 0.5], [0.5, 1.0, -1.0]])",
            "b1 = np.array([0.0, 0.5, 1.0])",
            "W2 = np.array([[1.0], [-1.0], [2.0]])",
            "b2 = np.array([0.5])",
            "",
            "two = (X @ W1 + b1) @ W2 + b2",
            "W = W1 @ W2",
            "b = b1 @ W2 + b2",
            "one = X @ W + b",
            "print(W.shape, b.shape)",
            "print(two.ravel().tolist())",
            "print(one.ravel().tolist())",
            "print(np.allclose(two, one))",
          ].join("\n"),
          output: ["(2, 1) (1,)", "[0.0, 4.5, 8.5, -5.25]", "[0.0, 4.5, 8.5, -5.25]", "True"].join("\n"),
        },
        {
          kind: "text",
          text: "Two linear layers give exactly what one `(2, 1)` layer gives, so the hidden layer added nothing. With the ReLU, the outputs were `[1.0, 4.5, 7.0, -2.5]`, which no single linear layer reproduces for every input.",
        },
      ],
    },
    {
      title: "Try it: a forward pass",
      blocks: [
        {
          kind: "text",
          text: "Run the network with and without the ReLU, and with output weights of different shapes. Pick the `(2, 1)` weights to see `h @ W2` fail: the hidden layer has 3 neurons. The output bias is left out to keep the steps short.",
        },
        {
          kind: "playground",
          demo: {
            title: "Two layers: h, then out",
            controls: [
              {
                type: "select",
                name: "act",
                label: "Hidden activation",
                options: [
                  { label: "ReLU", value: "Z1 * (Z1 > 0)" },
                  { label: "none", value: "Z1" },
                ],
              },
              {
                type: "select",
                name: "W2",
                label: "Output weights W2",
                options: [
                  { label: "(3, 1): one output", value: "np.array([[1], [-2], [1]])" },
                  { label: "(3, 2): two outputs", value: "np.array([[1, 0], [-2, 1], [1, 1]])" },
                  { label: "(2, 1): wrong rows", value: "np.array([[1], [-2]])" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "X = np.array([[1, -1], [2, 0], [-1, 3]])",
              "W1 = np.array([[1, -1, 2], [0, 1, -1]])",
              "b1 = np.array([0, 1, -1])",
              "W2 = {{W2}}",
              "Z1 = X @ W1 + b1",
              "h = {{act}}",
              "out = h @ W2",
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
            "A network chains layers; a hidden layer is any layer before the output layer.",
            "Forward pass: `h = np.maximum(0, X @ W1 + b1)`, then `out = h @ W2 + b2`.",
            "Shapes: `(n, d)` to `(n, m)` to `(n, o)`; `W2` needs one row per hidden neuron.",
            "Without the activation, `W1 @ W2` and `b1 @ W2 + b2` make one layer that gives the same outputs.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "neural-networks-04-q1",
      question: "`X` is `(32, 5)`, `W1` is `(5, 16)` and `W2` is `(16, 1)`. What is the shape of `out`?",
      options: ["`(32, 16)`", "`(5, 1)`", "`(32, 1)`", "`(16, 1)`"],
      answer: 2,
      explanation: "`(32, 5)` becomes `(32, 16)` in the hidden layer, then `(32, 1)` in the output layer.",
    },
    {
      id: "neural-networks-04-q2",
      question: "A hidden layer has 8 neurons. How many rows must `W2` have?",
      options: ["8", "As many as `X` has columns", "1"],
      answer: 0,
      explanation: "`h` has 8 columns, one per hidden neuron, and `h @ W2` needs one row of `W2` per column of `h`.",
    },
    {
      id: "neural-networks-04-q3",
      question: "What happens to two layers with no activation between them?",
      options: [
        "They fit curves better",
        "They equal one layer with weights `W1 @ W2`",
        "They raise a shape error",
      ],
      answer: 1,
      explanation: "`(X @ W1 + b1) @ W2 + b2 = X @ (W1 @ W2) + (b1 @ W2 + b2)`: still one linear layer.",
    },
  ],
};
