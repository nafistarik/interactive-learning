import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PythonRunResult } from "@/lib/python/run-python";
import type { WorkerMessage, WorkerRequest } from "@/features/execution/protocol";
import {
  PythonClient,
  RUN_TIMEOUT_MS,
  STOPPED_MESSAGE,
  type RuntimeStatus,
  type WorkerLike,
} from "@/features/execution/python-client";

/**
 * Fake worker. `reply` decides what the worker sends back for each request; a `null` reply
 * means the worker never answers (a runaway run).
 */
class FakeWorker implements WorkerLike {
  onmessage: ((event: MessageEvent<WorkerMessage>) => void) | null = null;
  requests: WorkerRequest[] = [];
  terminated = false;

  constructor(private readonly reply: (request: WorkerRequest) => WorkerMessage[] | null) {}

  postMessage(request: WorkerRequest): void {
    this.requests.push(request);
    const messages = this.reply(request);
    for (const message of messages ?? []) {
      this.onmessage?.(new MessageEvent<WorkerMessage>("message", { data: message }));
    }
  }

  terminate(): void {
    this.terminated = true;
  }
}

const OK_RESULT: PythonRunResult = { ok: true, stdout: "[2 4]" };

/** A worker that loads the runtime in three stages and then runs code successfully. */
function healthyWorker(): FakeWorker {
  return new FakeWorker((request) => {
    if (request.kind === "load") {
      return [
        { kind: "status", stage: "runtime" },
        { kind: "status", stage: "numpy" },
        { kind: "status", stage: "ready" },
      ];
    }
    return [{ kind: "result", id: request.id, outcome: { kind: "run", result: OK_RESULT } }];
  });
}

describe("PythonClient", () => {
  let statuses: RuntimeStatus[];

  beforeEach(() => {
    vi.useFakeTimers();
    statuses = [];
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("reports loading stages in order when warmed", () => {
    const client = new PythonClient(() => healthyWorker(), (status) => statuses.push(status));

    client.warm();

    expect(statuses).toEqual([
      { state: "loading", stage: "runtime" },
      { state: "loading", stage: "numpy" },
      { state: "ready" },
    ]);
  });

  it("resolves a run with the worker's result", async () => {
    const client = new PythonClient(() => healthyWorker(), () => undefined);

    await expect(client.run("print(1)")).resolves.toEqual(OK_RESULT);
  });

  it("reports a failed load and resolves the run with the failure", async () => {
    const worker = new FakeWorker((request) => {
      if (request.kind === "load") {
        return [{ kind: "load-failed" }];
      }
      return [
        { kind: "load-failed" },
        {
          kind: "result",
          id: request.id,
          outcome: {
            kind: "run",
            result: { ok: false, stdout: "", error: "The Python runtime failed to load. Try again." },
          },
        },
      ];
    });
    const client = new PythonClient(() => worker, (status) => statuses.push(status));

    client.warm();
    const result = await client.run("print(1)");

    expect(statuses.at(-1)).toEqual({ state: "failed" });
    expect(result.ok).toBe(false);
  });

  it("stops a run that exceeds the time limit, terminates its worker and starts a fresh one", async () => {
    const hung = new FakeWorker(() => null);
    const fresh = healthyWorker();
    const workers = [hung, fresh];
    const client = new PythonClient(() => {
      const next = workers.shift();
      if (!next) {
        throw new Error("no worker left");
      }
      return next;
    }, (status) => statuses.push(status));

    const pending = client.run("while True: pass");
    await vi.advanceTimersByTimeAsync(RUN_TIMEOUT_MS);

    await expect(pending).resolves.toEqual({ ok: false, stdout: "", error: STOPPED_MESSAGE });
    expect(hung.terminated).toBe(true);
    expect(statuses.at(-1)).toEqual({ state: "idle" });

    await expect(client.run("print(1)")).resolves.toEqual(OK_RESULT);
    expect(fresh.requests.map((request) => request.kind)).toEqual(["run"]);
  });

  it("stops a recording that exceeds the time limit with a failed recording", async () => {
    const client = new PythonClient(() => new FakeWorker(() => null), () => undefined);

    const pending = client.record("while True: pass");
    await vi.advanceTimersByTimeAsync(RUN_TIMEOUT_MS);

    await expect(pending).resolves.toEqual({ ok: false, frames: [], error: STOPPED_MESSAGE });
  });

  it("does not stop a run that finishes inside the time limit", async () => {
    const worker = healthyWorker();
    const client = new PythonClient(() => worker, () => undefined);

    const pending = client.run("print(1)");
    await vi.advanceTimersByTimeAsync(RUN_TIMEOUT_MS - 1);

    await expect(pending).resolves.toEqual(OK_RESULT);
    expect(worker.terminated).toBe(false);
  });

  it("cancels a waiting run and terminates the worker on dispose", async () => {
    const worker = new FakeWorker(() => null);
    const client = new PythonClient(() => worker, (status) => statuses.push(status));

    const pending = client.run("while True: pass");
    client.dispose();

    await expect(pending).resolves.toEqual({ ok: false, stdout: "", error: "Run cancelled." });
    expect(worker.terminated).toBe(true);
    expect(statuses.at(-1)).toEqual({ state: "idle" });
  });
});
