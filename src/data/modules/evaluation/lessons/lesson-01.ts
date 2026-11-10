import type { LessonContent } from "@/features/content/types";

export const LESSON_01: LessonContent = {
  lessonId: "01",
  summary:
    "A model is measured on examples it never learned from. You split the data into a training set and a test set, with a fixed shuffled order.",
  estimatedMinutes: 14,
  sections: [
    {
      title: "What a training set and a test set are",
      blocks: [
        {
          kind: "text",
          text: "A model learns from examples. The training set is the examples it learns from. The test set is examples held back, which the model never sees while it learns.",
        },
        {
          kind: "text",
          text: "After training, you measure the model on the test set. That number estimates how well the model will do on new data.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])",
            "y = np.array([3, 5, 7, 9, 11, 13, 15, 17, 19, 21])",
            "x_train, x_test = x[:8], x[8:]",
            "y_train, y_test = y[:8], y[8:]",
            "print(x_train, x_test)",
            "print(y_train.shape, y_test.shape)",
          ].join("\n"),
          output: ["[1 2 3 4 5 6 7 8] [ 9 10]", "(8,) (2,)"].join("\n"),
        },
        {
          kind: "text",
          text: "`x[:8]` takes the first 8 examples for training and `x[8:]` the rest for testing. Every example lands in exactly one of the two sets.",
        },
      ],
    },
    {
      title: "Why the test data must stay unseen",
      blocks: [
        {
          kind: "text",
          text: "A model can do well on its training data for the wrong reason: it memorizes the answers instead of learning the pattern.",
        },
        {
          kind: "note",
          text: "Overfitting: the model fits the training examples so closely, noise included, that it does worse on new examples.",
        },
        {
          kind: "text",
          text: "Compare the line `y_hat = 2 * x + 1` with a memorizer that stores every training answer and repeats the last one for any new `x`. `mse` is the mean squared error from Module 1.1.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "x_train = np.array([1, 2, 3, 4, 5, 6])",
            "y_train = np.array([3.2, 4.8, 7.1, 9.0, 10.9, 13.2])",
            "x_test = np.array([7, 8])",
            "y_test = np.array([15.1, 16.8])",
            "",
            "def mse(pred, y):",
            "    return round(float(np.mean((pred - y) ** 2)), 3)",
            "",
            "# A line: y_hat = 2 * x + 1",
            "print(mse(2 * x_train + 1, y_train), mse(2 * x_test + 1, y_test))",
            "# A memorizer: the stored y for a training x, the last stored y for anything else",
            "print(mse(y_train, y_train), mse(np.full(2, y_train[-1]), y_test))",
          ].join("\n"),
          output: ["0.023 0.025", "0.0 8.285"].join("\n"),
        },
        {
          kind: "text",
          text: "On the training data the memorizer looks perfect, with an error of `0.0`. On the test data its error is far higher than the line's, and only the test set shows it.",
        },
      ],
    },
    {
      title: "Shuffling the order before splitting",
      blocks: [
        {
          kind: "text",
          text: "Data often comes sorted, for example by date or by label. The last rows are then an unusual slice of the data, and a poor test set.",
        },
        {
          kind: "text",
          text: "`np.random.default_rng(0).permutation(n)` returns the numbers `0` to `n - 1` in a shuffled order. The `0` is a seed: the same seed gives the same order every time, so the split can be repeated.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "print(np.random.default_rng(0).permutation(10))",
            "print(np.random.default_rng(0).permutation(10))",
          ].join("\n"),
          output: ["[4 6 2 7 3 5 9 0 8 1]", "[4 6 2 7 3 5 9 0 8 1]"].join("\n"),
        },
        {
          kind: "text",
          text: "The first `n_train` numbers of the order are the indices of the training rows; the rest are the indices of the test rows.",
        },
      ],
    },
    {
      title: "A practical example: splitting labelled data",
      blocks: [
        {
          kind: "text",
          text: "Ten examples with two features each, sorted by their label `y`. Index `X` and `y` with the same indices, so each row keeps its own label.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "X = np.arange(20).reshape(10, 2)",
            "y = np.array([0, 0, 0, 0, 0, 1, 1, 1, 1, 1])",
            "order = np.random.default_rng(0).permutation(10)",
            "train_idx, test_idx = order[:8], order[8:]",
            "print(test_idx)",
            "print(X[test_idx])",
            "print(y[test_idx], y[8:])",
          ].join("\n"),
          output: ["[8 1]", "[[16 17]", " [ 2  3]]", "[1 0] [1 1]"].join("\n"),
        },
        {
          kind: "text",
          text: "The shuffled test set `y[test_idx]` holds one example of each class. Without shuffling, `y[8:]` is `[1 1]`: the test set would hold only class 1.",
        },
      ],
    },
    {
      title: "Try it: split sorted labels",
      blocks: [
        {
          kind: "text",
          text: "Pick an order and a training size, and watch the share of 1s in the test set. Pick the unshuffled order with 8 training examples to get a test set with only one class.",
        },
        {
          kind: "playground",
          demo: {
            title: "Train and test split",
            controls: [
              {
                type: "select",
                name: "order",
                label: "Order",
                options: [
                  { label: "In order (not shuffled)", value: "np.arange(10)" },
                  { label: "Shuffled, seed 0", value: "np.random.default_rng(0).permutation(10)" },
                  { label: "Shuffled, seed 1", value: "np.random.default_rng(1).permutation(10)" },
                ],
              },
              { type: "number", name: "n_train", label: "Training examples", min: 2, max: 9, initial: 8 },
            ],
            template: [
              "import numpy as np",
              "y = np.array([0, 0, 0, 0, 0, 0, 1, 1, 1, 1])",
              "order = {{order}}",
              "n_train = {{n_train}}",
              "y_train = y[order[:n_train]]",
              "y_test = y[order[n_train:]]",
              'print("y_train:", y_train)',
              'print("y_test: ", y_test)',
              "share_of_ones = y_test.mean()",
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
            "The training set is what the model learns from; the test set is held back to measure it.",
            "Overfitting is fitting the training data so closely that new data does worse. Only unseen data shows it.",
            "`np.random.default_rng(seed).permutation(n)` gives a shuffled order that repeats for the same seed.",
            "`order[:n_train]` indexes the training rows and `order[n_train:]` the test rows, for both `X` and `y`.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "evaluation-01-q1",
      question: "Why is a model measured on a test set it never trained on?",
      options: [
        "Training is faster on less data",
        "It shows how well the model does on new data",
        "The test set is always larger",
      ],
      answer: 1,
      explanation: "Training data the model has seen can be memorized; unseen data cannot.",
    },
    {
      id: "evaluation-01-q2",
      question: "A model has an error of 0 on its training data and a high error on its test data. What is this called?",
      options: ["Overfitting", "Shuffling", "A train/test split"],
      answer: 0,
      explanation: "It fits the training examples, noise included, but not the pattern behind them.",
    },
    {
      id: "evaluation-01-q3",
      question: "`order = [2, 0, 3, 1]` and `n_train = 3`. Which index ends up in the test set?",
      options: ["2", "0", "3", "1"],
      answer: 3,
      explanation: "`order[3:]` is `[1]`: the first three indices are for training.",
    },
    {
      id: "evaluation-01-q4",
      question: "Why are `X` and `y` indexed with the same `train_idx`?",
      options: ["NumPy requires it", "So the two arrays are shuffled differently", "So each row keeps its own label"],
      answer: 2,
      explanation: "Row `i` of `X` belongs with `y[i]`; the same indices keep them together.",
    },
  ],
};
