import type { Exercise } from "@/features/validation/types";

/** The vocabulary of the module's corpus, also the heatmap labels of Exercise 47. */
const VOCAB = ["the", "cat", "sat", "on", "mat", "dog", "rug", "."];

/** Visible setup for Exercise 47: `the cat sat on the mat . the dog sat on the rug .` as ids. */
const BIGRAM_PRELUDE = [
  "import numpy as np",
  'vocab = ["the", "cat", "sat", "on", "mat", "dog", "rug", "."]',
  "ids = np.array([0, 1, 2, 3, 0, 4, 7, 0, 5, 2, 3, 0, 6, 7])",
  "V = len(vocab)",
].join("\n");

/** Hidden setup for Exercise 47: `the dog sat on the mat . the cat sat .`, where `rug` never starts a pair. */
const BIGRAM_HIDDEN = [
  "import numpy as np",
  'vocab = ["the", "cat", "sat", "on", "mat", "dog", "rug", "."]',
  "ids = np.array([0, 5, 2, 3, 0, 4, 7, 0, 1, 2, 7])",
  "V = len(vocab)",
].join("\n");

/** A correct bigram matrix with add-one smoothing (Exercise 47). */
const BIGRAM_SOLUTION = [
  "counts = np.zeros((V, V))",
  "np.add.at(counts, (ids[:-1], ids[1:]), 1)",
  "smoothed = counts + 1",
  "P = smoothed / smoothed.sum(axis=1, keepdims=True)",
].join("\n");

/** Visible setup for Exercise 48: the smoothed bigram matrix of the corpus, start `dog`. */
const GREEDY_PRELUDE = [
  "import numpy as np",
  'vocab = ["the", "cat", "sat", "on", "mat", "dog", "rug", "."]',
  "ids = np.array([0, 1, 2, 3, 0, 4, 7, 0, 5, 2, 3, 0, 6, 7])",
  "V = len(vocab)",
  "counts = np.zeros((V, V))",
  "np.add.at(counts, (ids[:-1], ids[1:]), 1)",
  "P = (counts + 1) / (counts + 1).sum(axis=1, keepdims=True)",
  "start = 5",
  "length = 7",
].join("\n");

/** Hidden setup for Exercise 48: another vocabulary size, random probabilities, start and length. */
const GREEDY_HIDDEN = [
  "import numpy as np",
  'vocab = ["a", "b", "c", "d", "e", "f"]',
  "V = len(vocab)",
  "P = np.random.default_rng(7).random((V, V))",
  "P = P / P.sum(axis=1, keepdims=True)",
  "start = 2",
  "length = 10",
].join("\n");

/** A correct greedy generation loop (Exercise 48). */
const GREEDY_SOLUTION = [
  "current = start",
  "generated = [current]",
  "for step in range(length - 1):",
  "    current = int(np.argmax(P[current]))",
  "    generated.append(current)",
].join("\n");

/** Starter code of Exercise 48: the list holds only the start id. */
const GREEDY_STARTER = [
  "current = start",
  "generated = [current]",
  "# Repeat length - 1 times: pick the most probable next id after current,",
  "# append it to generated, and continue from it.",
].join("\n");

/** Visible setup for Exercise 49: attention scores for the four tokens `the cat sat on`. */
const CAUSAL_PRELUDE = [
  "import numpy as np",
  "scores = np.array([",
  "    [2.0, 1.0, 0.5, 3.0],",
  "    [1.0, 2.0, 0.0, 1.5],",
  "    [0.5, 1.0, 1.0, 2.0],",
  "    [1.0, 0.0, 2.0, 1.0],",
  "])",
].join("\n");

/** Hidden setup for Exercise 49: a (5, 5) matrix of other scores. */
const CAUSAL_HIDDEN = ["import numpy as np", "scores = np.round(np.random.default_rng(4).normal(size=(5, 5)), 2)"].join("\n");

/** Correct causal attention weights (Exercise 49). */
const CAUSAL_SOLUTION = [
  "n = scores.shape[0]",
  "mask = np.triu(np.ones((n, n)), k=1)",
  "masked = np.where(mask == 1, -np.inf, scores)",
  "e = np.exp(masked - masked.max(axis=1, keepdims=True))",
  "weights = e / e.sum(axis=1, keepdims=True)",
].join("\n");

