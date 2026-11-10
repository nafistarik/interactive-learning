# R3 — Phase 1: ML foundations in NumPy

Started 2026-11-11. Builds on R2 ([`docs/r2/`](../r2/README.md)); every earlier rule still
applies. A module stays `available: false` until it is reviewed, because every push deploys.

Goal: the learner builds and trains small models from scratch in NumPy and **watches
training happen**: every number in a chart comes from recorded iterations of their own loop.

## Modules (Phase 1)

| Module | Slug | Lessons | Exercises |
|---|---|---|---|
| 1.1 Linear Regression & Loss | `linear-regression` | 4 | 3 |
| 1.2 Gradient Descent | `gradient-descent` | 4 | 3 (one bug hunt) |
| 1.3 Logistic Regression | `logistic-regression` | 4 | 3 (one bug hunt) |
| 1.4 Evaluating Models | `evaluation` | 4 | 3 |

1.1 — a model as `y_hat = X @ w + b`; residuals; mean squared error; fitting by trying
parameters; why we need a better way than guessing.
1.2 — the gradient of MSE for `w` and `b`; one update step; the training loop; learning rate
too small / too large (divergence); stopping.
1.3 — classification, the sigmoid `1 / (1 + np.exp(-z))`, probabilities and thresholds,
log loss, training with gradient descent.
1.4 — train/test split, overfitting intuition, accuracy, precision and recall from a
confusion matrix, comparing a from-scratch model with scikit-learn (in Pyodide).

## Engine

### Loops are recorded per iteration

A top-level `for` or `while` loop is still one frame, now with `operationType: "loop"` and a
`loop` record instead of the "not visualised" note:

- **Watched variables** are the names the loop body assigns (from the AST: `=`, `+=`, the
  loop target). After every iteration their values are snapshotted (numbers as numbers,
  arrays as the usual ≤ 64-value snapshot).
- **Bounded:** at most 300 iterations are kept. When that fills up, every other one is dropped
  and only every 2nd, 4th, … iteration is kept from then on; the last iteration is always
  kept. The frame says how many ran and whether it is sampled.
- Implemented by wrapping the loop body in `try/finally` that calls the recorder, so
  `break` and `continue` still work; nested loops run normally inside the top-level one.
- The 10 s run limit still applies.

### New operation kind `ufunc`

`np.exp`, `np.log`, `np.sqrt`, `np.abs`, `np.square`, `np.tanh`, `np.sign` on one array are
recorded with input and result (so `1 / (1 + np.exp(-z))` gives `ufunc`, `binary`, `binary`).

### Validation

- `result` checks take an optional `tolerance` (absolute) for trained parameters.
- New check `{ kind: "assert", expression, message }`: an authored Python expression
  evaluated in the learner's namespace after each run (e.g. `losses[-1] < losses[0]`); the
  message is shown when it is false. For behaviour values cannot show directly
  (convergence), never for matching source.

## Visualization

- **Loop view:** an iteration scrubber over recorded iterations; a line chart per watched
  number (e.g. `loss`, `w`) with the current iteration marked; watched arrays drawn as grids
  at the selected iteration. Play/pause and speed drive the scrubber; reduced motion jumps to
  the last iteration.
- **Fit chart:** lesson data or an exercise can declare `chart: { kind: "fit", x, y,
  prediction }`; the view draws the data points and the recorded `prediction` array at the
  selected iteration, so the line moves as training runs. Predictions are recorded values,
  never computed in the browser.
- **ufunc view:** each input element and its output, with the function named.

## Done when

- Phase 1 shows four open modules; every lesson has content, a demo and a check; content,
  playground, validator and e2e tests cover them like Phase 0.
- Training loops in Practice show iterations, loss curves and the moving fit from recorded
  data, sampled honestly for long loops.
- Existing Phase 0 lessons behave as before (their loop examples now show iterations).
