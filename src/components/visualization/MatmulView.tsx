"use client";

import type { MatmulStep } from "@/features/execution/frames";
import { numericValues } from "@/features/visualization/broadcast";
import { analyseMatmul, formatValue } from "@/features/visualization/operations";
import { useCycle } from "@/features/visualization/use-cycle";

import { ArrayGrid, formatShape } from "./ArrayGrid";

/** Time each result cell stays highlighted at 1×. */
const CELL_MS = 1100;

/** The view's stage, from the frame's stage list. */
export type MatmulPhase = "operands" | "align" | "result";

/**
 * Shapes of a 1D/2D product as rows × columns, so every operand is a grid: a 1D left is one
 * row, a 1D right is one column.
 */
function asMatrix(shape: number[], side: "left" | "right"): [number, number] {
  if (shape.length === 2) {
    return [shape[0], shape[1]];
  }
  return side === "left" ? [1, shape[0] ?? 1] : [shape[0] ?? 1, 1];
}

/**
 * A matrix product (R2 brief): the operands, the inner-size rule, then each result cell as the
 * dot product of a row of the left and a column of the right. Terms are read from the recorded
 * operands; each value shown as the result is the recorded result. Click a result cell to see
 * its dot product.
 *
 * @param props.step - The recorded matmul step.
 * @param props.phase - The stage to show.
 * @param props.failureMessage - NumPy's error when the step failed, else `null`.
 * @param props.playing - Whether result cells may advance on their own.
 * @param props.speed - Playback speed.
 */
export function MatmulView({
  step,
  phase,
  failureMessage,
  playing,
  speed,
}: {
  step: MatmulStep;
  phase: MatmulPhase;
  failureMessage: string | null;
  playing: boolean;
  speed: number;
}) {
  const analysis = analyseMatmul(step.left.shape, step.right.shape);
  const [rows, inner] = asMatrix(step.left.shape, "left");
  const [, cols] = asMatrix(step.right.shape, "right");
  const left = numericValues(step.left);
  const right = numericValues(step.right);
  const result = step.result ? numericValues(step.result) : null;
  const drawable = step.left.shape.length <= 2 && step.right.shape.length <= 2 && left && right && result;
  const cellCount = drawable ? rows * cols : 0;
  const [cell, select] = useCycle(cellCount, phase === "result" && playing, CELL_MS / speed);
  const row = Math.floor(cell / Math.max(cols, 1));
  const col = cell % Math.max(cols, 1);

  const leftMark = Array.from({ length: rows * inner }, (_, index) => (Math.floor(index / inner) === row ? 1 : 0));
  const rightMark = Array.from({ length: inner * cols }, (_, index) => (index % cols === col ? 1 : 0));
  const resultMark = Array.from({ length: rows * cols }, (_, index) => (index === cell ? 1 : 0));
  const terms = drawable
    ? Array.from({ length: inner }, (_, k) => `${formatValue(left[row * inner + k])}×${formatValue(right[k * cols + col])}`)
    : [];

  return (
    <div className="grid gap-3">
      <p className="font-mono text-sm">
        left {formatShape(step.left.shape)} @ right {formatShape(step.right.shape)}
      </p>

      {phase === "operands" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <ArrayGrid label="left operand" snapshot={step.left} tone="input" />
          <ArrayGrid label="right operand" snapshot={step.right} tone="weight" />
        </div>
      ) : null}

      {phase === "align" || (phase === "result" && !analysis.compatible) ? (
        <div className="grid gap-2 text-sm">
          <p className="font-mono">
            ({rows > 1 || step.left.shape.length === 2 ? `${rows}, ` : ""}
            <span className={analysis.compatible ? "text-success" : "text-danger"}>{inner}</span>) @ (
            <span className={analysis.compatible ? "text-success" : "text-danger"}>{asMatrix(step.right.shape, "right")[0]}</span>
            {step.right.shape.length === 2 ? `, ${cols}` : ""})
            {analysis.resultShape ? ` → ${formatShape(analysis.resultShape)}` : ""}
          </p>
          <p className="text-muted">
            Rule: the left&apos;s last size must equal the right&apos;s first size. The result keeps the left&apos;s
            rows and the right&apos;s columns.
          </p>
          <p className={analysis.compatible ? "text-success" : "text-danger"}>{analysis.reason}</p>
        </div>
      ) : null}

      {phase === "result" ? (
        step.result ? (
          drawable ? (
            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <ArrayGrid label="left: row in use" snapshot={step.left} tone="input" highlight={leftMark} />
                <ArrayGrid label="right: column in use" snapshot={step.right} tone="weight" highlight={rightMark} />
              </div>
              <ArrayGrid label="result" snapshot={step.result} tone="result" highlight={resultMark} onCellClick={select} />
              <p className="font-mono text-sm" aria-live="polite">
                result[{rows > 1 || step.left.shape.length === 2 ? `${row}, ` : ""}
                {col}] = {terms.join(" + ")} = {formatValue(result[cell])}
              </p>
              <p className="text-xs text-subtle">Click a result cell to see its dot product.</p>
            </div>
          ) : (
            <ArrayGrid label="result" snapshot={step.result} tone="result" />
          )
        ) : (
          <p className="text-sm text-danger">No result: this operation stopped here. {failureMessage ?? ""}</p>
        )
      ) : null}
    </div>
  );
}
