<!-- Verbatim section of: Visual Learning Platform - MVP 1 Master Prompt.md -->

## PART 0 — PRIORITIES AND MILESTONES

Build in this order. If capacity runs out, cut from the bottom of the list, never from
the top. The core slice is the product; everything else supports it.

| # | Milestone | Done when |
|---|---|---|
| 1 | **Core slice.** Lesson 07 workspace running the Part 9 scenario end to end: Monaco → Pyodide worker → execution frames → step forward/back and timeline → array and broadcasting visualization → real error explanation when `w` has shape `(3,)`. Minimal layout and theme are enough here. | Part 9 steps 1–4 work in the browser with real NumPy output. |
| 2 | **Exercises and progress.** All four exercises (Part 10), validation, hints, XP, stars, LocalStorage, reset with confirmation. | Every exercise passes with a correct solution and fails usefully with a wrong one; progress survives a refresh. |
| 3 | **Navigation shell.** Dashboard, Module Overview, Progress page, lesson sidebar, breadcrumbs, previous/next. | Every route in Part 4 opens and links correctly. |
| 4 | **Theory.** Content, interactive demos and knowledge checks for all eight lessons (Part 5). | Every lesson teaches its topic; every code example in the content runs in Pyodide. |
| 5 | **Polish.** Dark and light themes, responsive layout, loading/empty/error states, keyboard access, reduced motion. | Part 15 acceptance criteria all pass. |

---
