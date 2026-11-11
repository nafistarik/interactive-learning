import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "An activation function is applied to every value of a neuron's sum and keeps its shape. ReLU, the sigmoid and tanh are the common ones, and their bend is what lets a network draw more than a straight line.",
  estimatedMinutes: 14,
  sections: [
    {
      title: "What ReLU, sigmoid and tanh are",
      blocks: [
        {
          kind: "text",
          text: "An activation function works element by element: each value of `z` goes in alone and gives one value out. Three are common.",
        },
        {
          kind: "list",
          items: [
            "ReLU, short for rectified linear unit, keeps positive values and replaces negative ones with 0: `np.maximum(0, z)`.",
            "The sigmoid, `1 / (1 + np.exp(-z))`, squeezes any value between 0 and 1.",
            "tanh, `np.tanh(z)`, squeezes any value between -1 and 1, and maps 0 to 0.",
          ],
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "z = np.array([-2.0, -0.5, 0.0, 0.5, 2.0])",
            "print(np.maximum(0, z).tolist())",
            "print(np.round(1 / (1 + np.exp(-z)), 3).tolist())",
            "print(np.round(np.tanh(z), 3).tolist())",
          ].join("\n"),
          output: [
            "[0.0, 0.0, 0.0, 0.5, 2.0]",
            "[0.119, 0.378, 0.5, 0.622, 0.881]",
            "[-0.964, -0.462, 0.0, 0.462, 0.964]",
          ].join("\n"),
        },
      ],
    },
    {
      title: "Why the activation must not be a straight line",
      blocks: [
        {
          kind: "text",
          text: "A linear function is one of the form `a * z + c`: its graph is a straight line. If every activation were linear, a whole network would still compute a weighted sum plus a constant, and could only fit straight lines (lesson 04 shows this with matrices).",
        },
        {
          kind: "text",
          text: "ReLU bends at 0. Adding ReLUs that bend at different points gives a line whose slope changes, which no single straight line can do.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([-2.0, -1.0, 0.0, 1.0, 2.0, 3.0])",
            "y = np.maximum(0, x) + np.maximum(0, x - 1)",
            "print(y.tolist())",
          ].join("\n"),
          output: "[0.0, 0.0, 0.0, 1.0, 3.0, 5.0]",
        },
        {
          kind: "text",
          text: "From one point to the next, `y` rises by 0, then 1, then 2: the slope changes at `x = 0` and again at `x = 1`. More bends can follow a curve as closely as needed.",
        },
      ],
    },
    {
      title: "Element by element: the shape does not change",
      blocks: [
        {
          kind: "text",
          text: "Because each value is handled alone, the output has the shape of the input. A `(2, 3)` array of sums gives a `(2, 3)` array of outputs.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "Z = np.array([[-1.0, 2.0, 0.5], [3.0, -4.0, 0.0]])",
            "A = np.maximum(0, Z)",
            "print(Z.shape, A.shape)",
            "print(A.tolist())",
            "print(np.tanh(Z).shape)",
          ].join("\n"),
          output: ["(2, 3) (2, 3)", "[[0.0, 2.0, 0.5], [3.0, 0.0, 0.0]]", "(2, 3)"].join("\n"),
        },
        {
          kind: "note",
          text: "`np.maximum(0, z)` compares 0 with each value and keeps the larger. Do not confuse it with `np.max(z)`, which reduces the whole array to its single largest value.",
        },
      ],
    },
    {
      title: "A practical example: which to choose",
      blocks: [
        {
          kind: "list",
          items: [
            "ReLU is the usual choice for hidden neurons: it is one comparison, and its slope is 1 for every positive value.",
            "The sigmoid fits an output that is a probability, as in logistic regression.",
            "tanh is centred on 0, so its outputs can be negative; it is common in older networks and in some output layers.",
          ],
        },
        {
          kind: "text",
          text: "ReLU can also be written as `z * (z > 0)`: the comparison gives `True` for positive values, which counts as 1, and `False`, which counts as 0.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "z = np.array([-3, -1, 0, 2, 5])",
            "print(np.maximum(0, z))",
            "print(z * (z > 0))",
          ].join("\n"),
          output: ["[0 0 0 2 5]", "[0 0 0 2 5]"].join("\n"),
        },
      ],
    },
    {
      title: "Try it: three activations on the same sums",
      blocks: [
        {
          kind: "text",
          text: "Pick an activation and a scale for `z`, then watch it act on each value. The ReLU option uses `z * (z > 0)`, which equals `np.maximum(0, z)` and shows the comparison step.",
        },
        {
          kind: "playground",
          demo: {
            title: "An activation on z",
            controls: [
              {
                type: "select",
                name: "activation",
                label: "Activation",
                options: [
                  { label: "ReLU", value: "z * (z > 0)" },
                  { label: "sigmoid", value: "1 / (1 + np.exp(-z))" },
                  { label: "tanh", value: "np.tanh(z)" },
                ],
              },
              { type: "number", name: "scale", label: "Scale of z", min: 1, max: 3, initial: 1 },
            ],
            template: ["import numpy as np", "z = np.arange(-3, 4) * {{scale}}", "a = {{activation}}"].join("\n"),
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
            "An activation function acts on each value alone, so the output has the input's shape.",
            "ReLU is `np.maximum(0, z)`; the sigmoid is `1 / (1 + np.exp(-z))`; tanh is `np.tanh(z)`.",
            "The sigmoid's outputs lie between 0 and 1, tanh's between -1 and 1, ReLU's from 0 upwards.",
            "A non-linear activation bends; without the bends, a network can only fit straight lines.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "neural-networks-02-q1",
      question: "What is `np.maximum(0, z)` for `z = [-2.0, 0.5, 3.0]`?",
      options: ["`[0.0, 0.5, 3.0]`", "`3.0`", "`[-2.0, 0.0, 0.0]`", "`[2.0, 0.5, 3.0]`"],
      answer: 0,
      explanation: "ReLU keeps positive values and replaces negative ones with 0.",
    },
    {
      id: "neural-networks-02-q2",
      question: "`Z` has shape `(8, 5)`. What is the shape of `np.tanh(Z)`?",
      options: ["`(8,)`", "`(8, 5)`", "`(5,)`", "`()`"],
      answer: 1,
      explanation: "An activation acts element by element, so the shape does not change.",
    },
    {
      id: "neural-networks-02-q3",
      question: "Which activation can give negative outputs?",
      options: ["ReLU", "The sigmoid", "tanh"],
      answer: 2,
      explanation: "tanh lies between -1 and 1; ReLU and the sigmoid never go below 0.",
    },
    {
      id: "neural-networks-02-q4",
      question: "Why does a network need a non-linear activation?",
      options: [
        "To make the computation faster",
        "Without it, the network could only compute a weighted sum plus a constant: a straight line",
        "To keep the outputs between 0 and 1",
      ],
      answer: 1,
      explanation: "Linear steps in a row stay linear; the bends of a non-linear activation let it fit curves.",
    },
  ],
};
