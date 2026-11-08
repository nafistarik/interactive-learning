<!-- Verbatim section of: Visual Learning Platform - MVP 1 Master Prompt.md -->

## PART 11 — GAMIFICATION AND PROGRESS

- **Lesson complete:** its knowledge check passed and, if it has an exercise, the
  exercise passed.
- **XP:** 50 per completed lesson, 100 per completed exercise, each awarded once.
  Repeating never adds XP.
- **Stars per exercise** (an attempt is one validation):
  3 = passed with no hint within 3 attempts; 2 = hint used, or 4–6 attempts;
  1 = passed otherwise. Keep the best result.
- **Module completion** = completed lessons ÷ 8.
- **Tracked:** completed lessons, completed exercises, XP, stars, attempts, hint use,
  current lesson.
- **Storage:** one LocalStorage key, `vlp:progress:v1`, holding a `version` field. On a
  parse error or an unknown version, start fresh without crashing. Read it only on the
  client after mount, so the server HTML and the first client render match (no hydration
  mismatch). Wrap every read and write in `try/catch` (private mode can throw).
- **Reset progress:** behind a confirmation dialog; clears the key and the in-memory state.

---
