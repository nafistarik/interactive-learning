import type { LessonContent } from "@/features/content/types";

import { GRID } from "../grid";

/** Q-learning on the grid for 100 episodes with seed 0: shared by the lesson's examples. */
const TRAIN = [
  "",
  "alpha, gamma, epsilon = 0.5, 0.9, 0.1",
  "rng = np.random.default_rng(0)",
  "Q = np.zeros((rows * cols, 4))",
  "returns = []",
  "",
  "for episode in range(100):",
  "    s = start",
  "    ret = 0.0",
  "    for t in range(50):",
  "        if rng.random() < epsilon:",
  "            a = int(rng.integers(4))",
  "        else:",
  "            a = int(np.argmax(Q[s]))",
  "        s2, r, done = step(s, a)",
  "        Q[s, a] += alpha * (r + gamma * np.max(Q[s2]) * (not done) - Q[s, a])",
  "        ret += r",
  "        s = s2",
  "        if done:",
  "            break",
  "    returns.append(ret)",
  "",
];

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "Put the pieces together: epsilon-greedy actions, the Q-learning update and many episodes. Record the return of each episode to see the agent improve, then follow its greedy policy to the goal.",
  estimatedMinutes: 18,
  sections: [
    {
      title: "What a full Q-learning run is",
      blocks: [
        {
          kind: "text",
          text: "Q-learning repeats episodes. In every step the agent picks an action with epsilon-greedy, takes it, updates one entry of the Q-table, and moves on, until the episode ends or hits a step limit.",
        },
        {
          kind: "list",
          items: [
            "Start with `Q = np.zeros((states, 4))` and a seeded `rng`.",
            "Each episode: `s = start` and `ret = 0.0`.",
            "Each step: choose `a` with epsilon-greedy, call `step(s, a)`, update `Q[s, a]`, add `r` to `ret`, set `s = s2`.",
            "Stop the episode when `done` is `True` or after `max_steps` steps, then record `ret`.",
          ],
        },
      ],
    },
    {
      title: "Why record the return of each episode",
      blocks: [
        {
          kind: "text",
          text: "The return of an episode is the sum of its rewards, `ret`. Plotted per episode it is a learning curve: if the agent learns, the curve goes up.",
        },
        {
          kind: "text",
          text: "The curve is noisy, because exploration still sends the agent the wrong way now and then. Compare averages over many episodes, such as the first 20 and the last 20, instead of single episodes.",
        },
      ],
    },
    {
      title: "Learning to reach the goal on a 4 x 4 grid",
      blocks: [
        {
          kind: "text",
          text: "The grid has 16 states, the start in the top-left corner (state 0), the goal in the bottom-right corner (state 15, +1) and a pit at row 1, column 1 (state 5, -1). Every other step costs `-0.1`, so shorter paths have higher returns; the best one has 6 steps and a return of `0.5`.",
        },
        {
          kind: "code",
          code: [
            ...GRID,
            ...TRAIN,
            "print(len(returns))",
            "print(np.round(np.array(returns).reshape(5, 20).mean(axis=1), 2).tolist())",
            "print(round(max(returns), 2))",
          ].join("\n"),
          output: ["100", "[-0.73, 0.26, 0.45, 0.39, 0.46]", "0.5"].join("\n"),
        },
        {
          kind: "text",
          text: "The average return per block of 20 episodes rises from `-0.73`, when the agent mostly wanders or falls into the pit, to about `0.4`. It stays below `0.5` because one step in ten is still random.",
        },
      ],
    },
    {
      title: "Following the learned policy",
      blocks: [
        {
          kind: "text",
          text: "After training, act greedily with no exploration: in every state take `np.argmax(Q[s])`. Printing the greedy action of each cell as an arrow shows the whole policy.",
        },
        {
          kind: "code",
          code: [
            ...GRID,
            ...TRAIN,
            "s = start",
            "path = [s]",
            "for t in range(12):",
            "    s, r, done = step(s, int(np.argmax(Q[s])))",
            "    path.append(s)",
            "    if done:",
            "        break",
            "print(path)",
            "",
            'arrows = np.array(["^", ">", "v", "<"])[Q.argmax(axis=1)]',
            'arrows[goal], arrows[pit] = "G", "X"',
            "for row in arrows.reshape(rows, cols):",
            '    print(" ".join(row))',
          ].join("\n"),
          output: ["[0, 1, 2, 6, 7, 11, 15]", "> > v <", "v X > v", "> v > v", "> > > G"].join("\n"),
        },
        {
          kind: "text",
          text: "The greedy path takes 6 steps, the shortest possible, and goes around the pit. The agent was never told the rules of the grid: it learned this from rewards alone.",
        },
        {
          kind: "note",
          text: "A state the agent never visited keeps a row of zeros, and its arrow is `^`, the first action. The table is only as good as the experience behind it.",
        },
      ],
    },
    {
      title: "Try it: train the agent",
      blocks: [
        {
          kind: "text",
          text: "Train for some episodes and step through them: the return per episode is the learning curve, and `V_grid` shows each cell's best value spreading back from the goal. Try `epsilon` 0 and a small `alpha`.",
        },
        {
          kind: "playground",
          demo: {
            title: "Q-learning on the 4 x 4 grid",
            controls: [
              { type: "number", name: "e", label: "epsilon × 100", min: 0, max: 50, initial: 10 },
              {
                type: "select",
                name: "alpha",
                label: "alpha",
                options: [
                  { label: "0.5", value: "0.5" },
                  { label: "0.1", value: "0.1" },
                  { label: "0.9", value: "0.9" },
                ],
              },
              { type: "number", name: "tens", label: "Episodes × 10", min: 1, max: 30, initial: 10 },
            ],
            template: [
              ...GRID,
              "",
              "alpha, gamma, epsilon = {{alpha}}, 0.9, {{e}} / 100",
              "rng = np.random.default_rng(0)",
              "Q = np.zeros((rows * cols, 4))",
              "",
              "def run_episode():",
              "    s = start",
              "    ret = 0.0",
              "    for t in range(50):",
              "        if rng.random() < epsilon:",
              "            a = int(rng.integers(4))",
              "        else:",
              "            a = int(np.argmax(Q[s]))",
              "        s2, r, done = step(s, a)",
              "        Q[s, a] += alpha * (r + gamma * np.max(Q[s2]) * (not done) - Q[s, a])",
              "        ret += r",
              "        s = s2",
              "        if done:",
              "            break",
              "    return ret",
              "",
              "for episode in range({{tens}} * 10):",
              "    ret = run_episode()",
              "    V_grid = Q.max(axis=1).reshape(rows, cols)",
            ].join("\n"),
            chart: {
              kind: "heatmap",
              matrix: "V_grid",
              rowLabels: ["row 0", "row 1", "row 2", "row 3"],
              colLabels: ["col 0", "col 1", "col 2", "col 3"],
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
            "Q-learning = epsilon-greedy actions + the update, repeated over many episodes.",
            "The return per episode is the learning curve; compare averages, since single episodes are noisy.",
            "Exploration keeps the training returns below the best possible return.",
            "After training, `np.argmax(Q[s])` in each state is the learned policy.",
            "States the agent never visited keep values of zero.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "q-learning-04-q1",
      question: "Where should `returns.append(ret)` go in the training loop?",
      options: [
        "Inside the step loop, after every step",
        "After the step loop, once per episode",
        "Before the episode loop",
        "Only when the agent reaches the goal",
      ],
      answer: 1,
      explanation: "`ret` sums the rewards of a whole episode, so it is recorded once the episode ends, however it ends.",
    },
    {
      id: "q-learning-04-q2",
      question: "With `epsilon = 0.1`, the late training returns average `0.4` while the best path is worth `0.5`. Why?",
      options: [
        "The Q-table is wrong",
        "Random exploratory steps still make some episodes longer or end in the pit",
        "The learning rate is too large",
        "The returns are discounted",
      ],
      answer: 1,
      explanation: "During training the agent still explores; acting greedily afterwards follows the 6-step path.",
    },
    {
      id: "q-learning-04-q3",
      question: "How do you read the learned policy from a Q-table?",
      options: ["Q.max(axis=1)", "Q.argmax(axis=1)", "Q.argmax(axis=0)", "Q.sum(axis=1)"],
      answer: 1,
      explanation: "The policy is the best action of each state: the index of the largest value in each row.",
    },
  ],
};
