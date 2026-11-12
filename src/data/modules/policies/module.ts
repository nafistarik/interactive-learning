import type { ModuleDef } from "@/features/content/types";

import { POLICIES_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 4.4 (R6 brief). Not listed as open until its content and tests are done. */
export const POLICIES_MODULE: ModuleDef = {
  slug: "policies",
  number: "4.4",
  title: "Policies in Practice",
  description: "Compare learned and random policies, tune exploration, and see where tables stop scaling.",
  objectives: [
    "Evaluate a policy by its average return and success rate over many seeded episodes",
    "Compare a greedy policy from a Q-table with random play",
    "Balance exploration and exploitation with a decaying epsilon schedule",
    "Explain how the learning rate and the discount change what Q-learning learns",
    "Count Q-table sizes and explain why large or continuous state spaces need function approximation",
  ],
  available: true,
  lessons: [
    { id: "01", title: "Evaluating a Policy" },
    { id: "02", title: "Exploration versus Exploitation" },
    { id: "03", title: "Learning Rate and Discount" },
    { id: "04", title: "When Tables Stop Scaling" },
  ],
  content: LESSON_CONTENT,
  exercises: POLICIES_EXERCISES,
};
