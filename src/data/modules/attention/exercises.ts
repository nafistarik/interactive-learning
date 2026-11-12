import type { Exercise } from "@/features/validation/types";

/** Visible setup for Exercise 41: four tokens, queries and keys of length 2 (lesson 02). */
const SCORES_PRELUDE = [
  "import numpy as np",
  "Q = np.array([[1.0, 0.0], [0.0, 2.0], [1.0, 1.0], [-1.0, 0.5]])",
  "K = np.array([[0.5, 1.0], [1.0, -1.0], [0.0, 2.0], [1.0, 1.0]])",
].join("\n");

/** Hidden setup for Exercise 41: three tokens and d_k = 4, so a hard-coded np.sqrt(2) fails. */
const SCORES_HIDDEN = [
  "import numpy as np",
  "Q = np.array([[1.0, 0.0, -1.0, 2.0], [0.5, 1.0, 0.0, 0.0], [0.0, -2.0, 1.0, 1.0]])",
  "K = np.array([[1.0, 1.0, 0.0, 0.0], [0.0, 0.5, 2.0, -1.0], [-1.0, 0.0, 1.0, 1.0]])",
].join("\n");

/** Visible setup for Exercise 42: scaled scores of four tokens (lesson 03). */
const SOFTMAX_PRELUDE = [
  "import numpy as np",
  'tokens = ["the", "cat", "sat", "it"]',
  "scores = np.array([[0.0, 2.0, 0.5, 0.0], [0.0, 0.5, 2.5, 0.0], [1.0, 1.0, 1.0, 1.0], [0.0, 3.0, 0.0, 0.5]])",
].join("\n");

/** Hidden setup for Exercise 42: three tokens with other scores. */
const SOFTMAX_HIDDEN = [
  "import numpy as np",
  'tokens = ["a", "b", "c"]',
  "scores = np.array([[2.0, -1.0, 0.0], [0.5, 0.5, 3.0], [-2.0, 1.0, 1.0]])",
].join("\n");

/** Starter of Exercise 42: the total is taken without keepdims, so it lines up with the columns. */
const SOFTMAX_STARTER = [
  "e = np.exp(scores - scores.max(axis=1, keepdims=True))",
  "weights = e / e.sum(axis=1)",
  "print(weights.sum(axis=1))",
  "",
].join("\n");

/** Visible setup for Exercise 43: four tokens, d = 3, d_k = 2 (lesson 04). */
const ATTENTION_PRELUDE = [
  "import numpy as np",
  'tokens = ["we", "drink", "green", "tea"]',
  "X = np.array([[1.0, 0.0, 0.5], [0.0, 1.0, 0.0], [0.5, 0.5, 1.0], [1.0, 0.0, 1.0]])",
  "Wq = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, -1.0]])",
  "Wk = np.array([[0.5, 1.0], [1.0, 0.0], [0.0, 1.0]])",
  "Wv = np.array([[1.0, 2.0], [0.0, 1.0], [-1.0, 0.0]])",
].join("\n");

/** Hidden setup for Exercise 43: three tokens, d = 4, d_k = 3. */
const ATTENTION_HIDDEN = [
  "import numpy as np",
  'tokens = ["a", "b", "c"]',
  "X = np.array([[1.0, 0.0, 0.0, 1.0], [0.0, 2.0, 1.0, 0.0], [1.0, 1.0, -1.0, 0.0]])",
  "Wq = np.array([[1.0, 0.0, 0.5], [0.0, 1.0, 0.0], [0.5, 0.0, 1.0], [0.0, -1.0, 1.0]])",
  "Wk = np.array([[0.0, 1.0, 1.0], [1.0, 0.0, 0.0], [0.0, 0.5, -1.0], [1.0, 1.0, 0.0]])",
  "Wv = np.array([[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0], [1.0, 1.0, 1.0]])",
].join("\n");

/** Reference of Exercise 43, run after either setup: the expected weights and output. */
const ATTENTION_REFERENCE = [
  "ref_scores = (X @ Wq) @ (X @ Wk).T / np.sqrt(Wk.shape[1])",
  "ref_e = np.exp(ref_scores - ref_scores.max(axis=1, keepdims=True))",
  "ref_weights = ref_e / ref_e.sum(axis=1, keepdims=True)",
  "ref_out = ref_weights @ (X @ Wv)",
].join("\n");

/** Row-wise softmax of `scores`, as a check expression. */
const SOFTMAX_EXPRESSION =
  "np.exp(scores - scores.max(axis=1, keepdims=True)) / np.exp(scores - scores.max(axis=1, keepdims=True)).sum(axis=1, keepdims=True)";

