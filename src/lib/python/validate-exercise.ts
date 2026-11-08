import type { PyodideInterface } from "pyodide";

import type { ValidationCheck, ValidationOutcome, ValidationRun } from "@/features/validation/types";

/**
 * Checks the learner's code against an exercise in a loaded Pyodide. Call only after the
 * validator is installed (see `installRecorder`).
 *
 * @param pyodide - A Pyodide instance with NumPy and the validator loaded.
 * @param code - The learner's code.
 * @param runs - The setups to run the code with, each with its reference.
 * @param checks - What to compare after each run.
 * @returns The verdict, with the problems found.
 */
export function validateExercise(
  pyodide: PyodideInterface,
  code: string,
  runs: ValidationRun[],
  checks: ValidationCheck[],
): ValidationOutcome {
  pyodide.globals.set("__code__", code);
  pyodide.globals.set("__runs__", JSON.stringify(runs));
  pyodide.globals.set("__checks__", JSON.stringify(checks));
  try {
    const json: string = pyodide.runPython("validate_exercise(__code__, __runs__, __checks__)");
    const outcome: ValidationOutcome = JSON.parse(json);
    return outcome;
  } catch (error) {
    return {
      passed: false,
      problems: [error instanceof Error ? error.message : String(error)],
    };
  } finally {
    pyodide.globals.delete("__code__");
    pyodide.globals.delete("__runs__");
    pyodide.globals.delete("__checks__");
  }
}
