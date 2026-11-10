import type { ModuleDef } from "@/features/content/types";

import { GRADIENT_DESCENT_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 1.2 (R3 brief). Not listed as open until its content and tests are done. */
export const GRADIENT_DESCENT_MODULE: ModuleDef = {
  slug: "gradient-descent",
  number: "1.2",
  title: "Gradient Descent",
  description: "Let the loss tell you which way to move: compute gradients and watch a training loop fit the data.",
  objectives: [
    "Measure the slope of the loss numerically and use its sign to choose a direction",
    "Compute the gradient of MSE, dw and db, with array operations, and check it against the numeric slope",
    "Write a training loop that updates w and b with w -= lr * dw and records the losses",
    "Recognise a learning rate that is too small, a good one and one that makes training diverge",
    "Stop training when the loss stops improving",
  ],
  available: false,
  lessons: [
    { id: "01", title: "Slopes and Gradients" },
    { id: "02", title: "The Gradient of the Loss" },
    { id: "03", title: "The Training Loop" },
    { id: "04", title: "Learning Rate and Convergence" },
  ],
  content: LESSON_CONTENT,
  exercises: GRADIENT_DESCENT_EXERCISES,
};
