/**
 * Python setup of the grid world used across Module 4.2, the convention of Module 4.1: states
 * `s = row * cols + col`, actions 0 up, 1 right, 2 down, 3 left, the grid edge keeps the agent
 * in place, reaching the goal gives +1 and the pit -1, and both end the episode.
 *
 * @param options.size - `rows, cols` as Python source.
 * @param options.goalPit - `goal, pit` as Python source; a pit of `-1` means no pit.
 * @param options.gamma - The discount as Python source.
 * @returns Standalone Python that defines `rows`, `cols`, `goal`, `pit`, `gamma`, `moves` and `step`.
 */
export function gridCode({ size = "3, 4", goalPit = "3, 7", gamma = "0.9" } = {}): string {
  return [
    "import numpy as np",
    `rows, cols = ${size}`,
    `goal, pit = ${goalPit}`,
    `gamma = ${gamma}`,
    "moves = np.array([[-1, 0], [0, 1], [1, 0], [0, -1]])",
    "",
    "def step(state, action):",
    "    row, col = divmod(state, cols)",
    "    r = min(max(row + moves[action, 0], 0), rows - 1)",
    "    c = min(max(col + moves[action, 1], 0), cols - 1)",
    "    next_state = int(r * cols + c)",
    "    if next_state == goal:",
    "        return next_state, 1.0, True",
    "    if next_state == pit:",
    "        return next_state, -1.0, True",
    "    return next_state, 0.0, False",
  ].join("\n");
}

/** The 3 × 4 grid of the lessons: goal top right (state 3), pit below it (state 7), gamma 0.9. */
export const GRID = gridCode();

/** Value iteration on the grid in scope, as taught in lesson 03; assigns `V`, `V_grid`, `delta`, `sweeps`. */
export const VALUE_ITERATION = [
  "V = np.zeros(rows * cols)",
  "sweeps = 0",
  "delta = 1.0",
  "while delta >= tol:",
  "    V_new = V.copy()",
  "    for s in range(rows * cols):",
  "        if s == goal or s == pit:",
  "            continue",
  "        q = np.zeros(4)",
  "        for a in range(4):",
  "            next_state, reward, done = step(s, a)",
  "            q[a] = reward + gamma * V[next_state]",
  "        V_new[s] = q.max()",
  "    delta = np.max(np.abs(V_new - V))",
  "    V = V_new",
  "    V_grid = V.reshape(rows, cols)",
  "    sweeps += 1",
].join("\n");

/** The greedy policy of lesson 04 from the `V` in scope; terminal states get `-1`. */
export const GREEDY_POLICY = [
  "policy = np.full(rows * cols, -1)",
  "for s in range(rows * cols):",
  "    if s == goal or s == pit:",
  "        continue",
  "    q = np.zeros(4)",
  "    for a in range(4):",
  "        next_state, reward, done = step(s, a)",
  "        q[a] = reward + gamma * V[next_state]",
  "    policy[s] = np.argmax(q)",
].join("\n");

/** Prints `policy` as a grid of arrows, `*` for terminal states (index `-1` is the last character). */
export const PRINT_ARROWS = [
  'arrows = np.array(list("↑→↓←*"))',
  'print("\\n".join("".join(row) for row in arrows[policy].reshape(rows, cols)))',
].join("\n");
