import { join } from "node:path";

import { loadPyodide, type PyodideInterface } from "pyodide";

import { loadPackages, missingPackages } from "@/lib/python/packages";
import { PYODIDE_INDEX_URL } from "@/lib/python/pyodide-version";

/**
 * Loads Pyodide with NumPy for Node tests. The runtime files come from the installed
 * `pyodide` package, which is the same pinned version the browser loads from the CDN.
 * NumPy comes from the CDN and is cached under `node_modules`.
 *
 * @returns A Pyodide instance with NumPy loaded.
 */
export async function loadTestPyodide(): Promise<PyodideInterface> {
  const pyodide = await loadPyodide({
    indexURL: join(process.cwd(), "node_modules", "pyodide") + "/",
    packageBaseUrl: PYODIDE_INDEX_URL,
    packageCacheDir: join(process.cwd(), "node_modules", ".cache", "pyodide"),
  });
  await pyodide.loadPackage("numpy");
  return pyodide;
}

/** Optional packages loaded so far in the test runtime. */
const loaded = new Set<string>();

/**
 * Loads optional packages (e.g. scikit-learn) the code imports, as the worker does.
 *
 * @param pyodide - The test Pyodide.
 * @param code - The Python about to run.
 */
export async function preparePackages(pyodide: PyodideInterface, code: string): Promise<void> {
  await loadPackages(pyodide, missingPackages(pyodide, code, loaded), loaded);
}
