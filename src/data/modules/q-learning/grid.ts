/**
 * The 4 x 4 grid world of lesson 04 and Exercise 58, as Python lines: states
 * `s = row * cols + col`, actions 0 up, 1 right, 2 down, 3 left, walls keep the agent in
 * place, the goal gives +1 and the pit -1 (both end the episode), every other step -0.1.
 *
 * @param start - The start state.
 * @param goal - The goal state.
 * @param pit - The pit state.
 * @returns The lines, starting with `import numpy as np`.
 */
export function gridLines(start: number, goal: number, pit: number): string[] {
  return [
    "import numpy as np",
    "rows, cols = 4, 4",
    `start, goal, pit = ${start}, ${goal}, ${pit}`,
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
    "    if next_state == pit:",
    "        return next_state, -1.0, True",
    "    return next_state, -0.1, False",
  ];
}

/** The grid of lesson 04: start top left, goal bottom right, the pit at row 1, column 1. */
export const GRID = gridLines(0, 15, 5);
