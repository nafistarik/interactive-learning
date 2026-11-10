/**
 * Shape of the lesson theory content (brief Part 5). The text lives in `src/data/lessons/`;
 * the UI only renders it, so a translation can replace the data without touching components.
 */

import type { Exercise } from "@/features/validation/types";

/** Interactive demos a lesson can embed. Each id maps to one component. */
export type DemoId =
  | "edit-array"
  | "dimensions"
  | "shape-picker"
  | "indexing"
  | "vectorization-timing"
  | "elementwise"
  | "broadcast-shapes"
  | "xwb-steps";

/**
 * One block of a theory section. In `text` and list items, a span wrapped in backticks is
 * shown as inline code.
 */
export type ContentBlock =
  | { kind: "text"; text: string }
  | { kind: "list"; items: string[] }
  /** A runnable example. `output` is exactly what the code prints; a test runs it in Pyodide. */
  | { kind: "code"; code: string; output: string }
  /** A short highlighted note, for a definition or a warning. */
  | { kind: "note"; text: string }
  | { kind: "demo"; demo: DemoId };

/** A titled part of a lesson's theory. */
export interface ContentSection {
  title: string;
  blocks: ContentBlock[];
}

/** One multiple-choice question of a knowledge check. */
export interface KnowledgeQuestion {
  id: string;
  question: string;
  options: string[];
  /** Index into `options` of the right answer. */
  answer: number;
  /** One line shown after an answer, right or wrong. */
  explanation: string;
}

/** The theory and practice content of one lesson. */
export interface LessonContent {
  lessonId: string;
  /** One or two sentences shown under the lesson title. */
  summary: string;
  estimatedMinutes: number;
  sections: ContentSection[];
  /** 2 to 4 questions; the check passes when all are answered correctly. */
  knowledgeCheck: KnowledgeQuestion[];
  /** Starter code of the Practice view for lessons without an exercise. */
  practiceStarter?: string;
}

/** One lesson in a module's table of contents. `id` is the URL segment, `01`, `02`, … */
export interface LessonMeta {
  id: string;
  title: string;
}

/**
 * One module of the curriculum: its lessons, their theory and its exercises. A module with
 * `available: false` has no pages yet; it shows as coming soon.
 */
export interface ModuleDef {
  /** URL segment, e.g. `arrays`. */
  slug: string;
  /** Number within its phase, e.g. `0.1`. */
  number: string;
  title: string;
  description: string;
  objectives: string[];
  available: boolean;
  lessons: LessonMeta[];
  /** Theory per lesson, in lesson order. */
  content: readonly LessonContent[];
  exercises: readonly Exercise[];
}

/** A phase of the roadmap (e.g. Phase 0, NumPy for ML) and the modules it holds. */
export interface Phase {
  number: number;
  title: string;
  /** Module slugs in order. A phase without modules is shown as coming soon. */
  modules: string[];
}
