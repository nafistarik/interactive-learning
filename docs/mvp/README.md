# MVP 1 — Arrays, Vectorization & Broadcasting

**Status:** shipped on 2026-11-11 (release R1.0). What comes next is in
[`docs/roadmap/`](../roadmap/README.md).

The MVP brief is split into one file per part so it can be worked through one part at a
time. Each file is a verbatim section of the full brief. Read them in number order.

## Order of work

Milestones come from Part 0. Work them top to bottom and stop at the end of each one.

| Step | Files | What it covers | Done when |
|---|---|---|---|
| Setup | `00`, `04`, `14` | How to work, the stack, the architecture | Repo runs, `typecheck` and `build` pass |
| M1 — core slice | `08`, `09`, `10` | Execution model, visualization, Part 9 scenario | Part 9 steps 1–4 work in a browser with real NumPy output |
| M2 — exercises and progress | `07`, `11`, `12` | Editor controls, Part 10 exercises, Part 11 XP and progress | Every exercise passes with a correct solution and fails usefully with a wrong one; progress survives refresh |
| M3 — navigation shell | `05`, `02`, `03` | Dashboard, module overview, progress page, routes | Every Part 4 route opens and links correctly |
| M4 — theory | `06` | Content, demos and knowledge checks for lessons 01–08 | Every lesson teaches its topic; every code example runs in Pyodide |
| M5 — polish | `13`, `15`, `16` | Themes, responsive layout, states, accessibility, tests | Part 15 acceptance criteria all pass |
| Final | `17`, `18`, `19` | Strict rules, reports, final instruction | Final report written |

## Notes

- `docs/mvp/` holds the brief only. Progress and open questions are kept outside the repo.
- The brief was written for an AI agent. Its "do not ask, decide yourself" rule is in
  `00-how-to-work.md`. Open questions are tracked outside the repo and resolved before
  the part that depends on them.
