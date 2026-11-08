/** The part of the Web Storage API this app uses. */
export interface KeyValueStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

/**
 * Returns the browser's `localStorage`, or `undefined` when there is none (server render)
 * or access is blocked. Reading the property itself can throw in some privacy modes.
 *
 * @returns The storage object, or `undefined`.
 */
export function getBrowserStorage(): KeyValueStorage | undefined {
  try {
    return globalThis.localStorage ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * Reads a stored string. Returns `null` when the key is missing, the storage is unavailable,
 * or the read throws, so a blocked storage never crashes the page.
 *
 * @param storage - The storage to read from.
 * @param key - The key to read.
 * @returns The stored value, or `null`.
 */
export function readStoredValue(storage: KeyValueStorage | undefined, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

/**
 * Writes a string. Returns `false` instead of throwing when the write fails (quota, private
 * mode), so the caller can decide what to show.
 *
 * @param storage - The storage to write to.
 * @param key - The key to write.
 * @param value - The string to store.
 * @returns `true` when the value was stored.
 */
export function writeStoredValue(
  storage: KeyValueStorage | undefined,
  key: string,
  value: string,
): boolean {
  try {
    storage?.setItem(key, value);
    return storage !== undefined;
  } catch {
    return false;
  }
}

/**
 * Removes a stored key. Returns `false` when the storage refused the removal.
 *
 * @param storage - The storage to remove from.
 * @param key - The key to remove.
 * @returns `true` when the key was removed (or there was nothing to remove).
 */
export function removeStoredValue(storage: KeyValueStorage | undefined, key: string): boolean {
  try {
    storage?.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
