# Architecture — now and how it grows

## Now (MVP 1, release R1.0)

```text
Browser only. No server, no database.

Next.js (App Router, static pages)
├── content data (src/data)        lessons, exercises, demos as typed data
├── learning UI                    dashboard, module, workspace, progress
├── visualization (React + SVG)    reads frames only, never runs code
└── PythonRuntimeProvider          one worker per lesson page
        │  postMessage
        ▼
Web Worker: Pyodide 0.29.4 + NumPy (pinned, CDN)
├── recorder  (ast)   code → one frame per top-level statement
└── validator         runs the learner's code with the visible and hidden inputs

LocalStorage: vlp:progress:v1 (progress), vlp:theme (theme)
```

## Principles (keep in every release)

1. **Nothing fake.** Every value, shape, error and timing on screen comes from a real run.
2. **Record once, navigate frames.** The engine records; the UI steps, scrubs and
   animates recorded data. Step back never re-runs code.
3. **Engine ≠ visualization.** The engine knows nothing about drawing; components know
   nothing about Python. They meet only at the frame contract.
4. **Validate behaviour.** Required variables, shapes, `np.allclose`, hidden inputs.
   AST rules only for constraints values cannot show (e.g. "no Python loop" in a
   vectorization exercise), never to match an answer.
5. **Content is data.** Learner-facing text lives in `src/data`, tested by running every
   example. A translation replaces data, not components.
6. **Static-exportable.** No feature may need a Node server at runtime. This keeps
   hosting trivial and a Tauri desktop build possible later.

## The engine contract

The one interface every execution engine implements, browser or server:

```ts
interface ExecutionEngine {
  load(): Promise<void>; // with progress: runtime → packages → ready
  record(code: string, prelude: string): Promise<RecordingOutcome>;
  run(code: string): Promise<{ ok: boolean; stdout: string; error?: string }>;
  validate(code: string, runs: ValidationRun[], checks: ValidationCheck[]): Promise<ValidationOutcome>;
  dispose(): void; // terminates; a timeout calls this and starts fresh
}
```

`PythonClient` already has this shape. A server engine (R5, if ever) speaks the same
contract over HTTP, so no UI code changes.

## How the frame contract grows

Today `OperationStep.operator` is `"+" | "-" | "*" | "/"`. Each release adds operation
**kinds** as a discriminated union, so old visualizations keep working:

| Kind | Release | Records | Visualization |
|---|---|---|---|
| `binary` (`+ - * /`) | R1 ✓ | left, right, result snapshots | element-wise + broadcasting |
| `matmul` (`@`) | R2 | left, right, result; shapes `(m,k)·(k,n)` | row × column dot products |
| `reduce` (`sum`, `mean`, `max`, `min`, with `axis`) | R2 | input, axis, result | collapse along an axis |
| `reshape` / `transpose` | R2 | input, new shape, result | element order kept, grid re-flowed |
| `call` (whitelisted ufuncs: `np.exp`, `np.maximum`, …) | R2 | inputs, result | per-element function |
| `loop` | R3 | per-iteration snapshots of watched variables, capped | iteration scrubber, live charts |

A visualization registry maps kind → component; an unknown kind falls back to the
before/after array view.

Frames gain a `contractVersion` field in R2 so a cached old worker never feeds new UI.

## Storage

- R2: `vlp:progress:v2` with modules as a level (`modules[slug].lessons…`), plus a
  **tested migration from v1** (read v1, convert, write v2, keep v1 until the write
  succeeds). Corrupt values still start fresh.
- R4: if accounts exist, LocalStorage stays the offline copy; the server copy is merged,
  not overwritten (union of completed items, best stars, max XP).

## When a backend appears, and which

| Need | Smallest answer | When |
|---|---|---|
| Hosting | Vercel, deploying every push to `main` (static pages, no server code) | R1.1 ✓ |
| Accounts, cross-device progress, streak | Managed auth + Postgres (e.g. Supabase) behind a thin API | R4, only if learners come back |
| AI hints | A small proxy for the model API (keys never in the browser) | after R4 |
| PyTorch execution | Isolated sandbox (container/microVM per run, CPU/memory/time limits, no network) | R5 decision, maybe never |

FastAPI is the right tool only for the last row. Do not build it for the others.

## Desktop (Tauri) — later

Possible because the app stays static-exportable. Needs: self-hosted Pyodide files,
`output: "export"` (not needed on Vercel, required for Tauri), and no route handlers. A local Python sidecar would also give real
PyTorch offline — a second route to Phase 2 if the server sandbox is too costly.
