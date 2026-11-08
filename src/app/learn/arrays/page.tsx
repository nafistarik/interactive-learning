import Link from "next/link";

import { ARRAYS_MODULE } from "@/data/arrays-module";

/**
 * Module overview (`/learn/arrays`), brief Part 4.2. Lesson completion status comes with
 * milestone 2, so every lesson shows as not started for now.
 */
export default function ArraysModulePage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <nav className="text-sm text-zinc-500">
        <Link href="/" className="underline">
          Dashboard
        </Link>{" "}
        / {ARRAYS_MODULE.title}
      </nav>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{ARRAYS_MODULE.title}</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{ARRAYS_MODULE.description}</p>

      <ol className="mt-8 divide-y divide-zinc-200 dark:divide-zinc-800">
        {ARRAYS_MODULE.lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={`/learn/arrays/lesson/${lesson.id}`}
              className="flex items-center justify-between py-3 hover:underline"
            >
              <span>
                {lesson.id}. {lesson.title}
              </span>
              {lesson.hasExercise ? <span className="text-xs text-zinc-500">Exercise</span> : null}
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
