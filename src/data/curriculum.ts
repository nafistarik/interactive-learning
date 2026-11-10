/**
 * The curriculum: phases, their modules, and lookups by URL segment (R2 brief). Content only;
 * each module lives in `src/data/modules/<slug>/`.
 */
import type { LessonContent, LessonMeta, ModuleDef, Phase } from "@/features/content/types";
import type { Exercise } from "@/features/validation/types";

import { ARRAYS_MODULE } from "./modules/arrays/module";
import { MATMUL_MODULE } from "./modules/matmul/module";
import { REDUCTIONS_MODULE } from "./modules/reductions/module";
import { RESHAPE_MODULE } from "./modules/reshape/module";

/** Every module, in learning order, including ones still in development. */
export const MODULES: readonly ModuleDef[] = [ARRAYS_MODULE, MATMUL_MODULE, REDUCTIONS_MODULE, RESHAPE_MODULE];

/** The roadmap. Only phase 0 has modules so far. */
export const PHASES: readonly Phase[] = [
  { number: 0, title: "NumPy for ML", modules: ["arrays", "matmul", "reductions", "reshape"] },
  { number: 1, title: "Machine Learning", modules: [] },
  { number: 2, title: "Deep Learning", modules: [] },
  { number: 3, title: "Transformers", modules: [] },
  { number: 4, title: "Reinforcement Learning", modules: [] },
  { number: 5, title: "Agentic AI", modules: [] },
];

/** Modules learners can open, in learning order. */
export const AVAILABLE_MODULES: readonly ModuleDef[] = MODULES.filter((mod) => mod.available);

/**
 * The module with this URL segment, if it is available.
 *
 * @param slug - The `[module]` segment.
 * @returns The module, or `undefined` (unknown or not available yet).
 */
export function findModule(slug: string): ModuleDef | undefined {
  return AVAILABLE_MODULES.find((mod) => mod.slug === slug);
}

/**
 * A lesson of a module by its id.
 *
 * @param module - The module.
 * @param lessonId - The `[lessonId]` segment.
 * @returns The lesson, or `undefined`.
 */
export function findLesson(mod: ModuleDef, lessonId: string): LessonMeta | undefined {
  return mod.lessons.find((lesson) => lesson.id === lessonId);
}

/**
 * The theory content of a lesson.
 *
 * @param module - The module.
 * @param lessonId - The lesson id.
 * @returns The content, or `undefined`.
 */
export function findLessonContent(mod: ModuleDef, lessonId: string): LessonContent | undefined {
  return mod.content.find((content) => content.lessonId === lessonId);
}

/**
 * The exercise of a lesson, if it has one.
 *
 * @param module - The module.
 * @param lessonId - The lesson id.
 * @returns The exercise, or `undefined`.
 */
export function findExercise(mod: ModuleDef, lessonId: string): Exercise | undefined {
  return mod.exercises.find((exercise) => exercise.lessonId === lessonId);
}

/**
 * The key a lesson has in the saved progress: `"<module>/<lesson>"`, e.g. `"arrays/07"`.
 *
 * @param slug - The module slug.
 * @param lessonId - The lesson id.
 * @returns The key.
 */
export function lessonKey(slug: string, lessonId: string): string {
  return `${slug}/${lessonId}`;
}

/**
 * Splits a progress key back into module and lesson, if both still exist and are available.
 *
 * @param key - A key from {@link lessonKey}.
 * @returns The module and lesson, or `undefined`.
 */
export function resolveLessonKey(key: string): { module: ModuleDef; lesson: LessonMeta } | undefined {
  const [slug, lessonId] = key.split("/");
  const mod = findModule(slug ?? "");
  const lesson = mod && findLesson(mod, lessonId ?? "");
  return mod && lesson ? { module: mod, lesson } : undefined;
}

/** Every exercise of the available modules, in order. */
export const AVAILABLE_EXERCISES: readonly Exercise[] = AVAILABLE_MODULES.flatMap((mod) => mod.exercises);

/** Progress keys of every lesson of a module, in order. */
export function lessonKeysOf(mod: ModuleDef): string[] {
  return mod.lessons.map((lesson) => lessonKey(mod.slug, lesson.id));
}
