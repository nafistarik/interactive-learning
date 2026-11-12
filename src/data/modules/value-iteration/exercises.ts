import type { Exercise } from "@/features/validation/types";

import { GREEDY_POLICY, GRID, gridCode, VALUE_ITERATION } from "./grid";

/** A 4 × 4 grid for the hidden runs: goal bottom left (12), pit above-right of it (9), gamma 0.8. */
const HIDDEN_GRID = gridCode({ size: "4, 4", goalPit: "12, 9", gamma: "0.8" });

/** Exercise 53 (lesson 02): the lesson grid after two sweeps; the learner computes the third. */
const SWEEP_PRELUDE = [GRID, "V = np.array([0, 0.9, 1, 0, 0, 0, 0.9, 0, 0, 0, 0, 0])"].join("\n");

/** Hidden setup for Exercise 53: another grid and values that are not from any sweep. */
const SWEEP_HIDDEN = [
  HIDDEN_GRID,
  "V = np.array([0.2, 0.3, 0.1, 0.4, 0.5, 0.6, 0.3, 0.6, 0.1, 0, 0.7, 0.8, 0, 0.4, 0.9, 0.2])",
].join("\n");

const SWEEP_STARTER = [
  "V_new = V.copy()",
  "for s in range(rows * cols):",
  "    if s == goal or s == pit:",
  "        continue",
  "    # Fill an array q with the 4 action values: reward + gamma * V[next_state],",
  "    # where next_state and reward come from step(s, a).",
  "    # Then store the largest action value in V_new[s].",
  "    V_grid = V_new.reshape(rows, cols)",
  "",
  "print(np.round(V_grid, 3))",
].join("\n");

const SWEEP_SOLUTION = SWEEP_STARTER.replace(
  [
    "    # Fill an array q with the 4 action values: reward + gamma * V[next_state],",
    "    # where next_state and reward come from step(s, a).",
    "    # Then store the largest action value in V_new[s].",
  ].join("\n"),
  [
    "    q = np.zeros(4)",
    "    for a in range(4):",
    "        next_state, reward, done = step(s, a)",
    "        q[a] = reward + gamma * V[next_state]",
    "    V_new[s] = q.max()",
  ].join("\n"),
);

/** Exercise 54 (lesson 03): the lesson grid and a tolerance. */
const ITERATION_PRELUDE = [GRID, "tol = 1e-4"].join("\n");
const ITERATION_HIDDEN = [HIDDEN_GRID, "tol = 1e-4"].join("\n");

const PRINT_RESULT = ['print("sweeps:", sweeps)', "print(np.round(V_grid, 2))"].join("\n");

/** The bug of Exercise 54: the sweep also updates the goal and the pit. */
const ITERATION_STARTER = [
  VALUE_ITERATION.replace(["        if s == goal or s == pit:", "            continue", ""].join("\n"), ""),
  "",
  PRINT_RESULT,
].join("\n");

const ITERATION_SOLUTION = [VALUE_ITERATION, "", PRINT_RESULT].join("\n");

/** Exercise 55 (lesson 04): the converged values of the lesson grid. */
const POLICY_PRELUDE = [GRID, "V = np.array([0.81, 0.9, 1, 0, 0.729, 0.81, 0.9, 0, 0.6561, 0.729, 0.81, 0.729])"].join("\n");

/** Hidden setup for Exercise 55: the converged values of the hidden grid, rounded. */
const POLICY_HIDDEN = [
  HIDDEN_GRID,
  "V = np.array([0.64, 0.512, 0.4096, 0.3277, 0.8, 0.64, 0.512, 0.4096, 1, 0, 0.64, 0.512, 0, 1, 0.8, 0.64])",
].join("\n");

const POLICY_STARTER = [
  "policy = np.full(rows * cols, -1)",
  "for s in range(rows * cols):",
  "    if s == goal or s == pit:",
  "        continue",
  "    # Compute the 4 action values q[a] = reward + gamma * V[next_state] with step(s, a).",
  "    # Store the index of the largest one in policy[s].",
  "",
  "print(policy.reshape(rows, cols))",
].join("\n");

