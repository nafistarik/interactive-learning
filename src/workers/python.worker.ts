import type { PyodideInterface } from "pyodide";

import type { LoadStage, WorkerMessage, WorkerOutcome, WorkerRequest } from "@/features/execution/protocol";
import { PYODIDE_INDEX_URL } from "@/lib/python/pyodide-version";
import { loadPackages, missingPackages } from "@/lib/python/packages";
import { installRecorder, recordFrames } from "@/lib/python/record-frames";
import { runPython } from "@/lib/python/run-python";
import { validateExercise } from "@/lib/python/validate-exercise";

/** Shape of Pyodide's ES module entry point, as loaded from the CDN. */
interface PyodideModule {
  loadPyodide: (options: { indexURL: string }) => Promise<PyodideInterface>;
}

/** Message used when the runtime cannot load. The page shows its own retry text. */
const LOAD_FAILED_TEXT = "The Python runtime failed to load. Try again.";

/** Requests that need the Python runtime (everything except `load`). */
type RuntimeRequest = Exclude<WorkerRequest, { kind: "load" }>;

/** One Pyodide instance per worker, loaded on the first request. */
let pyodidePromise: Promise<PyodideInterface> | undefined;

/**
 * Posts a loading stage to the page.
 *
 * @param stage - The stage that has just started or finished.
 */
function postStatus(stage: LoadStage): void {
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

/** Optional packages (e.g. scikit-learn) already loaded in this worker, by import name. */
const loadedPackages = new Set<string>();

/**
 * All Python a request will run, so its imports can be found before it runs.
 *
 * @param request - The request.
 * @returns The sources joined.
 */
function sourcesOf(request: RuntimeRequest): string {
  switch (request.kind) {
    case "run":
      return request.code;
    case "record":
      return `${request.prelude}\n${request.code}`;
    case "validate":
      return [request.code, ...request.runs.flatMap((run) => [run.prelude, run.reference])].join("\n");
  }
}

/**
 * Loads optional packages the request imports. While they download the page shows a loading
 * status, and the client pauses the run limit (it restarts on "ready").
 *
 * @param pyodide - The loaded Pyodide instance.
 * @param request - The request about to run.
 */
async function ensurePackages(pyodide: PyodideInterface, request: RuntimeRequest): Promise<void> {
  const missing = missingPackages(pyodide, sourcesOf(request), loadedPackages);
  if (missing.length === 0) {
    return;
  }
  postStatus("packages");
  await loadPackages(pyodide, missing, loadedPackages);
  postStatus("ready");
}

/**
 * Runs one request that needs the loaded runtime and returns its outcome.
 *
 * @param pyodide - The loaded Pyodide instance.
 * @param request - The request to run.
 * @returns The outcome of the request.
 */
async function runRequest(pyodide: PyodideInterface, request: RuntimeRequest): Promise<WorkerOutcome> {
  await ensurePackages(pyodide, request);
  switch (request.kind) {
    case "run":
      return { kind: "run", result: await runPython(pyodide, request.code) };
    case "record":
      return { kind: "record", recording: recordFrames(pyodide, request.code, request.prelude) };
    case "validate":
      return {
        kind: "validate",
        validation: validateExercise(pyodide, request.code, request.runs, request.checks),
      };
  }
}

/**
 * The outcome reported when the runtime cannot load, of the same kind as the request.
 *
 * @param request - The request that could not run.
 * @returns A failed outcome carrying the load-failed message.
 */
function failedOutcome(request: RuntimeRequest): WorkerOutcome {
  switch (request.kind) {
    case "run":
      return { kind: "run", result: { ok: false, stdout: "", error: LOAD_FAILED_TEXT } };
    case "record":
      return { kind: "record", recording: { ok: false, frames: [], error: LOAD_FAILED_TEXT } };
    case "validate":
      return { kind: "validate", validation: { passed: false, problems: [LOAD_FAILED_TEXT] } };
  }
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
    outcome = await runRequest(pyodide, request);
  } catch {
    postMessage({ kind: "load-failed" } satisfies WorkerMessage);
    outcome = failedOutcome(request);
  }
  postMessage({ kind: "result", id: request.id, outcome } satisfies WorkerMessage);
}

/** Runs each request from the page and posts back its outcome. */
addEventListener("message", (event) => {
  const request: WorkerRequest = event.data;
  void handle(request);
});
