import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "A model computes with numbers, not words. Split text into tokens, give every distinct token an id, and a sentence becomes an array of integers.",
  estimatedMinutes: 14,
  sections: [
    {
      title: "What tokens, a vocabulary and token ids are",
      blocks: [
        {
          kind: "text",
          text: "A token is one piece of text that a model treats as a unit. In this module a token is one word, found by splitting the text at spaces with `str.split()`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            'sentence = "the cat sat on the mat"',
            "tokens = sentence.split()",
            "print(tokens)",
            "print(len(tokens))",
          ].join("\n"),
          output: ["['the', 'cat', 'sat', 'on', 'the', 'mat']", "6"].join("\n"),
        },
        {
          kind: "note",
          text: "The vocabulary is the list of every distinct token the model knows. A token id is the position of a token in the vocabulary: a whole number from `0` to `V - 1`, where `V` is the vocabulary size.",
        },
      ],
    },
    {
      title: "Why a model needs token ids",
      blocks: [
        {
          kind: "text",
          text: "Everything you built in Phases 1 and 2 multiplies and adds arrays of numbers. The string `\"cat\"` cannot go through `X @ W`, so the first step of any language model is to turn text into numbers.",
        },
        {
          kind: "text",
          text: "Ids are that first step. Each id later picks one row of a table of learned numbers, which is what the rest of this module builds.",
        },
      ],
    },
    {
      title: "Building a vocabulary with a dict",
      blocks: [
        {
          kind: "text",
          text: "`set(tokens)` keeps each word once, and `sorted(...)` puts the words in a fixed order. A dict then maps each word to its position; `enumerate` gives the position and the word together.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            'tokens = "the cat sat on the mat".split()',
            "words = sorted(set(tokens))",
            "print(words)",
            "vocab = {word: i for i, word in enumerate(words)}",
            "print(vocab)",
            "print(len(vocab))",
          ].join("\n"),
          output: [
            "['cat', 'mat', 'on', 'sat', 'the']",
            "{'cat': 0, 'mat': 1, 'on': 2, 'sat': 3, 'the': 4}",
            "5",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "The sentence has 6 tokens but only 5 distinct words, because `the` appears twice. The order is a choice: sorting just makes the same words always get the same ids.",
        },
      ],
    },
    {
      title: "A practical example: a sentence as an id array",
      blocks: [
        {
          kind: "text",
          text: "Look up each token in `vocab` and wrap the list in `np.array`. The sentence is now a 1D integer array with one id per token.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            'vocab = {"cat": 0, "mat": 1, "on": 2, "sat": 3, "the": 4}',
            'tokens = "the cat sat on the mat".split()',
            "ids = np.array([vocab[word] for word in tokens])",
            "print(ids)",
            "print(ids.shape)",
          ].join("\n"),
          output: ["[4 0 3 2 4 1]", "(6,)"].join("\n"),
        },
        {
          kind: "text",
          text: "Once text is an array, Phase 0 tools work on it. A comparison finds every position of one word, and a sum counts them.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            'vocab = {"cat": 0, "mat": 1, "on": 2, "sat": 3, "the": 4}',
            'ids = np.array([vocab[word] for word in "the mat sat on the cat".split()])',
            "print(ids)",
            'print(int((ids == vocab["the"]).sum()))',
          ].join("\n"),
          output: ["[4 1 3 2 4 0]", "2"].join("\n"),
        },
        {
          kind: "note",
          text: "A word that is not in the vocabulary raises a `KeyError` in `vocab[word]`. Real tokenizers avoid this by splitting rare words into smaller known pieces, but word tokens are enough to learn the idea.",
        },
      ],
    },
    {
      title: "Try it: turn a sentence into ids",
      blocks: [
        {
          kind: "text",
          text: "Pick a sentence and step through the loop to watch each token get its id. Switch the vocabulary order to see that the ids change while the sentence does not.",
        },
        {
          kind: "playground",
          demo: {
            title: "Tokens to ids",
            controls: [
              {
                type: "select",
                name: "sentence",
                label: "Sentence",
                options: [
                  { label: "the cat sat on the mat", value: '"the cat sat on the mat"' },
                  { label: "the dog saw the cat", value: '"the dog saw the cat"' },
                  { label: "a cat and a dog met the bird", value: '"a cat and a dog met the bird"' },
                ],
              },
              {
                type: "select",
                name: "order",
                label: "Vocabulary order",
                options: [
                  { label: "Sorted", value: "sorted(set(tokens))" },
                  { label: "First appearance", value: "list(dict.fromkeys(tokens))" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "sentence = {{sentence}}",
              "tokens = sentence.split()",
              "words = {{order}}",
              "vocab = {word: i for i, word in enumerate(words)}",
              "id_list = []",
              "for word in tokens:",
              "    token_id = vocab[word]",
              "    id_list.append(token_id)",
              "ids = np.array(id_list)",
              'is_the = ids == vocab["the"]',
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
            "A token is one unit of text; here, one word from `sentence.split()`.",
            "The vocabulary holds every distinct token once; `V` is its size.",
            "A token id is a token's position in the vocabulary, from `0` to `V - 1`.",
            "`vocab = {word: i for i, word in enumerate(sorted(set(tokens)))}` maps words to ids.",
            "`np.array([vocab[word] for word in tokens])` turns a sentence into a 1D id array.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "embeddings-01-q1",
      question: 'How many tokens and how many distinct words does `"a dog saw a cat"` have?',
      options: ["5 tokens, 5 words", "5 tokens, 4 words", "4 tokens, 4 words"],
      answer: 1,
      explanation: "`split()` gives 5 tokens; `a` appears twice, so the vocabulary has 4 words.",
    },
    {
      id: "embeddings-01-q2",
      question: 'With `vocab = {"cat": 0, "on": 1, "the": 2}`, what are the ids of `"the cat"`?',
      options: ["`[0, 2]`", "`[2, 0]`", "`[1, 2]`"],
      answer: 1,
      explanation: "Ids follow the token order: `the` is 2, then `cat` is 0.",
    },
    {
      id: "embeddings-01-q3",
      question: "A vocabulary has `V = 8` words. Which token ids can appear?",
      options: ["`1` to `8`", "`0` to `7`", "Any whole number"],
      answer: 1,
      explanation: "An id is a position in the vocabulary, and positions start at 0.",
    },
  ],
};