const POLICY_SOLUTION = [GREEDY_POLICY, "", "print(policy.reshape(rows, cols))"].join("\n");

/** Exercises of Module 4.2 (R6 brief): two builds and one bug hunt. */
export const VALUE_ITERATION_EXERCISES: readonly Exercise[] = [
  {
    id: "ex53",
    lessonId: "02",
    title: "One Bellman sweep",
    objective: "Apply the Bellman update to every state that is not terminal, reading V and writing V_new.",
    problem:
      "The grid, gamma, step(state, action) and the values V after two sweeps are given above the editor. Complete one sweep: for each state that is not the goal or the pit, set V_new[s] to the largest of the four action values reward + gamma * V[next_state]. Leave V itself unchanged.",
    starterCode: SWEEP_STARTER,
    prelude: SWEEP_PRELUDE,
    hint: "Inside the loop: q = np.zeros(4), then for a in range(4): next_state, reward, done = step(s, a) and q[a] = reward + gamma * V[next_state]. Finally V_new[s] = q.max().",
    chart: { kind: "heatmap", matrix: "V_grid" },
    runs: [
      { prelude: SWEEP_PRELUDE, reference: `${SWEEP_PRELUDE}\n${SWEEP_SOLUTION}` },
      { prelude: SWEEP_HIDDEN, reference: `${SWEEP_HIDDEN}\n${SWEEP_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "V_new", expression: "V_new", tolerance: 1e-6 },
      { kind: "unchanged", name: "V", expression: "V" },
    ],
    solution: SWEEP_SOLUTION,
  },
  {
    id: "ex54",
    lessonId: "03",
    type: "bug-hunt",
    title: "Bug hunt: values above the reward",
    objective: "Fix the value iteration loop so that the goal and the pit keep value 0 and the values converge to the right ones.",
    problem:
      "This value iteration loop runs and stops, but the printed values are far above 1, the largest reward on this grid, and it needs many more sweeps than lesson 03. The stop test and the action values are correct. Find which states the sweep should not update and fix it.",
    starterCode: ITERATION_STARTER,
    prelude: ITERATION_PRELUDE,
    hint: "The goal and the pit are terminal: nothing happens after them, so their value must stay 0. Skip them at the top of the loop over states with if s == goal or s == pit: continue.",
    chart: { kind: "heatmap", matrix: "V_grid" },
    runs: [
      { prelude: ITERATION_PRELUDE, reference: `${ITERATION_PRELUDE}\n${VALUE_ITERATION}` },
      { prelude: ITERATION_HIDDEN, reference: `${ITERATION_HIDDEN}\n${VALUE_ITERATION}` },
    ],
    checks: [
      { kind: "result", name: "V", expression: "V", tolerance: 0.001 },
      {
        kind: "assert",
        expression: "delta < tol",
        message: "The loop should stop only when delta, the largest change of the last sweep, is below tol.",
      },
    ],
    solution: ITERATION_SOLUTION,
  },
  {
    id: "ex55",
    lessonId: "04",
    title: "The greedy policy",
    objective: "Build the greedy policy from converged values: in each state, the action with the best one-step lookahead.",
    problem:
      "The grid, gamma, step(state, action) and the converged values V are given above the editor. Fill policy with one action per state: for each state that is not the goal or the pit, the action a with the largest reward + gamma * V[next_state], chosen with np.argmax (on a tie, the lowest action number). Leave -1 for the goal and the pit.",
    starterCode: POLICY_STARTER,
    prelude: POLICY_PRELUDE,
    hint: "Inside the loop: q = np.zeros(4), then for a in range(4): next_state, reward, done = step(s, a) and q[a] = reward + gamma * V[next_state]. Finally policy[s] = np.argmax(q).",
    runs: [
      { prelude: POLICY_PRELUDE, reference: `${POLICY_PRELUDE}\n${GREEDY_POLICY}` },
      { prelude: POLICY_HIDDEN, reference: `${POLICY_HIDDEN}\n${GREEDY_POLICY}` },
    ],
    checks: [
      { kind: "result", name: "policy", expression: "policy" },
      { kind: "unchanged", name: "V", expression: "V" },
    ],
    solution: POLICY_SOLUTION,
  },
];
