import Link from "next/link";

import { ARRAYS_MODULE } from "@/data/arrays-module";

/** Roadmap phases from brief Part 4.1. Only the first phase has pages. */
const ROADMAP = [
  { title: "Arrays, Vectorization & Broadcasting", available: true },
  { title: "Machine Learning", available: false },
  { title: "Deep Learning", available: false },
  { title: "Transformers", available: false },
  { title: "Reinforcement Learning", available: false },
  { title: "Agentic AI", available: false },
];

/**
 * Dashboard (`/`), brief Part 4.1. Progress numbers come with milestone 2, so this page
 * shows the module and its lesson count only.
 */
export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Interactive Learning</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Learn by writing real Python and watching the data change.
      </p>

      <section className="mt-8 rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
        <h2 className="text-lg font-medium">{ARRAYS_MODULE.title}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {ARRAYS_MODULE.lessons.length} lessons
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            href="/learn/arrays"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Open module
          </Link>
          <Link
            href={`/learn/arrays/lesson/${ARRAYS_MODULE.lessons[0].id}`}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
          >
            Start lesson 01
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Roadmap</h2>
        <ul className="mt-3 divide-y divide-zinc-200 dark:divide-zinc-800">
          {ROADMAP.map((phase) => (
            <li key={phase.title} className="flex justify-between py-3 text-sm">
              <span>{phase.title}</span>
              <span className="text-zinc-500">{phase.available ? "Available" : "Coming soon"}</span>
            </li>
          ))}
        </ul>
      </section>

      <nav className="mt-10 text-sm">
        <Link href="/progress" className="underline">
          Progress
        </Link>
      </nav>
    </main>
  );
}
