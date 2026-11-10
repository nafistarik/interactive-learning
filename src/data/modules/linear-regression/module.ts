import type { ModuleDef } from "@/features/content/types";

import { LINEAR_REGRESSION_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 1.1 (R3 brief). Not listed as open until its content and tests are done. */
export const LINEAR_REGRESSION_MODULE: ModuleDef = {
  slug: "linear-regression",
  number: "1.1",
  title: "Linear Regression & Loss",
  description: "Turn data into predictions with X @ w + b, and measure how wrong they are with mean squared error.",
  objectives: [
    "Describe a model as a function from inputs to outputs, with a weight w and a bias b as its parameters",
    "Compute predictions for many examples and features at once with X @ w + b",
    "Compute residuals and the mean squared error of a set of predictions",
    "Fit a line by trying many values of w in a loop and keeping the one with the lowest loss",
    "Explain why trying every parameter value does not scale to many parameters",
  ],
  available: true,
  lessons: [
    { id: "01", title: "Models as Functions" },
    { id: "02", title: "Predictions with X @ w + b" },
    { id: "03", title: "Measuring Error: Mean Squared Error" },
    { id: "04", title: "Practical Application: Fitting a Line by Search" },
  ],
  content: LESSON_CONTENT,
  exercises: LINEAR_REGRESSION_EXERCISES,
};
