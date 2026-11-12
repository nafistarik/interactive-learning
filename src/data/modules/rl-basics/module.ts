import type { ModuleDef } from "@/features/content/types";

import { RL_BASICS_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 4.1 (R6 brief). Not listed as open until its content and tests are done. */
export const RL_BASICS_MODULE: ModuleDef = {
  slug: "rl-basics",
  number: "4.1",
  title: "Agents and Environments",
  description: "Put an agent in a small grid world: states, actions, rewards, episodes and discounted returns.",
  objectives: [
    "Describe the reinforcement learning loop: the agent acts, the environment answers with a reward and the next state",
    "Store a grid world as a NumPy array of rewards and number its cells as states with row * cols + col",
    "Write a step function that moves the agent, stops it at walls with np.clip and reports the reward and done",
    "Run an episode with a fixed or seeded random policy and count the visits to each cell",
    "Compute discounted returns, forward with gamma ** t and backwards with G = r + gamma * G",
  ],
  available: true,
  lessons: [
    { id: "01", title: "States, Actions and Rewards" },
    { id: "02", title: "A Grid World in NumPy" },
    { id: "03", title: "Episodes" },
    { id: "04", title: "Returns and Discounting" },
  ],
  content: LESSON_CONTENT,
  exercises: RL_BASICS_EXERCISES,
};
