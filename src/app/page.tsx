import { Lock } from "lucide-react";

import { DashboardSummary } from "@/components/progress/DashboardSummary";
import { PhaseModules } from "@/components/progress/PhaseModules";
import { PHASES } from "@/data/curriculum";

/** Dashboard (`/`), brief Part 4.1: welcome, progress, the open phase's modules, the roadmap. */
export default function DashboardPage() {
  const [current, ...later] = PHASES;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
      <p className="mt-1 max-w-2xl text-muted">
        Learn by writing real Python in your browser and watching what happens to the data, one
        statement at a time.
      </p>

      <DashboardSummary />

      <section className="mt-10" aria-labelledby="phase-title">
        <h2 id="phase-title" className="text-sm font-medium uppercase tracking-wide text-subtle">
          Phase {current.number} · {current.title}
        </h2>
        <PhaseModules phase={current} />
      </section>

      <section className="mt-10" aria-labelledby="roadmap-title">
        <h2 id="roadmap-title" className="text-sm font-medium uppercase tracking-wide text-subtle">
          Roadmap
        </h2>
        <ol className="mt-3 grid gap-2">
          {later.map((phase) => (
            <li
              key={phase.number}
              className="flex items-center justify-between gap-4 rounded-card border border-line px-4 py-3 text-sm text-subtle"
            >
              <span>
                <span className="font-mono text-xs">Phase {phase.number}</span>
                <span className="ml-3 font-medium">{phase.title}</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs">
                <Lock className="size-3.5" aria-hidden /> Coming soon
              </span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
