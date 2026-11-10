import type { LessonContent } from "@/features/content/types";

export const LESSON_02: LessonContent = {
  lessonId: "02",
  summary:
    "Accuracy is the share of predictions that are right. The confusion matrix splits them into four counts, which show what accuracy hides.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What accuracy measures",
      blocks: [
        {
          kind: "text",
          text: "A classifier predicts a label, `0` or `1`, for each example. Accuracy is the share of predictions that equal the true label.",
        },
        {
          kind: "text",
          text: "`pred == y` gives `True` where the prediction is right. `np.mean` of a boolean array counts `True` as 1 and `False` as 0, so it returns that share.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "y = np.array([1, 0, 1, 1, 0, 0, 1, 0, 1, 0])",
            "pred = np.array([1, 0, 0, 1, 0, 1, 1, 0, 1, 0])",
            "correct = pred == y",
            "print(correct)",
            'print(int(correct.sum()), "of", len(y))',
            "print(float(np.mean(correct)))",
          ].join("\n"),
          output: [
            "[ True  True False  True  True False  True  True  True  True]",
            "8 of 10",
            "0.8",
          ].join("\n"),
        },
      ],
    },
    {
      title: "Why accuracy alone can mislead",
      blocks: [
        {
          kind: "text",
          text: "Data is imbalanced when one class is much more common than the other, for example 9 healthy patients and 1 sick one.",
        },
        {
          kind: "text",
          text: "A model that always predicts `0` is then right 9 times out of 10. Its accuracy is high, yet it never finds the one case that matters.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "y = np.array([0, 0, 0, 0, 0, 0, 0, 0, 0, 1])",
            "pred = np.zeros(10, dtype=int)",
            "print(float(np.mean(pred == y)))",
          ].join("\n"),
          output: "0.9",
        },
        {
          kind: "text",
          text: "To see what kind of mistakes a model makes, count right and wrong predictions separately for each class.",
        },
      ],
    },
    {
      title: "The four counts of the confusion matrix",
      blocks: [
        {
          kind: "text",
          text: "Call `1` the positive class (sick, spam) and `0` the negative class. Each prediction falls into one of four cases:",
        },
        {
          kind: "list",
          items: [
            "True positive (TP): predicted `1`, truly `1`.",
            "False positive (FP): predicted `1`, truly `0`, a false alarm.",
            "True negative (TN): predicted `0`, truly `0`.",
            "False negative (FN): predicted `0`, truly `1`, a miss.",
          ],
        },
        {
          kind: "text",
          text: "Each count is a boolean mask summed up. `&` is element-wise \"and\" on boolean arrays: `True` only where both sides are `True`.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "y = np.array([1, 0, 1, 1, 0, 0, 1, 0, 1, 0])",
            "pred = np.array([1, 0, 0, 1, 0, 1, 1, 0, 1, 0])",
            "tp = int(np.sum((pred == 1) & (y == 1)))",
            "fp = int(np.sum((pred == 1) & (y == 0)))",
            "tn = int(np.sum((pred == 0) & (y == 0)))",
            "fn = int(np.sum((pred == 0) & (y == 1)))",
            "print(tp, fp, tn, fn)",
            "print(tp + fp + tn + fn)",
            "print((tp + tn) / len(y))",
          ].join("\n"),
          output: ["4 1 4 1", "10", "0.8"].join("\n"),
        },
        {
          kind: "note",
          text: "Keep the parentheses in `(pred == 1) & (y == 1)`. Python applies `&` before `==`, so without them it computes `1 & y` first.",
        },
        {
          kind: "text",
          text: "The four counts add up to the number of examples, and `(tp + tn) / len(y)` is the accuracy again. The confusion matrix is the 2 by 2 table of these counts.",
        },
      ],
    },
    {
      title: "A practical example: from probabilities to a confusion matrix",
      blocks: [
        {
          kind: "text",
          text: "In Module 1.3 a logistic regression gave probabilities `p`, and a threshold of `0.5` turned them into labels. Here are ten such probabilities and the true labels.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "p = np.array([0.9, 0.2, 0.4, 0.8, 0.1, 0.6, 0.7, 0.3, 0.95, 0.05])",
            "y = np.array([1, 0, 1, 1, 0, 0, 1, 0, 1, 0])",
            "pred = (p >= 0.5).astype(int)",
            "print(pred)",
            "tp = int(np.sum((pred == 1) & (y == 1)))",
            "fp = int(np.sum((pred == 1) & (y == 0)))",
            "tn = int(np.sum((pred == 0) & (y == 0)))",
            "fn = int(np.sum((pred == 0) & (y == 1)))",
            "print(np.array([[tn, fp], [fn, tp]]))",
          ].join("\n"),
          output: ["[1 0 0 1 0 1 1 0 1 0]", "[[4 1]", " [1 4]]"].join("\n"),
        },
        {
          kind: "text",
          text: "The matrix has the true class in rows and the prediction in columns: `[[tn, fp], [fn, tp]]`. This is the layout scikit-learn uses, which you meet in lesson 04.",
        },
      ],
    },
    {
      title: "Try it: count each cell",
      blocks: [
        {
          kind: "text",
          text: "Pick a model and a cell of the confusion matrix, and watch the mask mark the examples in that cell. Try \"Always 1\": it finds every positive, but every negative becomes a false positive.",
        },
        {
          kind: "note",
          text: "The demo uses `*` instead of `&`: on two boolean arrays it is also `True` only where both are `True`.",
        },
        {
          kind: "playground",
          demo: {
            title: "Confusion matrix cells",
            controls: [
              {
                type: "select",
                name: "pred",
                label: "Model",
                options: [
                  { label: "Threshold 0.5 (lesson example)", value: "np.array([1, 0, 0, 1, 0, 1, 1, 0, 1, 0])" },
                  { label: "Always 0", value: "np.zeros(10, dtype=int)" },
                  { label: "Always 1", value: "np.ones(10, dtype=int)" },
                  { label: "Perfect", value: "y.copy()" },
                ],
              },
              {
                type: "select",
                name: "cell",
                label: "Cell",
                options: [
                  { label: "True positives", value: "(pred == 1) * (y == 1)" },
                  { label: "False positives", value: "(pred == 1) * (y == 0)" },
                  { label: "True negatives", value: "(pred == 0) * (y == 0)" },
                  { label: "False negatives", value: "(pred == 0) * (y == 1)" },
                ],
              },
            ],
            template: [
              "import numpy as np",
              "y = np.array([1, 0, 1, 1, 0, 0, 1, 0, 1, 0])",
              "pred = {{pred}}",
              'print("accuracy:", float(np.mean(pred == y)))',
              'print("count:", int(np.sum({{cell}})))',
              "mask = {{cell}}",
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
            "Accuracy is `np.mean(pred == y)`, the share of right predictions.",
            "TP, FP, TN and FN count each combination of prediction and true label, e.g. `np.sum((pred == 1) & (y == 1))`.",
            "The four counts add up to the number of examples; the confusion matrix is `[[tn, fp], [fn, tp]]`.",
            "On imbalanced data a model can have high accuracy and still find no positives.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "evaluation-02-q1",
      question: "`pred = [1, 1, 0, 0]` and `y = [1, 0, 0, 0]`. What is `np.mean(pred == y)`?",
      options: ["0.25", "0.5", "0.75", "1.0"],
      answer: 2,
      explanation: "Three of the four predictions equal the label.",
    },
    {
      id: "evaluation-02-q2",
      question: "Which case is a false positive?",
      options: ["Predicted 1, truly 1", "Predicted 0, truly 1", "Predicted 1, truly 0"],
      answer: 2,
      explanation: "The model said positive, but the example is negative: a false alarm.",
    },
    {
      id: "evaluation-02-q3",
      question: "95 of 100 emails are not spam. What is the accuracy of a model that always predicts \"not spam\"?",
      options: ["0.95", "0.05", "0.5"],
      answer: 0,
      explanation: "It is right on the 95 normal emails, while it catches no spam at all.",
    },
    {
      id: "evaluation-02-q4",
      question: "Why are the parentheses needed in `(pred == 1) & (y == 1)`?",
      options: [
        "They turn the result into a count",
        "Without them, Python applies `&` before `==`",
        "They are optional style",
      ],
      answer: 1,
      explanation: "`&` binds tighter than `==`, so the comparisons must be grouped first.",
    },
  ],
};
