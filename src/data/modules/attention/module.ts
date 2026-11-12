import type { ModuleDef } from "@/features/content/types";

import { ATTENTION_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 3.2 (R6 brief). Not listed as open until its content and tests are done. */
export const ATTENTION_MODULE: ModuleDef = {
  slug: "attention",
  number: "3.2",
  title: "Attention",
  description: "Let every token decide which other tokens matter, with queries, keys, values and softmax.",
  objectives: [
    "Project token embeddings into queries, keys and values with X @ Wq, X @ Wk and X @ Wv",
    "Compute every attention score at once with Q @ K.T and scale it by np.sqrt(d_k)",
    "Turn scores into attention weights with a stable row-wise softmax whose rows add up to 1",
    "Read an attention weight as how much one token looks at another",
    "Write self-attention as one function from X to out = weights @ V and follow its shapes",
  ],
  available: false,
  lessons: [
    { id: "01", title: "Queries, Keys and Values" },
    { id: "02", title: "Scores and Scaling" },
    { id: "03", title: "Softmax Attention Weights" },
    { id: "04", title: "Practical Application: Self-Attention" },
  ],
  content: LESSON_CONTENT,
  exercises: ATTENTION_EXERCISES,
};
