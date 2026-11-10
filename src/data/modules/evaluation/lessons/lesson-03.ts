import type { LessonContent } from "@/features/content/types";

export const LESSON_03: LessonContent = {
  lessonId: "03",
  summary:
    "Precision is the share of predicted positives that are real; recall is the share of real positives the model finds. Moving the threshold trades one for the other.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What precision and recall are",
      blocks: [
        {
          kind: "text",
          text: "Precision answers: of the examples the model predicted as `1`, how many really are `1`? It is `tp / (tp + fp)`.",
        },
        {
          kind: "text",
          text: "Recall answers: of the examples that really are `1`, how many did the model find? It is `tp / (tp + fn)`.",
        },
        {
          kind: "code",
          code: [
            "tp, fp, fn = 6, 2, 3",
            "precision = tp / (tp + fp)",
            "recall = tp / (tp + fn)",
            "print(precision, round(recall, 3))",
          ].join("\n"),
          output: "0.75 0.667",
        },
        {
          kind: "text",
          text: "Here 8 examples were predicted positive and 6 of them are, so precision is `0.75`. There are 9 real positives and the model found 6, so recall is `0.667`.",
        },
      ],
    },
    {
      title: "Why precision and recall matter",
      blocks: [
        {
          kind: "text",
          text: "Each one measures a kind of mistake that accuracy mixes together. Low precision means many false alarms; low recall means many misses.",
        },
        {
          kind: "text",
          text: "Recall exposes the model from lesson 02 that always predicts `0`: its accuracy is `0.9`, but it finds none of the positives.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "y = np.array([0, 0, 0, 0, 0, 0, 0, 0, 0, 1])",
            "pred = np.zeros(10, dtype=int)",
            "tp = int(np.sum((pred == 1) & (y == 1)))",
            "fn = int(np.sum((pred == 0) & (y == 1)))",
            "print(float(np.mean(pred == y)), tp / (tp + fn))",
          ].join("\n"),
          output: "0.9 0.0",
        },
        {
          kind: "note",
          text: "A model that predicts no `1` at all has `tp + fp = 0`, so its precision is `0 / 0` and not defined. Libraries report it as `0` with a warning.",
        },
      ],
    },
    {
      title: "How the threshold trades one for the other",
      blocks: [
        {
          kind: "text",
          text: "A logistic regression gives a probability `p` per example, and `p >= threshold` turns it into a label. The threshold decides how many examples are predicted `1`.",
        },
        {
          kind: "text",
          text: "A higher threshold predicts `1` less often. False alarms drop, so precision tends to rise; more positives are missed, so recall falls or stays the same.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "p = np.array([0.9, 0.2, 0.4, 0.8, 0.1, 0.6, 0.7, 0.3, 0.95, 0.05])",
            "y = np.array([1, 0, 1, 1, 0, 0, 1, 0, 1, 0])",
            "for t in [0.3, 0.5, 0.75]:",
            "    pred = (p >= t).astype(int)",
            "    tp = int(np.sum((pred == 1) & (y == 1)))",
            "    fp = int(np.sum((pred == 1) & (y == 0)))",
            "    fn = int(np.sum((pred == 0) & (y == 1)))",
            "    print(t, round(tp / (tp + fp), 3), tp / (tp + fn))",
          ].join("\n"),
          output: ["0.3 0.714 1.0", "0.5 0.8 0.8", "0.75 1.0 0.6"].join("\n"),
        },
        {
          kind: "text",
          text: "Each line shows the threshold, the precision and the recall. No threshold gives the best of both here: you choose based on which mistake costs more.",
        },
      ],
    },
    {
      title: "A practical example: a spam filter",
      blocks: [
        {
          kind: "text",
          text: "Say `1` means spam. A false positive moves a real email to the spam folder, which is costly, so the filter needs high precision.",
        },
        {
          kind: "code",
          code: [
            "import numpy as np",
            "p = np.array([0.9, 0.2, 0.4, 0.8, 0.1, 0.6, 0.7, 0.3, 0.95, 0.05])",
            "y = np.array([1, 0, 1, 1, 0, 0, 1, 0, 1, 0])",
            "pred = (p >= 0.75).astype(int)",
            "tp = int(np.sum((pred == 1) & (y == 1)))",
            "fp = int(np.sum((pred == 1) & (y == 0)))",
            "fn = int(np.sum((pred == 0) & (y == 1)))",
            "print(tp, fp, fn)",
            "print(tp / (tp + fp), tp / (tp + fn))",
          ].join("\n"),
          output: ["3 0 2", "1.0 0.6"].join("\n"),
        },
        {
          kind: "text",
          text: "At `0.75` no real email is lost (precision `1.0`), but 2 of the 5 spam emails get through (recall `0.6`). A screening test for an illness would choose the other way, a low threshold for high recall.",
        },
      ],
    },
    {
      title: "Try it: sweep the threshold",
      blocks: [
        {
          kind: "text",
          text: "The loop tries thresholds from `0.05` to `0.95` and records precision and recall at each one. Change how many thresholds it tries, and switch to the model whose probabilities separate the classes.",
        },
        {
          kind: "playground",
          demo: {
            title: "Precision and recall by threshold",
            controls: [
              {
                type: "select",
                name: "p",
                label: "Probabilities",
                options: [
                  {
                    label: "Lesson example",
                    value: "np.array([0.9, 0.2, 0.4, 0.8, 0.1, 0.6, 0.7, 0.3, 0.95, 0.05])",
                  },
                  {
                    label: "Classes fully separated",
                    value: "np.array([0.9, 0.1, 0.7, 0.8, 0.2, 0.3, 0.85, 0.15, 0.95, 0.05])",
                  },
                ],
              },
              { type: "number", name: "n", label: "Thresholds", min: 2, max: 19, initial: 10 },
            ],
            template: [
              "import numpy as np",
              "p = {{p}}",
              "y = np.array([1, 0, 1, 1, 0, 0, 1, 0, 1, 0])",
              "for t in np.linspace(0.05, 0.95, {{n}}):",
              "    pred = p >= t",
              "    precision = np.sum(pred * y) / np.sum(pred)",
              "    recall = np.sum(pred * y) / np.sum(y)",
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
            "Precision is `tp / (tp + fp)`: how many predicted positives are real.",
            "Recall is `tp / (tp + fn)`: how many real positives were found.",
            "Raising the threshold usually raises precision and lowers recall; lowering it does the opposite.",
            "Choose the threshold by which mistake costs more: false alarms or misses.",
          ],
        },
      ],
    },
  ],
  knowledgeCheck: [
    {
      id: "evaluation-03-q1",
      question: "`tp = 3`, `fp = 1`, `fn = 2`. What is the precision?",
      options: ["0.6", "0.75", "0.5"],
      answer: 1,
      explanation: "`3 / (3 + 1) = 0.75`: three of the four predicted positives are real.",
    },
    {
      id: "evaluation-03-q2",
      question: "With the same counts, `tp = 3`, `fp = 1`, `fn = 2`, what is the recall?",
      options: ["0.75", "0.4", "0.6"],
      answer: 2,
      explanation: "`3 / (3 + 2) = 0.6`: the model found three of the five real positives.",
    },
    {
      id: "evaluation-03-q3",
      question: "What happens to recall when the threshold goes up?",
      options: [
        "It falls or stays the same, because fewer examples are predicted 1",
        "It always rises",
        "It does not depend on the threshold",
      ],
      answer: 0,
      explanation: "Fewer predicted positives can only find the same real positives or fewer.",
    },
    {
      id: "evaluation-03-q4",
      question: "A screening test for an illness should miss as few sick people as possible. Which number matters most?",
      options: ["Precision", "Recall", "Accuracy"],
      answer: 1,
      explanation: "Misses are false negatives, and recall is the measure they lower.",
    },
  ],
  practiceStarter: [
    "import numpy as np",
    "",
    "p = np.array([0.9, 0.2, 0.4, 0.8, 0.1, 0.6, 0.7, 0.3, 0.95, 0.05])",
    "y = np.array([1, 0, 1, 1, 0, 0, 1, 0, 1, 0])",
    "pred = (p >= 0.5).astype(int)",
    "tp = int(np.sum((pred == 1) & (y == 1)))",
    "fp = int(np.sum((pred == 1) & (y == 0)))",
    "fn = int(np.sum((pred == 0) & (y == 1)))",
    "print(tp / (tp + fp), tp / (tp + fn))",
    "",
    "# Try: the threshold 0.4. Which of precision and recall changes, and why?",
  ].join("\n"),
};
