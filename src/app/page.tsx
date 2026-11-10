import Link from "next/link";

import { DashboardSummary } from "@/components/progress/DashboardSummary";

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
      <p className="mt-2 text-muted">
        Learn by writing real Python and watching the data change.
      </p>

      <DashboardSummary />

      <section className="mt-10">
        <h2 className="text-lg font-medium">Roadmap</h2>
        <ul className="mt-3 divide-y divide-line">
          {ROADMAP.map((phase) => (
            <li key={phase.title} className="flex justify-between py-3 text-sm">
              <span>{phase.title}</span>
              <span className="text-subtle">{phase.available ? "Available" : "Coming soon"}</span>
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
