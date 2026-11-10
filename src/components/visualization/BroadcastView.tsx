import type { OperationStep } from "@/features/execution/frames";
import {
  analyseBroadcast,
  expandValues,
  numericValues,
} from "@/features/visualization/broadcast";

import { ArrayGrid, formatShape } from "./ArrayGrid";

/** The phase of an arithmetic step shown in the view. */
export type BroadcastPhase = "operands" | "align" | "result";

/** Broadcasting rule the alignment stage applies (brief Part 8). */
const RULE =
  "Compare the shapes from the right. Two sizes match when they are equal or one of them is 1. A missing axis counts as 1.";

/**
 * Shows one arithmetic step in three stages: the operands, the right-aligned shape comparison
 * with the rule that decided it, and the expanded operand with the element-wise result. Every
 * number comes from the recorded frame.
 *
 * @param props.step - The arithmetic step to show.
 * @param props.phase - The stage to show.
 * @param props.failureMessage - The error of the run when this step failed, else `null`.
 */
export function BroadcastView({
  step,
  phase,
  failureMessage,
}: {
  step: OperationStep;
  phase: BroadcastPhase;
  failureMessage: string | null;
}) {
  const analysis = analyseBroadcast(step.left.shape, step.right.shape);
  const rightValues = numericValues(step.right);
  const expanded =
    analysis.resultShape && rightValues
      ? expandValues(rightValues, step.right.shape, analysis.resultShape)
      : null;

  return (
    <div className="grid gap-3">
      <p className="font-mono text-sm">
        left {formatShape(step.left.shape)} {step.operator} right {formatShape(step.right.shape)}
      </p>

      {phase === "operands" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <ArrayGrid label="left operand" snapshot={step.left} tone="input" />
          <ArrayGrid label="right operand" snapshot={step.right} tone="weight" />
        </div>
      ) : null}

      {phase === "align" ? (
        <div className="grid gap-3">
          <table className="w-full text-sm">
            <thead className="text-left text-subtle">
              <tr>
                <th className="py-1 font-medium">axis (from right)</th>
                <th className="py-1 font-medium">left</th>
                <th className="py-1 font-medium">right</th>
                <th className="py-1 font-medium">verdict</th>
              </tr>
            </thead>
            <tbody>
              {analysis.checks.map((check) => (
                <tr
                  key={check.fromRight}
                  className={check.ok ? "" : "text-danger"}
                >
                  <td className="py-1 font-mono">{check.fromRight}</td>
                  <td className="py-1 font-mono">{check.left ?? "missing"}</td>
                  <td className="py-1 font-mono">{check.right ?? "missing"}</td>
                  <td className="py-1">{check.ok ? "compatible" : "not compatible"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm text-muted">{RULE}</p>
          {analysis.compatible && analysis.resultShape ? (
            <p className="text-sm text-success">
              Compatible. The result has shape {formatShape(analysis.resultShape)}.
            </p>
          ) : analysis.failedAt ? (
            <p className="text-sm text-danger">
              Not compatible at axis {analysis.failedAt.fromRight} from the right: {analysis.failedAt.left} and{" "}
              {analysis.failedAt.right} are different and neither is 1, so the shapes cannot be
              broadcast.
            </p>
          ) : null}
        </div>
      ) : null}

      {phase === "result" ? (
        <div className="grid gap-3">
          {analysis.resultShape && expanded ? (
            <ArrayGrid
              label="right operand, stretched to the result shape"
              snapshot={{
                shape: analysis.resultShape,
                dtype: step.right.dtype,
                values: expanded,
                truncated: false,
              }}
              tone="weight"
            />
          ) : analysis.resultShape ? (
            <p className="text-sm text-subtle">
              The right operand is too large to stretch here; only its first 64 values were recorded.
            </p>
          ) : null}
          {step.result ? (
            <ArrayGrid label="result" snapshot={step.result} tone="result" />
          ) : (
            <p className="text-sm text-danger">
              No result: this operation stopped here. {failureMessage ?? ""}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
