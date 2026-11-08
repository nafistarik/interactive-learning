import type { PyodideInterface } from "pyodide";

import { PYODIDE_INDEX_URL } from "@/lib/python/pyodide-version";
import { runPython, type PythonRunResult } from "@/lib/python/run-python";

/** Message the page posts to the worker to run one piece of code. */
export interface PythonWorkerRequest {
  id: number;
  code: string;
}

/** Reply to one request: the run result tagged with the request id. */
export type PythonWorkerResponse = { id: number } & PythonRunResult;

/** Shape of Pyodide's ES module entry point, as loaded from the CDN. */
interface PyodideModule {
  loadPyodide: (options: { indexURL: string }) => Promise<PyodideInterface>;
}

/** One Pyodide instance per worker, loaded on the first request. */
let pyodidePromise: Promise<PyodideInterface> | undefined;

/**
 * Loads Pyodide and NumPy once and reuses them. A failed load clears the cache so the next
 * request tries again.
 *
 * @returns The ready Pyodide instance.
 */
function getPyodide(): Promise<PyodideInterface> {
  pyodidePromise ??= (async () => {
    const pyodideModule: PyodideModule = await import(
      /* turbopackIgnore: true */ `${PYODIDE_INDEX_URL}pyodide.mjs`
    );
    const pyodide = await pyodideModule.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
    await pyodide.loadPackage("numpy");
    return pyodide;
  })().catch((error: unknown) => {
    pyodidePromise = undefined;
    throw error;
  });
  return pyodidePromise;
}

/** Runs each request in turn and posts back its result. The page only sends requests. */
addEventListener("message", (event) => {
  const request: PythonWorkerRequest = event.data;

  getPyodide()
    .then((pyodide) => runPython(pyodide, request.code))
    .catch((): PythonRunResult => ({
      ok: false,
      stdout: "",
      error: "The Python runtime failed to load. Try again.",
    }))
    .then((result) => postMessage({ id: request.id, ...result }));
});
