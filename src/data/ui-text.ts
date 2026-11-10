import type { LessonStatus } from "@/features/progress/model";

/** How each lesson status reads on the module, workspace and progress pages. */
export const LESSON_STATUS_TEXT: Record<LessonStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
};
