"use client";

import { Code2, Info } from "lucide-react";

import { DemoBlock } from "@/components/demos/DemoBlock";
import { CodeExample } from "@/components/theory/CodeExample";
import { InlineText } from "@/components/theory/InlineText";
import { KnowledgeCheck } from "@/components/theory/KnowledgeCheck";
import type { ContentBlock, LessonContent } from "@/features/content/types";
import { useProgress } from "@/features/progress/progress-context";

/**
 * Renders one block of lesson content.
 *
 * @param props.block - The block from the lesson data.
 */
function Block({ block }: { block: ContentBlock }) {
  switch (block.kind) {
    case "text":
      return (
        <p className="leading-7">
          <InlineText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="grid list-disc gap-1.5 pl-5 leading-7 marker:text-subtle">
          {block.items.map((item) => (
            <li key={item}>
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <p className="flex gap-3 rounded-card border border-line bg-accent-soft/40 p-3 text-sm leading-6">
          <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <span>
            <InlineText text={block.text} />
          </span>
        </p>
      );
    case "code":
      return <CodeExample code={block.code} output={block.output} />;
    case "demo":
      return <DemoBlock demo={block.demo} />;
  }
}

/**
 * The Theory view (brief Part 4.3 and 5): explanation, interactive demo and knowledge check.
 *
 * @param props.content - The lesson content.
 * @param props.lessonKey - The lesson's progress key, `"<module>/<lesson>"`.
 * @param props.exerciseId - The lesson's exercise, if any, for the completion rule.
 * @param props.onOpenPractice - Switches to the Practice view.
 */
export function TheoryView({
  content,
  lessonKey,
  exerciseId,
  onOpenPractice,
}: {
  content: LessonContent;
  lessonKey: string;
  exerciseId: string | undefined;
  onOpenPractice: () => void;
}) {
  const { state, passKnowledgeCheck } = useProgress();

  return (
    <article className="grid max-w-3xl gap-10">
      {content.sections.map((section) => (
        <section key={section.title} className="grid gap-4">
          <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>
          {section.blocks.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </section>
      ))}

      <KnowledgeCheck
        lessonId={lessonKey.replace("/", "-")}
        questions={content.knowledgeCheck}
        passedBefore={state.passedChecks.includes(lessonKey)}
        onPassed={() => passKnowledgeCheck(lessonKey, exerciseId)}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-surface p-4">
        <p className="text-sm text-muted">
          {exerciseId
            ? "This lesson has an exercise. Pass it and the knowledge check to complete the lesson."
            : "Try the code yourself in the Practice view."}
        </p>
        <button type="button" onClick={onOpenPractice} className="btn-primary">
          <Code2 className="size-4" aria-hidden /> Open Practice
        </button>
      </div>
    </article>
  );
}
