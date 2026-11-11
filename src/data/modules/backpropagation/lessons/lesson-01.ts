import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "A network is a chain of small steps, and the chain rule gives the slope of the whole chain: multiply the slope of each step along the path. Check it with a numeric slope.",
  estimatedMinutes: 12,
  sections: [
    {
      title: "What the chain rule is",
      blocks: [
        {
          kind: "text",
          text: "Many functions are steps applied one after another. `y = (3 * x + 1) ** 2` is two steps: first `u = 3 * x + 1`, then `y = u * u`.",
        },
        {
          kind: "note",
          text: "The local gradient of a step is the slope of its output for its own input, ignoring every other step. The chain rule says: the slope of the whole chain is the product of the local gradients along the path.",
        },
        {
          kind: "text",
          text: "We write slopes as names like `dy_du`: how much `y` changes per small nudge of `u`. For the example, `dy_dx = dy_du * du_dx`.",
        },
      ],
    },
    {
      title: "Why a network needs the chain rule",
      blocks: [
        {
          kind: "text",
          text: "A network turns weights into a loss through many steps: a matrix product, an activation, another layer, the error, a mean. To train it you need the slope of the loss for every weight.",
        },
        {
          kind: "text",
          text: "Nudging each weight on its own costs two forward passes per weight. The chain rule reuses the local gradients of each step, so every slope comes from one forward pass and one pass backwards.",
        },
      ],
    },
    {
      title: "Slopes multiply along the path",
      blocks: [
        {
          kind: "text",
          text: "Nudge `x` by a small `h`. The first step `u = 3 * x + 1` moves `u` by `3 * h`, so `du_dx = 3`.",
        },
        {
          kind: "text",
          text: "The second step `y = u * u` has the slope `2 * u` (Module 1.2 showed that `e * e` changes by about `2 * e` per unit nudge). A nudge of `3 * h` in `u` moves `y` by about `2 * u * 3 * h`.",
        },
        {
          kind: "text",
          text: "So `dy_dx = dy_du * du_dx = 2 * u * 3`. Each local gradient is evaluated at the value its step saw in the forward pass: at `x = 1`, `u = 4` and the slope is `8 * 3 = 24`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = 1.0",
            "u = 3 * x + 1",
            "y = u * u",
            "",
            "du_dx = 3.0",
            "dy_du = 2 * u",
            "dy_dx = dy_du * du_dx",
            "print(u, y)",
            "print(dy_du, du_dx, dy_dx)",
          ].join("\n"),
          output: ["4.0 16.0", "8.0 3.0 24.0"].join("\n"),
        },
      ],
    },
    {
      title: "Checking the product with a numeric slope",
      blocks: [
        {
          kind: "text",
          text: "The numeric slope from Module 1.2 needs no formula: run the function at `x + h` and `x - h` and divide the change by `2 * h`. It should match the product of the local gradients.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "",
            "def f(x):",
            "    return (3 * x + 1) ** 2",
            "",
            "x, h = 1.0, 0.001",
            "numeric = (f(x + h) - f(x - h)) / (2 * h)",
            "print(round(numeric, 4))",
          ].join("\n"),
          output: "24.0",
        },
        {
          kind: "text",
          text: "Longer chains work the same way. `y = (2 * x - 5) ** 2` is three steps with local gradients `2`, `1` and `2 * v`; with arrays, every element gets its own slope.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([-1.0, 0.0, 1.0, 2.0])",
            "u = 2 * x",
            "v = u - 5",
            "y = v * v",
            "dy_dx = (2 * v) * 1.0 * 2.0",
            "print(dy_dx)",
            "",
            "h = 0.001",
            "f = lambda x: (2 * x - 5) ** 2",
            "numeric = (f(x + h) - f(x - h)) / (2 * h)",
            "print(np.round(numeric, 4))",
          ].join("\n"),
          output: ["[-28. -20. -12.  -4.]", "[-28. -20. -12.  -4.]"].join("\n"),
        },
      ],
    },
    {
      title: "Try it: change the first step",
      blocks: [
        {
          kind: "text",
          text: "Pick the slope `a` of the first step `u = a * x + 1` and follow the product to `dy_dx`. A negative `a` flips the sign of every slope; a small `a` shrinks them all.",
        },
        {
          kind: "playground",
          demo: {
            title: "Multiply the local gradients",
            controls: [
              {
                type: "select",
                name: "a",
                label: "a in u = a * x + 1",
                options: [
                  { label: "3.0", value: "3.0" },
                  { label: "0.5", value: "0.5" },
                  { label: "-1.0", value: "-1.0" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "a = {{a}}",
              "x = np.array([-1.0, 0.0, 1.0, 2.0])",
              "u = a * x + 1",
              "y = u * u",
              "du_dx = a",
              "dy_du = 2 * u",
              "dy_dx = dy_du * du_dx",
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
            "Split a function into steps; the local gradient of a step is its slope for its own input.",
            "Chain rule: the slope of the whole chain is the product of the local gradients along the path.",
            "Each local gradient uses the values from the forward pass, such as `dy_du = 2 * u`.",
            "A numeric slope `(f(x + h) - f(x - h)) / (2 * h)` checks the product.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "backpropagation-01-q1",
      question: "`u = 4 * x` and `y = u + 7`. What is `dy_dx`?",
      options: ["`4`", "`7`", "`11`", "`28`"],
      answer: 0,
      explanation: "The local gradients are `du_dx = 4` and `dy_du = 1`; their product is `4`.",
    },
    {
      id: "backpropagation-01-q2",
      question: "`u = 3 * x + 1` and `y = u * u`. At `x = 0`, what is `dy_dx`?",
      options: ["`3`", "`6`", "`2`", "`0`"],
      answer: 1,
      explanation: "At `x = 0`, `u = 1`, so `dy_du = 2 * u = 2` and `dy_dx = 2 * 3 = 6`.",
    },
    {
      id: "backpropagation-01-q3",
      question: "Why does `dy_du = 2 * u` need the forward pass first?",
      options: [
        "It does not; it is a constant",
        "The local gradient depends on the value `u` had in the forward pass",
        "The forward pass sets `h`",
      ],
      answer: 1,
      explanation: "The slope of `u * u` changes with `u`, so it is evaluated at the value the forward pass computed.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "# y = (0.5 * x - 2) ** 2 as two steps: u = 0.5 * x - 2, then y = u * u",
    "x = np.array([0.0, 2.0, 4.0, 6.0])",
    "u = 0.5 * x - 2",
    "y = u * u",
    "",
    "# Multiply the local gradients to get dy_dx, then check it numerically",
    "dy_dx = (2 * u) * 0.5",
    "h = 0.001",
    "f = lambda x: (0.5 * x - 2) ** 2",
    "numeric = (f(x + h) - f(x - h)) / (2 * h)",
    "print(dy_dx)",
    "print(np.round(numeric, 4))",
  ].join("\n"),
};
