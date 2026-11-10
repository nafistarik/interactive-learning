"use client";

import Link from "next/link";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { findModule, lessonKeysOf, resolveLessonKey } from "@/data/curriculum";
import { completionOf } from "@/features/progress/model";
import { useProgress } from "@/features/progress/progress-context";

/**
 * A module's completion with the Start or Continue button (brief Part 4.2). Continue opens the
 * learner's current lesson when it is in this module, else the first unfinished lesson.
 *
 * @param props.moduleSlug - The module.
 */
export function ModuleProgress({ moduleSlug }: { moduleSlug: string }) {
  const { state, loaded } = useProgress();
  const mod = findModule(moduleSlug);
  if (!mod) {
    return null;
  }
  const keys = lessonKeysOf(mod);
  const { completed, percent } = completionOf(state, keys);
  const current = state.currentLesson ? resolveLessonKey(state.currentLesson) : undefined;
  const target =
    current?.module.slug === mod.slug
      ? current.lesson
      : (mod.lessons.find((_, index) => !state.completedLessons.includes(keys[index])) ?? mod.lessons[0]);
  const started = loaded && keys.some((key) => key === state.currentLesson || state.completedLessons.includes(key));

  return (
    <div className="card mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 p-4">
      <div className="grid min-w-48 flex-1 gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted">
            {loaded ? `${completed} of ${mod.lessons.length} lessons completed` : "Loading progress…"}
          </span>
          <span className="font-medium tabular-nums">{loaded ? `${percent}%` : "–"}</span>
        </div>
        <ProgressBar percent={loaded ? percent : 0} label={`Module ${mod.number} completion`} />
      </div>
      <Link href={`/learn/${mod.slug}/lesson/${target.id}`} className="btn-primary">
        {started ? `Continue: lesson ${target.id}` : "Start the module"}
      </Link>
    </div>
  );
}
