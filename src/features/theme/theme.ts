import { useSyncExternalStore } from "react";

import { getBrowserStorage, writeStoredValue } from "@/lib/storage/local-storage";

/** The two themes (brief Part 12). */
export type Theme = "light" | "dark";

/** Storage key of the theme the user picked. Missing means "follow the system". */
export const THEME_KEY = "vlp:theme";

/**
 * Runs before the first paint (inline in `<head>`): applies the picked theme, or the system
 * theme when none was picked, so the page never flashes the wrong colours.
 */
export const THEME_SCRIPT = `(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem("${THEME_KEY}")}catch(e){}if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t;d.style.colorScheme=t})()`;

/**
 * Applies a theme to the page and remembers it as the user's pick.
 *
 * @param theme - The theme to use.
 */
export function pickTheme(theme: Theme): void {
  applyTheme(theme);
  writeStoredValue(getBrowserStorage(), THEME_KEY, theme);
}

/**
 * Sets the theme on the document without remembering it.
 *
 * @param theme - The theme to use.
 */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

/**
 * Subscribes to theme changes on the document.
 *
 * @param onChange - Called when the theme attribute changes.
 * @returns A function that stops listening.
 */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/**
 * The theme now on the page. On the server it is `light`; the client reads the real one.
 *
 * @returns The current theme.
 */
export function useTheme(): Theme {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
    () => "light",
  );
}
