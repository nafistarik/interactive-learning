"use client";

import Link from "next/link";
import { useRef } from "react";

import { ARRAYS_MODULE } from "@/data/arrays-module";
import { EXERCISES } from "@/data/exercises";
import { lessonStatusOf, totalsOf } from "@/features/progress/model";
import { useProgress } from "@/features/progress/progress-context";
import { LESSON_STATUS_TEXT } from "@/data/ui-text";

/**
 * The progress page (brief Part 4.4): totals, per-lesson status, exercise stars, and Reset
 * progress behind a confirmation dialog.
 */
export function ProgressView() {
  const { state, loaded, reset } = useProgress();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const totals = totalsOf(state);

  if (!loaded) {
    return <p className="mt-6 text-subtle">Loading your progress…</p>;
  }

  return (
    <div className="mt-6 grid gap-8">
      <dl className="card grid grid-cols-2 gap-4 p-5 text-sm sm:grid-cols-5">
        <div>
          <dt className="text-subtle">XP</dt>
          <dd className="text-lg font-medium">{totals.xp}</dd>
        </div>
        <div>
          <dt className="text-subtle">Stars</dt>
          <dd className="text-lg font-medium">{totals.stars}</dd>
        </div>
        <div>
          <dt className="text-subtle">Lessons completed</dt>
          <dd className="text-lg font-medium">
            {totals.completedLessons} / {ARRAYS_MODULE.lessons.length}
          </dd>
        </div>
        <div>
          <dt className="text-subtle">Exercises passed</dt>
          <dd className="text-lg font-medium">
            {totals.passedExercises} / {EXERCISES.length}
          </dd>
        </div>
        <div>
          <dt className="text-subtle">Module</dt>
          <dd className="text-lg font-medium">{totals.modulePercent}%</dd>
        </div>
      </dl>

      <section className="grid gap-2">
        <h2 className="text-base font-medium">Lessons</h2>
        <ul className="divide-y divide-line">
          {ARRAYS_MODULE.lessons.map((lesson) => {
            const exercise = EXERCISES.find((item) => item.lessonId === lesson.id);
            return (
              <li key={lesson.id} className="flex justify-between py-2 text-sm">
                <Link href={`/learn/arrays/lesson/${lesson.id}`} className="hover:underline">
                  {lesson.id}. {lesson.title}
                </Link>
                <span className="text-subtle">
                  {LESSON_STATUS_TEXT[lessonStatusOf(state, lesson.id, exercise?.id)]}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="grid gap-2">
        <h2 className="text-base font-medium">Exercises</h2>
        <ul className="divide-y divide-line">
          {EXERCISES.map((exercise) => {
            const progress = state.exercises[exercise.id];
            return (
              <li key={exercise.id} className="flex justify-between py-2 text-sm">
                <span>{exercise.title}</span>
                <span className="text-subtle">
                  {progress?.passed
                    ? `Passed · ${"★".repeat(progress.stars)}${"☆".repeat(3 - progress.stars)}`
                    : progress
                      ? `${progress.attempts} check${progress.attempts === 1 ? "" : "s"}`
                      : "Not tried"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <div>
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="btn border-danger text-danger"
        >
          Reset progress
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="reset-title"
        className="m-auto w-full max-w-md rounded-lg border border-line bg-surface p-6 text-fg backdrop:bg-black/50"
      >
        <h2 id="reset-title" className="text-lg font-medium">
          Reset all progress?
        </h2>
        <p className="mt-2 text-sm text-muted">
          XP, stars, completed lessons and exercise results are deleted from this browser. This
          cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3 text-sm">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="btn"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              dialogRef.current?.close();
            }}
            className="btn-danger"
          >
            Reset progress
          </button>
        </div>
      </dialog>
    </div>
  );
}
