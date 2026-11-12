import type { ChartSpec } from "@/features/visualization/charts";

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
 * (the learner must not change it); `no-loop` rejects `for`, `while` and comprehensions, for
 * exercises whose point is vectorization (values alone cannot show it); `assert` evaluates an
 * authored expression in the learner's namespace (e.g. the loss went down) and shows
 * `message` when it is false.
 */
export type ValidationCheck =
  | {
      kind: "result" | "unchanged";
      name: string;
      expression: string;
      /** Absolute tolerance, for trained values. */
      tolerance?: number;
    }
  | { kind: "no-loop" }
  | { kind: "assert"; expression: string; message: string };

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
  /** `bug-hunt` starts from wrong code the learner must fix. Default `build`. */
  type?: "build" | "bug-hunt";
  /** A chart for Practice: a fit chart for training loops (R3) or a heatmap (R6). */
  chart?: ChartSpec;
  runs: ValidationRun[];
  checks: ValidationCheck[];
  /** A correct answer, used only by the tests. Never shown to the learner. */
  solution: string;
}
