<!-- Verbatim section of: Visual Learning Platform - MVP 1 Master Prompt.md -->

## PART 8 — VISUALIZATION

The visualization reads execution frames only. It never holds its own copy of example
values. Keep it renderer-agnostic: components receive frames and draw them, so another
renderer can be added later without touching the execution engine.

- **Arrays:** 1D as a row of cells, 2D as a grid, 3D as stacked 2D layers. Values and
  structure visible. Input arrays, weights and results are visually distinct.
- **Shape:** `shape`, `ndim`, `size`, rows and columns. Compatible and incompatible
  dimensions are clearly marked.
- **Indexing:** highlight the selected element, row, column or slice.
- **Vectorization:** one operation applied across many elements; loop vs vectorized
  shown conceptually.
- **Element-wise:** the paired input elements, the operator, and the output element.
- **Broadcasting (major feature):** original shapes → right-aligned dimension comparison
  → compatible or not, with the rule that decided it → conceptual expansion of the
  smaller array → element-wise calculation → final output and its shape. A beginner
  should understand it without reading NumPy docs.
- **Animation sub-steps** are derived from the frame's recorded operations; they are not
  separate Python executions. Pause/Resume and Speed control these sub-steps.
- **Variable inspector:** name, value (truncated when large), shape, ndim, dtype; updates
  with the current frame.
- **Execution timeline:** every recorded frame, completed vs current vs error;
  clicking a frame jumps to it and highlights its lines.
- **Reduced motion:** with `prefers-reduced-motion`, show each sub-step's end state
  without movement.

---
