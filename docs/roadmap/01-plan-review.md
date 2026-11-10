# Review of the original architecture plan

Reviewed on 2026-11-11, after MVP 1 shipped. The original plan (Next.js + Pyodide now,
FastAPI/PostgreSQL/Tauri later) is mostly right. This page records what it got right,
where it conflicts with what we built and learned, and the risks it does not cover.

## What the plan gets right — keep

| Point | Status in MVP 1 |
|---|---|
| Browser-first: Next.js + Pyodide in a Web Worker, no backend | Built. Proven: NumPy runs, UI stays responsive, a 10 s timeout recovers from infinite loops. |
| Execution ≠ tracking ≠ visualization; Python never draws | Built. The worker returns frames; React only reads them. |
| Statement-level stepping with `ast`, persistent namespace | Built, in a stronger form (see below). |
| Validate behaviour, not source text | Built: shapes + `np.allclose` + a second run with hidden inputs. |
| Engine must be swappable for PyTorch later | Agreed. The contract to keep is "record code → frames", see [architecture](02-architecture.md). |
| No Rust/Tauri now | Agreed. |
| Define content schema, engine contract and visualization contract first | Done for MVP 1 (`features/content/types.ts`, `features/execution/frames.ts`). |

## Where the plan conflicts with what works — change

1. **`step()` on the engine is the wrong interface.** The plan's
   `ExecutionEngine.step()` executes one more statement each call. That cannot step
   *back* without re-running, and re-running code with side effects or randomness gives
   different data. MVP 1 records every statement once and navigates recorded frames;
   Step back shows the real earlier data. **Decision:** the engine contract is
   `record(code, prelude) → frames`. Stepping is a UI concern.

2. **The plan's frame is too thin.** `variableName`, `inputShapes`, `outputShape`,
   `sampleValues` cannot drive an element-wise or broadcasting animation: the UI needs
   each operand's values, the order of nested sub-steps (`X * w`, then `+ b`), and full
   variable snapshots for the inspector. **Decision:** keep the MVP 1 frame
   (`operations[]` with left/right/result snapshots) and extend it with new operation
   kinds instead of replacing it.

3. **`sys.settrace` for line tracking.** It sees Python lines, not NumPy internals, and
   in Pyodide it slows every line. MVP 1 does not need it. It becomes useful only for
   loops (see risk 1), and then with hard caps.

4. **"AI Coach — Simulation Responses".** Canned replies presented as an AI coach are
   fake output, which the product rules forbid. Shape-mismatch explanations are already
   computed from recorded shapes — that *is* the coach for now. **Decision:** no
   simulated AI. Real AI hints are a later, optional release.

5. **Zustand.** Not needed: React context + reducer handles progress fine. Add a store
   only when prop passing becomes unreasonable.

6. **Two themes "Cyber Lab + Playful Studio", Skill Tree, Level, Streak, Side Quests,
   Boss Arenas.** These conflict with the design rule "serious, premium, no decorative
   animation" and multiply content work. Streak without accounts is per-browser only
   and easy to lose. **Decision:** keep XP + stars; revisit streak with accounts;
   side quests and boss arenas come after the core path exists.

7. **Three.js in "future Visualization".** No lesson so far needs 3D; 3D arrays read
   better as stacked 2D layers. Keep it out until a lesson clearly needs it.

8. **FastAPI as "the" future backend.** A Python backend is only needed if we run
   learner code on a server. Accounts and progress sync do not need Python. Running two
   backends early is the expensive mistake. **Decision:** see release R4/R5.

## Risks the plan does not cover

1. **Loops are invisible today.** MVP 1 runs a `for` loop as one frame marked "not
   visualised". Phase 1 (gradient descent, training loops) is *all* loops. Without
   loop-aware recording, the product's core idea stops working right where ML starts.
   This is the biggest engineering item after MVP 1 (release R3).

2. **PyTorch does not run in the browser.** Checked: Pyodide 0.29.4 ships no `torch`,
   `tensorflow` or `jax`. It does ship `scikit-learn` 1.7, `scipy`, `pandas`,
   `matplotlib` and `autograd`. So "Phase 2 = PyTorch" forces either a server sandbox
   (security, cost, ops) or a desktop app with local Python. **Recommendation:** teach
   deep-learning foundations in NumPy (learners build a tiny autograd), which is
   better teaching anyway, and decide on PyTorch at the end of R3 with real usage data.
   Attention (Transformers) and grid-world RL also fit in NumPy at toy scale.

3. **Only `+ - * /` are recorded.** Matrix multiplication `@`, reductions with `axis`,
   `reshape`/`transpose` and NumPy function calls are the next modules' whole topic.
   Each new operation kind needs recorder support, a frame type and a visualization.

4. **Progress storage has no migration.** MVP 1 starts fresh on an unknown version.
   The moment a second module ships, a version bump would wipe every learner's progress.
   A v1 → v2 migration must ship with R2.

5. **Content is the bottleneck, not code.** One module took 8 lessons, 8 demos, 4
   exercises and ~25 tested code examples. At 25 modules, authoring speed decides the
   timeline. We need an authoring guide and per-module templates (R2).

6. **Nothing is launched yet and nothing is measured.** MVP 1 is not deployed and has
   had no learner test. Building R2 before 5–8 people have used R1 risks polishing the
   wrong thing. No tracking is needed: watch sessions and ask.

7. **Naming mismatch.** The dashboard labels *Phase 0* as "Arrays, Vectorization &
   Broadcasting", but the plan says Phase 0 has four core modules, of which Arrays is
   0.1. Phase 0 should be named for its theme (e.g. "NumPy for ML") with Arrays as its
   first module. Fixed in R2.

8. **Pyodide comes from a CDN.** A CDN outage or a blocked network means no Python, and
   a desktop app cannot depend on it. Self-hosting or caching the pinned files is needed
   before offline or desktop use.
