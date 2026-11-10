import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "Fit a line by trying many values of `w`, computing the loss of each and keeping the best. Then see why this search breaks down when a model has many parameters.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What fitting by search is",
      blocks: [
        {
          kind: "text",
          text: "Fitting a model means choosing the parameters that make its loss as small as possible on the data. The result is called the fitted model.",
        },
        {
          kind: "text",
          text: "The most direct way to fit is search: make a list of candidate values for `w`, compute the MSE of each, and keep the candidate with the lowest loss.",
        },
        {
          kind: "note",
          text: "In this lesson the bias stays fixed at the base fare, `b = 3.0`, so only `w` is searched. One parameter keeps the search small enough to watch.",
        },
      ],
    },
    {
      title: "Why search is a useful first step",
      blocks: [
        {
          kind: "text",
          text: "Search needs nothing beyond what you already have: predictions, a loss, and a loop. It shows what every fitting method is after, the parameters with the lowest loss.",
        },
        {
          kind: "text",
          text: "Recording the loss of every candidate also shows the shape of the problem: the loss falls towards the best `w` and rises again after it.",
        },
      ],
    },
    {
      title: "The search loop, step by step",
      blocks: [
        {
          kind: "list",
          items: [
            "Make the candidates, for example `np.linspace(0, 5, 11)`: 11 evenly spaced values from 0 to 5.",
            "For each candidate `w`, predict with `pred = w * x + b` and compute `loss = np.mean((pred - y) ** 2)`.",
            "Append each loss to a list `losses`, so there is one loss per candidate.",
            "Keep the candidate whose loss is the lowest so far in `best_w`.",
          ],
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])",
            "y = np.array([5.4, 8.1, 10.4, 13.2, 15.6])",
            "b = 3.0",
            "candidates = np.linspace(0, 5, 11)",
            "losses = []",
            "best_w = candidates[0]",
            "best_loss = None",
            "for w in candidates:",
            "    pred = w * x + b",
            "    loss = np.mean((pred - y) ** 2)",
            "    losses.append(loss)",
            "    if best_loss is None or loss < best_loss:",
            "        best_loss = loss",
            "        best_w = w",
            "print(candidates)",
            "print(np.round(losses, 3).tolist())",
            "print(best_w, np.round(best_loss, 3))",
          ].join("\n"),
          output: [
            "[0.  0.5 1.  1.5 2.  2.5 3.  3.5 4.  4.5 5. ]",
            "[69.866, 44.896, 25.426, 11.456, 2.986, 0.016, 2.546, 10.576, 24.106, 43.136, 67.666]",
            "2.5 0.016",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "The losses fall until `w = 2.5` and rise after it. `best_w` is the candidate at the bottom of that curve.",
        },
      ],
    },
    {
      title: "A practical example: a finer search, and its cost",
      blocks: [
        {
          kind: "text",
          text: "The search can only return one of its candidates. A finer grid between 2 and 3, in steps of 0.01, finds a slightly better `w` with a lower loss.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])",
            "y = np.array([5.4, 8.1, 10.4, 13.2, 15.6])",
            "candidates = np.linspace(2, 3, 101)",
            "losses = []",
            "for w in candidates:",
            "    losses.append(np.mean((w * x + 3.0 - y) ** 2))",
            "best = int(np.argmin(losses))",
            "print(len(candidates), candidates[best], np.round(losses[best], 4))",
          ].join("\n"),
          output: "101 2.52 0.0116",
        },
        {
          kind: "text",
          text: "`np.argmin` returns the index of the smallest value, a shortcut for the comparison inside the loop. The price of the finer answer is more tries.",
        },
        {
          kind: "text",
          text: "With more parameters the number of tries multiplies. Trying 41 values for each parameter needs 41 tries for one parameter, 41 times 41 for two, and so on.",
        },
        {
          kind: "code",
          code: ["print(41 ** 1)", "print(41 ** 2)", "print(41 ** 3)", "print(41 ** 10)"].join("\n"),
          output: ["41", "1681", "68921", "13422659310152401"].join("\n"),
        },
        {
          kind: "note",
          text: "A model with 10 weights would need over 10^16 loss computations this way. Module 1.2 replaces the search with gradient descent, which uses the loss to decide which way to move each parameter.",
        },
      ],
    },
    {
      title: "Try it: watch the search",
      blocks: [
        {
          kind: "text",
          text: "Choose how many candidates to try between 0 and 5. Step through the iterations to see the line move and the loss of each candidate; with few candidates, the best one can be far from 2.5.",
        },
        {
          kind: "playground",
          demo: {
            title: "Fitting a line by search",
            controls: [{ type: "number", name: "n", label: "Number of candidates", min: 3, max: 41, initial: 11 }],
            template: [
              "import numpy as np",
              "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])",
              "y = np.array([5.4, 8.1, 10.4, 13.2, 15.6])",
              "b = 3.0",
              "candidates = np.linspace(0, 5, {{n}})",
              "losses = []",
              "for w in candidates:",
              "    pred = w * x + b",
              "    loss = np.mean(np.square(pred - y))",
              "    losses.append(loss)",
              "best_w = candidates[np.argmin(losses)]",
            ].join("\n"),
            chart: { kind: "fit", x: "x", y: "y", prediction: "pred" },
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
            "Fitting means choosing the parameters with the lowest loss on the data.",
            "Search tries each candidate `w`, records its loss, and keeps the lowest.",
            "The answer is only as precise as the grid of candidates.",
            "The number of tries multiplies with every parameter, so search does not scale; gradient descent comes next.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "linear-regression-04-q1",
      question: "After the search loop, which candidate is `best_w`?",
      options: [
        "The last candidate in the list",
        "The candidate with the largest loss",
        "The candidate with the lowest loss",
        "The average of all candidates",
      ],
      answer: 2,
      explanation: "The loop keeps the candidate whose loss is the smallest.",
    },
    {
      id: "linear-regression-04-q2",
      question: "A search tries 20 values for each of 3 parameters. How many loss computations does it need?",
      options: ["8000", "60", "23"],
      answer: 0,
      explanation: "Every combination is tried: `20 * 20 * 20 = 8000`.",
    },
    {
      id: "linear-regression-04-q3",
      question: "The best candidate is `w = 2.5`, but the true best value is `2.52`. Why did the search miss it?",
      options: [
        "The loss was computed wrongly",
        "`2.52` was not one of the candidates",
        "Search always returns the middle candidate",
      ],
      answer: 1,
      explanation: "Search can only return a value from its grid.",
    },
  ],
};
