import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "A language model writes text one token at a time: pick a next token from the current row of probabilities, append it, and repeat. Greedy picking is simple but falls into loops.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What generating text means",
      blocks: [
        {
          kind: "text",
          text: "Generating text is running next-token prediction in a loop. Start from a start token, choose a next token from its distribution, make that the current token, and choose again.",
        },
        {
          kind: "note",
          text: "Greedy decoding always chooses the most probable next token: `np.argmax(P[current])`. Decoding means turning the model's probabilities into actual tokens.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            'vocab = ["the", "cat", "sat", "on", "mat", "dog", "rug", "."]',
            "ids = np.array([0, 1, 2, 3, 0, 4, 7, 0, 5, 2, 3, 0, 6, 7])",
            "counts = np.zeros((8, 8))",
            "np.add.at(counts, (ids[:-1], ids[1:]), 1)",
            "P = counts / counts.sum(axis=1, keepdims=True)",
            "print(np.argmax(P[0]), np.argmax(P[1]))",
            "print(vocab[np.argmax(P[5])])",
          ].join("\n"),
          output: ["1 2", "sat"].join("\n"),
        },
        {
          kind: "text",
          text: "After `the` (id 0), four tokens tie at `0.25`; `np.argmax` returns the first, `cat` (id 1). After `dog` (id 5), the only option is `sat`.",
        },
      ],
    },
    {
      title: "Why a loop is enough",
      blocks: [
        {
          kind: "text",
          text: "The bigram model only needs the current token, so each step is one row lookup and one choice. Larger models look at more of the sequence, but the outer loop is the same.",
        },
      ],
    },
    {
      title: "Greedy decoding in a loop",
      blocks: [
        {
          kind: "text",
          text: "`generated` starts as a list with the start id. Each step picks the next id, appends it, and continues from it.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            'vocab = ["the", "cat", "sat", "on", "mat", "dog", "rug", "."]',
            "ids = np.array([0, 1, 2, 3, 0, 4, 7, 0, 5, 2, 3, 0, 6, 7])",
            "counts = np.zeros((8, 8))",
            "np.add.at(counts, (ids[:-1], ids[1:]), 1)",
            "P = counts / counts.sum(axis=1, keepdims=True)",
            "current = 0",
            "generated = [current]",
            "for step in range(8):",
            "    current = int(np.argmax(P[current]))",
            "    generated.append(current)",
            "print(generated)",
            'print(" ".join(vocab[i] for i in generated))',
          ].join("\n"),
          output: ["[0, 1, 2, 3, 0, 1, 2, 3, 0]", "the cat sat on the cat sat on the"].join("\n"),
        },
        {
          kind: "note",
          text: "Greedy output repeats: once the loop returns to a token it has seen, it makes the same choices again forever. Here `the cat sat on` repeats, and `mat`, `dog` and `rug` never appear.",
        },
      ],
    },
    {
      title: "A practical example: sampling instead of argmax",
      blocks: [
        {
          kind: "text",
          text: "Sampling draws the next token at random, using the row as the probabilities. `rng.choice(V, p=P[current])` returns an id from `0` to `V - 1`, more often the likely ones.",
        },
        {
          kind: "text",
          text: "A seeded generator, `np.random.default_rng(0)`, gives the same draws every run, so the output below is reproducible.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            'vocab = ["the", "cat", "sat", "on", "mat", "dog", "rug", "."]',
            "ids = np.array([0, 1, 2, 3, 0, 4, 7, 0, 5, 2, 3, 0, 6, 7])",
            "V = 8",
            "counts = np.zeros((V, V))",
            "np.add.at(counts, (ids[:-1], ids[1:]), 1)",
            "P = counts / counts.sum(axis=1, keepdims=True)",
            "rng = np.random.default_rng(0)",
            "current = 0",
            "generated = [current]",
            "for step in range(8):",
            "    current = int(rng.choice(V, p=P[current]))",
            "    generated.append(current)",
            'print(" ".join(vocab[i] for i in generated))',
          ].join("\n"),
          output: "the dog sat on the rug . the dog",
        },
        {
          kind: "text",
          text: "The sampled text uses `dog` and `rug`, which greedy decoding never reaches. The cost is that a token with a low probability can also be drawn.",
        },
      ],
    },
    {
      title: "Try it: greedy and sampled generation",
      blocks: [
        {
          kind: "text",
          text: "Pick a start word, the number of steps and how to choose. Step through the loop to see `probs`, the row used at each step, and `p_pick`, the probability of the chosen token.",
        },
        {
          kind: "playground",
          demo: {
            title: "Generation loop",
            controls: [
              {
                type: "select",
                name: "start",
                label: "Start word",
                options: [
                  { label: "the (id 0)", value: "0" },
                  { label: "dog (id 5)", value: "5" },
                  { label: "mat (id 4)", value: "4" },
                ],
              },
              { type: "number", name: "steps", label: "Steps", min: 1, max: 10, initial: 8 },
              {
                type: "select",
                name: "pick",
                label: "Choose by",
                options: [
                  { label: "greedy (argmax)", value: "int(np.argmax(probs))" },
                  { label: "sampling (seed 0)", value: "int(rng.choice(V, p=probs))" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "ids = np.array([0, 1, 2, 3, 0, 4, 7, 0, 5, 2, 3, 0, 6, 7])",
              "V = 8",
              "counts = np.zeros((V, V))",
              "np.add.at(counts, (ids[:-1], ids[1:]), 1)",
              "P = counts / counts.sum(axis=1, keepdims=True)",
              "rng = np.random.default_rng(0)",
              "current = {{start}}",
              "generated = [current]",
              "for step in range({{steps}}):",
              "    probs = P[current]",
              "    current = {{pick}}",
              "    p_pick = probs[current]",
              "    generated.append(current)",
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
            "Generation repeats next-token prediction: choose a token, append it, continue from it.",
            "Greedy decoding chooses `np.argmax(P[current])`; ties go to the lowest id.",
            "Greedy output is deterministic and falls into repetition loops.",
            "Sampling with `rng.choice(V, p=P[current])` varies the output; a seeded `rng` makes it reproducible.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "language-model-03-q1",
      question: "`P[current]` is `[0.1, 0.6, 0.3]`. Which id does greedy decoding pick?",
      options: ["0", "1", "2"],
      answer: 1,
      explanation: "`np.argmax` returns the index of the largest probability, 0.6.",
    },
    {
      id: "language-model-03-q2",
      question: "Why does greedy output from a bigram model repeat itself?",
      options: [
        "Because the probabilities change after each step",
        "Because the next token depends only on the current one, so a repeated token repeats every later choice",
        "Because `np.argmax` picks a random index on ties",
      ],
      answer: 1,
      explanation: "The same current token always gives the same argmax, so the sequence cycles.",
    },
    {
      id: "language-model-03-q3",
      question: "What does seeding with `np.random.default_rng(0)` give?",
      options: [
        "The same sampled text on every run",
        "Greedy output",
        "A different text on every run",
      ],
      answer: 0,
      explanation: "The seed fixes the random draws, so the samples are reproducible.",
    },
  ],
};
