<!-- Verbatim section of: Visual Learning Platform - MVP 1 Master Prompt.md -->

## PART 5 — LEARNING CONTENT

All learner-facing text is in **English**. Keep it in data files, never inside
components, so a Bangla version can be added later without touching the UI.

Every lesson covers: what the concept is, why it exists, why it is useful, a plain
explanation, a practical example, an interactive demo where it helps, a knowledge check,
and a coding activity where it helps. Difficulty rises gradually; explain every
mathematical term before using it.

**Knowledge check:** 2–4 multiple-choice questions per lesson. After an answer, show
whether it is right and a one-line explanation. A lesson's check passes when every
question has been answered correctly (retries allowed).

**Every code example in the content must actually run in Pyodide and print what the text
says it prints.** A test checks this (Part 14).

| Lesson | Topic | Teach | Interactive demo | Exercise |
|---|---|---|---|---|
| 01 | Introduction to Arrays | What an array is; why arrays; Python list vs NumPy array; creating arrays; elements and basic indexing | Edit array values; the visual array updates | — |
| 02 | Array Dimensions | 1D, 2D, 3D arrays; dimensions and axes | Change the number of dimensions; 3D is shown as stacked 2D layers | — |
| 03 | Understanding Array Shape | `shape`, `size`, `ndim`, rows and columns | Pick a structure; see its shape | **Ex 01** |
| 04 | Array Indexing | Element, row and column indexing; basic slicing | Choose an index or slice; the matching cells highlight | — |
| 05 | Introduction to Vectorization | Loops vs vectorized operations; why vectorization helps; performance intuition | Loop vs vectorized comparison (see note) | — |
| 06 | Element-wise Operations | `+ − × ÷` element by element | Matching elements pair up and produce the result | **Ex 02** |
| 07 | Understanding Broadcasting | Why it exists; the rules; shape compatibility; scalar and 1D broadcasting | Change two shapes; see whether they broadcast and why | **Ex 03** (Part 9) |
| 08 | Practical Application: `X * w + b` | Input matrix, weights, bias, element-wise multiply, broadcasting, output | Step through `X * w + b` | **Ex 04** |

**Lesson 05 performance note:** if you show timings, measure them for real in the
learner's browser and label them "measured in your browser (Python on WebAssembly)".
Use sizes around 100,000 elements so the loop finishes in a reasonable time. Never show
invented numbers.

---
