# R2 — Phase 0 complete: NumPy for ML

Started 2026-11-11. Builds on MVP 1 ([`docs/mvp/`](../mvp/README.md)); all MVP 1 rules still
apply (nothing fake, record once, behaviour validation, content as data). The roadmap
entry is in [`docs/roadmap/03-release-plan.md`](../roadmap/03-release-plan.md).

Every push to `main` deploys to production, so a module stays `available: false` (no
pages, not listed as open) until its content, exercises and tests are done.

## Modules

| Module | Slug | Lessons | Exercises |
|---|---|---|---|
| 0.1 Arrays, Vectorization & Broadcasting | `arrays` | 8 (exists) | Ex 01–04 (exist) |
| 0.2 Dot Products & Matrix Multiplication | `matmul` | 4 | 3 (one bug hunt) |
| 0.3 Reductions & Axes | `reductions` | 4 | 3 (one bug hunt) |
| 0.4 Reshape, Transpose & Masks | `reshape` | 4 | 3 (one bug hunt) |

Lessons per module are fewer than in 0.1 on purpose: each new module reuses the platform
and the earlier modules' ideas.

### 0.2 Dot Products & Matrix Multiplication
1. Vectors and the dot product (`np.dot` on 1D)
2. Matrix × vector (`X @ v`)
3. Matrix multiplication and its shape rule `(m, k) @ (k, n) → (m, n)`
4. Practical: `X @ W + b`, the linear layer

### 0.3 Reductions & Axes
1. Reducing an array: `sum`, `mean`, `max`, `min`, `std`
2. Axes: `axis=0` collapses rows, `axis=1` collapses columns
3. `keepdims` and broadcasting the result back
4. Practical: column statistics and feature standardization

### 0.4 Reshape, Transpose & Masks
1. `reshape` and `-1`; size must stay the same
2. Transpose and `.T`; when shapes need flipping for `@`
3. Comparisons, boolean masks and `a[mask]`
4. Practical: flatten images, select rows by a condition

## Platform

- **Curriculum:** phases → modules → lessons in `src/data/curriculum.ts` and one folder per
  module under `src/data/modules/<slug>/`. Routes `/learn/[module]` and
  `/learn/[module]/lesson/[lessonId]`; `/learn/arrays/...` URLs stay valid.
- **Progress v2:** key `vlp:progress:v2`; lessons keyed `"<module>/<lesson>"`. On first load
  a v1 value is migrated (lessons become `arrays/<id>`), and v1 is left in place. A corrupt
  or unknown value still starts fresh. Reset clears both keys.
- **Totals:** XP and stars across all modules; completion per module.

## Engine (frame contract additions)

Every operation step gains `kind`. Existing steps are `kind: "binary"`.

| Kind | Python it records | Explains failures from |
|---|---|---|
| `binary` | `+ - * /`, and comparisons `> >= < <= == !=` (result is boolean) | broadcasting rules (exists) |
| `matmul` | `a @ b`, `np.dot(a, b)`, `a.dot(b)`, `np.matmul(a, b)` | inner sizes: last axis of left vs first (1D) or second-to-last axis of right |
| `reduce` | `sum`, `mean`, `max`, `min`, `std` as `np.f(a, …)` or `a.f(…)`, with `axis` and `keepdims` | the axis vs the input's `ndim` |
| `reshape` | `reshape` (`np.reshape`, `a.reshape`), `transpose` (`.T`, `np.transpose`, `a.transpose()`) | input size vs the requested shape's size |

Function and method calls are evaluated once: the owner and each argument are evaluated a
single time, operations inside arguments are recorded first (`np.sum(X * w, axis=1)` gives a
`binary` then a `reduce` step). Anything else still runs as before.

## Visualizations

- **matmul:** operands, the shape rule with the inner sizes compared, then the result where
  each output cell shows its row × column dot product (terms from the recorded operands, the
  value from the recorded result). Cells play one by one; click any cell to inspect it.
- **reduce:** the input with the groups that collapse highlighted for the axis, then the result.
- **reshape/transpose:** input and result with each element's original position labelled.
- **Booleans** print as `True`/`False`.

## Exercises

- New field `type: "build" | "bug-hunt"`. A bug hunt starts from wrong code; the panel says
  "Find and fix the bug". Validation is the same behaviour check.
- New field `forbid: ["loop"]`: the validator parses the code and rejects `for`, `while` and
  comprehensions with a clear message. Used only where values cannot show the requirement.

## Demos

Besides the eight hand-built demos of 0.1, lesson data can declare a **playground** demo:
controls (fixed choices or bounded numbers), a code template, and which variables to show.
The template is filled only from those validated values, recorded with the real recorder, and
drawn by the same visualizations.

## Done when

- All four modules are listed and open; every lesson has content, a demo and a check.
- Every new operation is visualized from recorded frames, with failure explanations.
- Content tests run every example; demo templates are tested in Pyodide with every option.
- A v1 learner's progress survives the upgrade (unit test + e2e).
- e2e covers one full exercise flow per new module.
