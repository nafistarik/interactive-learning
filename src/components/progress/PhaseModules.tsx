"use client";

import { Lock } from "lucide-react";
import Link from "next/link";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { lessonKeysOf, MODULES } from "@/data/curriculum";
import type { Phase } from "@/features/content/types";
import { completionOf } from "@/features/progress/model";
import { useProgress } from "@/features/progress/progress-context";

/**
 * The modules of one phase: available ones with their completion and a link, the others as
 * in development.
 *
 * @param props.phase - The phase to list.
 */
export function PhaseModules({ phase }: { phase: Phase }) {
  const { state, loaded } = useProgress();
  const modules = phase.modules.flatMap((slug) => MODULES.filter((module) => module.slug === slug));

  return (
    <ol className="mt-3 grid gap-3 sm:grid-cols-2">
      {modules.map((module) => {
        const { percent } = completionOf(state, lessonKeysOf(module));
        const body = (
          <>
            <span className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-xs text-subtle">Module {module.number}</span>
              {module.available ? (
                <span className="text-sm font-medium tabular-nums">{loaded ? `${percent}%` : "–"}</span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-subtle">
                  <Lock className="size-3.5" aria-hidden /> In development
                </span>
              )}
            </span>
            <span className="font-medium">{module.title}</span>
            <span className="text-sm text-muted">{module.description}</span>
            {module.available ? (
              <ProgressBar percent={loaded ? percent : 0} label={`Module ${module.number} completion`} />
            ) : null}
          </>
        );
        return (
          <li key={module.slug}>
            {module.available ? (
              <Link href={`/learn/${module.slug}`} className="card grid h-full gap-2 p-4 hover:border-line-strong">
                {body}
              </Link>
            ) : (
              <div className="grid h-full gap-2 rounded-card border border-dashed border-line p-4 text-subtle">{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
