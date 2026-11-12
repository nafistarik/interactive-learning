import type { LessonContent } from "@/features/content/types";

import { GRID } from "../grid";

/** One Bellman sweep over the grid in scope: reads `V`, writes `V_new` and `V_grid`. */
const SWEEP = [
  "V_new = V.copy()",
  "for s in range(rows * cols):",
  "    if s == goal or s == pit:",
  "        continue",
  "    q = np.zeros(4)",
  "    for a in range(4):",
  "        next_state, reward, done = step(s, a)",
  "        q[a] = reward + gamma * V[next_state]",
  "    V_new[s] = q.max()",
].join("\n");

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "The Bellman update rates a state from its neighbours: try each action, add its reward to the discounted value of where it leads, and keep the best. One sweep applies it to every state.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What the Bellman update is",
      blocks: [
        {
          kind: "text",
          text: "The Bellman update computes a new value for a state from the values of the states one step away. For a state `s` that is not terminal, it is `V[s] = max over a of (reward + gamma * V[next])`, where `reward` and `next` come from `step(s, a)`.",
        },
        {
          kind: "note",
          text: "`reward + gamma * V[next]` is the action value of action `a` in state `s`: the reward of the move plus the discounted value of where it lands. The update keeps the largest of the four action values.",
        },
      ],
    },
    {
      title: "Why one step of lookahead is enough",
      blocks: [
        {
          kind: "text",
          text: "The return from `s` is the first reward plus `gamma` times the return from the next state. So if the values of the neighbours are right, one step of lookahead gives the right value for `s`.",
        },
        {
          kind: "text",
          text: "Taking the max means the agent picks its best move. You never have to list whole paths: each state only looks at its four neighbours.",
        },
      ],
    },
    {
      title: "The grid world of this module",
      blocks: [
        {
          kind: "text",
          text: "The grid from Module 4.1 has 3 rows and 4 columns. State `s = row * cols + col`, so the top row holds states `0` to `3`. Actions are `0` up, `1` right, `2` down and `3` left, and `moves[a]` is the change in row and column.",
        },
        {
          kind: "list",
          items: [
            "The goal is state `3`, top right: stepping into it gives `+1` and ends the episode.",
            "The pit is state `7`, just below the goal: stepping into it gives `-1` and ends the episode.",
            "A move off the grid hits a wall: the agent stays where it is.",
            "Every other move gives reward `0`. `step(state, action)` returns `(next_state, reward, done)`.",
          ],
        },
      ],
    },
    {
      title: "Action values for one state",
      blocks: [
        {
          kind: "text",
          text: "Start from `V` all zeros and look at state `2`, left of the goal. Fill an array `q` with the four action values and take its max.",
        },
        {
          kind: "code",
          code: [
            GRID,
            "",
            "V = np.zeros(rows * cols)",
            "s = 2",
            "q = np.zeros(4)",
            "for a in range(4):",
            "    next_state, reward, done = step(s, a)",
            "    q[a] = reward + gamma * V[next_state]",
            "print(q.tolist())",
            "print(float(q.max()))",
          ].join("\n"),
          output: ["[0.0, 1.0, 0.0, 0.0]", "1.0"].join("\n"),
        },
        {
          kind: "text",
          text: "Only action `1`, right, reaches the goal and collects the `+1`. Up hits the wall, and down and left lead to states whose value is still `0`.",
        },
      ],
    },
    {
      title: "One sweep over all states",
      blocks: [
        {
          kind: "text",
          text: "A sweep applies the update to every state that is not terminal. Read from the old `V` and write into a copy `V_new`, so every state in the sweep sees the same old values.",
        },
        {
          kind: "code",
          code: [GRID, "", "V = np.zeros(rows * cols)", SWEEP, "print(np.round(V_new.reshape(rows, cols), 3).tolist())"].join("\n"),
          output: "[[0.0, 0.0, 1.0, 0.0], [0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 0.0]]",
        },
        {
          kind: "text",
          text: "After one sweep from zeros, only state `2` knows about the goal. Sweep again from that result and the value reaches the states next to state `2`, discounted once.",
        },
        {
          kind: "code",
          code: [
            GRID,
            "",
            "V = np.zeros(rows * cols)",
            "V[2] = 1.0  # the result of the first sweep",
            SWEEP,
            "print(np.round(V_new.reshape(rows, cols), 3).tolist())",
          ].join("\n"),
          output: "[[0.0, 0.9, 1.0, 0.0], [0.0, 0.0, 0.9, 0.0], [0.0, 0.0, 0.0, 0.0]]",
        },
        {
          kind: "note",
          text: "Terminal states are skipped and keep value `0`. Updating them would let the goal collect its `+1` again and again, which never happens in a real episode.",
        },
      ],
    },
    {
      title: "Try it: one sweep, state by state",
      blocks: [
        {
          kind: "text",
          text: "Pick the values the sweep starts from and step through the loop over states: the heatmap shows `V_new` changing one state at a time.",
        },
        {
          kind: "playground",
          demo: {
            title: "One Bellman sweep",
            controls: [
              {
                type: "select",
                name: "start",
                label: "Start from",
                options: [
                  { label: "All zeros", value: "np.zeros(rows * cols)" },
                  { label: "After one sweep", value: "np.array([0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], dtype=float)" },
                  { label: "After two sweeps", value: "np.array([0, 0.9, 1, 0, 0, 0, 0.9, 0, 0, 0, 0, 0])" },
                ],
              },
            ],
            template: [GRID, "V = {{start}}", SWEEP, "    V_grid = V_new.reshape(rows, cols)"].join("\n"),
            chart: { kind: "heatmap", matrix: "V_grid" },
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
            "Action value: `reward + gamma * V[next]`, with `reward` and `next` from `step(s, a)`.",
            "Bellman update: `V[s]` becomes the largest of the four action values.",
            "Terminal states are skipped and stay at `0`.",
            "A sweep updates every state, reading the old `V` and writing `V_new`.",
            "Each sweep carries the goal's reward one cell further.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "value-iteration-02-q1",
      question: "Which line is the Bellman update for a state `s` that is not terminal?",
      options: [
        "`V[s] = sum over a of (reward + gamma * V[next])`",
        "`V[s] = max over a of (reward + gamma * V[next])`",
        "`V[s] = reward + V[s]`",
        "`V[s] = gamma * max(V)`",
      ],
      answer: 1,
      explanation: "The agent can choose its move, so the state is worth its best action value.",
    },
    {
      id: "value-iteration-02-q2",
      question: "Why does the sweep write into `V_new` instead of `V`?",
      options: [
        "NumPy arrays cannot be changed inside a loop",
        "So every state in the sweep is updated from the same old values",
        "So the terminal states keep their values",
      ],
      answer: 1,
      explanation: "Reading the old `V` and writing `V_new` keeps one sweep from mixing old and new values.",
    },
    {
      id: "value-iteration-02-q3",
      question: "After one sweep from all zeros, which states have a value other than `0`?",
      options: [
        "Every state",
        "Only the states one step from the goal",
        "Only the goal",
        "None: one sweep changes nothing",
      ],
      answer: 1,
      explanation: "Only a move into the goal earns a reward; every other action value still uses `V = 0`.",
    },
  ],
};
