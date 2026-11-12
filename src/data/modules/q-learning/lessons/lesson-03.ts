import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "After each step the agent moves one action value a little towards what it just saw: the reward plus the discounted best value of the next state. Repeated, this spreads the goal's reward back along the path.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What the Q-learning update is",
      blocks: [
        {
          kind: "text",
          text: "A transition is what one step returns: the state `s`, the action `a`, the reward `r`, the next state `s2` and `done`. The Q-learning update uses one transition to correct one entry, `Q[s, a]`.",
        },
        {
          kind: "note",
          text: "The target is `r + gamma * np.max(Q[s2]) * (not done)`: the reward now plus the discounted value of the best action in the next state, and no future once the episode has ended.",
        },
        {
          kind: "note",
          text: "The learning rate `alpha`, between 0 and 1, is the fraction of the gap to the target closed in one update: `Q[s, a] += alpha * (target - Q[s, a])`.",
        },
      ],
    },
    {
      title: "Why learn from single transitions",
      blocks: [
        {
          kind: "text",
          text: "Value iteration in 4.2 looped over every state and action and called `step` to look ahead, so it needed the full rules of the world. The Q-learning update only needs the transition the agent just lived through.",
        },
        {
          kind: "text",
          text: "So the agent can learn while it acts, one step at a time, in a world whose rules it does not know. The target is noisy and partly built on guesses, which is why `alpha` moves only part of the way.",
        },
      ],
    },
    {
      title: "One update, step by step",
      blocks: [
        {
          kind: "text",
          text: "From state 0 the agent moves right to state 1 and gets no reward. The table already says the best action in state 1 is worth `0.6`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "Q = np.zeros((4, 4))",
            "Q[1] = [0.2, 0.0, 0.6, 0.1]  # what the agent already believes about state 1",
            "alpha, gamma = 0.5, 0.9",
            "",
            "# From state 0 the agent moves right (1) to state 1; the step gives no reward.",
            "s, a, r, s2, done = 0, 1, 0.0, 1, False",
            "target = r + gamma * np.max(Q[s2]) * (not done)",
            "error = target - Q[s, a]",
            "Q[s, a] += alpha * error",
            "print(round(float(target), 2), round(float(error), 2), round(float(Q[s, a]), 2))",
          ].join("\n"),
          output: "0.54 0.54 0.27",
        },
        {
          kind: "text",
          text: "The target is `0 + 0.9 * 0.6 = 0.54`, the gap to the current `0.0` is `0.54`, and with `alpha = 0.5` the value moves half of the way, to `0.27`.",
        },
        {
          kind: "text",
          text: "Repeat one transition into the goal and the value closes half of the remaining gap each time. Since `done` is `True`, the target is just the reward.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "Q = np.zeros((4, 4))",
            "alpha, gamma = 0.5, 0.9",
            "",
            "# One transition: in state 2 the agent moves right (1), reaches the goal 3, gets 1.0.",
            "s, a, r, s2, done = 2, 1, 1.0, 3, True",
            "for update in range(3):",
            "    target = r + gamma * np.max(Q[s2]) * (not done)",
            "    Q[s, a] += alpha * (target - Q[s, a])",
            "    print(update, float(target), float(Q[s, a]))",
          ].join("\n"),
          output: ["0 1.0 0.5", "1 1.0 0.75", "2 1.0 0.875"].join("\n"),
        },
        {
          kind: "list",
          items: [
            "`np.max(Q[s2])` looks at the next state `s2`; `np.max(Q[s])` would look at the state the agent just left.",
            "`+=` moves the old value; `=` would throw it away and keep only `alpha * error`.",
            "`(not done)` is `False`, which counts as 0, when the episode has ended: there is no next action to value.",
          ],
        },
      ],
    },
    {
      title: "Values flow back from the goal",
      blocks: [
        {
          kind: "text",
          text: "Take a 1 x 4 corridor, states 0 to 3 with the goal in 3, and an agent that always moves right. Each episode applies the update once per step; print the value of moving right in states 0, 1 and 2.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "# A 1 x 4 corridor: states 0, 1, 2, 3; the goal is 3. The agent always moves right (1).",
            "Q = np.zeros((4, 4))",
            "alpha, gamma = 0.5, 0.9",
            "",
            "for episode in range(3):",
            "    s = 0",
            "    done = False",
            "    while not done:",
            "        s2 = s + 1",
            "        done = s2 == 3",
            "        r = 1.0 if done else 0.0",
            "        Q[s, 1] += alpha * (r + gamma * np.max(Q[s2]) * (not done) - Q[s, 1])",
            "        s = s2",
            "    print(episode, np.round(Q[:3, 1], 3).tolist())",
          ].join("\n"),
          output: ["0 [0.0, 0.0, 0.5]", "1 [0.0, 0.225, 0.75]", "2 [0.101, 0.45, 0.875]"].join("\n"),
        },
        {
          kind: "text",
          text: "After the first episode only the step into the goal has a value. Each later episode carries some of it one state further back, until the start state learns that moving right pays off too.",
        },
      ],
    },
    {
      title: "Try it: watch the value spread",
      blocks: [
        {
          kind: "text",
          text: "Run the corridor for a number of episodes and step through them. Try `alpha = 1.0` and a smaller `gamma`, and watch how far the start state's value `v_start` gets.",
        },
        {
          kind: "playground",
          demo: {
            title: "Q-learning on a corridor",
            controls: [
              {
                type: "select",
                name: "alpha",
                label: "alpha",
                options: [
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
                  { label: "0.9", value: "0.9" },
                  { label: "0.5", value: "0.5" },
                  { label: "1.0", value: "1.0" },
                ],
              },
              { type: "number", name: "episodes", label: "Episodes", min: 1, max: 40, initial: 10 },
            ],
            template: [
              "import numpy as np",
              "# A 1 x 4 corridor: states 0, 1, 2, 3; the goal is 3. The agent always moves right (1).",
              "Q = np.zeros((4, 4))",
              "alpha = {{alpha}}",
              "gamma = {{gamma}}",
              "",
              "def walk_right():",
              "    s = 0",
              "    done = False",
              "    while not done:",
              "        s2 = s + 1",
              "        done = s2 == 3",
              "        r = 1.0 if done else 0.0",
              "        Q[s, 1] += alpha * (r + gamma * np.max(Q[s2]) * (not done) - Q[s, 1])",
              "        s = s2",
              "",
              "for episode in range({{episodes}}):",
              "    walk_right()",
              "    V_row = Q.max(axis=1).reshape(1, 4)",
              "    v_start = V_row[0, 0]",
            ].join("\n"),
            chart: {
              kind: "heatmap",
              matrix: "V_row",
              rowLabels: ["value"],
              colLabels: ["state 0", "state 1", "state 2", "3 (goal)"],
            },
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
            "A transition is `(s, a, r, s2, done)`, what one call to `step` gives.",
            "The target is `r + gamma * np.max(Q[s2]) * (not done)`.",
            "`Q[s, a] += alpha * (target - Q[s, a])` closes a fraction `alpha` of the gap.",
            "The update needs no rules of the world, only the transition that happened.",
            "Repeated over episodes, the goal's reward spreads back to earlier states.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "q-learning-03-q1",
      question: "`Q[s, a]` is `0.4`, the target is `1.0` and `alpha = 0.5`. What is `Q[s, a]` after the update?",
      options: ["0.5", "0.7", "1.0", "0.3"],
      answer: 1,
      explanation: "The gap is `0.6`; half of it is `0.3`, so the value becomes `0.4 + 0.3 = 0.7`.",
    },
    {
      id: "q-learning-03-q2",
      question: "Why does the target multiply the future term by `(not done)`?",
      options: [
        "To make the update faster",
        "Because after a terminal state there are no more rewards to expect",
        "To avoid dividing by zero",
        "Because `gamma` is not defined at the goal",
      ],
      answer: 1,
      explanation: "When the episode has ended, the return is just the reward of this step.",
    },
    {
      id: "q-learning-03-q3",
      question: "Which line has a bug?",
      options: [
        "`target = r + gamma * np.max(Q[s2]) * (not done)`",
        "`target = r + gamma * np.max(Q[s]) * (not done)`",
        "`Q[s, a] += alpha * (target - Q[s, a])`",
      ],
      answer: 1,
      explanation: "The future value belongs to the next state `s2`, not to the state the agent just left.",
    },
  ],
};
