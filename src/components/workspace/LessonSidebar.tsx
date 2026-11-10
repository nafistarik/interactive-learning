"use client";

import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import Link from "next/link";

import { ARRAYS_MODULE } from "@/data/arrays-module";
import { findExerciseForLesson } from "@/data/exercises";
import { LESSON_STATUS_TEXT } from "@/data/ui-text";
import { lessonStatusOf, type LessonStatus } from "@/features/progress/model";
import { useProgress } from "@/features/progress/progress-context";

/** Icon per lesson status. */
const STATUS_ICON: Record<LessonStatus, typeof Circle> = {
  "not-started": Circle,
  "in-progress": CircleDot,
  completed: CheckCircle2,
};

/**
 * The module's lessons with completion marks (brief Part 4.3, left column).
 *
 * @param props.currentId - The lesson on screen.
 */
export function LessonSidebar({ currentId }: { currentId: string }) {
  const { state, loaded } = useProgress();

  return (
    <nav aria-label="Lessons" className="grid gap-0.5 text-sm">
      {ARRAYS_MODULE.lessons.map((lesson) => {
        const status = loaded
          ? lessonStatusOf(state, lesson.id, findExerciseForLesson(lesson.id)?.id)
          : "not-started";
        const Icon = STATUS_ICON[status];
        const current = lesson.id === currentId;
        return (
          <Link
            key={lesson.id}
            href={`/learn/arrays/lesson/${lesson.id}`}
            aria-current={current ? "page" : undefined}
            className={`flex items-start gap-2 rounded-md px-2 py-2 ${
              current ? "bg-surface-2 font-medium text-fg" : "text-muted hover:bg-surface-2 hover:text-fg"
            }`}
          >
            <Icon
              className={`mt-0.5 size-4 shrink-0 ${status === "completed" ? "text-success" : status === "in-progress" ? "text-accent" : "text-subtle"}`}
              aria-label={LESSON_STATUS_TEXT[status]}
            />
            <span>
              <span className="font-mono text-xs text-subtle">{lesson.id}</span> {lesson.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
