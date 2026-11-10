import type { ModuleDef } from "@/features/content/types";

import { ARRAYS_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 0.1, the MVP 1 module (brief Part 5). */
export const ARRAYS_MODULE: ModuleDef = {
  slug: "arrays",
  number: "0.1",
  title: "Arrays, Vectorization & Broadcasting",
  description:
    "Write real NumPy code, run it in your browser, and watch arrays and broadcasting happen.",
  objectives: [
    "Create NumPy arrays and read their shape, size and number of dimensions",
    "Select elements, rows, columns and slices with indexing",
    "Replace Python loops with vectorized, element-wise operations",
    "Predict when two shapes broadcast, and fix them when they do not",
    "Compute X * w + b, the core step of a linear model",
  ],
  available: true,
  lessons: [
    { id: "01", title: "Introduction to Arrays" },
    { id: "02", title: "Array Dimensions" },
    { id: "03", title: "Understanding Array Shape" },
    { id: "04", title: "Array Indexing" },
    { id: "05", title: "Introduction to Vectorization" },
    { id: "06", title: "Element-wise Operations" },
    { id: "07", title: "Understanding Broadcasting" },
    { id: "08", title: "Practical Application: X * w + b" },
  ],
  content: LESSON_CONTENT,
  exercises: ARRAYS_EXERCISES,
};
