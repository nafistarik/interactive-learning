"use client";

import type { ReshapeStep } from "@/features/execution/frames";
import { explainReshape, transposeSources } from "@/features/visualization/operations";
import { useCycle } from "@/features/visualization/use-cycle";

import { ArrayGrid, formatShape } from "./ArrayGrid";

/** Time each element stays highlighted at 1×. */
const ELEMENT_MS = 700;

/** The view's stage. */
export type ReshapePhase = "operands" | "result";

/**
 * A reshape or transpose (R2 brief): the input, then the result with one element at a time lit
 * in both, so the learner sees where it went. A reshape keeps row-major order; a transpose swaps
 * row and column. Click a result cell to follow one element.
 *
 * @param props.step - The recorded reshape step.
 * @param props.phase - The stage to show.
 * @param props.failureMessage - NumPy's error when the step failed, else `null`.
 * @param props.playing - Whether the highlight may advance on its own.
 * @param props.speed - Playback speed.
 */
export function ReshapeView({
  step,
  phase,
  failureMessage,
  playing,
  speed,
}: {
  step: ReshapeStep;
  phase: ReshapePhase;
  failureMessage: string | null;
  playing: boolean;
  speed: number;
}) {
  const size = step.input.shape.reduce((product, n) => product * n, 1);
  const traceable = !step.input.truncated && step.result !== undefined && size <= 64;
  const sources = step.fn === "transpose" ? transposeSources(step.input.shape) : null;
  const [cell, select] = useCycle(traceable ? size : 0, phase === "result" && playing, ELEMENT_MS / speed);
  const source = sources ? sources[cell] : cell;
  const inputMark = Array.from({ length: size }, (_, index) => (index === source ? 1 : 0));
  const resultMark = Array.from({ length: size }, (_, index) => (index === cell ? 1 : 0));
  const target = step.result ? formatShape(step.result.shape) : step.requested ? `(${step.requested.join(", ")})` : "?";

  return (
    <div className="grid gap-3">
      <p className="font-mono text-sm">
        {step.fn} {formatShape(step.input.shape)} → {target}
      </p>

      {phase === "operands" ? <ArrayGrid label="input" snapshot={step.input} tone="input" /> : null}

      {phase === "result" ? (
        step.result ? (
          <div className="grid gap-3">
            <p className="text-sm text-muted">
              {step.fn === "transpose"
                ? "Transpose swaps the axes: row i, column j moves to row j, column i."
                : "Reshape keeps the elements in the same row-major order and only changes how they are grouped."}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <ArrayGrid label="input" snapshot={step.input} tone="input" highlight={traceable ? inputMark : undefined} />
              <ArrayGrid
                label="result"
                snapshot={step.result}
                tone="result"
                highlight={traceable ? resultMark : undefined}
                onCellClick={traceable ? select : undefined}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-1 text-sm text-danger">
            <p>{explainReshape(step.input.shape, step.requested)}</p>
            <p>No result: this operation stopped here. {failureMessage ?? ""}</p>
          </div>
        )
      ) : null}
    </div>
  );
}
