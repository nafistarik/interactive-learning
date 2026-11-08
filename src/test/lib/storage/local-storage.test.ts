import { describe, expect, it } from "vitest";

import {
  readStoredValue,
  writeStoredValue,
  type KeyValueStorage,
} from "@/lib/storage/local-storage";

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

/** Storage whose every call throws, like a blocked or full `localStorage`. */
const brokenStorage: KeyValueStorage = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("quota");
  },
  removeItem: () => {
    throw new Error("blocked");
  },
};

describe("readStoredValue", () => {
  it("returns the stored value", () => {
    const storage = memoryStorage();
    storage.setItem("vlp:progress:v1", "{}");

    expect(readStoredValue(storage, "vlp:progress:v1")).toBe("{}");
  });

  it("returns null for a missing key", () => {
    expect(readStoredValue(memoryStorage(), "missing")).toBeNull();
  });

  it("returns null when storage is unavailable or throws", () => {
    expect(readStoredValue(undefined, "any")).toBeNull();
    expect(readStoredValue(brokenStorage, "any")).toBeNull();
  });
});

describe("writeStoredValue", () => {
  it("stores the value and reports success", () => {
    const storage = memoryStorage();

    expect(writeStoredValue(storage, "k", "v")).toBe(true);
    expect(storage.data.get("k")).toBe("v");
  });

  it("reports failure instead of throwing when storage is unavailable or full", () => {
    expect(writeStoredValue(undefined, "k", "v")).toBe(false);
    expect(writeStoredValue(brokenStorage, "k", "v")).toBe(false);
  });
});
