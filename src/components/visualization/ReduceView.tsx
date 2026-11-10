"use client";

import type { ReduceStep } from "@/features/execution/frames";
import { reductionGroups } from "@/features/visualization/operations";
import { useCycle } from "@/features/visualization/use-cycle";

import { ArrayGrid, formatShape } from "./ArrayGrid";

/** Time each group stays highlighted at 1×. */
const GROUP_MS = 1100;

/** The view's stage. */
export type ReducePhase = "operands" | "align" | "result";

/** What each reduction does, in words. */
const VERB: Record<ReduceStep["fn"], string> = {
  sum: "adds up",
  mean: "averages",
  max: "keeps the largest of",
  min: "keeps the smallest of",
  std: "measures the spread of",
};

/**
 * Explains which way an axis collapses, for 1D and 2D inputs; generic text otherwise.
 *
 * @param step - The reduction.
 * @returns A short sentence.
 */
function axisSentence(step: ReduceStep): string {
  const ndim = step.input.shape.length;
  if (step.axis === null) {
    return `No axis: ${step.fn} ${VERB[step.fn]} every element and gives one number.`;
  }
  const axis = step.axis < 0 ? step.axis + ndim : step.axis;
  if (ndim === 2 && axis === 0) {
    return `axis=0 runs down the rows: ${step.fn} ${VERB[step.fn]} each column, one result per column.`;
  }
  if (ndim === 2 && axis === 1) {
    return `axis=1 runs across the columns: ${step.fn} ${VERB[step.fn]} each row, one result per row.`;
  }
  return `axis=${step.axis} disappears: ${step.fn} ${VERB[step.fn]} the values along it.`;
}

/**
 * A reduction (R2 brief): the input, which cells collapse together for the axis, then the
 * result. Groups light up one by one in input and result; click a result cell to pick one.
 *
 * @param props.step - The recorded reduce step.
 * @param props.phase - The stage to show.
 * @param props.failureMessage - NumPy's error when the step failed, else `null`.
 * @param props.playing - Whether groups may advance on their own.
 * @param props.speed - Playback speed.
 */
export function ReduceView({
  step,
  phase,
  failureMessage,
  playing,
  speed,
}: {
  step: ReduceStep;
  phase: ReducePhase;
  failureMessage: string | null;
  playing: boolean;
  speed: number;
}) {
  const ndim = step.input.shape.length;
  const groups = step.input.truncated ? null : reductionGroups(step.input.shape, step.axis);
  const groupCount = groups ? Math.max(...groups, 0) + 1 : 0;
  const [group, select] = useCycle(groupCount, phase !== "operands" && playing, GROUP_MS / speed);
  const inputMark = groups?.map((value) => (value === group ? 1 : 0));
  const resultSize = step.result ? step.result.shape.reduce((product, n) => product * n, 1) : 0;
  const resultMark = Array.from({ length: resultSize }, (_, index) => (index === group ? 1 : 0));
  const call = `${step.inputName ?? "array"}.${step.fn}(${step.axis === null ? "" : `axis=${step.axis}`}${step.keepdims ? `${step.axis === null ? "" : ", "}keepdims=True` : ""})`;

  return (
    <div className="grid gap-3">
      <p className="font-mono text-sm">
        {call} on shape {formatShape(step.input.shape)}
      </p>

      {phase === "operands" ? <ArrayGrid label="input" snapshot={step.input} tone="input" /> : null}

      {phase !== "operands" ? (
        groups ? (
          <div className="grid gap-2">
            <ArrayGrid label="input: values reduced together" snapshot={step.input} tone="input" highlight={inputMark} />
            <p className="text-sm text-muted">{axisSentence(step)}</p>
            {step.keepdims && step.axis !== null ? (
              <p className="text-sm text-muted">
                keepdims=True keeps axis {step.axis} with size 1, so the result can broadcast back against the input.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-danger">
            axis={step.axis} does not exist: this array has {ndim} ax{ndim === 1 ? "is" : "es"}
            {ndim > 0 ? ` (0 to ${ndim - 1}, or -1 for the last)` : ""}.
          </p>
        )
      ) : null}

      {phase === "result" ? (
        step.result ? (
          <ArrayGrid
            label="result"
            snapshot={step.result}
            tone="result"
            highlight={step.result.shape.length > 0 ? resultMark : undefined}
            onCellClick={step.result.shape.length > 0 ? select : undefined}
          />
        ) : (
          <p className="text-sm text-danger">No result: this operation stopped here. {failureMessage ?? ""}</p>
        )
      ) : null}
    </div>
  );
}
