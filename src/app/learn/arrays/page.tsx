import { Clock, Target } from "lucide-react";

import { LessonList } from "@/components/progress/LessonList";
import { ModuleProgress } from "@/components/progress/ModuleProgress";
import { ARRAYS_MODULE } from "@/data/arrays-module";
import { LESSON_CONTENT } from "@/data/lessons";

/** Total estimated time of the module, from the lessons' estimates. */
const TOTAL_MINUTES = LESSON_CONTENT.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0);

/**
 * Module overview (`/learn/arrays`), brief Part 4.2: description, objectives, estimated time,
 * the eight lessons with status and exercises, overall progress, and Start/Continue.
 */
export default function ArraysModulePage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <p className="font-mono text-xs text-subtle">Phase 0 · Module</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{ARRAYS_MODULE.title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{ARRAYS_MODULE.description}</p>
      <p className="mt-3 flex items-center gap-1.5 text-sm text-subtle">
        <Clock className="size-4" aria-hidden /> About {Math.round(TOTAL_MINUTES / 5) * 5} minutes ·{" "}
        {ARRAYS_MODULE.lessons.length} lessons · 4 exercises
      </p>

      <ModuleProgress />

      <section className="mt-10" aria-labelledby="objectives-title">
        <h2 id="objectives-title" className="text-sm font-medium uppercase tracking-wide text-subtle">
          You will be able to
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {ARRAYS_MODULE.objectives.map((objective) => (
            <li key={objective} className="flex gap-2 text-sm">
              <Target className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              {objective}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="lessons-title">
        <h2 id="lessons-title" className="text-sm font-medium uppercase tracking-wide text-subtle">
          Lessons
        </h2>
        <LessonList
          lessons={LESSON_CONTENT.map((content) => ({
            lessonId: content.lessonId,
            summary: content.summary,
            minutes: content.estimatedMinutes,
          }))}
        />
      </section>
    </main>
  );
}
