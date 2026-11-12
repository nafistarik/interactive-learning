import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "The value `V(s)` of a state is the discounted return the agent can expect from that state on. Work it out by hand on a short corridor and store it in a NumPy array, one entry per state.",
  estimatedMinutes: 12,
  sections: [
    {
      title: "What the value of a state is",
      blocks: [
        {
          kind: "text",
          text: "In Module 4.1 the return of an episode added up its rewards, each one multiplied by a further power of the discount `gamma`. The value of a state carries that idea over from episodes to states.",
        },
        {
          kind: "note",
          text: "The value `V(s)` of a state `s` is the expected discounted return when the agent starts in `s` and acts well from there on. In this module moves are deterministic, so the expected return is simply the return of the best path.",
        },
        {
          kind: "text",
          text: "A terminal state, such as the goal, has value `0`: the episode is over and no more rewards can come.",
        },
      ],
    },
    {
      title: "Why give every state a number",
      blocks: [
        {
          kind: "text",
          text: "A single return tells you how one episode went. A value table rates every state at once, so the agent can compare the places it could move to before it moves.",
        },
        {
          kind: "text",
          text: "Lesson 04 turns that comparison into a choice: in each state, take the action that leads to the best value. The values are computed once and serve every starting state.",
        },
      ],
    },
    {
      title: "A corridor worked out by hand",
      blocks: [
        {
          kind: "text",
          text: "Take a 1 × 4 corridor with states `0`, `1`, `2` and `3`. State `3` is the goal: stepping into it gives reward `+1` and ends the episode; every other step gives `0`. Let `gamma = 0.9`.",
        },
        {
          kind: "list",
          items: [
            "From state `2`, one step right reaches the goal: the return is `1`, so `V(2) = 1`.",
            "From state `1`, the rewards are `0` then `1`: the return is `0 + 0.9 * 1 = 0.9`.",
            "From state `0`, the rewards are `0`, `0`, `1`: the return is `0.9 * 0.9 * 1 = 0.81`.",
            "State `3` is terminal, so `V(3) = 0`.",
          ],
        },
        {
          kind: "text",
          text: "The return from state `0` uses the discount `gamma ** k` for the reward at step `k`, exactly as in Module 4.1.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "gamma = 0.9",
            "rewards = np.array([0.0, 0.0, 1.0])  # from state 0, moving right three times",
            "discounts = gamma ** np.arange(3)",
            "print(np.round(discounts, 3).tolist())",
            "print(round(float(np.sum(discounts * rewards)), 3))",
          ].join("\n"),
          output: ["[1.0, 0.9, 0.81]", "0.81"].join("\n"),
        },
      ],
    },
    {
      title: "Storing the values in an array",
      blocks: [
        {
          kind: "text",
          text: "Keep one value per state in a NumPy array `V`, indexed by the state number. This loop walks right from every start state to the goal and stores the return it collects.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "gamma = 0.9",
            "goal = 3",
            "V = np.zeros(4)",
            "for start in range(goal):",
            "    state, G, k = start, 0.0, 0",
            "    while state != goal:",
            "        state += 1",
            "        reward = 1.0 if state == goal else 0.0",
            "        G += gamma ** k * reward",
            "        k += 1",
            "    V[start] = G",
            "print(np.round(V, 3).tolist())",
            "print(V.reshape(1, 4).shape)",
          ].join("\n"),
          output: ["[0.81, 0.9, 1.0, 0.0]", "(1, 4)"].join("\n"),
        },
        {
          kind: "text",
          text: "The values grow toward the goal: each step further away multiplies the reward by one more `0.9`. For a grid, `V.reshape(rows, cols)` lays the same array out as the grid, which is how the heatmaps in this module draw it.",
        },
      ],
    },
    {
      title: "Try it: values along a corridor",
      blocks: [
        {
          kind: "text",
          text: "Change the length of the corridor and the discount, then step through the loop: the heatmap shows `V_grid` filling in one start state at a time.",
        },
        {
          kind: "playground",
          demo: {
            title: "Values of a corridor",
            controls: [
              { type: "number", name: "n", label: "Cells", min: 2, max: 8, initial: 5 },
              { type: "number", name: "g", label: "gamma × 100", min: 50, max: 99, initial: 90 },
            ],
            template: [
              "import numpy as np",
              "n = {{n}}",
              "gamma = {{g}} / 100",
              "goal = n - 1",
              "V = np.zeros(n)",
              "for start in range(goal):",
              "    steps_to_goal = goal - start",
              "    # The +1 arrives on the last step, discounted once for each step before it.",
              "    V[start] = gamma ** (steps_to_goal - 1)",
              "    V_grid = V.reshape(1, n)",
            ].join("\n"),
            chart: { kind: "heatmap", matrix: "V_grid" },
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
            "`V(s)` is the discounted return the agent can expect from state `s` on.",
            "A terminal state has value `0`: nothing happens after the episode ends.",
            "On the corridor with `gamma = 0.9`, the values are `0.81`, `0.9`, `1` and `0`.",
            "Store values in an array `V` with one entry per state; `V.reshape(rows, cols)` shows them as the grid.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "value-iteration-01-q1",
      question: "What does `V(s)` measure?",
      options: [
        "The reward for entering state `s`",
        "The discounted return the agent can expect starting from `s`",
        "The number of steps from `s` to the goal",
        "How often the agent visits `s`",
      ],
      answer: 1,
      explanation: "A value adds up all the rewards still to come from `s`, each discounted by `gamma` per step.",
    },
    {
      id: "value-iteration-01-q2",
      question: "On the corridor with `gamma = 0.9`, the goal is two steps away from a state. What is that state's value?",
      options: ["`1.0`", "`0.81`", "`0.9`", "`2.0`"],
      answer: 2,
      explanation: "The rewards are `0` then `1`, so the return is `0 + 0.9 * 1 = 0.9`.",
    },
    {
      id: "value-iteration-01-q3",
      question: "Why is the value of the goal state `0` and not `1`?",
      options: [
        "The episode has ended there, so no rewards are left to collect",
        "Values are always between `-1` and `0`",
        "The `+1` is lost to discounting",
      ],
      answer: 0,
      explanation: "The `+1` belongs to the step into the goal and counts in the value of the state before it.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "gamma = 0.9",
    "goal = 5",
    "V = np.zeros(goal + 1)",
    "",
    "# Fill V for a 1 x 6 corridor: V[start] is the return of walking right to the goal.",
    "for start in range(goal):",
    "    steps_to_goal = goal - start",
    "    V[start] = gamma ** (steps_to_goal - 1)",
    "",
    "print(np.round(V, 3).tolist())",
  ].join("\n"),
};
