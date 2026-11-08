import { readStoredValue, writeStoredValue, type KeyValueStorage } from "./local-storage";
import { emptyProgress, type ExerciseProgress, type ProgressState } from "@/features/progress/model";

/** The one storage key of the progress, with its version in the name (brief Part 11). */
export const PROGRESS_KEY = "vlp:progress:v1";

/**
 * Turns the stored text into a progress state. Anything that is not a valid version 1 state
 * (missing, corrupt, or another version) becomes a fresh progress, so the page never crashes.
 *
 * @param raw - The stored text, or `null`.
 * @returns A valid progress state.
 */
export function parseProgress(raw: string | null): ProgressState {
  if (raw === null) {
    return emptyProgress();
  }
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return emptyProgress();
  }
  if (!isRecord(data) || data.version !== 1) {
    return emptyProgress();
  }
  const completedLessons = Array.isArray(data.completedLessons)
    ? data.completedLessons.filter((id): id is string => typeof id === "string")
    : [];
  const exercises: Record<string, ExerciseProgress> = {};
  if (isRecord(data.exercises)) {
    for (const [id, value] of Object.entries(data.exercises)) {
      if (isExerciseProgress(value)) {
        exercises[id] = value;
      }
    }
  }
  return {
    version: 1,
    currentLesson: typeof data.currentLesson === "string" ? data.currentLesson : null,
    completedLessons,
    exercises,
  };
}

/**
 * Reads the saved progress from storage.
 *
 * @param storage - The storage to read, or `undefined` when there is none.
 * @returns The saved progress, or a fresh one.
 */
export function loadProgress(storage: KeyValueStorage | undefined): ProgressState {
  return parseProgress(readStoredValue(storage, PROGRESS_KEY));
}

/**
 * Saves the progress. Returns `false` if storage refused the write.
 *
 * @param storage - The storage to write to.
 * @param state - The progress to save.
 * @returns `true` when saved.
 */
export function saveProgress(storage: KeyValueStorage | undefined, state: ProgressState): boolean {
  return writeStoredValue(storage, PROGRESS_KEY, JSON.stringify(state));
}

/**
 * Narrows an unknown value to a plain object.
 *
 * @param value - Any value.
 * @returns `true` for a non-null object that is not an array.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Checks that a stored exercise entry has the expected fields.
 *
 * @param value - The stored entry.
 * @returns `true` when it is a valid exercise progress.
 */
function isExerciseProgress(value: unknown): value is ExerciseProgress {
  return (
    isRecord(value) &&
    typeof value.passed === "boolean" &&
    typeof value.attempts === "number" &&
    typeof value.hintUsed === "boolean" &&
    (value.stars === 0 || value.stars === 1 || value.stars === 2 || value.stars === 3)
  );
}
