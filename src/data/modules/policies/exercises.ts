import type { Exercise } from "@/features/validation/types";

import { GOAL_PIT_WORLD } from "./grid";

/** The grid convention, written out above the world in Exercise 59's preludes. */
const WORLD_COMMENTS = [
  "# Grid world: 2 rows x 4 columns, state s = row * cols + col.",
  "# Actions: 0 = up, 1 = right, 2 = down, 3 = left. A move into a wall keeps the agent in place.",
  "# Start at 4. The goal 3 gives +1 and the pit 6 gives -1; both end the episode.",
  "# Every other move gives -0.1. step(state, action) returns (next_state, reward, done).",
].join("\n");

/**
 * Exercise 59's setup: the world, a seeded noisy-greedy policy and the evaluation budget.
 *
 * @param seed - Seed of the policy's generator.
 * @param greedy - Python list of the greedy action per state.
 * @param noise - Probability of a random action.
 * @param episodes - Number of episodes.
 * @param maxSteps - Step limit per episode.
 * @returns The prelude.
 */
const evaluationPrelude = (seed: number, greedy: string, noise: number, episodes: number, maxSteps: number) =>
  [
    WORLD_COMMENTS,
    GOAL_PIT_WORLD,
    "",
    `# The policy to evaluate: the greedy action, or a random action with probability ${noise}.`,
    `rng = np.random.default_rng(${seed})`,
    `greedy = np.array(${greedy})`,
    "",
    "def policy(state):",
    `    if rng.random() < ${noise}:`,
    "        return int(rng.integers(4))",
    "    return int(greedy[state])",
    "",
    `episodes = ${episodes}`,
    `max_steps = ${maxSteps}`,
  ].join("\n");

const EVALUATE_PRELUDE = evaluationPrelude(0, "[1, 1, 1, 0, 0, 0, 0, 0]", 0.2, 200, 20);

/** Hidden setup for Exercise 59: another policy, seed and budget, so a hard-coded answer fails. */
const EVALUATE_HIDDEN = evaluationPrelude(3, "[1, 1, 1, 0, 1, 0, 0, 0]", 0.5, 150, 12);

const EVALUATE_STARTER = [
  "returns = []",
  "successes = 0",
  "",
  "for episode in range(episodes):",
  "    state = start",
  "    ret = 0.0",
  "    # Play one episode: at most max_steps steps with action = policy(state),",
  "    # adding each reward to ret and stopping as soon as done is True.",
  "",
  "    returns.append(ret)",
  "    # Count a success when the episode ended at the goal.",
  "",
  "# avg_return: the mean of returns. success_rate: the share of episodes that succeeded.",
].join("\n");

const EVALUATE_SOLUTION = [
  "returns = []",
  "successes = 0",
  "",
  "for episode in range(episodes):",
  "    state = start",
  "    ret = 0.0",
  "    for t in range(max_steps):",
  "        action = policy(state)",
  "        state, reward, done = step(state, action)",
  "        ret += reward",
  "        if done:",
  "            break",
  "    returns.append(ret)",
  "    if state == goal:",
  "        successes += 1",
  "",
  "avg_return = np.mean(returns)",
  "success_rate = successes / episodes",
].join("\n");

/** Exercise 60's setup: the length, floor and decay of the schedule. */
const schedulePrelude = (episodes: number, epsMin: number, decay: number) =>
  [
    "import numpy as np",
    "# eps for episode e is decay ** e, but never below eps_min.",
    `episodes = ${episodes}`,
    `eps_min = ${epsMin}`,
    `decay = ${decay}`,
  ].join("\n");

const SCHEDULE_PRELUDE = schedulePrelude(400, 0.05, 0.99);

/** Hidden setup for Exercise 60: a shorter, faster schedule with a higher floor. */
const SCHEDULE_HIDDEN = schedulePrelude(60, 0.1, 0.95);

const SCHEDULE_SOLUTION = [
  "episode = np.arange(episodes)",
  "eps = np.maximum(eps_min, decay ** episode)",
  "first_min = int(np.argmax(eps == eps_min))",
].join("\n");

/** Exercise 61's setup: features per state, bins per feature and actions. */
const tablePrelude = (features: string, bins: number, actions: number) =>
  [
    "import numpy as np",
    "# A robot describes its state with several measured numbers (features).",
    "# Each feature is cut into `bins` intervals, so k features give bins ** k states.",
    `n_features = np.array(${features})`,
    `bins = ${bins}`,
    `n_actions = ${actions}`,
  ].join("\n");

const TABLE_PRELUDE = tablePrelude("[1, 2, 3, 4, 5, 6]", 10, 4);

/** Hidden setup for Exercise 61: other feature counts, bins and actions. */
const TABLE_HIDDEN = tablePrelude("[1, 3, 5, 7]", 7, 3);

const TABLE_SOLUTION = [
  "n_states = bins ** n_features",
  "sizes = n_states * n_actions",
  "megabytes = sizes * 8 / 1_000_000",
].join("\n");

