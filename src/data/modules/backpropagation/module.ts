import type { ModuleDef } from "@/features/content/types";

import { BACKPROPAGATION_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 2.2 (R5 brief). Not listed as open until its content and tests are done. */
export const BACKPROPAGATION_MODULE: ModuleDef = {
  slug: "backpropagation",
  number: "2.2",
  title: "Backpropagation",
  description: "Find how every weight affects the loss with the chain rule, and check your gradients numerically.",
  objectives: [
    "Apply the chain rule by multiplying local gradients along a chain of steps",
    "Compute the gradients of a single neuron with MSE by hand, as NumPy one-liners",
    "Check an analytic gradient against central differences with a relative error",
    "Write the backward pass of a dense layer and ReLU: dW, db, dX and the ReLU mask",
  ],
  available: true,
  lessons: [
    { id: "01", title: "The Chain Rule" },
    { id: "02", title: "Gradients by Hand" },
    { id: "03", title: "Checking Gradients Numerically" },
    { id: "04", title: "The Backward Pass of a Layer" },
  ],
  content: LESSON_CONTENT,
  exercises: BACKPROPAGATION_EXERCISES,
};
