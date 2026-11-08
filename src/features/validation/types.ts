/**
 * One run of the learner's code for validation: setup code run before it, and reference
 * setup used to compute the expected values in a separate namespace.
 */
export interface ValidationRun {
  prelude: string;
  reference: string;
}

/**
 * One thing to check after the learner's code ran. `result` checks a value against the
 * expression evaluated on the reference; `unchanged` requires the value to equal the reference
 * (the learner must not change it).
 */
export interface ValidationCheck {
  kind: "result" | "unchanged";
  name: string;
  expression: string;
}

/** The verdict of one validation: passed, or what was wrong. */
export interface ValidationOutcome {
  passed: boolean;
  problems: string[];
}

/** An exercise from the curriculum (brief Part 10). */
export interface Exercise {
  id: string;
  lessonId: string;
  title: string;
  objective: string;
  problem: string;
  starterCode: string;
  /** Fixed setup shown above the editor and run before the learner's code. */
  prelude: string;
  hint: string;
  runs: ValidationRun[];
  checks: ValidationCheck[];
  /** A correct answer, used only by the tests. Never shown to the learner. */
  solution: string;
}
