import type { Exercise } from "@/features/validation/types";

/** Visible setup for Exercise 26: sums of five neurons, one of them exactly 0 (lesson 02). */
const ACTIVATION_PRELUDE = ["import numpy as np", "z = np.array([-2.0, -0.5, 0.0, 1.5, 3.0])"].join("\n");

/** Hidden setup for Exercise 26: other values and a (3, 2) shape, so a hard-coded answer fails. */
const ACTIVATION_HIDDEN = [
  "import numpy as np",
  "z = np.array([[1.0, -3.0], [0.25, -0.75], [-2.0, 4.0]])",
].join("\n");

/** Visible setup for Exercise 27: 3 examples, 2 inputs, a layer of 3 neurons (lesson 03). */
const LAYER_PRELUDE = [
  "import numpy as np",
  "X = np.array([[1.0, 2.0], [-1.0, 0.5], [0.0, -2.0]])",
  "W = np.array([[0.5, -1.0, 2.0], [1.0, 0.0, -0.5]])",
  "b = np.array([0.0, 1.0, -0.5])",
].join("\n");

/** Hidden setup for Exercise 27: 2 examples, 4 inputs, a layer of 2 neurons. */
const LAYER_HIDDEN = [
  "import numpy as np",
  "X = np.array([[1.0, -1.0, 0.5, 2.0], [0.0, 3.0, -2.0, 1.0]])",
  "W = np.array([[1.0, 0.5], [-0.5, 1.0], [2.0, 0.0], [0.0, -1.0]])",
  "b = np.array([0.25, -0.5])",
].join("\n");

/** Visible setup for Exercise 28: 2 inputs, 3 hidden neurons, 1 output (lesson 04). */
const NETWORK_PRELUDE = [
  "import numpy as np",
  "X = np.array([[1.0, 2.0], [0.0, -1.0], [3.0, 1.0]])",
  "W1 = np.array([[1.0, -1.0, 0.5], [0.5, 1.0, -1.0]])",
  "b1 = np.array([0.0, 0.5, 1.0])",
  "W2 = np.array([[1.0], [-1.0], [2.0]])",
  "b2 = np.array([0.5])",
].join("\n");

/** Hidden setup for Exercise 28: 3 inputs, 2 hidden neurons, 2 outputs. */
const NETWORK_HIDDEN = [
  "import numpy as np",
  "X = np.array([[0.5, -1.0, 2.0], [1.0, 1.0, 0.0], [-2.0, 0.5, 1.0], [0.0, 0.0, 3.0]])",
  "W1 = np.array([[1.0, -0.5], [0.0, 2.0], [-1.0, 1.0]])",
  "b1 = np.array([0.5, -1.0])",
  "W2 = np.array([[2.0, -1.0], [1.0, 0.5]])",
  "b2 = np.array([0.0, 1.0])",
].join("\n");

/** Exercises of Module 2.1 (R5 brief): three builds, from one activation to a two-layer network. */
export const NEURAL_NETWORKS_EXERCISES: readonly Exercise[] = [
  {
    id: "ex26",
    lessonId: "02",
    title: "ReLU and tanh",
    objective: "Apply ReLU and tanh to every value of z, storing the results in relu_z and tanh_z.",
    problem:
      "The neuron sums z are given above the editor. Compute relu_z, the ReLU of every value, and tanh_z, the tanh of every value. Use NumPy operations on the whole array, without a loop.",
    starterCode: "# Compute relu_z and tanh_z from z.\n",
    prelude: ACTIVATION_PRELUDE,
    hint: "ReLU is np.maximum(0, z): it keeps the larger of 0 and each value. tanh is np.tanh(z).",
    runs: [
      { prelude: ACTIVATION_PRELUDE, reference: ACTIVATION_PRELUDE },
      { prelude: ACTIVATION_HIDDEN, reference: ACTIVATION_HIDDEN },
    ],
    checks: [
      { kind: "no-loop" },
      { kind: "result", name: "relu_z", expression: "np.maximum(0, z)" },
      { kind: "result", name: "tanh_z", expression: "np.tanh(z)", tolerance: 1e-6 },
      { kind: "unchanged", name: "z", expression: "z" },
    ],
    solution: "relu_z = np.maximum(0, z)\ntanh_z = np.tanh(z)",
  },
  {
    id: "ex27",
    lessonId: "03",
    title: "One ReLU layer",
    objective: "Compute a layer's sums Z = X @ W + b, then its outputs A, the ReLU of Z.",
    problem:
      "X (one example per row), the weight matrix W (one column per neuron) and the biases b are given above the editor. Compute Z, the sums of every neuron for every example, then A, the ReLU of Z.",
    starterCode: "# Compute Z, the layer's sums, then A, their ReLU.\n",
    prelude: LAYER_PRELUDE,
    hint: "Z = X @ W + b gives one row per example and one column per neuron. Then A = np.maximum(0, Z).",
    runs: [
      { prelude: LAYER_PRELUDE, reference: LAYER_PRELUDE },
      { prelude: LAYER_HIDDEN, reference: LAYER_HIDDEN },
    ],
    checks: [
      { kind: "result", name: "Z", expression: "X @ W + b", tolerance: 1e-6 },
      { kind: "result", name: "A", expression: "np.maximum(0, X @ W + b)", tolerance: 1e-6 },
      { kind: "unchanged", name: "X", expression: "X" },
      { kind: "unchanged", name: "W", expression: "W" },
    ],
    solution: "Z = X @ W + b\nA = np.maximum(0, Z)",
  },
  {
    id: "ex28",
    lessonId: "04",
    title: "Practical application: a two-layer forward pass",
    objective: "Compute the hidden layer h with ReLU, then the network's output out.",
    problem:
      "X and the weights of a network with one hidden layer (W1, b1) and an output layer (W2, b2) are given above the editor. Compute h, the ReLU of the hidden layer's sums, then out, the output layer's sums of h with no activation.",
    starterCode: [
      "# h: the hidden layer, the ReLU of X @ W1 + b1.",
      "# out: the output layer, h @ W2 + b2, with no activation.",
      "",
    ].join("\n"),
    prelude: NETWORK_PRELUDE,
    hint: "h = np.maximum(0, X @ W1 + b1). The output layer reads h, not X: out = h @ W2 + b2.",
    runs: [
      { prelude: NETWORK_PRELUDE, reference: NETWORK_PRELUDE },
      { prelude: NETWORK_HIDDEN, reference: NETWORK_HIDDEN },
    ],
    checks: [
      { kind: "result", name: "h", expression: "np.maximum(0, X @ W1 + b1)", tolerance: 1e-6 },
      { kind: "result", name: "out", expression: "np.maximum(0, X @ W1 + b1) @ W2 + b2", tolerance: 1e-6 },
      { kind: "unchanged", name: "X", expression: "X" },
    ],
    solution: "h = np.maximum(0, X @ W1 + b1)\nout = h @ W2 + b2",
  },
];
