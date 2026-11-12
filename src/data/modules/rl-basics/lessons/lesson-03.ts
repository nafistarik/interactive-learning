import type { LessonContent } from "@/features/content/types";

import { GRID_LABELS, GRID_WORLD } from "../grid-world";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "An episode is a loop: pick an action, call `step`, record the reward, and stop when `done` or at a step limit. Counting the visits to each cell shows where a policy takes the agent.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What an episode is in code",
      blocks: [
        {
          kind: "text",
          text: "An episode starts the agent in the start state and repeats one step at a time: the policy picks an action, `step` answers, and the answer becomes the new state.",
        },
        {
          kind: "text",
          text: "The loop ends when `step` returns `done = True`, or after `max_steps` steps. What we keep from it is the record of the run: the states visited and the rewards collected.",
        },
      ],
    },
    {
      title: "Why a step limit and a seed",
      blocks: [
        {
          kind: "text",
          text: "A policy may never reach a terminal state, for example one that keeps walking into a wall. The step limit guarantees the loop finishes.",
        },
        {
          kind: "text",
          text: "A random policy is the usual starting point, since the agent knows nothing yet. Creating it with `rng = np.random.default_rng(0)` makes the random actions the same on every run, so results can be checked and compared.",
        },
      ],
    },
    {
      title: "Running an episode",
      blocks: [
        {
          kind: "text",
          text: "Here the policy is a fixed list of actions: right three times, then down three times. The grid and `step` are the ones from the last lesson.",
        },
        {
          kind: "code",
          code: [
            GRID_WORLD,
            "",
            "actions = [1, 1, 1, 2, 2, 2]  # right three times, then down three times",
            "state = 0",
            "states = [state]",
            "rewards = []",
            "for action in actions:",
            "    state, reward, done = step(state, action)",
            "    states.append(state)",
            "    rewards.append(reward)",
            "    if done:",
            "        break",
            "print(states)",
            "print(rewards)",
          ].join("\n"),
          output: ["[0, 1, 2, 3, 7, 11, 15]", "[0, 0, 0, 0, 0, 1]"].join("\n"),
        },
        {
          kind: "text",
          text: "The path runs along the top row and down the right edge, past the pit, and ends on the goal. There is one reward per step, and one more state than rewards because the start is included.",
        },
      ],
    },
    {
      title: "A random policy and a visit count",
      blocks: [
        {
          kind: "text",
          text: "Now each action comes from `rng.integers(4)`, a random integer from 0 to 3, with at most 20 steps.",
        },
        {
          kind: "code",
          code: [
            GRID_WORLD,
            "",
            "rng = np.random.default_rng(0)",
            "max_steps = 20",
            "state = 0",
            "states = [state]",
            "rewards = []",
            "for t in range(max_steps):",
            "    action = int(rng.integers(4))",
            "    state, reward, done = step(state, action)",
            "    states.append(state)",
            "    rewards.append(reward)",
            "    if done:",
            "        break",
            "print(len(rewards), done)",
            "print(states)",
            "print(rewards)",
          ].join("\n"),
          output: [
            "11 True",
            "[0, 0, 4, 8, 9, 10, 6, 2, 2, 2, 1, 5]",
            "[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1]",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "With this seed the agent wanders for 11 steps and falls into the pit, state 5. A list of states is hard to read, so we count the visits to each cell in a grid of the same shape.",
        },
        {
          kind: "text",
          text: "`cells == state` is a boolean grid with one `True` at the agent's cell; adding it to `visits` adds 1 there. The start cell counts as the first visit.",
        },
        {
          kind: "code",
          code: [
            GRID_WORLD,
            "",
            "cells = np.arange(rows * cols).reshape(rows, cols)",
            "rng = np.random.default_rng(0)",
            "state = 0",
            "visits = np.zeros((rows, cols), dtype=int)",
            "visits = visits + (cells == state)",
            "for t in range(20):",
            "    action = int(rng.integers(4))",
            "    state, reward, done = step(state, action)",
            "    visits = visits + (cells == state)",
            "    if done:",
            "        break",
            "print(visits)",
            "print(int(visits.sum()))",
          ].join("\n"),
          output: ["[[2 1 3 0]", " [1 1 1 0]", " [1 1 1 0]", " [0 0 0 0]]", "12"].join("\n"),
        },
        {
          kind: "note",
          text: "`visits[row, col] += 1` counts the same way in place. We write `visits = visits + (cells == state)` because the loop view follows the names a loop assigns, so the heatmap can show `visits` at every iteration.",
        },
      ],
    },
    {
      title: "Try it: where does the agent go",
      blocks: [
        {
          kind: "text",
          text: "Pick a policy, a seed and a step limit, then step through the episode and watch the `visits` heatmap fill in. Random play usually ends in the pit next to the start; with seed 3 and a limit of 30 it reaches the goal.",
        },
        {
          kind: "playground",
          demo: {
            title: "Visits during one episode",
            controls: [
              {
                type: "select",
                name: "policy",
                label: "Policy",
                options: [
                  { label: "Random", value: "int(rng.integers(4))" },
                  { label: "Right, then down", value: "1 if t < 3 else 2" },
                  { label: "Down, then right", value: "2 if t < 3 else 1" },
                  { label: "Always right", value: "1" },
                ],
              },
              { type: "number", name: "seed", label: "Seed", min: 0, max: 9, initial: 0 },
              { type: "number", name: "max_steps", label: "Step limit", min: 1, max: 30, initial: 20 },
            ],
            template: [
              GRID_WORLD,
              "",
              "cells = np.arange(rows * cols).reshape(rows, cols)",
              "rng = np.random.default_rng({{seed}})",
              "state = 0",
              "visits = np.zeros((rows, cols), dtype=int)",
              "visits = visits + (cells == state)",
              "for t in range({{max_steps}}):",
              "    action = {{policy}}",
              "    state, reward, done = step(state, action)",
              "    visits = visits + (cells == state)",
              "    if done:",
              "        break",
            ].join("\n"),
            chart: { kind: "heatmap", matrix: "visits", ...GRID_LABELS },
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
            "An episode loops: the policy picks an action, `step` answers, the new state replaces the old one.",
            "Stop on `done`, and always give the loop a step limit.",
            "A seeded `rng = np.random.default_rng(0)` gives the same random actions on every run.",
            "A visit-count grid, `visits = visits + (cells == state)`, shows where a policy takes the agent.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "rl-basics-03-q1",
      question: "Why does the episode loop need a step limit?",
      options: [
        "To make the agent faster",
        "Because `step` fails after 20 calls",
        "Because a policy may never reach a terminal state",
        "To keep the rewards positive",
      ],
      answer: 2,
      explanation: "A policy that keeps walking into a wall never gets `done = True`; the limit ends the loop.",
    },
    {
      id: "rl-basics-03-q2",
      question: "An episode took 7 steps. With the start counted as a visit, what is `visits.sum()`?",
      options: ["6", "7", "8", "16"],
      answer: 2,
      explanation: "One visit for the start plus one for the cell entered at each of the 7 steps.",
    },
    {
      id: "rl-basics-03-q3",
      question: "What does seeding the generator with `np.random.default_rng(0)` give you?",
      options: [
        "Actions that are no longer random",
        "The same sequence of random actions on every run",
        "A policy that avoids the pit",
        "Actions from 0 to 0 only",
      ],
      answer: 1,
      explanation: "The actions still look random, but the same seed repeats the same sequence, so runs can be compared.",
    },
  ],
};
