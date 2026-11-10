import type { PythonRunResult } from "@/lib/python/run-python";

import type { ValidationCheck, ValidationOutcome, ValidationRun } from "@/features/validation/types";

import type { RecordingOutcome } from "./frames";
import type { LoadStage, WorkerMessage, WorkerOutcome, WorkerRequest } from "./protocol";

/** Longest a request may take before its worker is stopped (brief Part 6.3). */
export const RUN_TIMEOUT_MS = 10_000;

/**
 * Longest the runtime may take to load (Pyodide + NumPy, several MB from the CDN) before the
 * load counts as failed and Retry is offered. Separate from the run limit, so a slow network
 * never makes the first run look like a runaway loop.
 */
export const LOAD_TIMEOUT_MS = 120_000;

/** Output shown when the runtime cannot load. */
export const LOAD_FAILED_MESSAGE = "The Python runtime failed to load. Try again.";

/** Output shown when a request is stopped for taking too long. */
export const STOPPED_MESSAGE = `Run stopped: it took longer than ${RUN_TIMEOUT_MS / 1000} seconds. The Python runtime restarts on the next run.`;

/** Output shown when a waiting request is cancelled by unmounting. */
const CANCELLED_MESSAGE = "Run cancelled.";

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

/** A request waiting for its outcome. */
interface PendingRequest {
  kind: RequestKind;
  resolve: (outcome: WorkerOutcome) => void;
  /** The run time limit; `null` while the runtime is still loading. */
  timer: ReturnType<typeof setTimeout> | null;
}

/** Kinds of request the client sends to the worker. */
type RequestKind = "run" | "record" | "validate";

/** The body of a request, without its id. */
type RequestBody =
  | { kind: "run"; code: string }
  | { kind: "record"; code: string; prelude: string }
  | { kind: "validate"; code: string; runs: ValidationRun[]; checks: ValidationCheck[] };

/**
 * A failed outcome of the given kind with the given message. Used for timeouts and
 * cancellation, so the caller always gets the shape it asked for.
 *
 * @param kind - Which request the outcome answers.
 * @param error - The message to show.
 * @returns The failed outcome.
 */
function failedOutcome(kind: RequestKind, error: string): WorkerOutcome {
  switch (kind) {
    case "run":
      return { kind, result: { ok: false, stdout: "", error } };
    case "record":
      return { kind, recording: { ok: false, frames: [], error } };
    case "validate":
      return { kind, validation: { passed: false, problems: [error] } };
  }
}

/**
 * Talks to the Python worker. The worker is created on the first request and handles one
 * request at a time. A request that runs longer than {@link RUN_TIMEOUT_MS} is stopped: its
 * worker is terminated and replaced, so a runaway loop cannot freeze the page. The run limit
 * starts only once the runtime is ready; loading has its own {@link LOAD_TIMEOUT_MS}. A failed
 * load drops its worker, so the next request (Retry) starts a fresh one.
 */
export class PythonClient {
  private worker: WorkerLike | null = null;
  private ready = false;
  private loadTimer: ReturnType<typeof setTimeout> | null = null;
  private nextId = 1;
  private readonly pending = new Map<number, PendingRequest>();
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

  /** Starts loading the runtime in the background, so the first request does not wait. */
  warm(): void {
    this.ensureWorker().postMessage({ kind: "load" });
  }

  /**
   * Runs Python code and returns what it printed or the error it stopped with.
   *
   * @param code - The Python source to run.
   * @returns The run result, or a stopped result when the time limit passed.
   */
  async run(code: string): Promise<PythonRunResult> {
    const outcome = await this.request("run", { kind: "run", code });
    return outcome.kind === "run"
      ? outcome.result
      : { ok: false, stdout: "", error: "Unexpected reply from the Python worker." };
  }

  /**
   * Records one frame per top-level statement of the code (brief Part 7).
   *
   * @param code - The editor code.
   * @param prelude - Fixed setup code run first, with no frames.
   * @returns The recording, or a failed recording when it was stopped.
   */
  async record(code: string, prelude = ""): Promise<RecordingOutcome> {
    const outcome = await this.request("record", { kind: "record", code, prelude });
    return outcome.kind === "record"
      ? outcome.recording
      : { ok: false, frames: [], error: "Unexpected reply from the Python worker." };
  }

