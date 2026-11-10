import type { LessonContent } from "@/features/content/types";

export const LESSON_04: LessonContent = {
  lessonId: "04",
  summary:
    "scikit-learn fits the same models you built from scratch. Fitting both on the same data checks your code and shows what the library does for you.",
  estimatedMinutes: 16,
  sections: [
    {
      title: "What scikit-learn is",
      blocks: [
        {
          kind: "text",
          text: "scikit-learn is a Python library of tested machine learning models, imported as `sklearn`. Its `LinearRegression` fits the model from Module 1.1, `y_hat = w * x + b`.",
        },
        {
          kind: "text",
          text: "`fit(X, y)` learns the parameters: afterwards `coef_` holds the weights `w` and `intercept_` holds the bias `b`. `predict(X)` computes `y_hat` for any rows.",
        },
        {
          kind: "note",
          text: "scikit-learn expects `X` as a 2D array, one row per example and one column per feature. `x.reshape(-1, 1)` turns 8 values into shape `(8, 1)`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "from sklearn.linear_model import LinearRegression",
            "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0])",
            "y = np.array([3.1, 4.9, 7.2, 8.8, 11.1, 13.0, 14.8, 17.1])",
            "X = x.reshape(-1, 1)",
            "model = LinearRegression()",
            "model.fit(X, y)",
            "print(X.shape)",
            "print(round(float(model.coef_[0]), 3), round(float(model.intercept_), 3))",
            "print(np.round(model.predict(np.array([[9.0]])), 3))",
          ].join("\n"),
          output: ["(8, 1)", "1.99 1.043", "[18.957]"].join("\n"),
        },
        {
          kind: "text",
          text: "The first time code imports `sklearn`, the app downloads the library, which can take a moment.",
        },
      ],
    },
    {
      title: "Why compare with a library",
      blocks: [
        {
          kind: "text",
          text: "A from-scratch model can have a bug and still print plausible numbers. A library model fitted on the same data gives a reference to compare against.",
        },
        {
          kind: "text",
          text: "When the two agree, you know your code works, and you know what the library call computes. In real projects you then use the library: it is tested, fast and handles many features.",
        },
      ],
    },
    {
      title: "Your gradient descent against LinearRegression",
      blocks: [
        {
          kind: "text",
          text: "Train `w` and `b` with the gradient descent loop from Module 1.2, then fit `LinearRegression` on the same data.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "from sklearn.linear_model import LinearRegression",
            "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0])",
            "y = np.array([3.1, 4.9, 7.2, 8.8, 11.1, 13.0, 14.8, 17.1])",
            "w, b = 0.0, 0.0",
            "for step in range(3000):",
            "    y_hat = w * x + b",
            "    w -= 0.02 * 2 * np.mean((y_hat - y) * x)",
            "    b -= 0.02 * 2 * np.mean(y_hat - y)",
            "print(round(float(w), 3), round(float(b), 3))",
            "model = LinearRegression().fit(x.reshape(-1, 1), y)",
            "print(round(float(model.coef_[0]), 3), round(float(model.intercept_), 3))",
          ].join("\n"),
          output: ["1.99 1.043", "1.99 1.043"].join("\n"),
        },
        {
          kind: "text",
          text: "They agree to three decimals. `LinearRegression` does not loop: it solves for the `w` and `b` with the lowest MSE directly, so there is no learning rate or step count to choose.",
        },
        {
          kind: "text",
          text: "Trained values are compared with a tolerance, such as a difference below `0.001`, because a loop gets close to the exact answer without hitting every digit.",
        },
      ],
    },
    {
      title: "A practical example: checking your metrics",
      blocks: [
        {
          kind: "text",
          text: "`sklearn.metrics` computes the evaluation numbers of this module. Run it on the arrays from lesson 02, where you counted 4 TP, 1 FP, 4 TN and 1 FN.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "from sklearn.metrics import accuracy_score, confusion_matrix, precision_score, recall_score",
            "y = np.array([1, 0, 1, 1, 0, 0, 1, 0, 1, 0])",
            "pred = np.array([1, 0, 0, 1, 0, 1, 1, 0, 1, 0])",
            "print(float(accuracy_score(y, pred)), float(precision_score(y, pred)), float(recall_score(y, pred)))",
            "print(confusion_matrix(y, pred))",
          ].join("\n"),
          output: ["0.8 0.8 0.8", "[[4 1]", " [1 4]]"].join("\n"),
        },
        {
          kind: "text",
          text: "Accuracy `8 / 10`, precision `4 / 5` and recall `4 / 5` match the counts. `confusion_matrix` uses the layout `[[tn, fp], [fn, tp]]`, the same as in lesson 02.",
        },
      ],
    },
    {
      title: "Try it: train toward the library's answer",
      blocks: [
        {
          kind: "text",
          text: "The first printed line is scikit-learn's answer; the loop below it is your gradient descent. Lower the steps or the learning rate and watch the line stop short of the library's `w` and `b`.",
        },
        {
          kind: "playground",
          demo: {
            title: "Gradient descent and LinearRegression",
            controls: [
              {
                type: "select",
                name: "lr",
                label: "Learning rate",
                options: [
                  { label: "0.02", value: "0.02" },
                  { label: "0.005", value: "0.005" },
                  { label: "0.001 (slow)", value: "0.001" },
                ],
              },
              { type: "number", name: "steps", label: "Steps", min: 10, max: 3000, initial: 1000 },
            ],
            template: [
              "import numpy as np",
              "from sklearn.linear_model import LinearRegression",
              "x = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0])",
              "y = np.array([3.1, 4.9, 7.2, 8.8, 11.1, 13.0, 14.8, 17.1])",
              "model = LinearRegression().fit(x.reshape(-1, 1), y)",
              'print("sklearn:      w =", round(float(model.coef_[0]), 3), " b =", round(float(model.intercept_), 3))',
              "w, b = 0.0, 0.0",
              "for step in range({{steps}}):",
              "    y_hat = w * x + b",
              "    w -= {{lr}} * 2 * np.mean((y_hat - y) * x)",
              "    b -= {{lr}} * 2 * np.mean(y_hat - y)",
              'print("from scratch: w =", round(float(w), 3), " b =", round(float(b), 3))',
            ].join("\n"),
            chart: { kind: "fit", x: "x", y: "y", prediction: "y_hat" },
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
            "`LinearRegression().fit(X, y)` learns `coef_` (the weights) and `intercept_` (the bias); `X` must be 2D.",
            "Fitting a library model on the same data checks a from-scratch model.",
            "Trained values match within a tolerance, not digit for digit.",
            "`sklearn.metrics` gives accuracy, precision, recall and the confusion matrix from `y` and `pred`.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "evaluation-04-q1",
      question: "What does `model.fit(X, y)` do for a `LinearRegression`?",
      options: [
        "It finds `coef_` and `intercept_` that fit the data",
        "It prints the predictions",
        "It splits the data into train and test sets",
      ],
      answer: 0,
      explanation: "`fit` learns the parameters; `predict` uses them.",
    },
    {
      id: "evaluation-04-q2",
      question: "Why does the code call `x.reshape(-1, 1)` before `fit`?",
      options: [
        "scikit-learn only accepts integers",
        "It sorts the data",
        "scikit-learn expects a 2D `X`, one row per example and one column per feature",
      ],
      answer: 2,
      explanation: "A 1D `x` of 8 values becomes 8 rows with one feature each.",
    },
    {
      id: "evaluation-04-q3",
      question: "Your loop gives `w = 1.62` and `LinearRegression` gives `1.99` on the same data. What is a likely reason?",
      options: [
        "scikit-learn used different data",
        "The loop stopped before it converged, or the gradient has a bug",
        "Gradient descent can never match a library",
      ],
      answer: 1,
      explanation: "With enough steps and a working gradient, the loop reaches the library's answer.",
    },
    {
      id: "evaluation-04-q4",
      question: "How do `precision_score(y, pred)` and your own `tp / (tp + fp)` compare on the same arrays?",
      options: [
        "They differ, because the library rounds",
        "The library's is always larger",
        "They are the same number",
      ],
      answer: 2,
      explanation: "The library counts the same TP and FP as your masks.",
    },
  ],
};
