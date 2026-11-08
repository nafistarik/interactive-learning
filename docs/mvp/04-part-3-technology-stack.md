<!-- Verbatim section of: Visual Learning Platform - MVP 1 Master Prompt.md -->

## PART 3 — TECHNOLOGY STACK

Keep the repository's existing equivalents where they exist. If the repository is empty,
initialise a Next.js app with the latest stable versions and the package manager already
installed on the machine, and record the choice.

- **App:** Next.js (App Router), React, TypeScript (`strict`), Tailwind CSS, Lucide icons.
- **Editor:** Monaco via `@monaco-editor/react`. Load it **client-only**
  (`next/dynamic` with `ssr: false`).
- **Python:** Pyodide with NumPy, running inside a **Web Worker**. Load Pyodide from its
  official CDN at an **exact pinned version** (never "latest"). Use whichever worker
  setup works with the Next.js bundler in use (module worker with dynamic import, or a
  classic worker with `importScripts`) and verify it in the browser.
- **Visualization:** React + SVG + CSS transitions. `motion` (Framer Motion) is allowed
  for the broadcasting animation only if CSS/SVG transitions are not enough. Canvas only
  where it is clearly better. No Three.js.
- **State:** React state; a small store only if prop passing becomes unreasonable.
- **Persistence:** LocalStorage.
- **Content:** static TypeScript data files.
- **Tests:** Vitest.

Do not add a dependency for something a few lines of code can do.

---
