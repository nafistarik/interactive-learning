"use client";

import { useSyncExternalStore } from "react";

import { getBrowserStorage, writeStoredValue } from "@/lib/storage/local-storage";

import { THEME_KEY } from "./theme-script";

export { THEME_KEY };

/** The two themes (brief Part 12). */
export type Theme = "light" | "dark";

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
