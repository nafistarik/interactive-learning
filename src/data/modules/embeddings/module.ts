import type { ModuleDef } from "@/features/content/types";

import { EMBEDDINGS_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 3.1 (R6 brief). Not listed as open until its content and tests are done. */
export const EMBEDDINGS_MODULE: ModuleDef = {
  slug: "embeddings",
  number: "3.1",
  title: "Tokens and Embeddings",
  description: "Turn words into numbers a model can learn from, and measure how similar two meanings are.",
  objectives: [
    "Split text into word tokens, build a vocabulary and turn a sentence into an array of token ids",
    "Build one-hot vectors with np.eye(V)[ids] and explain why they are wasteful and carry no meaning",
    "Look up embeddings with E[ids] and show that it equals one_hot @ E",
    "Compute the cosine similarity of two vectors from the dot product and the norms",
    "Compute a similarity matrix of word vectors with Xn @ Xn.T after normalizing the rows",
  ],
  available: false,
  lessons: [
    { id: "01", title: "From Text to Tokens" },
    { id: "02", title: "One-Hot Vectors" },
    { id: "03", title: "Embedding Tables" },
    { id: "04", title: "Measuring Similarity" },
  ],
  content: LESSON_CONTENT,
  exercises: EMBEDDINGS_EXERCISES,
};
