import type { LessonContent } from "@/features/content/types";

import { GRID, gridCode, VALUE_ITERATION } from "../grid";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "Value iteration repeats Bellman sweeps until the values stop changing. Measure the largest change of each sweep, stop when it falls below a tolerance, and watch the values spread out from the goal.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What value iteration is",
      blocks: [
        {
          kind: "text",
          text: "Value iteration starts from `V` all zeros and applies the Bellman sweep of lesson 02 again and again. After each sweep it measures how much the values moved.",
        },
        {
          kind: "note",
          text: "`delta = np.max(np.abs(V_new - V))` is the largest change of any state in one sweep. The loop stops when `delta` is below a small tolerance `tol`: the values have converged, which means further sweeps would barely change them.",
        },
      ],
    },
    {
      title: "Why one sweep is not enough",
      blocks: [
        {
          kind: "text",
          text: "In lesson 02 the first sweep only reached the state next to the goal, and the second sweep one cell further. A state far from the goal needs as many sweeps as it has steps to the goal before its value is right.",
        },
        {
          kind: "text",
          text: "You rarely know that distance in advance, so instead of a fixed number of sweeps the loop watches `delta` and stops by itself.",
        },
      ],
    },
    {
      title: "The value iteration loop",
      blocks: [
        {
          kind: "text",
          text: "Each pass of the `while` loop is one sweep. `delta` starts at `1.0` so that the first sweep runs, and `sweeps` counts how many ran.",
        },
        {
          kind: "code",
          code: [
            GRID,
            "tol = 1e-4",
            "",
            VALUE_ITERATION,
            "",
            'print("sweeps:", sweeps)',
            "print(np.round(V_grid, 3).tolist())",
          ].join("\n"),
          output: ["sweeps: 6", "[[0.81, 0.9, 1.0, 0.0], [0.729, 0.81, 0.9, 0.0], [0.656, 0.729, 0.81, 0.729]]"].join("\n"),
        },
        {
          kind: "text",
          text: "The values fall by a factor of `0.9` for each step away from the goal. The bottom-right state is next to the pit but still worth `0.729`: its best move is left, away from the pit.",
        },
      ],
    },
    {
      title: "Watching delta fall",
      blocks: [
        {
          kind: "text",
          text: "Print `delta` after every sweep. A `for` loop with a `break` is a safe way to write the same thing: it can never run more than its fixed number of sweeps.",
        },
        {
          kind: "code",
          code: [
            GRID,
            "tol = 1e-4",
            "",
            "V = np.zeros(rows * cols)",
            "for sweep in range(20):",
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
            "    print(sweep + 1, round(float(delta), 4))",
            "    if delta < tol:",
            "        break",
          ].join("\n"),
          output: ["1 1.0", "2 0.9", "3 0.81", "4 0.729", "5 0.6561", "6 0.0"].join("\n"),
        },
        {
          kind: "text",
          text: "Sweep 5 reaches the bottom-left corner, five steps from the goal. Sweep 6 changes nothing, so `delta` is `0` and the loop stops.",
        },
        {
          kind: "note",
          text: "Here moves are deterministic, so `delta` drops to exactly `0`. When moves are random the values only get closer and closer, and the tolerance is what lets the loop stop.",
        },
      ],
    },
    {
      title: "Try it: watch the values spread",
      blocks: [
        {
          kind: "text",
          text: "Run value iteration and step through the sweeps: the heatmap shows `V_grid` filling in from the goal, and the chart shows `delta` falling. Move the goal and the pit, and change the discount.",
        },
        {
          kind: "playground",
          demo: {
            title: "Value iteration on the grid",
            controls: [
              {
                type: "select",
                name: "layout",
                label: "Goal and pit",
                options: [
                  { label: "Goal top right, pit below it", value: "3, 7" },
                  { label: "Goal bottom left, pit in the middle", value: "8, 5" },
                  { label: "Goal top right, no pit", value: "3, -1" },
                ],
              },
              { type: "number", name: "g", label: "gamma × 100", min: 50, max: 99, initial: 90 },
            ],
            template: [gridCode({ goalPit: "{{layout}}", gamma: "{{g}} / 100" }), "tol = 1e-4", VALUE_ITERATION].join("\n"),
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
            "Value iteration repeats Bellman sweeps, starting from `V` all zeros.",
            "`delta = np.max(np.abs(V_new - V))` is the largest change in one sweep.",
            "Stop when `delta < tol`: the values have converged.",
            "Each sweep carries value one step further from the goal.",
            "Count the sweeps to see how long convergence took.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "value-iteration-03-q1",
      question: "What does `delta` measure after a sweep?",
      options: [
        "The average value of all states",
        "The largest change of any state's value in that sweep",
        "The number of states that changed",
        "The distance to the goal",
      ],
      answer: 1,
      explanation: "`np.max(np.abs(V_new - V))` is the biggest move of any single value.",
    },
    {
      id: "value-iteration-03-q2",
      question: "Why does a state far from the goal need several sweeps before its value is right?",
      options: [
        "Each sweep only looks one step ahead, so the goal's reward moves one cell per sweep",
        "Far states are updated less often",
        "The discount makes the loop slower",
      ],
      answer: 0,
      explanation: "A state learns from its neighbours, which must have learned from theirs in an earlier sweep.",
    },
    {
      id: "value-iteration-03-q3",
      question: "A loop is written `while delta >= tol:` but `delta` is never assigned inside it. What happens?",
      options: [
        "It stops after one sweep",
        "It never stops, because `delta` never changes",
        "It stops when the values converge",
      ],
      answer: 1,
      explanation: "The stop test only works if every sweep stores its own `delta`.",
    },
  ],
};
