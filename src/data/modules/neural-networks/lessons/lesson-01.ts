import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "A neuron computes a weighted sum of its inputs plus a bias, then applies an activation function. You have built one already: logistic regression is a single neuron.",
  estimatedMinutes: 12,
  sections: [
    {
      title: "What a neuron is",
      blocks: [
        {
          kind: "note",
          text: "A neuron is a small function of an input vector `x`: it computes the weighted sum `z = x @ w + b`, then passes `z` through an activation function. The weights `w` and the bias `b` are its parameters.",
        },
        {
          kind: "note",
          text: "An activation function is a fixed function applied to the neuron's sum `z`, such as the sigmoid `1 / (1 + np.exp(-z))` from Module 1.3. Its result is the neuron's output.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([1.0, 2.0, 3.0])",
            "w = np.array([0.5, -1.0, 0.25])",
            "b = 1.0",
            "z = x @ w + b",
            "a = 1 / (1 + np.exp(-z))",
            "print(z)",
            "print(round(float(a), 3))",
          ].join("\n"),
          output: ["0.25", "0.562"].join("\n"),
        },
        {
          kind: "text",
          text: "The sum is `1*0.5 + 2*(-1.0) + 3*0.25 + 1.0 = 0.25`. The sigmoid turns it into the output `0.562`.",
        },
      ],
    },
    {
      title: "Why the neuron matters",
      blocks: [
        {
          kind: "text",
          text: "A neural network is built from many neurons, wired so that the outputs of some are the inputs of others. Every one of them does the same two steps.",
        },
        {
          kind: "text",
          text: "You already know both steps. Logistic regression is one neuron with the sigmoid as its activation, and linear regression is one neuron with no activation at all.",
        },
      ],
    },
    {
      title: "Weights, bias and activation in plain words",
      blocks: [
        {
          kind: "list",
          items: [
            "Each weight says how much one input counts, and in which direction: a negative weight pulls the sum down when that input grows.",
            "The bias is added whatever the inputs are, so it moves the point where the sum crosses 0.",
            "The activation reshapes the sum. The sigmoid squeezes it between 0 and 1; lesson 02 shows other choices.",
          ],
        },
        {
          kind: "text",
          text: "Training a neuron means finding good weights and a good bias, exactly as gradient descent did for logistic regression. This module only computes outputs; training comes in Module 2.4.",
        },
      ],
    },
    {
      title: "A practical example: one neuron on a batch",
      blocks: [
        {
          kind: "text",
          text: "A batch is a set of examples processed together, one per row of `X`. With `X` of shape `(n, d)` and `w` of shape `(d,)`, `X @ w + b` gives the sum of every example at once.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1.0, 2.0, 3.0], [0.0, 1.0, 0.0], [2.0, 0.0, 4.0]])",
            "w = np.array([0.5, -1.0, 0.25])",
            "b = 1.0",
            "z = X @ w + b",
            "a = 1 / (1 + np.exp(-z))",
            "print(z.shape)",
            "print(z.tolist())",
            "print(np.round(a, 3).tolist())",
          ].join("\n"),
          output: ["(3,)", "[0.25, 0.0, 3.0]", "[0.562, 0.5, 0.953]"].join("\n"),
        },
        {
          kind: "text",
          text: "The first row is the example above, and it gives the same `0.25`. The same neuron, with the same `w` and `b`, gives one output per example and needs no loop.",
        },
      ],
    },
    {
      title: "Try it: one neuron, three examples",
      blocks: [
        {
          kind: "text",
          text: "Pick the weights and the bias, then watch the neuron turn each row's sum `z` into its sigmoid output. Pick the three-weight option to see the shape check fail.",
        },
        {
          kind: "playground",
          demo: {
            title: "A neuron: sigmoid(X @ w + b)",
            controls: [
              {
                type: "select",
                name: "w",
                label: "Weights w",
                options: [
                  { label: "[1.0, 0.5]", value: "np.array([1.0, 0.5])" },
                  { label: "[-1.0, 2.0]", value: "np.array([-1.0, 2.0])" },
                  { label: "[0.0, 0.0] (inputs ignored)", value: "np.array([0.0, 0.0])" },
                  { label: "[1.0, 0.5, 2.0] (3 weights, 2 inputs)", value: "np.array([1.0, 0.5, 2.0])" },
                ],
              },
              { type: "number", name: "b", label: "Bias b", min: -3, max: 3, initial: 0 },
            ],
            template: [
              "import numpy as np",
              "X = np.array([[1.0, 2.0], [0.0, 1.0], [2.0, -1.0]])",
              "w = {{w}}",
              "b = {{b}}",
              "z = X @ w + b",
              "a = 1 / (1 + np.exp(-z))",
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
            "A neuron computes `z = x @ w + b`, then applies an activation function to `z`.",
            "Logistic regression is one neuron with the sigmoid activation.",
            "On a batch `X` of shape `(n, d)`, `X @ w + b` gives one sum per example, shape `(n,)`.",
            "The weights and the bias are the neuron's parameters; training finds them.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "neural-networks-01-q1",
      question: "What does a neuron compute from its input `x`?",
      options: [
        "An activation of `x @ w + b`",
        "The mean of `x`",
        "`x * w`, element by element, with no sum",
      ],
      answer: 0,
      explanation: "A weighted sum plus a bias, then the activation function.",
    },
    {
      id: "neural-networks-01-q2",
      question: "Which Phase 1 model is exactly one neuron with the sigmoid activation?",
      options: ["Linear regression", "Logistic regression", "Gradient descent"],
      answer: 1,
      explanation: "Logistic regression computes `1 / (1 + np.exp(-(X @ w + b)))`: a sum, then the sigmoid.",
    },
    {
      id: "neural-networks-01-q3",
      question: "`X` has shape `(50, 4)` and `w` has shape `(4,)`. What is the shape of `X @ w + b` for a number `b`?",
      options: ["`(4,)`", "`(50, 4)`", "`(50,)`", "`()`"],
      answer: 2,
      explanation: "One sum per example: 50 rows give 50 values.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "X = np.array([[1.0, 2.0, 3.0], [0.0, 1.0, 0.0], [2.0, 0.0, 4.0]])",
    "w = np.array([0.5, -1.0, 0.25])",
    "b = 1.0",
    "z = X @ w + b",
    "a = 1 / (1 + np.exp(-z))",
    "print(z)",
    "print(a)",
    "",
    "# Try: change b to -2.0. Which outputs fall below 0.5?",
  ].join("\n"),
};
