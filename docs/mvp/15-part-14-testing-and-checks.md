<!-- Verbatim section of: Visual Learning Platform - MVP 1 Master Prompt.md -->

## PART 14 — TESTING AND CHECKS

At the end of every milestone, run and report:

- `tsc --noEmit`, the linter, and the production build.
- **Vitest unit tests** for the pure logic: broadcasting compatibility rules, the frame →
  view-model mapping, validation, star/XP rules, progress storage (including a corrupt or
  old-version value).
- **Python instrumentation tests:** where feasible, run the worker's Python script under
  Pyodide in Node and check the frames for the Part 9 code, the `(3,)` error case,
  `X * w + b`, a multi-line statement, and a loop (marked not visualised).
- **Content test:** every code example in the lesson data runs and prints what the text says.
- **Manual browser check** of the milestone's flow. If you have no browser tool, say
  plainly that the UI was not verified in a browser.

Never skip, delete or weaken a test to make it pass.

---
