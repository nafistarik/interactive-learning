import type { ModuleDef } from "@/features/content/types";

import { LOGISTIC_REGRESSION_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 1.3 (R3 brief). Not listed as open until its content and tests are done. */
export const LOGISTIC_REGRESSION_MODULE: ModuleDef = {
  slug: "logistic-regression",
  number: "1.3",
  title: "Logistic Regression",
  description: "Predict yes or no: squash scores into probabilities with the sigmoid and train with log loss.",
  objectives: [
    "Describe a yes or no problem with labels 0 and 1, and explain why a linear score is not a probability",
    "Turn scores into probabilities with the sigmoid 1 / (1 + np.exp(-z)), and into labels with a threshold",
    "Compute log loss and explain why it punishes confident wrong answers",
    "Train a logistic regression with gradient descent, using dw = X.T @ (p - y) / n and db = np.mean(p - y)",
    "Measure the accuracy of the predicted labels",
  ],
  available: true,
  lessons: [
    { id: "01", title: "Classification and Probabilities" },
    { id: "02", title: "The Sigmoid Function" },
    { id: "03", title: "Log Loss" },
    { id: "04", title: "Practical Application: Training a Classifier" },
  ],
  content: LESSON_CONTENT,
  exercises: LOGISTIC_REGRESSION_EXERCISES,
};
