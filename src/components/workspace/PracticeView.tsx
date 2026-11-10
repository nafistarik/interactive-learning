"use client";

import { Monitor } from "lucide-react";

import PythonArena from "@/components/arena/PythonArena";
import type { LessonContent } from "@/features/content/types";
import type { Exercise } from "@/features/validation/types";
import { useMediaQuery } from "@/features/ui/use-media-query";

/**
 * The Practice view (brief Part 4.3): the coding arena with the lesson's exercise, or a free
 * sandbox for lessons without one. On a phone it shows the starter code read-only and says
 * coding works best on a larger screen.
 *
 * @param props.lessonKey - The lesson's progress key; also restarts the arena on a new lesson.
 * @param props.content - The lesson content, for the sandbox starter code.
 * @param props.exercise - The lesson's exercise, if it has one.
 */
export function PracticeView({
  lessonKey,
  content,
  exercise,
}: {
  lessonKey: string;
  content: LessonContent;
  exercise: Exercise | undefined;
}) {
  const wide = useMediaQuery("(min-width: 768px)", true);
  const starter = exercise?.starterCode ?? content.practiceStarter ?? "import numpy as np\n";

  if (!wide) {
    return (
      <div className="grid gap-4">
        <div role="note" className="flex gap-3 rounded-card border border-line bg-surface-2 p-4 text-sm">
          <Monitor className="mt-0.5 size-4 shrink-0 text-subtle" aria-hidden />
          <p>
            Coding works best on a larger screen. Open this lesson on a tablet or computer to run
            the code and step through it. The starter code is below.
          </p>
        </div>
        {exercise ? (
          <div className="grid gap-1 text-sm">
            <p className="font-medium">{exercise.title}</p>
            <p className="text-muted">{exercise.problem}</p>
          </div>
        ) : null}
        {exercise?.prelude ? (
          <pre className="overflow-x-auto rounded-card bg-surface-2 p-3 font-mono text-sm">{exercise.prelude}</pre>
        ) : null}
        <pre aria-label="Starter code" className="overflow-x-auto rounded-card border border-line bg-surface p-3 font-mono text-sm">
          {starter}
        </pre>
      </div>
    );
  }

  return <PythonArena key={lessonKey} lessonKey={lessonKey} starterCode={starter} exercise={exercise} />;
}
