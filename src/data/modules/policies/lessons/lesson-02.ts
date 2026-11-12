import type { LessonContent } from "@/features/content/types";

import { GRID_HEATMAP, TRAIN_FUNCTION, TWO_EXITS_WORLD, trainingLoop } from "../grid";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "An agent that never explores keeps the first reward it finds; one that always explores never uses what it learned. A decaying epsilon schedule does the first early and the second late.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What exploration and exploitation are",
      blocks: [
        {
          kind: "text",
          text: "Exploiting means taking the action with the highest Q-value, the best one known so far. Exploring means taking another action to find out what it is worth.",
        },
        {
          kind: "text",
          text: "Epsilon-greedy from Module 4.3 mixes the two: with probability `eps` it takes a random action, otherwise the greedy one, `np.argmax(Q[state])`.",
        },
        {
          kind: "note",
          text: "An exploration schedule gives epsilon a value for every episode instead of one fixed number, so the agent can explore more at the start than at the end.",
        },
      ],
    },
    {
      title: "Why the balance matters",
      blocks: [
        {
          kind: "text",
          text: "This lesson's grid has two exits. From the start, state 4, one move up reaches the near exit, state 0, worth `0.5`. Three moves right reach the far exit, state 7, worth `1.0`.",
        },
        {
          kind: "list",
          items: [
            "Other moves give 0, both exits end the episode, and walls keep the agent in place, as before.",
            "Too little exploration: the agent finds the near exit first, its Q-value becomes the highest, and it keeps going there without trying the far exit.",
            "Too much exploration: the agent learns which exit is better but keeps acting at random, so its returns stay low.",
          ],
        },
      ],
    },
    {
      title: "A decaying epsilon schedule",
      blocks: [
        {
          kind: "text",
          text: "A common schedule starts at 1, multiplies epsilon by `0.99` every episode, and stops at a small floor: `eps = max(0.05, 0.99 ** episode)`.",
        },
        {
          kind: "code",
          code: [
            "for episode in [0, 10, 50, 100, 200, 300, 400]:",
            "    eps = max(0.05, 0.99 ** episode)",
            "    print(episode, round(eps, 3))",
          ].join("\n"),
          output: ["0 1.0", "10 0.904", "50 0.605", "100 0.366", "200 0.134", "300 0.05", "400 0.05"].join("\n"),
        },
        {
          kind: "text",
          text: "The first episodes are almost all random. After about 300 episodes epsilon stays at `0.05`, so 1 action in 20 is still random and the agent can notice if something changes.",
        },
      ],
    },
    {
      title: "Learning curves for four settings",
      blocks: [
        {
          kind: "text",
          text: "`train` runs the Q-learning of Module 4.3 for 300 episodes and returns each episode's return and the final Q-table. `schedule` turns an episode number into its epsilon. Each row is one setting, with the mean return of each block of 50 episodes.",
        },
        {
          kind: "code",
          code: [
            TWO_EXITS_WORLD,
            "",
            TRAIN_FUNCTION,
            "",
            "settings = {",
            '    "0.0": lambda episode: 0.0,',
            '    "0.1": lambda episode: 0.1,',
            '    "1.0": lambda episode: 1.0,',
            '    "decay": lambda episode: max(0.05, 0.99 ** episode),',
            "}",
            "for name, schedule in settings.items():",
            "    returns, Q = train(schedule)",
            "    print(name, np.round(returns.reshape(6, 50).mean(axis=1), 2))",
          ].join("\n"),
          output: [
            "0.0 [0.5 0.5 0.5 0.5 0.5 0.5]",
            "0.1 [0.5 0.5 0.5 0.5 0.5 0.5]",
            "1.0 [0.62 0.55 0.54 0.56 0.55 0.58]",
            "decay [0.52 0.52 0.59 0.98 0.96 0.98]",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "With `0.0` and `0.1` every block earns exactly `0.5`: the agent is stuck on the near exit. With `1.0` the returns never improve. Only the decaying schedule ends near `1.0`, the far exit.",
        },
        {
          kind: "text",
          text: "The always-random agent did learn which exit is better. Its Q-table prefers right in the start state; it just never acts on it.",
        },
        {
          kind: "code",
          code: [
            TWO_EXITS_WORLD,
            "",
            TRAIN_FUNCTION,
            "",
            "returns, Q = train(lambda episode: 1.0)",
            "print(np.round(Q[start], 2), int(np.argmax(Q[start])))",
            "print(round(float(returns[-50:].mean()), 2))",
          ].join("\n"),
          output: ["[0.5  0.81 0.73 0.73] 1", "0.58"].join("\n"),
        },
        {
          kind: "text",
          text: "So judge the result by evaluating the greedy policy of the final Q-table, as in lesson 01, not only by the returns earned while training.",
        },
      ],
    },
    {
      title: "Try it: choose how to explore",
      blocks: [
        {
          kind: "text",
          text: "Pick an epsilon and follow the return of each episode and the grid of best Q-values `V`. With the decaying schedule, try a few seeds: one run can still settle on the near exit.",
        },
        {
          kind: "playground",
          demo: {
            title: "Exploration settings",
            controls: [
              {
                type: "select",
                name: "eps",
                label: "Epsilon",
                options: [
                  { label: "0.0 (never explore)", value: "0.0" },
                  { label: "0.1", value: "0.1" },
                  { label: "1.0 (always explore)", value: "1.0" },
                  { label: "max(0.05, 0.99 ** episode)", value: "max(0.05, 0.99 ** episode)" },
                ],
              },
              { type: "number", name: "seed", label: "Seed", min: 0, max: 4, initial: 0 },
            ],
            template: [
              TWO_EXITS_WORLD,
              "",
              "alpha, gamma = 0.5, 0.9",
              "rng = np.random.default_rng({{seed}})",
              trainingLoop("{{eps}}"),
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
            "Exploit: take the best known action. Explore: try another one to learn its value.",
            "Too little exploration gets stuck on the first reward found; too much never uses what was learned.",
            "A decaying schedule such as `max(0.05, 0.99 ** episode)` explores early and exploits late.",
            "Compare settings by their learning curves, and judge the final policy by evaluating it greedily.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "policies-02-q1",
      question: "An agent with `eps = 0` earns exactly `0.5` in every episode. What is the likely cause?",
      options: [
        "It found the near exit first and never tries anything else",
        "The learning rate is too large",
        "It explores too much",
      ],
      answer: 0,
      explanation: "Without exploration, the first action that pays off stays the greedy one.",
    },
    {
      id: "policies-02-q2",
      question: "What is `max(0.05, 0.99 ** episode)` at episode 0?",
      options: ["`0.05`", "`0.99`", "`1.0`", "`0.0`"],
      answer: 2,
      explanation: "`0.99 ** 0` is `1.0`, larger than the floor: the first episode is fully random.",
    },
    {
      id: "policies-02-q3",
      question: "With `eps = 1.0` the training returns stay low. What about the learned Q-table?",
      options: [
        "It is useless, because the agent never exploited",
        "It can still rank the actions well; the agent just never follows it",
        "It is all zeros",
      ],
      answer: 1,
      explanation: "Q-learning updates toward the best next action whatever the agent did, so random play still teaches it the values.",
    },
  ],
};
