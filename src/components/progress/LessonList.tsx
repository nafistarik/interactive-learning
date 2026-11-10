"use client";

import Link from "next/link";

import { lessonStatusOf } from "@/features/progress/model";
import { useProgress } from "@/features/progress/progress-context";
import { LESSON_STATUS_TEXT } from "@/data/ui-text";

/** A lesson row as the module page passes it in. */
export interface LessonRow {
  id: string;
  title: string;
  hasExercise: boolean;
  exerciseId: string | undefined;
}

/**
 * The module's lessons with their status (brief Part 4.2).
 *
 * @param props.lessons - The lessons in order.
 */
export function LessonList({ lessons }: { lessons: LessonRow[] }) {
  const { state, loaded } = useProgress();

  return (
    <ol className="mt-8 divide-y divide-line">
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
              <span className="flex gap-3 text-xs text-subtle">
                {lesson.hasExercise ? <span>Exercise</span> : null}
                <span>{loaded ? LESSON_STATUS_TEXT[status] : "…"}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
