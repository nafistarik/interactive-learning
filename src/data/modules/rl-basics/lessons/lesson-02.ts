import type { LessonContent } from "@/features/content/types";

import { GRID, GRID_LABELS, GRID_WORLD } from "../grid-world";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "A grid world is a 2D array of rewards: each cell is a state, numbered `row * cols + col`, and the agent moves up, right, down or left. A `step` function moves it, stops it at the walls and reports the reward.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What a grid world is",
      blocks: [
        {
          kind: "text",
          text: "A grid world is a board of cells. The agent stands in one cell and moves one cell up, right, down or left per step.",
        },
        {
          kind: "text",
          text: "We store it as a 2D NumPy array `grid` that holds the reward for arriving in each cell. Our 4 × 4 grid has a goal worth `1` in the bottom-right corner, a pit worth `-1` at row 1, column 1, and `0` everywhere else.",
        },
        {
          kind: "note",
          text: "Both the goal and the pit are terminal states: arriving in a cell whose reward is not 0 ends the episode. The agent starts in the top-left cell.",
        },
      ],
    },
    {
      title: "Why a small grid world",
      blocks: [
        {
          kind: "text",
          text: "A grid world is small enough to see all at once, yet it already has the hard part of reinforcement learning: the reward sits several steps away, and a wrong turn can end in the pit.",
        },
        {
          kind: "text",
          text: "The rest of Phase 4 uses this same grid. Value tables and Q-tables need the states numbered `0` to `n - 1` so a state can index an array, and that numbering is set up here.",
        },
      ],
    },
    {
      title: "Numbering the cells",
      blocks: [
        {
          kind: "text",
          text: "Counting cells row by row gives state `s = row * cols + col`. Going back, `divmod(s, cols)` returns the row and the column; `np.unravel_index` does the same for any shape.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            GRID,
            "rows, cols = grid.shape",
            "cells = np.arange(rows * cols).reshape(rows, cols)",
            "print(cells)",
            "",
            "state = 6",
            "print(divmod(state, cols))",
            "row, col = np.unravel_index(state, grid.shape)",
            "print(int(row), int(col), int(grid[row, col]))",
            "print(int(np.ravel_multi_index((3, 3), grid.shape)))",
          ].join("\n"),
          output: [
            "[[ 0  1  2  3]",
            " [ 4  5  6  7]",
            " [ 8  9 10 11]",
            " [12 13 14 15]]",
            "(1, 2)",
            "1 2 0",
            "15",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "`cells` shows the state number of every cell: the pit is state 5 and the goal is state 15. `np.ravel_multi_index` goes the other way, from a row and column to the state.",
        },
      ],
    },
    {
      title: "Moving and stopping at walls",
      blocks: [
        {
          kind: "text",
          text: "Action `a` is a row of `moves`: `0` is up `[-1, 0]`, `1` is right `[0, 1]`, `2` is down `[1, 0]` and `3` is left `[0, -1]`. Adding it to the position moves the agent one cell.",
        },
        {
          kind: "text",
          text: "A move off the board would give row `-1` or column `cols`. `np.clip` pulls such a value back to the edge, so moving into a wall leaves the agent where it was.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "rows, cols = 4, 4",
            "moves = np.array([[-1, 0], [0, 1], [1, 0], [0, -1]])  # up, right, down, left",
            "position = np.array([0, 3])  # row 0, column 3: the top-right corner",
            "",
            "for action in range(4):",
            "    target = position + moves[action]",
            "    clipped = np.clip(target, [0, 0], [rows - 1, cols - 1])",
            "    print(action, target.tolist(), clipped.tolist())",
          ].join("\n"),
          output: ["0 [-1, 3] [0, 3]", "1 [0, 4] [0, 3]", "2 [1, 3] [1, 3]", "3 [0, 2] [0, 2]"].join("\n"),
        },
      ],
    },
    {
      title: "The step function",
      blocks: [
        {
          kind: "text",
          text: "The environment fits in one function: `step(state, action)` turns the state into a row and column, moves and clips them, and returns `(next_state, reward, done)`.",
        },
        {
          kind: "code",
          code: [
            GRID_WORLD,
            "",
            "print(step(0, 0))   # up from the top-left corner: a wall",
            "print(step(0, 1))   # right",
            "print(step(1, 2))   # down into the pit",
            "print(step(11, 2))  # down onto the goal",
          ].join("\n"),
          output: ["(0, 0, False)", "(1, 0, False)", "(5, -1, True)", "(15, 1, True)"].join("\n"),
        },
        {
          kind: "text",
          text: "The reward is the grid value of the cell the agent arrives in, and `done` is `True` exactly when that value is not 0. The `int(...)` calls keep the results plain Python numbers.",
        },
      ],
    },
    {
      title: "Try it: one step in every direction",
      blocks: [
        {
          kind: "text",
          text: "Choose a start state and step through the four actions. The heatmap `landed` counts where each action ends: from a corner, two actions hit a wall and land on the start cell itself.",
        },
        {
          kind: "playground",
          demo: {
            title: "Four moves from one cell",
            controls: [{ type: "number", name: "state", label: "Start state", min: 0, max: 15, initial: 3 }],
            template: [
              "import numpy as np",
              "rows, cols = 4, 4",
              "moves = np.array([[-1, 0], [0, 1], [1, 0], [0, -1]])",
              "cells = np.arange(rows * cols).reshape(rows, cols)",
              "row, col = divmod({{state}}, cols)",
              "landed = np.zeros((rows, cols), dtype=int)",
              "for action in range(4):",
              "    target = np.array([row, col]) + moves[action]",
              "    new_row = int(np.clip(target[0], 0, rows - 1))",
              "    new_col = int(np.clip(target[1], 0, cols - 1))",
              "    next_state = new_row * cols + new_col",
              "    landed = landed + (cells == next_state)",
            ].join("\n"),
            chart: { kind: "heatmap", matrix: "landed", ...GRID_LABELS },
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
            "The grid is a 2D array of rewards for arriving in each cell; non-zero cells are terminal.",
            "State `s = row * cols + col`; `divmod(s, cols)` or `np.unravel_index` gives the row and column back.",
            "Actions 0–3 are rows of `moves` (up, right, down, left); `np.clip` keeps the agent on the board.",
            "`step(state, action)` returns `(next_state, reward, done)`: the whole environment in one function.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "rl-basics-02-q1",
      question: "A grid has 4 rows and 5 columns. Which state is row 2, column 3?",
      options: ["11", "13", "14", "23"],
      answer: 1,
      explanation: "`row * cols + col` is `2 * 5 + 3 = 13`; the number of columns is what each row skips.",
    },
    {
      id: "rl-basics-02-q2",
      question: "The agent is in the top row and takes action 0 (up). What happens?",
      options: [
        "The step raises an error",
        "The agent moves to the bottom row",
        "`np.clip` keeps the row at 0, so the agent stays in its cell",
        "The episode ends",
      ],
      answer: 2,
      explanation: "Row `-1` is clipped back to `0`; moving into a wall leaves the agent in place.",
    },
    {
      id: "rl-basics-02-q3",
      question: "In our grid, when does `step` return `done = True`?",
      options: [
        "After every step",
        "When the agent arrives in a cell whose reward is not 0",
        "When the agent hits a wall",
        "Only when the reward is positive",
      ],
      answer: 1,
      explanation: "The goal (`1`) and the pit (`-1`) are both terminal; all other cells are worth `0`.",
    },
  ],
};
