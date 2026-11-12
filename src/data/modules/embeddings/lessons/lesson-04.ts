import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "Cosine similarity compares the direction of two embeddings, from -1 to 1. Normalize the rows of a matrix and `Xn @ Xn.T` gives the similarity of every pair of words at once.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What the dot product says about two vectors",
      blocks: [
        {
          kind: "text",
          text: "The dot product `a @ b` is large when two vectors point the same way, 0 when they are perpendicular, and negative when they point in opposite directions.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "a = np.array([1.0, 2.0])",
            "b = np.array([2.0, 4.0])",
            "c = np.array([-2.0, 1.0])",
            "print(a @ b, a @ c, a @ -a)",
          ].join("\n"),
          output: "10.0 0.0 -5.0",
        },
        {
          kind: "text",
          text: "`b` points the same way as `a` but is twice as long, and that length also grows the dot product. To compare only directions, divide by the lengths.",
        },
      ],
    },
    {
      title: "What the norm and cosine similarity are",
      blocks: [
        {
          kind: "note",
          text: "The norm of a vector is its length: the square root of the sum of its squared values. `np.linalg.norm(a)` computes the same as `np.sqrt((a * a).sum())`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "a = np.array([3.0, 4.0])",
            "print(np.sqrt((a * a).sum()))",
            "print(np.linalg.norm(a))",
          ].join("\n"),
          output: ["5.0", "5.0"].join("\n"),
        },
        {
          kind: "note",
          text: "Cosine similarity is `a @ b / (norm(a) * norm(b))`. It is 1 for the same direction, 0 for perpendicular vectors and -1 for opposite directions, whatever the lengths.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "def cosine(u, v):",
            "    return u @ v / (np.linalg.norm(u) * np.linalg.norm(v))",
            "a = np.array([1.0, 2.0])",
            "b = np.array([2.0, 4.0])",
            "c = np.array([-2.0, 1.0])",
            "print(a @ b, round(float(cosine(a, b)), 3))",
            "print(round(float(cosine(a, c)), 3), round(float(cosine(a, -a)), 3))",
          ].join("\n"),
          output: ["10.0 1.0", "0.0 -1.0"].join("\n"),
        },
      ],
    },
    {
      title: "Why similarity matters for embeddings",
      blocks: [
        {
          kind: "text",
          text: "Training places the embeddings of words used in similar ways in similar directions. Cosine similarity turns that into one number per pair, so you can check which words a model treats as related.",
        },
        {
          kind: "text",
          text: "The next module, attention, uses dot products between token vectors to decide which tokens each token should look at.",
        },
      ],
    },
    {
      title: "Every pair at once: normalize rows, then Xn @ Xn.T",
      blocks: [
        {
          kind: "text",
          text: "Put one word vector per row of `X`. `np.sqrt((X * X).sum(axis=1, keepdims=True))` gives each row's norm with shape `(n, 1)`, and dividing broadcasts it so every row of `Xn` has length 1.",
        },
        {
          kind: "text",
          text: "For rows of length 1, the dot product is the cosine similarity. `Xn @ Xn.T` has shape `(n, n)`: entry `[i, j]` is row `i` dotted with row `j`, and the diagonal is 1.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[3.0, 4.0], [1.0, 0.0], [0.0, 2.0]])",
            "norms = np.sqrt((X * X).sum(axis=1, keepdims=True))",
            "print(norms.shape)",
            "Xn = X / norms",
            "print(Xn)",
            "print(Xn @ Xn.T)",
          ].join("\n"),
          output: [
            "(3, 1)",
            "[[0.6 0.8]",
            " [1.  0. ]",
            " [0.  1. ]]",
            "[[1.  0.6 0.8]",
            " [0.6 1.  0. ]",
            " [0.8 0.  1. ]]",
          ].join("\n"),
        },
        {
          kind: "note",
          text: "Without `keepdims=True` the norms have shape `(n,)`, which broadcasting lines up with the columns of `X`, not its rows. `X / norms` then fails, or divides the wrong values when `X` happens to be square.",
        },
      ],
    },
    {
      title: "A practical example: hand-made word vectors",
      blocks: [
        {
          kind: "text",
          text: "These vectors are made by hand, not trained, so the idea is easy to see. Read the three values as how much a word is about animals, about food and about something else.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            'words = ["cat", "dog", "apple", "bread"]',
            "X = np.array([",
            "    [0.9, 0.1, 0.0],",
            "    [0.8, 0.2, 0.1],",
            "    [0.1, 0.9, 0.0],",
            "    [0.0, 0.8, 0.2],",
            "])",
            "Xn = X / np.sqrt((X * X).sum(axis=1, keepdims=True))",
            "sim = Xn @ Xn.T",
            "print(np.round(sim, 3))",
          ].join("\n"),
          output: [
            "[[1.    0.984 0.22  0.107]",
            " [0.984 1.    0.346 0.263]",
            " [0.22  0.346 1.    0.964]",
            " [0.107 0.263 0.964 1.   ]]",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "`cat` and `dog` score 0.984, and `apple` and `bread` score 0.964. Every animal and food pair scores far lower.",
        },
      ],
    },
    {
      title: "Try it: a similarity heatmap",
      blocks: [
        {
          kind: "text",
          text: "Compare cosine similarity with raw dot products, and make the `dog` vector longer or point it elsewhere. Watch which cells of the heatmap change.",
        },
        {
          kind: "playground",
          demo: {
            title: "Similarity matrix",
            controls: [
              {
                type: "select",
                name: "dog",
                label: "dog vector",
                options: [
                  { label: "[0.8, 0.2, 0.1] (an animal)", value: "[0.8, 0.2, 0.1]" },
                  { label: "[1.6, 0.4, 0.2] (same direction, twice as long)", value: "[1.6, 0.4, 0.2]" },
                  { label: "[0.1, 0.8, 0.1] (like a food)", value: "[0.1, 0.8, 0.1]" },
                ],
              },
              {
                type: "select",
                name: "rows",
                label: "Rows",
                options: [
                  { label: "Normalized: cosine similarity", value: "X / norms" },
                  { label: "Raw: dot products", value: "X" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "# rows: cat, dog, apple, bread, car",
              "X = np.array([[0.9, 0.1, 0.0], {{dog}}, [0.1, 0.9, 0.0], [0.0, 0.8, 0.2], [0.1, 0.0, 0.9]])",
              "norms = np.sqrt((X * X).sum(axis=1, keepdims=True))",
              "Xn = {{rows}}",
              "sim = Xn @ Xn.T",
            ].join("\n"),
            chart: {
              kind: "heatmap",
              matrix: "sim",
              rowLabels: ["cat", "dog", "apple", "bread", "car"],
              colLabels: ["cat", "dog", "apple", "bread", "car"],
            },
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
            "The dot product grows with both direction and length.",
            "The norm is a vector's length, `np.sqrt((a * a).sum())`.",
            "Cosine similarity `a @ b / (norm(a) * norm(b))` compares direction only, from -1 to 1.",
            "Divide each row by `np.sqrt((X * X).sum(axis=1, keepdims=True))`, then `Xn @ Xn.T` holds every pair's cosine similarity.",
            "Related words have embeddings that point in similar directions.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "embeddings-04-q1",
      question: "What is the cosine similarity of `[1, 0]` and `[5, 0]`?",
      options: ["5", "1", "0", "0.2"],
      answer: 1,
      explanation: "Both point the same way; cosine similarity ignores length.",
    },
    {
      id: "embeddings-04-q2",
      question: "`X` has shape `(6, 4)`. What is the shape of `Xn @ Xn.T`?",
      options: ["`(4, 4)`", "`(6, 4)`", "`(6, 6)`", "`(6,)`"],
      answer: 2,
      explanation: "One row and one column per word: every pair of the 6 words.",
    },
    {
      id: "embeddings-04-q3",
      question: "Why does the diagonal of `Xn @ Xn.T` hold 1s?",
      options: [
        "Each normalized row dotted with itself is its squared length, 1",
        "`@` sets the diagonal to 1",
        "The words are all the same",
      ],
      answer: 0,
      explanation: "After dividing by the norm, every row has length 1.",
    },
    {
      id: "embeddings-04-q4",
      question: "Why use `keepdims=True` when computing the row norms?",
      options: [
        "It makes the sum faster",
        "The norms get shape `(n, 1)`, so dividing scales each row",
        "It rounds the norms",
      ],
      answer: 1,
      explanation: "A `(n, 1)` column broadcasts across each row of `X`.",
    },
  ],
};
