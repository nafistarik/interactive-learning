"use client";

import Link from "next/link";
import { useRef } from "react";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { AVAILABLE_EXERCISES, AVAILABLE_MODULES, findExercise, lessonKey, lessonKeysOf } from "@/data/curriculum";
import { completionOf, lessonStatusOf, totalsOf } from "@/features/progress/model";
import { useProgress } from "@/features/progress/progress-context";
import { LESSON_STATUS_TEXT } from "@/data/ui-text";

/**
 * The progress page (brief Part 4.4): totals, then per module its completion, each lesson's
 * status and exercise stars; Reset progress behind a confirmation dialog.
 */
export function ProgressView() {
  const { state, loaded, reset } = useProgress();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const totals = totalsOf(state);

  if (!loaded) {
    return <p className="mt-6 text-subtle">Loading your progress…</p>;
  }

  const lessonCount = AVAILABLE_MODULES.reduce((sum, module) => sum + module.lessons.length, 0);

  return (
    <div className="mt-6 grid gap-8">
      <dl className="card grid grid-cols-2 gap-4 p-5 text-sm sm:grid-cols-4">
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
            {totals.completedLessons} / {lessonCount}
          </dd>
        </div>
        <div>
          <dt className="text-subtle">Exercises passed</dt>
          <dd className="text-lg font-medium">
            {totals.passedExercises} / {AVAILABLE_EXERCISES.length}
          </dd>
        </div>
      </dl>

      {AVAILABLE_MODULES.map((module) => {
        const { percent } = completionOf(state, lessonKeysOf(module));
        return (
          <section key={module.slug} className="grid gap-3" aria-labelledby={`progress-${module.slug}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id={`progress-${module.slug}`} className="text-base font-medium">
                <span className="font-mono text-xs text-subtle">Module {module.number}</span> {module.title}
              </h2>
              <span className="text-sm font-medium tabular-nums">{percent}%</span>
            </div>
            <ProgressBar percent={percent} label={`Module ${module.number} completion`} />
            <ul className="divide-y divide-line">
              {module.lessons.map((lesson) => {
                const exercise = findExercise(module, lesson.id);
                const progress = exercise ? state.exercises[exercise.id] : undefined;
                return (
                  <li key={lesson.id} className="flex flex-wrap justify-between gap-x-4 py-2 text-sm">
                    <Link href={`/learn/${module.slug}/lesson/${lesson.id}`} className="hover:underline">
                      {lesson.id}. {lesson.title}
                    </Link>
                    <span className="flex gap-4 text-subtle">
                      {exercise ? (
                        <span>
                          {progress?.passed
                            ? `Exercise passed · ${"★".repeat(progress.stars)}${"☆".repeat(3 - progress.stars)}`
                            : progress
                              ? `Exercise: ${progress.attempts} check${progress.attempts === 1 ? "" : "s"}`
                              : "Exercise not tried"}
                        </span>
                      ) : null}
                      <span>{LESSON_STATUS_TEXT[lessonStatusOf(state, lessonKey(module.slug, lesson.id), exercise?.id)]}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

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
