import { useSyncExternalStore } from "react";

/**
 * Whether a media query matches. On the server and during hydration it is `serverValue`.
 *
 * @param query - A CSS media query.
 * @param serverValue - The answer before the browser can tell.
 * @returns `true` when the query matches.
 */
export function useMediaQuery(query: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
