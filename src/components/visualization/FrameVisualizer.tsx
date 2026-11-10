"use client";

import { useEffect, useMemo, useState } from "react";

import type { ExecutionFrame } from "@/features/execution/frames";
import { buildStages } from "@/features/visualization/broadcast";
import { usePrefersReducedMotion } from "@/features/visualization/use-reduced-motion";

import { ArrayGrid } from "./ArrayGrid";
import { OperationView } from "./OperationView";

/** Time one stage stays on screen at speed 1×, in milliseconds. */
const STAGE_MS = 1200;

/**
 * Plays one frame's recorded operations as stages: operands, alignment, result for each
 * arithmetic step. Pausing and speed come from the arena. With reduced motion the frame jumps
 * straight to its end state, and nothing moves. Remount the component (change its key) to
 * restart a frame.
 *
 * @param props.frame - The frame to show.
 * @param props.paused - Whether the animation is paused.
 * @param props.speed - Playback speed multiplier.
 */
export function FrameVisualizer({
  frame,
  paused,
  speed,
}: {
  frame: ExecutionFrame;
  paused: boolean;
  speed: number;
}) {
  const stages = useMemo(() => buildStages(frame.operations), [frame.operations]);
  const reducedMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState(0);
  const current = reducedMotion ? stages.length - 1 : stage;
  const atEnd = current >= stages.length - 1;

  useEffect(() => {
    if (reducedMotion || paused || atEnd) {
      return;
    }
    const timer = setTimeout(() => setStage((value) => value + 1), STAGE_MS / speed);
    return () => clearTimeout(timer);
  }, [reducedMotion, paused, atEnd, speed, current]);

  const active = stages[current];
  const operation = active.operation >= 0 ? frame.operations[active.operation] : null;
  const isLastOperation = active.operation === frame.operations.length - 1;
  const failureMessage =
    frame.status === "error" && isLastOperation && operation && !operation.result
      ? frame.error?.message ?? null
      : null;
  const variableArray = frame.targetName
    ? frame.variables.find((variable) => variable.name === frame.targetName)?.array
    : undefined;

  return (
    <div className="grid gap-3">
      {frame.operationType === "not-visualised" ? (
        <p className="text-sm text-muted">{frame.note}</p>
      ) : null}

      {operation ? (
        <>
          <p className="text-xs text-subtle">
            Operation {active.operation + 1} of {frame.operations.length} · stage {current + 1} of{" "}
            {stages.length}
          </p>
          <OperationView
            key={active.operation}
            step={operation}
            phase={active.phase === "show" ? "operands" : active.phase}
            failureMessage={failureMessage}
            playing={!paused && !reducedMotion}
            speed={speed}
          />
        </>
      ) : null}

      {!operation && variableArray && frame.targetName ? (
        <ArrayGrid label={frame.targetName} snapshot={variableArray} tone="result" />
      ) : null}

      {!operation && frame.result?.array ? (
        <ArrayGrid label={frame.result.name} snapshot={frame.result.array} tone="result" />
      ) : null}
    </div>
  );
}
