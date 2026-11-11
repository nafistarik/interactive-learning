import type { ModuleDef } from "@/features/content/types";

import { TRAINING_NETWORKS_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 2.4 (R5 brief). Not listed as open until its content and tests are done. */
export const TRAINING_NETWORKS_MODULE: ModuleDef = {
  slug: "training-networks",
  number: "2.4",
  title: "Training a Neural Network",
  description: "Train a small network on a curve no straight line can fit, and watch it bend into shape.",
  objectives: [
    "Write one training loop: forward pass, loss, backward pass and update for a 1-hidden-layer network",
    "Start the weights small, random and seeded, and explain why all-zero or equal weights fail",
    "Choose a learning rate from the loss curve",
    "Fit a curve no straight line can follow and watch the prediction bend",
    "Tell underfitting from overfitting by comparing training and test loss",
  ],
  available: false,
  lessons: [
    { id: "01", title: "From Backward Pass to Training Loop" },
    { id: "02", title: "Initialization and Learning Rate" },
    { id: "03", title: "Fitting a Non-linear Curve" },
    { id: "04", title: "Practical Application: Too Few and Too Many Units" },
  ],
  content: LESSON_CONTENT,
  exercises: TRAINING_NETWORKS_EXERCISES,
};
