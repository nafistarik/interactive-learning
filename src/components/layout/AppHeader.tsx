"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "./ThemeToggle";

/** Top-level navigation targets. */
const NAV = [
  { href: "/", label: "Dashboard", match: (path: string) => path === "/" },
  { href: "/learn/arrays", label: "Arrays module", match: (path: string) => path.startsWith("/learn") },
  { href: "/progress", label: "Progress", match: (path: string) => path === "/progress" },
];

/** The app bar on every page: logo, navigation and the theme toggle (brief Part 4.1). */
export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            aria-hidden
            className="grid size-7 place-items-center rounded-md bg-accent font-mono text-xs text-accent-fg"
          >
            [ ]
          </span>
          <span className="hidden sm:inline">Interactive Learning</span>
        </Link>
        <nav aria-label="Main" className="flex flex-1 items-center gap-1 text-sm">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-2.5 py-1.5 ${
                  active ? "bg-surface-2 font-medium text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