/** Exercises of Module 3.2 (R6 brief): scaled scores, a softmax bug hunt, then full self-attention. */
export const ATTENTION_EXERCISES: readonly Exercise[] = [
  {
    id: "ex41",
    lessonId: "02",
    title: "Scaled attention scores",
    objective: "Compute scores, every query against every key, divided by the square root of d_k.",
    problem:
      "Q holds one query per row and K one key per row, given above the editor. Compute scores, the dot product of every query with every key, divided by np.sqrt(d_k), where d_k is the length of a query. Read d_k from the shape, and use no loop.",
    starterCode: "# scores: Q @ K.T divided by the square root of d_k.\n",
    prelude: SCORES_PRELUDE,
    hint: "Q @ K.T gives one row per query and one column per key. d_k is Q.shape[1]; divide by np.sqrt(d_k).",
    runs: [
      { prelude: SCORES_PRELUDE, reference: SCORES_PRELUDE },
      { prelude: SCORES_HIDDEN, reference: SCORES_HIDDEN },
    ],
    checks: [
      { kind: "no-loop" },
      { kind: "result", name: "scores", expression: "Q @ K.T / np.sqrt(Q.shape[1])", tolerance: 1e-6 },
      { kind: "unchanged", name: "Q", expression: "Q" },
      { kind: "unchanged", name: "K", expression: "K" },
    ],
    solution: "d_k = Q.shape[1]\nscores = Q @ K.T / np.sqrt(d_k)",
  },
  {
    id: "ex42",
    lessonId: "03",
    type: "bug-hunt",
    title: "Bug hunt: rows that do not add up to 1",
    objective: "Fix the softmax so that every row of weights adds up to 1.",
    problem:
      "scores holds the scaled scores of four tokens, given above the editor. The code should turn each row into attention weights with a softmax, but the printed row totals are not 1. Find the bug and fix it; keep scores as it is.",
    starterCode: SOFTMAX_STARTER,
    prelude: SOFTMAX_PRELUDE,
    hint: "Compare the two reductions. The maximum keeps a (4, 1) column; what shape does the total have, and which way does it broadcast?",
    chart: {
      kind: "heatmap",
      matrix: "weights",
      rowLabels: ["the", "cat", "sat", "it"],
      colLabels: ["the", "cat", "sat", "it"],
    },
    runs: [
      { prelude: SOFTMAX_PRELUDE, reference: SOFTMAX_PRELUDE },
      { prelude: SOFTMAX_HIDDEN, reference: SOFTMAX_HIDDEN },
    ],
    checks: [
      { kind: "result", name: "weights", expression: SOFTMAX_EXPRESSION, tolerance: 1e-6 },
      {
        kind: "assert",
        expression: "np.allclose(weights.sum(axis=1), 1)",
        message: "Every row of weights should add up to 1. Divide each row by its own total.",
      },
      { kind: "unchanged", name: "scores", expression: "scores" },
    ],
    solution: SOFTMAX_STARTER.replace("e.sum(axis=1)", "e.sum(axis=1, keepdims=True)"),
  },
  {
    id: "ex43",
    lessonId: "04",
    title: "Practical application: self-attention",
    objective: "Compute the attention weights and the output out of self-attention on X.",
    problem:
      "The embeddings X (one token per row) and the weight matrices Wq, Wk and Wv are given above the editor. Compute weights, the row-wise softmax of the scaled scores, and out, the weighted sum of the values. Read d_k from the shapes.",
    starterCode: [
      "# Q, K and V: project X with Wq, Wk and Wv.",
      "# scores: Q @ K.T divided by the square root of d_k.",
      "# weights: the softmax of each row of scores.",
      "# out: the values mixed by the weights.",
      "",
    ].join("\n"),
    prelude: ATTENTION_PRELUDE,
    hint: "Q = X @ Wq, and the same for K and V. scores = Q @ K.T / np.sqrt(K.shape[1]). Subtract the row max, apply np.exp, divide by the row total with keepdims=True. Then out = weights @ V.",
    chart: {
      kind: "heatmap",
      matrix: "weights",
      rowLabels: ["we", "drink", "green", "tea"],
      colLabels: ["we", "drink", "green", "tea"],
    },
    runs: [
      { prelude: ATTENTION_PRELUDE, reference: `${ATTENTION_PRELUDE}\n${ATTENTION_REFERENCE}` },
      { prelude: ATTENTION_HIDDEN, reference: `${ATTENTION_HIDDEN}\n${ATTENTION_REFERENCE}` },
    ],
    checks: [
      { kind: "result", name: "weights", expression: "ref_weights", tolerance: 1e-6 },
      { kind: "result", name: "out", expression: "ref_out", tolerance: 1e-6 },
      { kind: "unchanged", name: "X", expression: "X" },
    ],
    solution: [
      "Q, K, V = X @ Wq, X @ Wk, X @ Wv",
      "scores = Q @ K.T / np.sqrt(K.shape[1])",
      "e = np.exp(scores - scores.max(axis=1, keepdims=True))",
      "weights = e / e.sum(axis=1, keepdims=True)",
      "out = weights @ V",
    ].join("\n"),
  },
];
