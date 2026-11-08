<!-- Verbatim section of: Visual Learning Platform - MVP 1 Master Prompt.md -->

## PART 10 — EXERCISES AND VALIDATION

| Ex | Lesson | Objective | Inputs |
|---|---|---|---|
| 01 | 03 | Create the requested arrays and get their shapes | Written by the learner |
| 02 | 06 | Element-wise multiplication of `a` and `b` into `result` | Fixed prelude |
| 03 | 07 | Part 9: `out = X * w` | In the editor (the learner edits `w` in step 4) |
| 04 | 08 | `out = X * w + b` | Fixed prelude |

Each exercise has a problem statement, learning objective, starter code, expected
behaviour, an optional hint, the editor, controls, visualization and validation feedback.

**Fixed prelude:** shown as a read-only code block above the editor (not inside Monaco),
executed before the learner's code.

**Validation** runs in the worker on the real results:

- the code ran without an error;
- the required variables exist;
- shapes match exactly;
- values match with `np.allclose`;
- Ex 03 also checks that `X` and `w` still hold the starter values;
- Ex 02 and Ex 04 run the learner's code a second time with a **hidden set of inputs**
  and check that result too, so a hard-coded answer fails.

Never validate by matching source text. Any mathematically correct solution passes.
Failure feedback says what was wrong (missing variable, wrong shape with expected vs
actual, wrong values) without giving away the answer.

---
