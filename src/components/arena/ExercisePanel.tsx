"use client";

import { useState } from "react";

import type { Exercise, ValidationOutcome } from "@/features/validation/types";

/**
 * Problem, objective, fixed setup, hint and the feedback of the last check (brief Part 10).
 * The solution is never shown.
 *
 * @param props.exercise - The exercise being practised.
 * @param props.verdict - The result of the last check, or `null` before any check.
 * @param props.attempts - How many checks the learner has run.
 */
export function ExercisePanel({
  exercise,
  verdict,
  attempts,
}: {
  exercise: Exercise;
  verdict: ValidationOutcome | null;
  attempts: number;
}) {
  const [showHint, setShowHint] = useState(false);

  return (
    <section
      aria-label="Exercise"
      className="grid gap-3 rounded-md border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <div>
        <h3 className="text-base font-medium">{exercise.title}</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{exercise.objective}</p>
      </div>
      <p className="text-sm">{exercise.problem}</p>

      {exercise.prelude ? (
        <div className="grid gap-1">
          <p className="text-xs text-zinc-500">Fixed setup, runs before your code</p>
          <pre className="overflow-x-auto rounded-md bg-zinc-100 p-3 font-mono text-sm dark:bg-zinc-900">
            {exercise.prelude}
          </pre>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button type="button" onClick={() => setShowHint((value) => !value)} className="underline">
          {showHint ? "Hide hint" : "Show hint"}
        </button>
        <span className="text-zinc-500">Checks run: {attempts}</span>
      </div>
      {showHint ? <p className="text-sm text-zinc-600 dark:text-zinc-400">{exercise.hint}</p> : null}

      {verdict ? (
        verdict.passed ? (
          <p role="status" className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Passed. Your code gives the right results. XP and stars are added with progress tracking.
          </p>
        ) : (
          <div role="status" className="grid gap-1 text-sm text-red-600 dark:text-red-400">
            <p className="font-medium">Not yet:</p>
            <ul className="list-disc pl-5">
              {verdict.problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          </div>
        )
      ) : null}
    </section>
  );
}
