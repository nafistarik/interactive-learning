import type { HeatmapChartSpec } from "@/features/visualization/charts";

/**
 * Python source of the module's two grid worlds, in pieces that lessons and exercises combine.
 * Both follow the Phase 4 convention: 2 rows × 4 columns, `s = row * cols + col`, actions
 * 0 = up, 1 = right, 2 = down, 3 = left, walls keep the agent in place, deterministic moves,
 * `step(state, action) -> (next_state, reward, done)`.
 */

/** The moves and the wall rule shared by both worlds. */
const MOVES = [
  "moves = np.array([[-1, 0], [0, 1], [1, 0], [0, -1]])",
  "",
  "def step(state, action):",
  "    row = state // cols + moves[action, 0]",
  "    col = state % cols + moves[action, 1]",
  "    if 0 <= row < rows and 0 <= col < cols:",
  "        state = int(row * cols + col)",
];

/** Goal and pit (lesson 01, Exercise 59): +1 at the goal, -1 in the pit, -0.1 per other move. */
export const GOAL_PIT_WORLD = [
  "import numpy as np",
  "rows, cols = 2, 4",
  "start, goal, pit = 4, 3, 6",
  ...MOVES,
  "    if state == goal:",
  "        return state, 1.0, True",
  "    if state == pit:",
  "        return state, -1.0, True",
  "    return state, -0.1, False",
].join("\n");

/** Two exits (lessons 02–03): a near exit worth 0.5 one move away, a far one worth 1.0 three moves away. */
export const TWO_EXITS_WORLD = [
  "import numpy as np",
  "rows, cols = 2, 4",
  "start, near, far = 4, 0, 7",
  ...MOVES,
  "    if state == near:",
  "        return state, 0.5, True",
  "    if state == far:",
  "        return state, 1.0, True",
  "    return state, 0.0, False",
].join("\n");

/** Q-learning with epsilon-greedy as one function: the returns per episode and the final Q-table. */
export const TRAIN_FUNCTION = [
  "def train(schedule, alpha=0.5, gamma=0.9, episodes=300, seed=0):",
  "    rng = np.random.default_rng(seed)",
  "    Q = np.zeros((rows * cols, 4))",
  "    returns = []",
  "    for episode in range(episodes):",
  "        eps = schedule(episode)",
  "        state, ret = start, 0.0",
  "        for t in range(20):",
  "            if rng.random() < eps:",
  "                action = int(rng.integers(4))",
  "            else:",
  "                action = int(np.argmax(Q[state]))",
  "            next_state, reward, done = step(state, action)",
  "            target = reward if done else reward + gamma * np.max(Q[next_state])",
  "            Q[state, action] += alpha * (target - Q[state, action])",
  "            state, ret = next_state, ret + reward",
  "            if done:",
  "                break",
  "        returns.append(ret)",
  "    return np.array(returns), Q",
].join("\n");

/**
 * The same training as a top-level loop, for playgrounds: the loop records `eps`, `ret` and
 * `V` (the best Q-value of each cell, laid out as the grid) at every episode.
 *
 * @param eps - Python for this episode's epsilon (may use `episode`).
 * @returns The loop's source.
 */
export const trainingLoop = (eps: string) =>
  [
    "Q = np.zeros((rows * cols, 4))",
    "for episode in range(300):",
    `    eps = ${eps}`,
    "    state, ret = start, 0.0",
    "    for t in range(20):",
    "        if rng.random() < eps:",
    "            action = int(rng.integers(4))",
    "        else:",
    "            action = int(np.argmax(Q[state]))",
    "        next_state, reward, done = step(state, action)",
    "        target = reward if done else reward + gamma * np.max(Q[next_state])",
    "        Q[state, action] += alpha * (target - Q[state, action])",
    "        state, ret = next_state, ret + reward",
    "        if done:",
    "            break",
    "    V = np.max(Q, axis=1).reshape(rows, cols)",
  ].join("\n");

/** Heatmap of `V` on the 2 × 4 grid. */
export const GRID_HEATMAP: HeatmapChartSpec = {
  kind: "heatmap",
  matrix: "V",
  rowLabels: ["row 0", "row 1"],
  colLabels: ["col 0", "col 1", "col 2", "col 3"],
};
