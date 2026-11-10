/**
 * Shape of the lesson theory content (brief Part 5). The text lives in `src/data/lessons/`;
 * the UI only renders it, so a translation can replace the data without touching components.
 */

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
