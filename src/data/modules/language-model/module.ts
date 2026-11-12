import type { ModuleDef } from "@/features/content/types";

import { LANGUAGE_MODEL_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 3.4 (R6 brief). Not listed as open until its content and tests are done. */
export const LANGUAGE_MODEL_MODULE: ModuleDef = {
  slug: "language-model",
  number: "3.4",
  title: "A Tiny Language Model",
  description: "Predict the next token, generate text from a tiny vocabulary, and keep tokens from looking ahead.",
  objectives: [
    "Describe a language model as next-token prediction and build (current, next) pairs with ids[:-1] and ids[1:]",
    "Count bigrams into a (V, V) matrix and turn its rows into probabilities with add-one smoothing",
    "Generate text with greedy decoding (np.argmax) and compare it with seeded sampling",
    "Explain why greedy output falls into repetition loops",
    "Apply a causal mask with np.triu and -np.inf so attention weights never look ahead",
  ],
  available: true,
  lessons: [
    { id: "01", title: "Next-Token Prediction" },
    { id: "02", title: "Bigram Probabilities" },
    { id: "03", title: "Generating Text" },
    { id: "04", title: "The Causal Mask" },
  ],
  content: LESSON_CONTENT,
  exercises: LANGUAGE_MODEL_EXERCISES,
};
