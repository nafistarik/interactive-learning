import type { PyodideInterface } from "pyodide";

import type { ExecutionFrame, RecordingOutcome } from "@/features/execution/frames";

import { RECORDER_SOURCE } from "./recorder-source";
import { VALIDATOR_SOURCE } from "./validator-source";

/** What the Python `record_frames` function returns, parsed from JSON. */
interface RecorderOutput {
  frames: ExecutionFrame[];
  fatal: string | null;
}

/**
 * Defines the frame recorder and the exercise validator in a loaded Pyodide. Call once per
 * instance.
 *
 * @param pyodide - A Pyodide instance with NumPy loaded.
 */
export function installRecorder(pyodide: PyodideInterface): void {
  pyodide.runPython(RECORDER_SOURCE);
  pyodide.runPython(VALIDATOR_SOURCE);
}

/**
 * Runs the code once and returns one frame per top-level statement. Editing and stepping
 * never call this again; the page keeps the frames.
 *
 * @param pyodide - A Pyodide instance with the recorder installed.
 * @param code - The editor code to record.
 * @param prelude - Fixed setup code run first in the same namespace, with no frames.
 * @returns The recording, or `ok: false` when the setup failed or the recorder itself failed.
 */
export function recordFrames(
  pyodide: PyodideInterface,
  code: string,
  prelude = "",
): RecordingOutcome {
  pyodide.globals.set("__code__", code);
  pyodide.globals.set("__prelude__", prelude);
  try {
    const json: string = pyodide.runPython("record_frames(__code__, __prelude__)");
    const output: RecorderOutput = JSON.parse(json);
    if (output.fatal !== null) {
      return { ok: false, frames: [], error: output.fatal };
    }
    return { ok: true, frames: output.frames };
  } catch (error) {
    return {
      ok: false,
      frames: [],
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    pyodide.globals.delete("__code__");
    pyodide.globals.delete("__prelude__");
  }
}
