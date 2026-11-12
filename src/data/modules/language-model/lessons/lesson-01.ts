import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "A language model reads the tokens so far and gives a probability to every word that could come next. Its training data is pairs of a current token and the token after it.",
  estimatedMinutes: 13,
  sections: [
    {
      title: "What a language model predicts",
      blocks: [
        {
          kind: "note",
          text: "A language model is a model that takes a sequence of tokens and gives, for every token of the vocabulary, the probability that it comes next.",
        },
        {
          kind: "text",
          text: "This task is called next-token prediction. After `the cat sat on the`, a good model gives a high probability to `mat` and a low one to `sat`.",
        },
        {
          kind: "note",
          text: "A probability distribution over the vocabulary is an array with one number per token, each between 0 and 1, that add up to 1.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            'vocab = ["the", "cat", "sat", "on", "mat", "dog", "rug", "."]',
            "p = np.array([0.0, 0.25, 0.0, 0.0, 0.25, 0.25, 0.25, 0.0])",
            "print(p.sum())",
            "print(vocab[int(np.argmax(p))])",
          ].join("\n"),
          output: ["1.0", "cat"].join("\n"),
        },
        {
          kind: "text",
          text: "Here `p` says that after `the`, each of `cat`, `mat`, `dog` and `rug` has probability `0.25`. `np.argmax` returns the index of the largest value; with a tie it returns the first one.",
        },
      ],
    },
    {
      title: "Why predicting the next token is enough",
      blocks: [
        {
          kind: "text",
          text: "If a model can predict one next token, it can write a whole text: pick a token, add it to the sequence, and predict again.",
        },
        {
          kind: "text",
          text: "The training data needs no labels written by people. Every text already holds its own answers: each token is the label for the tokens before it.",
        },
      ],
    },
    {
      title: "From a sentence to (current, next) pairs",
      blocks: [
        {
          kind: "text",
          text: "As in Module 3.1, a sentence becomes token ids by looking each word up in the vocabulary.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            'vocab = ["the", "cat", "sat", "on", "mat", "dog", "rug", "."]',
            'words = "the cat sat on the mat .".split()',
            "ids = np.array([vocab.index(w) for w in words])",
            "print(ids)",
            "print(len(vocab), ids.shape)",
          ].join("\n"),
          output: ["[0 1 2 3 0 4 7]", "8 (7,)"].join("\n"),
        },
        {
          kind: "text",
          text: "Every token except the last is a current token, and the token right after it is its next token. Two slices give both lists at once: `ids[:-1]` drops the last id and `ids[1:]` drops the first.",
        },
        {
          kind: "list",
          items: [
            "`cur = ids[:-1]` holds the current tokens, positions `0` to `n - 2`.",
            "`nxt = ids[1:]` holds the next tokens, positions `1` to `n - 1`.",
            "`cur[i]` and `nxt[i]` are neighbours in the sentence, so a sentence of `n` tokens gives `n - 1` pairs.",
          ],
        },
      ],
    },
    {
      title: "A practical example: the pairs of a sentence",
      blocks: [
        {
          kind: "text",
          text: "The two slices line up position by position. Reading them side by side lists every training pair of the sentence.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            'vocab = ["the", "cat", "sat", "on", "mat", "dog", "rug", "."]',
            "ids = np.array([0, 1, 2, 3, 0, 4, 7])",
            "cur = ids[:-1]",
            "nxt = ids[1:]",
            "print(cur)",
            "print(nxt)",
            "for c, n in zip(cur.tolist(), nxt.tolist()):",
            '    print(vocab[c], "->", vocab[n])',
          ].join("\n"),
          output: [
            "[0 1 2 3 0 4]",
            "[1 2 3 0 4 7]",
            "the -> cat",
            "cat -> sat",
            "sat -> on",
            "on -> the",
            "the -> mat",
            "mat -> .",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "`the` appears twice as a current token, once followed by `cat` and once by `mat`. Counting such pairs is how the next lesson turns text into probabilities.",
        },
      ],
    },
    {
      title: "Try it: which words follow a word",
      blocks: [
        {
          kind: "text",
          text: "The corpus is `the cat sat on the mat . the dog sat on the rug .` as ids. Pick a current word and how many tokens to use; `follows` is `True` where the current token is that word, and `nxt` at those positions shows what came after it.",
        },
        {
          kind: "playground",
          demo: {
            title: "Current and next tokens",
            controls: [
              {
                type: "select",
                name: "word",
                label: "Current word",
                options: [
                  { label: "the (id 0)", value: "0" },
                  { label: "sat (id 2)", value: "2" },
                  { label: "on (id 3)", value: "3" },
                  { label: ". (id 7)", value: "7" },
                ],
              },
              { type: "number", name: "n", label: "Tokens used", min: 2, max: 14, initial: 14 },
            ],
            template: [
              "import numpy as np",
              "ids = np.array([0, 1, 2, 3, 0, 4, 7, 0, 5, 2, 3, 0, 6, 7])[:{{n}}]",
              "cur = ids[:-1]",
              "nxt = ids[1:]",
              "follows = cur == {{word}}",
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
            "A language model gives a probability distribution over the vocabulary for the next token.",
            "A probability distribution has one value per token, each between 0 and 1, summing to 1.",
            "Next-token prediction needs no extra labels: each token is the answer for the tokens before it.",
            "`ids[:-1]` and `ids[1:]` give the current and next tokens; `n` tokens make `n - 1` pairs.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "language-model-01-q1",
      question: "What does a language model output for one position?",
      options: [
        "The id of the current token",
        "A probability for every token of the vocabulary to be the next one",
        "The embedding of the next token",
      ],
      answer: 1,
      explanation: "It gives a probability distribution over the whole vocabulary for the next token.",
    },
    {
      id: "language-model-01-q2",
      question: "`ids = np.array([4, 2, 7, 1])`. What is `ids[1:]`?",
      options: ["[4 2 7]", "[2 7 1]", "[2 7]"],
      answer: 1,
      explanation: "`ids[1:]` drops the first id: these are the next tokens.",
    },
    {
      id: "language-model-01-q3",
      question: "How many (current, next) pairs does a sentence of 10 tokens give?",
      options: ["10", "9", "11"],
      answer: 1,
      explanation: "The last token has no next token, so there are `n - 1` pairs.",
    },
    {
      id: "language-model-01-q4",
      question: "Which array is a valid probability distribution over 4 tokens?",
      options: ["[0.5, 0.5, 0.5, 0.5]", "[0.1, 0.2, 0.3, 0.4]", "[1.0, -0.5, 0.25, 0.25]"],
      answer: 1,
      explanation: "Every value is between 0 and 1 and they add up to 1.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    'vocab = ["the", "cat", "sat", "on", "mat", "dog", "rug", "."]',
    'words = "the dog sat on the rug .".split()',
    "ids = np.array([vocab.index(w) for w in words])",
    "# Make cur and nxt from ids, then print each pair as words.",
    "",
  ].join("\n"),
};