/** Exercises of Module 3.4 (R6 brief): three builds. */
export const LANGUAGE_MODEL_EXERCISES: readonly Exercise[] = [
  {
    id: "ex47",
    lessonId: "02",
    title: "A bigram probability matrix",
    objective: "Count the (current, next) pairs of ids and turn them into a bigram probability matrix P with add-one smoothing.",
    problem:
      "vocab, ids and V are given above the editor. Build P with shape (V, V): P[i, j] is the probability that token j follows token i. Count every pair, add 1 to every count, then divide each row by its sum so every row adds up to 1.",
    starterCode: [
      "counts = np.zeros((V, V))",
      "# 1. Count every (current, next) pair of ids into counts.",
      "# 2. Add 1 to every count, then divide each row by its sum.",
      "P = counts",
    ].join("\n"),
    prelude: BIGRAM_PRELUDE,
    hint: "np.add.at(counts, (ids[:-1], ids[1:]), 1) counts the pairs. Then smoothed = counts + 1 and P = smoothed / smoothed.sum(axis=1, keepdims=True).",
    chart: { kind: "heatmap", matrix: "P", rowLabels: VOCAB, colLabels: VOCAB },
    runs: [
      { prelude: BIGRAM_PRELUDE, reference: `${BIGRAM_PRELUDE}\n${BIGRAM_SOLUTION}` },
      { prelude: BIGRAM_HIDDEN, reference: `${BIGRAM_HIDDEN}\n${BIGRAM_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "P", expression: "P", tolerance: 1e-6 },
      {
        kind: "assert",
        expression: "np.allclose(P.sum(axis=1), 1)",
        message: "Every row of P should sum to 1. Divide each row by its own sum, with keepdims=True.",
      },
      { kind: "unchanged", name: "ids", expression: "ids" },
    ],
    solution: BIGRAM_SOLUTION,
  },
  {
    id: "ex48",
    lessonId: "03",
    title: "Greedy text generation",
    objective: "Generate a sequence of token ids from the bigram matrix P by always choosing the most probable next token.",
    problem:
      "P, start and length are given above the editor. Make generated a list of length ids: the start id, followed by length - 1 ids, each the most probable next token after the one before it. Keep P as it is.",
    starterCode: GREEDY_STARTER,
    prelude: GREEDY_PRELUDE,
    hint: "Loop for step in range(length - 1). Inside, current = int(np.argmax(P[current])), then generated.append(current).",
    runs: [
      { prelude: GREEDY_PRELUDE, reference: `${GREEDY_PRELUDE}\n${GREEDY_SOLUTION}` },
      { prelude: GREEDY_HIDDEN, reference: `${GREEDY_HIDDEN}\n${GREEDY_SOLUTION}` },
    ],
    checks: [
      {
        kind: "assert",
        expression: "len(generated) == length",
        message: "generated should hold length ids: the start id and length - 1 generated ids.",
      },
      {
        kind: "assert",
        expression: "int(generated[0]) == start",
        message: "generated should begin with the start id.",
      },
      { kind: "result", name: "generated", expression: "generated" },
      { kind: "unchanged", name: "P", expression: "P" },
    ],
    solution: GREEDY_SOLUTION,
  },
  {
    id: "ex49",
    lessonId: "04",
    title: "Causal attention weights",
    objective: "Mask the future in the attention scores and take the row softmax, so weights is lower-triangular.",
    problem:
      "scores is given above the editor, one row per token. Compute weights: set every score above the diagonal to -np.inf, then take the softmax of each row. Keep scores as it is; build the masked scores in a new array.",
    starterCode: [
      "n = scores.shape[0]",
      "# 1. Build the causal mask and set the future scores to -np.inf.",
      "# 2. Take the softmax of each row.",
      "weights = scores",
    ].join("\n"),
    prelude: CAUSAL_PRELUDE,
    hint: "mask = np.triu(np.ones((n, n)), k=1) and masked = np.where(mask == 1, -np.inf, scores). Then e = np.exp(masked - masked.max(axis=1, keepdims=True)) and weights = e / e.sum(axis=1, keepdims=True).",
    chart: { kind: "heatmap", matrix: "weights", rowLabels: ["the", "cat", "sat", "on"], colLabels: ["the", "cat", "sat", "on"] },
    runs: [
      { prelude: CAUSAL_PRELUDE, reference: `${CAUSAL_PRELUDE}\n${CAUSAL_SOLUTION}` },
      { prelude: CAUSAL_HIDDEN, reference: `${CAUSAL_HIDDEN}\n${CAUSAL_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "weights", expression: "weights", tolerance: 1e-6 },
      {
        kind: "assert",
        expression: "np.allclose(np.triu(weights, k=1), 0)",
        message: "Every weight above the diagonal should be 0: a token must not attend to the tokens after it.",
      },
      {
        kind: "assert",
        expression: "np.allclose(weights.sum(axis=1), 1)",
        message: "Every row of weights should sum to 1. Divide each row by its own sum, with keepdims=True.",
      },
      { kind: "unchanged", name: "scores", expression: "scores" },
    ],
    solution: CAUSAL_SOLUTION,
  },
];
