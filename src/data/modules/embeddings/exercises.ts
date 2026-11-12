import type { Exercise } from "@/features/validation/types";

/** Visible setup for Exercise 38: a 5-word vocabulary and a sentence that repeats no word (lesson 01). */
const IDS_PRELUDE = [
  "import numpy as np",
  'vocab = {"a": 0, "cat": 1, "dog": 2, "saw": 3, "the": 4}',
  'sentence = "the cat saw a dog"',
].join("\n");

/** Hidden setup for Exercise 38: another vocabulary and a sentence with repeated words. */
const IDS_HIDDEN = [
  "import numpy as np",
  'vocab = {"birds": 0, "fly": 1, "high": 2, "small": 3}',
  'sentence = "small birds fly high birds fly"',
].join("\n");

/** Visible setup for Exercise 39: a (5, 3) embedding table and four token ids (lesson 03). */
const LOOKUP_PRELUDE = [
  "import numpy as np",
  "V = 5",
  "E = np.array([[0.1, 0.2, 0.0], [0.5, -0.3, 0.2], [0.0, 0.4, -0.1], [-0.2, 0.1, 0.3], [0.3, 0.3, 0.3]])",
  "ids = np.array([4, 0, 3, 4])",
].join("\n");

/** Hidden setup for Exercise 39: a (4, 2) table and other ids, so a hard-coded answer fails. */
const LOOKUP_HIDDEN = [
  "import numpy as np",
  "V = 4",
  "E = np.array([[1.0, -1.0], [0.5, 2.0], [-0.5, 0.0], [3.0, 0.25]])",
  "ids = np.array([2, 2, 1, 3, 0])",
].join("\n");

/** Visible setup for Exercise 40: hand-made 3-value vectors of five words (lesson 04). */
const SIM_PRELUDE = [
  "import numpy as np",
  "# rows: king, queen, man, apple, pear",
  "X = np.array([",
  "    [0.9, 0.8, 0.1],",
  "    [0.9, 0.7, 0.0],",
  "    [0.2, 0.9, 0.1],",
  "    [0.0, 0.1, 0.9],",
  "    [0.1, 0.0, 0.8],",
  "])",
].join("\n");

/** Hidden setup for Exercise 40: four words with 2 values each. */
const SIM_HIDDEN = [
  "import numpy as np",
  "X = np.array([[1.0, 0.0], [3.0, 4.0], [-2.0, 1.0], [0.5, -0.5]])",
].join("\n");

/** Reference line for Exercise 40: the rows of X scaled to length 1. */
const NORMALIZE = "Xn = X / np.sqrt((X * X).sum(axis=1, keepdims=True))";

/** Exercises of Module 3.1 (R6 brief): three builds, from token ids to a similarity matrix. */
export const EMBEDDINGS_EXERCISES: readonly Exercise[] = [
  {
    id: "ex38",
    lessonId: "01",
    title: "From a sentence to token ids",
    objective: "Turn sentence into a NumPy array ids that holds the vocabulary id of every token, in order.",
    problem:
      "A vocabulary vocab (a dict from word to id) and a sentence are given above the editor. Split the sentence into word tokens and store their ids, in sentence order, as a 1D NumPy array named ids.",
    starterCode: "# Split sentence into tokens, look up each one in vocab,\n# and store the ids as a NumPy array in ids.\n",
    prelude: IDS_PRELUDE,
    hint: "sentence.split() gives the tokens. vocab[word] gives one id, and np.array([vocab[word] for word in tokens]) gives them all.",
    runs: [
      { prelude: IDS_PRELUDE, reference: IDS_PRELUDE },
      { prelude: IDS_HIDDEN, reference: IDS_HIDDEN },
    ],
    checks: [
      { kind: "result", name: "ids", expression: "np.array([vocab[word] for word in sentence.split()])" },
      {
        kind: "assert",
        expression: "isinstance(ids, np.ndarray)",
        message: "ids should be a NumPy array: wrap the list of ids in np.array(...).",
      },
      { kind: "unchanged", name: "sentence", expression: "sentence" },
    ],
    solution: "ids = np.array([vocab[word] for word in sentence.split()])",
  },
  {
    id: "ex39",
    lessonId: "03",
    title: "Embedding lookup, two ways",
    objective: "Look up the embeddings of ids with E[ids], and compute the same rows as one-hot vectors times E.",
    problem:
      "An embedding table E of shape (V, d) and token ids are given above the editor. Store the embeddings of the tokens in vectors using indexing. Then build the one-hot rows of ids and store their product with E in via_one_hot.",
    starterCode: "# vectors: one row of E per token id.\n# via_one_hot: the one-hot rows of ids times E.\n",
    prelude: LOOKUP_PRELUDE,
    hint: "vectors = E[ids]. np.eye(V)[ids] gives one one-hot row per token; multiply it by E with @.",
    runs: [
      { prelude: LOOKUP_PRELUDE, reference: LOOKUP_PRELUDE },
      { prelude: LOOKUP_HIDDEN, reference: LOOKUP_HIDDEN },
    ],
    checks: [
      { kind: "result", name: "vectors", expression: "E[ids]" },
      { kind: "result", name: "via_one_hot", expression: "np.eye(V)[ids] @ E", tolerance: 1e-6 },
      { kind: "unchanged", name: "E", expression: "E" },
    ],
    solution: "vectors = E[ids]\nvia_one_hot = np.eye(V)[ids] @ E",
  },
  {
    id: "ex40",
    lessonId: "04",
    title: "Practical application: a similarity matrix",
    objective: "Compute sim, the cosine similarity of every pair of rows of X, without a loop.",
    problem:
      "X holds one word vector per row. Scale every row to length 1, then compute sim, the matrix whose entry [i, j] is the cosine similarity of rows i and j. Use NumPy operations on the whole array, without a loop.",
    starterCode: "# Normalize the rows of X, then compute sim.\n",
    prelude: SIM_PRELUDE,
    hint: "np.sqrt((X * X).sum(axis=1, keepdims=True)) gives each row's norm as a column. Divide X by it, then multiply the result by its own transpose with @.",
    chart: {
      kind: "heatmap",
      matrix: "sim",
      rowLabels: ["king", "queen", "man", "apple", "pear"],
      colLabels: ["king", "queen", "man", "apple", "pear"],
    },
    runs: [
      { prelude: SIM_PRELUDE, reference: `${SIM_PRELUDE}\n${NORMALIZE}` },
      { prelude: SIM_HIDDEN, reference: `${SIM_HIDDEN}\n${NORMALIZE}` },
    ],
    checks: [
      { kind: "no-loop" },
      { kind: "result", name: "sim", expression: "Xn @ Xn.T", tolerance: 1e-6 },
      { kind: "unchanged", name: "X", expression: "X" },
    ],
    solution: "Xn = X / np.sqrt((X * X).sum(axis=1, keepdims=True))\nsim = Xn @ Xn.T",
  },
];
