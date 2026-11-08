import type { PythonRunResult } from "@/lib/python/run-python";

import type { LoadStage, WorkerMessage, WorkerRequest } from "./protocol";

/** Longest a run may take before its worker is stopped (brief Part 6.3). */
export const RUN_TIMEOUT_MS = 10_000;

/** Output shown when a run is stopped for taking too long. */
export const STOPPED_MESSAGE = `Run stopped: it took longer than ${RUN_TIMEOUT_MS / 1000} seconds. The Python runtime restarts on the next run.`;

/** What the page shows about the runtime. */
export type RuntimeStatus =
  | { state: "idle" }
  | { state: "loading"; stage: Exclude<LoadStage, "ready"> }
  | { state: "ready" }
  | { state: "failed" };

/** The part of `Worker` the client uses, so tests can supply a fake. */
export interface WorkerLike {
  postMessage: (message: WorkerRequest) => void;
  terminate: () => void;
  onmessage: ((event: MessageEvent<WorkerMessage>) => void) | null;
}

/** A run waiting for its result, with the timer that stops it. */
interface PendingRun {
  resolve: (result: PythonRunResult) => void;
  timer: ReturnType<typeof setTimeout>;
}

/**
 * Talks to the Python worker. The worker is created on the first request, runs one request
 * at a time, and is terminated and replaced when a run exceeds {@link RUN_TIMEOUT_MS}, so a
 * runaway loop cannot freeze the page.
 */
export class PythonClient {
  private worker: WorkerLike | null = null;
  private nextId = 1;
  private readonly pending = new Map<number, PendingRun>();
  private readonly createWorker: () => WorkerLike;
  private readonly onStatus: (status: RuntimeStatus) => void;

  /**
   * @param createWorker - Creates a worker; the page passes the real one, tests a fake.
   * @param onStatus - Called whenever the runtime's loading state changes.
   */
  constructor(createWorker: () => WorkerLike, onStatus: (status: RuntimeStatus) => void) {
    this.createWorker = createWorker;
    this.onStatus = onStatus;
  }

  /** Starts loading the runtime in the background, so the first run does not wait for it. */
  warm(): void {
    this.ensureWorker().postMessage({ kind: "load" });
  }

  /**
   * Runs Python code in the worker. Resolves with the result, or with a stopped result if
   * the run passes {@link RUN_TIMEOUT_MS}; in that case the worker is replaced.
   *
   * @param code - The Python source to run.
   * @returns The run result.
   */
  run(code: string): Promise<PythonRunResult> {
    const worker = this.ensureWorker();
    const id = this.nextId++;

    return new Promise((resolve) => {
      const timer = setTimeout(() => this.stop(id), RUN_TIMEOUT_MS);
      this.pending.set(id, { resolve, timer });
      worker.postMessage({ kind: "run", id, code });
    });
  }

  /** Stops any run still waiting and terminates the worker. Call when the page unmounts. */
  dispose(): void {
    for (const id of [...this.pending.keys()]) {
      this.finish(id, { ok: false, stdout: "", error: "Run cancelled." });
    }
    this.terminateWorker();
    this.onStatus({ state: "idle" });
  }

  /**
   * Returns the live worker, creating it and wiring its messages if there is none.
   *
   * @returns The worker.
   */
  private ensureWorker(): WorkerLike {
    if (this.worker) {
      return this.worker;
    }

    const worker = this.createWorker();
    worker.onmessage = (event) => this.handle(event.data);
    this.worker = worker;
    return worker;
  }

  /**
   * Applies one message from the worker: loading status, a load failure, or a run result.
   *
   * @param message - The message the worker posted.
   */
  private handle(message: WorkerMessage): void {
    switch (message.kind) {
      case "status":
        this.onStatus(
          message.stage === "ready"
            ? { state: "ready" }
            : { state: "loading", stage: message.stage },
        );
        return;
      case "load-failed":
        this.onStatus({ state: "failed" });
        return;
      case "result":
        this.finish(message.id, message.result);
        return;
    }
  }

  /**
   * Resolves one pending run and clears its timer.
   *
   * @param id - The request id of the run.
   * @param result - What to resolve with.
   */
  private finish(id: number, result: PythonRunResult): void {
    const run = this.pending.get(id);
    if (!run) {
      return;
    }
    clearTimeout(run.timer);
    this.pending.delete(id);
    run.resolve(result);
  }

  /**
   * Stops a run that passed its time limit: resolves it with {@link STOPPED_MESSAGE},
   * terminates the worker, and marks the runtime idle so the next run loads a fresh one.
   *
   * @param id - The request id of the run that timed out.
   */
  private stop(id: number): void {
    this.finish(id, { ok: false, stdout: "", error: STOPPED_MESSAGE });
    this.terminateWorker();
    this.onStatus({ state: "idle" });
  }

  /** Terminates the current worker, if any, and forgets it. */
  private terminateWorker(): void {
    this.worker?.terminate();
    this.worker = null;
  }
}
