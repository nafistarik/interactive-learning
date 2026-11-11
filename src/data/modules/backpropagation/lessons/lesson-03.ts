import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "A gradient check compares the analytic gradient from your formulas with a numeric one from central differences, parameter by parameter. A small relative error means the formulas are right; a large one points to a bug.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What a gradient check is",
      blocks: [
        {
          kind: "note",
          text: "The analytic gradient comes from the chain-rule formulas. The numeric gradient nudges one parameter at a time: `(loss(w + h) - loss(w - h)) / (2 * h)`, a central difference. A gradient check compares the two.",
        },
        {
          kind: "text",
          text: "With many parameters, the numeric gradient nudges each one in turn, keeping the others fixed, and fills one slope per parameter.",
        },
      ],
    },
    {
      title: "Why check gradients",
      blocks: [
        {
          kind: "text",
          text: "A wrong backward formula raises no error. Training still runs, just slower or in the wrong direction, and the bug is hard to see from the loss curve.",
        },
        {
          kind: "text",
          text: "The numeric gradient is slow but needs only the forward pass, so it is a reliable reference. Run the check once on a small example after writing a backward pass.",
        },
      ],
    },
    {
      title: "Comparing with a relative error",
      blocks: [
        {
          kind: "text",
          text: "Gradients can be large or tiny, so an absolute difference says little. The relative error divides the difference by the sizes of both gradients.",
        },
        {
          kind: "list",
          items: [
            "`np.linalg.norm(v)` is the length of a vector: the square root of the sum of its squared entries.",
            "`rel_error = np.linalg.norm(a - n) / (np.linalg.norm(a) + np.linalg.norm(n))` for analytic `a` and numeric `n`.",
            "It is 0 when the two agree, and 1 when one is the negative of the other.",
          ],
        },
        {
          kind: "text",
          text: "The numeric gradient loops over the parameters: copy `w`, nudge entry `i` up and down, and take the central difference.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1.0, 2.0], [0.5, -1.0], [-1.5, 0.5]])",
            "y = np.array([1.0, 0.0, -0.5])",
            "w = np.array([0.5, -0.25])",
            "b = 0.1",
            "",
            "def loss(w):",
            "    pred = np.tanh(X @ w + b)",
            "    return np.mean((pred - y) ** 2)",
            "",
            "def numeric_grad(w, h=1e-5):",
            "    grad = np.zeros_like(w)",
            "    for i in range(len(w)):",
            "        w_plus = w.copy()",
            "        w_plus[i] += h",
            "        w_minus = w.copy()",
            "        w_minus[i] -= h",
            "        grad[i] = (loss(w_plus) - loss(w_minus)) / (2 * h)",
            "    return grad",
            "",
            "pred = np.tanh(X @ w + b)",
            "dz = 2 * (pred - y) / len(y) * (1 - pred * pred)",
            "analytic = X.T @ dz",
            "numeric = numeric_grad(w)",
            "rel_error = np.linalg.norm(analytic - numeric) / (np.linalg.norm(analytic) + np.linalg.norm(numeric))",
            "print(np.round(analytic, 4), np.round(numeric, 4))",
            "print(rel_error < 1e-6)",
          ].join("\n"),
          output: ["[-0.3803 -1.4721] [-0.3803 -1.4721]", "True"].join("\n"),
        },
        {
          kind: "text",
          text: "These are the values of lesson 02's batch example. The `copy()` matters: nudging `w` itself would leave it changed for the next parameter.",
        },
      ],
    },
    {
      title: "Catching a wrong formula",
      blocks: [
        {
          kind: "text",
          text: "Two common bugs: dropping the `2` of the squared error, and flipping `pred - y` to `y - pred`. The check exposes both.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[1.0, 2.0], [0.5, -1.0], [-1.5, 0.5]])",
            "y = np.array([1.0, 0.0, -0.5])",
            "w = np.array([0.5, -0.25])",
            "b = 0.1",
            "",
            "def loss(w):",
            "    pred = np.tanh(X @ w + b)",
            "    return np.mean((pred - y) ** 2)",
            "",
            "def numeric_grad(w, h=1e-5):",
            "    grad = np.zeros_like(w)",
            "    for i in range(len(w)):",
            "        w_plus = w.copy()",
            "        w_plus[i] += h",
            "        w_minus = w.copy()",
            "        w_minus[i] -= h",
            "        grad[i] = (loss(w_plus) - loss(w_minus)) / (2 * h)",
            "    return grad",
            "",
            "def rel_error(a, n):",
            "    return np.linalg.norm(a - n) / (np.linalg.norm(a) + np.linalg.norm(n))",
            "",
            "pred = np.tanh(X @ w + b)",
            "numeric = numeric_grad(w)",
            "no_two = X.T @ ((pred - y) / len(y) * (1 - pred * pred))",
            "flipped = X.T @ (2 * (y - pred) / len(y) * (1 - pred * pred))",
            "print(round(float(rel_error(no_two, numeric)), 4))",
            "print(round(float(rel_error(flipped, numeric)), 4))",
          ].join("\n"),
          output: ["0.3333", "1.0"].join("\n"),
        },
        {
          kind: "text",
          text: "Half the right gradient gives `0.5 / 1.5`, a third; the opposite sign gives 1. The correct formula gave an error below `1e-6`, so the gap is easy to see.",
        },
      ],
    },
    {
      title: "Try it: the size of the nudge",
      blocks: [
        {
          kind: "text",
          text: "The loop tries `h = 10 ** -k` for `k` from 1 to 12 on one weight and records `log_error`, the base-10 logarithm of the relative error (-6 means `1e-6`). With the correct formula, watch it fall, then rise again for tiny `h`; then pick a wrong formula.",
        },
        {
          kind: "note",
          text: "For a tiny `h` the two losses agree in almost all their digits, so their difference loses precision. A middle value such as `1e-5` is the usual choice.",
        },
        {
          kind: "playground",
          demo: {
            title: "Relative error for each h",
            controls: [
              {
                type: "select",
                name: "formula",
                label: "analytic dw",
                options: [
                  { label: "correct", value: "2 * (pred - y) * (1 - pred * pred) * x" },
                  { label: "missing the 2", value: "(pred - y) * (1 - pred * pred) * x" },
                  { label: "wrong sign", value: "2 * (y - pred) * (1 - pred * pred) * x" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "x, y, w, b = 1.5, 0.5, 0.8, 0.1",
              "pred = np.tanh(w * x + b)",
              "analytic = {{formula}}",
              "for k in range(1, 13):",
              "    h = 10.0 ** -k",
              "    up = np.tanh((w + h) * x + b) - y",
              "    down = np.tanh((w - h) * x + b) - y",
              "    numeric = (up * up - down * down) / (2 * h)",
              "    rel_error = abs(numeric - analytic) / (abs(numeric) + abs(analytic))",
              "    log_error = np.log10(rel_error)",
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
            "Numeric gradient: nudge one parameter at a time, `(loss(w + h) - loss(w - h)) / (2 * h)`, on a copy of `w`.",
            "Compare with `np.linalg.norm(a - n) / (np.linalg.norm(a) + np.linalg.norm(n))`.",
            "A correct formula gives a tiny relative error; a missing factor or a wrong sign gives one near 1.",
            "Use a middle `h` such as `1e-5`: too large is inexact, too small loses precision.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "backpropagation-03-q1",
      question: "Why does the numeric gradient nudge a copy of `w` rather than `w` itself?",
      options: [
        "Copies are faster",
        "So each nudge starts from the original values and the other parameters stay fixed",
        "NumPy arrays cannot be changed",
      ],
      answer: 1,
      explanation: "Nudging `w` in place would leave earlier nudges in it and change every later slope.",
    },
    {
      id: "backpropagation-03-q2",
      question: "Your analytic gradient is exactly twice the numeric one. What is the relative error?",
      options: ["`0`", "`0.5`", "`1 / 3`", "`2`"],
      answer: 2,
      explanation: "The difference has the size of `n` and the sizes add up to `3 * n`: `1 / 3`.",
    },
    {
      id: "backpropagation-03-q3",
      question: "What happens to the numeric gradient when `h` is extremely small, such as `1e-12`?",
      options: [
        "It becomes exact",
        "It loses precision, because the two losses agree in almost every digit",
        "It always becomes 0",
      ],
      answer: 1,
      explanation: "Subtracting two nearly equal numbers keeps only a few correct digits, so the error grows again.",
    },
  ],
};
