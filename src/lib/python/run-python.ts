import type { PyodideInterface } from "pyodide";

/** Outcome of one Python run. `stdout` holds every line the code printed before it stopped. */
export type PythonRunResult =
  | { ok: true; stdout: string }
  | { ok: false; stdout: string; error: string };

/**
 * Runs Python source in an already-loaded Pyodide and reports its printed output or the
 * error it stopped with. Python errors are returned, not thrown, so the caller can show
 * them on the screen.
 *
 * @param pyodide - A Pyodide instance with NumPy loaded.
 * @param code - The Python source to run.
 * @returns The run result: `ok`, the captured `stdout`, and `error` when it failed.
 */
export async function runPython(pyodide: PyodideInterface, code: string): Promise<PythonRunResult> {
  const lines: string[] = [];
  pyodide.setStdout({ batched: (line) => lines.push(line) });

  try {
    await pyodide.runPythonAsync(code);
    return { ok: true, stdout: lines.join("\n") };
  } catch (error) {
    return {
      ok: false,
      stdout: lines.join("\n"),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
