import type { Exercise } from "@/features/validation/types";

import { GRID, GRID_LABELS, MOVES, STEP } from "./grid-world";

/** Exercise 50's setup: the lesson grid, a start state and actions that bump into walls (lesson 02). */
const STEP_PRELUDE = ["import numpy as np", GRID, MOVES, "start = 0", "actions = [0, 3, 1, 1, 2, 2, 1, 2]"].join("\n");

/** Hidden setup for Exercise 50: a 3 × 5 grid (rows ≠ cols), another start, ending in the pit. */
const STEP_HIDDEN = [
  "import numpy as np",
  "grid = np.array([",
  "    [0, 0, 0, 0, 1],",
  "    [0, 0, 0, 0, 0],",
  "    [0, 0, -1, 0, 0],",
  "])",
  MOVES,
  "start = 10",
  "actions = [3, 2, 0, 1, 1, 2]",
].join("\n");

const STEP_TODO = [
  "    # 1. Add moves[action] to row and col; keep each inside the grid with np.clip.",
  "    # 2. next_state is the number of the new cell: row * cols + col.",
  "    # 3. reward is the grid value of the new cell; done is True when it is not 0.",
  "    next_state = state",
  "    reward = 0",
  "    done = False",
].join("\n");

/** Exercise 50's code around the step body: the function, then a loop that uses it. */
const stepProgram = (body: string) =>
  [
    "def step(state, action):",
    "    row, col = divmod(state, cols)",
    body,
    "    return next_state, reward, done",
    "",
    "",
    "states = []",
    "rewards = []",
    "dones = []",
    "state = start",
    "for action in actions:",
    "    state, reward, done = step(state, action)",
    "    states.append(state)",
    "    rewards.append(reward)",
    "    dones.append(done)",
    "print(states)",
  ].join("\n");

const STEP_SOLUTION = stepProgram(
  [
    "    row = int(np.clip(row + moves[action, 0], 0, rows - 1))",
    "    col = int(np.clip(col + moves[action, 1], 0, cols - 1))",
    "    next_state = row * cols + col",
    "    reward = int(grid[row, col])",
    "    done = reward != 0",
  ].join("\n"),
);

/** Exercise 51's grid world without a grid: moves, the cell numbers and step. */
const EPISODE_WORLD = [MOVES, "cells = np.arange(rows * cols).reshape(rows, cols)", "", STEP, ""].join("\n");

/** Exercise 51's setup: the lesson grid and a seeded random policy that ends in the pit (lesson 03). */
const EPISODE_PRELUDE = [
  "import numpy as np",
  GRID,
  EPISODE_WORLD,
  "start = 0",
  "max_steps = 20",
  "rng = np.random.default_rng(0)",
].join("\n");

/** Hidden setup for Exercise 51: another grid, start and seed; this episode hits the step limit. */
const EPISODE_HIDDEN = [
  "import numpy as np",
  "grid = np.array([",
  "    [0, 0, 0, 1],",
  "    [0, 0, -1, 0],",
  "    [0, 0, 0, 0],",
  "    [-1, 0, 0, 0],",
  "])",
  EPISODE_WORLD,
  "start = 15",
  "max_steps = 20",
  "rng = np.random.default_rng(2)",
].join("\n");

const EPISODE_START = [
  "state = start",
  "rewards = []",
  "visits = np.zeros((rows, cols), dtype=int)",
  "visits = visits + (cells == state)  # the start cell counts as one visit",
  "",
  "for t in range(max_steps):",
  "    action = int(rng.integers(4))",
].join("\n");

const EPISODE_STARTER = [
  EPISODE_START,
  "    # Take the action with step(state, action).",
  "    # Append the reward to rewards and add one visit to the new state's cell.",
  "    # Stop the episode when done is True.",
  "",
  "print(rewards)",
].join("\n");

const EPISODE_SOLUTION = [
  EPISODE_START,
  "    state, reward, done = step(state, action)",
  "    rewards.append(reward)",
  "    visits = visits + (cells == state)",
  "    if done:",
  "        break",
  "",
  "print(rewards)",
].join("\n");

/** Exercise 52's setup: the rewards of an episode that reaches the goal, and gamma (lesson 04). */
const RETURN_PRELUDE = ["rewards = [0, 0, 0, 0, 0, 1]", "gamma = 0.9"].join("\n");

/** Hidden setup for Exercise 52: rewards of both signs, another gamma. */
const RETURN_HIDDEN = ["rewards = [0, 1, 0, -1, 0, 0, 1]", "gamma = 0.5"].join("\n");

const RETURN_START = ["G = 0.0", "returns = []", ""].join("\n");

