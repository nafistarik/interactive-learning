import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "Put every feature on the same scale with `(X - X.mean(axis=0)) / X.std(axis=0)`, the standardization step used before training many models.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What standardization is",
      blocks: [
        {
          kind: "text",
          text: "Standardizing a feature means subtracting its mean and dividing by its standard deviation. Afterwards the feature has mean 0 and standard deviation 1.",
        },
        {
          kind: "text",
          text: "Each new value says how many standard deviations the original was above or below the average. These values are also called z-scores.",
        },
      ],
    },
    {
      title: "Why machine learning standardizes features",
      blocks: [
        {
          kind: "text",
          text: "Features are often measured on very different scales. Age might range from 20 to 60, while income in dollars ranges over tens of thousands.",
        },
        {
          kind: "text",
          text: "Many methods, such as gradient descent or anything based on distances, then treat the large-number feature as far more important. Standardizing puts all features on a comparable scale first.",
        },
      ],
    },
    {
      title: "Column statistics",
      blocks: [
        {
          kind: "text",
          text: "With one row per example and one column per feature, the statistics of each feature are reductions along axis 0. Here the columns are age and income in thousands.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[35.0, 50.0], [29.0, 30.0], [27.0, 110.0], [29.0, 50.0]])",
            "print(X.mean(axis=0))",
            "print(X.std(axis=0))",
          ].join("\n"),
          output: ["[30. 60.]", "[ 3. 30.]"].join("\n"),
        },
        {
          kind: "text",
          text: "Both results have shape `(2,)`, one value per column. That broadcasts against `X` of shape `(4, 2)` without `keepdims`.",
        },
      ],
    },
    {
      title: "Standardizing in one line",
      blocks: [
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.array([[35.0, 50.0], [29.0, 30.0], [27.0, 110.0], [29.0, 50.0]])",
            "Z = (X - X.mean(axis=0)) / X.std(axis=0)",
            "print(np.round(Z, 2).tolist())",
            "print(np.allclose(Z.mean(axis=0), 0))",
            "print(np.allclose(Z.std(axis=0), 1))",
          ].join("\n"),
          output: [
            "[[1.67, -0.33], [-0.33, -1.0], [-1.0, 1.67], [-0.33, -0.33]]",
            "True",
            "True",
          ].join("\n"),
        },
        {
          kind: "text",
          text: "The first person is 1.67 standard deviations older than average, and the third earns 1.67 standard deviations more. Both features now speak the same units.",
        },
        {
          kind: "note",
          text: "`np.allclose` checks that values are equal up to tiny rounding errors. The means come out as numbers like `1e-17` rather than exactly 0, which is normal for floats.",
        },
        {
          kind: "note",
          text: "A column where every value is the same has standard deviation 0, and dividing by it gives `nan`. Check for constant features before you standardize.",
        },
      ],
    },
    {
      title: "Practical example: get the axis right",
      blocks: [
        {
          kind: "text",
          text: "Compare column and row statistics: only `axis=0` standardizes the features, since row means fail to broadcast without `keepdims` and mix age with income with it.",
        },
        {
          kind: "playground",
          demo: {
            title: "Standardize features",
            controls: [
              {
                type: "select",
                name: "stats",
                label: "Statistics",
                options: [
                  { label: "axis=0 (per column)", value: "axis=0" },
                  { label: "axis=1 (per row)", value: "axis=1" },
                  { label: "axis=1, keepdims=True", value: "axis=1, keepdims=True" },
                ],
              },
              {
                type: "select",
                name: "expr",
                label: "Step",
                options: [
                  { label: "(X - mu) / sigma", value: "(X - mu) / sigma" },
                  { label: "X - mu", value: "X - mu" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "X = np.array([[35.0, 50.0], [29.0, 30.0], [27.0, 110.0], [29.0, 50.0]])",
              "mu = X.mean({{stats}})",
              "sigma = X.std({{stats}})",
              "Z = {{expr}}",
            ].join("\n"),
          },
        },
        {
          kind: "note",
          text: "In a real project, compute the mean and standard deviation on the training data only, then reuse those same numbers to standardize any new data.",
        },
      ],
    },
    {
      title: "Recap",
      blocks: [
        {
          kind: "list",
          items: [
            "Standardizing a feature subtracts its mean and divides by its standard deviation.",
            "With examples as rows, feature statistics use `axis=0`.",
            "`(X - X.mean(axis=0)) / X.std(axis=0)` gives each column mean 0 and std 1.",
            "It puts features measured on different scales on a comparable footing.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "reductions-04-q1",
      question: "After standardizing a feature, what are its mean and standard deviation?",
      options: ["Mean 1, std 0", "Mean 0, std 1", "Mean 0, std 0", "They stay the same"],
      answer: 1,
      explanation: "Subtracting the mean moves it to 0, and dividing by the std scales the spread to 1.",
    },
    {
      id: "reductions-04-q2",
      question: "Rows are examples, columns are features. Which line standardizes the features?",
      options: [
        "(X - X.mean()) / X.std()",
        "(X - X.mean(axis=1)) / X.std(axis=1)",
        "(X - X.mean(axis=0)) / X.std(axis=0)",
      ],
      answer: 2,
      explanation: "Feature statistics come from each column, which is a reduction along axis 0.",
    },
    {
      id: "reductions-04-q3",
      question: "Why do many models work better on standardized features?",
      options: [
        "Features on large scales no longer dominate the ones on small scales",
        "It removes examples with errors",
        "It makes the dataset smaller",
      ],
      answer: 0,
      explanation: "After standardizing, every feature has a comparable spread, whatever its original units.",
    },
  ],
};
