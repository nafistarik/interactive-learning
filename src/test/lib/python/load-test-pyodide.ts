import { join } from "node:path";

import { loadPyodide, type PyodideInterface } from "pyodide";

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
