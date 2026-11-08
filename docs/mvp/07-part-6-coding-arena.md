<!-- Verbatim section of: Visual Learning Platform - MVP 1 Master Prompt.md -->

## PART 6 — CODING ARENA

### 6.1 Editor

Monaco with Python highlighting, line numbers, indentation, starter code, editable code,
**Reset code** (back to the starter), error markers on the failing line, and a highlight
for the current frame's lines.

### 6.2 Controls

**Run all · Step forward · Step back · Reset execution · Pause/Resume animation · Speed.**
Each control is enabled only when it can act (for example, Step back is disabled on the
first frame; Pause is disabled when no animation is playing).

### 6.3 Python runtime (Web Worker)

- Initialise Pyodide **lazily**, but start loading as soon as a lesson's Practice view
  opens, so it is usually ready by the time the user runs code.
- Show loading progress (runtime, then NumPy). The first load is large.
- If loading fails, show an error with a **Retry** button.
- Capture stdout, runtime errors and variable snapshots.
- **Timeout:** if a run takes longer than 10 seconds, terminate the worker, start a fresh
  one, and tell the user the run was stopped. (A worker keeps the UI responsive, but its
  code cannot be interrupted any other way without cross-origin isolation headers, which
  would interfere with loading Pyodide from the CDN.)
- Never execute Python, or any user code, with `eval` or `new Function` on the main thread.

---
