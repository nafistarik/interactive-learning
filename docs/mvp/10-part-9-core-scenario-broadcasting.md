<!-- Verbatim section of: Visual Learning Platform - MVP 1 Master Prompt.md -->

## PART 9 — CORE SCENARIO: BROADCASTING (Exercise 03, Lesson 07)

Instruction: *"Multiply each column of matrix X by the corresponding weight in w."*

Starter code:

```python
import numpy as np

X = np.array([
    [1, 2],
    [3, 4],
    [5, 6]
])

w = np.array([2, 3])

out = X * w
```

1. **Create X:** highlight lines 3–7; show X as a 3 × 2 grid with shape `(3, 2)`.
2. **Create w:** highlight line 9; show w as a 1D row with shape `(2,)`, styled
   differently from the matrix.
3. **`out = X * w`:** show both inputs; align shapes `(3, 2)` and `(2,)` from the right;
   show w stretched across the 3 rows; animate each multiplication; show
   `[[2, 6], [6, 12], [10, 18]]` with shape `(3, 2)`.
4. **Break it:** the user changes to `w = np.array([2, 3, 4])` and runs again. The real
   NumPy error is caught; the frame records shapes `(3, 2)` and `(3,)`; the UI highlights
   the mismatched trailing dimensions (2 vs 3), explains why broadcasting fails, and
   points at the line to fix.
5. **Fix and complete:** once the user restores a valid solution, validate it (Part 10),
   show success, award XP and stars, and mark the exercise complete.

None of this is hard-coded: every value, shape and error comes from the run.

---
