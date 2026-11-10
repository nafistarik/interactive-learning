# Release plan

Each release is shippable on its own and ends with learners using it. Cut scope from the
bottom of a release, never the top. Module lists for R2 and R3 are **proposals** until
the full curriculum is written down (see [open decisions](04-open-decisions.md)).

| Release | Theme | Main engineering item | Status |
|---|---|---|---|
| R1.0 | MVP 1: Module 0.1 Arrays, Vectorization & Broadcasting | Statement recorder, frames, broadcasting view | Done 2026-11-11 |
| R1.1 | Launch MVP 1 and learn from it | Deploy, e2e tests, learner sessions | Next |
| R2 | Phase 0 complete: NumPy for ML | New operation kinds (`@`, reductions, reshape, calls), multi-module content | |
| R3 | Phase 1: ML foundations in NumPy | Loop-aware recording, charts from real data | |
| R4 | Accounts and sync (only if learners return) | Thin backend, progress merge | |
| R5 | Phase 2: Deep learning foundations | NumPy autograd in the browser; PyTorch decision | |
| Later | Transformers, RL, Agentic AI, AI hints, desktop | | |

---

## R1.1 — Launch MVP 1

Goal: real people use Module 0.1, and we know what to fix before building more.

- Deploy as a static site (`output: "export"`), with a custom domain if available.
- Close the gaps MVP 1 left unverified: Ex 01 and Ex 03 checks in a browser, tablet
  layout, Pyodide load failure → Retry, reduced motion, keyboard-only walkthrough.
- Playwright e2e for the core path: open lesson 07 → Run all → break `w` → see the
  shape error → fix → Check solution → stars and XP → reload → progress kept.
- Rename Phase 0 to its theme ("NumPy for ML"); Arrays becomes Module 0.1.
- Feedback without tracking: a "Send feedback" link (mail or form) on every lesson.
- Run 5–8 learner sessions with a fixed task script; write down where people got stuck.

Done when: the site is public, e2e passes in CI, and a short findings list exists.

## R2 — Phase 0 complete: NumPy for ML

Goal: the learner can read and write the NumPy that ML code is made of.

Proposed modules (0.1 exists):

| Module | Topic | Visualization needed |
|---|---|---|
| 0.2 | Vectors, dot product, matrix multiplication (`@`) | `matmul`: each output cell as a row × column dot product; shape rule `(m,k)·(k,n)` and its mismatch error |
| 0.3 | Reductions and axes: `sum`, `mean`, `max`, `axis`, `keepdims`, normalization | `reduce`: an axis collapsing |
| 0.4 | Reshape, transpose, stacking, boolean masks | `reshape`/`transpose`; mask highlight (exists in the 0.1 indexing demo) |

Engine and platform work:

- Recorder: `@`, method and function calls on a whitelist, each as a typed operation.
- Frame `contractVersion`; visualization registry by operation kind.
- Curriculum becomes multi-module: `/learn/[module]/lesson/[lessonId]`, module data per
  folder, the same content tests per module.
- Progress v2 with a tested migration from v1 (no learner loses progress).
- New exercise type **bug hunt**: given wrong code (e.g. a shape bug), the learner fixes
  it. Validation is the same behaviour check.
- AST constraint checks, used only where values cannot tell (e.g. "solve it without a
  Python loop").
- Content authoring guide + module template, so a module takes days, not weeks.

Done when: all of Phase 0 is live, every new operation is visualized from frames, and a
v1 learner's progress survives the upgrade.

## R3 — Phase 1: ML foundations in NumPy

Goal: the learner builds and trains small models from scratch and *watches training*.

Proposed modules: 1.1 Linear regression and loss (MSE) · 1.2 Gradients and gradient
descent · 1.3 Logistic regression and classification · 1.4 Train/test split and
evaluation, checking the learner's model against scikit-learn (available in Pyodide).

Engine work — loop-aware recording:

- A `loop` frame holds per-iteration snapshots of **watched** variables (declared by the
  exercise, e.g. `w`, `b`, `loss`), capped (e.g. first 200 iterations, then sampled) and
  marked when sampled.
- Iteration scrubber; loss curve and fitted line drawn from those snapshots, never
  re-computed in JavaScript.
- Validation with tolerances and convergence checks (loss decreased, final loss below a
  bound), still with hidden data.

Decision at the end of R3: PyTorch route for Phase 2 (see open decisions).

Done when: a learner trains linear and logistic regression in the browser and every
chart on screen comes from recorded iterations.

## R4 — Accounts and sync (conditional)

Build only if R1.1–R3 show learners return across days or devices.

- Sign-in (managed auth), progress stored server-side and merged with LocalStorage.
- Streak (meaningful only with accounts).
- The app stays static-exportable; the backend is a separate small service.

## R5 — Phase 2: Deep learning foundations

- Neural networks in NumPy: forward pass, backpropagation, a tiny autograd the learner
  builds (micrograd-style), training an MLP — all in the browser.
- PyTorch only if the decision after R3 says so: either an isolated server sandbox or
  the desktop app with a local Python sidecar.

## Later

- **Transformers:** attention, embeddings and a toy transformer in NumPy (small sizes run
  in the browser).
- **Reinforcement learning:** grid-world, value iteration, Q-learning in NumPy.
- **Agentic AI:** needs a real LLM; depends on the AI decision.
- **AI hints:** optional, real model behind a proxy, grounded in the recorded frames and
  the validator's feedback. Never canned replies shown as AI.
- **Desktop (Tauri):** when offline use or local Python is needed.
- **Bangla content:** a translated data set; the UI already keeps text in data files.
