import type { ModuleDef } from "@/features/content/types";

import { EVALUATION_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 1.4 (R3 brief). Not listed as open until its content and tests are done. */
export const EVALUATION_MODULE: ModuleDef = {
  slug: "evaluation",
  number: "1.4",
  title: "Evaluating Models",
  description: "Find out how good a model really is: test data, accuracy, precision, recall, and a check against scikit-learn.",
  objectives: [
    "Split data into a training set and a test set with a fixed shuffled order",
    "Explain overfitting and why a model is measured on data it has not seen",
    "Compute accuracy and the confusion matrix counts TP, FP, TN and FN with boolean masks",
    "Compute precision and recall, and describe how they trade off as the threshold moves",
    "Check a from-scratch model and its metrics against scikit-learn",
  ],
  available: true,
  lessons: [
    { id: "01", title: "Train and Test Data" },
    { id: "02", title: "Accuracy and the Confusion Matrix" },
    { id: "03", title: "Precision and Recall" },
    { id: "04", title: "Practical Application: Comparing with scikit-learn" },
  ],
  content: LESSON_CONTENT,
  exercises: EVALUATION_EXERCISES,
};
