import { describe, expect, it } from "vitest";

import { emptyProgress, recordCheck } from "@/features/progress/model";
import {
  loadProgress,
  parseProgress,
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
    expect(parseProgress(JSON.stringify({ version: 2, exercises: {} }))).toEqual(emptyProgress());
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

    expect(state.currentLesson).toBe("07");
    expect(state.completedLessons).toEqual(["01", "02"]);
    expect(state.passedChecks).toEqual(["01"]);
    expect(Object.keys(state.exercises)).toEqual(["ex02"]);
  });
});

describe("saveProgress and loadProgress", () => {
  it("reads a version 1 value saved before passedChecks existed", () => {
    const raw = JSON.stringify({ version: 1, currentLesson: null, completedLessons: [], exercises: {} });

    expect(parseProgress(raw).passedChecks).toEqual([]);
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
