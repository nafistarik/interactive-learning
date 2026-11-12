import type { LessonContent } from "@/features/content/types";

import { GOAL_PIT_WORLD } from "../grid";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "A policy is judged by the returns it earns. Run it for many seeded episodes, average the returns and count the successes, then compare it with random play.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What a policy and its evaluation are",
      blocks: [
        {
          kind: "note",
          text: "A policy is the rule an agent uses to pick an action in every state. Evaluating a policy means running it for many episodes, without learning, and measuring what it earns.",
        },
        {
          kind: "text",
          text: "A policy can be an array with one action per state, such as the greedy policy `np.argmax(Q, axis=1)` from a Q-table. The random policy ignores the state and draws one of the 4 actions.",
        },
        {
          kind: "text",
          text: "This module uses a grid of 2 rows and 4 columns. State `s = row * cols + col`, so the top row holds states 0 to 3 and the bottom row states 4 to 7.",
        },
        {
          kind: "list",
          items: [
            "Actions: 0 = up, 1 = right, 2 = down, 3 = left, with `moves = np.array([[-1, 0], [0, 1], [1, 0], [0, -1]])`.",
            "A move into a wall keeps the agent where it is. Moves are deterministic: the same action in the same state always leads to the same cell.",
            "The agent starts in state 4. The goal, state 3, gives +1 and the pit, state 6, gives -1; both end the episode.",
            "Every other move gives -0.1, a step penalty that makes short paths better than long ones.",
            "`step(state, action)` returns `(next_state, reward, done)`.",
          ],
        },
      ],
    },
    {
      title: "Why one episode is not enough",
      blocks: [
        {
          kind: "text",
          text: "A policy that uses randomness earns a different return in every episode. Here the random policy plays 4 episodes of at most 20 steps; each line shows the episode, its length, the final state and the return.",
        },
        {
          kind: "code",
          code: [
            GOAL_PIT_WORLD,
            "",
            "rng = np.random.default_rng(0)",
            "for episode in range(4):",
            "    state, ret = start, 0.0",
            "    for t in range(20):",
            "        state, reward, done = step(state, int(rng.integers(4)))",
            "        ret += reward",
            "        if done:",
            "            break",
            "    print(episode, t + 1, state, round(ret, 1))",
          ].join("\n"),
          output: ["0 5 6 -1.4", "1 20 1 -2.0", "2 15 3 -0.4", "3 9 6 -1.8"].join("\n"),
        },
        {
          kind: "text",
          text: "Two episodes fell into the pit, one ran out of steps and one reached the goal. Any single return would give a wrong picture of the policy.",
        },
      ],
    },
    {
      title: "Average return and success rate",
      blocks: [
        {
          kind: "note",
          text: "The average return is the mean of the returns over many episodes. The success rate is the share of episodes that end at the goal, a number from 0 to 1.",
        },
        {
          kind: "text",
          text: "More episodes give a steadier average, because single lucky or unlucky episodes count for less. A step limit such as 20 keeps a policy that wanders forever from running without end.",
        },
        {
          kind: "text",
          text: "Seed the generator with `np.random.default_rng(seed)` so that the same evaluation gives the same numbers every time. Give two policies the same seed and the same number of episodes when you compare them.",
        },
      ],
    },
    {
      title: "Random play against a greedy policy",
      blocks: [
        {
          kind: "text",
          text: "This Q-table holds the best value of each action in each state, for a discount of `0.9`. The rows of the goal and the pit stay 0, because no action is taken there.",
        },
        {
          kind: "code",
          code: [
            GOAL_PIT_WORLD,
            "",
            "Q = np.array([",
            "    [0.46, 0.62, 0.31, 0.46],",
            "    [0.62, 0.80, 0.46, 0.46],",
            "    [0.80, 1.00, -1.00, 0.62],",
            "    [0.00, 0.00, 0.00, 0.00],",
            "    [0.46, 0.46, 0.31, 0.31],",
            "    [0.62, -1.00, 0.46, 0.31],",
            "    [0.00, 0.00, 0.00, 0.00],",
            "    [1.00, 0.80, 0.80, -1.00],",
            "])",
            "greedy = np.argmax(Q, axis=1)",
            "",
            "def evaluate(choose, episodes, seed):",
            "    rng = np.random.default_rng(seed)",
            "    returns, successes = [], 0",
            "    for episode in range(episodes):",
            "        state, ret = start, 0.0",
            "        for t in range(20):",
            "            state, reward, done = step(state, choose(state, rng))",
            "            ret += reward",
            "            if done:",
            "                break",
            "        returns.append(ret)",
            "        successes += state == goal",
            "    return round(float(np.mean(returns)), 3), successes / episodes",
            "",
            "print(greedy)",
            "print(evaluate(lambda state, rng: int(rng.integers(4)), 200, 0))",
            "print(evaluate(lambda state, rng: int(greedy[state]), 200, 0))",
          ].join("\n"),
          output: ["[1 1 1 0 0 0 0 0]", "(-1.676, 0.105)", "(0.7, 1.0)"].join("\n"),
        },
        {
          kind: "text",
          text: "Random play reaches the goal in about 1 episode out of 10 and loses on average. The greedy policy takes the shortest path every time: 4 moves, so `1 - 3 * 0.1 = 0.7`.",
        },
        {
          kind: "text",
          text: "`np.argmax` returns the first of equal values, so in state 4, where up and right are both worth `0.46`, the greedy policy goes up. Both paths are 4 moves long.",
        },
      ],
    },
    {
      title: "Try it: evaluate a policy",
      blocks: [
        {
          kind: "text",
          text: "Pick a policy and a number of episodes, and watch the return of each episode and the running average `avg`. Change the seed with few episodes, then with many, and compare how much the average moves.",
        },
        {
          kind: "playground",
          demo: {
            title: "Average return of a policy",
            controls: [
              {
                type: "select",
                name: "policy",
                label: "Policy",
                options: [
                  { label: "random", value: "int(rng.integers(4))" },
                  { label: "greedy", value: "int(greedy[state])" },
                  {
                    label: "greedy, random 20% of the time",
                    value: "int(rng.integers(4)) if rng.random() < 0.2 else int(greedy[state])",
                  },
                ],
              },
              { type: "number", name: "episodes", label: "Episodes", min: 10, max: 200, initial: 50 },
              { type: "number", name: "seed", label: "Seed", min: 0, max: 9, initial: 0 },
            ],
            template: [
              GOAL_PIT_WORLD,
              "",
              "greedy = np.array([1, 1, 1, 0, 0, 0, 0, 0])",
              "rng = np.random.default_rng({{seed}})",
              "returns = []",
              "for episode in range({{episodes}}):",
              "    state, ret = start, 0.0",
              "    for t in range(20):",
              "        action = {{policy}}",
              "        state, reward, done = step(state, action)",
              "        ret += reward",
              "        if done:",
              "            break",
              "    returns.append(ret)",
              "    avg = np.mean(returns)",
            ].join("\n"),
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
            "A policy picks an action in every state; the greedy policy of a Q-table is `np.argmax(Q, axis=1)`.",
            "Evaluate a policy over many episodes with a step limit, and report the average return and the success rate.",
            "Seed the generator, and give policies the same seed and episodes when you compare them.",
            "Random play is the baseline: a learned policy should beat it clearly.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "policies-01-q1",
      question: "Why run a policy for many episodes instead of one?",
      options: [
        "The return changes from episode to episode, and the average is steadier",
        "The policy learns from each episode",
        "One episode cannot reach the goal",
      ],
      answer: 0,
      explanation: "Evaluation does not learn; it averages out lucky and unlucky episodes.",
    },
    {
      id: "policies-01-q2",
      question: "Of 200 episodes, 150 end at the goal. What is the success rate?",
      options: ["`150`", "`0.75`", "`1.5`", "`0.25`"],
      answer: 1,
      explanation: "The success rate is the share of successful episodes: `150 / 200 = 0.75`.",
    },
    {
      id: "policies-01-q3",
      question: "`Q` has shape `(8, 4)`. Which line gives the greedy action of every state?",
      options: ["`np.max(Q, axis=1)`", "`np.argmax(Q, axis=0)`", "`np.argmax(Q, axis=1)`"],
      answer: 2,
      explanation: "Along `axis=1` each row is one state; `argmax` gives the index of its best action, while `max` gives the value.",
    },
  ],
};
