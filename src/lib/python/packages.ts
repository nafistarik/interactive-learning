import type { PyodideInterface } from "pyodide";

/** Optional packages a lesson may import, by import name → Pyodide package name. */
export const OPTIONAL_PACKAGES: Record<string, string> = {
  sklearn: "scikit-learn",
  scipy: "scipy",
  pandas: "pandas",
};

/**
 * The optional packages this code imports that are not loaded yet.
 *
 * @param pyodide - A loaded Pyodide.
 * @param code - Python sources (editor code, preludes, references), joined.
 * @param loaded - Import names already loaded in this runtime.
 * @returns Import names to load.
 */
export function missingPackages(pyodide: PyodideInterface, code: string, loaded: Set<string>): string[] {
  let imports: string[] = [];
  try {
    const found = pyodide.pyodide_py.code.find_imports(code);
    imports = found.toJs();
    found.destroy();
  } catch {
    // Code that does not parse imports nothing; the recorder reports the syntax error.
    return [];
  }
  return [...new Set(imports.map((name) => name.split(".")[0]))].filter(
    (name) => name in OPTIONAL_PACKAGES && !loaded.has(name),
  );
}

/**
 * Loads the optional packages the code imports (e.g. scikit-learn for lesson 1.4.04).
 *
 * @param pyodide - A loaded Pyodide.
 * @param names - Import names from {@link missingPackages}.
 * @param loaded - Updated with the names once loaded.
 */
export async function loadPackages(pyodide: PyodideInterface, names: string[], loaded: Set<string>): Promise<void> {
  await pyodide.loadPackage(names.map((name) => OPTIONAL_PACKAGES[name]));
  for (const name of names) {
    loaded.add(name);
  }
}