const RETURN_SOLUTION = [
  RETURN_START,
  "for r in reversed(rewards):",
  "    G = r + gamma * G",
  "    returns.append(G)",
  "returns.reverse()",
  "print(G, returns)",
].join("\n");

/** Exercises of Module 4.1 (R6 brief): three builds. */
export const RL_BASICS_EXERCISES: readonly Exercise[] = [
  {
    id: "ex50",
    lessonId: "02",
    title: "The step function",
    objective: "Write the grid world's step: move by an action, stop at the walls, and report the reward and whether the episode is done.",
    problem:
      "grid, rows, cols, moves, start and actions are given above the editor. Complete step(state, action) so it returns (next_state, reward, done): move one cell by moves[action], keep the row and column inside the grid with np.clip, number the new cell row * cols + col, take its reward from grid, and set done to True when that reward is not 0. The loop below it then records states, rewards and dones for the actions.",
    starterCode: stepProgram(STEP_TODO),
    prelude: STEP_PRELUDE,
    hint: "row = int(np.clip(row + moves[action, 0], 0, rows - 1)), the same for col with moves[action, 1] and cols - 1; then next_state = row * cols + col, reward = int(grid[row, col]) and done = reward != 0.",
    runs: [
      { prelude: STEP_PRELUDE, reference: `${STEP_PRELUDE}\n${STEP_SOLUTION}` },
      { prelude: STEP_HIDDEN, reference: `${STEP_HIDDEN}\n${STEP_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "states", expression: "states" },
      { kind: "result", name: "rewards", expression: "rewards" },
      { kind: "result", name: "dones", expression: "dones" },
      { kind: "unchanged", name: "grid", expression: "grid" },
    ],
    solution: STEP_SOLUTION,
  },
  {
    id: "ex51",
    lessonId: "03",
    title: "Run one episode",
    objective: "Run a seeded random episode until it is done or reaches the step limit, recording the rewards and the visits to each cell.",
    problem:
      "The grid, step, cells, start, max_steps and a seeded rng are given above the editor, and the loop already picks each action with rng.integers(4). Inside the loop, call step, append the reward to rewards, add one visit to the new state's cell in visits, and stop as soon as done is True. Leave state as the agent's last state.",
    starterCode: EPISODE_STARTER,
    prelude: EPISODE_PRELUDE,
    hint: "state, reward, done = step(state, action), then rewards.append(reward) and visits = visits + (cells == state); finish with if done: break. Do not draw other random numbers, or the actions change.",
    chart: { kind: "heatmap", matrix: "visits", ...GRID_LABELS },
    runs: [
      { prelude: EPISODE_PRELUDE, reference: `${EPISODE_PRELUDE}\n${EPISODE_SOLUTION}` },
      { prelude: EPISODE_HIDDEN, reference: `${EPISODE_HIDDEN}\n${EPISODE_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "rewards", expression: "rewards" },
      { kind: "result", name: "visits", expression: "visits" },
      { kind: "result", name: "state", expression: "state" },
      {
        kind: "assert",
        expression: "int(visits.sum()) == len(rewards) + 1",
        message: "visits should count the start cell once and the new cell after every step.",
      },
      {
        kind: "assert",
        expression: "len(rewards) <= max_steps",
        message: "The episode must stop after at most max_steps steps.",
      },
    ],
    solution: EPISODE_SOLUTION,
  },
  {
    id: "ex52",
    lessonId: "04",
    title: "Discounted returns",
    objective: "Compute the return from every step of an episode with G = r + gamma * G, and the return of the whole episode.",
    problem:
      "rewards (one per step) and the discount factor gamma are given above the editor. Build returns, where returns[t] is the discounted return from step t to the end, in time order. Leave G as the return of the whole episode, which equals returns[0]. Do not change rewards.",
    starterCode: [
      RETURN_START,
      "# Walk through the rewards from the last one to the first.",
      "# At each reward r: G = r + gamma * G, then record G in returns.",
      "# Finally put returns in time order, so returns[0] is the return of the whole episode.",
      "",
      "print(G, returns)",
    ].join("\n"),
    prelude: RETURN_PRELUDE,
    hint: "for r in reversed(rewards): G = r + gamma * G, then returns.append(G). After the loop, returns.reverse() puts the list in time order.",
    runs: [
      { prelude: RETURN_PRELUDE, reference: `${RETURN_PRELUDE}\n${RETURN_SOLUTION}` },
      { prelude: RETURN_HIDDEN, reference: `${RETURN_HIDDEN}\n${RETURN_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "returns", expression: "returns", tolerance: 1e-6 },
      { kind: "result", name: "G", expression: "G", tolerance: 1e-6 },
      { kind: "unchanged", name: "rewards", expression: "rewards" },
    ],
    solution: RETURN_SOLUTION,
  },
];
