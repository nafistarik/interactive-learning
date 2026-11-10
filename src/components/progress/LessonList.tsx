"use client";

import { CheckCircle2, Circle, CircleDot, Dumbbell } from "lucide-react";
import Link from "next/link";

import { findLesson } from "@/data/arrays-module";
import { findExerciseForLesson } from "@/data/exercises";
import { LESSON_STATUS_TEXT } from "@/data/ui-text";
import { lessonStatusOf } from "@/features/progress/model";
import { useProgress } from "@/features/progress/progress-context";

/** A lesson row as the module page passes it in. */
export interface LessonRow {
  lessonId: string;
  summary: string;
  minutes: number;
}

/**
 * The module's lessons with their status and exercise marks (brief Part 4.2).
 *
 * @param props.lessons - The lessons in order.
 */
export function LessonList({ lessons }: { lessons: LessonRow[] }) {
  const { state, loaded } = useProgress();

  return (
    <ol className="mt-3 grid gap-2">
      {lessons.map((row) => {
        const lesson = findLesson(row.lessonId);
        const exercise = findExerciseForLesson(row.lessonId);
        const status = lessonStatusOf(state, row.lessonId, exercise?.id);
        const Icon = status === "completed" ? CheckCircle2 : status === "in-progress" ? CircleDot : Circle;
        return (
          <li key={row.lessonId}>
            <Link
              href={`/learn/arrays/lesson/${row.lessonId}`}
              className="card flex items-start gap-4 p-4 hover:border-line-strong"
            >
              <span className="font-mono text-sm text-subtle">{row.lessonId}</span>
              <span className="grid min-w-0 flex-1 gap-1">
                <span className="font-medium">{lesson?.title}</span>
                <span className="text-sm text-muted">{row.summary}</span>
                <span className="flex flex-wrap gap-3 text-xs text-subtle">
                  <span>{row.minutes} min</span>
                  {exercise ? (
                    <span className="flex items-center gap-1 text-tone-weight">
                      <Dumbbell className="size-3.5" aria-hidden /> Exercise: {exercise.title}
                    </span>
                  ) : null}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-xs text-subtle">
                <Icon
                  className={`size-4 ${status === "completed" ? "text-success" : status === "in-progress" ? "text-accent" : ""}`}
                  aria-hidden
                />
                {loaded ? LESSON_STATUS_TEXT[status] : "…"}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