  /**
   * Checks the learner's code against an exercise (brief Part 10).
   *
   * @param code - The learner's code.
   * @param runs - The setups to run the code with.
   * @param checks - What to compare after each run.
   * @returns The verdict, or a failed verdict when the check was stopped.
   */
  async validate(
    code: string,
    runs: ValidationRun[],
    checks: ValidationCheck[],
  ): Promise<ValidationOutcome> {
    const outcome = await this.request("validate", { kind: "validate", code, runs, checks });
    return outcome.kind === "validate"
      ? outcome.validation
      : { passed: false, problems: ["Unexpected reply from the Python worker."] };
  }

  /** Cancels waiting requests and terminates the worker. Call when the page unmounts. */
  dispose(): void {
    for (const id of [...this.pending.keys()]) {
      this.finish(id, failedOutcome(this.pending.get(id)?.kind ?? "run", CANCELLED_MESSAGE));
    }
    this.terminateWorker();
    this.onStatus({ state: "idle" });
  }

  /**
   * Sends one request and waits for its outcome or its time limit.
   *
   * @param kind - Which request this is.
   * @param body - The request without its id.
   * @returns The outcome of the request.
   */
  private request(kind: RequestKind, body: RequestBody): Promise<WorkerOutcome> {
    const worker = this.ensureWorker();
    const id = this.nextId++;

    return new Promise((resolve) => {
      const timer = this.ready ? setTimeout(() => this.stop(id), RUN_TIMEOUT_MS) : null;
      this.pending.set(id, { kind, resolve, timer });
      worker.postMessage({ ...body, id });
    });
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
    this.ready = false;
    this.loadTimer = setTimeout(() => this.failLoad(), LOAD_TIMEOUT_MS);
    return worker;
  }

  /**
   * Applies one message from the worker: loading status, a load failure, or an outcome.
   *
   * @param message - The message the worker posted.
   */
  private handle(message: WorkerMessage): void {
    switch (message.kind) {
      case "status":
        if (message.stage === "ready") {
          this.markReady();
        }
        this.onStatus(
          message.stage === "ready"
            ? { state: "ready" }
            : { state: "loading", stage: message.stage },
        );
        return;
      case "load-failed":
        this.failLoad();
        return;
      case "result":
        this.finish(message.id, message.outcome);
        return;
    }
  }

  /**
   * Resolves one waiting request and clears its timer.
   *
   * @param id - The request id.
   * @param outcome - What to resolve with.
   */
  private finish(id: number, outcome: WorkerOutcome): void {
    const request = this.pending.get(id);
    if (!request) {
      return;
    }
    if (request.timer) {
      clearTimeout(request.timer);
    }
    this.pending.delete(id);
    request.resolve(outcome);
  }

  /**
   * Stops a request that passed its time limit: resolves it with the stopped message,
   * terminates the worker, and marks the runtime idle so the next request loads a fresh one.
   *
   * @param id - The request id that timed out.
   */
  private stop(id: number): void {
    const request = this.pending.get(id);
    if (request) {
      this.finish(id, failedOutcome(request.kind, STOPPED_MESSAGE));
    }
    this.terminateWorker();
    this.onStatus({ state: "idle" });
  }

  /** The runtime is loaded: stop the load limit and start the run limit of waiting requests. */
  private markReady(): void {
    this.ready = true;
    this.clearLoadTimer();
    for (const [id, request] of this.pending) {
      request.timer ??= setTimeout(() => this.stop(id), RUN_TIMEOUT_MS);
    }
  }

  /**
   * The runtime could not load (an error, or {@link LOAD_TIMEOUT_MS} passed): resolves waiting
   * requests with the failure, drops the worker so Retry gets a fresh one, and reports failed.
   */
  private failLoad(): void {
    for (const id of [...this.pending.keys()]) {
      this.finish(id, failedOutcome(this.pending.get(id)?.kind ?? "run", LOAD_FAILED_MESSAGE));
    }
    this.terminateWorker();
    this.onStatus({ state: "failed" });
  }

  private clearLoadTimer(): void {
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  }

  /** Terminates the current worker, if any, and forgets it. */
  private terminateWorker(): void {
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
    this.clearLoadTimer();
  }
}
