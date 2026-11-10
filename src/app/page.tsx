import { Lock } from "lucide-react";

import { DashboardSummary } from "@/components/progress/DashboardSummary";
import { ROADMAP } from "@/data/arrays-module";

/** Dashboard (`/`), brief Part 4.1: welcome, the module with its progress, and the roadmap. */
export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
      <p className="mt-1 max-w-2xl text-muted">
        Learn by writing real Python in your browser and watching what happens to the data, one
        statement at a time.
      </p>

      <DashboardSummary />

      <section className="mt-10" aria-labelledby="roadmap-title">
        <h2 id="roadmap-title" className="text-sm font-medium uppercase tracking-wide text-subtle">
          Roadmap
        </h2>
        <ol className="mt-3 grid gap-2">
          {ROADMAP.map((phase, index) => (
            <li
              key={phase.title}
              className={`flex items-center justify-between gap-4 rounded-card border border-line px-4 py-3 text-sm ${
                phase.available ? "bg-surface" : "text-subtle"
              }`}
            >
              <span>
                <span className="font-mono text-xs text-subtle">Phase {index}</span>
                <span className="ml-3 font-medium">{phase.title}</span>
                {phase.available ? (
                  <span className="ml-2 hidden text-subtle sm:inline">· Module 0.1 available, more modules coming</span>
                ) : null}
              </span>
              {phase.available ? (
                <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">
                  Available
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs">
                  <Lock className="size-3.5" aria-hidden /> Coming soon
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
