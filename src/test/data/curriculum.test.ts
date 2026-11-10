import { describe, expect, it } from "vitest";

import {
  AVAILABLE_MODULES,
  findLesson,
  findModule,
  lessonKey,
  MODULES,
  PHASES,
  resolveLessonKey,
} from "@/data/curriculum";

/* Structure rules every module must keep, including modules still in development. */
describe.each(MODULES.map((mod) => [mod.slug, mod] as const))("module %s", (_slug, mod) => {
  it("numbers its lessons 01, 02, … in order", () => {
    expect(mod.lessons.map((lesson) => lesson.id)).toEqual(
      mod.lessons.map((_, index) => String(index + 1).padStart(2, "0")),
    );
  });

  it("has theory content for every lesson, in order", () => {
    expect(mod.content.map((content) => content.lessonId)).toEqual(mod.lessons.map((lesson) => lesson.id));
  });

  it("puts each exercise on one of its lessons, at most one per lesson", () => {
    const lessonIds = mod.exercises.map((exercise) => exercise.lessonId);
    for (const id of lessonIds) {
      expect(findLesson(mod, id)).toBeDefined();
    }
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
  });

  it("belongs to a phase", () => {
    expect(PHASES.some((phase) => phase.modules.includes(mod.slug))).toBe(true);
  });
});

describe("curriculum", () => {
  it("starts with the MVP 1 mod, 0.1 Arrays, with its four exercises", () => {
    expect(MODULES[0].slug).toBe("arrays");
    expect(MODULES[0].exercises.map((exercise) => [exercise.id, exercise.lessonId])).toEqual([
      ["ex01", "03"],
      ["ex02", "06"],
      ["ex03", "07"],
      ["ex04", "08"],
    ]);
  });

  it("uses exercise ids that are unique across modules", () => {
    const ids = MODULES.flatMap((mod) => mod.exercises.map((exercise) => exercise.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses unique mod slugs", () => {
    expect(new Set(MODULES.map((mod) => mod.slug)).size).toBe(MODULES.length);
  });

  it("finds only available modules", () => {
    for (const mod of MODULES) {
      expect(findModule(mod.slug)).toBe(mod.available ? mod : undefined);
    }
    expect(AVAILABLE_MODULES.length).toBeGreaterThan(0);
  });

  it.each(["", "nope", "constructor", "../arrays"])("finds no mod for %j", (slug) => {
    expect(findModule(slug)).toBeUndefined();
  });

  it.each(["00", "09", "7", "", "07 ", "../07", "constructor"])("finds no arrays lesson for %j", (lessonId) => {
    expect(findLesson(MODULES[0], lessonId)).toBeUndefined();
  });

  it("round-trips lesson keys and rejects unknown ones", () => {
    expect(resolveLessonKey(lessonKey("arrays", "07"))?.lesson.title).toBe("Understanding Broadcasting");
    expect(resolveLessonKey("arrays/99")).toBeUndefined();
    expect(resolveLessonKey("07")).toBeUndefined();
  });
});
