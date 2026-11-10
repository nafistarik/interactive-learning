"use client";

import type { UfuncStep } from "@/features/execution/frames";
import { formatValue } from "@/features/visualization/operations";
import { useCycle } from "@/features/visualization/use-cycle";

import { ArrayGrid, formatShape } from "./ArrayGrid";

/** Time each element stays highlighted at 1×. */
const ELEMENT_MS = 700;

/** What each function does, in words. */
const MEANING: Record<UfuncStep["fn"], string> = {
  exp: "e raised to each value",
  log: "the natural logarithm of each value",
  sqrt: "the square root of each value",
  abs: "each value without its sign",
  square: "each value times itself",
  tanh: "the hyperbolic tangent of each value, between -1 and 1",
  sign: "-1, 0 or 1 for each value's sign",
};

/**
 * An element-wise NumPy function (R3): input and result, one element at a time lit in both,
 * with its recorded value pair. Click a result cell to pick one.
 *
 * @param props.step - The recorded ufunc step.
 * @param props.phase - The stage to show.
 * @param props.failureMessage - NumPy's error when the step failed, else `null`.
 * @param props.playing - Whether the highlight may advance on its own.
 * @param props.speed - Playback speed.
 */
export function UfuncView({
  step,
  phase,
  failureMessage,
  playing,
  speed,
}: {
  step: UfuncStep;
  phase: "operands" | "result";
  failureMessage: string | null;
  playing: boolean;
  speed: number;
}) {
  const values = Array.isArray(step.input.values) ? step.input.values.flat(3) : [step.input.values];
  const results = step.result && Array.isArray(step.result.values) ? step.result.values.flat(3) : step.result ? [step.result.values] : [];
  const size = Math.min(values.length, results.length);
  const [cell, select] = useCycle(size, phase === "result" && playing, ELEMENT_MS / speed);
  const mark = Array.from({ length: size }, (_, index) => (index === cell ? 1 : 0));

  return (
    <div className="grid gap-3">
      <p className="font-mono text-sm">
        np.{step.fn}({step.inputName ?? "…"}) on shape {formatShape(step.input.shape)}
      </p>
      <p className="text-sm text-muted">np.{step.fn} gives {MEANING[step.fn]}, element by element.</p>
      {phase === "operands" ? <ArrayGrid label="input" snapshot={step.input} tone="input" /> : null}
      {phase === "result" ? (
        step.result ? (
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <ArrayGrid label="input" snapshot={step.input} tone="input" highlight={step.input.shape.length ? mark : undefined} />
              <ArrayGrid
                label="result"
                snapshot={step.result}
                tone="result"
                highlight={step.result.shape.length ? mark : undefined}
                onCellClick={step.result.shape.length ? select : undefined}
              />
            </div>
            {size ? (
              <p className="font-mono text-sm" aria-live="polite">
                {step.fn}({formatValue(values[cell])}) = {formatValue(results[cell])}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-danger">No result: this operation stopped here. {failureMessage ?? ""}</p>
        )
      ) : null}
    </div>
  );
}
