import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "A one-hot vector marks a token id with a single 1 among zeros. `np.eye(V)[ids]` builds one per token, but the vectors are long and say nothing about meaning.",
  estimatedMinutes: 12,
  sections: [
    {
      title: "What a one-hot vector is",
      blocks: [
        {
          kind: "note",
          text: "A one-hot vector for token id `i` has length `V`, the vocabulary size. Every value is 0 except the one at position `i`, which is 1.",
        },
        {
          kind: "code",
          code: ["import numpy as np", "V = 5", "one_hot = np.zeros(V)", "one_hot[3] = 1.0", "print(one_hot)"].join("\n"),
          output: "[0. 0. 0. 1. 0.]",
        },
        {
          kind: "text",
          text: "This is the one-hot vector of id 3 in a 5-word vocabulary. It turns an id into an array a model can multiply.",
        },
      ],
    },
    {
      title: "All tokens at once with np.eye(V)[ids]",
      blocks: [
        {
          kind: "text",
          text: "`np.eye(V)` is the identity matrix: a `(V, V)` array with 1 on the diagonal and 0 elsewhere. Its row `i` is exactly the one-hot vector of id `i`.",
        },
        {
          kind: "code",
          code: ["import numpy as np", "print(np.eye(3))"].join("\n"),
          output: ["[[1. 0. 0.]", " [0. 1. 0.]", " [0. 0. 1.]]"].join("\n"),
        },
        {
          kind: "text",
          text: "Indexing an array with an array of ids picks those rows, in that order, repeats included. So `np.eye(V)[ids]` gives one one-hot row per token.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "ids = np.array([4, 0, 3, 2, 4, 1])",
            "one_hot = np.eye(5)[ids]",
            "print(one_hot)",
            "print(one_hot.shape)",
          ].join("\n"),
          output: [
            "[[0. 0. 0. 0. 1.]",
            " [1. 0. 0. 0. 0.]",
            " [0. 0. 0. 1. 0.]",
            " [0. 0. 1. 0. 0.]",
            " [0. 0. 0. 0. 1.]",
            " [0. 1. 0. 0. 0.]]",
            "(6, 5)",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "These are the ids of `the cat sat on the mat` from lesson 01. The shape is `(tokens, V)`: rows 0 and 4 are equal because both tokens are `the`.",
        },
      ],
    },
    {
      title: "Why one-hot is not enough",
      blocks: [
        {
          kind: "text",
          text: "One-hot vectors are wasteful. Each one holds `V` numbers and only one of them is not zero, so a vocabulary of 50000 words would need 50000 numbers per token.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "ids = np.array([4, 0, 3, 2, 4, 1])",
            "one_hot = np.eye(5)[ids]",
            "print(one_hot.size, int(one_hot.sum()))",
          ].join("\n"),
          output: "30 6",
        },
        {
          kind: "text",
          text: "They also say nothing about meaning. The dot product of two different one-hot vectors is always 0, so `cat` is exactly as unrelated to `mat` as to any other word.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "I = np.eye(5)",
            "cat, mat, the = I[0], I[1], I[4]",
            "print(cat @ mat, cat @ the, cat @ cat)",
          ].join("\n"),
          output: "0.0 0.0 1.0",
        },
      ],
    },
    {
      title: "A practical example: counting words",
      blocks: [
        {
          kind: "text",
          text: "One-hot rows are still useful for counting. Summing them down the rows, `axis=0`, gives how often each vocabulary word appears.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "ids = np.array([4, 0, 3, 2, 4, 1])",
            "one_hot = np.eye(5)[ids]",
            "counts = one_hot.sum(axis=0)",
            "print(counts)",
          ].join("\n"),
          output: "[1. 1. 1. 1. 2.]",
        },
        {
          kind: "text",
          text: "With the vocabulary `cat, mat, on, sat, the`, the last count says `the` appears twice. This count vector is called a bag of words: it keeps how often words appear and loses their order.",
        },
      ],
    },
    {
      title: "Try it: one-hot rows of a sentence",
      blocks: [
        {
          kind: "text",
          text: "Change the vocabulary size and watch every row get longer while it still holds a single 1. Pick the dot products to see that only a word compared with itself scores above 0.",
        },
        {
          kind: "playground",
          demo: {
            title: "One-hot vectors",
            controls: [
              { type: "number", name: "V", label: "Vocabulary size V", min: 5, max: 8, initial: 5 },
              {
                type: "select",
                name: "result",
                label: "Compute",
                options: [
                  { label: "Word counts: one_hot.sum(axis=0)", value: "one_hot.sum(axis=0)" },
                  { label: "Dot products: one_hot @ one_hot.T", value: "one_hot @ one_hot.T" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "# the cat sat on the mat",
              "ids = np.array([4, 0, 3, 2, 4, 1])",
              "one_hot = np.eye({{V}})[ids]",
              "result = {{result}}",
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
            "A one-hot vector has length `V`: a 1 at the token id and 0 everywhere else.",
            "`np.eye(V)[ids]` gives one one-hot row per token, shape `(tokens, V)`.",
            "Each vector stores `V` numbers to carry one id, which is wasteful for a large vocabulary.",
            "Different one-hot vectors always have dot product 0, so they say nothing about which words are related.",
            "`one_hot.sum(axis=0)` counts each word, a bag of words.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "embeddings-02-q1",
      question: "What is the one-hot vector of id 2 when `V = 4`?",
      options: ["`[0, 0, 1, 0]`", "`[0, 1, 0, 0]`", "`[2, 2, 2, 2]`", "`[0, 0, 2, 0]`"],
      answer: 0,
      explanation: "Positions start at 0, so the 1 sits at index 2.",
    },
    {
      id: "embeddings-02-q2",
      question: "`ids` has shape `(7,)` and `V = 10`. What is the shape of `np.eye(V)[ids]`?",
      options: ["`(10, 7)`", "`(7,)`", "`(7, 10)`", "`(10, 10)`"],
      answer: 2,
      explanation: "One row per token, each of length `V`.",
    },
    {
      id: "embeddings-02-q3",
      question: "Why do one-hot vectors say nothing about meaning?",
      options: [
        "Their values are random",
        "Any two different words have dot product 0, so all pairs look equally unrelated",
        "They cannot be multiplied with `@`",
      ],
      answer: 1,
      explanation: "The 1s never overlap for different words, whether the words are related or not.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    'vocab = {"a": 0, "bird": 1, "cat": 2, "dog": 3, "saw": 4}',
    'ids = np.array([vocab[word] for word in "a dog saw a cat".split()])',
    "one_hot = np.eye(len(vocab))[ids]",
    "print(one_hot)",
    "print(one_hot.sum(axis=0))",
    "",
    "# Try: which word has count 0? Compute one_hot @ one_hot.T and find the 1s off the diagonal.",
  ].join("\n"),
};
