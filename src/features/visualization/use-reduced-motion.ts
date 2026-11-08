import { useSyncExternalStore } from "react";

/** The media query that reports the user's reduced-motion preference. */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Subscribes to changes of the reduced-motion preference.
 *
 * @param onChange - Called when the preference changes.
 * @returns A function that removes the listener.
 */
function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Reads the current reduced-motion preference.
 *
 * @returns `true` when the user asked for less motion.
 */
function readPreference(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Whether the user asked for reduced motion (brief Part 8). During server rendering the
 * answer is `false`, so animation starts only in the browser.
 *
 * @returns `true` when animation should be replaced by end states.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, readPreference, () => false);
}
