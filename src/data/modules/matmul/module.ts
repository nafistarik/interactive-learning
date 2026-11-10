import type { ModuleDef } from "@/features/content/types";

import { MATMUL_EXERCISES } from "./exercises";
import { LESSON_CONTENT } from "./lessons";

/** Module 0.2 (R2 brief). Not listed as open until its content and tests are done. */
export const MATMUL_MODULE: ModuleDef = {
  slug: "matmul",
  number: "0.2",
  title: "Dot Products & Matrix Multiplication",
  description: "Multiply vectors and matrices with @, and see every result value as a row times a column.",
  objectives: [
    "Compute the dot product of two vectors with np.dot and @",
    "Multiply a matrix by a vector as one dot product per row",
    "Predict the shape of a matrix product with (m, k) @ (k, n) -> (m, n), and fix shapes that do not fit",
    "Tell element-wise * apart from matrix multiplication @",
    "Compute X @ W + b, the linear layer of machine learning models",
  ],
  available: true,
  lessons: [
    { id: "01", title: "Vectors and the Dot Product" },
    { id: "02", title: "Matrix Times Vector" },
    { id: "03", title: "Matrix Multiplication and Its Shape Rule" },
    { id: "04", title: "Practical Application: X @ W + b" },
  ],
  content: LESSON_CONTENT,
  exercises: MATMUL_EXERCISES,
};
