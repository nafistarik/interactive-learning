import { describe, expect, it } from "vitest";

import { emptyProgress, recordCheck } from "@/features/progress/model";
import {
  loadProgress,
  parseProgress,
  LEGACY_PROGRESS_KEY,
  PROGRESS_KEY,
  saveProgress,
} from "@/lib/storage/progress-storage";
import type { KeyValueStorage } from "@/lib/storage/local-storage";

/** In-memory storage used in place of `localStorage`. */
function memoryStorage(): KeyValueStorage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
}

describe("parseProgress", () => {
  it("starts fresh when nothing is stored", () => {
    expect(parseProgress(null)).toEqual(emptyProgress());
  });

  it("starts fresh on a parse error instead of crashing", () => {
    expect(parseProgress("{not json")).toEqual(emptyProgress());
  });

  it("starts fresh on an unknown version", () => {
    expect(parseProgress(JSON.stringify({ version: 3, exercises: {} }))).toEqual(emptyProgress());
  });

  it("keeps valid entries and drops malformed ones", () => {
    const raw = JSON.stringify({
      version: 1,
      currentLesson: "07",
      completedLessons: ["01", 5, "02"],
      passedChecks: ["01", null],
      exercises: {
        ex02: { passed: true, attempts: 2, hintUsed: false, stars: 3 },
        ex03: { passed: "yes" },
      },
    });

    const state = parseProgress(raw);

    // Version 1 ids are migrated to module/lesson keys of the Arrays module.
    expect(state.version).toBe(2);
    expect(state.currentLesson).toBe("arrays/07");
    expect(state.completedLessons).toEqual(["arrays/01", "arrays/02"]);
    expect(state.passedChecks).toEqual(["arrays/01"]);
    expect(Object.keys(state.exercises)).toEqual(["ex02"]);
  });
});

describe("saveProgress and loadProgress", () => {
  it("reads a version 1 value saved before passedChecks existed", () => {
    const raw = JSON.stringify({ version: 1, currentLesson: null, completedLessons: [], exercises: {} });

    expect(parseProgress(raw).passedChecks).toEqual([]);
  });

  it("keeps version 2 keys as they are", () => {
    const raw = JSON.stringify({ version: 2, currentLesson: "matmul/02", completedLessons: ["arrays/01"], passedChecks: [], exercises: {} });

    expect(parseProgress(raw)).toMatchObject({ currentLesson: "matmul/02", completedLessons: ["arrays/01"] });
  });

  it("migrates an MVP 1 value when no version 2 value exists, and leaves it in place", () => {
    const storage = memoryStorage();
    const v1 = JSON.stringify({
      version: 1,
      currentLesson: "06",
      completedLessons: ["01"],
      passedChecks: ["01", "06"],
      exercises: { ex02: { passed: true, attempts: 1, hintUsed: false, stars: 3 } },
    });
    storage.data.set(LEGACY_PROGRESS_KEY, v1);

    const state = loadProgress(storage);

    expect(state).toEqual({
      version: 2,
      currentLesson: "arrays/06",
      completedLessons: ["arrays/01"],
      passedChecks: ["arrays/01", "arrays/06"],
      exercises: { ex02: { passed: true, attempts: 1, hintUsed: false, stars: 3 } },
    });
    expect(storage.data.get(LEGACY_PROGRESS_KEY)).toBe(v1);
  });

  it("prefers the version 2 value over an old version 1 value", () => {
    const storage = memoryStorage();
    storage.data.set(LEGACY_PROGRESS_KEY, JSON.stringify({ version: 1, currentLesson: "01", completedLessons: [], exercises: {} }));
    storage.data.set(PROGRESS_KEY, JSON.stringify({ version: 2, currentLesson: "arrays/05", completedLessons: [], passedChecks: [], exercises: {} }));

    expect(loadProgress(storage).currentLesson).toBe("arrays/05");
  });

  it("round-trips a progress through storage under the versioned key", () => {
    const storage = memoryStorage();
    const state = recordCheck(emptyProgress(), "ex02", true);

    expect(saveProgress(storage, state)).toBe(true);
    expect(storage.data.has(PROGRESS_KEY)).toBe(true);
    expect(loadProgress(storage)).toEqual(state);
  });

  it("returns a fresh progress when storage is unavailable", () => {
    expect(loadProgress(undefined)).toEqual(emptyProgress());
    expect(saveProgress(undefined, emptyProgress())).toBe(false);
  });
});
