import type { Exercise } from "@/features/validation/types";

import { gridLines } from "./grid";

/** Shared setup for Exercise 56: a 2 x 2 grid's Q-table, states to act in, a seeded rng. */
const CHOICE_PRELUDE = [
  "import numpy as np",
  "# Q-table of a 2 x 2 grid: 4 states, actions 0 up, 1 right, 2 down, 3 left. State 3 is the goal.",
  "Q = np.array([",
  "    [0.1, 0.5, 0.3, 0.0],",
  "    [0.2, 0.1, 0.9, 0.4],",
  "    [0.6, 0.8, 0.2, 0.1],",
  "    [0.0, 0.0, 0.0, 0.0],",
  "])",
  "states = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0]",
  "epsilon = 0.3",
  "rng = np.random.default_rng(0)",
].join("\n");

/** Hidden setup for Exercise 56: another table, states, epsilon and seed. */
const CHOICE_HIDDEN = [
  "import numpy as np",
  "Q = np.array([",
  "    [0.0, 0.2, 0.7, 0.1],",
  "    [0.3, 0.0, 0.1, 0.6],",
  "    [0.9, 0.2, 0.4, 0.3],",
  "    [0.1, 0.0, 0.5, 0.2],",
  "    [0.2, 0.4, 0.1, 0.8],",
  "    [0.0, 0.0, 0.0, 0.0],",
  "])",
  "states = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1]",
  "epsilon = 0.5",
  "rng = np.random.default_rng(5)",
].join("\n");

const CHOICE_CALLS = "actions = np.array([epsilon_greedy(Q, s, epsilon, rng) for s in states])";

const CHOICE_SOLUTION = [
  "def epsilon_greedy(Q, s, epsilon, rng):",
  "    if rng.random() < epsilon:",
  "        return int(rng.integers(4))",
  "    return int(np.argmax(Q[s]))",
  "",
  CHOICE_CALLS,
].join("\n");

/** Shared setup for Exercise 57: an empty table for a 2 x 2 grid and the transitions to learn from. */
const UPDATE_PRELUDE = [
  "import numpy as np",
  "# A 2 x 2 grid: states 0, 1, 2 and the goal 3. Reaching the goal gives 1.0, other steps 0.0.",
  "Q = np.zeros((4, 4))",
  "alpha, gamma = 0.5, 0.9",
  "# Transitions (s, a, r, s2, done) the agent lived through, in order.",
  "transitions = [",
  "    (0, 1, 0.0, 1, False),  # right: 0 -> 1",
  "    (1, 2, 1.0, 3, True),   # down: 1 -> 3, the goal",
  "    (0, 1, 0.0, 1, False),",
  "    (1, 2, 1.0, 3, True),",
  "    (0, 2, 0.0, 2, False),  # down: 0 -> 2",
  "    (2, 1, 1.0, 3, True),   # right: 2 -> 3, the goal",
  "    (0, 2, 0.0, 2, False),",
  "]",
].join("\n");

/** Hidden setup for Exercise 57: a 2 x 3 grid (goal 5), a wall bump, other alpha and gamma. */
const UPDATE_HIDDEN = [
  "import numpy as np",
  "Q = np.zeros((6, 4))",
  "alpha, gamma = 0.3, 0.8",
  "transitions = [",
  "    (0, 1, 0.0, 1, False),",
  "    (1, 1, 0.0, 2, False),",
  "    (2, 2, 1.0, 5, True),",
  "    (0, 0, 0.0, 0, False),",
  "    (0, 1, 0.0, 1, False),",
  "    (1, 1, 0.0, 2, False),",
  "    (2, 2, 1.0, 5, True),",
  "    (1, 2, 0.0, 4, False),",
  "    (4, 1, 1.0, 5, True),",
  "    (1, 2, 0.0, 4, False),",
  "    (0, 1, 0.0, 1, False),",
  "]",
].join("\n");

