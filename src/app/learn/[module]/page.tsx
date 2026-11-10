import { Clock, Target } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LessonList } from "@/components/progress/LessonList";
import { ModuleProgress } from "@/components/progress/ModuleProgress";
import { AVAILABLE_MODULES, findModule, PHASES } from "@/data/curriculum";

/** Only available modules have an overview page. */
export const dynamicParams = false;

/** Prerenders the overview of every available module. */
export function generateStaticParams() {
  return AVAILABLE_MODULES.map((mod) => ({ module: mod.slug }));
}

type Params = Promise<{ module: string }>;

/** Page title per module. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const mod = findModule((await params).module);
  return { title: mod ? `${mod.number} ${mod.title} · Interactive Learning` : "Interactive Learning" };
}

/**
 * Module overview (`/learn/[module]`), brief Part 4.2: description, objectives, estimated
 * time, the lessons with status and exercises, overall progress, and Start/Continue.
 *
 * @param props.params - Route params: the module slug.
 */
export default async function ModulePage({ params }: { params: Params }) {
  const mod = findModule((await params).module);
  if (!mod) {
    notFound();
  }
  const minutes = mod.content.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0);
  const phase = PHASES.find((item) => item.modules.includes(mod.slug));

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <p className="font-mono text-xs text-subtle">
        {phase ? `Phase ${phase.number} · ${phase.title} · ` : ""}Module {mod.number}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{mod.title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{mod.description}</p>
      <p className="mt-3 flex items-center gap-1.5 text-sm text-subtle">
        <Clock className="size-4" aria-hidden /> About {Math.max(5, Math.round(minutes / 5) * 5)} minutes ·{" "}
        {mod.lessons.length} lessons · {mod.exercises.length} exercises
      </p>

      <ModuleProgress moduleSlug={mod.slug} />

      <section className="mt-10" aria-labelledby="objectives-title">
        <h2 id="objectives-title" className="text-sm font-medium uppercase tracking-wide text-subtle">
          You will be able to
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {mod.objectives.map((objective) => (
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
        <LessonList moduleSlug={mod.slug} />
      </section>
    </main>
  );
}
