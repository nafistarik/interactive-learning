import type { Exercise } from "@/features/validation/types";

/** Self-attention with Q = K = V = x, as in Module 3.2; given in the preludes of Exercises 44 and 46. */
const SELF_ATTENTION = [
  "def self_attention(x):",
  "    scores = x @ x.T / np.sqrt(x.shape[1])",
  "    e = np.exp(scores - scores.max(axis=-1, keepdims=True))",
  "    weights = e / e.sum(axis=-1, keepdims=True)",
  "    return weights @ x",
].join("\n");

/** Visible setup for Exercise 44: 3 tokens of width 4 and a linear sublayer (lesson 02). */
const RESIDUAL_PRELUDE = [
  "import numpy as np",
  SELF_ATTENTION,
  "x = np.array([[1.0, 0.0, 2.0, -1.0], [0.5, 1.0, -1.0, 0.0], [0.0, -0.5, 1.0, 1.0]])",
  "W = np.array([[0.5, 0.0, 0.0, -0.5], [0.0, 1.0, 0.5, 0.0], [-0.5, 0.0, 1.0, 0.0], [0.0, 0.5, 0.0, 1.0]])",
].join("\n");

/** Hidden setup for Exercise 44: 2 tokens of width 3, so a hard-coded answer fails. */
const RESIDUAL_HIDDEN = [
  "import numpy as np",
  SELF_ATTENTION,
  "x = np.array([[2.0, -1.0, 0.5], [0.0, 1.0, 1.5]])",
  "W = np.array([[1.0, 0.0, -1.0], [0.5, 0.5, 0.0], [0.0, -1.0, 2.0]])",
].join("\n");

const RESIDUAL_SOLUTION = ["h = x + self_attention(x)", "out = h + h @ W"].join("\n");

/** Visible setup for Exercise 45: rows on very different scales, gamma and beta (lesson 03). */
const NORM_PRELUDE = [
  "import numpy as np",
  "x = np.array([[1.0, 2.0, 3.0, 6.0], [10.0, 20.0, 30.0, 60.0], [-1.0, 0.0, 1.0, 0.0]])",
  "gamma = np.array([1.0, 1.0, 2.0, 2.0])",
  "beta = np.array([0.0, 0.0, 0.5, 0.5])",
  "eps = 1e-5",
].join("\n");

/** Hidden setup for Exercise 45: 2 rows of width 3. */
const NORM_HIDDEN = [
  "import numpy as np",
  "x = np.array([[4.0, -2.0, 1.0], [0.5, 0.5, 2.0]])",
  "gamma = np.array([0.5, 1.5, 1.0])",
  "beta = np.array([1.0, 0.0, -1.0])",
  "eps = 1e-5",
].join("\n");

const NORM_STARTER = [
  "# Layer normalization: normalize each row of x, then scale by gamma and shift by beta.",
  "mean = x.mean(axis=0, keepdims=True)",
  "var = x.var(axis=0, keepdims=True)",
  "z = (x - mean) / np.sqrt(var + eps)",
  "normed = z * gamma + beta",
].join("\n");

const NORM_SOLUTION = [
  "mean = x.mean(axis=-1, keepdims=True)",
  "var = x.var(axis=-1, keepdims=True)",
  "z = (x - mean) / np.sqrt(var + eps)",
  "normed = z * gamma + beta",
].join("\n");

/** Visible setup for Exercise 46: 3 tokens of width 4, a feed-forward layer of width 6 (lesson 04). */
const BLOCK_PRELUDE = [
  "import numpy as np",
  SELF_ATTENTION,
  "x = np.array([[1.0, 0.0, 1.0, 0.0], [0.0, 2.0, 0.0, 1.0], [1.0, 1.0, -1.0, 0.0]])",
  "W1 = np.linspace(-1, 1, 24).reshape(4, 6)",
  "b1 = np.full(6, 0.1)",
  "W2 = np.linspace(1, -1, 24).reshape(6, 4)",
  "b2 = np.zeros(4)",
  "eps = 1e-5",
].join("\n");

/** Hidden setup for Exercise 46: 4 tokens and a feed-forward layer of width 4. */
const BLOCK_HIDDEN = [
  "import numpy as np",
  SELF_ATTENTION,
  "x = np.array([[0.5, -1.0, 2.0, 0.0], [1.0, 1.0, 0.0, -1.0], [-2.0, 0.5, 1.0, 1.0], [0.0, 0.0, 3.0, 1.0]])",
  "W1 = np.linspace(0.5, -0.5, 16).reshape(4, 4)",
  "b1 = np.zeros(4)",
  "W2 = np.linspace(-1, 1, 16).reshape(4, 4)",
  "b2 = np.full(4, 0.2)",
  "eps = 1e-5",
].join("\n");

const BLOCK_SOLUTION = [
  "def layer_norm(v):",
  "    mean = v.mean(axis=-1, keepdims=True)",
  "    return (v - mean) / np.sqrt(v.var(axis=-1, keepdims=True) + eps)",
  "h = layer_norm(x + self_attention(x))",
  "out = layer_norm(h + np.maximum(0, h @ W1 + b1) @ W2 + b2)",
].join("\n");