/** Exercise 57's loop with the next state's row as a placeholder: the bug is only there. */
const updateLoop = (row: string) =>
  [
    "for s, a, r, s2, done in transitions:",
    `    target = r + gamma * np.max(Q[${row}]) * (not done)`,
    "    Q[s, a] += alpha * (target - Q[s, a])",
    "",
    "print(np.round(Q, 3))",
  ].join("\n");

/** Shared setup for Exercise 58: the 4 x 4 grid, a greedy-path helper and the settings. */
const trainPrelude = (start: number, goal: number, pit: number, epsilon: string, seed: number) =>
  [
    ...gridLines(start, goal, pit),
    "",
    "def greedy_path(Q, max_len=12):",
    '    """The states visited by taking np.argmax(Q[s]) from start, until the episode ends."""',
    "    s = start",
    "    path = [s]",
    "    for t in range(max_len):",
    "        s, r, done = step(s, int(np.argmax(Q[s])))",
    "        path.append(s)",
    "        if done:",
    "            break",
    "    return path",
    "",
    `alpha, gamma, epsilon = 0.5, 0.9, ${epsilon}`,
    "episodes, max_steps = 100, 50",
    `rng = np.random.default_rng(${seed})`,
  ].join("\n");

const TRAIN_PRELUDE = trainPrelude(0, 15, 5, "0.1", 0);
/** Hidden setup for Exercise 58: start top right, goal bottom left, another pit, epsilon and seed. */
const TRAIN_HIDDEN = trainPrelude(3, 12, 9, "0.2", 2);

const TRAIN_STEP = [
  "        s2, r, done = step(s, a)",
  "        # 1. Update Q[s, a] towards r + gamma * np.max(Q[s2]) * (not done), scaled by alpha.",
  "        # 2. Add r to ret and move to s2.",
  "        # 3. Stop this episode when done is True.",
  "    # 4. Append ret to returns.",
].join("\n");

const TRAIN_STEP_SOLVED = [
  "        s2, r, done = step(s, a)",
  "        Q[s, a] += alpha * (r + gamma * np.max(Q[s2]) * (not done) - Q[s, a])",
  "        ret += r",
  "        s = s2",
  "        if done:",
  "            break",
  "    returns.append(ret)",
].join("\n");

const TRAIN_STARTER = [
  "Q = np.zeros((rows * cols, 4))",
  "returns = []",
  "",
  "for episode in range(episodes):",
  "    s = start",
  "    ret = 0.0",
  "    for t in range(max_steps):",
  "        if rng.random() < epsilon:",
  "            a = int(rng.integers(4))",
  "        else:",
  "            a = int(np.argmax(Q[s]))",
  TRAIN_STEP,
  "    V_grid = Q.max(axis=1).reshape(rows, cols)",
  "",
  "print(greedy_path(Q))",
].join("\n");

const TRAIN_SOLUTION = TRAIN_STARTER.replace(TRAIN_STEP, TRAIN_STEP_SOLVED);

