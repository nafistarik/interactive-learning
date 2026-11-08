import type { PythonRunResult } from "@/lib/python/run-python";

import type { RecordingOutcome } from "./frames";

/** Stages of loading the Python runtime, in order. `ready` means NumPy is loaded too. */
export type LoadStage = "runtime" | "numpy" | "ready";

/** Messages the page sends to the Python worker. */
export type WorkerRequest =
  | { kind: "load" }
  | { kind: "run"; id: number; code: string }
  | { kind: "record"; id: number; code: string; prelude: string };

/** The finished result of one request, tagged with what was asked for. */
export type WorkerOutcome =
  | { kind: "run"; result: PythonRunResult }
  | { kind: "record"; recording: RecordingOutcome };

/** Messages the Python worker sends back to the page. */
export type WorkerMessage =
  | { kind: "status"; stage: LoadStage }
  | { kind: "load-failed" }
  | { kind: "result"; id: number; outcome: WorkerOutcome };
