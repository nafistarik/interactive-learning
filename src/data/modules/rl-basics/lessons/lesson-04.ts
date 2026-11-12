import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "The return `G` adds up an episode's rewards, each weighted by the discount factor `gamma` to the power of its step. Computed backwards with `G = r + gamma * G`, it gives the return from every step in one pass.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What a return is",
      blocks: [
        {
          kind: "text",
          text: "Write `rewards[t]` for the reward the agent receives after its action at step `t`. The return is the total the agent collects from a step to the end of the episode.",
        },
        {
          kind: "note",
          text: "The discount factor `gamma` is a number from 0 to 1 that shrinks later rewards. The return from step 0 is `G = rewards[0] + gamma * rewards[1] + gamma**2 * rewards[2] + ...`, that is `sum(gamma ** t * rewards[t])`.",
        },
        {
          kind: "text",
          text: "The agent's goal, stated precisely, is a policy that makes this return as large as possible. Every method in Phase 4 estimates returns.",
        },
      ],
    },
    {
      title: "Why discount future rewards",
      blocks: [
        {
          kind: "list",
          items: [
            "Sooner is better: with `gamma < 1` the goal reached in 3 steps is worth more than the same goal reached in 7, so the agent prefers short paths.",
            "Totals stay finite: a reward of 1 at every step of an endless episode adds up to `1 / (1 - gamma)` instead of growing without bound.",
            "With `gamma = 1` there is no discount, and every path that reaches the goal gets the same return, however long.",
          ],
        },
      ],
    },
    {
      title: "Computing the return",
      blocks: [
        {
          kind: "text",
          text: "With NumPy, the weights `gamma ** t` for every step come from one array operation, and the return is the sum of weights times rewards.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "rewards = np.array([0, 0, 0, 1])  # the goal on the fourth step",
            "gamma = 0.9",
            "t = np.arange(len(rewards))",
            "weights = gamma ** t",
            "print(np.round(weights, 3))",
            "G = np.sum(weights * rewards)",
            "print(round(float(G), 3))",
          ].join("\n"),
          output: ["[1.    0.9   0.81  0.729]", "0.729"].join("\n"),
        },
        {
          kind: "text",
          text: "The return from step `t` is the reward at `t` plus `gamma` times the return from step `t + 1`: `G = r + gamma * G`. Walking the rewards from last to first gives the return from every step, one multiply and add each.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "rewards = [0, 0, 0, 1]",
            "gamma = 0.9",
            "G = 0.0",
            "returns = []",
            "for r in reversed(rewards):",
            "    G = r + gamma * G",
            "    returns.append(G)",
            "returns.reverse()",
            "print([round(g, 3) for g in returns])",
          ].join("\n"),
          output: "[0.729, 0.81, 0.9, 1.0]",
        },
        {
          kind: "text",
          text: "`returns[0]` is the return of the whole episode and matches the sum above. The list is built backwards, so `returns.reverse()` puts it back in time order.",
        },
      ],
    },
    {
      title: "Comparing a short and a long path",
      blocks: [
        {
          kind: "text",
          text: "Two episodes both end on the goal, one after 3 steps and one after 7. The last line uses a reward of 1 at every one of 200 steps.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "",
            "def discounted(rewards, gamma):",
            "    t = np.arange(len(rewards))",
            "    return round(float(np.sum(gamma ** t * np.array(rewards))), 4)",
            "",
            "short = [0, 0, 1]",
            "long = [0, 0, 0, 0, 0, 0, 1]",
            "print(discounted(short, 0.9), discounted(long, 0.9))",
            "print(discounted(short, 1.0), discounted(long, 1.0))",
            "print(discounted([1] * 200, 0.9), discounted([1] * 200, 1.0))",
          ].join("\n"),
          output: ["0.81 0.5314", "1.0 1.0", "10.0 200.0"].join("\n"),
        },
        {
          kind: "text",
          text: "With `gamma = 0.9` the short path is worth more; with `gamma = 1` both are worth the same. The endless rewards approach `1 / (1 - 0.9) = 10` with discounting, but keep growing without it.",
        },
      ],
    },
    {
      title: "Try it: how gamma weighs the future",
      blocks: [
        {
          kind: "text",
          text: "Pick a discount factor and a reward sequence, then step through the loop. `weight` shows how much each step counts, and `G` shows the return growing as the rewards arrive.",
        },
        {
          kind: "playground",
          demo: {
            title: "Adding up a discounted return",
            controls: [
              {
                type: "select",
                name: "gamma",
                label: "gamma",
                options: [
                  { label: "0.5", value: "0.5" },
                  { label: "0.9", value: "0.9" },
                  { label: "0.99", value: "0.99" },
                  { label: "1.0 (no discount)", value: "1.0" },
                ],
              },
              {
                type: "select",
                name: "rewards",
                label: "Rewards",
                options: [
                  { label: "Goal after 3 steps", value: "[0, 0, 1]" },
                  { label: "Goal after 8 steps", value: "[0, 0, 0, 0, 0, 0, 0, 1]" },
                  { label: "Pit after 2 steps", value: "[0, -1]" },
                  { label: "1 at each of 20 steps", value: "[1] * 20" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "gamma = {{gamma}}",
              "rewards = np.array({{rewards}})",
              "G = 0.0",
              "for t in range(len(rewards)):",
              "    weight = gamma ** t",
              "    G = G + weight * rewards[t]",
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
            "The return is the discounted sum of rewards: `G = sum(gamma ** t * rewards[t])`.",
            "The discount factor `gamma` (0 to 1) makes sooner rewards count more and keeps long totals finite.",
            "Backwards, `G = r + gamma * G` gives the return from every step in one pass.",
            "A good policy is one with a large return; the next modules estimate returns to find it.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "rl-basics-04-q1",
      question: "`rewards = [0, 0, 1]` and `gamma = 0.5`. What is the return from step 0?",
      options: ["1.0", "0.5", "0.25", "0.125"],
      answer: 2,
      explanation: "The reward arrives at step 2, so it is weighted by `0.5 ** 2 = 0.25`.",
    },
    {
      id: "rl-basics-04-q2",
      question: "Going backwards, `G` is the return from step `t + 1`. Which line gives the return from step `t`?",
      options: ["`G = gamma * (r + G)`", "`G = r + gamma * G`", "`G = G + gamma ** t * r`", "`G = r * gamma + G`"],
      answer: 1,
      explanation: "The reward at `t` counts fully, and everything after it is one step later, so it is multiplied by `gamma`.",
    },
    {
      id: "rl-basics-04-q3",
      question: "With `gamma = 1`, how do a 3-step and a 30-step path to the same goal compare?",
      options: [
        "Both have the same return",
        "The 3-step path has the larger return",
        "The 30-step path has the larger return",
        "The return is infinite",
      ],
      answer: 0,
      explanation: "Without discounting, the goal's reward counts fully whenever it arrives.",
    },
  ],
};