/** Exercises of Module 4.4 (R6 brief): three builds. */
export const POLICIES_EXERCISES: readonly Exercise[] = [
  {
    id: "ex59",
    lessonId: "01",
    title: "Evaluate a policy",
    objective: "Run a fixed policy for many seeded episodes and measure its average return and success rate.",
    problem:
      "The grid world, a policy and the budget are given above the editor. Play `episodes` episodes from `start`: in each, call `policy(state)` for the action, add every reward to `ret`, and stop at `done` or after `max_steps` steps. Then set `avg_return` to the mean return and `success_rate` to the share of episodes that ended at the goal. Use the given `policy` and do not create a new generator.",
    starterCode: EVALUATE_STARTER,
    prelude: EVALUATE_PRELUDE,
    hint: "Inside the episode loop: `for t in range(max_steps):`, then `state, reward, done = step(state, policy(state))`, `ret += reward` and `if done: break`. After it, `if state == goal: successes += 1`. At the end, `avg_return = np.mean(returns)` and `success_rate = successes / episodes`.",
    runs: [
      { prelude: EVALUATE_PRELUDE, reference: `${EVALUATE_PRELUDE}\n${EVALUATE_SOLUTION}` },
      { prelude: EVALUATE_HIDDEN, reference: `${EVALUATE_HIDDEN}\n${EVALUATE_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "avg_return", expression: "avg_return", tolerance: 0.001 },
      { kind: "result", name: "success_rate", expression: "success_rate", tolerance: 0.001 },
      {
        kind: "assert",
        expression: "len(returns) == episodes",
        message: "returns should hold one return per episode: append ret once per episode.",
      },
    ],
    solution: EVALUATE_SOLUTION,
  },
  {
    id: "ex60",
    lessonId: "02",
    title: "A decaying epsilon schedule",
    objective: "Build the epsilon of every episode at once with `np.maximum` and a power, without a loop.",
    problem:
      "`episodes`, `eps_min` and `decay` are given above the editor. Make `eps`, an array with one epsilon per episode: `decay ** e` for episode `e`, but never below `eps_min`. Then set `first_min` to the first episode whose epsilon equals `eps_min`. Use array operations, not a loop.",
    starterCode: [
      "# The episode numbers 0, 1, ..., episodes - 1",
      "episode = np.arange(episodes)",
      "",
      "# eps: decay ** episode, but never below eps_min",
      "eps = decay ** episode",
      "",
      "# first_min: the first episode where eps equals eps_min",
      "",
    ].join("\n"),
    prelude: SCHEDULE_PRELUDE,
    hint: "`np.maximum(eps_min, decay ** episode)` takes the larger value at every position. `eps == eps_min` is a boolean array, and `np.argmax` of it gives the index of its first `True`.",
    runs: [
      { prelude: SCHEDULE_PRELUDE, reference: `${SCHEDULE_PRELUDE}\n${SCHEDULE_SOLUTION}` },
      { prelude: SCHEDULE_HIDDEN, reference: `${SCHEDULE_HIDDEN}\n${SCHEDULE_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "eps", expression: "eps" },
      { kind: "result", name: "first_min", expression: "first_min" },
      { kind: "no-loop" },
    ],
    solution: SCHEDULE_SOLUTION,
  },
  {
    id: "ex61",
    lessonId: "04",
    title: "How big does the Q-table get?",
    objective: "Count states, Q-table entries and memory for growing numbers of features, without a loop.",
    problem:
      "`n_features`, `bins` and `n_actions` are given above the editor. For every number of features in `n_features`, compute `n_states`, the number of states (`bins` to that power), `sizes`, the number of entries in a Q-table with one row per state and one column per action, and `megabytes`, the memory of that table at 8 bytes per entry (1 megabyte is 1,000,000 bytes).",
    starterCode: [
      "# n_states: the number of states for each number of features",
      "# sizes: the number of entries in each Q-table",
      "# megabytes: the memory of each Q-table, at 8 bytes per entry",
      "",
    ].join("\n"),
    prelude: TABLE_PRELUDE,
    hint: "`bins ** n_features` raises `bins` to every power in the array at once. Then `sizes = n_states * n_actions` and `megabytes = sizes * 8 / 1_000_000`.",
    runs: [
      { prelude: TABLE_PRELUDE, reference: `${TABLE_PRELUDE}\n${TABLE_SOLUTION}` },
      { prelude: TABLE_HIDDEN, reference: `${TABLE_HIDDEN}\n${TABLE_SOLUTION}` },
    ],
    checks: [
      { kind: "result", name: "n_states", expression: "n_states" },
      { kind: "result", name: "sizes", expression: "sizes" },
      { kind: "result", name: "megabytes", expression: "megabytes" },
      { kind: "no-loop" },
    ],
    solution: TABLE_SOLUTION,
  },
];
