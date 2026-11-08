<!-- Verbatim section of: Visual Learning Platform - MVP 1 Master Prompt.md -->

## PART 13 — ARCHITECTURE

Adapt to the repository's conventions. A suggested layout:

```text
src/
├── app/                    # routes from Part 4
├── components/             # layout, dashboard, curriculum, workspace, editor,
│                           # visualization, exercises, ui
├── features/
│   ├── execution/          # worker client, frame types, run/step state
│   ├── visualization/      # frame → view model, broadcasting rules
│   ├── validation/
│   └── progress/
├── data/                   # curriculum, lessons, exercises (content only)
├── lib/                    # storage, utils
└── workers/
    └── python.worker.ts    # Pyodide + the Python instrumentation script
```

Principles: content separate from UI; execution separate from visualization; validation
rules separate from content; no giant components; no global state without need; no
abstraction built "for later".

### Execution frame contract

```ts
type Values = number | string | boolean | Values[];

interface ArraySnapshot {
  shape: number[];
  dtype: string;
  values: Values;
  truncated: boolean;
}

interface VariableSnapshot {
  name: string;
  type: string;
  array?: ArraySnapshot;
  repr?: string; // non-array values
}

interface OperationStep {
  operator: "+" | "-" | "*" | "/";
  left: ArraySnapshot;
  right: ArraySnapshot;
  result?: ArraySnapshot; // absent when this step failed
}

interface ExecutionFrame {
  index: number;
  startLine: number;
  endLine: number;
  source: string;
  operationType: "import" | "assign" | "expression" | "binary-op" | "not-visualised";
  targetName?: string;
  operations: OperationStep[]; // ordered sub-steps for the animation
  variables: VariableSnapshot[];
  stdout: string;
  status: "success" | "error";
  error?: {
    type: string;
    message: string;
    operandShapes?: number[][];
  };
}
```

Extend it if needed; do not weaken it. No `any`.

---
