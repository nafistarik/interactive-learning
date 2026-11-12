import type { LessonContent } from "@/features/content/types";

import { GREEDY_POLICY, GRID, PRINT_ARROWS, VALUE_ITERATION } from "../grid";

/** The 3 × 4 grid with its converged values, as lesson 03 left them. */
const CONVERGED = [GRID, "tol = 1e-4", VALUE_ITERATION].join("\n");

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "Converged values tell the agent what to do: in each state, take the action with the best one-step lookahead. Build that greedy policy with `np.argmax`, draw it as arrows and follow it to the goal.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What a greedy policy is",
      blocks: [
        {
          kind: "text",
          text: "A policy says which action to take in every state. Here it is an integer array `policy` with one action per state.",
        },
        {
          kind: "note",
          text: "The greedy policy for `V` picks, in each state, the action with the largest action value `reward + gamma * V[next]`: the best move after looking one step ahead. Terminal states need no action; this module stores `-1` for them.",
        },
      ],
    },
    {
      title: "Why values need a lookahead",
      blocks: [
        {
          kind: "text",
          text: "`V` says how good each state is, not which action leads where. The lookahead runs `step(s, a)` for every action to see where it lands and what it pays.",
        },
        {
          kind: "text",
          text: "Once `V` has converged, acting greedily on it is the best the agent can do. That is the reason to compute values at all.",
        },
      ],
    },
    {
      title: "Choosing an action with np.argmax",
      blocks: [
        {
          kind: "text",
          text: "Take state `8`, the bottom-left corner. Compute its four action values from the converged `V` and let `np.argmax` return the index of the best one.",
        },
        {
          kind: "code",
          code: [
            CONVERGED,
            "",
            "s = 8",
            "q = np.zeros(4)",
            "for a in range(4):",
            "    next_state, reward, done = step(s, a)",
            "    q[a] = reward + gamma * V[next_state]",
            "print(np.round(q, 4).tolist())",
            "print(int(np.argmax(q)))",
          ].join("\n"),
          output: ["[0.6561, 0.6561, 0.5905, 0.5905]", "0"].join("\n"),
        },
        {
          kind: "text",
          text: "Up and right both lead to a state four steps from the goal, so they tie. Down and left hit the wall and waste a step.",
        },
        {
          kind: "note",
          text: "When values tie, `np.argmax` returns the first one, the lowest action number. Any of the tied actions is equally good.",
        },
      ],
    },
    {
      title: "The whole policy as arrows",
      blocks: [
        {
          kind: "text",
          text: "Repeat the lookahead for every state that is not terminal. To print the result, index an array of arrow characters with `policy`; the `-1` of a terminal state picks the last character, `*`.",
        },
        {
          kind: "code",
          code: [CONVERGED, "", GREEDY_POLICY, "print(policy.tolist())", PRINT_ARROWS].join("\n"),
          output: ["[1, 1, 1, -1, 0, 0, 0, -1, 0, 0, 0, 3]", "→→→*", "↑↑↑*", "↑↑↑←"].join("\n"),
        },
        {
          kind: "text",
          text: "Every arrow leads one step closer to the goal. The bottom-right state points left: going up would enter the pit.",
        },
      ],
    },
    {
      title: "Following the policy from the start",
      blocks: [
        {
          kind: "text",
          text: "Start in state `8` and let the policy choose every move until the episode ends.",
        },
        {
          kind: "code",
          code: [
            CONVERGED,
            "",
            GREEDY_POLICY,
            "",
            "state, done = 8, False",
            "path = [state]",
            "while not done:",
            "    state, reward, done = step(state, policy[state])",
            "    path.append(state)",
            "print(path)",
            "print(reward)",
          ].join("\n"),
          output: ["[8, 4, 0, 1, 2, 3]", "1.0"].join("\n"),
        },
        {
          kind: "text",
          text: "The agent reaches the goal in five moves, the shortest path, and never goes near the pit.",
        },
      ],
    },
    {
      title: "Try it: a policy from different values",
      blocks: [
        {
          kind: "text",
          text: "Pick the values the policy is built from and step through the loop over states. Values that have not converged give arrows that do not lead to the goal.",
        },
        {
          kind: "playground",
          demo: {
            title: "Greedy policy from V",
            controls: [
              {
                type: "select",
                name: "values",
                label: "Values",
                options: [
                  {
                    label: "Converged",
                    value: "np.array([0.81, 0.9, 1, 0, 0.729, 0.81, 0.9, 0, 0.6561, 0.729, 0.81, 0.729])",
                  },
                  { label: "After two sweeps", value: "np.array([0, 0.9, 1, 0, 0, 0, 0.9, 0, 0, 0, 0, 0])" },
                  { label: "All zeros", value: "np.zeros(rows * cols)" },
                ],
              },
            ],
            template: [GRID, "V = {{values}}", GREEDY_POLICY, PRINT_ARROWS].join("\n"),
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
            "A policy is one action per state, stored in an integer array.",
            "Greedy: in each state take `np.argmax` of the four values `reward + gamma * V[next]`.",
            "Ties go to the lowest action number; tied actions are equally good.",
            "`arrows[policy].reshape(rows, cols)` prints the policy as a grid of arrows.",
            "Following the greedy policy of converged values takes a shortest path to the goal.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "value-iteration-04-q1",
      question: "How does the greedy policy choose an action in state `s`?",
      options: [
        "It moves to the neighbour with the lowest value",
        "It takes `np.argmax` over the four values `reward + gamma * V[next]`",
        "It picks a random action",
        "It takes `np.argmax(V)`",
      ],
      answer: 1,
      explanation: "One step of lookahead per action, then the index of the best one.",
    },
    {
      id: "value-iteration-04-q2",
      question: "Why is `np.argmax(V)` not a policy?",
      options: [
        "It returns the best state of the whole grid, not an action for each state",
        "`np.argmax` does not work on value arrays",
        "It is a policy, just a slow one",
      ],
      answer: 0,
      explanation: "A policy needs one action per state; that comes from the lookahead in each state.",
    },
    {
      id: "value-iteration-04-q3",
      question: "Two actions in a state have exactly the same value. Which does `np.argmax` return?",
      options: ["The last one", "The one with the lower action number", "It raises an error"],
      answer: 1,
      explanation: "`np.argmax` returns the first index of the largest value.",
    },
  ],
};
