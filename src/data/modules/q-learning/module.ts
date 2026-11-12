import type { ModuleDef } from "@/features/content/types";

import { Q_LEARNING_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 4.3 (R6 brief). Not listed as open until its content and tests are done. */
export const Q_LEARNING_MODULE: ModuleDef = {
  slug: "q-learning",
  number: "4.3",
  title: "Q-Learning",
  description: "Learn action values from experience alone with a Q-table, epsilon-greedy exploration and rewards.",
  objectives: [
    "Read action values from a Q-table of shape (states, 4) and pick the greedy action with np.argmax",
    "Choose actions with epsilon-greedy from a seeded np.random.default_rng and explain why exploring matters",
    "Apply the Q-learning update to one transition and explain its target",
    "Train an agent over many episodes, record its learning curve and follow the learned policy to the goal",
  ],
  available: true,
  lessons: [
    { id: "01", title: "Action Values and the Q-Table" },
    { id: "02", title: "Epsilon-Greedy Exploration" },
    { id: "03", title: "The Q-Learning Update" },
    { id: "04", title: "Practical Application: Learning to Reach the Goal" },
  ],
  content: LESSON_CONTENT,
  exercises: Q_LEARNING_EXERCISES,
};
