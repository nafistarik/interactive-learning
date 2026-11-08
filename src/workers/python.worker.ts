import type { PyodideInterface } from "pyodide";

import type { WorkerMessage, WorkerOutcome, WorkerRequest } from "@/features/execution/protocol";
import { PYODIDE_INDEX_URL } from "@/lib/python/pyodide-version";
import { installRecorder, recordFrames } from "@/lib/python/record-frames";
import { runPython } from "@/lib/python/run-python";

/** Shape of Pyodide's ES module entry point, as loaded from the CDN. */
interface PyodideModule {
  loadPyodide: (options: { indexURL: string }) => Promise<PyodideInterface>;
}

/** Message used when the runtime cannot load. The page shows its own retry text. */
const LOAD_FAILED_TEXT = "The Python runtime failed to load. Try again.";

/** One Pyodide instance per worker, loaded on the first request. */
let pyodidePromise: Promise<PyodideInterface> | undefined;

/**
 * Posts a loading stage to the page.
 *
 * @param stage - The stage that has just started or finished.
 */
function postStatus(stage: "runtime" | "numpy" | "ready"): void {
  postMessage({ kind: "status", stage } satisfies WorkerMessage);
}

/**
 * Loads Pyodide and NumPy once, installs the frame recorder, and reuses them. Each stage is
 * posted to the page for progress. A failed load clears the cache so the next request tries
 * again.
 *
 * @returns The ready Pyodide instance.
 */
function getPyodide(): Promise<PyodideInterface> {
  pyodidePromise ??= (async () => {
    postStatus("runtime");
    const pyodideModule: PyodideModule = await import(
      /* turbopackIgnore: true */ `${PYODIDE_INDEX_URL}pyodide.mjs`
    );
    const pyodide = await pyodideModule.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
    postStatus("numpy");
    await pyodide.loadPackage("numpy");
    installRecorder(pyodide);
    postStatus("ready");
    return pyodide;
  })().catch((error: unknown) => {
    pyodidePromise = undefined;
    throw error;
  });
  return pyodidePromise;
}

/**
 * Handles one page request and posts its outcome. A load failure posts `load-failed` and a
 * failed outcome of the same kind as the request.
 *
 * @param request - The request from the page.
 */
async function handle(request: WorkerRequest): Promise<void> {
  if (request.kind === "load") {
    await getPyodide().then(
      () => undefined,
      () => postMessage({ kind: "load-failed" } satisfies WorkerMessage),
    );
    return;
  }

  let outcome: WorkerOutcome;
  try {
    const pyodide = await getPyodide();
    outcome =
      request.kind === "run"
        ? { kind: "run", result: await runPython(pyodide, request.code) }
        : { kind: "record", recording: recordFrames(pyodide, request.code, request.prelude) };
  } catch {
    postMessage({ kind: "load-failed" } satisfies WorkerMessage);
    outcome =
      request.kind === "run"
        ? { kind: "run", result: { ok: false, stdout: "", error: LOAD_FAILED_TEXT } }
        : { kind: "record", recording: { ok: false, frames: [], error: LOAD_FAILED_TEXT } };
  }
  postMessage({ kind: "result", id: request.id, outcome } satisfies WorkerMessage);
}

/** Runs each request from the page and posts back its outcome. */
addEventListener("message", (event) => {
  const request: WorkerRequest = event.data;
  void handle(request);
});
