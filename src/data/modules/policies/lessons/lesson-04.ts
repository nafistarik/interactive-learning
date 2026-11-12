import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "A Q-table needs one row per state, and the number of states grows fast. When states are many or continuous, Q is approximated by a function such as a neural network.",
  estimatedMinutes: 14,
  sections: [
    {
      title: "What a state space is",
      blocks: [
        {
          kind: "note",
          text: "The state space is the set of all states the agent can be in. A tabular method, such as the Q-table, keeps one row for every state in it.",
        },
        {
          kind: "text",
          text: "Our 2 × 4 grid has 8 states and 4 actions, so its Q-table holds `8 * 4 = 32` numbers. A grid with side `n` has `n * n` states.",
        },
      ],
    },
    {
      title: "Why tables stop working",
      blocks: [
        {
          kind: "text",
          text: "Every entry of the table is learned only from visits to that state. More states mean more memory and, worse, many more episodes before each entry has been visited often enough.",
        },
        {
          kind: "text",
          text: "A table also learns nothing about a state it has never visited, even when that state is almost the same as a visited one.",
        },
      ],
    },
    {
      title: "Counting table sizes",
      blocks: [
        {
          kind: "text",
          text: "For square grids, the number of states grows with the square of the side and the table with it.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "sides = np.array([2, 4, 10, 100, 1000])",
            "n_actions = 4",
            "n_states = sides * sides",
            "sizes = n_states * n_actions",
            "print(n_states)",
            "print(sizes)",
          ].join("\n"),
          output: ["[      4      16     100   10000 1000000]", "[     16      64     400   40000 4000000]"].join("\n"),
        },
        {
          kind: "text",
          text: "A robot is described instead by several measured numbers, called features, such as its position, speed and angle. If each feature is cut into 10 intervals, `k` features give `10 ** k` states.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "n_features = np.array([1, 3, 6, 9])",
            "n_states = 10.0 ** n_features",
            "megabytes = n_states * 4 * 8 / 1_000_000",
            "print(n_states.tolist())",
            "print(megabytes.tolist())",
          ].join("\n"),
          output: ["[10.0, 1000.0, 1000000.0, 1000000000.0]", "[0.00032, 0.032, 32.0, 32000.0]"].join("\n"),
        },
        {
          kind: "text",
          text: "Each feature multiplies the table by 10. With 4 actions at 8 bytes per number, 9 features already need 32,000 megabytes.",
        },
        {
          kind: "note",
          text: "Pyodide's integers are 32-bit, so a count above about 2.1 billion overflows to a wrong number without an error. `10.0 ** n_features` uses floats, which do not overflow here.",
        },
      ],
    },
    {
      title: "Continuous states and approximating Q",
      blocks: [
        {
          kind: "text",
          text: "A continuous state, such as a position of `0.37` metres, can take infinitely many values, so no table has a row for each. Cutting it into intervals loses detail and still multiplies the table per feature.",
        },
        {
          kind: "text",
          text: "The alternative is a function that computes Q from the state's features. Its weights are shared by all states, so nearby states get similar values, including states never visited.",
        },
        {
          kind: "text",
          text: "Here a state of our grid is described by 3 features: its row and column scaled to 0..1, and a constant 1. The hand-picked weights `W` have shape `(3, 4)`, one column per action.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "rows, cols = 2, 4",
            "",
            "def features(state):",
            "    row, col = divmod(state, cols)",
            "    return np.array([row / (rows - 1), col / (cols - 1), 1.0])",
            "",
            "W = np.array([",
            "    [-0.2, 0.1, -0.3, 0.0],",
            "    [0.1, 0.6, 0.0, -0.2],",
            "    [0.4, 0.2, 0.3, 0.1],",
            "])",
            "x = features(5)",
            "q = x @ W",
            "print(np.round(x, 2), np.round(q, 2), int(np.argmax(q)))",
            "print(W.size, rows * cols * 4)",
          ].join("\n"),
          output: ["[1.   0.33 1.  ] [0.23 0.5  0.   0.03] 1", "12 32"].join("\n"),
        },
        {
          kind: "text",
          text: "`x @ W` gives the 4 Q-values of state 5 from 12 weights, and the same 12 weights serve a grid of any size. Training would adjust `W` instead of table entries.",
        },
        {
          kind: "text",
          text: "Replace `x @ W` with the small neural network of Phase 2, whose last layer has one output per action, and you have the idea behind deep Q-learning. A linear function is often too simple; the network can learn curved patterns.",
        },
      ],
    },
    {
      title: "Try it: watch the table grow",
      blocks: [
        {
          kind: "text",
          text: "Pick the number of intervals per feature and the largest number of features. The loop records the states and the table size for 1, 2, 3, … features; compare 2 intervals with 10.",
        },
        {
          kind: "playground",
          demo: {
            title: "Q-table size per feature",
            controls: [
              {
                type: "select",
                name: "bins",
                label: "Intervals per feature",
                options: [
                  { label: "2", value: "2" },
                  { label: "5", value: "5" },
                  { label: "10", value: "10" },
                ],
              },
              { type: "number", name: "features", label: "Features", min: 2, max: 8, initial: 6 },
            ],
            template: [
              "import numpy as np",
              "n_actions = 4",
              "bins = {{bins}}",
              "for k in range(1, {{features}} + 1):",
              "    n_states = bins ** k",
              "    size = n_states * n_actions",
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
            "A Q-table has one row per state and one column per action: `n_states * n_actions` entries.",
            "Grid states grow with the square of the side; feature states grow as `bins ** k`, a factor per feature.",
            "Continuous states cannot be listed in a table at all.",
            "Approximating Q with a function, such as `x @ W` or a neural network, shares weights across states.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "policies-04-q1",
      question: "A 5 × 5 grid has 4 actions. How many entries does its Q-table hold?",
      options: ["`20`", "`25`", "`100`", "`625`"],
      answer: 2,
      explanation: "25 states times 4 actions is 100 entries.",
    },
    {
      id: "policies-04-q2",
      question: "Each feature is cut into 10 intervals. What happens to the number of states when you add one feature?",
      options: ["It grows by 10", "It doubles", "It is multiplied by 10"],
      answer: 2,
      explanation: "`k` features give `10 ** k` states, so one more feature multiplies the count by 10.",
    },
    {
      id: "policies-04-q3",
      question: "Why can a function of the features give a value for a state the agent never visited?",
      options: [
        "Its weights are shared by all states, so similar features give similar values",
        "It stores a row for every possible state",
        "It explores every state before training",
      ],
      answer: 0,
      explanation: "The function computes Q from the features with the same weights for every state, so it generalizes.",
    },
  ],
};
