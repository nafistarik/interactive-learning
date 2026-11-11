# Authoring a module

How to add a module (or a lesson) so it ships with the same quality as Module 0.1. Content
is data: you write TypeScript objects; the UI, the recorder and the tests do the rest.

## 1. Files

```text
src/data/modules/<slug>/
├── module.ts          ModuleDef: slug, number, title, description, objectives, lessons, available
├── exercises.ts       <SLUG>_EXERCISES: Exercise[]
└── lessons/
    ├── index.ts       LESSON_CONTENT in lesson order
    └── lesson-01.ts … one LessonContent per lesson
```

Register the module in `src/data/curriculum.ts` (`MODULES`) and list its slug in its phase
(`PHASES`). Keep `available: false` until the checklist below passes — every push to `main`
deploys, and an unavailable module has no pages.

## 2. A lesson

Sections, in this order, with specific titles ("Why NumPy instead of lists", not "Why"):

1. What it is
2. Why it exists / why it is useful
3. Plain explanation
4. Practical example
5. A demo, with one sentence before it saying what to try
6. Recap (a `list` block)

Then a 2–4 question `knowledgeCheck`, `estimatedMinutes` (8–20), a 1–2 sentence `summary`,
and `practiceStarter` for lessons without an exercise.

Writing rules: English; define every term before using it; 1–3 sentences per text block;
backticks for inline code; no emoji, no hype, no invented numbers.

### Blocks

| Block | Use |
|---|---|
| `text` | A short paragraph |
| `list` | Rules, recaps |
| `note` | A definition or a warning; failing examples go here as text |
| `code` | A runnable example with its exact `output` |
| `playground` | A demo from controls + a code template (preferred) |
| `demo` | One of the hand-built Module 0.1 demos (by id) |

### Code examples

- Standalone: include `import numpy as np`; must run without error.
- `output` is exactly what it prints: lines joined by `\n`, no trailing newline.
- Pyodide is 32-bit: integers are `int32` (desktop NumPy says `int64`); NumPy scalars print
  their repr inside containers (`np.int32(5)`). Prefer printing arrays, `.shape`, `.tolist()`.
- Floats: choose values that print short, or round.

### Playground demos

```ts
{
  kind: "playground",
  demo: {
    title: "Pick an axis",
    controls: [
      { type: "select", name: "axis", label: "axis", options: [
        { label: "0", value: "0" }, { label: "1", value: "1" }, { label: "2 (does not exist)", value: "2" },
      ] },
      { type: "number", name: "rows", label: "rows", min: 1, max: 4, initial: 3 },
    ],
    template: "import numpy as np\nX = np.arange({{rows}} * 2).reshape({{rows}}, 2)\nr = X.sum(axis={{axis}})",
  },
}
```

- Select `value`s are inserted verbatim (they are authored, never typed by learners);
  numbers are clamped integers.
- The last statement should hold a recorded operation so the shared views can draw it:
  `+ - * /`, comparisons, `@`/`np.dot`/`np.matmul`, `sum/mean/max/min/std` with `axis` and
  `keepdims`, `reshape`, `.T`/`np.transpose`. Otherwise list variables in `show`.
- An option may fail on purpose (to show an explanation), but only inside a recorded
  operation. The playground test runs every option.
- **Loops** (R3): a top-level `for`/`while` records, per iteration, the names its body assigns
  (and lists it `.append`s to). Numbers become line charts, arrays are shown at the selected
  iteration. Add `chart: { kind: "fit", x: "x", y: "y", prediction: "pred" }` to the demo
  (or exercise) and assign `pred` in the loop to plot the fit moving. Use `*` or
  `np.square` instead of `**` where you want the step animated.
- Importing `sklearn`, `scipy` or `pandas` loads them on first use (a few seconds).
- **Autograd values** (R5): an object with `data`, `grad` and `_prev` (plus optional `_op`
  and `label`) is drawn as a computation graph after every statement. Arithmetic on such
  objects is not an array step, so end a playground with a recorded NumPy line.
- An operation that should fail on purpose (to show the explanation) may sit inside a
  larger expression, including under a unary minus.

## 3. An exercise

```ts
{
  id: "ex05",              // unique across all modules
  lessonId: "02",
  type: "build",           // or "bug-hunt": starterCode is wrong code to fix
  title, objective, problem, hint,
  starterCode,             // must fail validation (tested)
  prelude,                 // fixed setup shown above the editor; "" if none
  runs: [
    { prelude: VISIBLE, reference: VISIBLE },
    { prelude: HIDDEN, reference: HIDDEN },   // other values: hard-coded answers fail
  ],
  checks: [
    { kind: "result", name: "out", expression: "X @ W" },     // evaluated on the reference
    { kind: "unchanged", name: "X", expression: "X" },        // learner must not change it
    { kind: "no-loop" },                                      // only when vectorizing is the point
    { kind: "result", name: "w", expression: "w", tolerance: 0.001 },  // trained values
    { kind: "assert", expression: "losses[-1] < losses[0]", message: "The loss should go down." },
  ],
  chart: { kind: "fit", x: "x", y: "y", prediction: "pred" },  // optional, for training loops
  solution,                // used by tests only, never shown
}
```

Validation compares behaviour: names, shapes, `np.allclose` values, on every run. Never
check source text, except `no-loop`.

## 4. Checklist before `available: true`

```bash
bunx vitest run src/test/data src/test/lib/python/validate-exercise.test.ts src/test/features/demos/playground.test.ts
bun run typecheck && bun run lint
```

- [ ] Curriculum test: lessons numbered, content per lesson, exercises on real lessons.
- [ ] Content test: every code example prints its documented output in Pyodide.
- [ ] Validator test: every solution passes; every starter fails.
- [ ] Playground test: every option records.
- [ ] Read every lesson in the browser, light and dark; run every playground; pass every
      exercise once, and fail it once with a wrong shape.
- [ ] One e2e test for the module's main exercise flow (`e2e/`).
- [ ] Then set `available: true`, run `bun run e2e`, push.
