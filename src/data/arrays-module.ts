/**
 * Static curriculum for MVP 1, the Arrays module (brief Part 5).
 * Content only: no UI and no progress logic live here.
 */

/** One lesson of the Arrays module. `id` is the URL segment, `01` … `08`. */
export interface Lesson {
  id: string;
  title: string;
  hasExercise: boolean;
  /** Code the Practice editor starts with. Lessons without it show no Practice yet. */
  starterCode?: string;
}

/** Starter code of the Part 9 broadcasting scenario (lesson 07, Exercise 03). */
const BROADCASTING_STARTER = [
  "import numpy as np",
  "",
  "X = np.array([",
  "    [1, 2],",
  "    [3, 4],",
  "    [5, 6]",
  "])",
  "",
  "w = np.array([2, 3])",
  "",
  "out = X * w",
].join("\n");

/** The Arrays module as the MVP brief lists it. */
export const ARRAYS_MODULE = {
  slug: "arrays",
  title: "Arrays, Vectorization & Broadcasting",
  description:
    "Write real NumPy code, run it in your browser, and watch arrays and broadcasting happen.",
  lessons: [
    { id: "01", title: "Introduction to Arrays", hasExercise: false },
    { id: "02", title: "Array Dimensions", hasExercise: false },
    { id: "03", title: "Understanding Array Shape", hasExercise: true },
    { id: "04", title: "Array Indexing", hasExercise: false },
    { id: "05", title: "Introduction to Vectorization", hasExercise: false },
    { id: "06", title: "Element-wise Operations", hasExercise: true },
    {
      id: "07",
      title: "Understanding Broadcasting",
      hasExercise: true,
      starterCode: BROADCASTING_STARTER,
    },
    { id: "08", title: "Practical Application: X * w + b", hasExercise: true },
  ] satisfies Lesson[],
} as const;

/**
 * Returns the lesson with the given URL id, or `undefined` when the id is not one of the
 * module's lessons. Callers turn `undefined` into a 404.
 *
 * @param lessonId - The raw `[lessonId]` segment from the URL.
 * @returns The matching lesson, or `undefined`.
 */
export function findLesson(lessonId: string): Lesson | undefined {
  return ARRAYS_MODULE.lessons.find((lesson) => lesson.id === lessonId);
}
