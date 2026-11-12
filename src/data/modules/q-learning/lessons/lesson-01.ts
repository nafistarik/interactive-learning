import type { LessonContent } from "@/features/content/types";

/** The Q-table of the 2 x 2 grid used across this lesson (gamma 0.9, goal in state 3). */
const Q_2X2 = [
  "Q = np.array([",
  "    [0.81, 0.9, 0.9, 0.81],",
  "    [0.9, 0.9, 1.0, 0.81],",
  "    [0.81, 1.0, 0.9, 0.9],",
  "    [0.0, 0.0, 0.0, 0.0],",
  "])",
];

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "An action value scores one action in one state. A Q-table holds one for every state and action, so choosing the best move is a row lookup.",
  estimatedMinutes: 14,
  sections: [
    {
      title: "What an action value is",
      blocks: [
        {
          kind: "text",
          text: "An action value `Q[s, a]` is the return the agent can expect if it takes action `a` in state `s` and then keeps acting as well as it can. A high value means the action leads towards reward; a low value means it leads away from it.",
        },
        {
          kind: "note",
          text: "A Q-table is a NumPy array of shape `(states, actions)` holding every action value: one row per state, one column per action. In our grid worlds it has 4 columns.",
        },
        {
          kind: "list",
          items: [
            "The grid world is the one from 4.1: a small grid of cells, each cell a state `s = row * cols + col`.",
            "Actions are 0 = up, 1 = right, 2 = down, 3 = left, with `moves = np.array([[-1, 0], [0, 1], [1, 0], [0, -1]])`.",
            "A move into the edge of the grid is a wall: the agent stays where it is.",
            "Reaching the goal gives +1 and ends the episode; some grids also have a pit that gives -1 and ends it.",
            "`step(state, action)` returns `(next_state, reward, done)`; moves are deterministic.",
          ],
        },
      ],
    },
    {
      title: "Why store a value per action",
      blocks: [
        {
          kind: "text",
          text: "In 4.2 the state value `V[s]` told you how good a cell is. To pick a move from `V` you had to call `step` for every action and look one step ahead, so you needed the rules of the world.",
        },
        {
          kind: "text",
          text: "A Q-table already scores each action, so the best move is the largest number in the row `Q[s]`. No look-ahead is needed, which is what lets an agent learn from experience alone later in this module.",
        },
      ],
    },
    {
      title: "Reading a Q-table",
      blocks: [
        {
          kind: "text",
          text: "Start from a table of zeros, one row per state. `Q[s]` is the row of state `s`, and `Q[s, a]` is one action value.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "Q = np.zeros((4, 4))  # 4 states (a 2 x 2 grid), 4 actions",
            "print(Q.shape)",
            "Q[0] = [0.81, 0.9, 0.9, 0.81]",
            "Q[1, 2] = 1.0",
            "print(Q[0].tolist())",
            "print(Q[1].tolist())",
            "print(float(Q[0, 2]))",
          ].join("\n"),
          output: ["(4, 4)", "[0.81, 0.9, 0.9, 0.81]", "[0.0, 0.0, 1.0, 0.0]", "0.9"].join("\n"),
        },
        {
          kind: "text",
          text: "The greedy action is the one with the highest value: `np.argmax(Q[s])`. Over the whole table, `Q.argmax(axis=1)` gives the greedy action of every state and `Q.max(axis=1)` gives the value of that best action.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            ...Q_2X2,
            "s = 1",
            "print(int(np.argmax(Q[s])), float(Q[s].max()))",
            "print(int(np.argmax(Q[0])))",
            "print(Q.argmax(axis=1).tolist())",
            "print(Q.max(axis=1).reshape(2, 2).tolist())",
          ].join("\n"),
          output: ["2 1.0", "1", "[1, 2, 1, 0]", "[[0.9, 1.0], [1.0, 0.0]]"].join("\n"),
        },
        {
          kind: "note",
          text: "When two actions tie, `np.argmax` returns the first one: in state 0 right (1) and down (2) are both `0.9`, so it picks 1. State 3 is the goal; the episode ends there, so its row stays zero and is never used.",
        },
      ],
    },
    {
      title: "Q-values from state values on a 2 x 2 grid",
      blocks: [
        {
          kind: "text",
          text: "Here is where the table above comes from. On a 2 x 2 grid with the goal in state 3, a reward of 1 at the goal and `gamma = 0.9`, value iteration from 4.2 gives `V = [0.9, 1.0, 1.0, 0.0]`.",
        },
        {
          kind: "text",
          text: "An action's value is its reward plus the discounted value of where it lands: `Q[s, a] = r + gamma * V[s2]`, with no future after the episode ends.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "rows, cols = 2, 2",
            "goal = 3",
            "gamma = 0.9",
            "moves = np.array([[-1, 0], [0, 1], [1, 0], [0, -1]])  # up, right, down, left",
            "",
            "def step(state, action):",
            "    row = state // cols + moves[action, 0]",
            "    col = state % cols + moves[action, 1]",
            "    if not (0 <= row < rows and 0 <= col < cols):",
            "        row, col = state // cols, state % cols  # a wall: stay in place",
            "    next_state = int(row * cols + col)",
            "    if next_state == goal:",
            "        return next_state, 1.0, True",
            "    return next_state, 0.0, False",
            "",
            "V = np.array([0.9, 1.0, 1.0, 0.0])  # state values from value iteration",
            "Q = np.zeros((rows * cols, 4))",
            "for s in range(rows * cols):",
            "    if s == goal:",
            "        continue",
            "    for a in range(4):",
            "        s2, r, done = step(s, a)",
            "        Q[s, a] = r + gamma * V[s2] * (not done)",
            "",
            "print(np.round(Q, 2).tolist())",
            "print(Q.argmax(axis=1).tolist())",
            "print(np.round(Q.max(axis=1), 2).tolist())",
          ].join("\n"),
          output: [
            "[[0.81, 0.9, 0.9, 0.81], [0.9, 0.9, 1.0, 0.81], [0.81, 1.0, 0.9, 0.9], [0.0, 0.0, 0.0, 0.0]]",
            "[1, 2, 1, 0]",
            "[0.9, 1.0, 1.0, 0.0]",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "Moving up from state 0 hits the wall, so the agent stays in state 0 and the value is `0.9 * 0.9 = 0.81`. The best value in each row is `V[s]` again: `Q.max(axis=1)` gives back the state values.",
        },
      ],
    },
    {
      title: "Try it: read the Q-table",
      blocks: [
        {
          kind: "text",
          text: "Pick a state and a way to read the table. Compare `Q.max(axis=1)`, one best value per state, with `Q.max(axis=0)`, which mixes states and is not a value of anything.",
        },
        {
          kind: "playground",
          demo: {
            title: "Best values in the Q-table",
            controls: [
              {
                type: "select",
                name: "read",
                label: "Read",
                options: [
                  { label: "Q[s].max(): best value in state s", value: "Q[s].max()" },
                  { label: "Q.max(axis=1): best value of every state", value: "Q.max(axis=1)" },
                  { label: "Q.max(axis=1) as the 2 x 2 grid", value: "Q.max(axis=1).reshape(2, 2)" },
                  { label: "Q.max(axis=0): best per action (not a state value)", value: "Q.max(axis=0)" },
                ],
              },
              { type: "number", name: "s", label: "State s", min: 0, max: 3, initial: 0 },
            ],
            template: ["import numpy as np", ...Q_2X2, "s = {{s}}", "result = {{read}}"].join("\n"),
            chart: {
              kind: "heatmap",
              matrix: "Q",
              rowLabels: ["state 0", "state 1", "state 2", "3 (goal)"],
              colLabels: ["up", "right", "down", "left"],
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
            "`Q[s, a]` is the return expected after taking action `a` in state `s` and acting well afterwards.",
            "A Q-table has shape `(states, 4)`: one row per state, one column per action.",
            "The greedy action is `np.argmax(Q[s])`; ties go to the first action.",
            "`Q.max(axis=1)` is the value of every state and `Q.argmax(axis=1)` the greedy policy.",
            "With Q-values, choosing a move needs no look-ahead with `step`.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "q-learning-01-q1",
      question: "A grid has 3 rows and 3 columns and 4 actions. What is the shape of its Q-table?",
      options: ["(3, 3)", "(9, 4)", "(4, 9)", "(3, 3, 3)"],
      answer: 1,
      explanation: "One row per state (3 * 3 = 9 cells) and one column per action.",
    },
    {
      id: "q-learning-01-q2",
      question: "`Q[5]` is `[0.2, 0.7, 0.7, 0.1]`. What does `np.argmax(Q[5])` return?",
      options: ["0.7", "1", "2", "[1, 2]"],
      answer: 1,
      explanation: "It returns an index, not a value, and on a tie it returns the first one.",
    },
    {
      id: "q-learning-01-q3",
      question: "Which expression gives the value of every state from a Q-table?",
      options: ["Q.max(axis=0)", "Q.max(axis=1)", "Q.argmax(axis=1)", "Q.sum(axis=1)"],
      answer: 1,
      explanation: "A state is worth its best action, the maximum along each row (axis 1).",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    ...Q_2X2,
    "",
    "# The greedy action of every state, then the best value of every state as a 2 x 2 grid.",
    "policy = Q.argmax(axis=1)",
    "V = Q.max(axis=1).reshape(2, 2)",
    "print(policy)",
    "print(V)",
  ].join("\n"),
};
