"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

import { applyTheme, pickTheme, THEME_KEY, useTheme } from "@/features/theme/theme";
import { getBrowserStorage, readStoredValue } from "@/lib/storage/local-storage";

/**
 * Switches between light and dark. Until the user picks one, the page follows the system
 * theme, including when the system theme changes while the page is open.
 */
export function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      if (readStoredValue(getBrowserStorage(), THEME_KEY) === null) {
        applyTheme(media.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  }, []);

  return (
    <button
      type="button"
      onClick={() => pickTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="btn-ghost size-9 justify-center p-0"
    >
      {theme === "dark" ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}
