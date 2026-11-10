"use client";

import Link from "next/link";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { ARRAYS_MODULE, findLesson } from "@/data/arrays-module";
import { totalsOf } from "@/features/progress/model";
import { useProgress } from "@/features/progress/progress-context";

/** Overall module progress with the Start or Continue button (brief Part 4.2). */
export function ModuleProgress() {
  const { state, loaded } = useProgress();
  const totals = totalsOf(state);
  const started = loaded && state.currentLesson !== null;
  const target = findLesson(state.currentLesson ?? "") ?? ARRAYS_MODULE.lessons[0];

  return (
    <div className="card mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 p-4">
      <div className="grid min-w-48 flex-1 gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted">
            {loaded ? `${totals.completedLessons} of ${ARRAYS_MODULE.lessons.length} lessons completed` : "Loading progress…"}
          </span>
          <span className="font-medium tabular-nums">{loaded ? `${totals.modulePercent}%` : "–"}</span>
        </div>
        <ProgressBar percent={loaded ? totals.modulePercent : 0} label="Module completion" />
      </div>
      <Link href={`/learn/arrays/lesson/${target.id}`} className="btn-primary">
        {started ? `Continue: lesson ${target.id}` : "Start the module"}
      </Link>
    </div>
  );
}
