import type { PyodideInterface } from "pyodide";
import { beforeAll, describe, expect, it } from "vitest";

import { MODULES } from "@/data/curriculum";
import { runPython } from "@/lib/python/run-python";

import { loadTestPyodide } from "../lib/python/load-test-pyodide";

/** Every lesson of every module, including modules still in development. */
const LESSON_CONTENT = MODULES.flatMap((module) =>
  module.content.map((lesson) => ({ ...lesson, lessonId: `${module.slug}/${lesson.lessonId}` })),
);

/** Every code example in the lessons, with where it comes from. */
const examples = LESSON_CONTENT.flatMap((lesson) =>
  lesson.sections.flatMap((section) =>
    section.blocks.flatMap((block, index) =>
      block.kind === "code"
        ? [{ label: `lesson ${lesson.lessonId} · ${section.title} · block ${index}`, ...block }]
        : [],
    ),
  ),
);

describe("lesson content structure", () => {
  it.each(LESSON_CONTENT.map((lesson) => [lesson.lessonId, lesson] as const))(
    "lesson %s has a 2–4 question check with valid answers",
    (_id, lesson) => {
      expect(lesson.knowledgeCheck.length).toBeGreaterThanOrEqual(2);
      expect(lesson.knowledgeCheck.length).toBeLessThanOrEqual(4);
      for (const question of lesson.knowledgeCheck) {
        expect(question.answer).toBeGreaterThanOrEqual(0);
        expect(question.answer).toBeLessThan(question.options.length);
      }
      expect(new Set(lesson.knowledgeCheck.map((question) => question.id)).size).toBe(
        lesson.knowledgeCheck.length,
      );
    },
  );

  it("has code examples to run", () => {
    expect(examples.length).toBeGreaterThan(0);
  });
});

/* Brief Part 5 and 14: every code example runs in Pyodide and prints what the text says. */
describe("lesson code examples run in Pyodide", () => {
  let pyodide: PyodideInterface;

  beforeAll(async () => {
    pyodide = await loadTestPyodide();
  }, 180_000);

  it.each(examples.map((example) => [example.label, example] as const))(
    "%s",
    async (_label, example) => {
      // Each example runs in a fresh namespace, as the learner would run it alone.
      const result = await runPython(pyodide, `exec(${JSON.stringify(example.code)}, {})`);
      expect(result).toEqual({ ok: true, stdout: example.output });
    },
  );
});
