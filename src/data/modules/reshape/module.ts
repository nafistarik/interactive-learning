import type { ModuleDef } from "@/features/content/types";

import { RESHAPE_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 0.4 (R2 brief). Not listed as open until its content and tests are done. */
export const RESHAPE_MODULE: ModuleDef = {
  slug: "reshape",
  number: "0.4",
  title: "Reshape, Transpose & Masks",
  description: "Change an array's shape without changing its data, flip it with .T, and select values with conditions.",
  objectives: [
    "Reshape an array into a new shape, using -1 to let NumPy compute one size",
    "Explain row-major order and why the number of elements must stay the same",
    "Transpose a matrix with .T and fix shapes that do not line up for @ or broadcasting",
    "Build boolean masks from comparisons and combine them with &, | and ~",
    "Select values and rows with a[mask], and choose values with np.where",
  ],
  available: false,
  lessons: [
    { id: "01", title: "Reshape and -1" },
    { id: "02", title: "Transpose and .T" },
    { id: "03", title: "Comparisons and Boolean Masks" },
    { id: "04", title: "Practical Application: Flatten and Filter" },
  ],
  content: LESSON_CONTENT,
  exercises: RESHAPE_EXERCISES,
};
