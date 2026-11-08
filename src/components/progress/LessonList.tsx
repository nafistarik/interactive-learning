"use client";

import Link from "next/link";

import { lessonStatusOf, type LessonStatus } from "@/features/progress/model";
import { useProgress } from "@/features/progress/progress-context";

/** A lesson row as the module page passes it in. */
export interface LessonRow {
  id: string;
  title: string;
  hasExercise: boolean;
  exerciseId: string | undefined;
}

/** Text shown for each lesson status. */
const STATUS_TEXT: Record<LessonStatus, string> = {
  "not-started": "Not started",
  "exercise-passed": "Exercise passed",
  completed: "Completed",
};

/**
 * The module's lessons with their status (brief Part 4.2).
 *
 * @param props.lessons - The lessons in order.
 */
export function LessonList({ lessons }: { lessons: LessonRow[] }) {
  const { state, loaded } = useProgress();

  return (
    <ol className="mt-8 divide-y divide-zinc-200 dark:divide-zinc-800">
      {lessons.map((lesson) => {
        const status = lessonStatusOf(state, lesson.id, lesson.exerciseId);
        return (
          <li key={lesson.id}>
            <Link
              href={`/learn/arrays/lesson/${lesson.id}`}
              className="flex items-center justify-between gap-4 py-3 hover:underline"
            >
              <span>
                {lesson.id}. {lesson.title}
              </span>
              <span className="flex gap-3 text-xs text-zinc-500">
                {lesson.hasExercise ? <span>Exercise</span> : null}
                <span>{loaded ? STATUS_TEXT[status] : "…"}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
