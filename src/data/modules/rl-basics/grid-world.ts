/**
 * The grid world of Phase 4, as Python source shared by the lessons and exercises of this
 * module: rewards in a 2D array, states numbered `row * cols + col`, actions 0–3 = up, right,
 * down, left, walls clip the move, and a cell with a non-zero reward ends the episode.
 */

/** The 4 × 4 grid of the lessons: a pit (-1) at state 5 and the goal (+1) at state 15. */
export const GRID = [
  "grid = np.array([",
  "    [0, 0, 0, 0],",
  "    [0, -1, 0, 0],",
  "    [0, 0, 0, 0],",
  "    [0, 0, 0, 1],",
  "])",
].join("\n");

/** The grid's size and the four moves, run after a `grid` is defined. */
export const MOVES = [
  "rows, cols = grid.shape",
  "moves = np.array([[-1, 0], [0, 1], [1, 0], [0, -1]])  # up, right, down, left",
].join("\n");

/** The environment: one step from a state with an action. */
export const STEP = [
  "def step(state, action):",
  "    row, col = divmod(state, cols)",
  "    row = int(np.clip(row + moves[action, 0], 0, rows - 1))",
  "    col = int(np.clip(col + moves[action, 1], 0, cols - 1))",
  "    next_state = row * cols + col",
  "    reward = int(grid[row, col])",
  "    done = reward != 0",
  "    return next_state, reward, done",
].join("\n");

/** Everything a lesson example needs to run episodes in the lesson grid. */
export const GRID_WORLD = ["import numpy as np", GRID, MOVES, "", STEP].join("\n");

/** Heatmap labels for a 4 × 4 grid. */
export const GRID_LABELS = {
  rowLabels: ["r0", "r1", "r2", "r3"],
  colLabels: ["c0", "c1", "c2", "c3"],
};