/** Exercises of Module 4.3 (R6 brief): two builds and one bug hunt. */
export const Q_LEARNING_EXERCISES: readonly Exercise[] = [
  {
    id: "ex56",
    lessonId: "02",
    title: "Epsilon-greedy choices",
    objective: "Write an epsilon-greedy action choice that explores with probability epsilon and is repeatable with a seeded rng.",
    problem:
      "Q, the list states, epsilon and a seeded rng are given above the editor. Complete epsilon_greedy(Q, s, epsilon, rng): draw rng.random(); if it is below epsilon, return a random action rng.integers(4), otherwise the greedy action np.argmax(Q[s]). The last line already builds actions, one choice per state in states.",
    starterCode: [
      "def epsilon_greedy(Q, s, epsilon, rng):",
      "    # With probability epsilon: a random action, rng.integers(4).",
      "    # Otherwise: the greedy action, np.argmax(Q[s]).",
      "    return 0",
      "",
      CHOICE_CALLS,
      "print(actions)",
    ].join("\n"),
    prelude: CHOICE_PRELUDE,
    hint: "Draw exactly one rng.random() per choice, and call rng.integers(4) only when exploring: if rng.random() < epsilon: return int(rng.integers(4)), then return int(np.argmax(Q[s])).",
    runs: [
      { prelude: CHOICE_PRELUDE, reference: `${CHOICE_PRELUDE}\n${CHOICE_SOLUTION}` },
      { prelude: CHOICE_HIDDEN, reference: `${CHOICE_HIDDEN}\n${CHOICE_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "actions", expression: "actions" },
      {
        kind: "assert",
        expression: "all(epsilon_greedy(Q, s, 0.0, rng) == np.argmax(Q[s]) for s in states)",
        message: "With epsilon = 0 every choice should be the greedy action np.argmax(Q[s]).",
      },
    ],
    solution: CHOICE_SOLUTION,
  },
  {
    id: "ex57",
    lessonId: "03",
    type: "bug-hunt",
    title: "Bug hunt: the values do not flow back",
    objective: "Fix the Q-learning update so that the goal's reward reaches the states before it.",
    problem:
      "This loop applies the Q-learning update to each transition in order. Moves into the goal get their value, but moving right or down from state 0 stays at 0.0, although those moves lead next to the goal. One part of the target is wrong; find it and fix it.",
    starterCode: updateLoop("s"),
    prelude: UPDATE_PRELUDE,
    hint: "The future value should come from the state the agent arrives in, not the one it left: np.max(Q[s2]).",
    chart: {
      kind: "heatmap",
      matrix: "Q",
      rowLabels: ["state 0", "state 1", "state 2", "3 (goal)"],
      colLabels: ["up", "right", "down", "left"],
    },
    runs: [
      { prelude: UPDATE_PRELUDE, reference: `${UPDATE_PRELUDE}\n${updateLoop("s2")}` },
      { prelude: UPDATE_HIDDEN, reference: `${UPDATE_HIDDEN}\n${updateLoop("s2")}` },
    ],
    checks: [{ kind: "result", name: "Q", expression: "Q", tolerance: 0.0001 }],
    solution: updateLoop("s2"),
  },
  {
    id: "ex58",
    lessonId: "04",
    title: "Learn to reach the goal",
    objective: "Complete a Q-learning loop that records the return of every episode and learns a greedy policy that reaches the goal.",
    problem:
      "The 4 x 4 grid, step, the settings and a seeded rng are given above the editor, with greedy_path(Q) to follow np.argmax(Q[s]) from start. The loop already chooses actions with epsilon-greedy. Inside it, update Q[s, a], add r to ret, move to s2 and stop when done; after each episode append ret to returns.",
    starterCode: TRAIN_STARTER,
    prelude: TRAIN_PRELUDE,
    hint: "After step: Q[s, a] += alpha * (r + gamma * np.max(Q[s2]) * (not done) - Q[s, a]), then ret += r, s = s2 and if done: break. After the step loop, at the episode's indentation: returns.append(ret).",
    chart: {
      kind: "heatmap",
      matrix: "V_grid",
      rowLabels: ["row 0", "row 1", "row 2", "row 3"],
      colLabels: ["col 0", "col 1", "col 2", "col 3"],
    },
    runs: [
      { prelude: TRAIN_PRELUDE, reference: `${TRAIN_PRELUDE}\n${TRAIN_SOLUTION}` },
      { prelude: TRAIN_HIDDEN, reference: `${TRAIN_HIDDEN}\n${TRAIN_SOLUTION}` },
    ],
    checks: [
      {
        kind: "assert",
        expression: "len(returns) == episodes",
        message: "returns should hold one return per episode: append ret after the step loop, once per episode.",
      },
      {
        kind: "assert",
        expression: "greedy_path(Q)[-1] == goal",
        message: "Taking np.argmax(Q[s]) from start should reach the goal within 12 steps. Print greedy_path(Q) to see where it goes.",
      },
      {
        kind: "assert",
        expression: "np.mean(returns[-20:]) > np.mean(returns[:20])",
        message: "The last 20 returns should average more than the first 20: the agent should improve.",
      },
      { kind: "result", name: "Q", expression: "Q", tolerance: 0.001 },
    ],
    solution: TRAIN_SOLUTION,
  },
];
