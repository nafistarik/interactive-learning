import type { ModuleDef } from "@/features/content/types";

import { NEURAL_NETWORKS_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 2.1 (R5 brief). Not listed as open until its content and tests are done. */
export const NEURAL_NETWORKS_MODULE: ModuleDef = {
  slug: "neural-networks",
  number: "2.1",
  title: "Neurons and Layers",
  description: "Build a neuron, then a layer, then a small network, and see why non-linear activations matter.",
  objectives: [
    "Compute a neuron's output, an activation of X @ w + b, for one example and for a batch",
    "Apply ReLU, the sigmoid and tanh, and explain why a network needs a non-linear activation",
    "Write a layer of neurons as X @ W + b and predict its output shape",
    "Run a two-layer forward pass and follow the shapes from input to output",
    "Show that two layers without an activation collapse into one",
  ],
  available: true,
  lessons: [
    { id: "01", title: "The Neuron" },
    { id: "02", title: "Activation Functions" },
    { id: "03", title: "Layers as Matrix Multiplication" },
    { id: "04", title: "Stacking Layers" },
  ],
  content: LESSON_CONTENT,
  exercises: NEURAL_NETWORKS_EXERCISES,
};
