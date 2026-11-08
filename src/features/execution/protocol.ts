import type { PythonRunResult } from "@/lib/python/run-python";

/** Stages of loading the Python runtime, in order. `ready` means NumPy is loaded too. */
export type LoadStage = "runtime" | "numpy" | "ready";

/** Messages the page sends to the Python worker. */
export type WorkerRequest = { kind: "load" } | { kind: "run"; id: number; code: string };

/** Messages the Python worker sends back to the page. */
export type WorkerMessage =
  | { kind: "status"; stage: LoadStage }
  | { kind: "load-failed" }
  | { kind: "result"; id: number; result: PythonRunResult };
