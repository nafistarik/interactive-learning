import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "An agent that always takes its best-looking action never finds out whether another action is better. Epsilon-greedy mixes in a few random actions, drawn from a seeded generator.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What exploration and exploitation are",
      blocks: [
        {
          kind: "text",
          text: "Exploitation means taking the action with the highest value in the Q-table, the greedy action. Exploration means taking some other action to find out what it leads to.",
        },
        {
          kind: "note",
          text: "Epsilon-greedy: with probability `epsilon` (a number between 0 and 1) take a random action, otherwise take the greedy action `np.argmax(Q[s])`.",
        },
      ],
    },
    {
      title: "Why a greedy agent gets stuck",
      blocks: [
        {
          kind: "text",
          text: "A learning agent starts with a Q-table of zeros. Every action ties, so `np.argmax` picks action 0, up, and in the top-left corner up is a wall.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "rows, cols = 4, 4",
            "moves = np.array([[-1, 0], [0, 1], [1, 0], [0, -1]])  # up, right, down, left",
            "",
            "def step(state, action):",
            "    row = state // cols + moves[action, 0]",
            "    col = state % cols + moves[action, 1]",
            "    if not (0 <= row < rows and 0 <= col < cols):",
            "        row, col = state // cols, state % cols  # a wall: stay in place",
            "    return int(row * cols + col)",
            "",
            "Q = np.zeros((rows * cols, 4))",
            "s = 0",
            "visited = [s]",
            "for t in range(5):",
            "    a = int(np.argmax(Q[s]))  # all zeros: argmax picks action 0, up",
            "    s = step(s, a)",
            "    visited.append(s)",
            "print(visited)",
          ].join("\n"),
          output: "[0, 0, 0, 0, 0, 0]",
        },
        {
          kind: "text",
          text: "The agent never leaves state 0, so it never sees the goal and nothing in its experience tells it to change. Only actions it actually tries can teach it anything, so it must sometimes try actions that do not look best yet.",
        },
      ],
    },
    {
      title: "Random choices you can repeat",
      blocks: [
        {
          kind: "text",
          text: "`rng = np.random.default_rng(0)` creates a random number generator with seed 0. `rng.random()` draws a float between 0 and 1, and `rng.integers(4)` draws a whole number from 0 to 3.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "rng = np.random.default_rng(0)",
            "print(round(rng.random(), 3), round(rng.random(), 3))",
            "print(int(rng.integers(4)), int(rng.integers(4)), int(rng.integers(4)))",
            "",
            "rng = np.random.default_rng(0)  # the same seed again",
            "print(round(rng.random(), 3), round(rng.random(), 3))",
          ].join("\n"),
          output: ["0.637 0.27", "1 0 0", "0.637 0.27"].join("\n"),
        },
        {
          kind: "text",
          text: "The same seed gives the same sequence, so a run with random exploration can be repeated exactly. That is how the exercises can check your answer.",
        },
      ],
    },
    {
      title: "Epsilon-greedy in code",
      blocks: [
        {
          kind: "text",
          text: "Draw `rng.random()`; if it is below `epsilon`, explore with `rng.integers(4)`, else exploit with `np.argmax(Q[s])`. Here one state's values say right (1) is best and `epsilon` is `0.3`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "",
            "def epsilon_greedy(Q, s, epsilon, rng):",
            "    if rng.random() < epsilon:",
            "        return int(rng.integers(4))  # explore: any of the 4 actions",
            "    return int(np.argmax(Q[s]))  # exploit: the best known action",
            "",
            "Q = np.array([[0.1, 0.5, 0.3, 0.0]])  # one state; action 1 (right) looks best",
            "rng = np.random.default_rng(0)",
            "actions = [epsilon_greedy(Q, 0, 0.3, rng) for t in range(12)]",
            "print(actions)",
            "print(sum(a != 1 for a in actions))",
          ].join("\n"),
          output: ["[1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3]", "2"].join("\n"),
        },
        {
          kind: "text",
          text: "Most choices are the greedy action 1; two are something else. A random action can also be action 1 by chance, so the share of greedy actions is a little above `1 - epsilon`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "",
            "def epsilon_greedy(Q, s, epsilon, rng):",
            "    if rng.random() < epsilon:",
            "        return int(rng.integers(4))",
            "    return int(np.argmax(Q[s]))",
            "",
            "Q = np.array([[0.1, 0.5, 0.3, 0.0]])",
            "for epsilon in [0.0, 0.1, 0.5, 1.0]:",
            "    rng = np.random.default_rng(0)",
            "    actions = np.array([epsilon_greedy(Q, 0, epsilon, rng) for t in range(1000)])",
            "    print(epsilon, np.mean(actions == 1).round(3))",
          ].join("\n"),
          output: ["0.0 1.0", "0.1 0.93", "0.5 0.628", "1.0 0.251"].join("\n"),
        },
        {
          kind: "text",
          text: "With `epsilon = 0` the agent never explores; with `epsilon = 1` it ignores the table and picks each action about a quarter of the time. Values like `0.1` keep it mostly greedy while it still tries everything now and then.",
        },
      ],
    },
    {
      title: "Try it: how often the agent explores",
      blocks: [
        {
          kind: "text",
          text: "Move `epsilon` (in hundredths) and the seed, then step through the 200 choices. Watch the share of each action settle, and see where the random actions appear.",
        },
        {
          kind: "playground",
          demo: {
            title: "Epsilon-greedy choices",
            controls: [
              { type: "number", name: "e", label: "epsilon × 100", min: 0, max: 100, initial: 20 },
              { type: "number", name: "seed", label: "Seed", min: 0, max: 9, initial: 0 },
            ],
            template: [
              "import numpy as np",
              "Q_row = np.array([0.1, 0.5, 0.3, 0.0])  # one state; right (1) looks best",
              "epsilon = {{e}} / 100",
              "rng = np.random.default_rng({{seed}})",
              "counts = np.zeros(4)",
              "for t in range(200):",
              "    if rng.random() < epsilon:",
              "        a = int(rng.integers(4))",
              "    else:",
              "        a = int(np.argmax(Q_row))",
              "    counts[a] += 1",
              "    share = (counts / (t + 1)).reshape(1, 4)",
              "    greedy_share = share[0, 1]",
            ].join("\n"),
            chart: { kind: "heatmap", matrix: "share", rowLabels: ["share"], colLabels: ["up", "right", "down", "left"] },
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
            "Exploitation takes the greedy action; exploration tries another one to learn what it does.",
            "A purely greedy agent with a table of zeros can repeat one useless action forever.",
            "Epsilon-greedy: if `rng.random() < epsilon`, take `rng.integers(4)`, else `np.argmax(Q[s])`.",
            "`np.random.default_rng(seed)` makes the random choices repeatable.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "q-learning-02-q1",
      question: "With `epsilon = 0.2`, how often does epsilon-greedy draw a random action?",
      options: ["Never", "About 1 time in 5", "About 4 times in 5", "Always"],
      answer: 1,
      explanation: "`rng.random() < 0.2` holds for about 20% of the draws.",
    },
    {
      id: "q-learning-02-q2",
      question: "Why does a greedy agent starting from a Q-table of zeros need exploration?",
      options: [
        "Because `np.argmax` fails on zeros",
        "Because it keeps taking the first action and never tries the others",
        "Because zeros are not valid action values",
        "Because the rewards are random",
      ],
      answer: 1,
      explanation: "All actions tie, `np.argmax` picks action 0 every time, and untried actions cannot teach it anything.",
    },
    {
      id: "q-learning-02-q3",
      question: "What does creating the generator with `np.random.default_rng(0)` give you?",
      options: [
        "Random numbers that are all 0",
        "The same sequence of random numbers on every run",
        "Numbers that are no longer random in a single run",
        "Faster random numbers",
      ],
      answer: 1,
      explanation: "The seed fixes the sequence, so a run can be repeated and checked.",
    },
  ],
};
