import type { PythonRunResult } from "@/lib/python/run-python";
import type { ValidationCheck, ValidationOutcome, ValidationRun } from "@/features/validation/types";

import type { RecordingOutcome } from "./frames";

/**
 * Stages of loading the Python runtime, in order. `ready` means NumPy is loaded too.
 * `packages` is sent later, while an optional package (e.g. scikit-learn) downloads.
 */
export type LoadStage = "runtime" | "numpy" | "packages" | "ready";

/** Messages the page sends to the Python worker. */
export type WorkerRequest =
  | { kind: "load" }
  | { kind: "run"; id: number; code: string }
  | { kind: "record"; id: number; code: string; prelude: string }
  | {
      kind: "validate";
      id: number;
      code: string;
      runs: ValidationRun[];
      checks: ValidationCheck[];
    };

/** The finished result of one request, tagged with what was asked for. */
export type WorkerOutcome =
  | { kind: "run"; result: PythonRunResult }
  | { kind: "record"; recording: RecordingOutcome }
  | { kind: "validate"; validation: ValidationOutcome };

/** Messages the Python worker sends back to the page. */
export type WorkerMessage =
  | { kind: "status"; stage: LoadStage }
  | { kind: "load-failed" }
  | { kind: "result"; id: number; outcome: WorkerOutcome };
