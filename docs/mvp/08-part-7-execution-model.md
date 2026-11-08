<!-- Verbatim section of: Visual Learning Platform - MVP 1 Master Prompt.md -->

## PART 7 — EXECUTION MODEL (STEP ENGINE)

This is the critical technical piece. Implement exactly this model.

1. **Run once, record frames.** On **Run all** or the first **Step forward**, the worker
   parses the editor code with Python's `ast` module and executes each top-level
   statement once, in order, in a **fresh namespace**, recording one execution frame per
   statement. Execution stops at the first error; that error becomes the last frame.
2. **Navigate, never re-run.** Step forward, Step back and timeline clicks move between
   the recorded frames. They do not execute Python again. Each frame holds a snapshot of
   the variables after its statement, so stepping back shows the real earlier data, not
   just a moved highlight.
3. **Run all** executes and jumps to the last frame. **Step forward** from a fresh state
   executes and shows frame 0. **Reset execution** clears the frames.
4. **Editing the code discards the frames.** The next run starts from scratch.
5. **Line ranges.** A frame covers `lineno` to `end_lineno`; statements such as
   `X = np.array([...])` span several lines and the whole range is highlighted.
6. **Arithmetic is recorded operand by operand.** For an assignment or expression whose
   value is an arithmetic operation on arrays or scalars (`+ - * /`), walk the
   expression tree: evaluate each operand **once**, record its shape, dtype and values,
   then apply the operator to those values with Python's `operator` module, so nothing
   runs twice. Nested operations (`X * w + b`) become ordered sub-steps
   (`X * w`, then `(X * w) + b`) that drive the animation.
7. **Broadcasting errors come from recorded shapes.** When an operation fails, the frame
   records the operand shapes. The UI explains the failure from those shapes using the
   broadcasting rules. Never parse NumPy's error message text to find shapes.
8. **Supported subset for visualization:** imports, assignments, NumPy array creation,
   scalar and array arithmetic, element-wise operations, broadcasting, and bare
   expressions (shown like a REPL result). Loops, `def`, `class`, `with`, `try` and other
   statements still execute, as one frame each, marked "not visualised step by step"
   with a short explanation. Never claim full line-by-line debugging of arbitrary Python.
9. **Serialization limit.** For each array send its shape, dtype and at most its first 64
   values, with a `truncated` flag. Send NaN and infinity as strings. The visualization
   draws at most an 8 × 8 grid (and at most 4 layers for 3D) and says when it is showing
   part of a larger array.
10. **Prelude code.** Where an exercise provides fixed inputs (Part 10), the prelude runs
    first in the same namespace; its variables appear in the inspector, while frames and
    highlights refer only to the editor code.

---
