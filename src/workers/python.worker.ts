import type { PyodideInterface } from "pyodide";

import { PYODIDE_INDEX_URL } from "@/lib/python/pyodide-version";
import { runPython, type PythonRunResult } from "@/lib/python/run-python";
import type { WorkerMessage, WorkerRequest } from "@/features/execution/protocol";

/** Shape of Pyodide's ES module entry point, as loaded from the CDN. */
interface PyodideModule {
  loadPyodide: (options: { indexURL: string }) => Promise<PyodideInterface>;
}

/** Result sent when the runtime cannot load. The page shows its own retry text. */
const LOAD_FAILED_RESULT: PythonRunResult = {
  ok: false,
  stdout: "",
  error: "The Python runtime failed to load. Try again.",
};

/** One Pyodide instance per worker, loaded on the first request. */
let pyodidePromise: Promise<PyodideInterface> | undefined;

/**
 * Loads Pyodide and NumPy once and reuses them, posting each stage to the page so it can
 * show progress. A failed load clears the cache so the next request tries again.
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
    postStatus("ready");
    return pyodide;
  })().catch((error: unknown) => {
    pyodidePromise = undefined;
    throw error;
  });
  return pyodidePromise;
}

/**
 * Sends one message to the page.
 *
 * @param message - The message to post.
 */
function send(message: WorkerMessage): void {
  postMessage(message);
}

/**
 * Posts a loading stage to the page.
 *
 * @param stage - The stage that has just started or finished.
 */
function postStatus(stage: "runtime" | "numpy" | "ready"): void {
  send({ kind: "status", stage });
}

/**
 * Handles requests from the page: `load` warms the runtime, `run` executes code after the
 * runtime is ready. A load failure is reported with `load-failed`, and a pending run gets a
 * failed result.
 */
addEventListener("message", (event) => {
  const request: WorkerRequest = event.data;

  if (request.kind === "load") {
    getPyodide().then(
      () => undefined,
      () => send({ kind: "load-failed" }),
    );
    return;
  }

  getPyodide()
    .then((pyodide) => runPython(pyodide, request.code))
    .catch(() => {
      send({ kind: "load-failed" });
      return LOAD_FAILED_RESULT;
    })
    .then((result) => send({ kind: "result", id: request.id, result }));
});
