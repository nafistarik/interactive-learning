"use client";

import { useState } from "react";

import type { ExerciseProgress } from "@/features/progress/model";
import type { Exercise, ValidationOutcome } from "@/features/validation/types";

/**
 * Problem, objective, fixed setup, hint and the feedback of the last check (brief Part 10).
 * The solution is never shown.
 *
 * @param props.exercise - The exercise being practised.
 * @param props.verdict - The result of the last check, or `null` before any check.
 * @param props.attempts - How many checks the learner has run.
 * @param props.progress - The saved progress of this exercise, if any.
 * @param props.onHintOpened - Called the first time the hint is opened.
 */
export function ExercisePanel({
  exercise,
  verdict,
  attempts,
  progress,
  onHintOpened,
}: {
  exercise: Exercise;
  verdict: ValidationOutcome | null;
  attempts: number;
  progress: ExerciseProgress | undefined;
  onHintOpened: () => void;
}) {
  const [showHint, setShowHint] = useState(false);

  /** Toggles the hint and reports the first time it is opened. */
  function toggleHint() {
    if (!showHint) {
      onHintOpened();
    }
    setShowHint((value) => !value);
  }

  return (
    <section
      aria-label="Exercise"
      className="grid gap-3 card p-4"
    >
      <div>
        <h3 className="text-base font-medium">
          {exercise.type === "bug-hunt" ? (
            <span className="mr-2 rounded-full bg-warn-soft px-2 py-0.5 align-middle text-xs font-medium text-warn">
              Bug hunt
            </span>
          ) : null}
          {exercise.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{exercise.objective}</p>
      </div>
      <p className="text-sm">
        {exercise.type === "bug-hunt" ? "The code below has a bug. Find and fix it. " : null}
        {exercise.problem}
      </p>

      {exercise.prelude ? (
        <div className="grid gap-1">
          <p className="text-xs text-subtle">Fixed setup, runs before your code</p>
          <pre className="overflow-x-auto rounded-md bg-surface-2 p-3 font-mono text-sm ">
            {exercise.prelude}
          </pre>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button type="button" onClick={toggleHint} className="underline">
          {showHint ? "Hide hint" : "Show hint"}
        </button>
        <span className="text-subtle">Checks run: {attempts}</span>
      </div>
      {showHint ? <p className="text-sm text-muted">{exercise.hint}</p> : null}

      {verdict ? (
        verdict.passed ? (
          <p role="status" className="text-sm font-medium text-success">
            Passed. Your code gives the right results.
            {progress?.passed ? ` Stars: ${"★".repeat(progress.stars)}${"☆".repeat(3 - progress.stars)}. +100 XP.` : null}
          </p>
        ) : (
          <div role="status" className="grid gap-1 text-sm text-danger">
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