/** Exercises of Module 3.3 (R6 brief): a residual build, a layer-norm bug hunt, a full block. */
export const TRANSFORMER_BLOCK_EXERCISES: readonly Exercise[] = [
  {
    id: "ex44",
    lessonId: "02",
    title: "Two residual connections",
    objective: "Wrap self-attention and a linear sublayer in residual connections, storing the results in h and out.",
    problem:
      "x (one token per row), the function self_attention and a weight matrix W are given above the editor. Compute h, x plus the self-attention of x. Then compute out, h plus the linear sublayer h @ W. Do not change x.",
    starterCode: [
      "# h: a residual connection around self_attention.",
      "# out: a residual connection around the sublayer h @ W.",
      "",
    ].join("\n"),
    prelude: RESIDUAL_PRELUDE,
    hint: "A residual connection is input + sublayer(input): h = x + self_attention(x). The second sublayer reads h, so out = h + h @ W. Writing x += ... would change x itself.",
    runs: [
      { prelude: RESIDUAL_PRELUDE, reference: `${RESIDUAL_PRELUDE}\n${RESIDUAL_SOLUTION}` },
      { prelude: RESIDUAL_HIDDEN, reference: `${RESIDUAL_HIDDEN}\n${RESIDUAL_SOLUTION}` },
    ],
    checks: [
      { kind: "no-loop" },
      { kind: "result", name: "h", expression: "h", tolerance: 1e-6 },
      { kind: "result", name: "out", expression: "out", tolerance: 1e-6 },
      { kind: "unchanged", name: "x", expression: "x" },
      {
        kind: "assert",
        expression: "np.shape(out) == np.shape(x)",
        message: "out should have the shape of x: a residual connection keeps the shape.",
      },
    ],
    solution: RESIDUAL_SOLUTION,
  },
  {
    id: "ex45",
    lessonId: "03",
    type: "bug-hunt",
    title: "Layer normalization over the wrong axis",
    objective: "Fix the code so that z normalizes each row of x and normed scales z by gamma and shifts it by beta.",
    problem:
      "x, gamma, beta and eps are given above the editor. The code should apply layer normalization: each row of z should have mean 0 and standard deviation about 1, then normed = z * gamma + beta. It runs without an error, but the rows of z do not average 0. Find and fix the bug.",
    starterCode: NORM_STARTER,
    prelude: NORM_PRELUDE,
    hint: "axis=0 averages each column over all tokens. Layer normalization works within each row: use axis=-1 for both the mean and the variance.",
    runs: [
      { prelude: NORM_PRELUDE, reference: `${NORM_PRELUDE}\n${NORM_SOLUTION}` },
      { prelude: NORM_HIDDEN, reference: `${NORM_HIDDEN}\n${NORM_SOLUTION}` },
    ],
    checks: [
      { kind: "no-loop" },
      { kind: "result", name: "z", expression: "z", tolerance: 1e-6 },
      { kind: "result", name: "normed", expression: "normed", tolerance: 1e-6 },
      { kind: "unchanged", name: "x", expression: "x" },
      {
        kind: "assert",
        expression: "np.allclose(np.mean(z, axis=-1), 0, atol=1e-6)",
        message: "Each row of z should have mean 0: normalize within each row.",
      },
    ],
    solution: NORM_SOLUTION,
  },
  {
    id: "ex46",
    lessonId: "04",
    title: "Practical application: one transformer block",
    objective: "Run a transformer block forward: h after attention, then out after the feed-forward layer.",
    problem:
      "x (embeddings plus positional encoding, one token per row), the function self_attention, the feed-forward weights W1, b1, W2, b2 and eps are given above the editor. Compute h = layer_norm(x + self_attention(x)), then out = layer_norm(h + ffn(h)) with ffn(h) = relu(h @ W1 + b1) @ W2 + b2. Use layer normalization without gamma and beta.",
    starterCode: [
      "# Write a layer normalization (per row, with eps), then:",
      "# h: attention with a residual connection, then layer normalization.",
      "# out: the feed-forward layer with a residual connection, then layer normalization.",
      "",
    ].join("\n"),
    prelude: BLOCK_PRELUDE,
    hint: "Define layer_norm(v) as (v - mean) / np.sqrt(var + eps) with axis=-1 and keepdims=True. ReLU is np.maximum(0, ...). The feed-forward layer reads h, not x.",
    runs: [
      { prelude: BLOCK_PRELUDE, reference: `${BLOCK_PRELUDE}\n${BLOCK_SOLUTION}` },
      { prelude: BLOCK_HIDDEN, reference: `${BLOCK_HIDDEN}\n${BLOCK_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "h", expression: "h", tolerance: 1e-6 },
      { kind: "result", name: "out", expression: "out", tolerance: 1e-6 },
      { kind: "unchanged", name: "x", expression: "x" },
      {
        kind: "assert",
        expression: "np.allclose(np.mean(out, axis=-1), 0, atol=1e-6)",
        message: "Each row of out should have mean 0: the block ends with layer normalization.",
      },
    ],
    chart: { kind: "heatmap", matrix: "out", rowLabels: ["token 0", "token 1", "token 2"] },
    solution: BLOCK_SOLUTION,
  },
];
