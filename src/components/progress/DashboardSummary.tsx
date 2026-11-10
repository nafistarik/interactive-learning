"use client";

import Link from "next/link";

import { AVAILABLE_EXERCISES, AVAILABLE_MODULES, resolveLessonKey } from "@/data/curriculum";
import { totalsOf } from "@/features/progress/model";
import { useProgress } from "@/features/progress/progress-context";

/**
 * Totals across all modules and the "Continue learning" link (brief Part 4.1). Continue opens
 * the current lesson, or the first lesson for a new learner. Shows dashes until the saved
 * progress is read.
 */
export function DashboardSummary() {
  const { state, loaded } = useProgress();
  const totals = totalsOf(state);
  const first = AVAILABLE_MODULES[0];
  const current = (state.currentLesson && resolveLessonKey(state.currentLesson)) || {
    module: first,
    lesson: first.lessons[0],
  };
  const lessonCount = AVAILABLE_MODULES.reduce((sum, module) => sum + module.lessons.length, 0);
  const value = (text: string | number) => (loaded ? text : "–");

  return (
    <section className="card mt-8 p-6" aria-label="Your progress">
      <dl className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <dt className="text-subtle">Lessons completed</dt>
          <dd className="mt-0.5 text-lg font-medium tabular-nums">{value(`${totals.completedLessons} / ${lessonCount}`)}</dd>
        </div>
        <div>
          <dt className="text-subtle">Total XP</dt>
          <dd className="mt-0.5 text-lg font-medium tabular-nums">{value(totals.xp)}</dd>
        </div>
        <div>
          <dt className="text-subtle">Stars</dt>
          <dd className="mt-0.5 text-lg font-medium tabular-nums">
            {value(`${totals.stars} / ${AVAILABLE_EXERCISES.length * 3}`)}
          </dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/learn/${current.module.slug}/lesson/${current.lesson.id}`}
          className="btn-primary"
        >
          Continue learning
        </Link>
        <span className="text-sm text-subtle">
          {loaded ? `Module ${current.module.number}, lesson ${current.lesson.id}: ${current.lesson.title}` : null}
        </span>
      </div>
    </section>
  );
}
