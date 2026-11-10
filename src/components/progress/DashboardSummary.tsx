"use client";

import Link from "next/link";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { ARRAYS_MODULE, findLesson } from "@/data/arrays-module";
import { EXERCISES } from "@/data/exercises";
import { totalsOf } from "@/features/progress/model";
import { useProgress } from "@/features/progress/progress-context";

/**
 * The module card on the dashboard: completion, completed lessons, XP, stars and the
 * "Continue learning" link (brief Part 4.1). Shows dashes until the saved progress is read.
 */
export function DashboardSummary() {
  const { state, loaded } = useProgress();
  const totals = totalsOf(state);
  const continueLesson = findLesson(state.currentLesson ?? "") ?? ARRAYS_MODULE.lessons[0];
  const value = (text: string | number) => (loaded ? text : "–");

  return (
    <section className="card mt-8 p-6" aria-labelledby="module-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-subtle">Phase 0 · Module 0.1 · {ARRAYS_MODULE.lessons.length} lessons</p>
          <h2 id="module-title" className="mt-1 text-lg font-semibold">
            {ARRAYS_MODULE.title}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted">{ARRAYS_MODULE.description}</p>
        </div>
        <span className="text-2xl font-semibold tabular-nums">{value(`${totals.modulePercent}%`)}</span>
      </div>

      <div className="mt-4">
        <ProgressBar percent={loaded ? totals.modulePercent : 0} label="Module completion" />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-4 text-sm">
        <div>
          <dt className="text-subtle">Lessons completed</dt>
          <dd className="mt-0.5 font-medium tabular-nums">
            {value(`${totals.completedLessons} / ${ARRAYS_MODULE.lessons.length}`)}
          </dd>
        </div>
        <div>
          <dt className="text-subtle">Total XP</dt>
          <dd className="mt-0.5 font-medium tabular-nums">{value(totals.xp)}</dd>
        </div>
        <div>
          <dt className="text-subtle">Stars</dt>
          <dd className="mt-0.5 font-medium tabular-nums">{value(`${totals.stars} / ${EXERCISES.length * 3}`)}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href={`/learn/arrays/lesson/${continueLesson.id}`} className="btn-primary">
          Continue learning
        </Link>
        <span className="text-sm text-subtle">
          {loaded ? `Lesson ${continueLesson.id}: ${continueLesson.title}` : null}
        </span>
        <Link href="/learn/arrays" className="btn ml-auto">
          Module overview
        </Link>
      </div>
    </section>
  );
}
