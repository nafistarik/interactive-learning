import type { LessonContent } from "@/features/content/types";

import { GRID_HEATMAP, TRAIN_FUNCTION, TWO_EXITS_WORLD, trainingLoop } from "../grid";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "The learning rate `alpha` sets how far each update moves a Q-value; the discount `gamma` sets how much later rewards count. Both change which policy the agent ends up with.",
  estimatedMinutes: 17,
  sections: [
    {
      title: "What alpha and gamma are",
      blocks: [
        {
          kind: "note",
          text: "A hyperparameter is a setting you choose before training, which the training does not learn. Epsilon, `alpha`, `gamma` and the number of episodes are the hyperparameters of Q-learning.",
        },
        {
          kind: "text",
          text: "The update is `Q[s, a] += alpha * (target - Q[s, a])` with `target = reward + gamma * np.max(Q[next_state])`. `alpha` is the share of the gap to the target that one update closes.",
        },
        {
          kind: "text",
          text: "`gamma` multiplies the value of the next state, so a reward that comes `k` moves later counts `gamma ** k` times its size today.",
        },
      ],
    },
    {
      title: "Why they change the result",
      blocks: [
        {
          kind: "list",
          items: [
            "`alpha` too small: every update is a tiny step, so the Q-values need many episodes to get anywhere.",
            "`alpha` too large: every update jumps most of the way to the latest target, so random rewards make the values swing.",
            "`gamma` small: the agent is short-sighted and prefers rewards that come soon.",
            "`gamma` close to 1: the agent is far-sighted and will walk further for a bigger reward.",
          ],
        },
      ],
    },
    {
      title: "Learning rate: slow or noisy",
      blocks: [
        {
          kind: "text",
          text: "Take one state and one action whose reward is random, with a mean near 1. The update `q += alpha * (reward - q)` is the Q-learning update without a next state.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "rng = np.random.default_rng(0)",
            "rewards = rng.normal(1.0, 0.5, size=300)",
            "print(round(float(rewards.mean()), 2))",
            "",
            "for alpha in [0.01, 0.1, 0.9]:",
            "    q, history = 0.0, []",
            "    for reward in rewards:",
            "        q += alpha * (reward - q)",
            "        history.append(q)",
            "    last = np.array(history[-100:])",
            "    print(alpha, round(history[49], 2), round(float(last.min()), 2), round(float(last.max()), 2))",
          ].join("\n"),
          output: ["0.98", "0.01 0.43 0.85 0.92", "0.1 1.36 0.65 1.13", "0.9 1.68 -0.45 2.34"].join("\n"),
        },
        {
          kind: "text",
          text: "Each line shows `alpha`, `q` after 50 rewards, and the lowest and highest `q` over the last 100. With `0.01`, `q` is still below the mean after 300 rewards. With `0.9` it follows every single reward, from `-0.45` to `2.34`.",
        },
        {
          kind: "note",
          text: "In this module's grid the moves and rewards are fixed, so even `alpha = 1` gives steady values there. The noise of a large `alpha` shows when rewards or moves are random.",
        },
      ],
    },
    {
      title: "Discount: near and small or far and big",
      blocks: [
        {
          kind: "text",
          text: "In the two-exit grid of lesson 02, the near exit pays `0.5` on the first move. The far exit pays `1.0` on the third move, so from the start it is worth `gamma * gamma * 1.0`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "gammas = np.array([0.5, 0.7, 0.9, 0.99])",
            "near_value = 0.5",
            "far_value = gammas * gammas * 1.0",
            "print(np.round(far_value, 3))",
            "print(far_value > near_value)",
          ].join("\n"),
          output: ["[0.25 0.49 0.81 0.98]", "[False False  True  True]"].join("\n"),
        },
        {
          kind: "text",
          text: "Up to `0.7` the far exit is worth less than `0.5`, so the best policy is to take the near one. From `0.9` the far exit wins. Training finds the same answer:",
        },
        {
          kind: "code",
          code: [
            TWO_EXITS_WORLD,
            "",
            TRAIN_FUNCTION,
            "",
            'names = ["up", "right", "down", "left"]',
            "schedule = lambda episode: max(0.05, 0.99 ** episode)",
            "for gamma in [0.5, 0.9]:",
            "    returns, Q = train(schedule, gamma=gamma)",
            "    print(gamma, np.round(Q[start], 2), names[int(np.argmax(Q[start]))])",
          ].join("\n"),
          output: ["0.5 [0.5  0.24 0.25 0.25] up", "0.9 [0.5  0.81 0.72 0.59] right"].join("\n"),
        },
        {
          kind: "text",
          text: "Neither answer is wrong: `gamma` is part of the problem you set. Choose it for the behaviour you want, then check the learned policy.",
        },
      ],
    },
    {
      title: "How alpha changes the learned policy",
      blocks: [
        {
          kind: "text",
          text: "Here `gamma` stays at `0.9`, where the far exit is better, and only `alpha` changes. Each run has the same 300 episodes.",
        },
        {
          kind: "code",
          code: [
            TWO_EXITS_WORLD,
            "",
            TRAIN_FUNCTION,
            "",
            'names = ["up", "right", "down", "left"]',
            "schedule = lambda episode: max(0.05, 0.99 ** episode)",
            "for alpha in [0.01, 0.1, 0.5]:",
            "    returns, Q = train(schedule, alpha=alpha)",
            "    print(alpha, np.round(Q[start], 2), names[int(np.argmax(Q[start]))])",
          ].join("\n"),
          output: [
            "0.01 [0.47 0.   0.06 0.05] up",
            "0.1 [0.5  0.23 0.44 0.44] up",
            "0.5 [0.5  0.81 0.72 0.59] right",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "With `0.01` and `0.1` the value of going right is still far below its true `0.81`, so the greedy policy takes the near exit. A small learning rate is not wrong, but it needs more episodes.",
        },
      ],
    },
    {
      title: "Try it: tune alpha and gamma",
      blocks: [
        {
          kind: "text",
          text: "Pick `alpha` and `gamma` and follow the return per episode and the grid of best Q-values `V`. Find a setting that ends at the far exit and one that settles on the near exit.",
        },
        {
          kind: "playground",
          demo: {
            title: "Learning rate and discount",
            controls: [
              {
                type: "select",
                name: "alpha",
                label: "alpha",
                options: [
                  { label: "0.01 (slow)", value: "0.01" },
                  { label: "0.1", value: "0.1" },
                  { label: "0.5", value: "0.5" },
                  { label: "1.0", value: "1.0" },
                ],
              },
              {
                type: "select",
                name: "gamma",
                label: "gamma",
                options: [
                  { label: "0.5 (short-sighted)", value: "0.5" },
                  { label: "0.7", value: "0.7" },
                  { label: "0.9 (far-sighted)", value: "0.9" },
                ],
              },
            ],
            template: [
              TWO_EXITS_WORLD,
              "",
              "alpha, gamma = {{alpha}}, {{gamma}}",
              "rng = np.random.default_rng(0)",
              trainingLoop("max(0.05, 0.99 ** episode)"),
            ].join("\n"),
            chart: GRID_HEATMAP,
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
            "Hyperparameters such as `alpha` and `gamma` are chosen before training, not learned.",
            "A small `alpha` learns slowly; a large `alpha` follows every random reward.",
            "A reward `k` moves away counts `gamma ** k` times its size, so `gamma` decides between near and far rewards.",
            "Check the learned policy after changing a hyperparameter: the greedy action can change with it.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "policies-03-q1",
      question: "`Q[s, a]` is `0.0`, the target is `1.0` and `alpha` is `0.1`. What is `Q[s, a]` after one update?",
      options: ["`1.0`", "`0.1`", "`0.9`", "`0.0`"],
      answer: 1,
      explanation: "`0.0 + 0.1 * (1.0 - 0.0) = 0.1`: one update closes a tenth of the gap.",
    },
    {
      id: "policies-03-q2",
      question: "A reward of `1.0` arrives 2 moves from now and `gamma` is `0.5`. What is it worth now?",
      options: ["`0.25`", "`0.5`", "`1.0`", "`2.0`"],
      answer: 0,
      explanation: "Each move multiplies by `gamma`: `0.5 * 0.5 * 1.0 = 0.25`.",
    },
    {
      id: "policies-03-q3",
      question: "Rewards are random, and the Q-values keep jumping up and down late in training. What should you try?",
      options: ["A larger `alpha`", "A smaller `alpha`", "A smaller `gamma`"],
      answer: 1,
      explanation: "A smaller learning rate averages over many rewards instead of following the latest one.",
    },
  ],
  practiceStarter: [
    TWO_EXITS_WORLD,
    "",
    TRAIN_FUNCTION,
    "",
    "# Try other values of gamma and alpha: which exit does the start state prefer?",
    "schedule = lambda episode: max(0.05, 0.99 ** episode)",
    "returns, Q = train(schedule, alpha=0.5, gamma=0.8)",
    'names = ["up", "right", "down", "left"]',
    "print(np.round(Q[start], 2), names[int(np.argmax(Q[start]))])",
    "print(round(float(returns[-50:].mean()), 2))",
  ].join("\n"),
};
