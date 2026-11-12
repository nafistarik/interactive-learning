import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "An embedding table `E` stores one short vector per token id, and `E[ids]` looks them up. The lookup equals `one_hot @ E`, which is why `E` can be trained like any weight matrix.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What an embedding and an embedding table are",
      blocks: [
        {
          kind: "note",
          text: "An embedding is a short vector of `d` numbers that stands for one token. The embedding table `E` has shape `(V, d)`: row `i` is the embedding of token id `i`.",
        },
        {
          kind: "text",
          text: "`d` is the embedding size, and you choose it. It is usually far smaller than `V`, so each token is described by a few numbers instead of a long one-hot vector.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "E = np.array([[0.1, 0.2], [0.5, -0.3], [0.0, 0.4], [-0.2, 0.1], [0.3, 0.3]])",
            "print(E.shape)",
            "print(E[3])",
          ].join("\n"),
          output: ["(5, 2)", "[-0.2  0.1]"].join("\n"),
        },
        {
          kind: "text",
          text: "This table has 5 tokens and `d = 2`. `E[3]` is the embedding of token id 3.",
        },
      ],
    },
    {
      title: "Looking up a whole sentence with E[ids]",
      blocks: [
        {
          kind: "text",
          text: "Indexing with the id array picks one row of `E` per token, as `np.eye(V)[ids]` did in lesson 02. The result has shape `(tokens, d)`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "E = np.array([[0.1, 0.2], [0.5, -0.3], [0.0, 0.4], [-0.2, 0.1], [0.3, 0.3]])",
            "ids = np.array([4, 0, 3, 2, 4, 1])",
            "vectors = E[ids]",
            "print(vectors)",
            "print(vectors.shape)",
          ].join("\n"),
          output: [
            "[[ 0.3  0.3]",
            " [ 0.1  0.2]",
            " [-0.2  0.1]",
            " [ 0.   0.4]",
            " [ 0.3  0.3]",
            " [ 0.5 -0.3]]",
            "(6, 2)",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "The two `the` tokens, ids 4, get the same row. This `(tokens, d)` matrix is what the next modules feed into attention.",
        },
      ],
    },
    {
      title: "Lookup is a matrix product with one-hot rows",
      blocks: [
        {
          kind: "text",
          text: "A one-hot row times `E` multiplies every row of `E` by 0 except one, which it multiplies by 1. So `one_hot @ E` picks the same rows as `E[ids]`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "E = np.array([[0.1, 0.2], [0.5, -0.3], [0.0, 0.4], [-0.2, 0.1], [0.3, 0.3]])",
            "ids = np.array([4, 0, 3])",
            "one_hot = np.eye(5)[ids]",
            "print(one_hot @ E)",
            "print(E[ids])",
            "print(np.allclose(one_hot @ E, E[ids]))",
          ].join("\n"),
          output: [
            "[[ 0.3  0.3]",
            " [ 0.1  0.2]",
            " [-0.2  0.1]]",
            "[[ 0.3  0.3]",
            " [ 0.1  0.2]",
            " [-0.2  0.1]]",
            "True",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "Shapes follow the rule from Module 0.2: `(tokens, V) @ (V, d)` gives `(tokens, d)`. Models use `E[ids]` because it skips all the multiplications by 0.",
        },
      ],
    },
    {
      title: "Why embeddings are learned parameters",
      blocks: [
        {
          kind: "text",
          text: "Because `one_hot @ E` is a linear layer with weights `E` and no bias, `E` is trained like the weight matrices in Phase 2. It starts with small random values and gradient descent changes them to lower the loss.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "rng = np.random.default_rng(0)",
            "V, d = 5, 3",
            "E = rng.normal(0, 0.1, size=(V, d))",
            "print(E.shape, E.size)",
          ].join("\n"),
          output: "(5, 3) 15",
        },
        {
          kind: "text",
          text: "The table has `V * d` parameters. A gradient reaches only the rows of tokens that were looked up, and tokens used in similar ways tend to end up with similar rows.",
        },
      ],
    },
    {
      title: "Try it: lookup as a matrix product",
      blocks: [
        {
          kind: "text",
          text: "Pick a sentence and an embedding size, and read each output value as a one-hot row times a column of `E`. Choose the one-hot width 6 to see the shapes fail to match.",
        },
        {
          kind: "playground",
          demo: {
            title: "Embedding lookup",
            controls: [
              {
                type: "select",
                name: "ids",
                label: "Sentence (ids)",
                options: [
                  { label: "the cat sat on the mat", value: "[4, 0, 3, 2, 4, 1]" },
                  { label: "the mat sat on the cat", value: "[4, 1, 3, 2, 4, 0]" },
                  { label: "the cat", value: "[4, 0]" },
                ],
              },
              { type: "number", name: "d", label: "Embedding size d", min: 2, max: 4, initial: 2 },
              {
                type: "select",
                name: "width",
                label: "One-hot width",
                options: [
                  { label: "5 (matches V)", value: "5" },
                  { label: "6 (one too many)", value: "6" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "V = 5",
              "E = np.arange(V * {{d}}).reshape(V, {{d}}) / 10",
              "ids = np.array({{ids}})",
              "one_hot = np.eye({{width}})[ids]",
              "vectors = one_hot @ E",
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
            "An embedding is a vector of `d` numbers for one token; the table `E` has shape `(V, d)`.",
            "`E[ids]` looks up one row per token and gives shape `(tokens, d)`.",
            "`np.eye(V)[ids] @ E` gives the same result; `E[ids]` is the fast way.",
            "`E` is a weight matrix: it starts random and is learned by gradient descent.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "embeddings-03-q1",
      question: "`E` has shape `(1000, 16)` and `ids` has shape `(12,)`. What is the shape of `E[ids]`?",
      options: ["`(12, 1000)`", "`(12, 16)`", "`(16, 12)`", "`(1000, 16)`"],
      answer: 1,
      explanation: "One row of length `d = 16` for each of the 12 tokens.",
    },
    {
      id: "embeddings-03-q2",
      question: "Why does `np.eye(V)[ids] @ E` equal `E[ids]`?",
      options: [
        "Each one-hot row has a single 1, so the product picks one row of `E`",
        "`@` sorts the rows of `E`",
        "It only works when `V` equals `d`",
      ],
      answer: 0,
      explanation: "All other rows of `E` are multiplied by 0.",
    },
    {
      id: "embeddings-03-q3",
      question: "Where do the numbers in an embedding table come from in a real model?",
      options: [
        "They are the token ids",
        "They are set by hand for every word",
        "They start random and are learned during training",
      ],
      answer: 2,
      explanation: "`E` is a parameter, updated by gradient descent like any weight matrix.",
    },
  ],
};
