import type { ModuleDef } from "@/features/content/types";

import { AUTOGRAD_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 2.3 (R5 brief). Not listed as open until its content and tests are done. */
export const AUTOGRAD_MODULE: ModuleDef = {
  slug: "autograd",
  number: "2.3",
  title: "Build Your Own Autograd",
  description: "Write a tiny engine that records every operation and computes all the gradients for you.",
  objectives: [
    "Write a Value class whose results remember their inputs and operation, forming a computation graph",
    "Give each operation a _backward rule from its local gradient, accumulating with +=",
    "Order a graph topologically with depth-first search and run backward() in reverse",
    "Add tanh and compute every gradient of a neuron with one backward() call",
    "Check autograd gradients against the chain rule and a numeric check, then take a gradient-descent step",
  ],
  available: true,
  lessons: [
    { id: "01", title: "Values that Remember" },
    { id: "02", title: "Local Gradients" },
    { id: "03", title: "Topological Order and backward()" },
    { id: "04", title: "Practical Application: A Neuron in Autograd" },
  ],
  content: LESSON_CONTENT,
  exercises: AUTOGRAD_EXERCISES,
};
