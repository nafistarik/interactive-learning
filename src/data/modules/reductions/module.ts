import type { ModuleDef } from "@/features/content/types";

import { REDUCTIONS_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 0.3 (R2 brief). Not listed as open until its content and tests are done. */
export const REDUCTIONS_MODULE: ModuleDef = {
  slug: "reductions",
  number: "0.3",
  title: "Reductions & Axes",
  description: "Sum, average and compare along an axis, and keep the shape you need for broadcasting.",
  objectives: [
    "Summarize an array with sum, mean, max, min and std",
    "Reduce along axis 0 or axis 1 and predict the shape of the result",
    "Use keepdims=True so a reduction broadcasts back against its array",
    "Standardize features column-wise, as done before training many models",
  ],
  available: true,
  lessons: [
    { id: "01", title: "Reducing an Array" },
    { id: "02", title: "Axes: Rows or Columns" },
    { id: "03", title: "keepdims and Broadcasting Back" },
    { id: "04", title: "Practical Application: Feature Standardization" },
  ],
  content: LESSON_CONTENT,
  exercises: REDUCTIONS_EXERCISES,
};
