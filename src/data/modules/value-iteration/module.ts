import type { ModuleDef } from "@/features/content/types";

import { VALUE_ITERATION_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 4.2 (R6 brief). Not listed as open until its content and tests are done. */
export const VALUE_ITERATION_MODULE: ModuleDef = {
  slug: "value-iteration",
  number: "4.2",
  title: "Values and the Bellman Equation",
  description: "Work out how good every state is, update values until they settle, and read off the best moves.",
  objectives: [
    "Explain the value of a state as the discounted return the agent can expect from it",
    "Compute action values reward + gamma * V[next] and apply the Bellman update in one sweep over the grid",
    "Repeat sweeps until the largest change delta falls below a tolerance, and count the sweeps",
    "Extract the greedy policy with np.argmax over the four action values and draw it as arrows",
    "Follow the greedy policy from a start state to the goal",
  ],
  available: true,
  lessons: [
    { id: "01", title: "State Values" },
    { id: "02", title: "The Bellman Update" },
    { id: "03", title: "Value Iteration" },
    { id: "04", title: "Extracting a Policy" },
  ],
  content: LESSON_CONTENT,
  exercises: VALUE_ITERATION_EXERCISES,
};
