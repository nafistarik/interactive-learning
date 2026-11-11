# R5 — Phase 2: Deep learning foundations in NumPy

Started 2026-11-12. Builds on R3 ([`docs/r3/`](../r3/README.md)); every earlier rule still
applies. No backend and no PyTorch: everything runs in NumPy in the browser (decision 5 in
[open decisions](../roadmap/04-open-decisions.md), default kept). R4 (accounts) stays
deferred until learners return.

Goal: the learner builds a neural network from scratch, derives and checks its gradients,
writes a tiny autograd engine, and **watches a network learn** a curve no straight line can fit.

## Modules (Phase 2 "Deep Learning in NumPy")

| Module | Slug | Lessons | Exercises |
|---|---|---|---|
| 2.1 Neurons and Layers | `neural-networks` | 4 | 3 |
| 2.2 Backpropagation | `backpropagation` | 4 | 3 (one bug hunt) |
| 2.3 Build Your Own Autograd | `autograd` | 4 | 3 (one bug hunt) |
| 2.4 Training a Neural Network | `training-networks` | 4 | 3 |

2.1 — a neuron (`x @ w + b` then an activation); ReLU `np.maximum(0, z)`, sigmoid, tanh; a
layer as `X @ W + b` with a weight matrix; stacking two layers; why non-linearity matters
(two linear layers collapse into one).
2.2 — the chain rule as "multiply the local slopes"; gradients of a tiny network by hand;
checking them numerically (finite differences); the backward pass layer by layer
(`dW = X.T @ dZ`, `db = dZ.sum(axis=0)`, `dX = dZ @ W.T`, ReLU's gradient as a mask).
2.3 — a `Value` class holding `data` and `grad`, operations that remember their inputs
(`_prev`) and how to pass gradients back (`_backward`); topological order; `backward()`;
checking it against 2.2's hand gradients (micrograd-style, small and readable).
2.4 — a 1-hidden-layer network trained with the 2.2 backward pass on a non-linear 1D curve;
initialization, learning rate, watching the fit bend; overfitting with too many units.

## Engine

- **Autograd graphs.** A variable whose value has `data`, `grad` and `_prev` attributes (the
  2.3 convention) is snapshotted as a graph: up to 40 nodes reachable through `_prev`, each with
  its label (`label` attribute if set), `data`, `grad` and operation (`_op`). Recorded after
  every statement like any variable, so stepping through `loss.backward()` shows the grads
  appear.
- **Operations on non-array objects** (like `Value + Value`) still run once but are no longer
  recorded as element-wise steps: the array views cannot draw them; the graph view does.
- Everything else is reused: training loops (R3 loop recording + fit chart), `@`, reductions,
  `np.tanh`/`np.exp` (ufunc steps), `.T`, masks.

## Visualization

- **Graph view:** the largest autograd graph in the current frame, laid out by depth from the
  output (left: inputs, right: the output), one box per value with its label, `data` and
  `grad` (highlighted when non-zero), and the operation that produced it. Shown when the frame
  has no recorded operation or loop.

## Done when

- Phase 2 shows four open modules; every lesson has content, a demo and a check; content,
  playground, validator and e2e tests cover them like earlier phases.
- Stepping through autograd code shows the graph and its gradients from recorded values.
- A network visibly learns a non-linear curve in Practice (fit chart from recorded predictions).
