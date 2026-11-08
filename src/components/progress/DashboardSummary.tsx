"use client";

import Link from "next/link";

import { ARRAYS_MODULE } from "@/data/arrays-module";
import { totalsOf } from "@/features/progress/model";
import { useProgress } from "@/features/progress/progress-context";

/**
 * The module card on the dashboard: completion, completed lessons, XP, stars and the
 * "Continue learning" link (brief Part 4.1). Shows dashes until the saved progress is read.
 */
export function DashboardSummary() {
  const { state, loaded } = useProgress();
  const totals = totalsOf(state);
  const continueLesson = state.currentLesson ?? ARRAYS_MODULE.lessons[0].id;
  const value = (text: string | number) => (loaded ? text : "–");

  return (
    <section className="mt-8 rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="text-lg font-medium">{ARRAYS_MODULE.title}</h2>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-zinc-500">Module</dt>
          <dd className="font-medium">{value(`${totals.modulePercent}%`)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Lessons completed</dt>
          <dd className="font-medium">{value(`${totals.completedLessons} / ${ARRAYS_MODULE.lessons.length}`)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">XP</dt>
          <dd className="font-medium">{value(totals.xp)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Stars</dt>
          <dd className="font-medium">{value(totals.stars)}</dd>
        </div>
      </dl>
      <div className="mt-4 flex gap-3">
        <Link
          href={`/learn/arrays/lesson/${continueLesson}`}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Continue learning
        </Link>
        <Link
          href="/learn/arrays"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
        >
          Open module
        </Link>
      </div>
    </section>
  );
}
