"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

import type { KnowledgeQuestion } from "@/features/content/types";

import { InlineText } from "./InlineText";

/**
 * Multiple-choice knowledge check (brief Part 5). Each answer shows right or wrong with a
 * one-line explanation; a wrong answer can be changed. When every question is answered
 * correctly, `onPassed` is called once.
 *
 * @param props.lessonId - The lesson, used for unique input names.
 * @param props.questions - The questions.
 * @param props.passedBefore - Whether this check passed in an earlier visit.
 * @param props.onPassed - Called when all answers are right.
 */
export function KnowledgeCheck({
  lessonId,
  questions,
  passedBefore,
  onPassed,
}: {
  lessonId: string;
  questions: KnowledgeQuestion[];
  passedBefore: boolean;
  onPassed: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const correct = questions.filter((question) => answers[question.id] === question.answer).length;
  const allCorrect = correct === questions.length;

  function choose(question: KnowledgeQuestion, option: number) {
    const next = { ...answers, [question.id]: option };
    setAnswers(next);
    if (questions.every((item) => next[item.id] === item.answer)) {
      onPassed();
    }
  }

  return (
    <section aria-labelledby={`check-${lessonId}`} className="card grid gap-6 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`check-${lessonId}`} className="text-lg font-semibold">
          Knowledge check
        </h2>
        <p className="text-sm text-subtle" role="status">
          {allCorrect || passedBefore
            ? "Passed. Every answer is right."
            : `${correct} of ${questions.length} answered correctly`}
        </p>
      </div>

      {questions.map((question, number) => {
        const chosen = answers[question.id];
        const answered = chosen !== undefined;
        const right = chosen === question.answer;
        return (
          <fieldset key={question.id} className="grid gap-2">
            <legend className="mb-2 font-medium">
              {number + 1}. <InlineText text={question.question} />
            </legend>
            {question.options.map((option, index) => {
              const selected = chosen === index;
              return (
                <label
                  key={option}
                  className={`flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2 text-sm has-focus-visible:outline-2 has-focus-visible:outline-accent ${
                    selected
                      ? right
                        ? "border-success bg-success-soft"
                        : "border-danger bg-danger-soft"
                      : "border-line hover:bg-surface-2"
                  }`}
                >
                  <input
                    type="radio"
                    name={`${lessonId}-${question.id}`}
                    checked={selected}
                    onChange={() => choose(question, index)}
                    className="mt-0.5 accent-[var(--accent)]"
                  />
                  <span>
                    <InlineText text={option} />
                  </span>
                </label>
              );
            })}
            {answered ? (
              <p
                role="status"
                className={`flex items-start gap-2 text-sm ${right ? "text-success" : "text-danger"}`}
              >
                {right ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                )}
                <span>
                  <span className="font-medium">{right ? "Right. " : "Not quite. "}</span>
                  <InlineText text={question.explanation} />
                  {right ? null : " Try another answer."}
                </span>
              </p>
            ) : null}
          </fieldset>
        );
      })}
    </section>
  );
}
