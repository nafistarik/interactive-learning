# Interactive Learning

Learners write real Python in the browser, step through it statement by statement, and
watch arrays, broadcasting, matrix products, reductions, reshapes and whole training loops
happen, driven by the actual NumPy results. Phase 0 "NumPy for ML" (0.1 Arrays, 0.2 Matrix
multiplication, 0.3 Reductions, 0.4 Reshape & masks) and Phase 1 "Machine Learning in NumPy"
(1.1 Linear regression, 1.2 Gradient descent, 1.3 Logistic regression, 1.4 Evaluation). No backend: Python runs in a Web
Worker with Pyodide (pinned `0.29.4`, from the jsDelivr CDN). Progress is saved in
LocalStorage (`vlp:progress:v2`; MVP 1's `v1` value is migrated).

Briefs: MVP 1 in [`docs/mvp/`](docs/mvp/README.md), R2 in [`docs/r2/`](docs/r2/README.md),
R3 in [`docs/r3/`](docs/r3/README.md).
Roadmap, architecture and release plan: [`docs/roadmap/`](docs/roadmap/README.md). Adding
content: [`docs/authoring.md`](docs/authoring.md).

## Run it

```bash
bun install
bun run dev        # http://localhost:3000
```

Checks:

```bash
bun run typecheck
bun run lint
bun run test       # first run downloads NumPy for the Pyodide tests
bun run build
bun run e2e        # Playwright against the production build, using installed Chrome
```

Every push to `main` deploys to production on Vercel, so run `bun run e2e` before
pushing larger changes.

## Routes

| Route | Page |
|---|---|
| `/` | Dashboard: module progress, XP, stars, Continue learning, roadmap |
| `/learn/[module]` | Module overview: objectives, time, lessons with status (8 modules, see `src/data/curriculum.ts`) |
| `/learn/[module]/lesson/[lessonId]` | Workspace: Theory (content, demo, knowledge check) and Practice (editor, visualization, timeline, inspector) |
| `/progress` | Totals, per-lesson and per-exercise status, Reset progress |

## How execution works

1. **Run all** (or the first **Step forward**) sends the editor code to
   `src/workers/python.worker.ts`. The recorder (`src/lib/python/recorder-source.ts`) parses
   it with `ast` and runs each top-level statement once in a fresh namespace, recording one
   frame per statement: line range, variable snapshots, stdout, error.
2. Arithmetic (`+ - * /`) is evaluated operand by operand, so `X * w + b` becomes two
   recorded sub-steps. A failing step records the operand shapes; the UI explains the
   failure from those shapes with the broadcasting rules, never from NumPy's message.
3. Stepping and the timeline move between recorded frames without running Python again.
   Editing the code discards them.
4. A run longer than 10 s terminates and replaces the worker.

The visualization components (`src/components/visualization/`) only read frames. The
theory demos (`src/components/demos/`) build code from their controls
(`src/features/demos/demo-code.ts`) and record it with the same recorder.

## Layout

```text
src/
├── app/                 routes
├── components/          layout, arena, workspace, theory, demos, visualization, progress, ui
├── data/                curriculum, lesson content, exercises, UI text (content only)
├── features/            execution, visualization, validation, progress, theme, content types
├── lib/                 Python sources and runners, storage
├── workers/             python.worker.ts
└── test/                Vitest (pure logic + Pyodide-in-Node tests)
```
